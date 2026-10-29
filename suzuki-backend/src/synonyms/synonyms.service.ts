// src/synonyms/synonyms.service.ts
// ═══════════════════════════════════════════════════════════════════
// The DB synonym index is the vocabulary of the chatbot. Bundled static
// terms exist ONLY as an emergency net when no usable DB index is loaded
// (fresh install, or DB unreachable at boot).
//
// Behaviour notes
//  - Lookup tables have no prototype: "constructor" is just a word.
//  - A failed RELOAD keeps the previous index; only a failed first load
//    falls back to the emergency vocabulary.
//  - hasCatalogDesignationConcept() searches ONE prebuilt corpus (native
//    includes) instead of scanning every designation per candidate; the
//    corpus is refreshed in the background (stale-while-revalidate).
//  - normalize() MUST stay in sync with AdvancedSearchService.normalize().
// ═══════════════════════════════════════════════════════════════════

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isPositionToken, levenshtein } from '../chat/part-constraints';

type StringMap = Record<string, string>;

interface SynonymRow {
  mot: string;
  canonical: string;
  langue: string;
}

interface CatalogCorpus {
  /** " d1 | d2 | ... " — padded, so ` word ` matches whole words without crossing designations. */
  padded: string;
  /** Space-free designations joined with "|". */
  compact: string;
}

/** Wrong pairs known to exist in the data. The right fix is deleting the row (see comment at use). */
const KNOWN_BAD_SYNONYM_PAIRS: ReadonlyArray<readonly [string, string]> = [['palier', 'tablier']];

/** Emergency vocabulary: used only when no DB synonym index is available. */
const STATIC_FALLBACK_PART_TERMS: readonly string[] = [
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
  'essuie', 'balai', 'leve', 'monte', 'lecheur',
  'agrafe', 'agraffe', 'agraphe', 'agrafes', 'agraffes', 'agraphes',
  'valve', 'cache', 'support', 'clip', 'vis', 'boulon',
  'ecrou', 'rondelle', 'cric', 'antenne', 'klaxon',
  'pneu', 'tuyau', 'suspension',
];

/** Same normalization as AdvancedSearchService.normalize() — keep in sync. */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Edit distance where swapping two adjacent letters counts as one edit ("condutceur" → "conducteur"). */
function osaDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

const FALLBACK_TERM_SET: ReadonlySet<string> = new Set(STATIC_FALLBACK_PART_TERMS.map(normalizeText));

const CATALOG_CORPUS_TTL_MS = 60_000;
const CLOSEST_WORD_CACHE_MAX = 2000;
const SEED_MAX_PHRASE_TOKENS = 3;

@Injectable()
export class SynonymsService implements OnModuleInit {
  private readonly logger = new Logger(SynonymsService.name);

  // FR: normalized(mot) → canonical category (first-wins)
  private normalizedLookup: StringMap = Object.create(null);
  // FR: canonical → list of variant mots
  private categoryVariants: Record<string, string[]> = Object.create(null);
  // TN: tunisian mot (lowercase) → french word
  private tunisianMap: StringMap = Object.create(null);
  // Stop-words (langue === 'stop')
  private stopWords: Set<string> = new Set();
  // TYPO: misspelling (lowercase) → correct spelling. DB-managed via /admin/synonyms.
  private typoMap: StringMap = Object.create(null);
  // Fuzzy-match vocabulary: DB terms, plus emergency terms only when the DB index is unavailable.
  private vocabularyWords: Set<string> = new Set();
  private dbIndexAvailable = false;
  private loaded = false;

  private interpretationCandidates: Record<string, string[]> | null = null;
  private closestWordCache = new Map<string, string | null>();

  private catalogCorpus: CatalogCorpus | null = null;
  private catalogCorpusAt = 0;
  private catalogCorpusLoad: Promise<CatalogCorpus> | null = null;
  private catalogWordFreq = new Map<string, number>();
  private catalogWordsByLength = new Map<number, string[]>();
  private catalogWordCache = new Map<string, string | null>();

  constructor(private prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.loadFromDatabase();
  }

