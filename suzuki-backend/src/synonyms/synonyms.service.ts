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
  // TYPO: known misspelling (mot) → correct spelling (canonical),
  // rows where langue === 'typo'. DB-managed via /admin/synonyms —
  // AIQueryNormalizerService merges this OVER its small static seed
  // map so new typos are fixable from the admin dashboard with no
  // deploy. Empty until someone adds rows or runs the one-off seed
  // script (suzuki-backend/seed-typo-corrections.ts).
  private typoMap: Record<string, string> = {};
  // Fuzzy-match vocabulary — every known single-word French term,
  // normalized. Built in loadFromDatabase(). See isKnownAutomotiveTerm's
  // sibling below, findClosestVocabularyWord().
  private vocabularyWords: Set<string> = new Set();

  // ─────────────────────────────────────────────────────────────────
  // Safety-net vocabulary used by isKnownAutomotiveTerm() ONLY when the
  // DB-driven synonym index doesn't already recognize a term (e.g. a
  // fresh install before seedFrenchDesignation2Synonyms() has run, or
  // the DB failing to load — see loadFromDatabase() catch block).
  // This is the union of the three carPartNames lists that used to be
  // hand-maintained separately in AIQueryNormalizerService,
  // ChatOrchestratorService and IntelligenceService. Keeping ONE copy
  // here — as a fallback, not the primary source — removes the "edit
  // one, forget the other two" bug risk while changing no observable
  // behavior for terms the DB already knows about.
  private static readonly STATIC_FALLBACK_PART_TERMS: string[] = [
    'maitre', 'maître', 'cylindre', 'etrier', 'étrier', 'frein', 'frina',
    'plaquette', 'plaquettes', 'disque', 'disques', 'tambour', 'sabot',
    'amortisseur', 'amortisseurs', 'ressort', 'rotule', 'triangle', 'biellette',
    'bras', 'cremaillere', 'crémaillère', 'silent', 'silentbloc', 'coupelle',
    'moyeu', 'roulement', 'roulements', 'soufflet', 'stabilisatrice',
    'culasse', 'piston', 'segment', 'bielle', 'vilebrequin', 'vilbrequin',
    'soupape', 'joint', 'joints', 'courroie', 'distribution', 'tendeur',
    'poulie', 'volant', 'cardan', 'embrayage', 'filtre', 'filtres',
    'batterie', 'alternateur', 'démarreur', 'demarreur', 'bougie', 'bougies',
    'bobine', 'capteur', 'capteurs', 'calculateur', 'faisceau', 'fusible',
    'relais', 'contacteur', 'commodo', 'commande', 'radar',
    'radiateur', 'durite', 'durites', 'pompe', 'thermostat', 'condenseur',
    'compresseur', 'vase', 'reservoir', 'réservoir',
    'injecteur', 'injecteurs', 'silencieux', 'echappement', 'échappement',
    'catalyseur', 'collecteur',
    'aile', 'capot', 'porte', 'pare', 'choc', 'parechoc', 'pare-choc',
    'calandre', 'malle', 'coffre', 'vitre', 'lunette', 'parebrise',
    'pare-brise', 'baguette', 'moulure', 'seuil', 'longeron', 'traverse',
    'renfort', 'tablier', 'plancher', 'toit', 'custode', 'hayon',
    'charniere', 'charnière', 'serrure', 'loquet', 'poignee', 'poignée',
    'garniture', 'enjoliveur',
    'phare', 'phares', 'feu', 'feux', 'optique', 'clignotant', 'clignotants',
    'catadioptre', 'lampe', 'ampoule',
    'siege', 'sièges', 'ceinture', 'tableau', 'tapis', 'airbag',
    'retroviseur', 'rétroviseur', 'retro',
    'essuie', 'balai', 'leve', 'monte',
    'agrafe', 'agraffe', 'agraphe', 'agrafes', 'agraffes', 'agraphes',
    'valve', 'cache', 'support', 'clip', 'vis', 'boulon',
    'ecrou', 'rondelle', 'cric', 'antenne', 'klaxon',
    'pneu', 'tuyau', 'suspension',
  ];

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
      this.typoMap          = {};

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

        if (row.langue === 'typo') {
          // Typo correction: mot (the misspelling) → canonical (correct
          // spelling). Keyed lowercase — AIQueryNormalizerService matches
          // case-insensitively against the raw user query.
          this.typoMap[(row.mot || '').toLowerCase()] = row.canonical;
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
      const typoCount   = Object.keys(this.typoMap).length;

      // Fuzzy-match vocabulary: every single-word (no spaces) known term,
      // normalized. Built from whatever the DB actually knows — grows the
      // moment new synonyms/canonicals are added, no separate maintenance.
      this.vocabularyWords = new Set<string>();
      for (const key of Object.keys(this.normalizedLookup)) {
        if (key.length >= 3 && !key.includes(' ')) this.vocabularyWords.add(key);
      }
      for (const canonical of Object.keys(this.categoryVariants)) {
        const n = this.normalize(canonical);
        if (n.length >= 3 && !n.includes(' ')) this.vocabularyWords.add(n);
      }
      for (const term of SynonymsService.STATIC_FALLBACK_PART_TERMS) {
        const n = this.normalize(term);
        if (n.length >= 3 && !n.includes(' ')) this.vocabularyWords.add(n);
      }

      this.logger.log(
        `✅ SynonymsService loaded ${rows.length} rows — ` +
        `FR normalized: ${frNormCount}, FR categories: ${frCatCount}, ` +
        `TN: ${tnCount}, TYPO: ${typoCount}, stop-words: ${this.stopWords.size}`,
      );
      if (typoCount === 0) {
        this.logger.warn(
          '⚠️ No langue=\'typo\' rows in synonyms table — AIQueryNormalizerService ' +
          'is running on its static fallback corrections only. Run ' +
          'seed-typo-corrections.ts (or add rows via /admin/synonyms) to manage ' +
          'typo corrections from the dashboard without a deploy.',
        );
      }
    } catch (error) {
      this.logger.error(
        '❌ Failed to load synonyms from DB — search will work without synonym expansion',
        error,
      );
      this.normalizedLookup = {};
      this.categoryVariants = {};
      this.tunisianMap      = {};
      this.stopWords        = new Set();
      this.typoMap          = {};
      this.vocabularyWords  = new Set();
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

  /** Known misspelling (lowercase) → correct spelling. DB-managed, langue='typo'. */
  getTypoMap(): Record<string, string> {
    return this.typoMap;
  }

  // ─────────────────────────────────────────────────────────────────
  // isKnownAutomotiveTerm — SINGLE shared replacement for the three
  // hand-maintained `carPartNames` arrays that used to live separately
  // in AIQueryNormalizerService, ChatOrchestratorService and
  // IntelligenceService (same intent, three copies that could silently
  // drift apart). Dynamic first (DB synonym index — grows the moment
  // someone adds a row via /admin/synonyms or runs
  // seedFrenchDesignation2Synonyms(), no deploy needed), then a static
  // safety net so behavior never regresses on a fresh/unmigrated DB.
  //
  // Matching is done word-by-word (and on adjacent word pairs, since
  // some canonical categories are two words, e.g. "pare brise") against
  // the normalized lookup — O(words in text), not O(size of index) —
  // so this stays cheap to call per message from multiple services.
  // ─────────────────────────────────────────────────────────────────
  isKnownAutomotiveTerm(text: string): boolean {
    if (!text) return false;
    const normalized = this.normalize(text);
    const words = normalized.split(' ').filter(Boolean);

    for (const word of words) {
      if (word.length >= 3 && this.normalizedLookup[word]) return true;
    }
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (this.normalizedLookup[phrase]) return true;
    }

    // Static fallback — substring match, matching the original
    // per-service `.includes()` behavior exactly, so nothing that used
    // to be recognized stops being recognized.
    return SynonymsService.STATIC_FALLBACK_PART_TERMS.some((term) =>
      normalized.includes(this.normalize(term)),
    );
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

  getTypoMapSize(): number {
    return Object.keys(this.typoMap).length;
  }

  getVocabularySize(): number {
    return this.vocabularyWords.size;
  }

  // ─────────────────────────────────────────────────────────────────
  // findClosestVocabularyWord — the actual answer to "I can't predict
  // every wrong word": instead of enumerating known typos, measure edit
  // distance between the unrecognized word and every word the DB
  // already knows about (vocabularyWords, built in loadFromDatabase()
  // from real catalog data), and auto-correct to the closest one IF
  // it's an unambiguous, plausible match. No new typo needs a
  // hardcoded or DB entry — any misspelling of a word already in the
  // vocabulary gets caught automatically.
  //
  // Deliberately conservative to avoid mangling valid-but-rare words:
  //  - word itself, length, and threshold gate false positives
  //  - the winning candidate must be STRICTLY closer than the runner-up
  //    (an ambiguous tie between two different corrections → no
  //    correction, safer to leave it for the AI / pass through as-is)
  //  - distance budget shrinks relative to word length, so short words
  //    need a near-exact match, long words tolerate a couple of typos
  //
  // Returns the corrected word, or null if no confident correction.
  // ─────────────────────────────────────────────────────────────────
  findClosestVocabularyWord(word: string): string | null {
    const normalized = this.normalize(word);
    if (normalized.length < 4 || normalized.includes(' ')) return null;
    if (this.vocabularyWords.has(normalized)) return null; // already correct

    const maxDistance =
      normalized.length <= 5 ? 1 :
      normalized.length <= 9 ? 2 : 3;

    let best: string | null = null;
    let bestDist = Infinity;
    let secondBestDist = Infinity;

    for (const candidate of this.vocabularyWords) {
      // Cheap pre-filter: distance can never be less than the length
      // difference, so skip candidates that are already out of budget.
      if (Math.abs(candidate.length - normalized.length) > maxDistance) continue;

      const dist = SynonymsService.levenshtein(normalized, candidate);
      if (dist < bestDist) {
        secondBestDist = bestDist;
        bestDist = dist;
        best = candidate;
      } else if (dist < secondBestDist && candidate !== best) {
        secondBestDist = dist;
      }
    }

    if (best && bestDist <= maxDistance && bestDist < secondBestDist) {
      return best;
    }
    return null;
  }

  private static levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b.charAt(i - 1) === a.charAt(j - 1)
            ? matrix[i - 1][j - 1]
            : Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1,
              );
      }
    }
    return matrix[b.length][a.length];
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