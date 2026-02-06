import { Controller, Post, Body, Get, Query, BadRequestException, HttpException, HttpStatus, Logger, Req } from '@nestjs/common';
import { EnhancedChatService, ProcessMessageResponse, AnalyticsResponse } from './enhanced-chat.service';
import { SearchValidatorService } from '../services/search-validator.service';
import type { Request } from 'express';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly chatService: EnhancedChatService,
    private readonly validator: SearchValidatorService
  ) {}

  @Post('message')
  async chat(
    @Body() body: { message: string; vehicle?: any; sessionId?: string },
    @Req() req: Request
  ): Promise<ProcessMessageResponse> {
    // Validate message format exactly as expected by tests
    if (!body || typeof body.message !== 'string' || body.message.trim().length === 0) {
      throw new HttpException(
        {
          message: 'Body must include a non-empty `message` string',
          error: 'Bad Request',
          statusCode: 400
        },
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      // Extract client IP for rate limiting
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      
      const result = await this.chatService.processMessage(
        body.message, 
        body.vehicle, 
        body.sessionId,
        clientIp
      );
      return result;
    } catch (err: any) {
      // Handle specific validation errors
      if (err.message?.includes('Body must include')) {
        throw new HttpException(
          {
            message: err.message,
            error: 'Bad Request',
            statusCode: 400
          },
          HttpStatus.BAD_REQUEST
        );
      }
      
      const message = err?.message || 'Internal server error while processing message';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('analytics')
  async getAnalytics(@Query('cached') cached?: string, @Query('timeRange') timeRange?: string): Promise<AnalyticsResponse> {
    const opts: { cached?: boolean; timeRange?: string } = {};
    if (typeof cached !== 'undefined') {
      opts.cached = String(cached).toLowerCase() === 'true';
    }
    if (timeRange) opts.timeRange = timeRange;

    try {
      return await this.chatService.getAnalytics(opts);
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch analytics';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('feedback')
  async feedback(@Body() body: { messageId: string; rating: number; comment?: string }): Promise<any> {
    if (!body || typeof body.messageId !== 'string' || !body.messageId.trim()) {
      throw new BadRequestException('Body must include a non-empty `messageId` string');
    }
    if (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5) {
      throw new BadRequestException('Body must include `rating` as a number between 0 and 5');
    }

    try {
      return await this.chatService.saveFeedback(body.messageId, body.rating, body.comment);
    } catch (err: any) {
      const message = err?.message || 'Failed to save feedback';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ⬇⬇⬇ ADDED EXACTLY HERE — your trigger-learning endpoint ⬇⬇⬇
  @Post('trigger-learning')
  async triggerLearning(@Body() body: { sessionId?: string }): Promise<{ success: boolean; message: string }> {
    try {
      if (body.sessionId) {
        await this.chatService.triggerLearningFromSession(body.sessionId);
        return { success: true, message: 'Learning triggered for specific session' };
      } else {
        await this.chatService.analyzeAndLearnFromConversations();
        return { success: true, message: 'Full learning cycle triggered' };
      }
    } catch (error: any) {
      this.logger.error('Learning trigger failed:', error);
      return { success: false, message: 'Learning failed: ' + error.message };
    }
  }

  @Get('search-validation')
  async getSearchValidation(): Promise<any> {
    return this.validator.getValidationReport();
  }

  @Post('search-validation/clear')
  async clearValidationLog() {
    this.validator.clearLog();
    return { success: true, message: 'Validation log cleared' };
  }
}
