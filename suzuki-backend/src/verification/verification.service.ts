import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../chat/gemini.service';
import { COMPTOIR_REDIRECT_MESSAGE } from '../constants/business-rules.constants';
import { normalizeVinText, pickBestVehicleRow, vinLookupVariants } from '../chat/chat/vehicle-lookup';

export interface UploadedDocument {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

const OCR_SOURCE_LABEL = 'Gemini 2.5-flash';
const RATE_WINDOW_DAYS = 15;
const RATE_WINDOW_MS = RATE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
const VIN_LOOKUP_WINDOW_MS = 60_000;
const VIN_LOOKUP_PRUNE_THRESHOLD = 5_000;
const DEFAULT_VIN_LOOKUPS_PER_MINUTE = 20;
const VIN_PATTERN = /^[A-Z0-9]{17}$/;

const GENERIC_ERROR = 'Erreur lors de la vérification. Veuillez réessayer.';
const OCR_ERROR_MESSAGES = new Map<string, string>([
  ['INVALID_BRAND', 'Seules les cartes grises Suzuki sont acceptées.'],
  ['OCR_FAILED', 'Impossible de lire le document. Veuillez utiliser une image plus claire.'],
  ['GEMINI_AUTH_FAILED', 'Le service de vérification est mal configuré. Contactez l’administrateur.'],
  ['GEMINI_QUOTA_EXCEEDED', 'Le service de vérification est temporairement indisponible. Veuillez réessayer plus tard.'],
]);

const VEHICLE_SELECT = {
  id: true,
  vin: true,
  vehicleNo: true,
  marque: true,
  modele: true,
  modeleDescription: true,
  typeCode: true,
  immatriculation: true,
} as const;

function readNonNegativeInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly vinLookups = new Map<string, { count: number; resetAt: number }>();

