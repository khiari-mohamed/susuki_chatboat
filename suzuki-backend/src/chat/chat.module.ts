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
import { SessionService } from '../services/session.service';
import { ClarificationService } from '../services/clarification.service';
import { ContextService } from '../services/context.service';
import { ResponseService } from '../services/response.service';
import { SearchService } from '../services/search.service';
import { ChatOrchestratorService } from '../services/chat-orchestrator.service';
import { TunisianNormalizerService } from '../services/tunisian-normalizer.service';
import { SearchValidatorService } from '../services/search-validator.service';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [ChatController],
  providers: [
    EnhancedChatService,
    IntelligenceService,
    GeminiService,
    OpenAIService,
    AdvancedSearchService,
    TunisianNlpService,
    PrismaService,
    LearningSchedulerService,
    SessionService,
    ClarificationService,
    ContextService,
    ResponseService,
    SearchService,
    ChatOrchestratorService,
    TunisianNormalizerService,
    SearchValidatorService
  ],
  exports: [GeminiService, OpenAIService],
})
export class ChatModule {}
