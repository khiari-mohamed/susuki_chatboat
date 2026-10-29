import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { OpenAIService } from './openai.service';
import { pickBestVehicleRow, vinLookupVariants } from './chat/vehicle-lookup';
import { hasKnownStock, isQuantityAvailable } from '../constants/business-rules.constants';
import {
  applyCatalogConstraints,
  buildIdentityKeys,
  buildRequestedPartTokens,
  compactKey,
  extractColorTokens,
  extractNumericSpecifications,
  extractRequestedPositions,
  getCatalogPositions,
  hasNumericSpecifications,
  hasAnyPosition,
  isFillerToken,
  isColorToken,
  isPositionToken,
  keysMatch,
  normalizeTypeCode,
  tokenizeName,
} from './part-constraints';
import type { ConstraintOutcome } from './part-constraints';


interface PositionRequirements {
  avant: boolean;
  arriere: boolean;
  gauche: boolean;
  droite: boolean;
}

export interface VehicleSearchScope {
  active: boolean;
  vin: string | null;
  vehicleNo: string | null;
  model: string | null;
  modelDescription: string | null;
  typeCodes: string[]; // all compatible type codes (broad scope)
  primaryTypeCodes: string[]; // type codes for the exact identified model
  typeCodeSource: 'explicit' | 'vehicle-row' | 'model-map' | 'none';
}

// ─── API response shape ───────────────────────────────────────────
export interface PartResult {
  id: number;
  reference: string;
  /** PRIMARY display name — French when available. */
  displayName: string;
  designation: string; // English OEM name
  designation2: string | null; // French name (designation_2)
  searchDescription: string | null;
  prixHt: string | null;
  prixTtc: string | null;
  unite: string | null;
  categorie: string | null;
  fabricant: string | null;
  fournisseurCode: string | null;
  source: string; // '01_PROD' | '02_CARPRO'
  sourceLabel: string; // 'Suzuki OEM' | 'CarPro Parts'
  stock: {
    statut: string;
    totalQuantity: number;
    stockDisponible: number;
    stockConsolide: number;
  } | null;
  fitments: { modelName: string; typeCode: string }[];
  itemReferences?: { referenceNo: string; referenceType: string | null }[];
  identificationSource?: {
    vin: string | null;
    vehicleNo: string | null;
    model: string | null;
    modelDescription: string | null;
    typeCodes: string[];
    articleNumber: string;
  };
  /** Ranking value (debugging only). */
  score: number;
}

export interface SearchDebugInfo {
  searchType: 'text' | 'reference';
  originalQuery: string;
  normalizedQuery: string;
  hasTunisianDialect: boolean;
  rawTokens: string[];
  expandedTerms: string[];
  mainPartType: string | null;
  positionInfo: PositionRequirements;
  fieldsSearched: string[];
  tablesQueried: string[];
  dbRawCount: number;
  qualifiedCount: number;
  finalCount: number;
  sourceBreakdown: { suzukiOem: number; carproParts: number };
  stockBreakdown: { disponible: number; indisponible: number };
  vehicleScope?: VehicleSearchScope;
  constraint?: ConstraintOutcome | null;
  /** 'and' = every word matched, 'or' = fallback, 'none' = nothing to search. */
   retrievalMode?: 'and' | 'relaxed' | 'or' | 'none';
  /** True when the DB cap was hit: some candidates were not examined. */
  truncated?: boolean;
}

interface RankContext {
  groups: string[][];
  positionInfo: PositionRequirements;
  compactQuery: string;
}

// ─── Constants ────────────────────────────────────────────────────
const DB_CANDIDATE_LIMIT = 1500;
const TOP_N = 10;
const MAX_TERM_VARIANTS = 12;
const MAX_SEGMENT_TOKEN_LENGTH = 40;
const AI_SEGMENT_FAIL_THRESHOLD = 3;
const AI_SEGMENT_COOLDOWN_MS = 60_000;
const RANK = {
  REFERENCE_EXACT: 200_000,
  REFERENCE_CONTAINS: 40_000,
  FULL_COVERAGE_BONUS: 100_000,
  COVERAGE_MAX: 100_000,
  EXACT_DESIGNATION: 50_000,
  STOCK_AVAILABLE: 40_000,
  FIT_EXCLUSIVE: 30_000,
  FIT_PRIMARY_BASE: 20_000,
  FIT_PRIMARY_SPAN: 9_000,
  FIT_SCOPE_ONLY: 10_000,
  FIT_SCOPE_PARTIAL_SPAN: 5_000,
  POSITION_MATCH: 500,
  TIGHTNESS_MAX: 1_000,
  TIGHTNESS_PER_EXTRA_WORD: 50,
} as const;

/** How much a match in each text field counts toward coverage. */
const FIELD_WEIGHT = { french: 1, searchDescription: 0.6, english: 0.6, auxiliary: 0.3 } as const;

const PART_INCLUDE = {
  stock: {
    select: { statut: true, totalQuantity: true, stockDisponible: true, stockConsolide: true },
  },
  fitments: { select: { modelName: true, typeCode: true } },
  itemReferences: { select: { referenceNo: true, referenceType: true } },
} as const;

const VEHICLE_SELECT = {
  id: true,
  vin: true,
  vehicleNo: true,
  modele: true,
  modeleDescription: true,
  typeCode: true,
} as const;

const VIN_SHAPE = /^[A-HJ-NPR-Z0-9]{17}$/i;
export function extractReferenceCandidate(text: string): string | null {
  const input = String(text ?? '');

  const labeled = input.match(/\bref[eé]rence[\s:]*([A-Z0-9][A-Z0-9_-]{4,})/i);
  if (labeled && /\d/.test(labeled[1])) return labeled[1];

  const candidates = input.match(/[A-Z0-9]+(?:[-_][A-Z0-9]+)*/gi) ?? [];
  for (const candidate of candidates) {
    const clean = candidate.replace(/[^A-Z0-9]/gi, '');
    if (clean.length < 8 || !/\d/.test(clean)) continue;
    if (!/[-_]/.test(candidate) && VIN_SHAPE.test(clean)) continue;
    return candidate;
  }
  return null;
}

@Injectable()
export class AdvancedSearchService {
  private readonly logger = new Logger(AdvancedSearchService.name);

