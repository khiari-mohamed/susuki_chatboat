// src/constants/vehicle-models.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: hasModelInDesignation() now checks BOTH designation_2
//         (French primary field) AND designation (English OEM).
//         Previously only the English field was checked, so parts
//         that store model names only in designation_2 were treated
//         as "universal" parts and shown to all vehicle types.
//
// FIX-2: matchesModel() now also checks designation_2 for the model
//         name so model-specific French-named parts are correctly
//         matched to the user's vehicle.
//
// FIX-3: getCombinedDesignation() helper centralises the two-field
//         concatenation used by FIX-1 and FIX-2.
//
// FIX-4: MODEL_ALIASES extended with FRONX and DZIRE variants that
//         appear in the database but were missing from the alias map.
//
// FIX-5: normalize() now also strips the SPRESSO/S-PRESSO hyphen
//         variant using the existing alias logic, so downstream code
//         that calls normalize() gets a consistent result regardless
//         of which spelling the vehicle_info JSON uses.
//
// NOTE:  loadModels() and all DB-loading logic are unchanged —
//        the model list is still sourced from the vehicles table.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// FIX-4: Extended alias map — added FRONX, DZIRE, BALENO variants
export const MODEL_ALIASES: Record<string, string> = {
  // Original aliases
  'NEW CIAZ':              'CIAZ',
  'NEW CELERIO POP 6AB':   'CELERIO',
  'SWIFT IV':              'SWIFT',
  'JIMNY 5D AT':           'JIMNY',
  'SPRESSO':               'S-PRESSO',
  'S PRESSO':              'S-PRESSO',
  'WAGONR':                'WAGON R',
  'WAGON-R':               'WAGON R',
  // FIX-4: Additional variants found in the vehicles table
  'NEW CELERIO':           'CELERIO',
  'NEW SWIFT':             'SWIFT',
  'SWIFT 4':               'SWIFT',
  'NEW BALENO':            'BALENO',
  'BALENO 2':              'BALENO',
  'NEW DZIRE':             'DZIRE',
  'DZIRE 2':               'DZIRE',
  'NEW FRONX':             'FRONX',
};

