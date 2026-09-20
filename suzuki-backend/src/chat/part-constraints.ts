// src/chat/part-constraints.ts
// ═══════════════════════════════════════════════════════════════════
// SINGLE SOURCE OF TRUTH for two questions the chatbot kept answering
// with scattered, slightly different code (5 copies of the position
// vocabulary, 3 different matching semantics):
//
//   1. POSITION  — "does this catalog part really have position G / AV ?"
//   2. IDENTITY  — "is this catalog part really the part that was asked
//                   for, or only a part whose name CONTAINS the same word?"
//
// The module is deliberately framework-free (no Nest, no Prisma, no
// OpenAI) so it is deterministic, cheap and unit-testable in isolation.
//
// Design rules
// ────────────
//  * The catalog is the source of truth. The LLM (or the user's text)
//    may PROPOSE a part/position; only this module decides whether a
//    catalog row satisfies it.
//  * A position the user explicitly asked for is a HARD constraint,
//    never a ranking hint.
//  * The position of a catalog row is read from its FRENCH name
//    (designation_2 — the name the customer actually sees). The English
//    OEM name is used ONLY when there is no French name at all.
//    (Old behaviour: French name "PARE CHOC AV" + English "BUMPER,FR,LH"
//    → the row silently matched "gauche" although the customer would
//    see no "G" anywhere in the answer.)
//  * French elisions ("D'ALLUMAGE", "D'AIR") are removed BEFORE
//    tokenizing. Otherwise the lone "d" left behind is read as the
//    position "droite" (334 catalog rows were affected).
//  * Identity is a HEAD-NOUN test: "SUPPORT PARE CHOC AV G" is a
//    support, not a bumper. This is only enforced when the catalog
//    actually contains a standalone part of the requested kind;
//    otherwise (e.g. "essuie-glace", which only exists as "BALAI
//    D'ESSUIE-GLACE", "BRAS D'ESSUIE-GLACE"…) it stays inactive and the
//    legacy behaviour is preserved.
// ═══════════════════════════════════════════════════════════════════

export type Axis = 'AV' | 'AR';
export type Side = 'G' | 'D';
export type Level = 'SUP' | 'INF';

export interface PositionRequest {
  axes: Axis[];
  sides: Side[];
  levels: Level[];
}

export interface CatalogPositions extends PositionRequest {
  /** Where the position information came from. */
  origin: 'french' | 'english' | 'none';
}

/** Minimal shape of a catalog row this module needs. */
export interface CatalogPartLike {
  designation?: string | null;
  designation2?: string | null;
  designation_2?: string | null;
}

export interface ConstraintSpec {
  requestedPositions: PositionRequest;
  /** Ordered, cleaned part tokens typed by the user (no positions/filler/model). */
  requestedPartTokens: string[];
  /** Compact identity keys (typed phrase + synonym variants). */
  identityKeys: string[];
}