  // ─────────────────────────────────────────────────────────────────
  // Core loader
  // ─────────────────────────────────────────────────────────────────
  private async loadFromDatabase(): Promise<void> {
    try {
      const rows: SynonymRow[] = await this.prisma.synonym.findMany();
      this.applyRows(rows);
      this.loaded = true;

      this.logger.log(
        `✅ SynonymsService loaded ${rows.length} rows — ` +
        `FR normalized: ${Object.keys(this.normalizedLookup).length}, ` +
        `FR categories: ${Object.keys(this.categoryVariants).length}, ` +
        `TN: ${Object.keys(this.tunisianMap).length}, TYPO: ${Object.keys(this.typoMap).length}, ` +
        `stop-words: ${this.stopWords.size}`,
      );
      if (Object.keys(this.typoMap).length === 0) {
        this.logger.warn(
          "⚠️ No langue='typo' rows in synonyms table — the normalizer runs on its static fallback " +
          'corrections only. Add rows via /admin/synonyms to manage typos without a deploy.',
        );
      }
    } catch (error) {
      if (this.loaded) {
        this.logger.error('❌ Synonym reload failed — keeping the previous index', error);
        return;
      }
      this.logger.error('❌ Failed to load synonyms from DB — running on the emergency vocabulary', error);
      this.applyRows([]);
    }
  }

  /** Builds every table from the rows, then swaps them in one go (no half-built state). */
  private applyRows(rows: SynonymRow[]): void {
    const normalizedLookup: StringMap = Object.create(null);
    const categoryVariants: Record<string, string[]> = Object.create(null);
    const tunisianMap: StringMap = Object.create(null);
    const typoMap: StringMap = Object.create(null);
    const stopWords = new Set<string>();

    for (const row of rows) {
      const mot = (row.mot || '').trim();
      if (row.langue === 'stop') {
        stopWords.add(mot.toLowerCase());
        continue;
      }
      if (row.langue === 'tn') {
        tunisianMap[mot.toLowerCase()] = row.canonical;
        continue;
      }
      if (row.langue === 'typo') {
        typoMap[mot.toLowerCase()] = row.canonical;
        continue;
      }

      // French synonym rows (langue = 'fr')
      const normalizedMot = this.normalize(row.mot);
      const normalizedCanonical = this.normalize(row.canonical);
      // Data-quality guard. Permanent fix: DELETE FROM synonyms WHERE mot='palier' AND canonical='tablier';
      if (KNOWN_BAD_SYNONYM_PAIRS.some(([mot_, canonical_]) => mot_ === normalizedMot && canonical_ === normalizedCanonical)) {
        continue;
      }

      // First-wins for the normalized lookup; the canonical itself is indexed too.
      if (!normalizedLookup[normalizedMot]) normalizedLookup[normalizedMot] = row.canonical;
      if (!normalizedLookup[normalizedCanonical]) normalizedLookup[normalizedCanonical] = row.canonical;

      const variants = categoryVariants[row.canonical] ?? (categoryVariants[row.canonical] = []);
      if (!variants.includes(row.mot)) variants.push(row.mot);
    }

    const dbIndexAvailable = rows.some((row) => !['stop', 'tn', 'typo'].includes(row.langue));

    // Fuzzy vocabulary: every single-word known term. Grows with the DB, no separate maintenance.
    const vocabularyWords = new Set<string>();
    for (const key of Object.keys(normalizedLookup)) {
      if (key.length >= 3 && !key.includes(' ')) vocabularyWords.add(key);
    }
    for (const canonical of Object.keys(categoryVariants)) {
      const n = this.normalize(canonical);
      if (n.length >= 3 && !n.includes(' ')) vocabularyWords.add(n);
    }
    if (!dbIndexAvailable) {
      for (const term of FALLBACK_TERM_SET) {
        if (term.length >= 3 && !term.includes(' ')) vocabularyWords.add(term);
      }
    }

    this.normalizedLookup = normalizedLookup;
    this.categoryVariants = categoryVariants;
    this.tunisianMap = tunisianMap;
    this.typoMap = typoMap;
    this.stopWords = stopWords;
    this.vocabularyWords = vocabularyWords;
    this.dbIndexAvailable = dbIndexAvailable;
    this.interpretationCandidates = null;
    this.closestWordCache.clear();
  }

