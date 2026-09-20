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
  extractRequestedPositions,
  hasAnyPosition,
  isPositionToken,
  positionsToWords,
  samePositions,
  tokenizeName,
} from '../chat/part-constraints';

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

  async normalizeQuery(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    this.stats.totalCalls++;
    const lowerQuery = query.toLowerCase();

    // FIX-6: dynamic, DB-backed check (was: local carPartNames array)
    const isCarPart = this.synonymsService.isKnownAutomotiveTerm(lowerQuery);

    const isServiceQuestion =
      /ouvrez|ouvert|heure|horaire|livraison|délai|garantie|situé|adresse|où|localisation/i.test(lowerQuery);

    // Tunisian marker detection — unchanged
    const hasTunisianMarker =
      /[0-9]/.test(lowerQuery.replace(/\s/g, '')) ||
      /\b(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)\b/i.test(lowerQuery) ||
      [...this.getTunisianWordSet()].some((tn) =>
        new RegExp(`\\b${tn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerQuery),
      );

    // Pure French/English car part query with no Tunisian — pass through unchanged
    if (isCarPart && !hasTunisianMarker) {
      this.stats.passthroughCarPart++;
      return { normalized: query, isGreeting: false, isThanks: false, confidence: 0.9 };
    }
    if (isServiceQuestion && !hasTunisianMarker) {
      this.stats.passthroughServiceQuestion++;
      return { normalized: query, isGreeting: false, isThanks: false, confidence: 0.9 };
    }

    // FIX-7: DB typo rows (langue='typo') merged OVER the static seed map.
    // Same sort-by-length + apply loop as before, just a richer source.
    const knownCorrections: Record<string, string> = {
      ...AIQueryNormalizerService.STATIC_TYPO_FALLBACK,
      ...this.synonymsService.getTypoMap(),
    };

    const sortedCorrections = Object.entries(knownCorrections).sort(
      ([a], [b]) => b.length - a.length,
    );

    let correctedQuery = query;
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

    // After both correction passes, re-check whether the query is now a
    // recognized car part with no Tunisian marker — if so, skip the
    // OpenAI round-trip entirely. This is where fuzzy correction pays
    // for itself: an unseen typo that used to force an AI call now
    // resolves for free.
    const correctedLower = correctedQuery.toLowerCase();
    const isCarPartAfterCorrection = this.synonymsService.isKnownAutomotiveTerm(correctedLower);
    if (isCarPartAfterCorrection && !hasTunisianMarker) {
      this.stats.passthroughAfterCorrection++;
      return { normalized: correctedQuery, isGreeting: false, isThanks: false, confidence: 0.88 };
    }

    // FIX-8: circuit breaker — if the AI's own output has been getting
    // rejected by the checks below more than 30% of the time over the
    // last 100 calls, skip the OpenAI round-trip entirely and go
    // straight to the DB Tunisian map. Cheaper, and we were going to
    // reject the AI output most of the time anyway in this state.
    if (this.isAiCircuitOpen()) {
      this.stats.aiSkippedCircuitOpen++;
      this.logger.warn(
        `⚡ AI circuit open (rejection rate > ${AIQueryNormalizerService.AI_REJECTION_THRESHOLD * 100}% ` +
        `over last ${this.aiOutcomes.length} calls) — skipping OpenAI, using DB Tunisian map`,
      );
      const fallbackNormalized = this.applyTunisianNormalization(correctedQuery);
      return {
        normalized: fallbackNormalized || correctedQuery,
        isGreeting:
          /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(correctedQuery),
        isThanks:
          /\b(merci|thanks|3aychek|barcha|au revoir|bye|à bientôt|bonne journée|besslema|sahha|ciao|adieu)\b/i.test(
            correctedQuery,
          ),
        confidence: 0.5,
      };
    }

    try {
      const aiResult = await this.normalizeWithAI(correctedQuery);
      const correctedWords = this.extractMeaningfulWords(correctedQuery);
      const resultWords    = this.extractMeaningfulWords(aiResult.normalized);

      const tunisianPattern =
        /[0-9]|^(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|salam|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)$/i;
      const tunisianMap = this.synonymsService.getTunisianMap();

      for (const qWord of correctedWords) {
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
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks:   aiResult.isThanks,
            confidence: 0.7,
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
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks:   aiResult.isThanks,
            confidence: 0.7,
          };
        }
        for (const cWord of correctedWords) {
          if (rWord === 'a' + cWord || rWord === 'aa' + cWord) {
            this.stats.aiRejectedBadPrefix++;
            this.recordAiOutcome(false);
            this.logger.warn(`⚠️ AI added prefix to "${cWord}" → "${rWord}" — rejecting AI result`);
            return {
              normalized: correctedQuery,
              isGreeting: aiResult.isGreeting,
              isThanks:   aiResult.isThanks,
              confidence: 0.7,
            };
          }
        }
      }

      // FIX 2026-09-20: the model may fix words, but it may NOT add, drop or
      // change a position. Positions are decided by the customer's own
      // words (+ the DB Tunisian dictionary), never by the LLM.
      const guarded = this.enforcePositionFidelity(correctedQuery, aiResult.normalized);
      this.stats.aiAccepted++;
      this.recordAiOutcome(true);
      this.logger.log(`✅ AI: "${query}" → "${guarded}" (${aiResult.confidence})`);
      return { ...aiResult, normalized: guarded };
    } catch (error: any) {
      // Not recorded in the rejection-rate window on purpose — a network
      // timeout or API error says nothing about whether the AI's actual
      // *output* is trustworthy, which is what the circuit breaker tracks.
      this.stats.aiCallError++;
      this.logger.warn(`⚠️ AI failed: ${error.message}`);
      // FIX-5: Tunisian fallback preserves French part name tokens
      const fallbackNormalized = this.applyTunisianNormalization(correctedQuery);
      return {
        normalized: fallbackNormalized || correctedQuery,
        isGreeting:
          /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(correctedQuery),
        isThanks:
          /\b(merci|thanks|3aychek|barcha|au revoir|bye|à bientôt|bonne journée|besslema|sahha|ciao|adieu)\b/i.test(
            correctedQuery,
          ),
        confidence: 0.5,
      };
    }
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
  private async normalizeWithAI(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    // FIX 2026-09-20: rules go in the system message, the query alone in the
    // user message, through completeJson() (no catalog persona, temperature 0).
    const systemPrompt = `You are a car parts query parser for a Suzuki parts catalog.
The catalog uses FRENCH names as primary display names (designation_2 field).
Your job is to normalize user queries into clean French search terms.

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
{"normalized":"clean French query","isGreeting":true/false,"isThanks":true/false,"confidence":0.0-1.0}`;

    const response  = await this.openaiService.completeJson(systemPrompt, `QUERY: "${query}"`);
    let jsonText = response.trim();
    if (!jsonText.startsWith('{')) {
      const jsonMatch = response.match(/\{[^}]+\}/);
      if (!jsonMatch) throw new Error('No JSON in AI response');
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText);
    return {
      normalized: result.normalized || query,
      isGreeting: !!result.isGreeting,
      isThanks:   !!result.isThanks,
      confidence: result.confidence || 0.9,
    };
  }
}