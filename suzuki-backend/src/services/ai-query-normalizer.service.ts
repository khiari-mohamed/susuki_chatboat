// src/services/ai-query-normalizer.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: carPartNames list extended to cover ALL French terms now
//         present in designation_2 (the primary search field).
//         Previously many French part names were missing, causing
//         the AI normalizer to call the OpenAI API unnecessarily —
//         or worse, to mutate valid French part queries.
//
// FIX-2: knownCorrections map extended with French-specific typos
//         that users commonly make when typing designation_2 names.
//
// FIX-3: AI prompt updated to explicitly mention designation_2 is
//         now the primary field, and that French names must be
//         preserved verbatim (not translated to English OEM).
//
// FIX-4: extractMeaningfulWords() stop-word list extended to include
//         common French filler words that appear in designation_2
//         values and should not be validated as mandatory tokens.
//
// FIX-5: applyTunisianNormalization() fallback now also preserves
//         any French part name tokens that survived alongside
//         Tunisian words (mixed queries like "n7eb retroviseur").
//
// FIX-6 (2026-09-16): the local `carPartNames` list — one of three
//         near-identical copies scattered across services — is gone.
//         isCarPart now calls synonymsService.isKnownAutomotiveTerm(),
//         a single DB-backed check (dynamic synonym index, with the
//         old three lists merged into one static safety-net fallback
//         inside SynonymsService). See synonyms.service.ts.
//
// FIX-7 (2026-09-16): the hardcoded `knownCorrections` typo map is now
//         a FALLBACK, not the only source. At call time it's merged
//         with synonymsService.getTypoMap() (DB rows, langue='typo',
//         manageable from /admin/synonyms with no deploy). DB entries
//         win on key collisions. Behavior is unchanged on a DB with no
//         typo rows yet — this is additive, not a replacement.
//
// FIX-8 (2026-09-16): added a lightweight circuit breaker + in-memory
//         stats around the OpenAI call. If the AI's own output keeps
//         getting rejected by the existing validation checks (word
//         preservation / triple-letter / bad-prefix) over a rolling
//         window, we stop calling it for a while and go straight to
//         the DB Tunisian map — cheaper, and avoids paying OpenAI
//         latency for a mode that's currently failing anyway. This is
//         in-memory only (resets on restart) — no schema change.
//
// NOTE: synonyms.service.ts is architecturally correct and does not
//       need structural changes. See synonyms.service.ts fix notes
//       at the bottom of this file.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../chat/openai.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import {
  buildRequestedPartTokens,
  extractRequestedPositions,
  hasAnyPosition,
  isPositionToken,
  normalizeForMatch,
  positionsToWords,
  type PositionRequest,
  samePositions,
  tokenizeName,
} from '../chat/part-constraints';

interface ConversationMessage {
  role: string;
  content: string;
}

interface QueryContext {
  recentMessages: ConversationMessage[];
  vehicle?: { marque?: string | null; modele?: string | null; typeCode?: string | null };
  useHistoryForInterpretation: boolean;
}

export type InterpretedIntent =
  | 'SEARCH'
  | 'PRICE_INQUIRY'
  | 'STOCK_CHECK'
  | 'GREETING'
  | 'COMPLAINT'
  | 'THANKS'
  | 'SERVICE_QUESTION'
  | 'CLARIFICATION_NEEDED'
  | 'FILTER'
  | 'DIAGNOSTIC'
  | 'UNKNOWN';

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

@Injectable()
export class AIQueryNormalizerService {
  private readonly logger = new Logger(AIQueryNormalizerService.name);
  // No cache — getTunisianMap() already returns an in-memory object.
  // Caching the Set here caused stale results after synonymsService.reload()
  // (e.g. admin adds a new TN word via dashboard → cache never invalidated).

  // ─────────────────────────────────────────────────────────────────
  // FIX-8: circuit breaker state — rolling window of the last AI
  // validation outcomes (true = accepted, false = rejected/errored).
  // Kept small and in-memory on purpose; see getNormalizationStats().
  // ─────────────────────────────────────────────────────────────────
  private static readonly AI_WINDOW_SIZE = 100;
  private static readonly AI_MIN_SAMPLE = 20;   // don't trip on tiny samples
  private static readonly AI_REJECTION_THRESHOLD = 0.3;
  private aiOutcomes: boolean[] = [];

  // Lightweight, process-local counters for observability. Not
  // persisted — restart resets them. Enough to answer "is OpenAI
  // helping or hurting" without a schema migration; promote to a real
  // NormalizationLog table later if historical trends are needed.
  private stats = {
    totalCalls: 0,
    passthroughCarPart: 0,
    passthroughServiceQuestion: 0,
    fuzzyCorrectionsApplied: 0,
    passthroughAfterCorrection: 0,
    aiSkippedCircuitOpen: 0,
    aiAccepted: 0,
    aiRejectedWordChanged: 0,
    aiRejectedTripleLetter: 0,
    aiRejectedBadPrefix: 0,
    aiCallError: 0,
  };

  constructor(
    private openaiService: OpenAIService,
    private synonymsService: SynonymsService,
  ) {}

  private getTunisianWordSet(): Set<string> {
    return new Set(Object.keys(this.synonymsService.getTunisianMap()));
  }

