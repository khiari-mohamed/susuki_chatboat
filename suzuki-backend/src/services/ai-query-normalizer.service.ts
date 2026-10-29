import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../chat/openai.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import {
  buildRequestedPartTokens,
  extractRequestedPositions,
  hasAnyPosition,
  isColorToken,
  isFillerToken,
  isPositionToken,
  levenshtein,
  normalizeForMatch,
  positionsToWords,
  samePositions,
  tokenizeName,
  type PositionRequest,
} from '../chat/part-constraints';

interface ConversationMessage {
  role: string;
  content: string;
}

export interface CompatiblePartCandidate {
  reference: string;
  designation: string;
}

interface QueryContext {
  recentMessages: ConversationMessage[];
  vehicle?: { marque?: string | null; modele?: string | null; typeCode?: string | null };
  useHistoryForInterpretation: boolean;
}

const INTENTS = [
  'SEARCH',
  'PRICE_INQUIRY',
  'STOCK_CHECK',
  'GREETING',
  'COMPLAINT',
  'THANKS',
  'SERVICE_QUESTION',
  'CLARIFICATION_NEEDED',
  'FILTER',
  'DIAGNOSTIC',
  'UNKNOWN',
] as const;

export type InterpretedIntent = (typeof INTENTS)[number];

export interface StructuredQueryInterpretation {
  normalized: string;
  intent: InterpretedIntent;
  catalogPart: string | null;
  positions: PositionRequest;
  qualifiers: string[];
  confidence: number;
  uncertainty: number;
  isGreeting: boolean;
  isThanks: boolean;
  catalogAliases?: string[];
  source?: 'ai' | 'deterministic';
}

interface CatalogMatch {
  canonical: string;
  variants: string[];
}

interface IndexedAlias {
  text: string;
  compact: string;
}

interface IndexedCandidate extends CatalogMatch {
  aliases: IndexedAlias[];
}

interface CandidateIndex {
  entries: IndexedCandidate[];
  byCanonical: Map<string, IndexedCandidate>;
}

interface TunisianRules {
  source: Record<string, string>;
  lookup: Map<string, string>;
  pattern: RegExp | null;
}

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────

const AI_WINDOW_SIZE = 100;
const AI_MIN_SAMPLE = 20; // don't trip on tiny samples
const AI_REJECTION_THRESHOLD = 0.3;
const AI_CIRCUIT_COOLDOWN_MS = 60_000;
const MAX_PROMPT_CANDIDATES = 40;
const MAX_CONCEPT_CHECKS = 5;

const DETERMINISTIC_CONFIDENCE_KNOWN = 0.75;
const DETERMINISTIC_CONFIDENCE_UNKNOWN = 0.5;

const GREETING_ONLY = /^(bonjour|bonsoir|salut|hello|hi|salem|ahla|salam)\s*[!?.]*$/i;
/** Greeting/politeness words carry no part identity: the AI may translate them freely. */
const COURTESY_WORDS: ReadonlySet<string> = new Set([
  'bonjour', 'bonsoir', 'salut', 'salam', 'salem', 'ahla', 'hello', 'merci', 'svp', 'please', 'pardon',
]);
/** Everyday conversational words: never a misspelled part name. */
const CONVERSATIONAL_WORDS: ReadonlySet<string> = new Set([
  'accord', 'daccord', 'merci', 'bonjour', 'bonsoir', 'salut', 'disponible', 'disponibilite',
  'combien', 'compatible', 'cherche', 'besoin', 'voudrais', 'souhaite', 'voiture', 'vehicule',
  'plait', 'svp', 'parfait', 'super', 'exactement', 'pareil', 'aussi', 'encore', 'toujours',
]);
const THANKS_MARKER = /\b(merci|thanks|3aychek|barcha|au revoir|bye|besslema|ciao|adieu)\b/i;
const SERVICE_QUESTION =
  /ouvrez|ouvert|heure|horaire|livraison|délai|garantie|situé|adresse|où|localisation/i;
