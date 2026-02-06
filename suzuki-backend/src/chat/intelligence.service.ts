import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);
  private corpusCache: Map<string, number> = new Map();
  private contextCache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private responseTimeTracker: number[] = [];
  private readonly MAX_TRACKED_RESPONSES = 100;
  private readonly tunisianMappings: Record<string, string> = {
    // Greetings & common phrases
    'ahla': '', 'salam': 'bonjour', 'salem': 'bonjour', 'assalam': 'bonjour',
    'n7eb': 'je veux acheter', 'nchri': 'acheter', 'njib': 'j\'apporte',
    'lel': 'pour le', 'mte3': 'de', 'mte3i': 'de mon', 'mtaa': 'ton',
    'karhba': 'voiture', 'karhabti': 'ma voiture',
    'mkasra': 'fait du bruit', 't9alet': 'cassé', 't9ala9': 'défectueux', 't9allek': 'fait du bruit',
    'famma': 'disponible stock', 'famech': 'il n\'y a pas', 'ken famma': 'si disponible stock',
    'chnowa': 'quel', 'chneya': 'quoi', 'wach': 'est-ce que',
    'zebi': 'beau', 'barcha': 'beaucoup', '9ad': 'combien',
    'stok': 'stock disponible', 'dispo': 'disponible stock', 'mawjoud': 'disponible stock',
    'pris': 'prix', 'ch7al': 'combien', 'choufli': 'regarder prix',
    'gosh': 'gauche', 'droit': 'droite',
    'avent': 'avant', 'arrière': 'arriere',
    'ya khoya': '', 'behi': 'génial', 'marbou9': 'fâché',
    'ken': 'si', 'chouf': 'regarde',
    'maareftech': 'je ne sais pas où', 'win': 'où', 'nlaqa': 'trouver',
    'zeda': 'aussi', 'ya3tik': 'merci',
    'filtere': 'filtre', 'filtr': 'filtre', 'filter': 'filtre',
    'celirio': 'celerio', 'celario': 'celerio',
    'frain': 'frein', 'frin': 'frein',
    'amortiseeur': 'amortisseur', 'amortiseur': 'amortisseur', 'amortisor': 'amortisseur',
    'fil': 'dans le', 'el': 'le', 'w': 'et',
    'mouch': 'pas', 'mech': 'pas',
  };

  constructor(private prisma: PrismaService) {
    this.logger.log('✅ IntelligenceService initialized');
  }
  /**
   * Calculate confidence score based on multiple factors
   * Enhanced with better weighting and edge cases
   */
  calculateConfidence(params: {
    productsFound: number;
    exactMatch: boolean;
    conversationContext: number;
    userFeedbackHistory: number;
    queryClarity: number;
  }): { score: number; level: 'HIGH' | 'MEDIUM' | 'LOW' } {
    try {
      let score = 0;

      // Products found (0-50 points) - increased importance
      if (params.productsFound > 0) {
        if (params.exactMatch) {
          score += 50; // Perfect match
        } else if (params.productsFound === 1) {
          score += 35; // Single good match
        } else if (params.productsFound <= 3) {
          score += 40; // Few good matches
        } else {
          score += 30; // Many matches (less precise)
        }
      } else {
        // No products found - significant penalty
        score -= 15;
      }

      // Conversation context (0-25 points) - increased for better context use
      if (params.conversationContext > 0) {
        const contextBonus = Math.min(params.conversationContext * 2.5, 25);
        score += contextBonus;
      }

      // User feedback history (0-20 points)
      if (params.userFeedbackHistory > 0) {
        const feedbackScore = Math.min(params.userFeedbackHistory * 4, 20);
        score += feedbackScore;
      }

      // Query clarity (0-20 points)
      score += Math.max(0, Math.min(params.queryClarity, 20));

      // Bonus for exact reference matches
      if (params.exactMatch && params.productsFound > 0) {
        score += 15;
      }

      // Penalty for vague queries with no products
      if (params.queryClarity < 5 && params.productsFound === 0) {
        score -= 10;
      }

      // Ensure score stays within realistic bounds
      score = Math.max(0, Math.min(score, 100));

      const level = score >= 75 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW';
      
      this.logger.debug(`Confidence calculated: ${score}% (${level})`);
      
      return { score, level };
    } catch (error) {
      this.logger.error('Error in calculateConfidence:', error);
      return { score: 0, level: 'LOW' };
    }
  }

  /**
   * Analyze query clarity with comprehensive checks
   * Enhanced with better patterns and Tunisian support
   */
  analyzeQueryClarity(message: string): number {
    try {
      if (!message || typeof message !== 'string') return 0;
      
      let clarity = 0;
      const lower = message.toLowerCase();
      const normalized = this.normalizeTunisian(lower);

      // ✅ SPECIFIC PART NAMES (15 points) - most important
      const partKeywords = [
        'filtre', 'plaquette', 'disque', 'amortisseur', 'phare', 'batterie',
        'courroie', 'bougie', 'alternateur', 'démarreur', 'capteur',
        'pneu', 'tuyau', 'joint', 'durite', 'radiateur', 'condenseur',
        'pompe', 'injecteur', 'embrayage', 'roulement'
      ];
      if (partKeywords.some(k => lower.includes(k) || normalized.includes(k))) {
        clarity += 15;
      }

      // ✅ POSITION INFO (10 points)
      if (/\b(avant|arriere|arrière|gauche|droite|av|ar|g|d|conducteur|passager)\b/i.test(message)) {
        clarity += 10;
      }

      // ✅ VEHICLE MODEL (8 points)
      if (/\b(celerio|spresso|s-presso|swift|vitara)\b/i.test(message)) {
        clarity += 8;
      }

      // ✅ REFERENCE NUMBER (7 points)
      if (/[a-z0-9]{5,}[-_]?[a-z0-9]{2,}/i.test(message)) {
        clarity += 7;
      }

      // ✅ ACTION VERB (5 points)
      if (/cherche|chercher|besoin|avoir|acheter|achete|shop|buy|trouver|trouve/i.test(message)) {
        clarity += 5;
      }

      // ✅ QUANTITY (3 points)
      if (/\d+\s*(pieces?|pcs?|qty|quantité)|\b(un|une|deux|trois|plusieurs|barcha)\b/i.test(message)) {
        clarity += 3;
      }

      // ❌ REDUCE CLARITY FOR UNCERTAINTY MARKERS
      const uncertaintyReduction = this.detectUncertainty(message);
      clarity -= uncertaintyReduction * 5;

      // ❌ REDUCE CLARITY FOR VAGUENESS
      if (/truc|machin|bidule|chose|quelque chose|pas exactement|genre|vaguement/i.test(lower)) {
        clarity -= 8;
      }

      return Math.max(0, Math.min(clarity, 20)); // Clamp to 0-20
    } catch (error) {
      this.logger.error('Error in analyzeQueryClarity:', error);
      return 0;
    }
  }
  private detectUncertainty(message: string): number {
    const patterns = [/i think|maybe|not sure|possible|puissant-être|pas sûr|je crois|genre|environ/i, /\?$/];
    return patterns.some(p => p.test(message)) ? 1 : 0;
  }

  /**
   * 🇹🇳 NORMALIZE TUNISIAN DIALECT TO FRENCH
   * Enhanced with more comprehensive mappings
   */
  private normalizeTunisian(query: string): string {
    let normalized = query.toLowerCase();
    
    // 🚨 AGGRESSIVE REPLACEMENT - order matters!
    for (const [tunisian, french] of Object.entries(this.tunisianMappings)) {
      if (french) { // Only replace if there's a French equivalent
        const regex = new RegExp(`\\b${tunisian}\\b`, 'gi');
        normalized = normalized.replace(regex, french);
      } else {
        // Remove greetings/filler words
        const regex = new RegExp(`\\b${tunisian}\\b`, 'gi');
        normalized = normalized.replace(regex, '');
      }
    }
    
    // Additional number-based Tunisian patterns
    normalized = normalized.replace(/7/g, 'h'); // 7 → h (خ sound)
    normalized = normalized.replace(/9/g, 'k'); // 9 → k (ق sound)
    normalized = normalized.replace(/3/g, ''); // 3 → glottal stop (remove)
    
    // Clean up extra spaces
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    return normalized;
  }

  /**
   * Learn from user feedback and improve response quality
   * Enhanced with pattern extraction and recommendation system
   */
  async learnFromFeedback(sessionId: string): Promise<{
    successPatterns: string[];
    failurePatterns: string[];
    improvements: string[];
    learningSuccessRate: number;
  }> {
    try {
      const messages = await this.prisma.chatMessage.findMany({
        where: { sessionId },
        include: { feedback: true },
        orderBy: { timestamp: 'asc' }
      });

      const successPatterns: string[] = [];
      const failurePatterns: string[] = [];
      const improvements: string[] = [];
      let successCount = 0;
      let totalRated = 0;

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
              this.suggestImprovement(msg.message, msg.feedback.comment || undefined)
            );
          }
        }
      }

      const learningSuccessRate = totalRated > 0 ? (successCount / totalRated) * 100 : 0;
      
      this.logger.log(`Learning cycle: ${successCount}/${totalRated} successful (${learningSuccessRate.toFixed(1)}%)`);
      
      return { 
        successPatterns: [...new Set(successPatterns)],
        failurePatterns: [...new Set(failurePatterns)],
        improvements: [...new Set(improvements)],
        learningSuccessRate
      };
    } catch (error) {
      this.logger.error('Error in learnFromFeedback:', error);
      return {
        successPatterns: [],
        failurePatterns: [],
        improvements: [],
        learningSuccessRate: 0
      };
    }
  }

  /**
   * Find similar queries from conversation history
   * Enhanced with fuzzy matching and Levenshtein distance
   */
  async findSimilarQueries(query: string, limit = 5): Promise<any[]> {
    try {
      // Get all past prompts from last 500 conversations
      const allPrompts = await this.prisma.chatPrompt.findMany({
        orderBy: { createdAt: 'desc' },
        take: 500
      });

      if (allPrompts.length === 0) {
        this.logger.debug('No past prompts found for similarity matching');
        return [];
      }

      // Calculate comprehensive similarity scores
      const scored = allPrompts.map(prompt => {
        const semanticScore = this.calculateSemanticSimilarity(query, prompt.promptText);
        const fuzzyScore = this.calculateFuzzySimilarity(query, prompt.promptText);
        
        // Combine scores with weighted average
        const combinedScore = (semanticScore * 0.6) + (fuzzyScore * 0.4);
        
        return {
          ...prompt,
          similarity: combinedScore,
          semanticScore,
          fuzzyScore
        };
      });

      // Return top matches above threshold
      const results = scored
        .filter(p => p.similarity > 0.4) // Lowered threshold for better recall
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      this.logger.debug(`Found ${results.length} similar queries (similarity > 0.4)`);
      
      return results;
    } catch (error) {
      this.logger.error('Error in findSimilarQueries:', error);
      return [];
    }
  }

  /**
   * Calculate semantic similarity using multiple techniques
   * Enhanced with better tokenization and TF-IDF weighting
   */
  private calculateSemanticSimilarity(query1: string, query2: string): number {
    try {
      const tokens1 = this.tokenize(query1);
      const tokens2 = this.tokenize(query2);
      
      if (tokens1.length === 0 || tokens2.length === 0) {
        return 0;
      }
      
      const set2 = new Set(tokens2);

      // ✅ JACCARD SIMILARITY (exact token match)
      const intersection = tokens1.filter(t => set2.has(t)).length;
      const union = new Set([...tokens1, ...tokens2]).size;
      const jaccard = union > 0 ? intersection / union : 0;

      // ✅ BIGRAM SIMILARITY (word pair matching)
      const bigrams1 = this.getBigrams(tokens1);
      const bigrams2Set = new Set(this.getBigrams(tokens2));
      const bigramIntersection = bigrams1.filter(b => bigrams2Set.has(b)).length;
      const bigramUnion = new Set([...bigrams1, ...bigrams2Set]).size;
      const bigramSim = bigramUnion > 0 ? bigramIntersection / bigramUnion : 0;

      // ✅ LENGTH SIMILARITY (query length match)
      const lengthRatio = Math.min(tokens1.length, tokens2.length) / 
                         Math.max(tokens1.length, tokens2.length);

      // ✅ TF-IDF COSINE SIMILARITY (weighted word importance)
      const tfidf1 = this.buildTfIdf(tokens1, this.corpusCache);
      const tfidf2 = this.buildTfIdf(tokens2, this.corpusCache);
      const cosSim = this.cosineSimilarity(tfidf1, tfidf2);

      // ✅ COMBINED SCORE with optimized weights
      // Cosine (TF-IDF) is most reliable for semantic matching
      const combinedScore = (jaccard * 0.25) + 
                           (bigramSim * 0.2) + 
                           (lengthRatio * 0.1) + 
                           (cosSim * 0.45);

      return Math.max(0, Math.min(combinedScore, 1));
    } catch (error) {
      this.logger.warn('Error in calculateSemanticSimilarity:', error);
      return 0;
    }
  }

  /**
   * 🎯 FUZZY MATCHING using Levenshtein distance
   * Critical for handling Tunisian dialect typos
   */
  private calculateFuzzySimilarity(query1: string, query2: string): number {
    try {
      const lower1 = query1.toLowerCase();
      const lower2 = query2.toLowerCase();

      // ✅ EXACT MATCH (no calculation needed)
      if (lower1 === lower2) return 1.0;

      // ✅ LEVENSHTEIN DISTANCE (handles typos)
      const maxLen = Math.max(lower1.length, lower2.length);
      if (maxLen === 0) return 0;
      
      const distance = this.levenshteinDistance(lower1, lower2);
      const normalizedDistance = 1 - (distance / maxLen);

      // ✅ PREFIX MATCH BONUS (words starting same way)
      let prefixBonus = 0;
      const tokens1 = this.tokenize(lower1);
      const tokens2 = this.tokenize(lower2);
      
      for (const t1 of tokens1) {
        for (const t2 of tokens2) {
          if (t1.startsWith(t2.substring(0, 3))) {
            prefixBonus += 0.05;
            break;
          }
        }
      }
      prefixBonus = Math.min(prefixBonus, 0.25);

      // ✅ COMBINED FUZZY SCORE
      return Math.min(normalizedDistance + prefixBonus, 1.0);
    } catch (error) {
      this.logger.warn('Error in calculateFuzzySimilarity:', error);
      return 0;
    }
  }

  /**
   * 📏 LEVENSHTEIN DISTANCE - Edit distance between strings
   * Essential for typo correction (e.g., "retrviseur" → "retroviseur")
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    // Initialize first column and row
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix using dynamic programming
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i][j - 1] + 1,      // Deletion
          matrix[i - 1][j] + 1,      // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }


  private buildTfIdf(tokens: string[], corpus: Map<string, number>): Record<string, number> {
    const freq: Record<string, number> = {};
    tokens.forEach(t => {
      freq[t] = (freq[t] || 0) + 1;
      corpus.set(t, (corpus.get(t) || 0) + 1);
    });
    const total = tokens.length;
    const corpusSize = corpus.size || 1;
    const tfidf: Record<string, number> = {};
    Object.keys(freq).forEach(t => {
      const tf = freq[t] / total;
      const idf = Math.log(corpusSize / (corpus.get(t) || 1));
      tfidf[t] = tf * idf;
    });
    return tfidf;
  }


  private cosineSimilarity(a: Record<string, number>, b: Record<string, number>): number {
    const common = Object.keys(a).filter(k => b[k]);
    const dot = common.reduce((sum, k) => sum + (a[k] * b[k]), 0);
    const magA = Math.sqrt(Object.values(a).reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(Object.values(b).reduce((s, v) => s + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  }
  /**
   * AI-POWERED INTENT DETECTION
   * Uses OpenAI to understand greetings, typos, and Tunisian dialect intelligently
   */
  async detectIntentWithAI(message: string, conversationHistory: any[], hasPendingClarification?: boolean): Promise<{
    type: 'SEARCH' | 'PRICE_INQUIRY' | 'STOCK_CHECK' | 'GREETING' | 'COMPLAINT' | 'THANKS' | 'SERVICE_QUESTION' | 'CLARIFICATION_NEEDED';
    confidence: number;
    subIntent?: { location?: string; model?: string; year?: string };
  }> {
    try {
      // For simple cases, use fast pattern matching
      const lower = (message || '').toLowerCase().trim();
      
      // CRITICAL: Check if clarification answer
      if (hasPendingClarification && this.isClarificationAnswerPattern(lower)) {
        return { type: 'SEARCH', confidence: 0.95, subIntent: this.detectSubIntent(message) };
      }
      
      // For complex cases (greetings, typos, Tunisian), use AI
      const needsAI = this.needsAIUnderstanding(lower);
      if (needsAI) {
        return await this.detectIntentUsingOpenAI(message, conversationHistory);
      }
      
      // Fallback to pattern-based detection
      return this.detectIntent(message, hasPendingClarification);
    } catch (error) {
      this.logger.error('Error in detectIntentWithAI:', error);
      return this.detectIntent(message, hasPendingClarification);
    }
  }

  private needsAIUnderstanding(message: string): boolean {
    // Use AI for: greetings, typos, Tunisian dialect, ambiguous queries
    const hasTypo = /\b(amortiseeur|amortisor|plakette|bateri|filtr|frain)\b/i.test(message);
    const hasTunisian = /\b(salem|ahla|n7eb|famma|ch7al|bghit|kifech|ta3)\b/i.test(message);
    const isGreeting = /^(salem|ahla|salam|bonjour|salut|hello|hi)\b/i.test(message.trim());
    const isAmbiguous = message.split(' ').length <= 2 && !/filtre|plaquette|disque|amortisseur|batterie/i.test(message);
    
    return hasTypo || hasTunisian || isGreeting || isAmbiguous;
  }

  private async detectIntentUsingOpenAI(message: string, conversationHistory: any[]): Promise<any> {
    // This would call OpenAI to understand intent
    // For now, use enhanced pattern matching with normalization
    const normalized = this.normalizeTunisian(message.toLowerCase());
    return this.detectIntent(normalized || message, false);
  }

  detectIntent(message: string, hasPendingClarification?: boolean): {
    type: 'SEARCH' | 'PRICE_INQUIRY' | 'STOCK_CHECK' | 'GREETING' | 'COMPLAINT' | 'THANKS' | 'SERVICE_QUESTION' | 'CLARIFICATION_NEEDED';
    confidence: number;
    subIntent?: { location?: string; model?: string; year?: string };
  } {
    try {
      const lower = (message || '').toLowerCase().trim();
      
      // CRITICAL FIX: Check greeting BEFORE normalization
      if (!hasPendingClarification && this.isGreetingWord(lower)) {
        return { type: 'GREETING', confidence: 0.95 };
      }
      
      const normalized = this.normalizeTunisian(lower);
      const combinedText = normalized || lower;

      // CRITICAL: Check if this is a clarification answer (position/side)
      if (hasPendingClarification && this.isClarificationAnswerPattern(lower)) {
        return { 
          type: 'SEARCH', 
          confidence: 0.95,
          subIntent: this.detectSubIntent(message)
        };
      }

      // GREETING - prioritize polite greetings with help requests
      if (/^(bonjour|salut|hello|hi|salam|assalam)/i.test(message) && 
          /aide|help|assistance|trouver.*pièces|j'aurais besoin/i.test(lower)) {
        return { type: 'GREETING', confidence: 0.95 };
      }
      
      // Simple greeting without search intent
      if (/^(bonjour|salut|hello|hi|salam|assalam)\b/i.test(message) && 
          !/filtre|plaquette|disque|frein|amortisseur|batterie|pneu|phare|courroie|bougie|capteur|radiateur|pompe|nchri|acheter|cherche|besoin|n7eb|stock|prix|disponible|famma|choufli/i.test(combinedText)) {
        return { type: 'GREETING', confidence: 0.95 };
      }

      // THANKS
      if (/^merci\b|^thank|barcha merci|merci beaucoup|thank you|merci pour|thanks for|je vous remercie|avec plaisir/i.test(combinedText) ||
        /^merci$/i.test(combinedText.trim())) {
        return { type: 'THANKS', confidence: 0.95 };
      }

      // COMPLAINT - CRITICAL: Redirect to CarPro, don't search products
      if (/pas content|pas satisfait|insatisfait|défectueux|defectueux|mauvais service|service.*pas|pas.*service|nul|terrible|horrible|bâclé|ne fonctionne pas|cassé|pièce cassée|pièce défectueuse|arnaque|deçu|marbou9/i.test(combinedText)) {
        return { type: 'COMPLAINT', confidence: 0.95 };
      }
      
      // SERVICE QUESTIONS - hours, delivery, warranty, location
      if (/ouvrez|ouvert|heure|horaire|quand|livraison|délai|garantie|situé|adresse|où|localisation/i.test(combinedText)) {
        return { type: 'SERVICE_QUESTION', confidence: 0.90 };
      }

      // DIAGNOSTIC REMOVED - redirect to professional service for car problems
      if (/bruit|fuite|probleme|problème|panne|ne marche pas|defectueux|casse|cassé|voyant|vibration|surchauffe|80000.*km|entretien|maintenance|bizarre|t9allek|ralenti|saccade|perte.*puissance/i.test(combinedText)) {
        // Treat as search query for parts instead of diagnostic
        return { type: 'SEARCH', confidence: 0.75, subIntent: this.detectSubIntent(message) };
      }

      // PRICE
      if (/prix|combien|cout|coute|coûte|price|cost|how much|show me price|ch7al|pris|tarif|taklfa/i.test(combinedText)) {
        return { type: 'PRICE_INQUIRY', confidence: 0.82, subIntent: this.detectSubIntent(message) };
      }

      // STOCK
      if (/stock|disponible|dispo|available|famma|do you have|have you got|avez vous|en stock|mawjoud|ken famma/i.test(combinedText)) {
        return { type: 'STOCK_CHECK', confidence: 0.82, subIntent: this.detectSubIntent(message) };
      }

      // Clarification needed (vague queries)
      if (this.isVagueProblem(combinedText)) {
        return { type: 'CLARIFICATION_NEEDED', confidence: 0.75, subIntent: this.detectSubIntent(message) };
      }

      // CRITICAL: Detect specific part queries (like "amortisseur avant")
      const hasSpecificPart = /filtre|plaquette|disque|amortisseur|phare|batterie|courroie|bougie|alternateur|démarreur|capteur|pneu|joint|durite|radiateur|pompe|injecteur|embrayage|roulement/i.test(combinedText);
      const hasPosition = /avant|arrière|arriere|gauche|droite|av|ar|g|d/i.test(combinedText);
      
      // If specific part + position mentioned, high confidence search
      if (hasSpecificPart && hasPosition) {
        return { type: 'SEARCH', confidence: 0.92, subIntent: this.detectSubIntent(message) };
      }
      
      // If specific part mentioned (even without position), search
      if (hasSpecificPart) {
        return { type: 'SEARCH', confidence: 0.85, subIntent: this.detectSubIntent(message) };
      }
      
      // Default SEARCH (includes greetings with specific part requests)
      return { type: 'SEARCH', confidence: 0.72, subIntent: this.detectSubIntent(message) };
    } catch (error) {
      this.logger.error('Error in detectIntent:', error);
      return { type: 'SEARCH', confidence: 0.5 };
    }
  }

  private isGreetingWord(word: string): boolean {
    const greetings = ['ahla', 'salam', 'salem', 'bonjour', 'salut', 'hello', 'hi', 'hey', 'assalam'];
    return greetings.includes(word.toLowerCase().trim());
  }

  private isClarificationAnswerPattern(text: string): boolean {
    const patterns = [
      /^(avant|arriere|arrière|gauche|droite|av|ar|g|d|gosh|droit)$/i,
      /^(avant|arriere|arrière|av|ar)\s+(gauche|droite|g|d|gosh|droit)$/i,
      /^(gauche|droite|g|d|gosh|droit)\s+(avant|arriere|arrière|av|ar)$/i
    ];
    
    return patterns.some(pattern => pattern.test(text.trim()));
  }

  private detectSubIntent(message: string) {
    const lower = message.toLowerCase();
    return {
      location: lower.match(/avant|arriere|droite|gauche|av|ar|g|d/)?.[0] || undefined,
      model: lower.match(/swift|vitara|ciaz|alto|ertiga|dzire|celerio|spresso/i)?.[0] || undefined,
      year: lower.match(/\b(19|20)\d{2}\b/)?.[0] || undefined
    };
  }

  /**
   * Check if text is a vague problem needing clarification
   */
  private isVagueProblem(text: string): boolean {
    if (!text) return false;
    const vaguePatterns = [
      /\bprobleme\b.*(?!moteur|freinage|suspension|electrique|batterie|alternateur|demarreur|bruit|fuite|voyant)/i,
      /ca\s+sert\s+a\s+quoi/i,
      /c'est\s+quoi/i,
      /pourquoi/i,
      /truc|machin|bidule|chose/i
    ];
    return vaguePatterns.some(p => p.test(text));
  }

  async trackContext(sessionId: string): Promise<{
    topicFlow: string[];
    userPreferences: Record<string, any>;
    conversationStage: 'INITIAL' | 'ENGAGED' | 'CLOSING';
    lastSpecificQuery?: string;
    lastSpecificTopic?: string;
    lastVehicle?: any;
  }> {
    const cached = this.contextCache.get(sessionId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    });

    const topicFlow = messages
      .filter(m => m.sender === 'user')
      .map(m => this.extractTopic(m.message));

    const conversationStage: 'INITIAL' | 'ENGAGED' | 'CLOSING' = 
      messages.length <= 2 ? 'INITIAL' :
      messages.length >= 10 ? 'CLOSING' : 'ENGAGED';

    const userPreferences = this.extractPreferences(messages);

    // Add last specific topic
    let lastSpecificTopic: string | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.sender === 'user') {
        const topic = this.extractTopic(msg.message);
        if (topic !== 'général') {
          lastSpecificTopic = topic;
          break;
        }
      }
    }

    const result = { 
      topicFlow, 
      userPreferences, 
      conversationStage,
      lastSpecificTopic
    };
    this.contextCache.set(sessionId, { data: result, timestamp: Date.now() });

    return result;
  }


  generateSmartSuggestions(query: string, foundParts: any[]): string[] {
    return [];
  }

  /**
   * Record response time in milliseconds for performance metrics
   */
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
    const feedbacks = await this.prisma.chatFeedback.findMany({
      include: { message: true }
    });
    const totalMessages = await this.prisma.chatMessage.count();
    const learningRate = Math.min((totalMessages / 1000) * 100, 100); // Max 100%

    // Safely compute avg rating and success rate
    const ratedCount = feedbacks.length || 0;
    const sumRatings = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
    const avgRating = ratedCount > 0 ? sumRatings / ratedCount : 0;
    const successRate = ratedCount > 0 ? (feedbacks.filter(f => (f.rating || 0) >= 4).length / ratedCount) * 100 : 0;

    // Average response time from tracker
    const tracked = this.responseTimeTracker || [];
    const avgResponseTime = tracked.length > 0 ? Math.round(tracked.reduce((s, v) => s + v, 0) / tracked.length) : 0;

    return {
      avgResponseTime,
      avgConfidence: Math.round(avgRating * 20), // Convert 1-5 to 0-100 and round
      successRate,
      learningRate,
      totalInteractions: totalMessages
    };
  }
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-z0-9àâçéèêëîïôûùüÿñæœ]+/)
      .filter(t => t.length > 2);
  }

  private getBigrams(tokens: string[]): string[] {
    const bigrams: string[] = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
    }
    return bigrams;
  }

  private extractPattern(message: string): string {
    // Extract key pattern from message
    const tokens = this.tokenize(message);
    return tokens.slice(0, 3).join(' ');
  }

  private suggestImprovement(message: string, comment?: string): string {
    if (comment?.includes('pas trouvé')) {
      return 'Améliorer la recherche de synonymes';
    }
    if (comment?.includes('prix')) {
      return 'Afficher les prix plus clairement';
    }
    return 'Améliorer la clarté de la réponse';
  }

  extractTopic(message: string): string {
    const topics = {
      'plaquettes frein': ['plaquette', 'plakete', 'brake pad', 'plaquettes de frein', 'plaquettes frein'],
      'frein': ['frein', 'disque', 'etrier', 'tambour', 'brake', 'frain', 'freinage'],
      'filtre': ['filtre', 'filter', 'air', 'huile', 'carburant', 'habitacle', 'filtere'],
      'suspension': ['suspension', 'amortisseur', 'ressort', 'triangle', 'rotule'],
      'moteur': ['moteur', 'engine', 'bougie', 'courroie', 'pompe'],
      'électrique': ['batterie', 'alternateur', 'demarreur', 'capteur', 'faisceau'],
      'optique': ['phare', 'feu', 'ampoule', 'optique', 'eclairage']
    };
    
    const lower = message.toLowerCase();
    const normalized = this.normalizeTunisian(lower) || lower;
    
    // CRITICAL: Check for specific brake pad mentions first (including normalized)
    if (lower.includes('plaquette') || lower.includes('plakete') || normalized.includes('plaquette')) {
      return 'plaquettes frein';
    }
    
    // CRITICAL: Check for brake-related terms (including normalized)
    if (lower.includes('frein') || lower.includes('frain') || normalized.includes('frein')) {
      // If it's specifically about brake pads, return the more specific topic
      if (lower.includes('plaquette') || lower.includes('plakete') || normalized.includes('plaquette')) {
        return 'plaquettes frein';
      }
      return 'frein';
    }
    
    // Then check other topics (check both original and normalized)
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lower.includes(keyword) || normalized.includes(keyword))) {
        return topic;
      }
    }
    
    return 'général';
  }

  private extractPreferences(messages: any[]): Record<string, any> {
    const prefs: Record<string, any> = {
      language: 'fr',
      responseStyle: 'professional',
      emotion: 'NEUTRAL'
    };
    const userMessages = messages.filter(m => m.sender === 'user').map(m => m.message).join(' ');
    if (/\b(ken|famma|chouf|behi|wah|n7eb|mte3i|ahla|ya khoya|barcha|choufli)\b/i.test(userMessages)) {
      prefs.language = 'darija';
    } else if (/\b(do you|I need|show me|how much|brake|price|availability)\b/i.test(userMessages)) {
      prefs.language = 'en';
    }
    prefs.emotion = this.detectEmotion(userMessages);

    return prefs;
  }
  private detectEmotion(message: string): string {
    const lower = message.toLowerCase();
    let score = 0;
    const positive = ['merci', 'super', 'excellent', 'behi', 'bravo', 'parfait', 'génial', 'top', 'bien'];
    const negative = ['fache', 'marbou9', 'angry', 'wtf', 'nul', 'mauvais', 'terrible', 'pas content'];
    positive.forEach(w => { if (lower.includes(w)) score += 1; });
    negative.forEach(w => { if (lower.includes(w)) score -= 1; });
    if (score > 0) return 'POSITIVE';
    if (score < 0) return 'NEGATIVE';
    return 'NEUTRAL';
  }
}
