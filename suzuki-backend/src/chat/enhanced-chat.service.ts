import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatOrchestratorService } from '../services/chat-orchestrator.service';
import { ResponseService } from '../services/response.service';
import { IntelligenceService } from './intelligence.service';

export interface ProcessMessageResponse {
  response: string;
  sessionId: string;
  products: any[];
  confidence: string;
  confidenceScore?: number;
  suggestions?: string[];
  intent: string;
  metadata: {
    productsFound: number;
    conversationLength: number;
    queryClarity: number;
    duration?: number;
    userMessageId?: string;
    error?: string;
  };
}

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

@Injectable()
export class EnhancedChatService {
  private readonly logger = new Logger(EnhancedChatService.name);
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private readonly RATE_LIMIT = 50;
  private readonly RATE_WINDOW = 60000;

  constructor(
    private orchestrator: ChatOrchestratorService,
    private responseService: ResponseService,
    private prisma: PrismaService,
    private intelligence: IntelligenceService
  ) {}

  async processMessage(
    message: string,
    vehicle?: any,
    sessionId?: string,
    clientIp?: string
  ): Promise<ProcessMessageResponse> {
    try {
      if (clientIp && !this.checkRateLimit(clientIp)) {
        return {
          response: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
          sessionId: sessionId || 'rate-limited',
          products: [],
          confidence: 'LOW',
          intent: 'RATE_LIMITED',
          metadata: { productsFound: 0, conversationLength: 0, queryClarity: 0, error: 'Rate limit exceeded' }
        };
      }

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw new Error('Body must include a non-empty `message` string');
      }
      if (message.length > 10000) {
        throw new Error('Message exceeds maximum length');
      }

      return await this.orchestrator.processMessage(message, vehicle, sessionId);
    } catch (error) {
      this.logger.error('processMessage failed:', error);
      const response = this.responseService.buildErrorResponse(message);
      return {
        response,
        sessionId: sessionId || 'error',
        products: [],
        confidence: 'LOW',
        intent: 'ERROR',
        metadata: { error: error.message, productsFound: 0, conversationLength: 0, queryClarity: 0 }
      };
    }
  }

  async saveFeedback(messageId: string, rating: number, comment?: string): Promise<any> {
    try {
      const feedback = await this.prisma.chatFeedback.create({
        data: { messageId, rating, comment }
      });
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: { session: true }
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
    try {
      const timeRange = this.parseTimeRange(options.timeRange || '7d');
      const [totalSessions, totalMessages, avgRating, performance] = await Promise.all([
        this.prisma.chatSession.count({ where: { startedAt: { gte: timeRange.start } } as any }),
        this.prisma.chatMessage.count({ where: { timestamp: { gte: timeRange.start } } }),
        this.prisma.chatFeedback.aggregate({ _avg: { rating: true }, where: { createdAt: { gte: timeRange.start } } }),
        this.intelligence.getPerformanceMetrics()
      ]);

      return {
        summary: {
          totalSessions,
          totalMessages,
          avgRating: avgRating?._avg?.rating || 0,
          successRate: performance.successRate || 0,
          errorRate: 100 - (performance.successRate || 0)
        },
        insights: {
          topQueries: [],
          mostCommonIntent: null,
          confidenceDistribution: {},
          learningRate: performance.learningRate || 0,
          aiMaturity: this.calculateAIMaturity(totalMessages, performance.successRate || 0)
        },
        quality: {
          averageResponseTime: performance.avgResponseTime || 0,
          userSatisfaction: avgRating?._avg?.rating || 0,
          productsFoundRate: 0
        },
        errors: { failedSessions: 0, commonErrors: [] },
        timestamp: new Date(),
        timeRange: options.timeRange || '7d'
      };
    } catch (error) {
      this.logger.error('Analytics fetch failed:', error);
      return this.getDefaultAnalytics();
    }
  }

  async analyzeAndLearnFromConversations(): Promise<void> {
    this.logger.log('🧠 Learning cycle triggered - analyzing conversations...');
    
    try {
      // Get recent sessions with feedback
      const recentSessions = await this.prisma.chatSession.findMany({
        where: {
          messages: {
            some: {
              feedback: { isNot: null }
            }
          }
        },
        include: {
          messages: {
            include: { feedback: true },
            orderBy: { timestamp: 'asc' }
          }
        },
        take: 50,
        orderBy: { startedAt: 'desc' }
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

  private checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const data = this.rateLimitMap.get(ip);
    if (!data || now > data.resetTime) {
      this.rateLimitMap.set(ip, { count: 1, resetTime: now + this.RATE_WINDOW });
      return true;
    }
    if (data.count >= this.RATE_LIMIT) {
      this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return false;
    }
    data.count++;
    return true;
  }

  private parseTimeRange(range: string): { start: Date; end: Date } {
    const now = new Date();
    const end = now;
    let start = new Date(now);
    const matches = range.match(/(\d+)([dhm])/);
    if (matches) {
      const [, value, unit] = matches;
      const numValue = parseInt(value);
      switch (unit) {
        case 'd': start.setDate(start.getDate() - numValue); break;
        case 'h': start.setHours(start.getHours() - numValue); break;
        case 'm': start.setMinutes(start.getMinutes() - numValue); break;
      }
    }
    return { start, end };
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
      insights: { topQueries: [], mostCommonIntent: null, confidenceDistribution: {}, learningRate: 0, aiMaturity: '🥉 LEARNING' },
      quality: { averageResponseTime: 0, userSatisfaction: 0, productsFoundRate: 0 },
      errors: { failedSessions: 0, commonErrors: [] },
      timestamp: new Date(),
      timeRange: 'unknown'
    };
  }
}