  /** 0 = limit disabled. Set in production (the previous hard-coded value was 3). */
  private readonly ipUploadLimit: number;
  private readonly carteGriseLimit: number;
  private readonly vinLookupsPerMinute: number;
  private readonly showDebug: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    config: ConfigService,
  ) {
    this.ipUploadLimit = readNonNegativeInt(config.get('UPLOAD_LIMIT_PER_15_DAYS'), 0);
    this.carteGriseLimit = readNonNegativeInt(config.get('CARTE_GRISE_LIMIT_PER_15_DAYS'), 0);
    this.vinLookupsPerMinute = readNonNegativeInt(config.get('VIN_LOOKUPS_PER_MINUTE'), DEFAULT_VIN_LOOKUPS_PER_MINUTE);
    this.showDebug = config.get('NODE_ENV') !== 'production';
  }

  // ─────────────────────────────────────────────────────────────────
  // Manual VIN entry
  // ─────────────────────────────────────────────────────────────────
  async verifyVin(rawVin: string, userIp?: string) {
    if (userIp && !this.allowVinLookup(userIp)) {
      return {
        success: false,
        limitReached: true,
        message: 'Trop de tentatives. Veuillez patienter une minute avant de réessayer.',
      };
    }

    const vin = normalizeVinText(rawVin);
    if (!VIN_PATTERN.test(vin)) {
      return {
        success: false,
        message: 'Le VIN doit contenir exactement 17 caractères alphanumériques.',
      };
    }

    const vehicle = await this.findVehicleByVin(vin);
    if (!vehicle) {
      return {
        success: false,
        message: 'Ce VIN ne correspond pas à un véhicule Suzuki enregistré.',
      };
    }

    const typeCode = String(vehicle.typeCode ?? '').trim();
    if (!typeCode) {
      return {
        success: false,
        message: `Le VIN est reconnu, mais le code modèle associé n'est pas renseigné. ${COMPTOIR_REDIRECT_MESSAGE}.`,
        vehicleInfo: { vin: vehicle.vin ?? vin, vehicleNo: vehicle.vehicleNo, marque: vehicle.marque ?? 'SUZUKI', modele: vehicle.modele ?? vehicle.modeleDescription ?? '', typeCode: null },
      };
    }

    return {
      success: true,
      vehicleInfo: {
        vin: vehicle.vin ?? vin,
        vehicleNo: vehicle.vehicleNo,
        marque: vehicle.marque ?? 'SUZUKI',
        modele: vehicle.modele ?? vehicle.modeleDescription ?? '',
        modeleDescription: vehicle.modeleDescription ?? '',
        // Same shape as the carte grise flow: the model code comes from the same DB row.
        typeCode,
        immatriculation: vehicle.immatriculation ?? '',
        vinValidated: true,
        source: 'VIN direct',
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // Carte grise upload (OCR)
  // ─────────────────────────────────────────────────────────────────
  async verifyDocument(file: UploadedDocument, userIp?: string) {
    const startedAt = Date.now();
    this.logger.log(`Processing upload — ${file.mimetype}, ${(file.size / 1024).toFixed(1)} KB`);

    try {
      const uploadCount = userIp ? await this.countRecentUploads(userIp) : 0;
      if (userIp && this.ipUploadLimit > 0 && uploadCount >= this.ipUploadLimit) {
        return {
          success: false,
          message: `Limite atteinte. Vous avez déjà téléchargé ${this.ipUploadLimit} cartes grises ces ${RATE_WINDOW_DAYS} derniers jours.`,
          uploadCount,
          limitReached: true,
        };
      }

      const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const extracted = await this.gemini.extractVehicleInfo(imageBase64, file.mimetype);

      const vehicleInfo: Record<string, any> = {
        ...extracted,
        source: OCR_SOURCE_LABEL,
      };

      await this.enrichFromVin(vehicleInfo);

      if (!vehicleInfo.vin) {
        return {
          success: false,
          message: `Le VIN n'a pas pu être lu sur la carte grise. ${COMPTOIR_REDIRECT_MESSAGE}.`,
          uploadCount,
        };
      }
      if (!vehicleInfo.vinValidated) {
        return {
          success: false,
          message: `Le VIN lu n'est pas enregistré dans la base véhicules. ${COMPTOIR_REDIRECT_MESSAGE}.`,
          uploadCount,
          vehicleInfo,
        };
      }
      vehicleInfo.typeCode = String(vehicleInfo.typeCode ?? '').trim();
      if (!vehicleInfo.typeCode) {
        return {
          success: false,
          message: `Le VIN est reconnu, mais le code modèle associé n'est pas renseigné. ${COMPTOIR_REDIRECT_MESSAGE}.`,
          uploadCount,
          vehicleInfo,
        };
      }

      if (
        vehicleInfo.immatriculation &&
        this.carteGriseLimit > 0 &&
        (await this.countRecentCarteGriseUploads(vehicleInfo.immatriculation)) >= this.carteGriseLimit
      ) {
        return {
          success: false,
          message: `Cette carte grise (${vehicleInfo.immatriculation}) a déjà été téléchargée ${this.carteGriseLimit} fois ces ${RATE_WINDOW_DAYS} derniers jours.`,
          uploadCount,
          limitReached: true,
          limitType: 'carte_grise',
        };
      }

      // Non-blocking: every successful upload counts toward the per-IP limit.
      if (userIp) void this.trackUpload(userIp, vehicleInfo);

      return {
        success: true,
        vehicleInfo,
        uploadCount,
        ...(this.showDebug
          ? {
              debug: {
                processingTime: `${Date.now() - startedAt}ms`,
                fileSize: `${(file.size / 1024).toFixed(2)} KB`,
                confidence: vehicleInfo.confidence,
                model: OCR_SOURCE_LABEL,
              },
            }
          : {}),
      };
    } catch (error: any) {
      this.logger.warn(`Carte grise verification failed: ${error?.message ?? error}`);
      return {
        success: false,
        message: OCR_ERROR_MESSAGES.get(error?.message) ?? GENERIC_ERROR,
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────

  /**
   * One VIN lookup for both flows: case-insensitive, tolerant to the usual OCR
   * confusions, and deterministic when several rows share the VIN.
   */
  private async findVehicleByVin(vin: string) {
    const rows = await this.prisma.vehicle.findMany({
      where: { OR: vinLookupVariants(vin).map((variant) => ({ vin: { equals: variant, mode: 'insensitive' as const } })) },
      select: VEHICLE_SELECT,
    });
    return pickBestVehicleRow(rows);
  }

  /** Completes the OCR result with the database row of the read VIN (model code, plate number, canonical VIN). */
  private async enrichFromVin(vehicleInfo: Record<string, any>): Promise<void> {
    const ocrVin = normalizeVinText(vehicleInfo.vin);
    if (!ocrVin) return;

    const dbVehicle = await this.findVehicleByVin(ocrVin);
    if (!dbVehicle) {
      // Not found: still allowed (new vehicle?), but the search will not get a real model code.
      vehicleInfo.vin = ocrVin;
      vehicleInfo.vinValidated = false;
      this.logger.log('VIN read by OCR is not in the vehicles table');
      return;
    }

    vehicleInfo.vin = dbVehicle.vin ?? ocrVin;
    vehicleInfo.marque = dbVehicle.marque || vehicleInfo.marque;
    vehicleInfo.modele = dbVehicle.modele || vehicleInfo.modele;
    vehicleInfo.modeleDescription = dbVehicle.modeleDescription || vehicleInfo.modeleDescription;
    vehicleInfo.typeCode = dbVehicle.typeCode;
    vehicleInfo.vehicleNo = dbVehicle.vehicleNo;
    vehicleInfo.vinValidated = true;
  }

  /** Per-IP throttle on manual VIN entry: the endpoint must not become a VIN → plate oracle. */
  private allowVinLookup(ip: string): boolean {
    if (this.vinLookupsPerMinute === 0) return true;
    const now = Date.now();
    if (this.vinLookups.size > VIN_LOOKUP_PRUNE_THRESHOLD) {
      for (const [key, entry] of this.vinLookups) if (now > entry.resetAt) this.vinLookups.delete(key);
    }

    const entry = this.vinLookups.get(ip);
    if (!entry || now > entry.resetAt) {
      this.vinLookups.set(ip, { count: 1, resetAt: now + VIN_LOOKUP_WINDOW_MS });
      return true;
    }
    if (entry.count >= this.vinLookupsPerMinute) return false;
    entry.count++;
    return true;
  }

  private async countRecentUploads(userIp: string): Promise<number> {
    try {
      return await this.prisma.uploadTracking.count({
        where: { userIp, uploadedAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) }, success: true },
      });
    } catch (error: any) {
      this.logger.error(`Failed to count recent uploads: ${error?.message}`);
      return 0;
    }
  }

  private async countRecentCarteGriseUploads(immatriculation: string): Promise<number> {
    try {
      return await this.prisma.uploadTracking.count({
        where: {
          vehicleInfo: { path: ['immatriculation'], equals: immatriculation },
          uploadedAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) },
          success: true,
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to count carte grise uploads: ${error?.message}`);
      return 0;
    }
  }

  /** Never throws: tracking must not block the customer. */
  private async trackUpload(userIp: string, vehicleInfo: Record<string, any>): Promise<void> {
    try {
      await this.prisma.uploadTracking.create({ data: { userIp, success: true, vehicleInfo } });
    } catch (error: any) {
      this.logger.error(`Failed to track upload: ${error?.message}`);
    }
  }
}