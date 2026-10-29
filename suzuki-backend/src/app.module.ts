import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { VerificationModule } from './verification/verification.module';
import { PrismaModule } from './prisma/prisma.module';
import { StockModule } from './stock/stock.module';
import { SynonymsModule } from './synonyms/synonyms.module';
import { VehicleModelsModule } from './constants/vehicle-models.module';
import { DebugModule } from './debug/debug.module';
import { AdminModule } from './admin/admin.module';
import { SyncModule } from './sync/sync.module';

/**
 * Variables without which the application cannot work.
 * - OPENAI_API_KEY: OpenAIService throws at construction without it.
 * - GEMINI_API_KEY: GeminiService handles carte-grise OCR.
 */
const REQUIRED_ENV = ['DATABASE_URL', 'OPENAI_API_KEY', 'GEMINI_API_KEY'] as const;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, any>) => {
        const missing = REQUIRED_ENV.filter((key) => !String(config[key] ?? '').trim());
        if (missing.length > 0) {
          throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        return config;
      },
    }),
    CacheModule, // @Global() — Redis cache with graceful fallback
    PrismaModule, // @Global() — single Prisma connection pool for the whole app
    SynonymsModule, // @Global() — SynonymsService available everywhere
    VehicleModelsModule, // @Global() — VehicleModelsService available everywhere
    ChatModule,
    VerificationModule,
    StockModule,
    DebugModule, // @Global() — DebugService available everywhere
    AdminModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}