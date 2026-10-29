import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Aliases the data cannot infer (generation/variant spellings → model family).
 * Longer term these belong in vehicle_model_map; unknown variants that merely
 * CONTAIN a known model name ("CELERIO GL-POP") are resolved without an alias.
 */
export const MODEL_ALIASES: Record<string, string> = {
  'NEW CIAZ': 'CIAZ',
  'NEW CELERIO POP 6AB': 'CELERIO',
  'SWIFT IV': 'SWIFT',
  'JIMNY 5D AT': 'JIMNY',
  SPRESSO: 'S-PRESSO',
  'S PRESSO': 'S-PRESSO',
  WAGONR: 'WAGON R',
  'WAGON-R': 'WAGON R',
  'NEW CELERIO': 'CELERIO',
  'NEW SWIFT': 'SWIFT',
  'SWIFT 4': 'SWIFT',
  'NEW BALENO': 'BALENO',
  'BALENO 2': 'BALENO',
  'NEW DZIRE': 'DZIRE',
  'DZIRE 2': 'DZIRE',
  'NEW FRONX': 'FRONX',
};

/** Emergency list, used only when the very first load from the database fails. */
const FALLBACK_MODELS = ['CELERIO', 'CIAZ', 'SWIFT', 'S-PRESSO', 'BALENO', 'VITARA', 'JIMNY', 'IGNIS', 'DZIRE', 'FRONX'];

interface ModelDetector {
  phrase: string;
  canonical: string;
  regex: RegExp;
}

function toDetectionText(text: string): string {
  return (text || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function phraseRegex(phrase: string): RegExp {
  const pattern = phrase
    .split(' ')
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s+');
  return new RegExp(`(^|\\s)${pattern}(\\s|$)`);
}

@Injectable()
export class VehicleModelsService implements OnModuleInit {
  private readonly logger = new Logger(VehicleModelsService.name);
  private models: string[] = [];
  private modelsSet: Set<string> = new Set();
  private loaded = false;
  private detectors: ModelDetector[] = [];
  private nameTokens: Set<string> = new Set();

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadModels();
  }

  private async loadModels() {
    try {
      const rows = await this.prisma.vehicle.findMany({
        select: { modele: true },
        distinct: ['modele'],
        where: { modele: { not: null }, marque: { equals: 'SUZUKI', mode: 'insensitive' } },
      });

      this.models = rows
        .map((r) => r.modele?.toUpperCase().trim())
        .filter((m): m is string => !!m)
        .sort();
      this.modelsSet = new Set(this.models);
      this.loaded = true;
      this.rebuildIndex();
      this.logger.log(`✅ Loaded ${this.models.length} Suzuki models from database: ${this.models.join(', ')}`);
    } catch (error) {
      if (this.loaded) {
        this.logger.error('❌ Vehicle models reload failed — keeping the previous list', error);
        return;
      }
      this.logger.error('❌ Failed to load vehicle models from database:', error);
      this.models = [...FALLBACK_MODELS];
      this.modelsSet = new Set(this.models);
      this.rebuildIndex();
      this.logger.warn(`⚠️ Using fallback model list: ${this.models.join(', ')}`);
    }
  }

  /** Detectors are ordered longest phrase first, so "NEW CELERIO POP 6AB" wins over "CELERIO". */
  private rebuildIndex(): void {
    const byPhrase = new Map<string, string>();
    const add = (phrase: string, canonical: string) => {
      const key = toDetectionText(phrase);
      if (!key) return;
      const tokens = key.split(' ');
      if (tokens.length === 1 && tokens[0].length < 3) return; // "S" alone is not a model
      if (!byPhrase.has(key)) byPhrase.set(key, canonical);
    };
    for (const [alias, canonical] of Object.entries(MODEL_ALIASES)) add(alias, canonical); // aliases win over raw models
    for (const model of this.models) add(model, model);

    this.detectors = [...byPhrase.entries()]
      .sort(([a], [b]) => b.length - a.length)
      .map(([phrase, canonical]) => ({ phrase, canonical, regex: phraseRegex(phrase) }));

    const tokens = new Set<string>();
    for (const { phrase, canonical } of this.detectors) {
      for (const token of [...phrase.split(' '), ...toDetectionText(canonical).split(' ')]) {
        if (token.length >= 2) tokens.add(token.toLowerCase());
      }
    }
    this.nameTokens = tokens;
  }

  getAll(): string[] {
    return [...this.models];
  }

  /**
   * Lower-case words that belong to vehicle names ("new", "swift", "celerio"…).
   * The search ignores them when deciding which PART was asked for.
   * The returned set is shared: do not mutate it.
   */
  getNameTokens(): ReadonlySet<string> {
    return this.nameTokens;
  }

  /**
   * Model family for a model / model description, or null.
   * Order: alias → exact model → same model ignoring hyphens/spaces →
   * the longest known model contained in the text as whole words.
   */
  normalize(model?: string): string | null {
    if (!model) return null;
    const upper = model.toUpperCase().trim();
    if (!upper) return null;

    if (MODEL_ALIASES[upper]) return MODEL_ALIASES[upper];
    if (this.modelsSet.has(upper)) return upper;

    const compact = upper.replace(/[-\s]/g, '');
    const sameModel = this.models.find((m) => m.replace(/[-\s]/g, '') === compact);
    if (sameModel) return sameModel;
    const sameAlias = Object.entries(MODEL_ALIASES).find(([alias]) => alias.replace(/[-\s]/g, '') === compact);
    if (sameAlias) return sameAlias[1];

    return this.detectModelInText(upper);
  }

  exists(model: string): boolean {
    return this.normalize(model) !== null;
  }

  private getCombinedDesignation(part: any): string {
    const french = (part?.designation2 ?? part?.designation_2 ?? '').trim();
    const english = (part?.designation ?? '').trim();
    if (french.toLowerCase() === english.toLowerCase()) return french;
    return `${french} ${english}`.trim();
  }

  /** Does the designation (string or part row) name a vehicle model? Whole words only. */
  hasModelInDesignation(designationOrPart: string | any): boolean {
    const text = toDetectionText(
      typeof designationOrPart === 'string' ? designationOrPart : this.getCombinedDesignation(designationOrPart),
    );
    return this.detectors.some((detector) => detector.regex.test(text));
  }

  /** Does the designation name this model? Tolerates "S PRESSO" ≡ "SPRESSO". */
  matchesModel(designationOrPart: string | any, model: string): boolean {
    const text = toDetectionText(
      typeof designationOrPart === 'string' ? designationOrPart : this.getCombinedDesignation(designationOrPart),
    );
    const wanted = toDetectionText(model);
    if (!wanted) return false;
    if (phraseRegex(wanted).test(text)) return true;

    const compactWanted = wanted.replace(/\s/g, '');
    const tokens = text.split(' ');
    for (let size = 1; size <= 3; size++) {
      for (let start = 0; start + size <= tokens.length; start++) {
        if (tokens.slice(start, start + size).join('') === compactWanted) return true;
      }
    }
    return false;
  }

  /** Longest model / alias phrase found in the text as whole words, or null. */
  detectModelInText(text: string): string | null {
    const normalized = toDetectionText(text);
    if (!normalized) return null;
    return this.detectors.find((detector) => detector.regex.test(normalized))?.canonical ?? null;
  }

  async reload(): Promise<void> {
    await this.loadModels();
  }
}