  private aiSegmentationFailCount = 0;
  private aiSegmentationDisabledUntil = 0;
  private dialectCache: { source: Record<string, string>; lookup: Map<string, string>; pattern: RegExp | null } | null = null;
  private lastSearchDebug: SearchDebugInfo | null = null;

  constructor(
    private prisma: PrismaService,
    private synonymsService: SynonymsService,
    private vehicleModels: VehicleModelsService,
    private openaiService: OpenAIService,
  ) {}

  // The synonym index is read live: SynonymsService swaps its tables on reload.
  private get synonymsMap(): Record<string, string[]> {
    return this.synonymsService.getCategoryVariants();
  }

  private get normalizedSynonymLookup(): Record<string, string> {
    return this.synonymsService.getNormalizedLookup();
  }

  getLastSearchDebug(): SearchDebugInfo | null {
    return this.lastSearchDebug;
  }

  /** Kept for callers of the old snapshot API: the index is read live now, so nothing is stale. */
  refreshSynonymIndex(): void {
    this.dialectCache = null;
  }

  getSearchStats(): { totalSynonyms: number } {
    return { totalSynonyms: Object.keys(this.synonymsMap).length };
  }

  getSynonymMap(): Record<string, string[]> {
    return this.synonymsMap;
  }

  /** Resolve vehicle compatibility codes without reading shared last-search state. */
  async resolveVehicleTypeCodes(vehicle?: any): Promise<string[]> {
    const scope = await this.resolveVehicleScope(vehicle);
    return scope.active ? [...scope.typeCodes] : [];
  }

  // ─── Formatting ─────────────────────────────────────────────────
  getDisplayName(part: { designation: string; designation2?: string | null }): string {
    const french = part.designation2?.trim();
    return french ? french : (part.designation ?? '').trim();
  }

  getSourceLabel(source: string): string {
    switch (source) {
      case '01_PROD':
        return 'Suzuki OEM';
      case '02_CARPRO':
        return 'CarPro Parts';
      default:
        return source;
    }
  }

  private isStockAvailable(stock: any): boolean {
    return isQuantityAvailable(stock?.stockConsolide ?? stock?.stock_consolide);
  }

    private formatStock(stock: any): PartResult['stock'] {
    // Unknown stock is NOT zero: null lets the response layer redirect to the Comptoir.
    if (!hasKnownStock(stock)) return null;
    const stockConsolide = Number(stock.stockConsolide ?? stock.stock_consolide);
    return {
      statut: isQuantityAvailable(stockConsolide) ? 'Disponible' : 'Indisponible',
      totalQuantity: Number(stock?.totalQuantity ?? stock?.total_quantity ?? 0),
      stockDisponible: Number(stock?.stockDisponible ?? stock?.stock_disponible ?? 0),
      stockConsolide,
    };
  }

  formatPartResult(part: any, score: number, scope?: VehicleSearchScope): PartResult {
    const french = (part.designation2 ?? '').trim();
    return {
      id: part.id,
      reference: part.reference,
      displayName: this.getDisplayName(part),
      designation: (part.designation ?? '').trim(),
      designation2: french || null,
      searchDescription: part.searchDescription ?? null,
      prixHt: part.prixHt != null ? String(part.prixHt) : null,
      prixTtc: part.source === '01_PROD' && part.prixTtc != null ? String(part.prixTtc) : null,
      unite: part.unite ?? null,
      categorie: part.categorie ?? null,
      fabricant: part.fabricant ?? null,
      fournisseurCode: part.fournisseurCode ?? null,
      source: part.source,
      sourceLabel: this.getSourceLabel(part.source),
      stock: this.formatStock(part.stock),
      fitments: (part.fitments ?? []).map((f: any) => ({ modelName: f.modelName, typeCode: f.typeCode })),
      itemReferences: (part.itemReferences ?? []).map((r: any) => ({
        referenceNo: r.referenceNo,
        referenceType: r.referenceType ?? null,
      })),
      identificationSource: scope
        ? {
            vin: scope.vin,
            vehicleNo: scope.vehicleNo,
            model: scope.model,
            modelDescription: scope.modelDescription,
            typeCodes: scope.typeCodes,
            articleNumber: part.reference,
          }
        : undefined,
      score,
    };
  }

  private computeBreakdowns(results: PartResult[]) {
    const sourceBreakdown = { suzukiOem: 0, carproParts: 0 };
    const stockBreakdown = { disponible: 0, indisponible: 0 };
    for (const r of results) {
      if (r.source === '02_CARPRO') sourceBreakdown.carproParts++;
      else sourceBreakdown.suzukiOem++;
      if (this.isStockAvailable(r.stock)) stockBreakdown.disponible++;
      else stockBreakdown.indisponible++;
    }
    return { sourceBreakdown, stockBreakdown };
  }