const CONTEXTUAL_FOLLOW_UP =
  /\b(?:l(?:['’]|\s+)autre|autre\s+c[oô]t[eé]|c[oô]t[eé]\s+oppos[eé]|pareil(?:le)?|idem|la\s+m[eê]me(?:\s+chose)?|le\s+m[eê]me(?:\s+chose)?|celle(?:-ci|-l[aà])?|celui(?:-ci|-l[aà])?|disponible|en\s+stock|famma|mawjoud|combien|ch7al|prix|tarif|co[uû]t)\b/i;
/** Price/stock intent words: never spell-corrected (combien → combin). */
const INTENT_WORDS = /^(prix|price|combien|cout|tarif|cost|stock|disponible|disponibilite|dispo|mawjoud|famma|ch7al)$/;
const THANKS_WORDS: ReadonlySet<string> = new Set([
  'merci', 'thanks', '3aychek', 'barcha', 'au', 'revoir', 'bye', 'besslema', 'ciao', 'adieu',
  'beaucoup', 'bien', 'infiniment', 'mille', 'fois', 'bonne', 'journee', 'soiree', 'bientot', 'tres',
]);

const MEANINGLESS_WORDS: ReadonlySet<string> = new Set([
  'avant', 'arriere', 'gauche', 'droite', 'pour', 'avec', 'sans', 'tout', 'tous',
  'des', 'les', 'une', 'stock', 'disponible',
  'assy', 'comp', 'set', 'kit', 'sub', 'and', 'the', 'de', 'du', 'la', 'le', 'et', 'en',
  'sur', 'sous', 'par', 'ou', 'car',
  'av', 'ar', 'sup', 'inf', 'int', 'ext', 'lh', 'rh', 'fr', 'rr',
]);

/** Written forms of each position code, used to verify that the AI only re-spaced the customer's text. */
const POSITION_SURFACES: Readonly<Record<string, readonly string[]>> = {
  AV: ['av', 'avant'],
  AR: ['ar', 'arr', 'arriere'],
  G: ['g', 'gch', 'gauche'],
  D: ['d', 'droit', 'droite'],
  SUP: ['sup', 'superieur'],
  INF: ['inf', 'inferieur'],
};

/**
 * Emergency-only typo corrections, used when the AI is unavailable. Whole-token
 * matches only. Real corrections belong in the synonyms table (langue='typo'),
 * which overrides this map.
 */
const STATIC_TYPO_FALLBACK: Readonly<Record<string, string>> = {
  ilbrequin: 'vilebrequin', vilbrequin: 'vilebrequin',
  rtaverse: 'traverse', rtavers: 'traverse',
  olle: 'tolle', avlve: 'valve', avse: 'vase',
  garaffes: 'agraffes', garafes: 'agrafes', garaffe: 'agraffe', garafe: 'agrafe',
  graffes: 'agraffes', graffe: 'agraffe', garaphe: 'agraphe', graphe: 'agraphe',
  iale: 'aile', ial: 'aile', ivtre: 'vitre',
  amorto: 'amortisseur', amortiseur: 'amortisseur', amortizeur: 'amortisseur',
  ovlant: 'volant', olant: 'volant',
  arier: 'arriere',
  trversear: 'traverse arriere', traversear: 'traverse arriere',
  parbrise: 'pare-brise', parebrise: 'pare-brise',
  retrovisuer: 'retroviseur', retrovisseur: 'retroviseur', retrovissuer: 'retroviseur', retrovizeur: 'retroviseur',
  plaquetes: 'plaquettes', plaquete: 'plaquette',
  courorie: 'courroie', courroi: 'courroie',
  roulment: 'roulement', roulemnt: 'roulement',
  embrayge: 'embrayage', embreyage: 'embrayage',
  charnierre: 'charniere',
  serrur: 'serrure',
  raditaeur: 'radiateur', radiatuer: 'radiateur', raditeur: 'radiateur',
  alternater: 'alternateur', alternatuer: 'alternateur',
  demareur: 'demarreur',
  crmaillere: 'cremaillere', crrmaillere: 'cremaillere',
  cienture: 'ceinture',
  disqe: 'disque', disqeu: 'disque',
  captuer: 'capteur', captueur: 'capteur',
  clignotnat: 'clignotant', clignotan: 'clignotant',
  calindre: 'calandre',
  parechoc: 'pare-choc', parechocs: 'pare-chocs',
  lunete: 'lunette', luunette: 'lunette',
  souffelt: 'soufflet', souflet: 'soufflet',
  enjolivuer: 'enjoliveur', enjolivueur: 'enjoliveur',
  essuiglace: 'essuie glace', leveglace: 'leve glace', monteglace: 'monte glace', laveglace: 'lave glace',
};

const INITIAL_STATS = {
  totalCalls: 0,
  passthroughCarPart: 0,
  passthroughServiceQuestion: 0,
  fuzzyCorrectionsApplied: 0,
  aiSkippedCircuitOpen: 0,
  aiAccepted: 0,
  aiRejectedUngrounded: 0,
  aiRejectedPositionMismatch: 0,
  aiRejectedWordChanged: 0,
  aiRejectedTripleLetter: 0,
  aiRejectedBadPrefix: 0,
  aiCallError: 0,
};
type NormalizationStats = typeof INITIAL_STATS;

function normalizeTerm(value: string): string {
  return normalizeForMatch(value).replace(/[/-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class AIQueryNormalizerService {
  private readonly logger = new Logger(AIQueryNormalizerService.name);
  private aiOutcomes: boolean[] = [];
  private circuitOpenUntil = 0;
  private lastTripRejectionRate = 0;
  private stats: NormalizationStats = { ...INITIAL_STATS };
  private readonly candidateIndexCache = new WeakMap<object, CandidateIndex>();
  private tunisianRules: TunisianRules | null = null;

  constructor(
    private openaiService: OpenAIService,
    private synonymsService: SynonymsService,
  ) {}

  // ─────────────────────────────────────────────────────────────────
  // Circuit breaker: when the AI's recent output keeps failing validation
  // it is skipped for a cooldown, then the window is reset and it is retried.
  // ─────────────────────────────────────────────────────────────────

  private recordAiOutcome(accepted: boolean): void {
    this.aiOutcomes.push(accepted);
    if (this.aiOutcomes.length > AI_WINDOW_SIZE) this.aiOutcomes.shift();
  }

  private rejectionRate(): number {
    if (this.aiOutcomes.length === 0) return 0;
    return this.aiOutcomes.filter((accepted) => !accepted).length / this.aiOutcomes.length;
  }

  private isAiCircuitOpen(): boolean {
    const now = Date.now();
    if (now < this.circuitOpenUntil) return true;
    if (this.aiOutcomes.length >= AI_MIN_SAMPLE && this.rejectionRate() > AI_REJECTION_THRESHOLD) {
      this.lastTripRejectionRate = this.rejectionRate();
      this.circuitOpenUntil = now + AI_CIRCUIT_COOLDOWN_MS;
      this.aiOutcomes = [];
      this.logger.warn(
        `⚠️ AI circuit opened (rejection rate ${(this.lastTripRejectionRate * 100).toFixed(0)}%) — ` +
        `deterministic interpretation for ${AI_CIRCUIT_COOLDOWN_MS / 1000}s`,
      );
      return true;
    }
    return false;
  }

  /** Process-local normalization stats — see INITIAL_STATS. */
  getNormalizationStats() {
    const open = Date.now() < this.circuitOpenUntil;
    return {
      ...this.stats,
      aiWindowSize: this.aiOutcomes.length,
      aiRecentRejectionRate: Number((open ? this.lastTripRejectionRate : this.rejectionRate()).toFixed(3)),
      aiCircuitOpen: open,
      dbTypoMapSize: this.synonymsService.getTypoMapSize(),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // Entry point
  // ─────────────────────────────────────────────────────────────────

  async normalizeQuery(
    query: string,
    history: ConversationMessage[] = [],
    vehicle?: QueryContext['vehicle'],
    compatibleParts?: CompatiblePartCandidate[],
  ): Promise<StructuredQueryInterpretation> {
    this.stats.totalCalls++;
    const text = (query ?? '').trim();
    if (!text) return this.fallbackInterpretation('', 0, 'UNKNOWN');
    if (GREETING_ONLY.test(text)) return this.fallbackInterpretation(text, 1, 'GREETING');

    const lowerText = text.toLowerCase();
    const isCarPart = this.synonymsService.isKnownAutomotiveTerm(lowerText);
    const isContextualFollowUp = this.isContextualFollowUp(text);

    if (!isCarPart && !isContextualFollowUp) {
      if (
        text.split(/\s+/).length <= 6 &&
        THANKS_MARKER.test(text) &&
        !this.hasUnknownPartTokens(text, THANKS_WORDS)
      ) {
        return this.fallbackInterpretation(text, 1, 'THANKS');
      }
      if (SERVICE_QUESTION.test(lowerText)) {
        this.stats.passthroughServiceQuestion++;
        return this.fallbackInterpretation(text, 1, 'SERVICE_QUESTION');
      }
    }

    const context: QueryContext | undefined =
      history.length > 0 || vehicle
        ? { recentMessages: history.slice(-6), vehicle, useHistoryForInterpretation: isContextualFollowUp && !isCarPart }
        : undefined;

    const index = this.getCandidateIndex();
    const allowedConcepts = compatibleParts === undefined
      ? undefined
      : this.compatibleConceptKeys(compatibleParts, index);
    const vehicleTokens = this.vehicleTokens(vehicle);
    const candidateEvidence = this.candidateEvidenceTokens(compatibleParts ?? []);
    const hasUnknownTokens = this.hasUnknownPartTokens(text, vehicleTokens, candidateEvidence);
    if (isCarPart && !hasUnknownTokens && !this.hasTunisianMarker(lowerText)) this.stats.passthroughCarPart++;

    if (this.isAiCircuitOpen()) {
      this.stats.aiSkippedCircuitOpen++;
      return this.emergencyInterpretation(text, index, context, vehicleTokens, allowedConcepts, candidateEvidence);
    }

    const localPart = await this.findCatalogPartInText(text, index, context, allowedConcepts);
    // A price/stock follow-up names no part: the part comes from the conversation, so it is understood.
    const isFollowUpWithContext = isContextualFollowUp && !isCarPart && history.length > 0;
    const deterministicConfidence =
      (localPart && !hasUnknownTokens) || isFollowUpWithContext
        ? DETERMINISTIC_CONFIDENCE_KNOWN
        : DETERMINISTIC_CONFIDENCE_UNKNOWN;
    const reject = (counter: keyof NormalizationStats, reason: string): StructuredQueryInterpretation => {
      this.stats[counter]++;
      // "Not grounded" means the rewrite was unusable, not that the model is misbehaving:
      // the deterministic path already handles it. Only real drift counts toward the breaker.
      if (counter !== 'aiRejectedUngrounded') this.recordAiOutcome(false);
      this.logger.warn(`⚠️ ${reason} — using deterministic interpretation`);
      return this.buildDeterministic(text, localPart, deterministicConfidence);
    };

    try {
      const aiResult = await this.normalizeWithAI(
        text,
        context,
        this.shortlistCandidates(text, index, context, allowedConcepts),
        compatibleParts,
      );
      const requiresCatalogPart =
        ['SEARCH', 'PRICE_INQUIRY', 'STOCK_CHECK'].includes(aiResult.intent) || isCarPart || isContextualFollowUp;
      const grounded = await this.validateCatalogPart(
        text,
        aiResult.normalized,
        aiResult.catalogPart,
        index,
        context,
        allowedConcepts,
      );

      // A price/stock follow-up with no part of its own ("et c'est combien ?") has nothing to ground:
      // the part comes from the conversation context, so this is not an AI failure.
      const followUpWithoutPart = isContextualFollowUp && !isCarPart && !aiResult.catalogPart;
      if (requiresCatalogPart && !grounded && !followUpWithoutPart) {
        return reject('aiRejectedUngrounded', `AI interpretation not grounded in catalog vocabulary: "${aiResult.catalogPart ?? ''}"`);
      }

      if (!isContextualFollowUp) {
        const added = this.findAddedWord(text, aiResult.normalized, vehicleTokens);
        if (added) return reject('aiRejectedWordChanged', `AI added a word the customer never wrote: "${added}"`);
      }

      const drift = this.findLexicalDrift(text, aiResult.normalized, isContextualFollowUp || !!grounded);
      if (drift) return reject(drift.counter, drift.reason);

      // The model may fix words, but it may NOT add, drop or change a position.
      const guarded = isContextualFollowUp
        ? aiResult.normalized.trim()
        : this.enforcePositionFidelity(text, aiResult.normalized);
      const normalized = this.canonicalizePositionWording(
        this.restoreCatalogSpelling(text, guarded, candidateEvidence),
      );
      this.stats.aiAccepted++;
      this.recordAiOutcome(true);
      this.logger.log(`✅ AI: "${text}" → "${normalized}" (${aiResult.confidence})`);
      // The part is supplied by conversation context, so a low model confidence on a price/stock follow-up
      // should not cause the answer to be withheld.
      const followUpFloor = isContextualFollowUp && !isCarPart && history.length > 0;
      return {
        ...aiResult,
        ...(followUpFloor
          ? {
              confidence: Math.max(aiResult.confidence, DETERMINISTIC_CONFIDENCE_KNOWN),
              uncertainty: Math.min(aiResult.uncertainty, 1 - DETERMINISTIC_CONFIDENCE_KNOWN),
            }
          : {}),
        normalized,
        catalogPart: grounded?.canonical ?? null,
        catalogAliases: grounded?.variants ?? [],
        source: 'ai',
        positions: extractRequestedPositions(normalized),
      };
    } catch (error: any) {
      // Not recorded in the rejection window on purpose: a timeout says nothing
      // about whether the AI's *output* is trustworthy.
      this.stats.aiCallError++;
      this.logger.warn(`⚠️ AI failed: ${error?.message ?? error}`);
      return this.emergencyInterpretation(text, index, context, vehicleTokens, allowedConcepts, candidateEvidence);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Deterministic interpretation
  // ─────────────────────────────────────────────────────────────────

  private buildDeterministic(
    text: string,
    part: CatalogMatch | null,
    confidence: number,
  ): StructuredQueryInterpretation {
    return {
      normalized: text,
      intent: this.inferDeterministicIntent(text, !!part),
      catalogPart: part?.canonical ?? null,
      catalogAliases: part?.variants ?? [],
      // Dialect position words ("yamin") count even though `normalized` stays untouched.
      positions: extractRequestedPositions(this.applyTunisianNormalization(text)),
      qualifiers: [],
      confidence,
      uncertainty: 1 - confidence,
      isGreeting: false,
      isThanks: false,
      source: 'deterministic',
    };
  }

  private async emergencyInterpretation(
    text: string,
    index: CandidateIndex,
    context: QueryContext | undefined,
    ignore: ReadonlySet<string>,
    allowedConcepts?: ReadonlySet<string>,
    candidateEvidence: ReadonlySet<string> = new Set(),
  ): Promise<StructuredQueryInterpretation> {
    // Vehicle names and words found in the vehicle-compatible candidate rows are real
    // catalog vocabulary: the fuzzy pass must never rewrite them.
    const normalized = this.normalizeEmergencyFallback(text, new Set([...ignore, ...candidateEvidence]));
    const part = await this.findCatalogPartInText(normalized, index, context, allowedConcepts);
    const followUpWithContext = !!context?.useHistoryForInterpretation && context.recentMessages.length > 0;
    const confidence =
      followUpWithContext || (part && !this.hasUnknownPartTokens(normalized, ignore, candidateEvidence))
        ? DETERMINISTIC_CONFIDENCE_KNOWN
        : DETERMINISTIC_CONFIDENCE_UNKNOWN;
    return this.buildDeterministic(normalized, part, confidence);
  }

  /** Flags come from the intent only: "bonjour, je veux un rétroviseur" is not a greeting. */
  private fallbackInterpretation(
    normalized: string,
    confidence: number,
    intent: InterpretedIntent = 'UNKNOWN',
  ): StructuredQueryInterpretation {
    return {
      normalized,
      intent,
      catalogPart: null,
      positions: extractRequestedPositions(normalized),
      qualifiers: [],
      confidence,
      uncertainty: 1 - confidence,
      isGreeting: intent === 'GREETING',
      isThanks: intent === 'THANKS',
      catalogAliases: [],
      source: 'deterministic',
    };
  }

  private isContextualFollowUp(query: string): boolean {
    const words = query.trim().split(/\s+/).filter(Boolean);
    if (words.length > 8 || query.length > 100) return false;
    return CONTEXTUAL_FOLLOW_UP.test(query);
  }

  private vehicleTokens(vehicle?: QueryContext['vehicle']): ReadonlySet<string> {
    return new Set(tokenizeName([vehicle?.marque, vehicle?.modele].filter(Boolean).join(' ')));
  }

  /** Tokens that are neither a known automotive word nor a plausible misspelling of one. */
  private hasUnknownPartTokens(
    query: string,
    ignore: ReadonlySet<string> = new Set(),
    candidateEvidence: ReadonlySet<string> = new Set(),
  ): boolean {
    return buildRequestedPartTokens(tokenizeName(query), ignore).some(
      (token) =>
        !candidateEvidence.has(token) &&
        !this.synonymsService.isKnownAutomotiveTerm(token) &&
        !this.synonymsService.findClosestVocabularyWord(token),
    );
  }

  private candidateEvidenceTokens(parts: CompatiblePartCandidate[]): ReadonlySet<string> {
    return new Set(parts.flatMap((part) => tokenizeName(part.designation)));
  }

  private inferDeterministicIntent(query: string, hasCatalogPart: boolean): InterpretedIntent {
    const normalized = normalizeForMatch(query);
    if (/\b(prix|price|ch7al|combien|cout|tarif|cost)\b/.test(normalized)) return 'PRICE_INQUIRY';
    if (/\b(stock|disponible|dispo|famma|mawjoud|avoir)\b/.test(normalized)) return 'STOCK_CHECK';
    return hasCatalogPart ? 'SEARCH' : 'UNKNOWN';
  }

  // ─────────────────────────────────────────────────────────────────
  // Catalog vocabulary grounding
  // ─────────────────────────────────────────────────────────────────

  private getCandidateIndex(): CandidateIndex {
    const candidates = this.synonymsService.getInterpretationCandidates();
    const cached = this.candidateIndexCache.get(candidates);
    if (cached) return cached;

    const entries: IndexedCandidate[] = [];
    const byCanonical = new Map<string, IndexedCandidate>();
    for (const [canonical, variants] of Object.entries(candidates)) {
      const seen = new Set<string>();
      const aliases: IndexedAlias[] = [];
      for (const raw of [canonical, ...variants]) {
        const text = normalizeTerm(raw);
        if (!text || seen.has(text)) continue;
        seen.add(text);
        aliases.push({ text, compact: text.replace(/\s/g, '') });
      }
      const entry: IndexedCandidate = { canonical, variants, aliases };
      entries.push(entry);
      const key = normalizeTerm(canonical);
      if (key && !byCanonical.has(key)) byCanonical.set(key, entry);
    }
    const index = { entries, byCanonical };
    this.candidateIndexCache.set(candidates, index);
    return index;
  }

  /**
   * Concepts whose alias occurs in the text, most specific first (the longest
   * matched alias wins, so "filtre a air" beats "filtre"; a whole-word match
   * beats a compact-substring match).
   */
  private matchCandidates(sourceText: string, index: CandidateIndex): IndexedCandidate[] {
    const source = normalizeTerm(sourceText);
    if (!source) return [];
    const padded = ` ${source} `;
    const compactSource = source.replace(/\s/g, '');

    const scored: Array<{ entry: IndexedCandidate; score: number }> = [];
    for (const entry of index.entries) {
      let score = 0;
      for (const alias of entry.aliases) {
        if (padded.includes(` ${alias.text} `)) score = Math.max(score, alias.text.length * 2);
        else if (alias.compact.length >= 4 && compactSource.includes(alias.compact)) {
          score = Math.max(score, alias.compact.length);
        }
      }
      if (score > 0) scored.push({ entry, score });
    }
    return scored.sort((a, b) => b.score - a.score).map((item) => item.entry);
  }

  private sourceWithHistory(text: string, context?: QueryContext): string {
    return context?.useHistoryForInterpretation
      ? `${text} ${context.recentMessages.map((message) => message.content).join(' ')}`
      : text;
  }

  private async findCatalogPartInText(
    text: string,
    index: CandidateIndex,
    context?: QueryContext,
    allowedConcepts?: ReadonlySet<string>,
  ): Promise<CatalogMatch | null> {
    const matches = this.matchCandidates(this.sourceWithHistory(text, context), index)
      .filter((entry) => !allowedConcepts || allowedConcepts.has(normalizeTerm(entry.canonical)))
      .slice(0, MAX_CONCEPT_CHECKS);
    for (const entry of matches) {
      if (await this.synonymsService.hasCatalogDesignationConcept(entry.canonical, entry.variants)) {
        return { canonical: entry.canonical, variants: entry.variants };
      }
    }
    return null;
  }

  /**
   * Concepts offered to the model: only those that lexically match the message
   * (after dialect translation and DB-vocabulary spelling correction), capped.
   * The full vocabulary never goes into the prompt.
   */
  private shortlistCandidates(
    text: string,
    index: CandidateIndex,
    context?: QueryContext,
    allowedConcepts?: ReadonlySet<string>,
  ): IndexedCandidate[] {
    const corrected = tokenizeName(text).map((token) => this.synonymsService.findClosestVocabularyWord(token) ?? token);
    const expanded = [
      this.sourceWithHistory(text, context),
      this.applyTunisianNormalization(text),
      corrected.join(' '),
    ].join(' ');
    return this.matchCandidates(expanded, index)
      .filter((entry) => !allowedConcepts || allowedConcepts.has(normalizeTerm(entry.canonical)))
      .slice(0, MAX_PROMPT_CANDIDATES);
  }

  private compatibleConceptKeys(
    parts: CompatiblePartCandidate[],
    index: CandidateIndex,
  ): ReadonlySet<string> {
    return new Set(
      parts.flatMap((part) => this.matchCandidates(part.designation, index))
        .map((entry) => normalizeTerm(entry.canonical)),
    );
  }

  private async validateCatalogPart(
    source: string,
    normalized: string,
    requestedCanonical: string | null,
    index: CandidateIndex,
    context?: QueryContext,
    allowedConcepts?: ReadonlySet<string>,
  ): Promise<CatalogMatch | null> {
    if (!requestedCanonical) return null;
    // The model sometimes returns the whole designation instead of a concept key.
    // Resolve it to the most specific concept whose alias occurs in it (longest alias first).
    const entry =
      index.byCanonical.get(normalizeTerm(requestedCanonical)) ??
      this.matchCandidates(requestedCanonical, index).find(
        (candidate) => !allowedConcepts || allowedConcepts.has(normalizeTerm(candidate.canonical)),
      );
    if (!entry || (allowedConcepts && !allowedConcepts.has(normalizeTerm(entry.canonical)))) return null;

    // The customer's own words (plus their dialect translation) must contain the
    // concept, and so must the AI's rewrite: the model may not invent a part.
    const sourceText = `${this.sourceWithHistory(source, context)} ${this.applyTunisianNormalization(source)}`;
    if (!this.containsCatalogAlias(sourceText, entry) || !this.containsCatalogAlias(normalized, entry)) return null;
    if (!(await this.synonymsService.hasCatalogDesignationConcept(entry.canonical, entry.variants))) return null;

    return { canonical: entry.canonical, variants: entry.variants };
  }

  /** Whole-phrase match, or a windowed fuzzy match tolerant to spacing and small typos. */
  private containsCatalogAlias(text: string, entry: IndexedCandidate): boolean {
    const source = normalizeTerm(text);
    const padded = ` ${source} `;
    const sourceTokens = source.split(' ').filter(Boolean);

    return entry.aliases.some((alias) => {
      if (padded.includes(` ${alias.text} `)) return true;

      const aliasTokenCount = alias.text.split(' ').length;
      const windowSizes =
        aliasTokenCount === 1
          ? [1]
          : [aliasTokenCount - 1, aliasTokenCount, aliasTokenCount + 1].filter((size) => size > 0);

      return windowSizes.some((size) => {
        for (let start = 0; start + size <= sourceTokens.length; start++) {
          const compactWindow = sourceTokens.slice(start, start + size).join('');
          const maxDistance = Math.min(2, Math.floor(Math.min(alias.compact.length, compactWindow.length) * 0.25));
          if (
            compactWindow === alias.compact ||
            (maxDistance > 0 && levenshtein(compactWindow, alias.compact) <= maxDistance)
          ) {
            return true;
          }
        }
        return false;
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // AI output guards
  // ─────────────────────────────────────────────────────────────────

  private findLexicalDrift(
    source: string,
    aiNormalized: string,
    skipWordCheck: boolean,
  ): { counter: keyof NormalizationStats; reason: string } | null {
    const sourceWords = this.extractMeaningfulWords(source);
    const resultWords = this.extractMeaningfulWords(aiNormalized);

    if (!skipWordCheck) {
      const tunisianMap = this.synonymsService.getTunisianMap();
      for (const word of sourceWords) {
        if (tunisianMap[word] !== undefined) continue;
        if (!resultWords.some((candidate) => this.wordsCorrespond(word, candidate))) {
          return { counter: 'aiRejectedWordChanged', reason: `AI changed/removed word "${word}"` };
        }
      }
    }

    for (const resultWord of resultWords) {
      if (resultWord.length >= 4 && resultWord[0] === resultWord[1] && resultWord[1] === resultWord[2]) {
        return { counter: 'aiRejectedTripleLetter', reason: `AI added triple letters "${resultWord}"` };
      }
      const original = sourceWords.find((word) => resultWord === `a${word}` || resultWord === `aa${word}`);
      if (original) {
        return { counter: 'aiRejectedBadPrefix', reason: `AI added a prefix to "${original}" → "${resultWord}"` };
      }
    }
    return null;
  }

  /**
   * First meaningful word of the AI rewrite that the customer never wrote: not their word,
   * not a one-letter typo of it, not the dialect translation, not a re-spacing of their letters.
   * A vehicle name is only ever matched exactly (VITARA must never become "vitre").
   */
  private findAddedWord(source: string, aiNormalized: string, vehicleWords: ReadonlySet<string>): string | null {
    const customerWords = tokenizeName(`${source} ${this.applyTunisianNormalization(source)}`);
    const customerLetters = customerWords.join('');
    const fallbackText = this.normalizeEmergencyFallback(source);
    const fallbackWords = tokenizeName(fallbackText);
    const fallbackLetters = fallbackText.replace(/[^\p{L}\p{N}]/gu, '');
    const sourceVariants = new Set([...customerWords, ...fallbackWords]);

    for (const word of this.extractMeaningfulWords(aiNormalized)) {
      if (COURTESY_WORDS.has(word)) continue;
      const traced =
        sourceVariants.has(word) ||
        customerWords.some((original) =>
          vehicleWords.has(original) ? original === word : this.wordsCorrespond(original, word),
        ) ||
        (word.length >= 4 && (customerLetters.includes(word) || fallbackLetters.includes(word)));
      if (!traced) return word;
    }
    return null;
  }

  private wordsCorrespond(a: string, b: string): boolean {
    return (
      a === b ||
      a === `${b}s` || a === `${b}es` || b === `${a}s` || b === `${a}es` ||
      levenshtein(a, b) <= 1
    );
  }

  /**
   * Position fidelity. Positions are decided by the customer's own words (plus the
   * DB Tunisian dictionary), never by the LLM. The only exception is a faithful
   * re-spacing of concatenated input ("plaquetteavg" → "plaquette avant gauche").
   * Drift is logged so missing dialect words can be added to the Tunisian dictionary.
   */
  private enforcePositionFidelity(source: string, aiNormalized: string): string {
    const expected = extractRequestedPositions(this.applyTunisianNormalization(source));
    const proposed = extractRequestedPositions(aiNormalized);
    if (samePositions(expected, proposed)) return aiNormalized;
    if (this.isFaithfulRespacing(source, aiNormalized)) return aiNormalized;

    this.logger.warn(
      `[POSITION-DRIFT] "${source}" → AI "${aiNormalized}" — AI positions ${JSON.stringify(proposed)} ` +
      `not supported by the customer's words ${JSON.stringify(expected)}; restoring`,
    );
    const withoutPositions = tokenizeName(aiNormalized)
      .filter((token) => !isPositionToken(token))
      .join(' ');
    return hasAnyPosition(expected)
      ? `${withoutPositions} ${positionsToWords(expected).join(' ')}`.trim()
      : withoutPositions;
  }

  /** True when the AI tokens, with position words allowed in abbreviated form, spell exactly the customer's letters. */
  private isFaithfulRespacing(source: string, aiNormalized: string): boolean {
    const target = tokenizeName(this.applyTunisianNormalization(source)).join('');
    const tokens = tokenizeName(aiNormalized);
    if (!target || tokens.length === 0) return false;

    const forms = tokens.map((token) => this.surfaceForms(token));
    const failed = new Set<string>();
    const walk = (tokenIndex: number, offset: number): boolean => {
      if (tokenIndex === forms.length) return offset === target.length;
      const key = `${tokenIndex}:${offset}`;
      if (failed.has(key)) return false;
      for (const form of forms[tokenIndex]) {
        if (target.startsWith(form, offset) && walk(tokenIndex + 1, offset + form.length)) return true;
      }
      failed.add(key);
      return false;
    };
    return walk(0, 0);
  }

  private surfaceForms(token: string): string[] {
    if (!isPositionToken(token)) return [token];
    const positions = extractRequestedPositions(token);
    const codes = [...positions.axes, ...positions.sides, ...positions.levels];
    if (codes.length !== 1) return [token];
    return [...new Set([token, ...(POSITION_SURFACES[codes[0]] ?? [])])];
  }

  private canonicalizePositionWording(query: string): string {
    const positions = extractRequestedPositions(query);
    if (!hasAnyPosition(positions)) return query;

    const partWords = tokenizeName(query).filter((token) => !isPositionToken(token));
    return [...partWords, ...positionsToWords(positions)].join(' ').trim();
  }

  /**
   * Repairs misspelled part words against the real catalog vocabulary before any search or interpretation.
   * Vehicle names, dialect words, intent words, positions, colors and anything already known are never touched.
   */
  async repairTypos(text: string, vehicle?: QueryContext['vehicle']): Promise<string> {
     // A short price/stock/"d'accord" follow-up names no part: there is nothing to repair.
     if (this.isContextualFollowUp(text)) return text;
     const words = [...new Set(text.match(/[\p{L}]{5,}/gu) ?? [])];
    if (words.length === 0) return text;
    const vehicleWords = this.vehicleTokens(vehicle);
    const tunisian = this.synonymsService.getTunisianMap();
    const stop = this.synonymsService.getStopWords();
    const fixes = new Map<string, string>();
    for (const word of words) {
      const lower = word.toLowerCase();
      const folded = normalizeForMatch(lower);
      if (
        CONVERSATIONAL_WORDS.has(folded) || COURTESY_WORDS.has(folded) ||
        vehicleWords.has(folded) || tunisian[lower] !== undefined || stop.has(lower) ||
        isFillerToken(folded) || isPositionToken(folded) || isColorToken(folded) ||
        INTENT_WORDS.test(folded) || this.synonymsService.isKnownAutomotiveTerm(folded)
      ) continue;
      const fix = await this.synonymsService.findClosestCatalogWord(word);
      if (fix) {
        fixes.set(word, fix);
        this.logger.warn(`[TYPO-REPAIR] "${word}" → "${fix}"`);
      }
    }
    return fixes.size === 0 ? text : text.replace(/[\p{L}]{5,}/gu, (word) => fixes.get(word) ?? word);
  }

  /**
   * A word the customer typed that also exists in the vehicle-compatible catalog rows is real
   * catalog vocabulary: if the AI altered it slightly ("spirale" → "spiraale"), put the customer's
   * spelling back. Genuine corrections of unknown words are left alone.
   */
  private restoreCatalogSpelling(source: string, aiNormalized: string, evidence: ReadonlySet<string>): string {
    if (evidence.size === 0) return aiNormalized;
    const customerWords = tokenizeName(source);
    const exact = new Set(customerWords);
    return tokenizeName(aiNormalized)
      .map((token) => {
        if (exact.has(token)) return token;
        const original = customerWords.find(
          (word) => word.length >= 4 && evidence.has(word) && levenshtein(word, token) <= 2,
        );
        return original ?? token;
      })
      .join(' ');
  }

  /** Words that must survive the AI rewrite: no positions or filler (DB stop-words included). */
  private extractMeaningfulWords(text: string): string[] {
    const dbStopWords = this.synonymsService.getStopWords();
    return tokenizeName(text).filter(
      (word) => word.length >= 3 && !MEANINGLESS_WORDS.has(word) && !dbStopWords.has(word),
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // Dialect + emergency corrections
  // ─────────────────────────────────────────────────────────────────

  private getTunisianRules(): TunisianRules {
    const map = this.synonymsService.getTunisianMap();
    if (this.tunisianRules?.source === map) return this.tunisianRules;

    const lookup = new Map<string, string>();
    for (const [dialect, french] of Object.entries(map)) {
      const key = dialect.toLowerCase().trim();
      if (key) lookup.set(key, french);
    }
    const alternation = [...lookup.keys()]
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|');
    const pattern = alternation
      ? new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternation})(?![\\p{L}\\p{N}])`, 'giu')
      : null;

    this.tunisianRules = { source: map, lookup, pattern };
    return this.tunisianRules;
  }

  private hasTunisianMarker(lowerText: string): boolean {
    const { pattern } = this.getTunisianRules();
    return pattern ? lowerText.search(pattern) >= 0 : false;
  }

  /** DB dialect → French, one pass, whole words only, duplicate tokens removed. */
  private applyTunisianNormalization(query: string): string {
    const { pattern, lookup } = this.getTunisianRules();
    const lowered = query.toLowerCase().trim();
    const translated = pattern
      ? lowered.replace(pattern, (match) => lookup.get(match.toLowerCase()) ?? match)
      : lowered;

    const seen = new Set<string>();
    const tokens: string[] = [];
    for (const token of translated.split(/\s+/).filter(Boolean)) {
      if (seen.has(token)) continue;
      seen.add(token);
      tokens.push(token);
    }
    return tokens.join(' ');
  }

  private buildCorrections(): Map<string, string> {
    const corrections = new Map<string, string>();
    const add = (typo: string, fix: string) => {
      const key = typo.toLowerCase().trim();
      if (!key) return;
      corrections.set(key, fix);
      corrections.set(normalizeForMatch(key), fix);
    };
    for (const [typo, fix] of Object.entries(STATIC_TYPO_FALLBACK)) add(typo, fix);
    for (const [typo, fix] of Object.entries(this.synonymsService.getTypoMap())) add(typo, fix); // DB wins
    return corrections;
  }

  /** Used only when the AI is unavailable. Whole-word corrections, then a conservative fuzzy pass. */
  private normalizeEmergencyFallback(query: string, protectedWords: ReadonlySet<string> = new Set()): string {
    const corrections = this.buildCorrections();
    const stopWords = this.synonymsService.getStopWords();

    const rewritten = query
      .replace(/\b(?:leche|lèche)[\s-]+vitre\b/gi, 'lecheur de vitre')
      .replace(/\bfiltre\s+(?:de\s+)?climatiseur\b/gi, 'filtre habitacle');

    const corrected = rewritten.replace(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu, (word) => {
      const lower = word.toLowerCase();
      const direct = corrections.get(lower) ?? corrections.get(normalizeForMatch(lower));
      if (direct) return direct;

      if (!/^[\p{L}-]{4,}$/u.test(word) || stopWords.has(lower)) return word;
      const folded = normalizeForMatch(lower);
      if (protectedWords.has(lower) || protectedWords.has(folded) || INTENT_WORDS.test(folded) || isColorToken(folded)) return word;
      const closest = this.synonymsService.findClosestVocabularyWord(word);
      if (!closest || closest.toLowerCase() === lower) return word;
      this.stats.fuzzyCorrectionsApplied++;
      this.logger.warn(`[NORMALIZER-FALLBACK] Fuzzy correction: "${word}" → "${closest}"`);
      return closest;
    });

    return this.applyTunisianNormalization(corrected) || corrected;
  }

  // ─────────────────────────────────────────────────────────────────
  // AI call
  // ─────────────────────────────────────────────────────────────────

  private parseJsonObject(response: string): any {
    const start = response.indexOf('{');
    const end = response.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('No JSON in AI response');
    return JSON.parse(response.slice(start, end + 1));
  }

  private async normalizeWithAI(
    query: string,
    context: QueryContext | undefined,
    shortlist: IndexedCandidate[],
    compatibleParts?: CompatiblePartCandidate[],
  ): Promise<StructuredQueryInterpretation> {
    const contextInstructions = context
      ? `\nCONVERSATION CONTEXT RULES:\n- Interpret the current message using recent turns, but current explicit words always take priority over older topics.\n- Use history only to resolve references, short clarifications, and follow-up actions.\n- Use vehicle model/type code as scope, not as a part name. Never include a VIN in the normalized query.\n- If multiple antecedents are plausible, use intent CLARIFICATION_NEEDED and confidence below 0.6.\n- Do not turn a new explicit part request into a continuation of an older topic.\n`
      : '';
    const catalogVocabulary = shortlist.length > 0
      ? shortlist
          .map((entry) => {
            const aliases = [...new Set(entry.variants)].filter((variant) => variant !== entry.canonical).slice(0, 5);
            return aliases.length > 0 ? `${entry.canonical}: ${aliases.join(', ')}` : entry.canonical;
          })
          .join('\n')
      : '(no catalog concept matched this message: set catalogPart to null)';
    const compatiblePartRules = compatibleParts === undefined
      ? ''
      : compatibleParts.length > 0
        ? `\nVEHICLE-FILTERED CANDIDATE ARTICLES (all already match the vehicle compatibility filter):\n${compatibleParts
            .map((part) => part.designation.trim())
            .filter(Boolean)
            .filter((designation, index, values) => values.indexOf(designation) === index)
            .map((designation) => `- ${designation}`)
            .join('\n')}\nInterpret the request only against these article rows. Do not select or introduce a part that is not represented by them.\n`
        : '\nNO VEHICLE-COMPATIBLE ARTICLE CANDIDATES WERE FOUND. Do not invent or infer a part; use CLARIFICATION_NEEDED or UNKNOWN.\n';

    const systemPrompt = `You are a query parser for a Suzuki spare-parts catalog.
The catalog uses FRENCH names as primary display names (designation_2 field).
Your job is to normalize the customer's message into clean French search terms and to interpret it.

CATALOG-GROUNDED INTERPRETATION:
- The concepts below come from the live database and lexically match this message (canonical: aliases).
- For a car-part request, set catalogPart to exactly one canonical key from this list, or null if none fits.
- Never invent a part concept outside this list. catalogPart is only a proposal; the database search and deterministic validation decide whether the part exists and fits.
${catalogVocabulary}${contextInstructions}
${compatiblePartRules}

INTENT, PART, POSITION, QUALIFIERS, UNCERTAINTY:
- Classify every message as exactly one of ${INTENTS.join(', ')}.
- For SEARCH, PRICE_INQUIRY, and STOCK_CHECK, identify the requested catalogPart from the list above.
- catalogPart is the MAIN assembly the customer names, never one of its components, accessories or look-alikes (a grille, seal, support or clip is not the part it belongs to; an air filter is not a cabin filter; a window glass is not its seal).
- Return positions as arrays using axes AV/AR, sides G/D, levels SUP/INF. They must match the positions written in normalized.
- NEVER add a position the customer did not write. A generic request such as "pare-choc" has NO position.
- Return qualifiers as short customer-stated variants only (e.g. type, color, engine); do not invent missing qualifiers.
- confidence is confidence that the request was understood. uncertainty is its inverse, both 0..1.
- Do not decide fitment, stock, price, reference, or whether a database row is valid.

CRITICAL RULES:
1. Normalize dialect, typos, and conversational wording into a concise French search phrase. Retain all part-defining terms, numeric specifications, explicit colors/variants, and requested positions. Do not invent missing specifications.
2. OUTPUT IN FRENCH. Do NOT translate French part names to English OEM codes.
   BAD: "retroviseur" → "mirror assy out rear view"   GOOD: "retroviseur" → "retroviseur"
3. DO NOT change "agrafe" to "agrave" or add wrong accents.
4. Recognize ALL position indicators: avant/av, arriere/ar, gauche/g, droite/d, sup, inf. Preserve ALL of them, including single-letter "g" and "d".
5. isGreeting=true ONLY for pure greetings with NO car parts or positions.
6. isThanks=true for thanks (merci, 3aychek, barcha) AND goodbyes (au revoir, besslema).
7. Fix concatenated words by inserting spaces between recognizable part names.
8. Translate Tunisian dialect words to French equivalents.

EXAMPLES:
- "adhesifarporteavg" → "adhesif arriere porte avant gauche"
- "plaquetteavg" → "plaquette avant gauche"
- "garafe feu ar" → "agrafe feu arriere"
- "n7eb retroviseur" → "je veux retroviseur"
- "retroviseur gauche" → "retroviseur gauche"
- "ahla" → "bonjour" (isGreeting=true)
- "merci" → "merci" (isThanks=true)
- "g ar glace monte appareil" → "gauche arriere glace monte appareil"
- "ch7al retroviseur" → "prix retroviseur"

Respond with ONLY valid JSON, no markdown:
{"normalized":"standalone clean French query","intent":"one allowed intent","catalogPart":"exact canonical key from the list or null","positions":{"axes":[],"sides":[],"levels":[]},"qualifiers":[],"isGreeting":true/false,"isThanks":true/false,"confidence":0.0-1.0,"uncertainty":0.0-1.0}`;

    const recentConversation = context
      ? context.recentMessages
          .filter((message) => ['user', 'bot', 'assistant'].includes(message.role))
          .slice(-4)
          .map((message) => {
            const role = message.role === 'user' ? 'Client' : 'Assistant';
            const content = message.content
              .replace(/\b[A-HJ-NPR-Z0-9]{17}\b/gi, '[VIN]')
              .replace(/[\r\n\t]+/g, ' ')
              .slice(0, 300);
            return `${role}: ${content}`;
          })
          .join('\n')
      : '';
    const userPrompt = context
      ? `RECENT CONVERSATION:\n${recentConversation || '(none)'}\nVEHICLE: ${[context.vehicle?.marque, context.vehicle?.modele, context.vehicle?.typeCode].filter(Boolean).join(' ') || '(unknown)'}\nCURRENT MESSAGE: "${query}"`
      : `QUERY: "${query}"`;

    const result = this.parseJsonObject(await this.openaiService.completeJson(systemPrompt, userPrompt, 400));

    const intent: InterpretedIntent = INTENTS.includes(result.intent) ? result.intent : 'UNKNOWN';
    const rawPositions = result.positions && typeof result.positions === 'object' ? result.positions : {};
    const positionText = [rawPositions.axes, rawPositions.sides, rawPositions.levels]
      .flatMap((value: unknown) => (Array.isArray(value) ? value : typeof value === 'string' ? [value] : []))
      .filter((value: unknown): value is string => typeof value === 'string')
      .join(' ');

    const rawConfidence = Number(result.confidence);
    const confidence = Number.isFinite(rawConfidence) ? Math.max(0, Math.min(1, rawConfidence)) : 0.5;
    const rawUncertainty = Number(result.uncertainty);
    const uncertainty = Number.isFinite(rawUncertainty)
      ? Math.max(0, Math.min(1, rawUncertainty))
      : 1 - confidence;

    return {
      normalized: typeof result.normalized === 'string' && result.normalized.trim() ? result.normalized : query,
      intent,
      catalogPart: typeof result.catalogPart === 'string' ? result.catalogPart.trim() || null : null,
      positions: extractRequestedPositions(positionText),
      qualifiers: Array.isArray(result.qualifiers)
        ? result.qualifiers
            .filter((value: unknown): value is string => typeof value === 'string')
            .map((value: string) => value.trim())
            .filter(Boolean)
            .slice(0, 8)
        : [],
      isGreeting: intent === 'GREETING' || !!result.isGreeting,
      isThanks: intent === 'THANKS' || !!result.isThanks,
      // Confidence can never exceed what the model's own uncertainty allows.
      confidence: Math.min(confidence, 1 - uncertainty),
      uncertainty,
    };
  }
}