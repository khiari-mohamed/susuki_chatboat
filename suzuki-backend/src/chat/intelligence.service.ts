// src/chat/intelligence.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: carPartNames list (used in detectIntent) extended with the
//         full French designation_2 vocabulary — body panels, lighting,
//         interior, wipers, and all other French terms now searchable.
//         Previously French-named parts caused misclassification as
//         GREETING or SERVICE_QUESTION.
//
// FIX-2: analyzeQueryClarity() partKeywords list extended to match
//         the full French vocabulary so clarity scores are correct
//         when users type French part names from designation_2.
//
// FIX-3: extractTopic() extended with French body/lighting/interior/
//         cooling/exhaust topics that were missing. Topic tracking
//         now works for all designation_2 vocabulary.
//
// FIX-4: detectIntent() hasSpecificPart regex extended to cover all
//         French part names so intent is correctly classified as
//         SEARCH when a user types "retroviseur" or "calandre".
//
// FIX-5: normalizeTunisian() deduplication applied (same fix as
//         ai-query-normalizer.service.ts) to prevent double tokens.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);
  private corpusCache: Map<string, number> = new Map();
  private contextCache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000;
  private responseTimeTracker: number[] = [];
  private readonly MAX_TRACKED_RESPONSES = 100;

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: Full French car part name list — covers BOTH designation
  //         (English OEM) AND designation_2 (French primary field).
  //         Used in detectIntent() and analyzeQueryClarity().
  // ─────────────────────────────────────────────────────────────────
  private readonly carPartNames: string[] = [
    // ── Steering / suspension ────────────────────────────────────
    'maitre', 'maître', 'cylindre', 'etrier', 'étrier',
    'cremaillere', 'crémaillère', 'rotule', 'triangle', 'biellette',
    'roulement', 'stabilisatrice', 'ressort', 'silentbloc', 'soufflet',
    'cardan', 'moyeu', 'coupelle', 'bras',
    // ── Braking ──────────────────────────────────────────────────
    'plaquette', 'disque', 'tambour', 'frein', 'frina',
    // ── Filters ──────────────────────────────────────────────────
    'filtre',
    // ── Engine ───────────────────────────────────────────────────
    'courroie', 'distribution', 'tendeur', 'poulie', 'embrayage',
    'culasse', 'piston', 'segment', 'bielle', 'vilebrequin', 'vilbrequin',
    'soupape', 'joint', 'joints',
    // ── Electrical ───────────────────────────────────────────────
    'batterie', 'alternateur', 'démarreur', 'demarreur',
    'bougie', 'bobine', 'capteur', 'calculateur', 'faisceau',
    'fusible', 'relais', 'contacteur', 'commodo', 'commande', 'radar',
    // ── Cooling ──────────────────────────────────────────────────
    'radiateur', 'durite', 'durites', 'pompe', 'thermostat',
    'condenseur', 'compresseur', 'vase', 'reservoir', 'réservoir',
    // ── Fuel / injection ─────────────────────────────────────────
    'injecteur', 'injecteurs',
    // ── Exhaust ──────────────────────────────────────────────────
    'silencieux', 'echappement', 'échappement', 'catalyseur', 'collecteur',
    // ── Body / panels — FIX-1 ────────────────────────────────────
    'aile', 'capot', 'porte', 'pare', 'choc', 'parechoc', 'pare-choc',
    'calandre', 'malle', 'coffre', 'vitre', 'lunette', 'parebrise',
    'pare-brise', 'baguette', 'moulure', 'seuil', 'longeron', 'traverse',
    'renfort', 'tablier', 'plancher', 'toit', 'custode', 'hayon',
    'charniere', 'charnière', 'serrure', 'loquet', 'poignee', 'poignée',
    'garniture', 'enjoliveur',
    // ── Lighting — FIX-1 ─────────────────────────────────────────
    'phare', 'phares', 'feu', 'feux', 'optique', 'clignotant',
    'catadioptre', 'lampe', 'ampoule',
    // ── Interior — FIX-1 ─────────────────────────────────────────
    'siege', 'siège', 'ceinture', 'volant', 'tableau', 'tapis', 'airbag',
    'retroviseur', 'rétroviseur', 'retro',
    // ── Wipers / washer — FIX-1 ──────────────────────────────────
    'essuie', 'balai', 'leve', 'monte',
    // ── Misc ─────────────────────────────────────────────────────
    'agrafe', 'agraffe', 'agraphe', 'agrafes', 'agraffes', 'agraphes',
    'valve', 'soupape', 'cache', 'support', 'clip', 'vis', 'boulon',
    'ecrou', 'rondelle', 'cric', 'antenne', 'klaxon',
    'pneu', 'tuyau', 'toit', 'suspension',
  ];

  constructor(
    private prisma: PrismaService,
    private synonymsService: SynonymsService,
  ) {
    this.logger.log('✅ IntelligenceService initialized');
  }

  // ─────────────────────────────────────────────────────────────────
  // calculateConfidence — unchanged logic, unchanged signature
  // ─────────────────────────────────────────────────────────────────
  calculateConfidence(params: {
    productsFound: number;
    exactMatch: boolean;
    conversationContext: number;
    userFeedbackHistory: number;
    queryClarity: number;
  }): { score: number; level: 'HIGH' | 'MEDIUM' | 'LOW' } {
    try {
      let score = 0;

      if (params.productsFound > 0) {
        if (params.exactMatch)                    score += 50;
        else if (params.productsFound === 1)      score += 35;
        else if (params.productsFound <= 3)       score += 40;
        else                                      score += 30;
      } else {
        score -= 15;
      }

      if (params.conversationContext > 0) {
        score += Math.min(params.conversationContext * 2.5, 25);
      }
      if (params.userFeedbackHistory > 0) {
        score += Math.min(params.userFeedbackHistory * 4, 20);
      }
      score += Math.max(0, Math.min(params.queryClarity, 20));
      if (params.exactMatch && params.productsFound > 0) score += 15;
      if (params.queryClarity < 5 && params.productsFound === 0) score -= 10;

      score = Math.max(0, Math.min(score, 100));
      const level = score >= 75 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW';
      this.logger.debug(`Confidence calculated: ${score}% (${level})`);
      return { score, level };
    } catch (error) {
      this.logger.error('Error in calculateConfidence:', error);
      return { score: 0, level: 'LOW' };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: analyzeQueryClarity — extended partKeywords list
  // ─────────────────────────────────────────────────────────────────
  analyzeQueryClarity(message: string): number {
    try {
      if (!message || typeof message !== 'string') return 0;

      let clarity = 0;
      const lower      = message.toLowerCase();
      const normalized = this.normalizeTunisian(lower);

      // FIX-2: Extended part keywords — covers full French vocabulary
      const partKeywords = [
        // Original
        'filtre', 'plaquette', 'disque', 'amortisseur', 'phare', 'batterie',
        'courroie', 'bougie', 'alternateur', 'démarreur', 'capteur',
        'pneu', 'tuyau', 'joint', 'durite', 'radiateur', 'condenseur',
        'pompe', 'injecteur', 'embrayage', 'roulement',
        // FIX-2: French designation_2 vocabulary
        'retroviseur', 'rétroviseur', 'aile', 'capot', 'porte', 'vitre',
        'lunette', 'calandre', 'pare', 'hayon', 'charniere', 'serrure',
        'enjoliveur', 'clignotant', 'optique', 'feu', 'feux',
        'baguette', 'garniture', 'moulure', 'seuil', 'longeron', 'traverse',
        'siege', 'ceinture', 'volant', 'tapis', 'radar',
        'bobine', 'calculateur', 'faisceau', 'relais', 'fusible',
        'thermostat', 'compresseur', 'vase', 'reservoir',
        'silencieux', 'echappement', 'echappement', 'catalyseur',
        'culasse', 'vilebrequin', 'distribution', 'cardan', 'rotule',
        'triangle', 'biellette', 'bras', 'ressort', 'cremaillere',
        'tambour', 'etrier', 'agrafe', 'agraffe',
        'essuie', 'balai', 'leve', 'monte',
      ];

      if (partKeywords.some((k) => lower.includes(k) || normalized.includes(k))) {
        clarity += 15;
      }

      if (/\b(avant|arriere|arrière|gauche|droite|av|ar|g|d|conducteur|passager)\b/i.test(message)) {
        clarity += 10;
      }

      if (/\b(celerio|spresso|s-presso|swift|vitara|baleno|dzire|ciaz|fronx|jimny)\b/i.test(message)) {
        clarity += 8;
      }

      if (/[a-z0-9]{5,}[-_]?[a-z0-9]{2,}/i.test(message)) {
        clarity += 7;
      }

      if (/cherche|chercher|besoin|avoir|acheter|achete|shop|buy|trouver|trouve/i.test(message)) {
        clarity += 5;
      }

      if (/\d+\s*(pieces?|pcs?|qty|quantité)|\b(un|une|deux|trois|plusieurs|barcha)\b/i.test(message)) {
        clarity += 3;
      }

      clarity -= this.detectUncertainty(message) * 5;

      if (/truc|machin|bidule|chose|quelque chose|pas exactement|genre|vaguement/i.test(lower)) {
        clarity -= 8;
      }

      return Math.max(0, Math.min(clarity, 20));
    } catch (error) {
      this.logger.error('Error in analyzeQueryClarity:', error);
      return 0;
    }
  }

  private detectUncertainty(message: string): number {
    const patterns = [
      /i think|maybe|not sure|possible|puissant-être|pas sûr|je crois|genre|environ/i,
      /\?$/,
    ];
    return patterns.some((p) => p.test(message)) ? 1 : 0;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: normalizeTunisian — with deduplication
  // ─────────────────────────────────────────────────────────────────
  private normalizeTunisian(query: string): string {
    let normalized = query.toLowerCase();
    const tunisianMappings = this.synonymsService.getTunisianMap();

    for (const [tunisian, french] of Object.entries(tunisianMappings)) {
      if (french) {
        const escaped = tunisian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex   = new RegExp(`\\b${escaped}\\b`, 'gi');
        normalized    = normalized.replace(regex, french);
      }
    }

    // FIX-5: deduplicate tokens to avoid "retroviseur retroviseur"
    const tokens = normalized.split(/\s+/).filter(Boolean);
    const seen   = new Set<string>();
    const deduped: string[] = [];
    for (const token of tokens) {
      if (!seen.has(token)) { seen.add(token); deduped.push(token); }
    }
    return deduped.join(' ').trim();
  }

  // ─────────────────────────────────────────────────────────────────
  // learnFromFeedback — unchanged
  // ─────────────────────────────────────────────────────────────────
  async learnFromFeedback(sessionId: string): Promise<{
    successPatterns: string[];
    failurePatterns: string[];
    improvements: string[];
    learningSuccessRate: number;
  }> {
    try {
      const messages = await this.prisma.chatMessage.findMany({
        where:    { sessionId },
        include:  { feedback: true },
        orderBy:  { timestamp: 'asc' },
      });

      const successPatterns: string[] = [];
      const failurePatterns: string[] = [];
      const improvements:    string[] = [];
      let successCount = 0;
      let totalRated   = 0;

      for (const msg of messages) {
        if (msg.feedback && msg.feedback.rating !== null) {
          totalRated++;
          const pattern = this.extractPattern(msg.message);
          if (msg.feedback.rating >= 4) {
            successPatterns.push(pattern);
            successCount++;
          } else if (msg.feedback.rating <= 2) {
            failurePatterns.push(pattern);
            improvements.push(
              this.suggestImprovement(msg.message, msg.feedback.comment || undefined),
            );
          }
        }
      }

      const learningSuccessRate = totalRated > 0 ? (successCount / totalRated) * 100 : 0;
      this.logger.log(
        `Learning cycle: ${successCount}/${totalRated} successful (${learningSuccessRate.toFixed(1)}%)`,
      );
      return {
        successPatterns: [...new Set(successPatterns)],
        failurePatterns: [...new Set(failurePatterns)],
        improvements:    [...new Set(improvements)],
        learningSuccessRate,
      };
    } catch (error) {
      this.logger.error('Error in learnFromFeedback:', error);
      return { successPatterns: [], failurePatterns: [], improvements: [], learningSuccessRate: 0 };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // findSimilarQueries — unchanged
  // ─────────────────────────────────────────────────────────────────
  async findSimilarQueries(query: string, limit = 5): Promise<any[]> {
    try {
      const allPrompts = await this.prisma.chatPrompt.findMany({
        orderBy: { createdAt: 'desc' },
        take:    500,
      });
      if (allPrompts.length === 0) return [];

      const scored = allPrompts.map((prompt) => {
        const semanticScore = this.calculateSemanticSimilarity(query, prompt.promptText);
        const fuzzyScore    = this.calculateFuzzySimilarity(query, prompt.promptText);
        const combinedScore = semanticScore * 0.6 + fuzzyScore * 0.4;
        return { ...prompt, similarity: combinedScore, semanticScore, fuzzyScore };
      });

      return scored
        .filter((p) => p.similarity > 0.4)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      this.logger.error('Error in findSimilarQueries:', error);
      return [];
    }
  }

  private calculateSemanticSimilarity(query1: string, query2: string): number {
    try {
      const tokens1 = this.tokenize(query1);
      const tokens2 = this.tokenize(query2);
      if (tokens1.length === 0 || tokens2.length === 0) return 0;

      const set2         = new Set(tokens2);
      const intersection = tokens1.filter((t) => set2.has(t)).length;
      const union        = new Set([...tokens1, ...tokens2]).size;
      const jaccard      = union > 0 ? intersection / union : 0;

      const bigrams1          = this.getBigrams(tokens1);
      const bigrams2Set       = new Set(this.getBigrams(tokens2));
      const bigramIntersection = bigrams1.filter((b) => bigrams2Set.has(b)).length;
      const bigramUnion        = new Set([...bigrams1, ...bigrams2Set]).size;
      const bigramSim          = bigramUnion > 0 ? bigramIntersection / bigramUnion : 0;

      const lengthRatio =
        Math.min(tokens1.length, tokens2.length) / Math.max(tokens1.length, tokens2.length);

      const tfidf1  = this.buildTfIdf(tokens1, this.corpusCache);
      const tfidf2  = this.buildTfIdf(tokens2, this.corpusCache);
      const cosSim  = this.cosineSimilarity(tfidf1, tfidf2);

      return Math.max(0, Math.min(
        jaccard * 0.25 + bigramSim * 0.2 + lengthRatio * 0.1 + cosSim * 0.45,
        1,
      ));
    } catch {
      return 0;
    }
  }

  private calculateFuzzySimilarity(query1: string, query2: string): number {
    try {
      const lower1 = query1.toLowerCase();
      const lower2 = query2.toLowerCase();
      if (lower1 === lower2) return 1.0;

      const maxLen = Math.max(lower1.length, lower2.length);
      if (maxLen === 0) return 0;

      const distance           = this.levenshteinDistance(lower1, lower2);
      const normalizedDistance = 1 - distance / maxLen;

      const tokens1 = this.tokenize(lower1);
      const tokens2 = this.tokenize(lower2);
      let prefixBonus = 0;
      for (const t1 of tokens1) {
        for (const t2 of tokens2) {
          if (t1.startsWith(t2.substring(0, 3))) { prefixBonus += 0.05; break; }
        }
      }
      return Math.min(normalizedDistance + Math.min(prefixBonus, 0.25), 1.0);
    } catch {
      return 0;
    }
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
          matrix[i - 1][j - 1] + cost,
        );
      }
    }
    return matrix[b.length][a.length];
  }

  private buildTfIdf(
    tokens: string[],
    corpus: Map<string, number>,
  ): Record<string, number> {
    const freq: Record<string, number> = {};
    tokens.forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
      corpus.set(t, (corpus.get(t) || 0) + 1);
    });
    const total       = tokens.length;
    const corpusSize  = corpus.size || 1;
    const tfidf: Record<string, number> = {};
    Object.keys(freq).forEach((t) => {
      const tf  = freq[t] / total;
      const idf = Math.log(corpusSize / (corpus.get(t) || 1));
      tfidf[t]  = tf * idf;
    });
    return tfidf;
  }

  private cosineSimilarity(
    a: Record<string, number>,
    b: Record<string, number>,
  ): number {
    const common = Object.keys(a).filter((k) => b[k]);
    const dot    = common.reduce((sum, k) => sum + a[k] * b[k], 0);
    const magA   = Math.sqrt(Object.values(a).reduce((s, v) => s + v * v, 0));
    const magB   = Math.sqrt(Object.values(b).reduce((s, v) => s + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  }

  // ─────────────────────────────────────────────────────────────────
  // detectIntentWithAI — unchanged orchestration, uses fixed detectIntent
  // ─────────────────────────────────────────────────────────────────
  async detectIntentWithAI(
    message: string,
    conversationHistory: any[],
    hasPendingClarification?: boolean,
  ): Promise<{
    type: 'SEARCH' | 'PRICE_INQUIRY' | 'STOCK_CHECK' | 'GREETING' | 'COMPLAINT' | 'THANKS' | 'SERVICE_QUESTION' | 'CLARIFICATION_NEEDED';
    confidence: number;
    subIntent?: { location?: string; model?: string; year?: string };
  }> {
    try {
      const lower = (message || '').toLowerCase().trim();

      if (hasPendingClarification && this.isClarificationAnswerPattern(lower)) {
        return { type: 'SEARCH', confidence: 0.95, subIntent: this.detectSubIntent(message) };
      }

      const needsAI = this.needsAIUnderstanding(lower);
      if (needsAI) {
        return await this.detectIntentUsingOpenAI(message, conversationHistory);
      }

      return this.detectIntent(message, hasPendingClarification);
    } catch (error) {
      this.logger.error('Error in detectIntentWithAI:', error);
      return this.detectIntent(message, hasPendingClarification);
    }
  }

  private needsAIUnderstanding(message: string): boolean {
    return /\b[a-z]*[0-9]+[a-z]*\b|\b(salem|ahla|n7eb|famma|ch7al|bghit|kifech|ta3|mte3|chouf|behi|yezzi|karhba|9ad|3aychek|barcha|ken|wach|zeda|mouch|mech)\b/i.test(
      message,
    );
  }

  private async detectIntentUsingOpenAI(
    message: string,
    conversationHistory: any[],
  ): Promise<any> {
    const normalized = this.normalizeTunisian(message.toLowerCase());
    return this.detectIntent(normalized || message, false);
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-1 + FIX-4: detectIntent — uses carPartNames class property
  //                 and extended hasSpecificPart regex
  // ─────────────────────────────────────────────────────────────────
  detectIntent(
    message: string,
    hasPendingClarification?: boolean,
  ): {
    type: 'SEARCH' | 'PRICE_INQUIRY' | 'STOCK_CHECK' | 'GREETING' | 'COMPLAINT' | 'THANKS' | 'SERVICE_QUESTION' | 'CLARIFICATION_NEEDED';
    confidence: number;
    subIntent?: { location?: string; model?: string; year?: string };
  } {
    try {
      const lower      = (message || '').toLowerCase().trim();
      const normalized = this.normalizeTunisian(lower);
      const combined   = normalized || lower;

      if (hasPendingClarification && this.isClarificationAnswerPattern(lower)) {
        return { type: 'SEARCH', confidence: 0.95, subIntent: this.detectSubIntent(message) };
      }

      // FIX-1: Use class-level carPartNames (extended with French vocabulary)
      const hasCarPart = this.carPartNames.some(
        (part) => lower.includes(part) || combined.includes(part),
      );
      if (hasCarPart) {
        return { type: 'SEARCH', confidence: 0.90, subIntent: this.detectSubIntent(message) };
      }

      // Position-action queries
      if (
        /\b(montre|montrer|chouf|choufli|voir|regarde|affiche|afficher)\b.*\b(avant|arriere|arrière|gauche|droite|av|ar|g|d)\b/i.test(
          combined,
        )
      ) {
        return { type: 'SEARCH', confidence: 0.90, subIntent: this.detectSubIntent(message) };
      }

      // Single-word position answers
      if (
        /^\s*(avant|arriere|arrière|gauche|droite|av|ar|g|d|gosh|droit)\s*$/i.test(
          combined.trim(),
        )
      ) {
        return { type: 'SEARCH', confidence: 0.85, subIntent: this.detectSubIntent(message) };
      }

      // Goodbye
      if (
        /\b(au revoir|bye|à bientôt|bonne journée|besslema|sahha|ciao|adieu|à plus)\b/i.test(
          combined.trim(),
        )
      ) {
        return { type: 'THANKS', confidence: 0.95 };
      }

      // Pure greeting (no parts, no position)
      if (
        !hasPendingClarification &&
        this.isGreetingWord(lower) &&
        !this.carPartNames.some((p) => combined.includes(p)) &&
        !/stock|prix|disponible|famma|choufli|montre|voir|avant|arriere|arrière|gauche|droite/i.test(
          combined,
        )
      ) {
        return { type: 'GREETING', confidence: 0.95 };
      }

      // Greeting + help request (no parts)
      if (
        /^(bonjour|salut|hello|hi|salam|assalam)/i.test(message) &&
        /aide|help|assistance|trouver.*pièces|j'aurais besoin/i.test(lower) &&
        !this.carPartNames.some((p) => combined.includes(p))
      ) {
        return { type: 'GREETING', confidence: 0.95 };
      }

      // Thanks
      if (
        /^merci\b|^thank|barcha merci|merci beaucoup|thank you|merci pour|thanks for|je vous remercie|avec plaisir/i.test(
          combined,
        ) ||
        /^merci$/i.test(combined.trim())
      ) {
        return { type: 'THANKS', confidence: 0.95 };
      }

      // Complaint
      if (
        /pas content|pas satisfait|insatisfait|défectueux|defectueux|mauvais service|service.*pas|pas.*service|nul|terrible|horrible|bâclé|ne fonctionne pas|cassé|pièce cassée|pièce défectueuse|arnaque|deçu|marbou9/i.test(
          combined,
        )
      ) {
        return { type: 'COMPLAINT', confidence: 0.95 };
      }

      // Service question (no parts)
      if (
        /ouvrez|ouvert|heure|horaire|quand|livraison|délai|garantie|situé|adresse|où|localisation|winek|finek|win|fen/i.test(
          combined,
        )
      ) {
        if (!hasCarPart) return { type: 'SERVICE_QUESTION', confidence: 0.90 };
        return { type: 'SEARCH', confidence: 0.80, subIntent: this.detectSubIntent(message) };
      }

      // Diagnostic / problem (treat as search for parts)
      if (
        /bruit|fuite|probleme|problème|panne|ne marche pas|defectueux|casse|cassé|voyant|vibration|surchauffe|80000.*km|entretien|maintenance|bizarre|t9allek|ralenti|saccade|perte.*puissance/i.test(
          combined,
        )
      ) {
        return { type: 'SEARCH', confidence: 0.75, subIntent: this.detectSubIntent(message) };
      }

      // Price
      if (
        /prix|combien|cout|coute|coûte|price|cost|how much|show me price|ch7al|pris|tarif|taklfa/i.test(
          combined,
        ) ||
        /prix|combien|cout|coute|coûte|price|cost|how much|show me price|ch7al|pris|tarif|taklfa/i.test(
          lower,
        )
      ) {
        if (hasCarPart) return { type: 'SEARCH', confidence: 0.85, subIntent: this.detectSubIntent(message) };
        return { type: 'PRICE_INQUIRY', confidence: 0.82, subIntent: this.detectSubIntent(message) };
      }

      // Stock
      if (
        /stock|disponible|dispo|available|famma|do you have|have you got|avez vous|en stock|mawjoud|ken famma/i.test(
          combined,
        )
      ) {
        return { type: 'STOCK_CHECK', confidence: 0.82, subIntent: this.detectSubIntent(message) };
      }

      if (this.isVagueProblem(combined)) {
        return { type: 'CLARIFICATION_NEEDED', confidence: 0.75, subIntent: this.detectSubIntent(message) };
      }

      // FIX-4: Extended part-term detection — covers full French vocabulary
      const partTerms = [
        'filtre', 'plaquette', 'disque', 'amortisseur', 'phare', 'batterie', 'courroie', 'bougie',
        'alternateur', 'démarreur', 'demarreur', 'capteur', 'pneu', 'joint', 'durite', 'radiateur',
        'condenseur', 'pompe', 'injecteur', 'embrayage', 'roulement', 'retroviseur', 'rétroviseur',
        'aile', 'capot', 'porte', 'vitre', 'lunette', 'calandre', 'pare', 'hayon', 'charniere', 'serrure',
        'enjoliveur', 'clignotant', 'optique', 'feu', 'feux', 'baguette', 'garniture', 'moulure',
        'seuil', 'longeron', 'traverse', 'siege', 'ceinture', 'volant', 'tapis', 'radar', 'bobine',
        'calculateur', 'faisceau', 'relais', 'fusible', 'thermostat', 'compresseur', 'vase',
        'reservoir', 'silencieux', 'echappement', 'catalyseur', 'culasse', 'vilebrequin',
        'distribution', 'cardan', 'rotule', 'triangle', 'biellette', 'bras', 'ressort', 'cremaillere',
        'tambour', 'etrier', 'agrafe', 'agraffe', 'essuie', 'balai', 'leve', 'monte', 'klaxon', 'antenne',
        'cric', 'tableau', 'airbag', 'stabilis',
      ];

      const hasSpecificPart = partTerms.some((part) => {
        const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`, 'i').test(combined);
      });

      const hasPosition =
        /avant|arrière|arriere|gauche|droite|av|ar|g|d/i.test(combined);

      if (hasSpecificPart && hasPosition) {
        return { type: 'SEARCH', confidence: 0.92, subIntent: this.detectSubIntent(message) };
      }
      if (hasSpecificPart) {
        return { type: 'SEARCH', confidence: 0.85, subIntent: this.detectSubIntent(message) };
      }

      return { type: 'SEARCH', confidence: 0.72, subIntent: this.detectSubIntent(message) };
    } catch (error) {
      this.logger.error('Error in detectIntent:', error);
      return { type: 'SEARCH', confidence: 0.5 };
    }
  }

  private isGreetingWord(word: string): boolean {
    return ['ahla', 'salam', 'salem', 'bonjour', 'salut', 'hello', 'hi', 'hey', 'assalam'].includes(
      word.toLowerCase().trim(),
    );
  }

  private isClarificationAnswerPattern(text: string): boolean {
    const patterns = [
      /^(avant|arriere|arrière|gauche|droite|av|ar|g|d|gosh|droit)$/i,
      /^(avant|arriere|arrière|av|ar)\s+(gauche|droite|g|d|gosh|droit)$/i,
      /^(gauche|droite|g|d|gosh|droit)\s+(avant|arriere|arrière|av|ar)$/i,
    ];
    return patterns.some((pattern) => pattern.test(text.trim()));
  }

  private detectSubIntent(message: string) {
    const lower = message.toLowerCase();
    return {
      location: lower.match(/avant|arriere|droite|gauche|av|ar|g|d/)?.[0] || undefined,
      model:    lower.match(/swift|vitara|ciaz|alto|ertiga|dzire|celerio|spresso|baleno|fronx|jimny/i)?.[0] || undefined,
      year:     lower.match(/\b(19|20)\d{2}\b/)?.[0] || undefined,
    };
  }

  private isVagueProblem(text: string): boolean {
    if (!text) return false;
    const vaguePatterns = [
      /\bprobleme\b.*(?!moteur|freinage|suspension|electrique|batterie|alternateur|demarreur|bruit|fuite|voyant)/i,
      /ca\s+sert\s+a\s+quoi/i,
      /c'est\s+quoi/i,
      /pourquoi/i,
      /truc|machin|bidule|chose/i,
    ];
    return vaguePatterns.some((p) => p.test(text));
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: extractTopic — extended with French designation_2 topics
  // ─────────────────────────────────────────────────────────────────
  extractTopic(message: string): string {
    const lower      = message.toLowerCase();
    const normalized = this.normalizeTunisian(lower) || lower;

    // Braking — specific before generic
    if (lower.includes('plaquette') || lower.includes('plakete') || normalized.includes('plaquette'))
      return 'plaquettes frein';
    if (lower.includes('tambour') || lower.includes('etrier') || lower.includes('étrier'))
      return 'frein';
    if ((lower.includes('disque') && lower.includes('frein')) || lower.includes('frein') || lower.includes('frain'))
      return 'frein';

    // Suspension
    if (lower.includes('amortisseur') || lower.includes('ressort') || lower.includes('triangle') ||
        lower.includes('rotule') || lower.includes('biellette') || lower.includes('bras'))
      return 'suspension';

    // Steering
    if (lower.includes('cremaillere') || lower.includes('crémaillère') || lower.includes('volant'))
      return 'direction';

    // Transmission
    if (lower.includes('cardan') || lower.includes('roulement') || lower.includes('embrayage'))
      return 'transmission';

    // Filters
    if (lower.includes('filtre')) return 'filtre';

    // Engine
    if (lower.includes('courroie') || lower.includes('bougie') || lower.includes('culasse') ||
        lower.includes('distribution') || lower.includes('vilebrequin') ||
        lower.includes('injecteur') || lower.includes('pompe') || lower.includes('moteur'))
      return 'moteur';

    // Electrical
    if (lower.includes('batterie') || lower.includes('alternateur') ||
        lower.includes('demarreur') || lower.includes('démarreur') ||
        lower.includes('bobine') || lower.includes('capteur') ||
        lower.includes('calculateur') || lower.includes('faisceau') ||
        lower.includes('relais') || lower.includes('fusible') || lower.includes('radar'))
      return 'électrique';

    // Lighting — FIX-3
    if (lower.includes('phare') || lower.includes('optique') || lower.includes('feu') ||
        lower.includes('clignotant') || lower.includes('ampoule') || lower.includes('lampe'))
      return 'optique';

    // Body — FIX-3
    if (lower.includes('retroviseur') || lower.includes('rétroviseur') ||
        lower.includes('aile') || lower.includes('capot') || lower.includes('porte') ||
        lower.includes('vitre') || lower.includes('lunette') || lower.includes('calandre') ||
        lower.includes('pare') || lower.includes('hayon') || lower.includes('charniere') ||
        lower.includes('serrure') || lower.includes('enjoliveur') || lower.includes('moulure') ||
        lower.includes('baguette') || lower.includes('garniture') || lower.includes('seuil') ||
        lower.includes('longeron') || lower.includes('traverse'))
      return 'carrosserie';

    // Cooling — FIX-3
    if (lower.includes('radiateur') || lower.includes('durite') || lower.includes('thermostat'))
      return 'refroidissement';

    // AC — FIX-3
    if (lower.includes('condenseur') || lower.includes('compresseur'))
      return 'climatisation';

    // Exhaust — FIX-3
    if (lower.includes('echappement') || lower.includes('échappement') ||
        lower.includes('silencieux') || lower.includes('catalyseur'))
      return 'échappement';

    // Interior — FIX-3
    if (lower.includes('siege') || lower.includes('siège') || lower.includes('ceinture') ||
        lower.includes('tapis') || lower.includes('tableau') || lower.includes('airbag'))
      return 'intérieur';

    // Wipers — FIX-3
    if (lower.includes('essuie') || lower.includes('balai') || lower.includes('leve') ||
        lower.includes('monte'))
      return 'essuie-glace';

    return 'général';
  }

  // ─────────────────────────────────────────────────────────────────
  // trackContext — unchanged
  // ─────────────────────────────────────────────────────────────────
  async trackContext(sessionId: string): Promise<{
    topicFlow: string[];
    userPreferences: Record<string, any>;
    conversationStage: 'INITIAL' | 'ENGAGED' | 'CLOSING';
    lastSpecificQuery?: string;
    lastSpecificTopic?: string;
    lastVehicle?: any;
  }> {
    const cached = this.contextCache.get(sessionId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) return cached.data;

    const messages = await this.prisma.chatMessage.findMany({
      where:   { sessionId },
      orderBy: { timestamp: 'asc' },
    });

    const topicFlow = messages
      .filter((m) => m.sender === 'user')
      .map((m) => this.extractTopic(m.message));

    const conversationStage: 'INITIAL' | 'ENGAGED' | 'CLOSING' =
      messages.length <= 2 ? 'INITIAL' :
      messages.length >= 10 ? 'CLOSING' : 'ENGAGED';

    const userPreferences = this.extractPreferences(messages);

    let lastSpecificTopic: string | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        const topic = this.extractTopic(messages[i].message);
        if (topic !== 'général') { lastSpecificTopic = topic; break; }
      }
    }

    const result = { topicFlow, userPreferences, conversationStage, lastSpecificTopic };
    this.contextCache.set(sessionId, { data: result, timestamp: Date.now() });
    return result;
  }

  generateSmartSuggestions(query: string, foundParts: any[]): string[] {
    return [];
  }

  recordResponseTime(ms: number): void {
    try {
      if (typeof ms !== 'number' || ms <= 0) return;
      this.responseTimeTracker.push(ms);
      if (this.responseTimeTracker.length > this.MAX_TRACKED_RESPONSES) {
        this.responseTimeTracker.shift();
      }
    } catch (error) {
      this.logger.warn('Failed to record response time:', error);
    }
  }

  async getPerformanceMetrics(): Promise<{
    avgResponseTime: number;
    avgConfidence: number;
    successRate: number;
    learningRate: number;
    totalInteractions: number;
  }> {
    const feedbacks     = await this.prisma.chatFeedback.findMany({ include: { message: true } });
    const totalMessages = await this.prisma.chatMessage.count();
    const learningRate  = Math.min((totalMessages / 1000) * 100, 100);

    const ratedCount   = feedbacks.length || 0;
    const sumRatings   = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
    const avgRating    = ratedCount > 0 ? sumRatings / ratedCount : 0;
    const successRate  = ratedCount > 0
      ? (feedbacks.filter((f) => (f.rating || 0) >= 4).length / ratedCount) * 100
      : 0;

    const tracked        = this.responseTimeTracker || [];
    const avgResponseTime =
      tracked.length > 0
        ? Math.round(tracked.reduce((s, v) => s + v, 0) / tracked.length)
        : 0;

    return {
      avgResponseTime,
      avgConfidence:    Math.round(avgRating * 20),
      successRate,
      learningRate,
      totalInteractions: totalMessages,
    };
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-z0-9àâçéèêëîïôûùüÿñæœ]+/)
      .filter((t) => t.length > 2);
  }

  private getBigrams(tokens: string[]): string[] {
    const bigrams: string[] = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
    }
    return bigrams;
  }

  private extractPattern(message: string): string {
    return this.tokenize(message).slice(0, 3).join(' ');
  }

  private suggestImprovement(message: string, comment?: string): string {
    if (comment?.includes('pas trouvé')) return 'Améliorer la recherche de synonymes';
    if (comment?.includes('prix'))       return 'Afficher les prix plus clairement';
    return 'Améliorer la clarté de la réponse';
  }

  private extractPreferences(messages: any[]): Record<string, any> {
    const prefs: Record<string, any> = {
      language:      'fr',
      responseStyle: 'professional',
      emotion:       'NEUTRAL',
    };
    const userMessages = messages
      .filter((m) => m.sender === 'user')
      .map((m) => m.message)
      .join(' ');
    if (/\b(ken|famma|chouf|behi|wah|n7eb|mte3i|ahla|ya khoya|barcha|choufli)\b/i.test(userMessages)) {
      prefs.language = 'darija';
    } else if (/\b(do you|I need|show me|how much|brake|price|availability)\b/i.test(userMessages)) {
      prefs.language = 'en';
    }
    prefs.emotion = this.detectEmotion(userMessages);
    return prefs;
  }

  private detectEmotion(message: string): string {
    const lower    = message.toLowerCase();
    let score      = 0;
    const positive = ['merci', 'super', 'excellent', 'behi', 'bravo', 'parfait', 'génial', 'top', 'bien'];
    const negative = ['fache', 'marbou9', 'angry', 'wtf', 'nul', 'mauvais', 'terrible', 'pas content'];
    positive.forEach((w) => { if (lower.includes(w)) score++; });
    negative.forEach((w) => { if (lower.includes(w)) score--; });
    if (score > 0) return 'POSITIVE';
    if (score < 0) return 'NEGATIVE';
    return 'NEUTRAL';
  }
}