  /** FIX-8: record one AI validation outcome and trim the rolling window. */
  private recordAiOutcome(accepted: boolean): void {
    this.aiOutcomes.push(accepted);
    if (this.aiOutcomes.length > AIQueryNormalizerService.AI_WINDOW_SIZE) {
      this.aiOutcomes.shift();
    }
  }

  /** FIX-8: true once the AI's recent rejection rate crosses the threshold. */
  private isAiCircuitOpen(): boolean {
    if (this.aiOutcomes.length < AIQueryNormalizerService.AI_MIN_SAMPLE) return false;
    const rejections = this.aiOutcomes.filter((accepted) => !accepted).length;
    const rejectionRate = rejections / this.aiOutcomes.length;
    return rejectionRate > AIQueryNormalizerService.AI_REJECTION_THRESHOLD;
  }

  /** Process-local normalization stats — see the `stats` field above. */
  getNormalizationStats() {
    const rejections = this.aiOutcomes.filter((accepted) => !accepted).length;
    const rejectionRate = this.aiOutcomes.length > 0 ? rejections / this.aiOutcomes.length : 0;
    return {
      ...this.stats,
      aiWindowSize: this.aiOutcomes.length,
      aiRecentRejectionRate: Number(rejectionRate.toFixed(3)),
      aiCircuitOpen: this.isAiCircuitOpen(),
      dbTypoMapSize: this.synonymsService.getTypoMapSize(),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-7: small in-code seed for typo corrections. This used to be
  // the ONLY source (hardcoded, needs a deploy to change). It is now
  // merged UNDER synonymsService.getTypoMap() (DB, langue='typo') at
  // call time — DB rows win on key collisions, and this stays purely
  // as a bootstrap/safety-net so behavior never regresses on an
  // unmigrated DB. Run seed-typo-corrections.ts once to move these
  // into the DB so they become admin-manageable.
  // ─────────────────────────────────────────────────────────────────
  private static readonly STATIC_TYPO_FALLBACK: Record<string, string> = {
      // Original corrections
      ilbrequin:   'vilebrequin',
      vilbrequin:  'vilebrequin',
      rtaverse:    'traverse',
      rtavers:     'traverse',
      olle:        'tolle',
      avlve:       'valve',
      avse:        'vase',
      garaffes:    'agraffes',
      garafes:     'agrafes',
      garaffe:     'agraffe',
      garafe:      'agrafe',
      graffes:     'agraffes',
      graffe:      'agraffe',
      garaphe:     'agraphe',
      graphe:      'agraphe',
      iale:        'aile',
      ial:         'aile',
      ivtre:       'vitre',
      amorto:      'amortisseur',
      ovlant:      'volant',
      olant:       'volant',
      arier:       'arriere',
      arriére:     'arriere',
      trversear:   'traverse arriere',
      traversear:  'traverse arriere',
      parbrise:    'pare-brise',
      parebrise:   'pare-brise',

      // FIX-2: Additional French designation_2 typos
      retrovisuer:   'retroviseur',
      retrovisseur:  'retroviseur',
      retrovissuer:  'retroviseur',
      retrovizeur:   'retroviseur',
      rétrovisseur:  'retroviseur',
      amortiseur:    'amortisseur',
      amortizeur:    'amortisseur',
      plaquetes:     'plaquettes',
      plaquete:      'plaquette',
      courorie:      'courroie',
      courroi:       'courroie',
      roulement:     'roulement',   // keep — already correct
      roulment:      'roulement',
      roulemnt:      'roulement',
      embrayge:      'embrayage',
      embreyage:     'embrayage',
      charniere:     'charniere',   // keep — already correct
      charnierre:    'charniere',
      charnieres:    'charnieres',
      serrur:        'serrure',
      serrures:      'serrures',    // keep
      poignée:       'poignee',
      radiateur:     'radiateur',   // keep
      raditaeur:     'radiateur',
      radiatuer:     'radiateur',
      raditeur:      'radiateur',
      alternater:    'alternateur',
      alternatuer:   'alternateur',
      demarreur:     'demarreur',   // keep
      demareur:      'demarreur',
      cremaillere:   'cremaillere', // keep
      crmaillere:    'cremaillere',
      crrmaillere:   'cremaillere',
      ceinture:      'ceinture',    // keep
      cienture:      'ceinture',
      disqe:         'disque',
      disqeu:        'disque',
      captuer:       'capteur',
      captueur:      'capteur',
      clignotnat:    'clignotant',
      clignotan:     'clignotant',
      calindre:      'calandre',
      calandre:      'calandre',    // keep
      parechoc:      'pare-choc',
      parechocs:     'pare-chocs',
      lunete:        'lunette',
      luunette:      'lunette',
      souffelt:      'soufflet',
      souflet:       'soufflet',
      enjolivuer:    'enjoliveur',
      enjolivueur:   'enjoliveur',
      essuiglace:    'essuie glace',
      'essuie-glace':  'essuie-glace',  // keep
      leveglace:     'leve glace',
      monteglace:    'monte glace',
      laveglace:     'lave glace',
  };

  async normalizeQuery(
    query: string,
    history: ConversationMessage[] = [],
    vehicle?: QueryContext['vehicle'],
  ): Promise<StructuredQueryInterpretation> {
    this.stats.totalCalls++;
    const catalogQuery = query.replace(/\bl[eè]che[\s-]+vitre\b/gi, 'lecheur de vitre');
    const lowerQuery = catalogQuery.toLowerCase();
    const catalogCandidates = this.synonymsService.getInterpretationCandidates();
    const hasUnknownPartTokens = this.hasUnknownPartTokens(catalogQuery);

    // FIX-6: dynamic, DB-backed check (was: local carPartNames array)
    const isCarPart = this.synonymsService.isKnownAutomotiveTerm(lowerQuery);
    const isContextualFollowUp = this.isContextualFollowUp(query);
    const cleanQuery = query.trim();
    const isServiceQuestion =
      /ouvrez|ouvert|heure|horaire|livraison|délai|garantie|situé|adresse|où|localisation/i.test(lowerQuery);

    if (/^(bonjour|bonsoir|salut|hello|hi|salem|ahla|salam)\s*[!?.]*$/i.test(cleanQuery)) {
      return this.fallbackInterpretation(cleanQuery, 1, 'GREETING');
    }
    const thanksWords = new Set([
      'merci', 'thanks', '3aychek', 'barcha', 'au', 'revoir', 'bye', 'besslema', 'ciao', 'adieu',
      'beaucoup', 'bien', 'infiniment', 'mille', 'fois', 'bonne', 'journee', 'soiree', 'bientot', 'tres',
    ]);
    if (
      !isCarPart &&
      !isContextualFollowUp &&
      cleanQuery.split(/\s+/).length <= 6 &&
      /\b(merci|thanks|3aychek|barcha|au revoir|bye|besslema|ciao|adieu)\b/i.test(cleanQuery) &&
      !this.hasUnknownPartTokens(cleanQuery, thanksWords)
    ) {
      return this.fallbackInterpretation(cleanQuery, 1, 'THANKS');
    }
    if (!isCarPart && !isContextualFollowUp && isServiceQuestion) {
      this.stats.passthroughServiceQuestion++;
      return this.fallbackInterpretation(cleanQuery, 1, 'SERVICE_QUESTION');
    }

    const conversationContext = history.length > 0 || vehicle
      ? { recentMessages: history.slice(-6), vehicle, useHistoryForInterpretation: isContextualFollowUp && !isCarPart }
      : undefined;

    // Tunisian marker detection — unchanged
    const hasTunisianMarker =
      /[0-9]/.test(lowerQuery.replace(/\s/g, '')) ||
      /\b(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)\b/i.test(lowerQuery) ||
      [...this.getTunisianWordSet()].some((tn) =>
        new RegExp(`\\b${tn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerQuery),
      );

    if (isCarPart && !hasTunisianMarker && !hasUnknownPartTokens) this.stats.passthroughCarPart++;
    if (isServiceQuestion && !hasTunisianMarker) this.stats.passthroughServiceQuestion++;

    // FIX-7: DB typo rows (langue='typo') merged OVER the static seed map.
    // Same sort-by-length + apply loop as before, just a richer source.
    const knownCorrections: Record<string, string> = {
      ...AIQueryNormalizerService.STATIC_TYPO_FALLBACK,
      ...this.synonymsService.getTypoMap(),
    };

    const sortedCorrections = Object.entries(knownCorrections).sort(
      ([a], [b]) => b.length - a.length,
    );

    let correctedQuery = catalogQuery;
    const appliedCorrections = new Set<string>();

    // In automotive French, "filtre climatiseur" means the cabin/pollen
    // filter. Normalize the phrase directly instead of asking the user to
    // choose between unrelated air, fuel, and oil filters.
    correctedQuery = correctedQuery.replace(/\bfiltre\s+(?:de\s+)?climatiseur\b/gi, 'filtre habitacle');

    for (const [typo, correct] of sortedCorrections) {
      const lq = correctedQuery.toLowerCase();
      if (lq.includes(typo) && !appliedCorrections.has(correct)) {
        correctedQuery = correctedQuery.replace(new RegExp(typo, 'gi'), correct);
        appliedCorrections.add(correct);
        this.logger.log(`✅ Pre-corrected: ${typo} → ${correct}`);
      }
    }

    // FIX-9 (2026-09-16): fuzzy typo correction — this is the actual
    // answer to "I can't predict every wrong word". The exact map above
    // only catches typos someone has already seen and added. This pass
    // catches ANY typo of a word already in the vocabulary by edit
    // distance, with no list to maintain. See
    // SynonymsService.findClosestVocabularyWord() for the matching
    // rules (conservative: unambiguous match required, distance budget
    // scales with word length).
    const rawTokens = correctedQuery.split(/(\s+)/); // keep whitespace so we can rejoin exactly
    for (let i = 0; i < rawTokens.length; i++) {
      const token = rawTokens[i];
      if (!/^[a-zA-Zàâçéèêëîïôûùüÿñæœ-]+$/.test(token)) continue; // skip whitespace/numbers/punctuation
      if (token.length < 4) continue;
      if (this.synonymsService.getStopWords().has(token.toLowerCase())) continue;

      const fix = this.synonymsService.findClosestVocabularyWord(token);
      if (fix && fix.toLowerCase() !== token.toLowerCase()) {
        this.stats.fuzzyCorrectionsApplied++;
        this.logger.log(`✨ Fuzzy-corrected: "${token}" → "${fix}" (no list entry needed)`);
        rawTokens[i] = fix;
      }
    }
    correctedQuery = rawTokens.join('');

    // Track recognition after local correction for observability, but every
    // turn still receives the structured OpenAI interpretation below.
    const correctedLower = correctedQuery.toLowerCase();
    const isCarPartAfterCorrection = this.synonymsService.isKnownAutomotiveTerm(correctedLower);
    if (isCarPartAfterCorrection && !hasTunisianMarker && !this.hasUnknownPartTokens(correctedQuery)) {
      this.stats.passthroughAfterCorrection++;
    }

    const localCatalogPart = await this.findCatalogPartInText(
      correctedQuery,
      catalogCandidates,
      conversationContext,
    );
    const deterministicConfidence = localCatalogPart && !this.hasUnknownPartTokens(correctedQuery) ? 0.75 : 0.5;

    try {
      const aiResult = await this.normalizeWithAI(correctedQuery, conversationContext, catalogCandidates);
      const requiresCatalogPart =
        ['SEARCH', 'PRICE_INQUIRY', 'STOCK_CHECK'].includes(aiResult.intent) ||
        isCarPart || isContextualFollowUp || isCarPartAfterCorrection;
      const matchedCatalogPart = await this.validateCatalogPart(
        correctedQuery,
        aiResult.normalized,
        aiResult.catalogPart,
        catalogCandidates,
        conversationContext,
      );
      if (requiresCatalogPart && !matchedCatalogPart) {
        this.stats.aiRejectedWordChanged++;
        this.recordAiOutcome(false);
        this.logger.warn(`⚠️ AI interpretation was not grounded in catalog vocabulary: "${aiResult.catalogPart ?? ''}"`);
        return {
          ...aiResult,
          normalized: correctedQuery,
          catalogPart: localCatalogPart?.canonical ?? null,
          catalogAliases: localCatalogPart?.variants ?? [],
          source: 'deterministic',
          positions: extractRequestedPositions(correctedQuery),
          confidence: deterministicConfidence,
          uncertainty: 1 - deterministicConfidence,
          intent: this.inferDeterministicIntent(query, !!localCatalogPart),
        };
      }

      const normalizedPositions = extractRequestedPositions(aiResult.normalized);
      if (!samePositions(normalizedPositions, aiResult.positions)) {
        this.recordAiOutcome(false);
        this.logger.warn('[AI-INTERPRETATION] Structured positions do not match the normalized query; falling back conservatively');
        return {
          ...aiResult,
          normalized: correctedQuery,
          catalogPart: localCatalogPart?.canonical ?? null,
          catalogAliases: localCatalogPart?.variants ?? [],
          source: 'deterministic',
          positions: extractRequestedPositions(correctedQuery),
          confidence: deterministicConfidence,
          uncertainty: 1 - deterministicConfidence,
          intent: this.inferDeterministicIntent(query, !!localCatalogPart),
        };
      }

      const correctedWords = this.extractMeaningfulWords(correctedQuery);
      const resultWords    = this.extractMeaningfulWords(aiResult.normalized);

      const tunisianPattern =
        /[0-9]|^(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|salam|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)$/i;
      const tunisianMap = this.synonymsService.getTunisianMap();

      for (const qWord of isContextualFollowUp || matchedCatalogPart ? [] : correctedWords) {
        if (tunisianPattern.test(qWord) || tunisianMap[qWord] !== undefined) continue;

        const hasExactMatch  = resultWords.some((rw) => rw === qWord);
        const hasPluralMatch = resultWords.some(
          (rw) =>
            rw === qWord + 's'  || rw === qWord + 'es' ||
            qWord === rw + 's'  || qWord === rw + 'es',
        );
        const hasFuzzyMatch  = resultWords.some((rw) => this.levenshtein(qWord, rw) <= 1);

        if (!hasExactMatch && !hasPluralMatch && !hasFuzzyMatch) {
          this.stats.aiRejectedWordChanged++;
          this.recordAiOutcome(false);
          this.logger.warn(`⚠️ AI changed/removed word "${qWord}" — using corrected query instead`);
          return {
            ...aiResult,
            normalized: correctedQuery,
            catalogPart: localCatalogPart?.canonical ?? null,
            catalogAliases: localCatalogPart?.variants ?? [],
            source: 'deterministic',
            positions: extractRequestedPositions(correctedQuery),
            confidence: deterministicConfidence,
            uncertainty: 1 - deterministicConfidence,
            intent: this.inferDeterministicIntent(query, !!localCatalogPart),
          };
        }
      }

      // Reject AI output that adds suspicious prefixes or triple letters
      for (const rWord of resultWords) {
        if (rWord.length >= 4 && rWord[0] === rWord[1] && rWord[1] === rWord[2]) {
          this.stats.aiRejectedTripleLetter++;
          this.recordAiOutcome(false);
          this.logger.warn(`⚠️ AI added triple letters "${rWord}" — rejecting AI result`);
          return {
            ...aiResult,
            normalized: correctedQuery,
            catalogPart: localCatalogPart?.canonical ?? null,
            catalogAliases: localCatalogPart?.variants ?? [],
            source: 'deterministic',
            positions: extractRequestedPositions(correctedQuery),
            confidence: deterministicConfidence,
            uncertainty: 1 - deterministicConfidence,
            intent: this.inferDeterministicIntent(query, !!localCatalogPart),
          };
        }
        for (const cWord of correctedWords) {
          if (rWord === 'a' + cWord || rWord === 'aa' + cWord) {
            this.stats.aiRejectedBadPrefix++;
            this.recordAiOutcome(false);
            this.logger.warn(`⚠️ AI added prefix to "${cWord}" → "${rWord}" — rejecting AI result`);
            return {
              ...aiResult,
              normalized: correctedQuery,
              catalogPart: localCatalogPart?.canonical ?? null,
              catalogAliases: localCatalogPart?.variants ?? [],
              source: 'deterministic',
              positions: extractRequestedPositions(correctedQuery),
              confidence: deterministicConfidence,
              uncertainty: 1 - deterministicConfidence,
              intent: this.inferDeterministicIntent(query, !!localCatalogPart),
            };
          }
        }
      }

      // FIX 2026-09-20: the model may fix words, but it may NOT add, drop or
      // change a position. Positions are decided by the customer's own
      // words (+ the DB Tunisian dictionary), never by the LLM.
      const guarded = isContextualFollowUp
        ? aiResult.normalized.trim()
        : this.enforcePositionFidelity(correctedQuery, aiResult.normalized);
      const catalogQuery = this.canonicalizePositionWording(guarded);
      this.stats.aiAccepted++;
      this.recordAiOutcome(true);
      this.logger.log(`✅ AI: "${query}" → "${catalogQuery}" (${aiResult.confidence})`);
      return {
        ...aiResult,
        normalized: catalogQuery,
        catalogPart: matchedCatalogPart?.canonical ?? null,
        catalogAliases: matchedCatalogPart?.variants ?? [],
        source: 'ai',
        positions: extractRequestedPositions(catalogQuery),
      };
    } catch (error: any) {
      // Not recorded in the rejection-rate window on purpose — a network
      // timeout or API error says nothing about whether the AI's actual
      // *output* is trustworthy, which is what the circuit breaker tracks.
      this.stats.aiCallError++;
      this.logger.warn(`⚠️ AI failed: ${error.message}`);
      // FIX-5: Tunisian fallback preserves French part name tokens
      const fallbackNormalized = this.applyTunisianNormalization(correctedQuery);
      const normalizedFallback = fallbackNormalized || correctedQuery;
      return {
        ...this.fallbackInterpretation(normalizedFallback, deterministicConfidence),
        intent: this.inferDeterministicIntent(query, !!localCatalogPart),
        catalogPart: localCatalogPart?.canonical ?? null,
        catalogAliases: localCatalogPart?.variants ?? [],
        source: 'deterministic',
      };
    }
  }

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
      isGreeting: intent === 'GREETING' || /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(normalized),
      isThanks: intent === 'THANKS' || /\b(merci|thanks|3aychek|barcha|au revoir|bye|besslema|ciao|adieu)\b/i.test(normalized),
      catalogAliases: [],
      source: 'deterministic',
    };
  }

  private isContextualFollowUp(query: string): boolean {
    const words = query.trim().split(/\s+/).filter(Boolean);
    if (words.length > 8 || query.length > 100) return false;

    return /\b(?:l(?:['’]|\s+)autre|autre\s+c[oô]t[eé]|c[oô]t[eé]\s+oppos[eé]|pareil(?:le)?|idem|la\s+m[eê]me(?:\s+chose)?|le\s+m[eê]me(?:\s+chose)?|celle(?:-ci|-l[aà])?|celui(?:-ci|-l[aà])?|disponible|en\s+stock|famma|mawjoud|combien|ch7al|prix|tarif|co[uû]t)\b/i.test(query);
  }

  private hasUnknownPartTokens(query: string, ignore: ReadonlySet<string> = new Set()): boolean {
    const requestedTokens = buildRequestedPartTokens(tokenizeName(query), ignore);
    return requestedTokens.some((token) =>
      !this.synonymsService.isKnownAutomotiveTerm(token) &&
      !this.synonymsService.findClosestVocabularyWord(token),
    );
  }

  private inferDeterministicIntent(query: string, hasCatalogPart: boolean): InterpretedIntent {
    const normalized = this.normalizeForComparison(query);
    if (/\b(prix|price|ch7al|combien|cout|tarif|cost)\b/.test(normalized)) return 'PRICE_INQUIRY';
    if (/\b(stock|disponible|dispo|famma|mawjoud|avoir)\b/.test(normalized)) return 'STOCK_CHECK';
    return hasCatalogPart ? 'SEARCH' : 'UNKNOWN';
  }

  private async findCatalogPartInText(
    query: string,
    catalogCandidates: Record<string, string[]>,
    context?: QueryContext,
  ): Promise<{ canonical: string; variants: string[] } | null> {
    const sourceText = context?.useHistoryForInterpretation
      ? `${query} ${context.recentMessages.map((message) => message.content).join(' ')}`
      : query;
    const normalizeTerm = (value: string) => normalizeForMatch(value).replace(/[/-]+/g, ' ').replace(/\s+/g, ' ').trim();
    const source = normalizeTerm(sourceText);
    for (const [canonical, variants] of Object.entries(catalogCandidates)) {
      const aliases = [...new Set([canonical, ...variants])];
      const found = aliases.some((alias) => {
        const normalizedAlias = normalizeTerm(alias);
        if (!normalizedAlias) return false;
        if (` ${source} `.includes(` ${normalizedAlias} `)) return true;
        const compactAlias = normalizedAlias.replace(/\s/g, '');
        const compactSource = source.replace(/\s/g, '');
        return compactAlias.length >= 4 && compactSource.includes(compactAlias);
      });
      if (found && await this.synonymsService.hasCatalogDesignationConcept(canonical, aliases)) {
        return { canonical, variants };
      }
    }
    return null;
  }

  private canonicalizePositionWording(query: string): string {
    const positions = extractRequestedPositions(query);
    if (!hasAnyPosition(positions)) return query;

    const partWords = tokenizeName(query).filter((token) => !isPositionToken(token));
    return [...partWords, ...positionsToWords(positions)].join(' ').trim();
  }

  private async validateCatalogPart(
    source: string,
    normalized: string,
    requestedCanonical: string | null,
    catalogCandidates: Record<string, string[]>,
    context?: QueryContext,
  ): Promise<{ canonical: string; variants: string[] } | null> {
    if (!requestedCanonical) return null;
    const normalizeTerm = (value: string) => normalizeForMatch(value).replace(/[/-]+/g, ' ').replace(/\s+/g, ' ').trim();
    const requestedKey = normalizeTerm(requestedCanonical);
    const entry = Object.entries(catalogCandidates).find(([canonical]) => normalizeTerm(canonical) === requestedKey);
    if (!entry) return null;

    const [canonical, variants] = entry;
    const aliases = [...new Set([canonical, ...variants])];
    const sourceText = context?.useHistoryForInterpretation
      ? `${source} ${context.recentMessages.map((message) => message.content).join(' ')}`
      : source;
    const hasRelatedAlias = this.containsCatalogAlias(sourceText, aliases, normalizeTerm);
    const normalizedHasAlias = this.containsCatalogAlias(normalized, aliases, normalizeTerm);

    if (!hasRelatedAlias || !normalizedHasAlias) return null;
    if (!await this.synonymsService.hasCatalogDesignationConcept(canonical, aliases)) return null;

    return { canonical, variants };
  }

  private containsCatalogAlias(
    text: string,
    aliases: string[],
    normalizeTerm: (value: string) => string,
  ): boolean {
    const source = normalizeTerm(text);
    const sourceTokens = source.split(' ').filter(Boolean);

    return aliases.some((alias) => {
      const normalizedAlias = normalizeTerm(alias);
      if (!normalizedAlias) return false;
      if (` ${source} `.includes(` ${normalizedAlias} `)) return true;

      const compactAlias = normalizedAlias.replace(/\s/g, '');
      const aliasTokens = normalizedAlias.split(' ').filter(Boolean);
      const windowSizes = aliasTokens.length === 1
        ? [1]
        : [aliasTokens.length - 1, aliasTokens.length, aliasTokens.length + 1].filter((size) => size > 0);

      return windowSizes.some((size) => {
        for (let start = 0; start + size <= sourceTokens.length; start++) {
          const compactWindow = sourceTokens.slice(start, start + size).join('');
          const maxDistance = Math.min(2, Math.floor(Math.min(compactAlias.length, compactWindow.length) * 0.25));
          if (compactWindow === compactAlias || (maxDistance > 0 && this.levenshtein(compactWindow, compactAlias) <= maxDistance)) {
            return true;
          }
        }
        return false;
      });
    });
  }


  // ─────────────────────────────────────────────────────────────────
  // FIX 2026-09-20: position fidelity guard.
  // extractMeaningfulWords() deliberately ignores position words, so the
  // checks above could never notice the LLM adding "avant" or turning "g"
  // into "droite". Compare the positions of what the customer typed (after
  // the deterministic DB dialect map) with the positions of the LLM output;
  // on any difference keep the LLM's wording for the PART and restore the
  // customer's positions. Drift is logged so missing dialect words can be
  // added to the Tunisian dictionary (admin → synonyms).
  // ─────────────────────────────────────────────────────────────────
  private enforcePositionFidelity(source: string, aiNormalized: string): string {
    const expected = extractRequestedPositions(this.applyTunisianNormalization(source));
    const proposed = extractRequestedPositions(aiNormalized);

    // Concatenated input ("plaquetteavg", "adhesifarporteavg") is the one case
    // where the LLM legitimately DISCOVERS positions the tokenizer cannot see.
    // For such long blobs an LLM position is accepted only if its abbreviation
    // really occurs inside the blob.
    const blobs = tokenizeName(source).filter((t) => t.length >= 8);
    const surface: Record<string, string[]> = {
      AV: ['av', 'avant'], AR: ['ar', 'arr', 'arriere'],
      G: ['g', 'gauche'], D: ['d', 'droite', 'droit'],
      SUP: ['sup'], INF: ['inf'],
    };
    const supportedByBlob = (code: string) =>
      blobs.some((b) => (surface[code] ?? []).some((f) => b.includes(f)));
    const allowed = {
      axes:   [...expected.axes,   ...proposed.axes.filter((a) => !expected.axes.includes(a)   && supportedByBlob(a))],
      sides:  [...expected.sides,  ...proposed.sides.filter((x) => !expected.sides.includes(x)  && supportedByBlob(x))],
      levels: [...expected.levels, ...proposed.levels.filter((l) => !expected.levels.includes(l) && supportedByBlob(l))],
    };
    if (samePositions(allowed, proposed)) return aiNormalized;

    this.logger.warn(
      `[POSITION-DRIFT] "${source}" → AI "${aiNormalized}" — AI positions ` +
      `${JSON.stringify(proposed)} not supported by the customer's words ${JSON.stringify(allowed)}; restoring`,
    );
    const withoutPositions = tokenizeName(aiNormalized)
      .filter((t) => !isPositionToken(t))
      .join(' ');
    return hasAnyPosition(allowed)
      ? `${withoutPositions} ${positionsToWords(allowed).join(' ')}`.trim()
      : withoutPositions;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: applyTunisianNormalization
  // Replaces Tunisian words with French equivalents while preserving
  // any French part name tokens already present in the query.
  // Uses DB-driven TN map from SynonymsService.
  // ─────────────────────────────────────────────────────────────────
  private applyTunisianNormalization(query: string): string {
    const tunisianMap = this.synonymsService.getTunisianMap();
    let result = query.toLowerCase().trim();

    for (const [tunisian, french] of Object.entries(tunisianMap)) {
      const escaped = tunisian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex   = new RegExp(`\\b${escaped}\\b`, 'gi');
      result = result.replace(regex, french);
    }

    // FIX-5: After replacement, deduplicate tokens that may have been
    // introduced twice (e.g. "retroviseur retroviseur" if both the Tunisian
    // word AND the French word were in the original query)
    const tokens     = result.split(/\s+/).filter(Boolean);
    const seen       = new Set<string>();
    const deduped: string[] = [];
    for (const token of tokens) {
      if (!seen.has(token)) {
        seen.add(token);
        deduped.push(token);
      }
    }
    return deduped.join(' ');
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: extractMeaningfulWords — extended stop-word list
  // Covers French filler words that appear in designation_2 values
  // and should NOT be treated as mandatory search tokens.
  // ─────────────────────────────────────────────────────────────────
  private extractMeaningfulWords(text: string): string[] {
    const normalized = this.normalizeForComparison(text);
    const stopWords  = new Set([
      // Original stop words
      'avant', 'arriere', 'gauche', 'droite',
      'pour', 'avec', 'sans', 'tout', 'tous',
      'des', 'les', 'une', 'stock', 'disponible',
      // FIX-4: French filler words common in designation_2
      'assy', 'comp', 'set', 'kit', 'sub', 'and',
      'the', 'de', 'du', 'la', 'le', 'et', 'en',
      'sur', 'sous', 'par', 'ou', 'car',
      // Position abbreviations — not meaningful tokens to validate
      'av', 'ar', 'sup', 'inf', 'int', 'ext',
      'lh', 'rh', 'fr', 'rr',
    ]);

    return normalized
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));
  }

  private normalizeForComparison(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private levenshtein(a: string, b: string): number {
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

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: AI prompt updated to:
  //  - Mention that French names (designation_2) are primary
  //  - Explicitly forbid translating French names to English OEM
  //  - Add French body/lighting/interior examples
  // ─────────────────────────────────────────────────────────────────
  private async normalizeWithAI(
    query: string,
    context: QueryContext | undefined,
    catalogCandidates: Record<string, string[]>,
  ): Promise<StructuredQueryInterpretation> {
    const contextInstructions = context
      ? `\nCONVERSATION CONTEXT RULES:\n- Interpret the current message using recent turns, but current explicit words always take priority over older topics.\n- Use history only to resolve references, short clarifications, and follow-up actions.\n- Use vehicle model/type code as scope, not as a part name. Never include a VIN in the normalized query.\n- If multiple antecedents are plausible, use intent CLARIFICATION_NEEDED and confidence below 0.6.\n- Do not turn a new explicit part request into a continuation of an older topic.\n`
      : '';
    const catalogVocabulary = Object.entries(catalogCandidates)
      .map(([canonical, variants]) => `${canonical}: ${variants.slice(0, 5).join(', ')}`)
      .join('\n');
    const systemPrompt = `You are a car parts query parser for a Suzuki parts catalog.
The catalog uses FRENCH names as primary display names (designation_2 field).
Your job is to normalize user queries into clean French search terms.

CATALOG-GROUNDED INTERPRETATION:
- The following canonical part concepts and aliases come from the live database synonym index.
- For a car-part request, set catalogPart to exactly one canonical key from this list, or null if none fits.
- Never invent a part concept outside this list. A selected part is only an interpretation proposal; the database search and deterministic validation decide whether it exists and fits.
${catalogVocabulary}${contextInstructions}

INTENT, PART, POSITION, QUALIFIERS, UNCERTAINTY:
- Classify every message as exactly one of SEARCH, PRICE_INQUIRY, STOCK_CHECK, GREETING, COMPLAINT, THANKS, SERVICE_QUESTION, CLARIFICATION_NEEDED, FILTER, DIAGNOSTIC, UNKNOWN.
- For SEARCH, PRICE_INQUIRY, and STOCK_CHECK, identify the requested catalogPart from the canonical list.
- Return positions as arrays using axes AV/AR, sides G/D, levels SUP/INF. These must match the position meaning preserved in normalized.
- Return qualifiers as short customer-stated variants only (e.g. type, color, engine); do not invent missing qualifiers.
- confidence is confidence that the request was understood. uncertainty is its inverse, both 0..1.
- Do not decide fitment, stock, price, reference, or whether a database row is valid.

CRITICAL RULES:
1. PRESERVE ORIGINAL WORDS — only expand abbreviations and fix spacing/typos.
2. OUTPUT IN FRENCH — do NOT translate French part names to English OEM codes.
   BAD: "retroviseur" → "mirror assy out rear view"
   GOOD: "retroviseur" → "retroviseur"
3. DO NOT change "agrafe" to "agrave" or add wrong accents.
4. Recognize ALL position indicators: avant/av, arriere/ar, gauche/g, droite/d, sup, inf.
5. Recognize French car part names: retroviseur, aile, capot, porte, phare, feu, clignotant,
   optique, calandre, vitre, lunette, pare-choc, charniere, serrure, garniture, baguette,
   amortisseur, plaquette, disque, filtre, durite, radiateur, batterie, courroie, embrayage,
   cardan, rotule, triangle, cremaillere, culasse, injecteur, pompe, compresseur, etc.
6. PRESERVE ALL POSITIONS — if query has "ar" AND "av", keep BOTH.
7. isGreeting=true ONLY for pure greetings with NO car parts or positions.
8. isThanks=true for thanks (merci, 3aychek, barcha) AND goodbyes (au revoir, besslema).
9. PRESERVE SINGLE-LETTER POSITIONS: keep "g" (gauche) and "d" (droite).
10. Fix concatenated words by inserting spaces between recognizable part names.
11. Translate Tunisian dialect words to French equivalents.

EXAMPLES:
- "adhesifarporteavg" → "adhesif arriere porte avant gauche"
- "plaquetteavg" → "plaquette avant gauche"
- "garafe feu ar" → "agrafe feu arriere"
- "n7eb retroviseur" → "je veux retroviseur"
- "retroviseur gauche" → "retroviseur gauche"   (keep French, do NOT say "mirror lh")
- "aile avant droite" → "aile avant droite"
- "feu arriere gauche" → "feu arriere gauche"
- "ahla" → "bonjour" (isGreeting=true)
- "merci" → "merci" (isThanks=true)
- "g ar glace monte appareil" → "gauche arriere glace monte appareil"
- "ch7al retroviseur" → "prix retroviseur"

Respond with ONLY valid JSON, no markdown:
{"normalized":"standalone clean French query","intent":"one allowed intent","catalogPart":"exact canonical key from catalog list or null","positions":{"axes":[],"sides":[],"levels":[]},"qualifiers":[],"isGreeting":true/false,"isThanks":true/false,"confidence":0.0-1.0,"uncertainty":0.0-1.0}`;

    const recentConversation = context
      ? context.recentMessages
          .filter((message) => message.role === 'user' || message.role === 'bot' || message.role === 'assistant')
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
    const response  = await this.openaiService.completeJson(systemPrompt, userPrompt, 400);
    let jsonText = response.trim();
    if (!jsonText.startsWith('{')) {
      const jsonMatch = response.match(/\{[^}]+\}/);
      if (!jsonMatch) throw new Error('No JSON in AI response');
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText);
    const intents: InterpretedIntent[] = [
      'SEARCH', 'PRICE_INQUIRY', 'STOCK_CHECK', 'GREETING', 'COMPLAINT',
      'THANKS', 'SERVICE_QUESTION', 'CLARIFICATION_NEEDED', 'FILTER', 'DIAGNOSTIC', 'UNKNOWN',
    ];
    const intent = intents.includes(result.intent) ? result.intent as InterpretedIntent : 'UNKNOWN';
    const rawPositions = result.positions && typeof result.positions === 'object' ? result.positions : {};
    const positionValues = [rawPositions.axes, rawPositions.sides, rawPositions.levels]
      .flatMap((value: unknown) => Array.isArray(value) ? value : typeof value === 'string' ? [value] : [])
      .filter((value: unknown): value is string => typeof value === 'string');
    const positions: PositionRequest = extractRequestedPositions(positionValues.join(' '));
    const rawConfidence = Number(result.confidence);
    const confidence = Number.isFinite(rawConfidence) ? Math.max(0, Math.min(1, rawConfidence)) : 0.5;
    const rawUncertainty = Number(result.uncertainty);
    const uncertainty = Number.isFinite(rawUncertainty)
      ? Math.max(0, Math.min(1, rawUncertainty))
      : 1 - confidence;
    return {
      normalized: result.normalized || query,
      intent,
      catalogPart: typeof result.catalogPart === 'string' ? result.catalogPart.trim() : null,
      positions,
      qualifiers: Array.isArray(result.qualifiers)
        ? result.qualifiers.filter((value: unknown): value is string => typeof value === 'string').map((value: string) => value.trim()).filter(Boolean).slice(0, 8)
        : [],
      isGreeting: intent === 'GREETING' || !!result.isGreeting,
      isThanks: intent === 'THANKS' || !!result.isThanks,
      confidence: Math.min(confidence, 1 - uncertainty),
      uncertainty,
    };
  }
}