@Injectable()
export class VehicleModelsService implements OnModuleInit {
  private readonly logger = new Logger(VehicleModelsService.name);
  private models:    string[]      = [];
  private modelsSet: Set<string>   = new Set();

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadModels();
  }

  private async loadModels() {
    try {
      const rows = await this.prisma.vehicle.findMany({
        select:   { modele: true },
        distinct: ['modele'],
        where:    {
          modele: { not: null },
          marque: { equals: 'SUZUKI', mode: 'insensitive' },
        },
      });

      this.models = rows
        .map((r) => r.modele?.toUpperCase().trim())
        .filter((m): m is string => !!m)
        .sort();

      this.modelsSet = new Set(this.models);

      this.logger.log(
        `✅ Loaded ${this.models.length} Suzuki models from database: ${this.models.join(', ')}`,
      );
    } catch (error) {
      this.logger.error('❌ Failed to load vehicle models from database:', error);
      this.models    = ['CELERIO', 'CIAZ', 'SWIFT', 'S-PRESSO', 'BALENO', 'VITARA', 'JIMNY', 'IGNIS', 'DZIRE', 'FRONX'];
      this.modelsSet = new Set(this.models);
      this.logger.warn(`⚠️ Using fallback model list: ${this.models.join(', ')}`);
    }
  }

  getAll(): string[] {
    return [...this.models];
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: normalize() — now uses alias map for all variants including
  //         new FIX-4 entries, and handles stripped-hyphen comparisons.
  // ─────────────────────────────────────────────────────────────────
  normalize(model?: string): string | null {
    if (!model) return null;
    const upper = model.toUpperCase().trim();

    // Check aliases first (FIX-4: extended alias map)
    if (MODEL_ALIASES[upper]) return MODEL_ALIASES[upper];

    // Exact match
    if (this.modelsSet.has(upper)) return upper;

    // Stripped-hyphen comparison (e.g. "SPRESSO" matches "S-PRESSO")
    for (const m of this.models) {
      if (m.replace(/[-\s]/g, '') === upper.replace(/[-\s]/g, '')) return m;
    }

    // Alias stripped-hyphen comparison
    for (const [alias, canonical] of Object.entries(MODEL_ALIASES)) {
      if (alias.replace(/[-\s]/g, '') === upper.replace(/[-\s]/g, '')) return canonical;
    }

    return null;
  }

  exists(model: string): boolean {
    return this.normalize(model) !== null;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: Helper — combine both text fields for model checks
  // ─────────────────────────────────────────────────────────────────
  private getCombinedDesignation(part: any): string {
    const french  = (part?.designation2 ?? part?.designation_2 ?? '').trim();
    const english = (part?.designation  ?? '').trim();
    if (french.toLowerCase() === english.toLowerCase()) return french.toUpperCase();
    return `${french} ${english}`.toUpperCase();
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: hasModelInDesignation — checks BOTH fields.
  //
  // Accepts either a raw designation string (original call signature)
  // OR a part object (new call signature when full part is available).
  // ─────────────────────────────────────────────────────────────────
  hasModelInDesignation(designationOrPart: string | any): boolean {
    let upper: string;

    if (typeof designationOrPart === 'string') {
      // Original call: only English designation string passed in
      upper = designationOrPart.toUpperCase();
    } else {
      // FIX-1: part object — check both fields
      upper = this.getCombinedDesignation(designationOrPart);
    }

    // SPRESSO without hyphen — always treat as a model name
    if (upper.includes('SPRESSO')) return true;

    return this.models.some((model) => upper.includes(model));
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: matchesModel — checks BOTH fields.
  //
  // Accepts either a raw designation string OR a part object.
  // ─────────────────────────────────────────────────────────────────
  matchesModel(designationOrPart: string | any, model: string): boolean {
    let upper: string;

    if (typeof designationOrPart === 'string') {
      upper = designationOrPart.toUpperCase();
    } else {
      // FIX-2: part object — combine both fields
      upper = this.getCombinedDesignation(designationOrPart);
    }

    const modelUpper = model.toUpperCase();

    // S-PRESSO / SPRESSO normalization
    if (modelUpper === 'S-PRESSO' || modelUpper === 'SPRESSO') {
      return upper.includes('SPRESSO') || upper.includes('S-PRESSO');
    }

    return upper.includes(modelUpper);
  }

  // ─────────────────────────────────────────────────────────────────
  // detectModelInText — unchanged logic, uses extended alias map
  // ─────────────────────────────────────────────────────────────────
  detectModelInText(text: string): string | null {
    const normalizedText = this.normalizeTextForModelDetection(text);

    // SPRESSO variants
    if (
      this.containsExplicitModel(normalizedText, 'SPRESSO') ||
      this.containsExplicitModel(normalizedText, 'S-PRESSO')
    ) {
      return 'S-PRESSO';
    }

    // Aliases (FIX-4: extended)
    for (const [alias, canonical] of Object.entries(MODEL_ALIASES)) {
      if (this.containsExplicitModel(normalizedText, alias)) return canonical;
    }

    // Exact models
    for (const model of this.models) {
      if (this.containsExplicitModel(normalizedText, model)) return model;
    }

    return null;
  }

  private containsExplicitModel(normalizedText: string, model: string): boolean {
    const normalizedModel = this.normalizeTextForModelDetection(model);
    if (!normalizedModel) return false;

    const modelTokens = normalizedModel.split(' ').filter(Boolean);
    if (modelTokens.length === 0) return false;

    // Avoid false positives from short codes like "S" inside part names
    if (modelTokens.length === 1 && modelTokens[0].length < 3) return false;

    const pattern = modelTokens
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('\\s+');

    return new RegExp(`(^|\\s)${pattern}(\\s|$)`).test(normalizedText);
  }

  private normalizeTextForModelDetection(text: string): string {
    return (text || '')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async reload(): Promise<void> {
    await this.loadModels();
  }
}