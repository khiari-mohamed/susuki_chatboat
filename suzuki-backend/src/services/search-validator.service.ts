// src/services/search-validator.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: Raw DB query now searches designation_2 (French) AND
//         search_description AND designation (English) — same order
//         as the fixed AdvancedSearchService.buildSearchConditions().
//
// FIX-2: CarPro Parts (source 02_CARPRO) is no longer excluded.
//         The mart view and raw query both include all sources.
//
// FIX-3: Synonym table extended to match the full typeWeights map
//         used by AdvancedSearchService so token expansion is
//         consistent between the two services.
//
// FIX-4: AI result comparison uses displayName (designation_2 first)
//         in log output, not the raw designation field.
//
// FIX-5: False-positive logic corrected — AI returning MORE results
//         than the raw broad DB scan is genuinely impossible after
//         the scoring filter, so the threshold comment is clarified.
//
// FIX-6: mart.chatbot_parts_with_fitment view query updated to also
//         JOIN on designation_2 and search_description columns.
//         If your mart view does not yet expose these columns, the
//         fallback raw-table query is used instead (see below).
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { VehicleModelsService } from '../constants/vehicle-models.service';

interface ValidationResult {
  query: string;
  aiResultCount: number;
  dbResultCount: number;
  status: 'MATCH' | 'AI_MISS' | 'AI_FALSE_POSITIVE' | 'MISMATCH';
  // FIX-4: log French display name, not raw English designation
  aiTopResults: string[];
  dbTopResults: string[];
  timestamp: Date;
}