  // ─── Vehicle scope ──────────────────────────────────────────────
  private pickVehicleValue(vehicle: any, keys: string[]): string | null {
    for (const key of keys) {
      const value = vehicle?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
  }

  private generateModelVariants(value: string): string[] {
    const upper = value.toUpperCase().trim();
    return [
      ...new Set([
        upper,
        upper.replace(/-/g, ''),
        upper.replace(/\s+/g, ''),
        upper.replace(/[-\s]+/g, ''),
        upper.replace(/-/g, ' '),
        upper.replace(/\s+/g, '-'),
      ]),
    ].filter(Boolean);
  }

  private async findVehicleRow(vin: string | null, vehicleNo: string | null): Promise<any | null> {
    if (vin) {
      const matches = await this.prisma.vehicle.findMany({
        where: { OR: vinLookupVariants(vin).map((variant) => ({ vin: { equals: variant, mode: 'insensitive' as const } })) },
        select: VEHICLE_SELECT,
      });
      const row = pickBestVehicleRow(matches);
      if (row) return row;
    }
    if (vehicleNo) {
      return this.prisma.vehicle.findFirst({
        where: { vehicleNo: { equals: vehicleNo, mode: 'insensitive' } },
        select: VEHICLE_SELECT,
      });
    }
    return null;
  }

  async resolveVehicleScope(vehicle?: any): Promise<VehicleSearchScope> {
    const empty: VehicleSearchScope = {
      active: false,
      vin: null,
      vehicleNo: null,
      model: null,
      modelDescription: null,
      typeCodes: [],
      primaryTypeCodes: [],
      typeCodeSource: 'none',
    };
    if (!vehicle) return empty;

    const vin = this.pickVehicleValue(vehicle, ['vin', 'VIN', 'numeroChassis', 'numChassis', 'chassis']);
    const vehicleNo = this.pickVehicleValue(vehicle, ['vehicleNo', 'vehicle_no', 'numeroVehicule']);
    const clientTypeCode = this.pickVehicleValue(vehicle, ['typeCode', 'type_code', 'type']);

    const dbVehicle = await this.findVehicleRow(vin, vehicleNo);
    const explicitTypeCode = clientTypeCode || dbVehicle?.typeCode || null;

    const clean = (values: unknown[]) =>
      values
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim());

    // modeleDescription ("ALL NEW SW GL MT") identifies the exact variant; modele ("SWIFT IV") is the broader fallback.
    const primaryCandidates = clean([
      dbVehicle?.modeleDescription,
      vehicle.modeleDescription,
      vehicle.model,
      vehicle.modelName,
    ]);
    const modelCandidates = [...new Set([...primaryCandidates, ...clean([dbVehicle?.modele, vehicle.modele])])];

    const normalizedModel =
      modelCandidates.map((value) => this.vehicleModels.normalize(value)).find((value): value is string => !!value) ??
      null;
    const modelValues = [
      ...new Set([...modelCandidates, ...(normalizedModel ? [normalizedModel] : [])].map((v) => v.toUpperCase().trim())),
    ];

    const typeCodes = new Set<string>();
    const primaryTypeCodes = new Set<string>();
    let typeCodeSource: VehicleSearchScope['typeCodeSource'] = 'none';

    if (explicitTypeCode) {
      const code = normalizeTypeCode(explicitTypeCode);
      typeCodes.add(code);
      primaryTypeCodes.add(code);
      typeCodeSource = clientTypeCode ? 'explicit' : 'vehicle-row';
    } else if (modelValues.length > 0) {
      const addRows = (rows: { typeCode: string }[], primary = false) => {
        for (const row of rows) {
          const code = normalizeTypeCode(row.typeCode);
          typeCodes.add(code);
          if (primary) primaryTypeCodes.add(code);
        }
      };
      const equalsAny = (values: string[]) =>
        values.map((modele) => ({ modele: { equals: modele, mode: 'insensitive' as const } }));

      if (primaryCandidates.length > 0) {
        addRows(
          await this.prisma.vehicleModelMap.findMany({ where: { OR: equalsAny(primaryCandidates) }, select: { typeCode: true } }),
          true,
        );
      }
      addRows(await this.prisma.vehicleModelMap.findMany({ where: { OR: equalsAny(modelValues) }, select: { typeCode: true } }));

      const variants = [...new Set(modelValues.flatMap((value) => this.generateModelVariants(value)))];

      // vehicle_type_master.model_name mirrors type_code for ~86% of rows, so
      // the richer vehicle_model_map.modele gets the fuzzy pass first.
      if (typeCodes.size === 0) {
        addRows(
          await this.prisma.vehicleModelMap.findMany({
            where: { OR: variants.map((modele) => ({ modele: { contains: modele, mode: 'insensitive' as const } })) },
            select: { typeCode: true },
          }),
        );
      }
      addRows(
        await this.prisma.vehicleTypeMaster.findMany({
          where: { OR: variants.map((modelName) => ({ modelName: { contains: modelName, mode: 'insensitive' as const } })) },
          select: { typeCode: true },
        }),
      );
      if (typeCodes.size > 0) typeCodeSource = 'model-map';
    }

    return {
      active: typeCodes.size > 0,
      vin: dbVehicle?.vin ?? vin ?? null,
      vehicleNo: dbVehicle?.vehicleNo ?? vehicleNo ?? null,
      model: dbVehicle?.modele ?? normalizedModel ?? vehicle.modele ?? null,
      modelDescription: dbVehicle?.modeleDescription ?? vehicle.modeleDescription ?? null,
      typeCodes: [...typeCodes],
      primaryTypeCodes: primaryTypeCodes.size > 0 ? [...primaryTypeCodes] : [...typeCodes],
      typeCodeSource,
    };
  }

  /** fitment.type_code mixes "AON312-TYPE1" and "AON312 TYPE1": match both spellings. */
  private buildCompatibilityWhere(scope: VehicleSearchScope): any {
    if (!scope.active || scope.typeCodes.length === 0) return {};
    const codes = [...new Set(scope.typeCodes.flatMap((rawCode) => {
      const code = normalizeTypeCode(rawCode);
      return [
        code,
        code.replace(/-TYPE(\d)/g, '-TYPE-$1'),
        code.replace(/-/g, ' '),
        code.replace(/-TYPE(\d)/g, ' TYPE $1'),
      ];
    }))];
    return { fitments: { some: { typeCode: { in: codes } } } };
  }

