// src/synonyms/synonyms.service.ts

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SynonymsService implements OnModuleInit {
  private readonly logger = new Logger(SynonymsService.name);

  // FR: normalized(mot) → canonical category (first-wins, same as old buildNormalizedSynonymIndex)
  private normalizedLookup: Record<string, string> = {};
  // FR: canonical → list of variant mots
  private categoryVariants: Record<string, string[]> = {};
  // TN: tunisian mot → french word (for normalizeTunisian)
  private tunisianMap: Record<string, string> = {};
  // Stop-words loaded from DB rows where langue === 'stop'
  private stopWords: Set<string> = new Set();

  constructor(private prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.loadFromDatabase();
  }

  private async loadFromDatabase(): Promise<void> {
    try {
      const rows = await this.prisma.synonym.findMany();

      this.normalizedLookup = {};
      this.categoryVariants = {};
      this.tunisianMap = {};

      for (const row of rows) {
        if (row.langue === 'tn') {
          // Tunisian: mot → canonical (french word)
          this.tunisianMap[row.mot] = row.canonical;
        } else {
          // French: build both lookup structures
          const normalizedMot = this.normalize(row.mot);

          // First-wins for normalized lookup (matches old buildNormalizedSynonymIndex behavior)
          if (!this.normalizedLookup[normalizedMot]) {
            this.normalizedLookup[normalizedMot] = row.canonical;
          }

          // Map the canonical to itself so that canonical tokens are also recognized
          // (e.g. "frein" → "frein"). First-wins: if another row already mapped this
          // normalized canonical to a different category, we do NOT overwrite it.
          const normalizedCanonical = this.normalize(row.canonical);
          if (!this.normalizedLookup[normalizedCanonical]) {
            this.normalizedLookup[normalizedCanonical] = row.canonical;
          }

          // Build category → variants map
          if (!this.categoryVariants[row.canonical]) {
            this.categoryVariants[row.canonical] = [];
          }
          this.categoryVariants[row.canonical].push(row.mot);
        }
      }

      // Load stop-words (rows with langue === 'stop')
      this.stopWords = new Set(
        rows.filter((r) => r.langue === 'stop').map((r) => (r.mot || '').toLowerCase()),
      );

      const frNormCount = Object.keys(this.normalizedLookup).length;
      const frCatCount = Object.keys(this.categoryVariants).length;
      const tnCount = Object.keys(this.tunisianMap).length;
      this.logger.log(
        `✅ SynonymsService loaded ${rows.length} rows — FR normalized: ${frNormCount}, FR categories: ${frCatCount}, TN: ${tnCount}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ Failed to load synonyms from DB — search will work without synonym expansion',
        error,
      );
      this.normalizedLookup = {};
      this.categoryVariants = {};
      this.tunisianMap = {};
    }
  }

  /**
   * normalized(mot) → canonical category. Direct reference for performance.
   * Do NOT mutate the returned object.
   */
  getNormalizedLookup(): Record<string, string> {
    return this.normalizedLookup;
  }

  /**
   * canonical → list of variant mots. Direct reference for performance.
   * Do NOT mutate the returned object.
   */
  getCategoryVariants(): Record<string, string[]> {
    return this.categoryVariants;
  }

  /**
   * Tunisian mot → French word. Direct reference.
   */
  getTunisianMap(): Record<string, string> {
    return this.tunisianMap;
  }

  /** Stop-words exposed as a Set<string> (lowercase) */
  getStopWords(): Set<string> {
    return this.stopWords;
  }

  /** Get the canonical category for a token, or null if not found */
  findCanonical(token: string): string | null {
    return this.normalizedLookup[this.normalize(token)] ?? null;
  }

  /** All canonical category keys */
  getCanonicalCategories(): string[] {
    return Object.keys(this.categoryVariants);
  }

  /** Reload from DB — call this after seeding or admin updates */
  async reload(): Promise<void> {
    this.logger.log('🔄 Reloading synonyms from DB...');
    await this.loadFromDatabase();
  }

  // Must match AdvancedSearchService.normalize() exactly
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

}