// ═══════════════════════════════════════════════════════════════════
// Stock service: availability, quantities and display data per reference.
//
// Business rules (CarPro emails 2026-09-11/18):
//   - a part is "Disponible" only when consolidated stock >= 2
//     (rule lives in constants/business-rules.constants.ts)
//   - the public price is prix_ttc of 01_PROD rows only; 02_CARPRO rows
//     are wholesale and are never exposed as a price
//   - missing consolidated stock is "Inconnue" and must be redirected
//
// Lookups start from `parts`, not `stock`: parts without a stock row still
// have a name and a price and must not be reported as unknown references.
// Raw quantities are returned here for internal callers; the controller
// decides what is exposed publicly.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  hasKnownStock,
  isQuantityAvailable,
  PUBLIC_PRICE_SOURCE,
} from '../constants/business-rules.constants';

export type StockAvailability = 'Disponible' | 'Indisponible' | 'Inconnue';

export interface StockStatusResult {
  reference: string;
  statut: StockAvailability;
  totalQuantity: number;
  stockDisponible: number;
  stockConsolide: number;
  /** false = no stock row / no consolidated value: callers must redirect, not say "Indisponible". */
  stockKnown: boolean;
  /** designation_2 (French) first, English OEM designation as fallback, reference as last resort. */
  displayName: string;
  designation: string | null;
  designation2: string | null;
  source: string | null;
  /** 'Suzuki OEM' | 'CarPro Parts' */
  sourceLabel: string | null;
  prixHt: string | null;
  /** Public price only (01_PROD); null for wholesale rows. */
  prixTtc: string | null;
  categorie: string | null;
}

export interface BulkStockEntry {
  statut: StockAvailability;
  totalQuantity: number;
  stockDisponible: number;
  stockConsolide: number;
  stockKnown: boolean;
  displayName: string;
}

const PART_WITH_STOCK_SELECT = {
  reference: true,
  designation: true,
  designation2: true,
  prixHt: true,
  prixTtc: true,
  categorie: true,
  source: true,
  stock: {
    select: {
      totalQuantity: true,
      stockDisponible: true,
      stockConsolide: true,
    },
  },
} as const;

type PartWithStock = Prisma.PartGetPayload<{ select: typeof PART_WITH_STOCK_SELECT }>;

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Always returns a status; missing stock is explicitly marked unknown. */
  async getStockStatus(reference: string): Promise<StockStatusResult> {
    const part = await this.prisma.part.findUnique({
      where: { reference },
      select: PART_WITH_STOCK_SELECT,
    });
    if (!part) {
      this.logger.debug(`Unknown reference requested: ${reference}`);
      return this.unknownResult(reference);
    }
    return this.buildResult(part);
  }

  /** null when the part does not exist at all. */
  async getStockWithPart(reference: string): Promise<StockStatusResult | null> {
    const part = await this.prisma.part.findUnique({
      where: { reference },
      select: PART_WITH_STOCK_SELECT,
    });
    return part ? this.buildResult(part) : null;
  }

  /**
   * One query for many references (no N+1). References are trimmed, uppercased
   * and deduplicated; every requested reference is present in the result,
  * unknown ones with the safe "Inconnue" status.
   */
  async getBulkStockStatus(references: string[]): Promise<Map<string, BulkStockEntry>> {
    const unique = [...new Set(references.map((ref) => ref.trim().toUpperCase()).filter(Boolean))];
    if (unique.length === 0) return new Map();

    const parts = await this.prisma.part.findMany({
      where: { reference: { in: unique } },
      select: PART_WITH_STOCK_SELECT,
    });

    const entries = new Map<string, BulkStockEntry>(
      unique.map((ref): [string, BulkStockEntry] => [ref, this.unknownEntry(ref)]),
    );
    for (const part of parts) {
      entries.set(part.reference, this.toBulkEntry(this.buildResult(part)));
    }

    const unknown = unique.length - parts.length;
    if (unknown > 0) this.logger.debug(`Bulk stock lookup: ${unknown}/${unique.length} unknown reference(s)`);
    return entries;
  }

  // ─────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────

  private buildResult(part: PartWithStock): StockStatusResult {
    // Availability is decided by stock_consolide only (no fallback to total_quantity).
    // A missing stock row is UNKNOWN (stockKnown=false), never a real zero.
    const stockKnown = hasKnownStock(part.stock);
    const stockConsolide = stockKnown ? Number(part.stock!.stockConsolide) : 0;
    return {
      stockKnown,
      reference: part.reference,
      statut: stockKnown ? this.availabilityOf(stockConsolide) : 'Inconnue',
      totalQuantity: Number(part.stock?.totalQuantity ?? 0),
      stockDisponible: Number(part.stock?.stockDisponible ?? 0),
      stockConsolide,
      displayName: this.resolveDisplayName(part) || part.reference,
      designation: part.designation ?? null,
      designation2: part.designation2 ?? null,
      source: part.source ?? null,
      sourceLabel: this.resolveSourceLabel(part.source),
      prixHt: part.prixHt != null ? String(part.prixHt) : null,
      prixTtc: part.source === PUBLIC_PRICE_SOURCE && part.prixTtc != null ? String(part.prixTtc) : null,
      categorie: part.categorie ?? null,
    };
  }

  private unknownResult(reference: string): StockStatusResult {
    return {
      reference,
      statut: 'Inconnue',
      totalQuantity: 0,
      stockDisponible: 0,
      stockConsolide: 0,
      stockKnown: false,
      displayName: reference,
      designation: null,
      designation2: null,
      source: null,
      sourceLabel: null,
      prixHt: null,
      prixTtc: null,
      categorie: null,
    };
  }

  private unknownEntry(reference: string): BulkStockEntry {
    return this.toBulkEntry(this.unknownResult(reference));
  }

  private toBulkEntry(result: StockStatusResult): BulkStockEntry {
    return {
      statut: result.statut,
      totalQuantity: result.totalQuantity,
      stockDisponible: result.stockDisponible,
      stockConsolide: result.stockConsolide,
      stockKnown: result.stockKnown,
      displayName: result.displayName,
    };
  }

  /** French name first, English OEM name as fallback. */
  private resolveDisplayName(part: Pick<PartWithStock, 'designation' | 'designation2'>): string {
    const french = (part.designation2 ?? '').trim();
    return french.length > 0 ? french : (part.designation ?? '').trim();
  }

  private resolveSourceLabel(source: string | null | undefined): string | null {
    if (!source) return null;
    if (source === '01_PROD') return 'Suzuki OEM';
    if (source === '02_CARPRO') return 'CarPro Parts';
    return source;
  }

  private availabilityOf(stockConsolide: number): StockAvailability {
    return isQuantityAvailable(stockConsolide) ? 'Disponible' : 'Indisponible';
  }
}