  // ─── MAIN SEARCH ────────────────────────────────────────────────
  async searchParts(query: string, vehicle?: any): Promise<PartResult[]> {
    return (await this.searchPartsDetailed(query, vehicle)).results;
  }
  async searchPartsDetailed(
    query: string,
    vehicle?: any,
  ): Promise<{
    results: PartResult[];
    constraint: ConstraintOutcome | null;
    scope: VehicleSearchScope | null;
    truncated: boolean;
  }> {
    if (!query || query.trim().length < 2) {
      return { results: [], constraint: null, scope: null, truncated: false };
    }
    this.logger.log(`[SEARCH] Input query: "${query}"`);

    const vehicleScope = await this.resolveVehicleScope(vehicle);
    const reference = extractReferenceCandidate(query);
    if (reference) {
      this.logger.log(`[SEARCH] Reference detected: "${reference}"`);
      const refResults = await this.searchByReference(reference, vehicleScope);
      return { results: refResults, constraint: null, scope: vehicleScope, truncated: false };
    }

    const dialect = this.applyDialect(query);
    const searchQuery = dialect.text;
    const normalized = this.normalize(searchQuery);
    const allTokens = await this.tokenize(normalized);
    const rawTokens = allTokens.filter((token) => token.length > 2);

    const ignore = this.buildIdentityIgnoreSet();
    const groups = this.buildTermGroups(rawTokens, ignore);
    const expandedTerms = [...new Set(groups.flat())];
    const requestedPositions = this.requestedPositionsOf(searchQuery);
    const positionInfo = this.toPositionRequirements(requestedPositions);
    if (vehicleScope.active) {
      this.logger.log(
        `[SEARCH] Vehicle scope: typeCodes=[${vehicleScope.typeCodes.join(', ')}] source=${vehicleScope.typeCodeSource} vin=${vehicleScope.vin ?? 'n/a'}`,
      );
    }

    const { parts: fetchedParts, mode, truncated, droppedGroups } = await this.fetchCandidates(groups, vehicleScope);
    // Words dropped because the catalog does not contain them are not part of the request's identity.
    const droppedTerms = new Set(droppedGroups.flat());
    const activeGroups = groups.filter((group) => !droppedGroups.includes(group));
    this.logger.log(`[SEARCH] Retrieved ${fetchedParts.length} candidates (mode=${mode}${truncated ? ', TRUNCATED' : ''})`);
    if (truncated) {
      this.logger.warn(`[SEARCH] DB cap of ${DB_CANDIDATE_LIMIT} reached for "${normalized}": add a distinguishing word or a vehicle.`);
    }

    const numericSpecifications = extractNumericSpecifications(query);
    const numericMatches = this.filterByNumericSpecifications(fetchedParts, numericSpecifications);
    if (numericSpecifications.length > 0) {
      this.logger.log(
        `[SEARCH] Numeric specifications [${numericSpecifications.join(', ')}]: ${numericMatches.length}/${fetchedParts.length} candidates matched`,
      );
    }

    const requestedColors = extractColorTokens(query);
    const parts = this.filterByRequestedColors(numericMatches, requestedColors);
    if (requestedColors.length > 0) {
      this.logger.log(
        `[SEARCH] Explicit colors [${requestedColors.join(', ')}]: ${parts.length}/${numericMatches.length} candidates matched`,
      );
    }

    // Words that match nothing in the retrieved pool (greetings, dialect filler, "mawjoud", "ch7al")
    // cannot identify a part: they must not stop a row from counting as fully covered.
    const poolTexts = parts.map((part) => {
      const text = this.normalize([part.designation2, part.searchDescription, part.designation].filter(Boolean).join(' '));
      return { text, words: text.split(' ').filter(Boolean) };
    });
    const informativeGroups = activeGroups.filter((group) => poolTexts.some((pool) => this.groupMatches(group, pool.text, pool.words)));
    const rankContext: RankContext = {
      groups: informativeGroups.length > 0 ? informativeGroups : groups,
      positionInfo,
      compactQuery: this.normalizeForDB(query),
    };
    let results = parts
      .map((part) => ({ ...part, _score: this.rank(part, rankContext, vehicleScope) }))
      .sort((a, b) => b._score - a._score || String(a.reference).localeCompare(String(b.reference)));

    // ── Catalog constraint gate (deterministic) ──────────────────
    // Runs BEFORE the top-N cut so rejected rows cannot occupy a slot:
    //   identity — "SUPPORT PARE CHOC AV G" is a support, not a bumper
    //   position — a typed position must really exist on the part
    const requestedPartTokens = this.requestedPartTokensForCandidates(
      allTokens.filter((token) => !droppedTerms.has(token)),
      ignore,
      parts,
    );
    const canonicalTokens = requestedPartTokens.flatMap((token) =>
      tokenizeName(this.findPrimaryCategory(token) ?? token),
    );
    const identityKeys = buildIdentityKeys(
      [requestedPartTokens, canonicalTokens.length <= 3 ? canonicalTokens : []],
      (phrase) => this.synonymVariantsOf(phrase),
    );
    const gate = applyCatalogConstraints(results, { requestedPositions, requestedPartTokens, identityKeys });
    if (gate.outcome.applied) {
      this.logger.log(
        `[SEARCH] Constraint gate: part="${gate.outcome.requestedPart ?? '-'}" ` +
          `positions=[${hasAnyPosition(requestedPositions) ? JSON.stringify(requestedPositions) : '-'}] ` +
          `identity=${gate.outcome.identityMode} ` +
          `rejected(identity=${gate.outcome.rejectedByIdentity}, position=${gate.outcome.rejectedByPosition}) kept=${gate.outcome.kept}`,
      );
    }
    results = gate.kept;

    const mapped = results.slice(0, TOP_N).map((p) => this.formatPartResult(p, p._score, vehicleScope));
    this.logger.log(`[SEARCH] Final results returned: ${mapped.length}`);

    const firstCategory = rawTokens.map((t) => this.findPrimaryCategory(t)).find((c): c is string => !!c);
    this.lastSearchDebug = {
      searchType: 'text',
      originalQuery: query,
      normalizedQuery: normalized,
      hasTunisianDialect: dialect.applied,
      rawTokens,
      expandedTerms,
      mainPartType: firstCategory ?? null,
      positionInfo,
      fieldsSearched: ['designation_2', 'search_description', 'designation', 'reference (numeric terms)', 'item_references.reference_no (numeric terms)'],
      tablesQueried: this.tablesFor(vehicleScope),
      dbRawCount: parts.length,
      qualifiedCount: results.length,
      finalCount: mapped.length,
      vehicleScope,
      constraint: gate.outcome,
      retrievalMode: mode,
      truncated,
      ...this.computeBreakdowns(mapped),
    };
    return { results: mapped, constraint: gate.outcome, scope: vehicleScope, truncated };
  }

  private tablesFor(scope: VehicleSearchScope): string[] {
    return scope.active
      ? ['vehicles', 'vehicle_model_map', 'vehicle_type_master', 'parts', 'stock', 'fitment', 'item_references']
      : ['parts', 'stock', 'fitment', 'item_references'];
  }

  private toPositionRequirements(requested: ReturnType<typeof extractRequestedPositions>): PositionRequirements {
    return {
      avant: requested.axes.includes('AV'),
      arriere: requested.axes.includes('AR'),
      gauche: requested.sides.includes('G'),
      droite: requested.sides.includes('D'),
    };
  }

  /** Positions come only from the customer's own words (+ the DB dialect map), never from synonym expansion. */
  private requestedPositionsOf(rawQuery: string) {
    return extractRequestedPositions(rawQuery, (t) => this.normalizedSynonymLookup[t]);
  }

