import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { extractReferenceCandidate } from './advanced-search.service';
import {
  extractRequestedPositions,
  hasAnyPosition,
  isPositionToken,
  tokenizeName,
} from './part-constraints';

// Intent is decided by AIQueryNormalizerService. This service keeps only the
// conservative fallback, confidence/clarity scores, feedback learning, and metrics.

export type FallbackIntentType =
  | 'SEARCH'
  | 'PRICE_INQUIRY'
  | 'STOCK_CHECK'
  | 'GREETING'
  | 'COMPLAINT'
  | 'THANKS'
  | 'SERVICE_QUESTION'
  | 'CLARIFICATION_NEEDED';

export interface FallbackIntent {
  type: FallbackIntentType;
  confidence: number;
  subIntent?: { location?: string; model?: string; year?: string };
}

const MAX_TRACKED_RESPONSES = 100;
const UNSURE_INTENT_CONFIDENCE = 0.5;
const CLARIFICATION_ANSWER_CONFIDENCE = 0.95;
const MAX_CLARITY = 20;

const UNCERTAINTY_PATTERN = /\b(i think|maybe|not sure|peut[- ]etre|pas sur|je crois|genre|environ)\b|\?\s*$/i;
const VAGUE_PATTERN = /\b(truc|machin|bidule|chose|quelque chose|pas exactement|vaguement)\b/i;
const QUANTITY_PATTERN = /\d+\s*(pieces?|pcs?|qty|quantite)\b|\b(un|une|deux|trois|plusieurs|barcha)\b/i;
const REQUEST_VERB_PATTERN = /\b(cherche|chercher|besoin|acheter|achete|trouver|trouve|veux|voudrais)\b/i;

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);
  private responseTimeTracker: number[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly synonymsService: SynonymsService,
    private readonly vehicleModels: VehicleModelsService,
  ) {}

  async detectIntentWithAI(
    message: string,
    _conversationHistory: unknown[] = [],
    hasPendingClarification = false,
  ): Promise<FallbackIntent> {
    const tokens = tokenizeName(message ?? '');
    const isBarePositionAnswer =
      tokens.length > 0 && tokens.every(isPositionToken) && hasAnyPosition(extractRequestedPositions(message));

    if (hasPendingClarification && isBarePositionAnswer) {
      return {
        type: 'SEARCH',
        confidence: CLARIFICATION_ANSWER_CONFIDENCE,
        subIntent: this.detectSubIntent(message),
      };
    }
    return { type: 'SEARCH', confidence: UNSURE_INTENT_CONFIDENCE, subIntent: this.detectSubIntent(message) };
  }

  private detectSubIntent(message: string): FallbackIntent['subIntent'] {
    const positions = extractRequestedPositions(message ?? '');
    const location = [...positions.axes, ...positions.sides, ...positions.levels].join(' ');
    return {
      location: location || undefined,
      model: this.vehicleModels.detectModelInText(message ?? '') ?? undefined,
      year: (message ?? '').match(/\b(?:19|20)\d{2}\b/)?.[0],
    };
  }

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
        if (params.exactMatch) score += 50;
        else if (params.productsFound === 1) score += 35;
        else if (params.productsFound <= 3) score += 40;
        else score += 30;
      } else {
        score -= 15;
      }

      if (params.conversationContext > 0) score += Math.min(params.conversationContext * 2.5, 25);
      if (params.userFeedbackHistory > 0) score += Math.min(params.userFeedbackHistory * 4, 20);
      score += Math.max(0, Math.min(params.queryClarity, MAX_CLARITY));
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

  /** 0..20. Every signal comes from the live data: synonyms, positions, models, and references. */
  analyzeQueryClarity(message: string): number {
    try {
      if (!message || typeof message !== 'string') return 0;

      let clarity = 0;
      if (this.synonymsService.isKnownAutomotiveTerm(message)) clarity += 15;
      if (hasAnyPosition(extractRequestedPositions(message))) clarity += 10;
      if (this.vehicleModels.detectModelInText(message)) clarity += 8;
      if (extractReferenceCandidate(message)) clarity += 7;
      if (REQUEST_VERB_PATTERN.test(message)) clarity += 5;
      if (QUANTITY_PATTERN.test(message)) clarity += 3;

      if (UNCERTAINTY_PATTERN.test(message)) clarity -= 5;
      if (VAGUE_PATTERN.test(message)) clarity -= 8;

      return Math.max(0, Math.min(clarity, MAX_CLARITY));
    } catch (error) {
      this.logger.error('Error in analyzeQueryClarity:', error);
      return 0;
    }
  }

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
        orderBy: { timestamp: 'asc' },
      });

      const successPatterns: string[] = [];
      const failurePatterns: string[] = [];
      const improvements: string[] = [];
      let successCount = 0;
      let totalRated = 0;

      for (const msg of messages) {
        if (!msg.feedback || msg.feedback.rating === null) continue;
        totalRated++;
        const pattern = this.extractPattern(msg.message);
        if (msg.feedback.rating >= 4) {
          successPatterns.push(pattern);
          successCount++;
        } else if (msg.feedback.rating <= 2) {
          failurePatterns.push(pattern);
          improvements.push(this.suggestImprovement(msg.feedback.comment || undefined));
        }
      }

      const learningSuccessRate = totalRated > 0 ? (successCount / totalRated) * 100 : 0;
      this.logger.log(`Learning cycle: ${successCount}/${totalRated} successful (${learningSuccessRate.toFixed(1)}%)`);
      return {
        successPatterns: [...new Set(successPatterns)],
        failurePatterns: [...new Set(failurePatterns)],
        improvements: [...new Set(improvements)],
        learningSuccessRate,
      };
    } catch (error) {
      this.logger.error('Error in learnFromFeedback:', error);
      return { successPatterns: [], failurePatterns: [], improvements: [], learningSuccessRate: 0 };
    }
  }

  recordResponseTime(ms: number): void {
    if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return;
    this.responseTimeTracker.push(ms);
    if (this.responseTimeTracker.length > MAX_TRACKED_RESPONSES) this.responseTimeTracker.shift();
  }

  async getPerformanceMetrics(): Promise<{
    avgResponseTime: number;
    avgConfidence: number;
    successRate: number;
    learningRate: number;
    totalInteractions: number;
  }> {
    const [totalMessages, ratings, positive] = await Promise.all([
      this.prisma.chatMessage.count(),
      this.prisma.chatFeedback.aggregate({ _avg: { rating: true }, _count: { rating: true } }),
      this.prisma.chatFeedback.count({ where: { rating: { gte: 4 } } }),
    ]);

    const ratedCount = ratings._count.rating ?? 0;
    const avgRating = ratings._avg.rating ?? 0;
    const tracked = this.responseTimeTracker;

    return {
      avgResponseTime: tracked.length > 0 ? Math.round(tracked.reduce((sum, value) => sum + value, 0) / tracked.length) : 0,
      avgConfidence: Math.round(avgRating * 20),
      successRate: ratedCount > 0 ? (positive / ratedCount) * 100 : 0,
      learningRate: Math.min((totalMessages / 1000) * 100, 100),
      totalInteractions: totalMessages,
    };
  }

  private extractPattern(message: string): string {
    return tokenizeName(message).filter((token) => token.length > 2).slice(0, 3).join(' ');
  }

  private suggestImprovement(comment?: string): string {
    const text = (comment ?? '').toLowerCase();
    if (text.includes('pas trouvé') || text.includes('pas trouve')) return 'Améliorer la recherche de synonymes';
    if (text.includes('prix')) return 'Afficher les prix plus clairement';
    return 'Améliorer la clarté de la réponse';
  }
}