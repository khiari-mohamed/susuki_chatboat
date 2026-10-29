import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ChatOrchestratorService } from '../services/chat-orchestrator.service';
import type { ProcessMessageResponse } from '../services/chat-orchestrator.service';
import { ResponseService } from '../services/response.service';
import { IntelligenceService } from './intelligence.service';
import { SearchLogService } from '../services/search-log.service';

// Single response type: the orchestrator's. Re-exported for existing importers.
export type { ProcessMessageResponse };

export interface AnalyticsResponse {
  summary: {
    totalSessions: number;
    totalMessages: number;
    avgRating: number;
    successRate: number;
    errorRate: number;
  };
  insights: {
    topQueries: any[];
    mostCommonIntent: any;
    confidenceDistribution: any;
    learningRate: number;
    aiMaturity: string;
  };
  quality: {
    averageResponseTime: number;
    userSatisfaction: number;
    productsFoundRate: number;
  };
  errors: {
    failedSessions: number;
    commonErrors: any[];
  };
  timestamp: Date;
  timeRange: string;
}

const MAX_MESSAGE_LENGTH = 10_000;
const RATE_WINDOW_MS = 60_000;
/** Kept at the previous value; set CHAT_RATE_LIMIT in production. */
const DEFAULT_RATE_LIMIT = 10_000;
const RATE_MAP_PRUNE_THRESHOLD = 5_000;
const DEFAULT_TIME_RANGE = '7d';
const ANALYTICS_CACHE_TTL_MS = 60_000;
const ANALYTICS_CACHE_MAX_KEYS = 20;

@Injectable()
export class EnhancedChatService {
  private readonly logger = new Logger(EnhancedChatService.name);
  private readonly rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private readonly analyticsCache = new Map<string, { value: AnalyticsResponse; expiresAt: number }>();
  private readonly rateLimit: number;

  constructor(
    private readonly orchestrator: ChatOrchestratorService,
    private readonly responseService: ResponseService,
    private readonly prisma: PrismaService,
    private readonly intelligence: IntelligenceService,
    private readonly searchLog: SearchLogService,
    config: ConfigService,
  ) {
    const configured = Number(config.get('CHAT_RATE_LIMIT'));
    this.rateLimit = Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_RATE_LIMIT;
    if (this.rateLimit > 200 && config.get('NODE_ENV') === 'production') {
      this.logger.warn(`Chat rate limit is ${this.rateLimit} requests/min per IP: set CHAT_RATE_LIMIT for production`);
    }
  }

  async processMessage(
    message: string,
    vehicle?: any,
    sessionId?: string,
    clientIp?: string,
  ): Promise<ProcessMessageResponse> {
    if (clientIp && !this.checkRateLimit(clientIp)) {
      return {
        response: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
        sessionId: sessionId || 'rate-limited',
        products: [],
        confidence: 'LOW',
        intent: 'RATE_LIMITED',
        metadata: { productsFound: 0, conversationLength: 0, queryClarity: 0, error: 'Rate limit exceeded' },
      };
    }

    // Caller mistakes are HTTP 400s, not "technical difficulty" answers.
    if (typeof message !== 'string' || message.trim().length === 0) {
      throw new BadRequestException('Body must include a non-empty `message` string');
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new BadRequestException('Message exceeds maximum length');
    }

    try {
      const result = await this.orchestrator.processMessage(message, vehicle, sessionId);
      // Fire-and-forget: recordAnswer never throws and never delays the reply.
      void this.searchLog.recordAnswer(message, vehicle, result);
      return result;
    } catch (error: any) {
      this.logger.error('processMessage failed:', error);
      void this.searchLog.recordFailure(message, vehicle, sessionId);
      return {
        response: this.responseService.buildErrorResponse(error?.message),
        sessionId: sessionId || 'error',
        products: [],
        confidence: 'LOW',
        intent: 'ERROR',
        metadata: {
          error: error?.message,
          productsFound: 0,
          conversationLength: 0,
          queryClarity: 0,
        },
      };
    }
  }