  /** Synonym variants of a typed phrase (DB): "phare" also finds a head noun "OPTIQUE". */
  private synonymVariantsOf(phrase: string): string[] {
    const category = this.normalizedSynonymLookup[phrase];
    if (!category) return [];
    return [category, ...(this.synonymsMap[category] ?? [])];
  }

  /** Tokens that are never part of a part's identity: DB stop-words and vehicle names. */
  private buildIdentityIgnoreSet(): Set<string> {
    const ignore = new Set<string>(this.synonymsService.getStopWords());
    for (const token of this.vehicleModels.getNameTokens()) ignore.add(token);
    return ignore;
  }

  private requestedPartTokensForCandidates(tokens: string[], ignore: ReadonlySet<string>, candidates: any[]): string[] {
    const candidateWords = new Set(
      candidates.flatMap((part) => tokenizeName(
        [part.designation2, part.searchDescription, part.designation].filter(Boolean).join(' '),
      )),
    );
    return buildRequestedPartTokens(tokens, ignore).filter((token) =>
      candidateWords.has(token) ||
      this.isKnownCatalogTerm(token) ||
      !!this.synonymsService.findClosestVocabularyWord(token),
    );
  }

  // ─── Retrieval ──────────────────────────────────────────────────
  /** One group per requested word; a group lists that word and its corrections/synonyms. */
  private buildTermGroups(tokens: string[], ignore: ReadonlySet<string>): string[][] {
    const groups: string[][] = [];
    const seen = new Set<string>();
    for (const token of tokens) {
      if (isColorToken(token) || isPositionToken(token) || isFillerToken(token) || ignore.has(token)) continue;
      const group = this.expandToken(token);
      const key = [...group].sort().join('|');
      if (group.length === 0 || seen.has(key)) continue;
      seen.add(key);
      groups.push(group);
    }
    return groups;
  }

  private expandToken(token: string): string[] {
    const variants = new Set<string>([token]);
    if (token.length > 4 && token.endsWith('s') && !token.endsWith('ss')) variants.add(token.slice(0, -1));

    if (!this.isKnownCatalogTerm(token)) {
      const corrected = this.synonymsService.findClosestVocabularyWord(token);
      // "agraffe" must not be "corrected" into "agrafe": catalogs use both spellings.
      if (corrected && this.sameDoubleLetters(token, corrected)) variants.add(corrected);
    }

    for (const seed of [...variants]) {
      const category = this.findPrimaryCategory(seed);
      if (!category) continue;
      variants.add(this.termOf(category));
      for (const alias of this.synonymsMap[category] ?? []) {
        if (variants.size >= MAX_TERM_VARIANTS) break;
        variants.add(this.termOf(alias));
      }
    }
    return [...variants].filter((variant) => variant.length >= 2);
  }

  private termOf(value: string): string {
    return this.normalize(value).replace(/-/g, ' ');
  }

  private sameDoubleLetters(a: string, b: string): boolean {
    return ['ff', 'pp', 'll'].every((pair) => a.includes(pair) === b.includes(pair));
  }

  private termConditions(group: string[]): any[] {
    return group.flatMap((term) => {
      const spaced = this.normalize(term).replace(/[-/]+/g, ' ').replace(/\s+/g, ' ').trim();
      const variants = [...new Set([spaced, spaced.replace(/\s+/g, '-'), spaced.replace(/\s+/g, '')])]
        .filter(Boolean);
      return variants.flatMap((variant) => [
        { designation2: { contains: variant, mode: 'insensitive' } },
        { searchDescription: { contains: variant, mode: 'insensitive' } },
        { designation: { contains: variant, mode: 'insensitive' } },
        // Only numeric terms can be (part of) a reference.
        ...(/\d/.test(variant)
          ? [
              { reference: { contains: variant, mode: 'insensitive' } },
              { itemReferences: { some: { referenceNo: { contains: variant, mode: 'insensitive' } } } },
            ]
          : []),
      ]);
    });
  }

  private async fetchAccentInsensitiveCandidates(
    groups: string[][],
    scope: VehicleSearchScope,
  ): Promise<any[]> {
    const parameters: unknown[] = [];
    const fields = ['p.designation_2', 'p.search_description', 'p.designation'];
    const accentFold = (field: string) =>
      `translate(lower(COALESCE(${field}, '')), 'àâçéèêëîïôùûüÿ', 'aaceeeeiiouuuy')`;

    const groupConditions = groups.map((group) => {
      const forms = [...new Set(group.flatMap((term) => {
        const spaced = this.normalize(term).replace(/[-/]+/g, ' ').replace(/\s+/g, ' ').trim();
        return [spaced, spaced.replace(/\s+/g, '-'), spaced.replace(/\s+/g, '')].filter(Boolean);
      }))];
      const alternatives = forms.flatMap((form) => {
        parameters.push(`%${form}%`);
        const parameter = `$${parameters.length}`;
        return fields.map((field) => `${accentFold(field)} LIKE ${parameter}`);
      });
      return `(${alternatives.join(' OR ')})`;
    });

    if (scope.active && scope.typeCodes.length > 0) {
      const codes = [...new Set(scope.typeCodes.flatMap((rawCode) => {
        const code = normalizeTypeCode(rawCode);
        return [
          code,
          code.replace(/-TYPE(\d)/g, '-TYPE-$1'),
          code.replace(/-/g, ' '),
          code.replace(/-TYPE(\d)/g, ' TYPE $1'),
        ];
      }))];
      parameters.push(codes);
      groupConditions.push(
        `EXISTS (SELECT 1 FROM fitment f WHERE f.part_reference = p.reference AND f.type_code = ANY($${parameters.length}::text[]))`,
      );
    }

    parameters.push(DB_CANDIDATE_LIMIT);
    const rows = await this.prisma.$queryRawUnsafe<Array<{ id: number }>>(
      `SELECT p.id FROM parts p WHERE ${groupConditions.join(' AND ')} LIMIT $${parameters.length}`,
      ...parameters,
    );
    if (rows.length === 0) return [];

    return this.prisma.part.findMany({
      where: { id: { in: rows.map((row) => row.id) } },
      include: PART_INCLUDE,
      take: DB_CANDIDATE_LIMIT,
    });
  }

  /** True when the word (or one of its variants) occurs in at least one catalog row of the vehicle scope. */
  private async groupExistsInScope(group: string[], scope: VehicleSearchScope, compatibility: any[]): Promise<boolean> {
    const count = await this.prisma.part.count({
      where: { AND: [{ OR: this.termConditions(group) }, ...compatibility] },
    });
    if (count > 0) return true;
    return (await this.fetchAccentInsensitiveCandidates([group], scope)).length > 0;
  }

