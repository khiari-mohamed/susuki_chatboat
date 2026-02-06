import { Injectable, Logger } from '@nestjs/common';
import { ChatOrchestratorService, ProcessMessageResponse } from '../services/chat-orchestrator.service';
import { ResponseService } from '../services/response.service';

@Injectable()
export class EnhancedChatServiceWrapper {
  private readonly logger = new Logger('EnhancedChatService');
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private readonly RATE_LIMIT = 50;
  private readonly RATE_WINDOW = 60000;

  constructor(
    private orchestrator: ChatOrchestratorService,
    private responseService: ResponseService
  ) {}

  async processMessage(
    message: string,
    vehicle?: any,
    sessionId?: string,
    clientIp?: string
  ): Promise<ProcessMessageResponse> {
    try {
      // Rate limiting
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

      // Input validation
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw new Error('Body must include a non-empty `message` string');
      }
      if (message.length > 10000) {
        throw new Error('Message exceeds maximum length');
      }

      // Route to orchestrator
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
}
