import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { EnhancedChatService } from './enhanced-chat.service';
import { IntelligenceService } from './intelligence.service';
import { GeminiService } from './gemini.service';
import { OpenAIService } from './openai.service';
import { AdvancedSearchService } from './advanced-search.service';
import { TunisianNlpService } from './tunisian-nlp.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LearningSchedulerService } from './learning-scheduler.service'; 

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [ChatController],
  providers: [EnhancedChatService, IntelligenceService, GeminiService, OpenAIService, AdvancedSearchService, TunisianNlpService, PrismaService, LearningSchedulerService],
  exports: [GeminiService, OpenAIService],
})
export class ChatModule {}