  private async fetchCandidates(
    groups: string[][],
    scope: VehicleSearchScope,
  ): Promise<{
    parts: any[];
    mode: 'and' | 'relaxed' | 'or' | 'none';
    truncated: boolean;
    droppedGroups: string[][];
  }> {
    if (groups.length === 0) return { parts: [], mode: 'none', truncated: false, droppedGroups: [] };

    const compatibility = scope.active ? [this.buildCompatibilityWhere(scope)] : [];
    const find = (where: any) =>
      this.prisma.part.findMany({ where, include: PART_INCLUDE, take: DB_CANDIDATE_LIMIT });
    const allOf = (subset: string[][]) => ({
      AND: [...subset.map((group) => ({ OR: this.termConditions(group) })), ...compatibility],
    });

    let parts = await find(allOf(groups));
    let mode: 'and' | 'relaxed' | 'or' = 'and';
    let capHit: boolean | null = null;
    let droppedGroups: string[][] = [];

    // PostgreSQL ILIKE does not fold accents without an installed extension.
    if (parts.length === 0) {
      parts = await this.fetchAccentInsensitiveCandidates(groups, scope);
    }

    // Words that exist nowhere in the vehicle's catalog ("disponibilité", "compatible", "mawjoud"...)
    // cannot identify a part. Drop ALL of them at once and require every remaining word.
    if (parts.length === 0 && groups.length > 1) {
      const known = await Promise.all(groups.map((group) => this.groupExistsInScope(group, scope, compatibility)));
      const informative = groups.filter((_, index) => known[index]);
      if (informative.length > 0 && informative.length < groups.length) {
        let rows = await find(allOf(informative));
        if (rows.length === 0) rows = await this.fetchAccentInsensitiveCandidates(informative, scope);
        if (rows.length > 0) {
          parts = rows;
          mode = 'relaxed';
          droppedGroups = groups.filter((_, index) => !known[index]);
          capHit = rows.length >= DB_CANDIDATE_LIMIT;
        }
      }
    }

    // Relaxation: one word of the request may not exist in the catalog (a word added when the
    // question was rephrased). Drop ONE word at a time and keep rows that satisfy all the others.
    if (parts.length === 0 && groups.length > 2) {
      const dropOne = await Promise.all(
        groups.map((_, skipped) => find(allOf(groups.filter((__, index) => index !== skipped)))),
      );
      const merged = new Map<number, any>();
      for (const rows of dropOne) for (const row of rows) merged.set(row.id, row);
      if (merged.size > 0) {
        parts = [...merged.values()];
        mode = 'relaxed';
        capHit = dropOne.some((rows) => rows.length >= DB_CANDIDATE_LIMIT);
      }
    }

    // Last resort: any word.
    if (parts.length === 0 && groups.length > 1) {
      parts = await find({ AND: [{ OR: groups.flatMap((group) => this.termConditions(group)) }, ...compatibility] });
      mode = 'or';
    }
    return { parts, mode, truncated: capHit ?? parts.length >= DB_CANDIDATE_LIMIT, droppedGroups };
  }

  // ─── Ranking (never accepts or rejects) ─────────────────────────
  private rank(part: any, ctx: RankContext, scope?: VehicleSearchScope): number {
    return (
      this.rankReference(part, ctx) +
      this.rankRelevance(part, ctx) +
      this.rankPosition(part, ctx.positionInfo) +
      this.rankBusiness(part, scope)
    );
  }

  private filterByNumericSpecifications(parts: any[], requested: string[]): any[] {
    if (requested.length === 0) return parts;
    return parts.filter((part) => hasNumericSpecifications(
      [part.designation2, part.searchDescription, part.designation].filter(Boolean).join(' '),
      requested,
    ));
  }

  private filterByRequestedColors(parts: any[], requested: string[]): any[] {
    if (requested.length === 0) return parts;
    return parts.filter((part) => {
      const catalogColors = extractColorTokens(part.designation2 || part.designation || '');
      return requested.every((color) => catalogColors.includes(color));
    });
  }

  private rankReference(part: any, ctx: RankContext): number {
    if (!ctx.compactQuery) return 0;
    const refs = [part.reference, ...(part.itemReferences ?? []).map((r: any) => r.referenceNo)]
      .map((ref) => this.normalizeForDB(String(ref ?? '')))
      .filter(Boolean);
    if (refs.some((ref) => ref === ctx.compactQuery)) return RANK.REFERENCE_EXACT;
    if (ctx.compactQuery.length >= 5 && refs.some((ref) => ref.includes(ctx.compactQuery))) return RANK.REFERENCE_CONTAINS;
    return 0;
  }

  private rankRelevance(part: any, ctx: RankContext): number {
    const designations = [part.designation2, part.searchDescription, part.designation].filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    );
    let score = 0;
    if (ctx.compactQuery && designations.some((value) => this.normalizeForDB(value) === ctx.compactQuery)) {
      score += RANK.EXACT_DESIGNATION;
    }
    if (ctx.groups.length === 0) return score;

    const french = this.normalize(part.designation2 || '');
    const english = this.normalize(part.designation || '');
    const searchDescription = this.normalize(part.searchDescription || '');
    const auxiliary = this.normalize(
      [part.categorie, part.fabricant, part.fournisseurCode].filter(Boolean).join(' '),
    );
    const fields: Array<{ text: string; words: string[]; weight: number }> = [
      { text: french, weight: FIELD_WEIGHT.french },
      { text: searchDescription, weight: FIELD_WEIGHT.searchDescription },
      { text: english, weight: FIELD_WEIGHT.english },
      { text: auxiliary, weight: FIELD_WEIGHT.auxiliary },
    ]
      .filter((field) => field.text.length > 0)
      .map((field) => ({ ...field, words: field.text.split(' ').filter(Boolean) }));

    let coverage = 0;
    let fullyCovered = true;
    for (const group of ctx.groups) {
      const best = fields.reduce((acc, field) => (this.groupMatches(group, field.text, field.words) ? Math.max(acc, field.weight) : acc), 0);
      if (best === 0) fullyCovered = false;
      coverage += best;
    }
    score += Math.round((coverage / ctx.groups.length) * RANK.COVERAGE_MAX);
    if (fullyCovered) score += RANK.FULL_COVERAGE_BONUS;

