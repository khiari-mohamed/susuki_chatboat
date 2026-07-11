// src/synonyms/synonyms.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25):
//
// FIX-1: loadFromDatabase() now also indexes designation_2 (French)
//         canonical terms. When the synonyms table has a row where
//         mot = "retroviseur" and canonical = "retroviseur", the
//         French name is correctly recognized as a known category.
//         Previously only the designation (English OEM) vocabulary
//         was effectively reachable via the synonym index.
//
// FIX-2: Added seedFrenchDesignation2Synonyms() utility — call this
//         once after migration to auto-populate the synonyms table
//         with French terms extracted from designation_2 values.
//         This ensures the NLP index covers all French part names
//         in the catalog without manual data entry.
//
// FIX-3: getNormalizedLookupSize() and getCategoryCount() helpers
//         added for health-check endpoints.
//
// FIX-4: normalize() comment clarifies it MUST stay in sync with
//         AdvancedSearchService.normalize() — any change to one
//         must be applied to both.
//
// NOTE: The core architecture of this service is correct.
//       The synonym table schema (mot, canonical, langue) is sound.
//       These fixes are additive only — no breaking changes.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SynonymsService implements OnModuleInit {
  private readonly logger = new Logger(SynonymsService.name);

  // FR: normalized(mot) → canonical category (first-wins)
  private normalizedLookup: Record<string, string> = {};
  // FR: canonical → list of variant mots
  private categoryVariants: Record<string, string[]> = {};
  // TN: tunisian mot → french word
  private tunisianMap: Record<string, string> = {};
  // Stop-words (rows where langue === 'stop')
  private stopWords: Set<string> = new Set();

  constructor(private prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.loadFromDatabase();
  }

  // ─────────────────────────────────────────────────────────────────
  // Core loader
  // ─────────────────────────────────────────────────────────────────
  private async loadFromDatabase(): Promise<void> {
    try {
      const rows = await this.prisma.synonym.findMany();

      this.normalizedLookup = {};
      this.categoryVariants = {};
      this.tunisianMap      = {};
      this.stopWords        = new Set();

      for (const row of rows) {
        if (row.langue === 'stop') {
          // Stop-words: stored in the synonyms table with langue='stop'
          this.stopWords.add((row.mot || '').toLowerCase());
          continue;
        }

        if (row.langue === 'tn') {
          // Tunisian: mot → canonical (french translation)
          this.tunisianMap[row.mot] = row.canonical;
          continue;
        }

        // French synonym rows (langue = 'fr')
        const normalizedMot = this.normalize(row.mot);

        // First-wins for normalized lookup
        if (!this.normalizedLookup[normalizedMot]) {
          this.normalizedLookup[normalizedMot] = row.canonical;
        }

        // FIX-1: Also index the canonical itself so French part names
        // that ARE the canonical (e.g. mot="retroviseur", canonical="retroviseur")
        // are recognized as known categories when a user types them directly.
        const normalizedCanonical = this.normalize(row.canonical);
        if (!this.normalizedLookup[normalizedCanonical]) {
          this.normalizedLookup[normalizedCanonical] = row.canonical;
        }

        // Build category → variants map
        if (!this.categoryVariants[row.canonical]) {
          this.categoryVariants[row.canonical] = [];
        }
        if (!this.categoryVariants[row.canonical].includes(row.mot)) {
          this.categoryVariants[row.canonical].push(row.mot);
        }
      }

      const frNormCount = Object.keys(this.normalizedLookup).length;
      const frCatCount  = Object.keys(this.categoryVariants).length;
      const tnCount     = Object.keys(this.tunisianMap).length;

      this.logger.log(
        `✅ SynonymsService loaded ${rows.length} rows — ` +
        `FR normalized: ${frNormCount}, FR categories: ${frCatCount}, ` +
        `TN: ${tnCount}, stop-words: ${this.stopWords.size}`,
      );
    } catch (error) {
      this.logger.error(
        '❌ Failed to load synonyms from DB — search will work without synonym expansion',
        error,
      );
      this.normalizedLookup = {};
      this.categoryVariants = {};
      this.tunisianMap      = {};
      this.stopWords        = new Set();
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Public accessors — return direct references for performance.
  // Do NOT mutate the returned objects.
  // ─────────────────────────────────────────────────────────────────

  /** normalized(mot) → canonical category */
  getNormalizedLookup(): Record<string, string> {
    return this.normalizedLookup;
  }

  /** canonical → list of variant mots */
  getCategoryVariants(): Record<string, string[]> {
    return this.categoryVariants;
  }

  /** Tunisian mot → French word */
  getTunisianMap(): Record<string, string> {
    return this.tunisianMap;
  }

  /** Stop-words as Set<string> (lowercase) */
  getStopWords(): Set<string> {
    return this.stopWords;
  }

  /** Get canonical category for a token, or null if not found */
  findCanonical(token: string): string | null {
    return this.normalizedLookup[this.normalize(token)] ?? null;
  }

  /** All canonical category keys */
  getCanonicalCategories(): string[] {
    return Object.keys(this.categoryVariants);
  }

  // FIX-3: Health-check helpers
  getNormalizedLookupSize(): number {
    return Object.keys(this.normalizedLookup).length;
  }

  getCategoryCount(): number {
    return Object.keys(this.categoryVariants).length;
  }

  getTunisianMapSize(): number {
    return Object.keys(this.tunisianMap).length;
  }

  getStopWordCount(): number {
    return this.stopWords.size;
  }

  /** Reload from DB — call after seeding or admin updates */
  async reload(): Promise<void> {
    this.logger.log('🔄 Reloading synonyms from DB...');
    await this.loadFromDatabase();
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: seedFrenchDesignation2Synonyms
  //
  // One-time utility: reads all distinct designation_2 values from
  // the parts table, normalizes each word, and inserts it into the
  // synonyms table as a self-referencing synonym (mot = canonical)
  // with langue = 'fr' — so every French part name is indexed for
  // NLP search without manual data entry.
  //
  // Safe to run multiple times — uses upsert (skipDuplicates).
  //
  // Call via a seed script or admin endpoint:
  //   await synonymsService.seedFrenchDesignation2Synonyms();
  // ─────────────────────────────────────────────────────────────────
  async seedFrenchDesignation2Synonyms(): Promise<{ inserted: number; skipped: number }> {
    this.logger.log('🌱 Seeding French synonyms from designation_2 values...');

    // French stop-words to exclude from seeding
    const frenchStopWords = new Set([
      'de', 'du', 'la', 'le', 'les', 'des', 'et', 'en', 'sur', 'sous', 'par',
      'ou', 'car', 'un', 'une', 'pour', 'avec', 'sans', 'tout', 'tous',
      'av', 'ar', 'sup', 'inf', 'int', 'ext', 'lh', 'rh', 'fr', 'rr',
      'assy', 'comp', 'set', 'kit', 'sub', 'and', 'the',
    ]);

    // Fetch all distinct designation_2 values that are non-empty
    const parts = await this.prisma.$queryRaw<{ designation_2: string }[]>`
      SELECT DISTINCT designation_2
      FROM parts
      WHERE designation_2 IS NOT NULL
        AND TRIM(designation_2) <> ''
    `;

    this.logger.log(`Found ${parts.length} distinct designation_2 values to process`);

    const toInsert: { mot: string; canonical: string; langue: string }[] = [];
    const seen = new Set<string>();

    for (const { designation_2 } of parts) {
      const normalized = this.normalize(designation_2);
      // Split into individual tokens
      const tokens = normalized
        .split(/[\s\-\/\(\)]+/)
        .filter((t) => t.length >= 3 && !frenchStopWords.has(t) && !/^\d+$/.test(t));

      for (const token of tokens) {
        if (seen.has(token)) continue;
        seen.add(token);

        toInsert.push({
          mot:      token,
          canonical: token,   // self-referencing: French term IS its own canonical
          langue:   'fr',
        });
      }

      // Also seed the full normalized phrase as a canonical (for exact multi-word matching)
      if (normalized.length >= 3 && !seen.has(normalized)) {
        seen.add(normalized);
        toInsert.push({
          mot:      normalized,
          canonical: normalized,
          langue:   'fr',
        });
      }
    }

    this.logger.log(`Prepared ${toInsert.length} synonym rows to upsert`);

    // Batch insert — skip duplicates (unique constraint on mot + langue)
    let inserted = 0;
    let skipped  = 0;
    const BATCH  = 200;

    for (let i = 0; i < toInsert.length; i += BATCH) {
      const batch = toInsert.slice(i, i + BATCH);
      try {
        const result = await this.prisma.synonym.createMany({
          data:          batch,
          skipDuplicates: true,
        });
        inserted += result.count;
        skipped  += batch.length - result.count;
      } catch (err) {
        this.logger.error(`Batch ${i / BATCH + 1} failed:`, err);
        skipped += batch.length;
      }
    }

    this.logger.log(`✅ Seeding complete — inserted: ${inserted}, skipped (already existed): ${skipped}`);

    // Reload in-memory index after seeding
    await this.reload();

    return { inserted, skipped };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: normalize() — MUST stay in sync with AdvancedSearchService.normalize()
  // If you change this, change AdvancedSearchService.normalize() too.
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
}