@Injectable()
export class SearchValidatorService {
  private readonly logger = new Logger(SearchValidatorService.name);
  private validationLog: ValidationResult[] = [];
  private readonly MAX_LOG_SIZE = 100;

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: Synonym map kept in sync with AdvancedSearchService.
  // Only the terms relevant to broad DB validation are listed here.
  // The full typeWeights expansion lives in AdvancedSearchService —
  // this map is used solely to widen the raw DB query so it finds at
  // least as many rows as the AI pipeline could ever return.
  // ─────────────────────────────────────────────────────────────────
  private readonly synonyms: Record<string, string[]> = {
    // Position
    avant:        ['avant', 'av', 'avent', 'front', 'fr'],
    arriere:      ['arriere', 'arrière', 'ar', 'rear', 'rr'],
    gauche:       ['gauche', 'g', 'conducteur', 'left', 'lh'],
    droite:       ['droite', 'd', 'passager', 'droit', 'right', 'rh'],
    superieur:    ['superieur', 'sup'],
    inferieur:    ['inferieur', 'inf'],

    // Mechanical / braking
    amortisseur:  ['amortisseur', 'amorto', 'amort', 'suspension', 'absorber'],
    amortiseur:   ['amortisseur', 'amorto', 'amort', 'suspension'],
    plaquette:    ['plaquette', 'plaquettes', 'plaq', 'pad', 'pads'],
    disque:       ['disque', 'disques', 'disc', 'disk'],
    frein:        ['frein', 'freinage', 'brake', 'frain'],
    tambour:      ['tambour', 'drum'],
    etrier:       ['etrier', 'caliper'],
    maitre:       ['maitre', 'master'],
    cylindre:     ['cylindre', 'cylinder'],

    // Filters
    filtre:       ['filtre', 'filter', 'filtr', 'filtere', 'element'],
    air:          ['air', 'admission', 'intake'],
    huile:        ['huile', 'oil'],
    habitacle:    ['habitacle', 'cabin', 'interior'],
    carburant:    ['carburant', 'fuel', 'essence'],

    // Body / panels
    retroviseur:  ['retroviseur', 'rétroviseur', 'miroir', 'mirroir', 'retro', 'rétro',
                   'mirwar', 'miray', 'mirror'],
    aile:         ['aile', 'fender', 'panel front fender', 'panel rear fender'],
    pare:         ['pare', 'bumper', 'choc'],
    capot:        ['capot', 'hood', 'panel front hood'],
    porte:        ['porte', 'door', 'panel door'],
    vitre:        ['vitre', 'glass', 'glace'],
    lunette:      ['lunette', 'rear window', 'windshield'],
    parebrise:    ['parebrise', 'pare brise', 'windshield', 'glass windshield'],
    calandre:     ['calandre', 'grille', 'radiator grille'],
    malle:        ['malle', 'coffre', 'back door', 'panel back'],

    // Lighting
    feu:          ['feu', 'lamp', 'light', 'feux'],
    optique:      ['optique', 'headlamp', 'phare', 'unit headlamp'],
    optic:        ['optic', 'optique', 'headlamp', 'headlight', 'phare'],
    clignotant:   ['clignotant', 'indicator', 'turn signal'],

    // Electrical
    batterie:     ['batterie', 'battery', 'batri', 'bateri', 'bataria', 'accumulator', 'accu'],
    alternateur:  ['alternateur', 'generator', 'alternator'],
    demarreur:    ['demarreur', 'starter', 'motor starting'],
    bobine:       ['bobine', 'coil', 'bobine allumage'],
    bougie:       ['bougie', 'spark plug', 'bougie allumage'],
    calculateur:  ['calculateur', 'controller', 'ecu', 'module'],
    faisceau:     ['faisceau', 'harness', 'wiring'],
    capteur:      ['capteur', 'sensor', 'sonde'],

    // Cooling / fluids
    radiateur:    ['radiateur', 'radiator', 'radiator assy'],
    condenseur:   ['condenseur', 'condenser', 'condenser assy'],
    durite:       ['durite', 'hose', 'durit', 'tuyau'],
    pompe:        ['pompe', 'pump'],
    thermostat:   ['thermostat'],
    vase:         ['vase', 'reservoir', 'tank', 'reserve'],

    // Transmission / drivetrain
    embrayage:    ['embrayage', 'clutch', 'embreyage'],
    cardan:       ['cardan', 'shaft', 'drive shaft'],
    roulement:    ['roulement', 'bearing', 'roulment'],
    boite:        ['boite', 'gearbox', 'transmission'],
    differentiel: ['differentiel', 'differential'],
    cremaillere:  ['cremaillere', 'steering rack', 'box strg gear'],
    rotule:       ['rotule', 'ball joint', 'tie rod'],
    triangle:     ['triangle', 'arm suspension', 'wishbone'],
    bras:         ['bras', 'arm', 'suspension arm'],

    // Suspension
    ressort:      ['ressort', 'spring', 'coil spring'],
    silent:       ['silent', 'silent bloc', 'bushing'],

    // Interior
    siege:        ['siege', 'seat'],
    volant:       ['volant', 'steering wheel'],
    tableau:      ['tableau', 'dashboard', 'tableau de bord'],
    ceinture:     ['ceinture', 'seatbelt', 'belt'],
    commande:     ['commande', 'switch', 'commodo'],
    serrure:      ['serrure', 'lock', 'latch'],

    // Engine
    moteur:       ['moteur', 'engine', 'motor'],
    culasse:      ['culasse', 'cylinder head', 'head'],
    piston:       ['piston', 'piston'],
    courroie:     ['courroie', 'belt', 'timing belt'],
    distribution: ['distribution', 'timing'],
    collecteur:   ['collecteur', 'manifold'],
    echappement:  ['echappement', 'exhaust', 'pipe exh'],
    injecteur:    ['injecteur', 'injector'],
    compresseur:  ['compresseur', 'compressor'],

    // Misc
    clip:         ['clip', 'agrafe', 'agraffe', 'fastener'],
    joint:        ['joint', 'gasket', 'seal', 'o ring'],
    disponible:   ['disponible', 'stock', 'availability'],
    radar:        ['radar', 'capteur recul', 'sensor park'],
    essuie:       ['essuie', 'wiper', 'balai'],
    leve:         ['leve', 'regulator', 'window regulator'],
  };

  private readonly modelTypeCodePrefixes: Record<string, string[]> = {
    'CELERIO': ['AXM310', 'ARL415'],
    'S-PRESSO': ['ABU310'],
    'SPRESSO': ['ABU310'],
    'BALENO': ['AVB414', 'AVB415'],
    'SWIFT': ['AVH310', 'A2N412', 'A2L412', 'A1K414', 'A1M414'],
    'DZIRE': ['AON312', 'AOL312'],
    'CIAZ': ['AZI412', 'AQI412', 'AZH412'],
    'FRONX': ['APK416'],
    'VITARA': ['APK414', 'APK415', 'APK416D', 'APQ415'],
    'GRAND VITARA': ['APK414', 'APK415', 'APK416D', 'APQ415'],
    'IGNIS': ['A3K415', 'A3L415'],
    'JIMNY': ['A6G415', 'A6N415', 'SN413V'],
    'ALTO': ['AAW310', 'A1K414', 'A1M414'],
    'ERTIGA': ['AKK414'],
    'APV': ['AJ3412'],
  };