    // Tighter designations first: "PARE CHOC AV" before "PARE CHOC AV COMPLET AVEC ...".
    const shownWords = (french || english).split(' ').filter((w) => w.length >= 2 && !isPositionToken(w) && !isFillerToken(w));
    const extraWords = Math.max(0, shownWords.length - ctx.groups.length);
    score += Math.max(0, RANK.TIGHTNESS_MAX - extraWords * RANK.TIGHTNESS_PER_EXTRA_WORD);
    return score;
  }

  private groupMatches(group: string[], text: string, words: string[]): boolean {
    const padded = ` ${text} `;
    const compactText = text.replace(/\s/g, '');
    return group.some((variant) => {
      if (variant.includes(' ')) return padded.includes(` ${variant} `);
      if (words.some((word) => this.wordsMatch(variant, word))) return true;
      return variant.length >= 4 && compactText.includes(variant);
    });
  }

  private wordsMatch(a: string, b: string): boolean {
    if (a === b) return true;
    const keyA = compactKey([a]);
    const keyB = compactKey([b]);
    return keyA === keyB || keysMatch(keyA, keyB);
  }

  private rankPosition(part: any, info: PositionRequirements): number {
    if (!info.avant && !info.arriere && !info.gauche && !info.droite) return 0;
    const actual = getCatalogPositions(part);
    let score = 0;
    if (info.avant && actual.axes.includes('AV')) score += RANK.POSITION_MATCH;
    if (info.arriere && actual.axes.includes('AR')) score += RANK.POSITION_MATCH;
    if (info.gauche && actual.sides.includes('G')) score += RANK.POSITION_MATCH;
    if (info.droite && actual.sides.includes('D')) score += RANK.POSITION_MATCH;
    return score;
  }

  private rankBusiness(part: any, scope?: VehicleSearchScope): number {
    let score = this.isStockAvailable(part.stock) ? RANK.STOCK_AVAILABLE : 0;

    const fitments: any[] = part.fitments ?? [];
    if (scope?.active && scope.typeCodes.length > 0 && fitments.length > 0) {
      const codes = fitments.map((f) => normalizeTypeCode(f.typeCode));
      const primary = new Set(scope.primaryTypeCodes);
      const inScope = new Set(scope.typeCodes);
      const primaryMatches = codes.filter((c) => primary.has(c)).length;
      const scopeMatches = codes.filter((c) => inScope.has(c)).length;

      if (primaryMatches > 0 && primaryMatches === codes.length) score += RANK.FIT_EXCLUSIVE;
      else if (primaryMatches > 0) score += RANK.FIT_PRIMARY_BASE + Math.round((primaryMatches / codes.length) * RANK.FIT_PRIMARY_SPAN);
      else if (scopeMatches === codes.length) score += RANK.FIT_SCOPE_ONLY;
      else if (scopeMatches > 0) score += Math.round((scopeMatches / codes.length) * RANK.FIT_SCOPE_PARTIAL_SPAN);
    }
    return score;
  }

  // ─── REFERENCE SEARCH ───────────────────────────────────────────
  private async searchByReference(reference: string, vehicleScope: VehicleSearchScope): Promise<PartResult[]> {
    const cleanRef = reference.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const originalRef = reference.toUpperCase();
    const compatibility = this.buildCompatibilityWhere(vehicleScope);

    let results: any[] = await this.prisma.part.findMany({
      where: {
        OR: [
          { reference: { equals: originalRef, mode: 'insensitive' } },
          { reference: { equals: cleanRef, mode: 'insensitive' } },
        ],
      },
      include: PART_INCLUDE,
      take: 5,
    });

    if (results.length === 0) {
      const alternates = await this.prisma.itemReference.findMany({
        where: {
          OR: [
            { referenceNo: { equals: originalRef, mode: 'insensitive' } },
            { referenceNo: { equals: cleanRef, mode: 'insensitive' } },
          ],
        },
        include: { part: { include: PART_INCLUDE } },
        take: 5,
      });
      const byReference = new Map<string, any>();
      for (const alt of alternates) byReference.set(alt.part.reference, alt.part);
      results = [...byReference.values()];
    }

    if (results.length === 0) {
      results = await this.prisma.part.findMany({
        where: {
          AND: [
            {
              OR: [
                { reference: { contains: cleanRef, mode: 'insensitive' } },
                { reference: { contains: originalRef, mode: 'insensitive' } },
                { itemReferences: { some: { referenceNo: { contains: cleanRef, mode: 'insensitive' } } } },
                { itemReferences: { some: { referenceNo: { contains: originalRef, mode: 'insensitive' } } } },
              ],
            },
            ...(vehicleScope.active ? [compatibility] : []),
          ],
        },
        include: PART_INCLUDE,
        take: 10,
      });
    }

    this.logger.log(`[SEARCH] Reference search found ${results.length} results`);
    const mapped = results.map((part) => this.formatPartResult(part, RANK.REFERENCE_EXACT, vehicleScope));
    this.lastSearchDebug = {
      searchType: 'reference',
      originalQuery: reference,
      normalizedQuery: cleanRef,
      hasTunisianDialect: false,
      rawTokens: [reference],
      expandedTerms: [cleanRef],
      mainPartType: null,
      positionInfo: { avant: false, arriere: false, gauche: false, droite: false },
      fieldsSearched: ['reference', 'item_references.reference_no'],
      tablesQueried: this.tablesFor(vehicleScope),
      dbRawCount: mapped.length,
      qualifiedCount: mapped.length,
      finalCount: mapped.length,
      vehicleScope,
      ...this.computeBreakdowns(mapped),
    };
    return mapped;
  }

  // ─── TOKENIZATION ───────────────────────────────────────────────
  private async tokenize(text: string): Promise<string[]> {
    if (!text || text.trim().length === 0) return [];

    // Split on spaces AND hyphens: "pare-brise" → ["pare", "brise"], matching "PARE BRISE AVANT".
    const stopWords = this.synonymsService.getStopWords();
    const parts = text
      .split(/[\s-]+/)
      .map((p) => p.trim())
      .filter((p) => p && !stopWords.has(p));

    const tokens: string[] = [];
    for (const part of parts) tokens.push(...(await this.splitCompound(part, parts.length === 1)));
    return tokens;
  }

  private isKnownCatalogTerm(term: string): boolean {
    const normalized = this.normalize(term);
    return (
      this.normalizedSynonymLookup[normalized] !== undefined ||
      Object.prototype.hasOwnProperty.call(this.synonymsMap, normalized) ||
      this.synonymsService.isKnownAutomotiveTerm(normalized)
    );
  }

  private findPrimaryCategory(token: string): string | null {
    return this.normalizedSynonymLookup[this.normalize(token)] ?? null;
  }

  /**
   * Splits a glued word deterministically, from the live vocabulary:
   *   1. French "pare-" compounds: parachoc / parechoc / parebrises → pare + choc / brise
   *   2. the shortest split into known words / positions ("plaquetteavg")
   *   3. only for a one-word query: the AI, which may insert spaces and nothing else
   */
  private async splitCompound(token: string, allowAi: boolean): Promise<string[]> {
    if (token.length <= 6 || token.length > MAX_SEGMENT_TOKEN_LENGTH || /\d/.test(token)) return [token];

    const pare = token.match(/^par[ae](.{3,})$/);
    if (pare) {
      const rest = pare[1];
      const singular = rest.endsWith('s') ? rest.slice(0, -1) : rest;
      for (const candidate of [rest, singular]) {
        if (this.isKnownCatalogTerm(candidate)) return ['pare', candidate];
      }
    }

    if (this.isKnownCatalogTerm(token) || this.synonymsService.findClosestVocabularyWord(token)) return [token];

    const segmented = this.segmentWithVocabulary(token);
    if (segmented) return segmented;

    if (allowAi) {
      const viaAi = await this.segmentWithAi(token);
      if (viaAi) return viaAi;
    }
    return [token];
  }

  private isSegmentWord(word: string): boolean {
    return isPositionToken(word) || (word.length >= 2 && this.isKnownCatalogTerm(word));
  }

  /** Minimum-segment cover of the token by known words; null when none exists. */
  private segmentWithVocabulary(token: string): string[] | null {
    const n = token.length;
    const best: Array<string[] | null> = new Array(n + 1).fill(null);
    best[0] = [];
    for (let end = 1; end <= n; end++) {
      for (let start = 0; start < end; start++) {
        const previous = best[start];
        if (!previous) continue;
        const word = token.slice(start, end);
        if (!this.isSegmentWord(word)) continue;
        const candidate = [...previous, word];
        const current = best[end];
        if (!current || candidate.length < current.length) best[end] = candidate;
      }
    }
    const result = best[n];
    return result && result.length >= 2 ? result : null;
  }

  private async segmentWithAi(text: string): Promise<string[] | null> {
    if (Date.now() < this.aiSegmentationDisabledUntil) return null;
    try {
      const raw = await this.openaiService.completeJson(
        'You split ONE concatenated French car-parts word into its words. Only insert spaces: never add, remove or change a letter. ' +
          'Positions are avant/av, arriere/ar, gauche/g, droite/d, sup, inf. ' +
          'Return JSON {"segments":["word", ...]}. If unsure, return the original word as a single segment.',
        JSON.stringify({ query: text }),
        100,
        500,
      );
      this.aiSegmentationFailCount = 0;
      const parsed = JSON.parse(raw);
      const words: string[] = Array.isArray(parsed?.segments)
        ? parsed.segments
            .filter((w: unknown): w is string => typeof w === 'string' && w.trim().length > 0)
            .map((w: string) => w.trim().toLowerCase())
        : [];
      const letters = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (words.length < 2 || letters(words.join('')) !== letters(text)) return null;
      this.logger.log(`[AI-SEGMENT] "${text}" → [${words.join(', ')}]`);
      return words;
    } catch (error: any) {
      this.aiSegmentationFailCount++;
      if (this.aiSegmentationFailCount >= AI_SEGMENT_FAIL_THRESHOLD) {
        this.aiSegmentationDisabledUntil = Date.now() + AI_SEGMENT_COOLDOWN_MS;
        this.aiSegmentationFailCount = 0;
        this.logger.error(`[AI-SEGMENT] paused for ${AI_SEGMENT_COOLDOWN_MS / 1000}s: ${error?.message ?? error}`);
      }
      return null;
    }
  }

  // ─── Tunisian dialect ───────────────────────────────────────────
  private dialectRules() {
    const source = this.synonymsService.getTunisianMap();
    if (this.dialectCache?.source === source) return this.dialectCache;

    const lookup = new Map<string, string>();
    for (const [dialect, french] of Object.entries(source)) {
      const key = dialect.toLowerCase().trim();
      if (key) lookup.set(key, french);
    }
    const alternation = [...lookup.keys()]
      .sort((a, b) => b.length - a.length)
      .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const pattern = alternation ? new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternation})(?![\\p{L}\\p{N}])`, 'giu') : null;
    this.dialectCache = { source, lookup, pattern };
    return this.dialectCache;
  }

  /**
   * DB dialect → French, whole words, one pass. A word that is a vehicle name
   * ("new") or already a French catalog word is never translated.
   */
  private applyDialect(query: string): { text: string; applied: boolean } {
    const { pattern, lookup } = this.dialectRules();
    const lowered = query.toLowerCase().trim();
    if (!pattern) return { text: query, applied: false };

    const vehicleWords = this.vehicleModels.getNameTokens();
    const translated = lowered.replace(pattern, (match) => {
      const key = match.toLowerCase();
      const normalized = this.normalize(key);
      if (vehicleWords.has(normalized) || this.normalizedSynonymLookup[normalized] !== undefined) return match;
      return lookup.get(key) ?? match;
    });
    if (translated === lowered) return { text: query, applied: false };

    const seen = new Set<string>();
    const tokens = translated.split(/\s+/).filter((token) => {
      if (!token || seen.has(token)) return false;
      seen.add(token);
      return true;
    });
    this.logger.log(`[SEARCH] Dialect normalized to: "${tokens.join(' ')}"`);
    return { text: tokens.join(' '), applied: true };
  }

  // ─── Text helpers ───────────────────────────────────────────────
  /** MUST stay in sync with SynonymsService.normalize(). */
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private normalizeForDB(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[(),:'.\-\s]/g, '')
      .trim();
  }
}