  async saveFeedback(messageId: string, rating: number, comment?: string): Promise<any> {
    try {
      const feedback = await this.prisma.chatFeedback.create({
        data: { messageId, rating, comment },
      });
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: { session: true },
      });
      if (message) {
        await this.intelligence.learnFromFeedback(message.sessionId);
      }
      return feedback;
    } catch (error) {
      this.logger.error('Failed to save feedback:', error);
      throw error;
    }
  }

  async getAnalytics(options: { cached?: boolean; timeRange?: string } = {}): Promise<AnalyticsResponse> {
    const timeRange = options.timeRange || DEFAULT_TIME_RANGE;

    if (options.cached) {
      const hit = this.analyticsCache.get(timeRange);
      if (hit && hit.expiresAt > Date.now()) return hit.value;
    }

    try {
      const start = this.parseTimeRangeStart(timeRange);
      const [totalSessions, totalMessages, avgRating, performance] = await Promise.all([
        this.prisma.chatSession.count({ where: { startedAt: { gte: start } } }),
        this.prisma.chatMessage.count({ where: { timestamp: { gte: start } } }),
        this.prisma.chatFeedback.aggregate({
          _avg: { rating: true },
          where: { createdAt: { gte: start } },
        }),
        this.intelligence.getPerformanceMetrics(),
      ]);

      const rating = avgRating?._avg?.rating ?? 0;
      const analytics: AnalyticsResponse = {
        summary: {
          totalSessions,
          totalMessages,
          avgRating: rating,
          successRate: performance.successRate || 0,
          errorRate: 100 - (performance.successRate || 0),
        },
        insights: {
          topQueries: [],
          mostCommonIntent: null,
          confidenceDistribution: {},
          learningRate: performance.learningRate || 0,
          aiMaturity: this.calculateAIMaturity(totalMessages, performance.successRate || 0),
        },
        quality: {
          averageResponseTime: performance.avgResponseTime || 0,
          userSatisfaction: rating,
          productsFoundRate: 0,
        },
        errors: { failedSessions: 0, commonErrors: [] },
        timestamp: new Date(),
        timeRange,
      };
      this.cacheAnalytics(timeRange, analytics);
      return analytics;
    } catch (error) {
      this.logger.error('Analytics fetch failed:', error);
      return this.getDefaultAnalytics();
    }
  }

  async analyzeAndLearnFromConversations(): Promise<void> {
    this.logger.log('🧠 Learning cycle triggered - analyzing conversations...');
    try {
      const recentSessions = await this.prisma.chatSession.findMany({
        where: { messages: { some: { feedback: { isNot: null } } } },
        include: {
          messages: {
            include: { feedback: true },
            orderBy: { timestamp: 'asc' },
          },
        },
        take: 50,
        orderBy: { startedAt: 'desc' },
      });

      this.logger.log(`📊 Analyzing ${recentSessions.length} sessions with feedback`);
      for (const session of recentSessions) {
        await this.intelligence.learnFromFeedback(session.id);
      }
      this.logger.log('✅ Learning cycle completed successfully');
    } catch (error) {
      this.logger.error('❌ Learning cycle failed:', error);
    }
  }

  async triggerLearningFromSession(sessionId: string): Promise<void> {
    this.logger.log(`🎯 Learning triggered for session ${sessionId}`);
    try {
      await this.intelligence.learnFromFeedback(sessionId);
      this.logger.log(`✅ Session ${sessionId} learning completed`);
    } catch (error) {
      this.logger.error(`❌ Session ${sessionId} learning failed:`, error);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────

  private checkRateLimit(ip: string): boolean {
    const now = Date.now();
    if (this.rateLimitMap.size > RATE_MAP_PRUNE_THRESHOLD) this.pruneRateLimits(now);

    const data = this.rateLimitMap.get(ip);
    if (!data || now > data.resetTime) {
      this.rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
      return true;
    }
    if (data.count >= this.rateLimit) {
      this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return false;
    }
    data.count++;
    return true;
  }

  private pruneRateLimits(now: number): void {
    for (const [ip, data] of this.rateLimitMap) {
      if (now > data.resetTime) this.rateLimitMap.delete(ip);
    }
  }

  private cacheAnalytics(key: string, value: AnalyticsResponse): void {
    if (this.analyticsCache.size >= ANALYTICS_CACHE_MAX_KEYS && !this.analyticsCache.has(key)) {
      const oldest = this.analyticsCache.keys().next().value;
      if (oldest !== undefined) this.analyticsCache.delete(oldest);
    }
    this.analyticsCache.set(key, { value, expiresAt: Date.now() + ANALYTICS_CACHE_TTL_MS });
  }

  /** "7d" | "24h" | "30m". Anything else falls back to the default range instead of an empty one. */
  private parseTimeRangeStart(range: string): Date {
    const match = /^(\d+)([dhm])$/.exec(range.trim());
    const value = match ? parseInt(match[1], 10) : 7;
    const unit = match ? match[2] : 'd';
    const start = new Date();
    switch (unit) {
      case 'h': start.setHours(start.getHours() - value); break;
      case 'm': start.setMinutes(start.getMinutes() - value); break;
      default: start.setDate(start.getDate() - value);
    }
    return start;
  }

  private calculateAIMaturity(totalMessages: number, successRate: number): string {
    const score = totalMessages / 10 + successRate;
    if (score >= 150) return '🏆 EXPERT';
    if (score >= 100) return '🥇 ADVANCED';
    if (score >= 50) return '🥈 INTERMEDIATE';
    return '🥉 LEARNING';
  }

  private getDefaultAnalytics(): AnalyticsResponse {
    return {
      summary: { totalSessions: 0, totalMessages: 0, avgRating: 0, successRate: 0, errorRate: 0 },
      insights: {
        topQueries: [], mostCommonIntent: null, confidenceDistribution: {},
        learningRate: 0, aiMaturity: '🥉 LEARNING',
      },
      quality: { averageResponseTime: 0, userSatisfaction: 0, productsFoundRate: 0 },
      errors: { failedSessions: 0, commonErrors: [] },
      timestamp: new Date(),
      timeRange: 'unknown',
    };
  }
}