  // ─────────────────────────────────────────────────────────────────
  // Public accessors — direct references for performance. Do NOT mutate.
  // ─────────────────────────────────────────────────────────────────

  /** normalized(mot) → canonical category */
  getNormalizedLookup(): Record<string, string> {
    return this.normalizedLookup;
  }

  /** canonical → list of variant mots */
  getCategoryVariants(): Record<string, string[]> {
    return this.categoryVariants;
  }

  /**
   * canonical → [canonical, ...variants], from the DB index (or the emergency
   * vocabulary when none is loaded). The same object is returned until the next
   * reload, so callers may cache derived data on its identity.
   */
  getInterpretationCandidates(): Record<string, string[]> {
    if (this.interpretationCandidates) return this.interpretationCandidates;

    const candidates: Record<string, string[]> = Object.create(null);
    for (const [canonical, variants] of Object.entries(this.categoryVariants)) {
      candidates[canonical] = [...new Set([canonical, ...variants])];
    }
    if (!this.dbIndexAvailable) {
      for (const term of STATIC_FALLBACK_PART_TERMS) {
        if (!candidates[term]) candidates[term] = [term];
      }
    }
    this.interpretationCandidates = candidates;
    return candidates;
  }

  /** Does the catalog contain a designation using this concept (canonical or any variant)? */
  async hasCatalogDesignationConcept(canonical: string, variants: string[]): Promise<boolean> {
    const corpus = await this.getCatalogCorpus();
    const candidates = [...new Set([canonical, ...variants].map((value) => this.normalize(value)))].filter(Boolean);

    return candidates.some((candidate) => {
      if (corpus.padded.includes(` ${candidate} `)) return true;
      const compact = candidate.replace(/\s/g, '');
      return compact.length >= 4 && corpus.compact.includes(compact);
    });
  }

  private async getCatalogCorpus(): Promise<CatalogCorpus> {
    const fresh = this.catalogCorpus && Date.now() - this.catalogCorpusAt < CATALOG_CORPUS_TTL_MS;
    if (fresh && this.catalogCorpus) return this.catalogCorpus;

    if (!this.catalogCorpusLoad) {
      this.catalogCorpusLoad = this.refreshCatalogCorpus().finally(() => {
        this.catalogCorpusLoad = null;
      });
    }
    // Stale-while-revalidate: answer from the previous corpus while the refresh runs.
    return this.catalogCorpus ?? this.catalogCorpusLoad;
  }

  /** Never rejects: on failure the previous corpus (or an empty one) is used. */
  private async refreshCatalogCorpus(): Promise<CatalogCorpus> {
    try {
      const parts = await this.prisma.part.findMany({ select: { designation: true, designation2: true } });
      const designations = new Set<string>();
      for (const part of parts) {
        for (const raw of [part.designation2, part.designation]) {
          if (typeof raw !== 'string') continue;
          const normalized = this.normalize(raw);
          if (normalized) designations.add(normalized);
        }
      }
      const list = [...designations];
      const freq = new Map<string, number>();
      for (const designation of list) {
        for (const word of new Set(designation.split(/[\s-]+/))) {
          if (word.length >= 4 && /^[a-z]+$/.test(word)) freq.set(word, (freq.get(word) ?? 0) + 1);
        }
      }
      const byLength = new Map<number, string[]>();
      for (const word of freq.keys()) {
        const bucket = byLength.get(word.length) ?? [];
        bucket.push(word);
        byLength.set(word.length, bucket);
      }
      this.catalogWordFreq = freq;
      this.catalogWordsByLength = byLength;
      this.catalogWordCache.clear();
      this.catalogCorpus = {
        padded: ` ${list.join(' | ')} `,
        compact: list.map((designation) => designation.replace(/\s/g, '')).join('|'),
      };
      this.catalogCorpusAt = Date.now();
    } catch (error) {
      this.logger.error('❌ Failed to refresh the catalog designation corpus', error);
      if (this.catalogCorpus) this.catalogCorpusAt = Date.now(); // back off, keep serving the stale corpus
    }
    return this.catalogCorpus ?? { padded: ' ', compact: '' };
  }