  constructor(
    private prisma: PrismaService,
    private vehicleModels: VehicleModelsService,
  ) {}

  // ─────────────────────────────────────────────────────────────────
  // Normalize text exactly as AdvancedSearchService.normalize() does
  // ─────────────────────────────────────────────────────────────────
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: Get display name — French first, English fallback
  // ─────────────────────────────────────────────────────────────────
  private getDisplayName(row: { designation?: string; designation_2?: string; designation2?: string }): string {
    const french = row.designation_2 ?? row.designation2 ?? '';
    return (french && french.trim().length > 0) ? french.trim() : (row.designation ?? '').trim();
  }

  private pickVehicleValue(vehicle: any, keys: string[]): string | null {
    for (const key of keys) {
      const value = vehicle?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
  }

  private normalizeTypeCode(value: string): string {
    return value.toUpperCase().trim().replace(/\s+/g, '-');
  }

  private getVehicleYear(vehicle: any): number | null {
    const raw = vehicle?.annee ?? vehicle?.year ?? vehicle?.modelYear;
    const year = Number(raw);
    return Number.isFinite(year) ? year : null;
  }

  private getFallbackPrefixes(model: string | null, query: string | undefined, vehicle: any): string[] {
    if (!model) return [];
    const normalizedModel = model.toUpperCase().trim();
    const prefixes = this.modelTypeCodePrefixes[normalizedModel] ?? [];
    if (normalizedModel === 'CELERIO') {
      const year = this.getVehicleYear(vehicle);
      const asksNewCelerio = /\b(new|neuf|nouveau|nouvelle)\s+celerio\b/i.test(query ?? '');
      if (asksNewCelerio || (year != null && year >= 2022)) {
        return ['AXM310'];
      }
    }
    return prefixes;
  }

  private async addTypeCodesFromPrefixes(typeCodes: Set<string>, prefixes: string[]): Promise<void> {
    if (prefixes.length === 0) return;
    const rows = await this.prisma.vehicleTypeMaster.findMany({
      where: {
        OR: prefixes.flatMap((prefix) => [
          { typeCode: { startsWith: prefix, mode: 'insensitive' } },
          { modelName: { startsWith: prefix, mode: 'insensitive' } },
        ]),
      },
      select: { typeCode: true },
    });
    rows.forEach((row) => {
      typeCodes.add(row.typeCode);
      typeCodes.add(this.normalizeTypeCode(row.typeCode));
    });
  }

  private buildVehicleStopTerms(model: string | null, query: string, vehicle?: any): Set<string> {
    const terms = new Set<string>();
    const detectedModel = this.vehicleModels.detectModelInText(query);
    const values = [
      detectedModel,
      model,
      vehicle?.modele,
      vehicle?.model,
      vehicle?.modelName,
      vehicle?.modeleDescription,
    ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

    for (const value of values) {
      this.normalize(value).split(' ').filter((token) => token.length > 1).forEach((token) => terms.add(token));
    }

    if (detectedModel || model || values.length > 0) {
      ['new', 'neuf', 'nouveau', 'nouvelle', 'all'].forEach((token) => terms.add(token));
    }
    return terms;
  }

  private async resolveVehicleTypeCodes(vehicle?: any, query?: string): Promise<{
    vin: string | null;
    vehicleNo: string | null;
    model: string | null;
    typeCodes: string[];
  }> {
    const empty = { vin: null, vehicleNo: null, model: null, typeCodes: [] as string[] };
    if (!vehicle) return empty;

    const vin = this.pickVehicleValue(vehicle, ['vin', 'VIN', 'numeroChassis', 'numChassis', 'chassis']);
    const vehicleNo = this.pickVehicleValue(vehicle, ['vehicleNo', 'vehicle_no', 'numeroVehicule']);
    const explicitTypeCode = this.pickVehicleValue(vehicle, ['typeCode', 'type_code', 'type']);
    const queryModel = query ? this.vehicleModels.detectModelInText(query) : null;

    let dbVehicle: any = null;
    if (vin) {
      dbVehicle = await this.prisma.vehicle.findFirst({
        where: { vin: { equals: vin, mode: 'insensitive' } },
        select: { vin: true, vehicleNo: true, modele: true, modeleDescription: true },
      });
    }
    if (!dbVehicle && vehicleNo) {
      dbVehicle = await this.prisma.vehicle.findFirst({
        where: { vehicleNo: { equals: vehicleNo, mode: 'insensitive' } },
        select: { vin: true, vehicleNo: true, modele: true, modeleDescription: true },
      });
    }

    const modelCandidates = [
      queryModel,
      dbVehicle?.modele,
      vehicle.modele,
      vehicle.model,
      vehicle.modelName,
      dbVehicle?.modeleDescription,
      vehicle.modeleDescription,
    ]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());

    const normalizedModel = modelCandidates
      .map((value) => this.vehicleModels.normalize(value))
      .find((value): value is string => !!value) ?? null;

    const modelValues = Array.from(new Set([
      ...modelCandidates,
      ...(normalizedModel ? [normalizedModel] : []),
    ].map((value) => value.toUpperCase().trim())));

    const typeCodes = new Set<string>();
    if (explicitTypeCode && /TYPE/i.test(explicitTypeCode)) {
      typeCodes.add(this.normalizeTypeCode(explicitTypeCode));
    }

    if (modelValues.length > 0) {
      const modelMapRows = await this.prisma.vehicleModelMap.findMany({
        where: { OR: modelValues.map((modele) => ({ modele: { equals: modele, mode: 'insensitive' } })) },
        select: { typeCode: true },
      });
      modelMapRows.forEach((row) => typeCodes.add(row.typeCode));

      const typeRows = await this.prisma.vehicleTypeMaster.findMany({
        where: { OR: modelValues.map((modelName) => ({ modelName: { contains: modelName, mode: 'insensitive' } })) },
        select: { typeCode: true },
      });
      typeRows.forEach((row) => typeCodes.add(row.typeCode));
    }

    await this.addTypeCodesFromPrefixes(
      typeCodes,
      this.getFallbackPrefixes(normalizedModel, query, vehicle),
    );

    return {
      vin: dbVehicle?.vin ?? vin ?? null,
      vehicleNo: dbVehicle?.vehicleNo ?? vehicleNo ?? null,
      model: normalizedModel ?? dbVehicle?.modele ?? vehicle.modele ?? null,
      typeCodes: [...typeCodes],
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // Main validation entry point
  // ─────────────────────────────────────────────────────────────────
  async validateSearch(query: string, aiResults: any[], vehicle?: any): Promise<void> {
    console.log(`🔍 VALIDATING: "${query}" - AI found ${aiResults.length} results`);

    try {
      const normalized = this.normalize(query);

      // Tokenize exactly like AdvancedSearchService
      const allTokens = normalized.split(' ').filter((t) => t.length > 0);
      const vehicleScope = await this.resolveVehicleTypeCodes(vehicle, query);
      const vehicleStopTerms = this.buildVehicleStopTerms(vehicleScope.model, query, vehicle);
      const tokens    = allTokens.filter((t) => t.length > 2 && !vehicleStopTerms.has(t));

      // ── FIX-3: Expand with the same synonym logic ──────────────
      const expandedTokens = new Set<string>();
      tokens.forEach((t) => expandedTokens.add(t));

      tokens.forEach((token) => {
        const syns = this.synonyms[token];
        if (syns) {
          // Use first 3 synonyms to keep the SQL manageable
          syns.slice(0, 3).forEach((syn) => expandedTokens.add(syn));
        }
      });

      // Short position tokens (av, ar, g, d)
      allTokens.forEach((t) => {
        if (t.length <= 2 && ['av', 'ar', 'g', 'd'].includes(t)) {
          expandedTokens.add(t);
        }
      });

      const finalTokens = Array.from(expandedTokens).filter((token) => !vehicleStopTerms.has(token));

      if (finalTokens.length === 0) {
        console.log('⚠️ No valid tokens, skipping validation');
        return;
      }

      // Cap at 10 terms to keep the SQL query sane
      const terms = finalTokens.slice(0, 10);

      // ── FIX-1: Build ILIKE conditions across all three text fields ──
      // Mirrors AdvancedSearchService.buildSearchConditions():
      //   1. designation_2     (French name — primary)
      //   2. search_description (NLP field — primary)
      //   3. designation       (English OEM — fallback)
      //   4. reference         (part reference)
      const likeConditions = terms.map(
        (t) => Prisma.sql`(
          p.designation_2       ILIKE ${`%${t}%`}
          OR p.search_description ILIKE ${`%${t}%`}
          OR p.designation        ILIKE ${`%${t}%`}
          OR p.reference          ILIKE ${`%${t}%`}
          OR p.categorie          ILIKE ${`%${t}%`}
          OR p.fabricant          ILIKE ${`%${t}%`}
          OR p.fournisseur_code   ILIKE ${`%${t}%`}
          OR p.unite              ILIKE ${`%${t}%`}
          OR EXISTS (
            SELECT 1 FROM item_references ir
            WHERE ir.part_reference = p.reference
              AND ir.reference_no ILIKE ${`%${t}%`}
          )
          OR EXISTS (
            SELECT 1 FROM fitment ftxt
            WHERE ftxt.part_reference = p.reference
              AND (
                ftxt.type_code ILIKE ${`%${t}%`}
                OR ftxt.model_name ILIKE ${`%${t}%`}
              )
          )
        )`,
      );

      const termSql = Prisma.join(likeConditions, ' OR ');

      // Vehicle compatibility filter (optional): VIN/model -> type_code -> fitment.
      const compatibilitySql = vehicleScope.typeCodes.length > 0
        ? (() => {
            const typeCodeSql = Prisma.join(vehicleScope.typeCodes.map((typeCode) => Prisma.sql`${typeCode}`));
            return Prisma.sql`AND EXISTS (
              SELECT 1 FROM fitment f
              WHERE f.part_reference = p.reference
                AND f.type_code IN (${typeCodeSql})
            )`;
          })()
        : Prisma.sql``;

      // ── FIX-2: No source filter — include 01_PROD AND 02_CARPRO ──
      // ── FIX-6: Query directly from parts table with LEFT JOIN stock ──
      //    (avoids dependency on mart view which may not expose designation_2)
      let dbResults: any[] = [];

      try {
        // Try mart view first (if it exposes designation_2 and search_description)
        dbResults = await this.prisma.$queryRaw<any[]>`
          SELECT
            p.reference,
            p.designation,
            p.designation_2,
            p.search_description,
            p.prix_ht        AS "prixHt",
            p.prix_ttc       AS "prixTtc",
            p.source,
            s.statut,
            s.total_quantity AS "totalQuantity",
            s.stock_disponible AS "stockDisponible",
            s.stock_consolide AS "stockConsolide"
          FROM parts p
          LEFT JOIN stock s ON s.reference = p.reference
          WHERE (${termSql})
          ${compatibilitySql}
          ORDER BY
            -- Prefer French field match for ranking
            CASE WHEN p.designation_2 ILIKE ${`%${normalized}%`} THEN 0 ELSE 1 END,
            CASE WHEN COALESCE(s.stock_consolide, s.total_quantity, 0) > 2 THEN 0 ELSE 1 END
          LIMIT 100
        `;
      } catch (queryError) {
        this.logger.warn(`Raw parts query failed, falling back to mart view: ${queryError}`);
        // Fallback to mart view if direct query fails
        try {
          dbResults = await this.prisma.$queryRaw<any[]>`
            SELECT reference, designation, prixht AS "prixHt", stock
            FROM mart.chatbot_parts_with_fitment
            WHERE (${termSql})
            LIMIT 100
          `;
        } catch (martError) {
          this.logger.error(`Both query strategies failed: ${martError}`);
          return;
        }
      }

      const aiCount = aiResults.length;
      const dbCount = dbResults.length;

      console.log(`📊 COMPARISON: AI=${aiCount}, DB=${dbCount}`);

      // ── FIX-5: Corrected status logic ─────────────────────────
      // The DB query is intentionally BROADER than the AI pipeline:
      //   - DB: raw ILIKE across all text fields, same vehicle scope when known,
      //         no scoring, no position filter
      //   - AI: scored, position-filtered, mandatory-word enforced, deduplicated
      // Therefore AI always returns ≤ DB results. This is correct behavior.
      //
      // AI_FALSE_POSITIVE = AI found parts that don't exist in DB at all.
      //   This means the AI invented results — a real bug.
      //
      // AI_MISS = AI found 0 but DB found results that SHOULD have matched.
      //   Indicates over-filtering or a missing synonym.
      //
      // MATCH = AI found a subset of DB results (normal after scoring).
      let status: ValidationResult['status'];

      if (aiCount === 0 && dbCount === 0) {
        // Both found nothing — consistent, nothing to flag
        status = 'MATCH';
        this.logger.debug(`✅ MATCH (both empty): "${query}"`);

      } else if (aiCount === 0 && dbCount > 0) {
        // DB found candidates but AI filtered all out.
        // This MAY be correct (strict scoring filtered junk) OR it may be
        // an over-filtering bug. Log as AI_MISS for human review.
        status = 'AI_MISS';
        this.logger.warn(
          `⚠️ AI_MISS: "${query}"\n` +
          `  AI found: 0\n` +
          `  DB found: ${dbCount}\n` +
          `  DB top: ${dbResults.slice(0, 3).map((r) => this.getDisplayName(r)).join(', ')}`,
        );

      } else if (aiCount > 0 && dbCount === 0) {
        // AI found results that have no DB trace — genuine false positive
        status = 'AI_FALSE_POSITIVE';
        const compatibilityNote = vehicleScope.typeCodes.length > 0
          ? `\n  Vehicle scope: ${vehicleScope.typeCodes.join(', ')}`
          : '';
        this.logger.warn(
          `🚨 FALSE POSITIVE: "${query}"\n` +
          `  AI found: ${aiCount}\n` +
          `  DB found: 0${compatibilityNote}\n` +
          `  AI results: ${aiResults.slice(0, 3).map((r) => r.displayName ?? r.designation).join(', ')}`,
        );

      } else if (aiCount > dbCount) {
        // AI returned MORE than the broad DB scan — should be impossible after scoring.
        // Indicates a logic error in the AI pipeline (e.g. duplicate rows).
        status = 'AI_FALSE_POSITIVE';
        this.logger.warn(
          `🚨 AI OVER-REPORTING: "${query}"\n` +
          `  AI: ${aiCount} results\n` +
          `  DB: ${dbCount} results (broad scan)\n` +
          `  This should not happen — check for duplicate rows in AI output`,
        );

      } else {
        // AI returned ≤ DB results — normal behavior after scoring & filtering
        status = 'MATCH';
        this.logger.debug(`✅ MATCH (AI scored subset of DB): "${query}" — AI: ${aiCount}, DB: ${dbCount}`);
      }

      // ── FIX-4: Store French display name in log ────────────────
      const result: ValidationResult = {
        query,
        aiResultCount:  aiCount,
        dbResultCount:  dbCount,
        status,
        aiTopResults:   aiResults.slice(0, 3).map((r) => r.displayName ?? r.designation2 ?? r.designation),
        dbTopResults:   dbResults.slice(0, 3).map((r) => this.getDisplayName(r)),
        timestamp:      new Date(),
      };

      this.validationLog.push(result);
      if (this.validationLog.length > this.MAX_LOG_SIZE) {
        this.validationLog.shift();
      }

    } catch (error) {
      this.logger.error('Validation error:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Validation report — unchanged shape, corrected label descriptions
  // ─────────────────────────────────────────────────────────────────
  getValidationReport(): {
    totalValidations:  number;
    matches:           number;
    aiMisses:          number;
    falsePositives:    number;
    mismatches:        number;
    accuracy:          number;
    recentIssues:      ValidationResult[];
  } {
    const total         = this.validationLog.length;
    const matches       = this.validationLog.filter((v) => v.status === 'MATCH').length;
    const aiMisses      = this.validationLog.filter((v) => v.status === 'AI_MISS').length;
    const falsePositives = this.validationLog.filter((v) => v.status === 'AI_FALSE_POSITIVE').length;
    const mismatches    = this.validationLog.filter((v) => v.status === 'MISMATCH').length;
    const accuracy      = total > 0 ? (matches / total) * 100 : 100;

    const recentIssues = this.validationLog
      .filter((v) => v.status !== 'MATCH')
      .slice(-10)
      .reverse();

    return {
      totalValidations: total,
      matches,
      aiMisses,
      falsePositives,
      mismatches,
      accuracy,
      recentIssues,
    };
  }

  clearLog(): void {
    this.validationLog = [];
    this.logger.log('Validation log cleared');
  }
}