export interface ConstraintOutcome {
  applied: boolean;
  requestedPart: string | null;
  requestedPositions: PositionRequest;
  identityMode: 'strict-head' | 'inactive-no-standalone-form' | 'skipped';
  candidatesBefore: number;
  rejectedByIdentity: number;
  rejectedByPosition: number;
  kept: number;
  /** Positions that DO exist for the requested part (from the catalog). */
  availablePositions: string[];
  /** True when something was requested, related parts exist, but none matches exactly. */
  noExactMatch: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────────

/** lower-case, strip accents, drop French elisions (d' l'), keep a-z0-9 - / */
export function normalizeForMatch(text: string): string {
  return (text ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // French elision: "d'air", "l’huile" → "air", "huile". The article is
    // NOT a position; leaving a lone "d" behind is what made
    // "BOUGIE D'ALLUMAGE" look like a right-hand part.
    .replace(/\b[dl]['’`´]\s*/g, ' ')
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokens of a normalized text, split on space, hyphen and slash. */
export function tokenizeName(text: string): string[] {
  return normalizeForMatch(text)
    .split(/[\s/-]+/)
    .filter(Boolean);
}

const FUNCTION_WORDS = new Set([
  'de', 'du', 'des', 'la', 'le', 'les', 'un', 'une', 'a', 'au', 'aux', 'et', 'en', 'd', 'l',
]);

// Words that carry a REQUEST (not a part identity). Kept deliberately small
// and purely linguistic — no part names in here.
const REQUEST_WORDS = new Set([
  'je', 'j', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'moi', 'toi',
  'veux', 'veut', 'voudrais', 'cherche', 'chercher', 'besoin', 'avoir', 'trouver',
  'ai', 'as', 'avez', 'est', 'sont', 'y', 'ya', 'existe', 'famma', 'svp', 'stp',
  'plait', 'pour', 'avec', 'sans', 'sur', 'ce', 'cet', 'cette', 'ces', 'mon', 'ma', 'mes',
  'ton', 'ta', 'tes', 'votre', 'notre', 'que', 'qui', 'quoi', 'ou',
  'prix', 'combien', 'cout', 'tarif', 'disponible', 'dispo', 'stock',
  'piece', 'pieces', 'voiture', 'auto', 'suzuki',
  'bonjour', 'salut', 'bonsoir', 'merci', 'hello',
  'position', 'cote', 'cotes', 'type', 'modele', 'model', 'reference', 'ref',
]);

function singular(token: string): string {
  if (token.length > 3 && token.endsWith('eaux')) return token.slice(0, -1);
  if (token.length > 3 && token.endsWith('eux')) return token.slice(0, -1);
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
}

/** Compact comparison key: plural-insensitive, spacing/hyphen-insensitive. */
export function compactKey(tokens: string[]): string {
  return tokens.map(singular).join('');
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] =
        a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : Math.min(prev[j - 1] + 1, curr[j - 1] + 1, prev[j] + 1);
    }
    prev = curr;
  }
  return prev[b.length];
}

/** Equal, or a 1-2 letter typo/vowel variant of a LONG key ("parachoc"≈"parechoc"). */
export function keysMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const shortest = Math.min(a.length, b.length);
  if (shortest < 7) return false;
  const tolerance = shortest >= 12 ? 2 : 1;
  if (Math.abs(a.length - b.length) > tolerance) return false;
  return levenshtein(a, b) <= tolerance;
}

// ─────────────────────────────────────────────────────────────────
// POSITION vocabulary (closed, tiny, shared by every service)
// ─────────────────────────────────────────────────────────────────

interface PositionAtom {
  axis?: Axis;
  side?: Side;
  level?: Level;
}

const POSITION_TOKENS: Record<string, PositionAtom> = {
  // axis
  av: { axis: 'AV' }, avant: { axis: 'AV' }, front: { axis: 'AV' },
  ar: { axis: 'AR' }, arr: { axis: 'AR' }, arriere: { axis: 'AR' }, rear: { axis: 'AR' },
  // side
  g: { side: 'G' }, gauche: { side: 'G' }, gch: { side: 'G' }, lh: { side: 'G' }, conducteur: { side: 'G' },
  d: { side: 'D' }, droite: { side: 'D' }, droit: { side: 'D' }, rh: { side: 'D' }, passager: { side: 'D' },
  // axis + side
  avg: { axis: 'AV', side: 'G' }, avd: { axis: 'AV', side: 'D' },
  arg: { axis: 'AR', side: 'G' }, ard: { axis: 'AR', side: 'D' },
  // level
  sup: { level: 'SUP' }, superieur: { level: 'SUP' },
  inf: { level: 'INF' }, inferieur: { level: 'INF' },
};

export function isPositionToken(token: string): boolean {
  return Object.prototype.hasOwnProperty.call(POSITION_TOKENS, token);
}

function emptyRequest(): PositionRequest {
  return { axes: [], sides: [], levels: [] };
}

function addAtom(target: PositionRequest, atom: PositionAtom): void {
  if (atom.axis && !target.axes.includes(atom.axis)) target.axes.push(atom.axis);
  if (atom.side && !target.sides.includes(atom.side)) target.sides.push(atom.side);
  if (atom.level && !target.levels.includes(atom.level)) target.levels.push(atom.level);
}

export function hasAnyPosition(p: PositionRequest): boolean {
  return p.axes.length > 0 || p.sides.length > 0 || p.levels.length > 0;
}

/**
 * Positions the USER asked for, read from the text they (or the
 * normalizer) produced. `canonicalOf` lets the caller pass the DB
 * synonym lookup so that e.g. "devant" → "avant" still counts — but
 * only when the user's own token was that word (provenance is kept).
 */
export function extractRequestedPositions(
  text: string,
  canonicalOf?: (token: string) => string | undefined,
): PositionRequest {
  const result = emptyRequest();
  for (const token of tokenizeName(text)) {
    let atom = POSITION_TOKENS[token];
    if (!atom && canonicalOf) {
      const canonical = canonicalOf(token);
      if (canonical) atom = POSITION_TOKENS[normalizeForMatch(canonical)];
    }
    if (atom) addAtom(result, atom);
  }
  return result;
}

const ENGLISH_SKIP_NEXT = new Set(['view', 'seat']);

/**
 * English OEM designations are comma-separated ("LAMP ASSY, REAR COMB, L").
 * Only used when a part has NO French name at all.
 */
function parseEnglishPositions(designation: string): PositionRequest {
  const result = emptyRequest();
  const fields = (designation ?? '')
    .toString()
    .toLowerCase()
    .split(/[,;()]+/)
    .map((f) => f.trim())
    .filter(Boolean);

  for (const field of fields) {
    const tokens = field
      .replace(/[^a-z0-9\s/-]/g, ' ')
      .split(/[\s/-]+/)
      .filter(Boolean);

    // A field that is just "L" / "R" is the usual side marker.
    if (tokens.length === 1) {
      if (tokens[0] === 'l') addAtom(result, { side: 'G' });
      if (tokens[0] === 'r') addAtom(result, { side: 'D' });
    }

    tokens.forEach((token, i) => {
      const next = tokens[i + 1];
      switch (token) {
        case 'lh': case 'left': addAtom(result, { side: 'G' }); break;
        case 'rh': case 'right': addAtom(result, { side: 'D' }); break;
        case 'fr': case 'frt': case 'front':
          if (!ENGLISH_SKIP_NEXT.has(next ?? '')) addAtom(result, { axis: 'AV' });
          break;
        case 'rr': case 'rear':
          // "OUT REAR VIEW" (a mirror) is not the rear position.
          if (!ENGLISH_SKIP_NEXT.has(next ?? '')) addAtom(result, { axis: 'AR' });
          break;
        case 'upr': case 'upper': addAtom(result, { level: 'SUP' }); break;
        case 'lwr': case 'lower': addAtom(result, { level: 'INF' }); break;
        default: break;
      }
    });
  }
  return result;
}

function frenchName(part: CatalogPartLike): string {
  return (part.designation2 ?? part.designation_2 ?? '').toString().trim();
}

/** Positions a CATALOG row really has (see header for the language rule). */
export function getCatalogPositions(part: CatalogPartLike): CatalogPositions {
  const french = frenchName(part);
  if (french.length > 0) {
    const result: CatalogPositions = { ...emptyRequest(), origin: 'french' };
    for (const token of tokenizeName(french)) {
      const atom = POSITION_TOKENS[token];
      if (atom) addAtom(result, atom);
    }
    if (!hasAnyPosition(result)) result.origin = 'none';
    return result;
  }
  const english = parseEnglishPositions((part.designation ?? '').toString());
  return { ...english, origin: hasAnyPosition(english) ? 'english' : 'none' };
}

function intersects<T>(requested: T[], actual: T[]): boolean {
  return requested.some((r) => actual.includes(r));
}

/** Every dimension the user asked for must be present on the part. */
export function positionsSatisfy(requested: PositionRequest, actual: PositionRequest): boolean {
  if (requested.axes.length > 0 && !intersects(requested.axes, actual.axes)) return false;
  if (requested.sides.length > 0 && !intersects(requested.sides, actual.sides)) return false;
  if (requested.levels.length > 0 && !intersects(requested.levels, actual.levels)) return false;
  return true;
}

const AXIS_LABEL: Record<Axis, string> = { AV: 'avant', AR: 'arrière' };
const SIDE_LABEL: Record<Side, string> = { G: 'gauche', D: 'droite' };
const LEVEL_LABEL: Record<Level, string> = { SUP: 'supérieur', INF: 'inférieur' };

/** "AV G" style short code (catalog convention). */
export function formatPositionCode(p: PositionRequest): string {
  return [...p.axes, ...p.sides, ...p.levels].join(' ');
}

/** "avant gauche" human label. */
export function formatPositionLabel(p: PositionRequest): string {
  return [
    ...p.axes.map((a) => AXIS_LABEL[a]),
    ...p.sides.map((s) => SIDE_LABEL[s]),
    ...p.levels.map((l) => LEVEL_LABEL[l]),
  ].join(' ');
}

/** "AV G" → "avant gauche" (used by user-facing messages). */
export function formatCodeLabel(code: string): string {
  const labels: Record<string, string> = {
    AV: 'avant', AR: 'arrière', G: 'gauche', D: 'droite', SUP: 'supérieur', INF: 'inférieur',
  };
  return code
    .split(' ')
    .map((c) => labels[c] ?? c.toLowerCase())
    .join(' ');
}

/** Canonical words for a position request, e.g. ["avant", "gauche"]. */
export function positionsToWords(p: PositionRequest): string[] {
  return [
    ...p.axes.map((a) => (a === 'AV' ? 'avant' : 'arriere')),
    ...p.sides.map((s) => (s === 'G' ? 'gauche' : 'droite')),
    ...p.levels.map((l) => (l === 'SUP' ? 'sup' : 'inf')),
  ];
}

/** Same set of requested positions (order-insensitive)? */
export function samePositions(a: PositionRequest, b: PositionRequest): boolean {
  const same = <T>(x: T[], y: T[]) => x.length === y.length && x.every((v) => y.includes(v));
  return same(a.axes, b.axes) && same(a.sides, b.sides) && same(a.levels, b.levels);
}

// ─────────────────────────────────────────────────────────────────
// IDENTITY (head-noun test)
// ─────────────────────────────────────────────────────────────────

/**
 * The tokens that identify WHAT the user asked for: the typed tokens
 * minus positions, filler, model names, digits/codes and `ignore`
 * (DB stop-words, model names…).
 */
export function buildRequestedPartTokens(
  tokens: string[],
  ignore: ReadonlySet<string> = new Set(),
): string[] {
  const out: string[] = [];
  for (const raw of tokens) {
    for (const token of tokenizeName(raw)) {
      if (token.length < 2) continue;
      if (isPositionToken(token)) continue;
      if (FUNCTION_WORDS.has(token) || REQUEST_WORDS.has(token)) continue;
      if (ignore.has(token)) continue;
      if (/\d/.test(token)) continue;
      out.push(token);
    }
  }
  return out;
}

/**
 * Compact keys under which a catalog head may legitimately appear:
 * the typed phrase itself + every synonym variant of it.
 * `variantsOf(phrase)` is supplied by the caller (DB synonym table).
 */
export function buildIdentityKeys(
  phrases: string[][],
  variantsOf: (phrase: string) => string[] = () => [],
): string[] {
  const keys = new Set<string>();
  for (const phrase of phrases) {
    if (phrase.length === 0) continue;
    keys.add(compactKey(phrase));
    for (const variant of variantsOf(phrase.join(' '))) {
      const variantTokens = tokenizeName(variant).filter(
        (t) => !FUNCTION_WORDS.has(t) && !isPositionToken(t),
      );
      if (variantTokens.length > 0) keys.add(compactKey(variantTokens));
    }
  }
  return [...keys].filter((k) => k.length >= 2);
}

/**
 * Tokens of the French designation without positions and function words.
 * Returns null when the row has no French name (identity cannot be
 * verified — such rows keep the legacy behaviour).
 */
export function getCoreTokens(part: CatalogPartLike): string[] | null {
  const french = frenchName(part);
  if (french.length === 0) return null;
  return tokenizeName(french).filter((t) => !isPositionToken(t) && !FUNCTION_WORDS.has(t));
}

/** Does the row's HEAD (first 1..5 tokens) equal one of the identity keys? */
export function matchesHead(core: string[], identityKeys: string[]): boolean {
  const max = Math.min(5, core.length);
  for (let k = 1; k <= max; k++) {
    const headKey = compactKey(core.slice(0, k));
    if (identityKeys.some((key) => keysMatch(headKey, key))) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────
// The gate
// ─────────────────────────────────────────────────────────────────

const POSITION_CODE_ORDER = ['AV', 'AR', 'G', 'D', 'SUP', 'INF'];

/** AV, AV G, AV D, AR, AR G, AR D, G, D … (stable, human-friendly). */
function comparePositionCodes(a: string, b: string): number {
  const rank = (code: string) => POSITION_CODE_ORDER.indexOf(code.split(' ')[0]);
  const bySide = (code: string) => (code.includes(' G') || code === 'G' ? 0 : 1);
  return rank(a) - rank(b) || a.split(' ').length - b.split(' ').length || bySide(a) - bySide(b);
}

/**
 * 1. IDENTITY: keep only rows whose head is the requested part — but only
 *    when at least one such standalone row exists (otherwise inactive).
 * 2. POSITION: keep only rows that really have every requested position.
 *
 * Order matters: identity first, so "no exact match" can list the
 * positions that exist for the REAL part (not for its brackets).
 * Input order (= relevance order) is preserved.
 */
export function applyCatalogConstraints<T extends CatalogPartLike>(
  parts: T[],
  spec: ConstraintSpec,
): { kept: T[]; outcome: ConstraintOutcome } {
  const requested = spec.requestedPositions;
  const hasPositionRequest = hasAnyPosition(requested);
  const hasIdentityRequest = spec.requestedPartTokens.length > 0 && spec.identityKeys.length > 0;

  const outcome: ConstraintOutcome = {
    applied: false,
    requestedPart: spec.requestedPartTokens.length > 0 ? spec.requestedPartTokens.join(' ') : null,
    requestedPositions: requested,
    identityMode: 'skipped',
    candidatesBefore: parts.length,
    rejectedByIdentity: 0,
    rejectedByPosition: 0,
    kept: parts.length,
    availablePositions: [],
    noExactMatch: false,
  };

  if (!hasPositionRequest && !hasIdentityRequest) return { kept: parts, outcome };
  outcome.applied = true;

  // ── 1. identity ────────────────────────────────────────────────
  let pool: T[] = parts;
  if (hasIdentityRequest) {
    const heads = new Set<T>();
    const foreignHeads = new Set<T>();
    for (const part of parts) {
      const core = getCoreTokens(part);
      if (core === null) continue; // no French name → unverifiable, keep as before
      (matchesHead(core, spec.identityKeys) ? heads : foreignHeads).add(part);
    }
    if (heads.size > 0) {
      pool = parts.filter((p) => !foreignHeads.has(p));
      outcome.identityMode = 'strict-head';
      outcome.rejectedByIdentity = foreignHeads.size;
    } else {
      outcome.identityMode = 'inactive-no-standalone-form';
    }
  }

  // positions that really exist for the identified part
  const available = new Set<string>();
  for (const part of pool) {
    const code = formatPositionCode(getCatalogPositions(part));
    if (code) available.add(code);
  }
  outcome.availablePositions = [...available]
    .sort(comparePositionCodes)
    .slice(0, 8);

  // ── 2. position ────────────────────────────────────────────────
  let kept = pool;
  if (hasPositionRequest) {
    kept = pool.filter((p) => positionsSatisfy(requested, getCatalogPositions(p)));
    outcome.rejectedByPosition = pool.length - kept.length;
  }

  outcome.kept = kept.length;
  outcome.noExactMatch = kept.length === 0 && parts.length > 0 && pool.length > 0 && hasPositionRequest;
  return { kept, outcome };
}