  /** Tunisian mot (lowercase) → French word */
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
  // isKnownAutomotiveTerm — the single shared "is this a car-part word?"
  // check. DB index first (words and 2–3 word phrases, O(words)); the
  // emergency vocabulary is consulted only when no usable index is loaded,
  // and then token by token ("vis" never matches "avis").
  // ─────────────────────────────────────────────────────────────────
  isKnownAutomotiveTerm(text: string): boolean {
    if (!text) return false;
    const normalized = this.normalize(text);
    const words = normalized.split(' ').filter(Boolean);

    for (let size = 1; size <= 3; size++) {
      for (let i = 0; i + size <= words.length; i++) {
        const phrase = words.slice(i, i + size).join(' ');
        if (size === 1 && phrase.length < 3) continue;
        if (this.normalizedLookup[phrase]) return true;
      }
    }

    if (!this.dbIndexAvailable) {
      return normalized.split(/[\s-]+/).some((token) => FALLBACK_TERM_SET.has(token));
    }
    return false;
  }

  /** Canonical category for a token, or null if not found */
  findCanonical(token: string): string | null {
    return this.normalizedLookup[this.normalize(token)] ?? null;
  }

  /** All canonical category keys */
  getCanonicalCategories(): string[] {
    return Object.keys(this.categoryVariants);
  }

  // Health-check helpers
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
  // findClosestVocabularyWord — measures edit distance between an unknown
  // word and the words the DB already knows, and corrects only when the
  // match is unambiguous (strictly closer than the runner-up; the budget
  // shrinks with word length). Returns null when the word is already known,
  // when nothing is close enough, or when two corrections tie.
  // Results are memoized until the next reload.
  // ─────────────────────────────────────────────────────────────────
  /**
   * Corrects a misspelled word to the real catalog word it is one or two edits from. Returns null when the word
   * already exists in the catalog, when nothing is close, or when two candidates are equally plausible.
   */
  async findClosestCatalogWord(word: string): Promise<string | null> {
    const w = this.normalize(word);
    if (w.length < 5 || !/^[a-z]+$/.test(w)) return null;
    await this.getCatalogCorpus();
    if (this.catalogWordFreq.size === 0 || this.catalogWordFreq.has(w)) return null;
    const cached = this.catalogWordCache.get(w);
    if (cached !== undefined) return cached;

    const max = w.length <= 7 ? 1 : 2;
    const found: Array<{ word: string; dist: number; freq: number }> = [];
    for (let len = w.length - max; len <= w.length + max; len++) {
      for (const candidate of this.catalogWordsByLength.get(len) ?? []) {
        const dist = osaDistance(w, candidate);
        if (dist <= max) found.push({ word: candidate, dist, freq: this.catalogWordFreq.get(candidate) ?? 0 });
      }
    }
    let result: string | null = null;
    if (found.length > 0) {
      found.sort((a, b) => a.dist - b.dist || b.freq - a.freq);
      const top = found[0];
      const rival = found.find((candidate, index) =>
        index > 0 && candidate.dist === top.dist && candidate.freq * 3 > top.freq);
      if (top.freq >= 2 && !rival) result = top.word;
    }
    this.catalogWordCache.set(w, result);
    return result;
  }

  findClosestVocabularyWord(word: string): string | null {
    const normalized = this.normalize(word);
    if (normalized.length < 4 || normalized.includes(' ')) return null;
    if (this.vocabularyWords.has(normalized)) return null;

    const cached = this.closestWordCache.get(normalized);
    if (cached !== undefined) return cached;

    const maxDistance = normalized.length <= 5 ? 1 : normalized.length <= 9 ? 2 : 3;
    let best: string | null = null;
    let bestDist = Infinity;
    let secondBestDist = Infinity;

    for (const candidate of this.vocabularyWords) {
      // Distance can never be below the length difference: skip out-of-budget candidates early.
      if (Math.abs(candidate.length - normalized.length) > maxDistance) continue;

      const dist = levenshtein(normalized, candidate);
      if (dist < bestDist) {
        secondBestDist = bestDist;
        bestDist = dist;
        best = candidate;
      } else if (dist < secondBestDist) {
        secondBestDist = dist;
      }
    }

    const result = best && bestDist <= maxDistance && bestDist < secondBestDist ? best : null;
    if (this.closestWordCache.size >= CLOSEST_WORD_CACHE_MAX) this.closestWordCache.clear();
    this.closestWordCache.set(normalized, result);
    return result;
  }

