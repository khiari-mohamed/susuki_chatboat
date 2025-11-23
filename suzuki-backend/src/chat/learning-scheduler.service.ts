import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EnhancedChatService } from './enhanced-chat.service';

@Injectable()
export class LearningSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(LearningSchedulerService.name);

  constructor(private enhancedChatService: EnhancedChatService) {}

  onModuleInit() {
    this.logger.log('Learning scheduler initialized');
  }

  @Cron(CronExpression.EVERY_WEEK) // Run every Sunday at midnight
  async handleWeeklyLearning() {
    this.logger.log('🚀 Starting weekly learning cycle...');
    try {
      await this.enhancedChatService.analyzeAndLearnFromConversations();
      this.logger.log('✅ Weekly learning cycle completed');
    } catch (error) {
      this.logger.error('❌ Weekly learning cycle failed:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM) // Run daily at 6 AM
  async handleDailyLearning() {
    this.logger.log('🔍 Starting daily learning check...');
    try {
      // Quick learning from yesterday's high-rated conversations
      await this.enhancedChatService.analyzeAndLearnFromConversations();
      this.logger.log('✅ Daily learning check completed');
    } catch (error) {
      this.logger.error('❌ Daily learning check failed:', error);
    }
  }
}