  /** Reload from DB — call after seeding or admin updates */
  async reload(): Promise<void> {
    this.logger.log('🔄 Reloading synonyms from DB...');
    this.catalogCorpusAt = 0; // designations may have changed too
    await this.loadFromDatabase();
  }

  // ─────────────────────────────────────────────────────────────────
  // seedFrenchDesignation2Synonyms
  //
  // One-time utility: indexes the French vocabulary of designation_2 as
  // self-referencing synonyms (mot = canonical, langue = 'fr').
  // It seeds part WORDS and short part PHRASES (≤ 3 tokens). Position
  // tokens (avant, g, ar…), stop-words, function words and digits are
  // never seeded: "avant" is a position, not a part concept.
  // Safe to run repeatedly (skipDuplicates).
  // ─────────────────────────────────────────────────────────────────
  async seedFrenchDesignation2Synonyms(): Promise<{ inserted: number; skipped: number }> {
    this.logger.log('🌱 Seeding French synonyms from designation_2 values...');

    const functionWords = new Set([
      'de', 'du', 'la', 'le', 'les', 'des', 'et', 'en', 'sur', 'sous', 'par', 'ou', 'car',
      'un', 'une', 'pour', 'avec', 'sans', 'tout', 'tous',
      'int', 'ext', 'assy', 'comp', 'set', 'kit', 'sub', 'and', 'the', 'fr', 'rr',
    ]);
    const isNoise = (token: string) =>
      token.length < 3 ||
      /\d/.test(token) ||
      functionWords.has(token) ||
      this.stopWords.has(token) ||
      isPositionToken(token);

    const designations = await this.prisma.$queryRaw<{ designation_2: string }[]>`
      SELECT DISTINCT designation_2
      FROM parts
      WHERE designation_2 IS NOT NULL
        AND TRIM(designation_2) <> ''
    `;
    this.logger.log(`Found ${designations.length} distinct designation_2 values to process`);

    const toInsert: { mot: string; canonical: string; langue: string }[] = [];
    const seen = new Set<string>();
    const add = (term: string) => {
      if (term.length < 3 || seen.has(term)) return;
      seen.add(term);
      toInsert.push({ mot: term, canonical: term, langue: 'fr' });
    };

    for (const { designation_2 } of designations) {
      const tokens = this.normalize(designation_2).split(/[\s\-/()]+/).filter(Boolean);
      const words = tokens.filter((token) => !isNoise(token));
      words.forEach(add);

      // The designation's head phrase, cleaned of positions and function words.
      if (words.length > 1 && words.length <= SEED_MAX_PHRASE_TOKENS) add(words.join(' '));
    }

    this.logger.log(`Prepared ${toInsert.length} synonym rows to insert`);

    let inserted = 0;
    let skipped = 0;
    const BATCH = 200;
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const batch = toInsert.slice(i, i + BATCH);
      try {
        const result = await this.prisma.synonym.createMany({ data: batch, skipDuplicates: true });
        inserted += result.count;
        skipped += batch.length - result.count;
      } catch (err) {
        this.logger.error(`Batch ${i / BATCH + 1} failed:`, err);
        skipped += batch.length;
      }
    }

    this.logger.log(`✅ Seeding complete — inserted: ${inserted}, skipped (already existed): ${skipped}`);
    await this.reload();
    return { inserted, skipped };
  }

  /** MUST stay in sync with AdvancedSearchService.normalize(). */
  private normalize(text: string): string {
    return normalizeText(text);
  }
}