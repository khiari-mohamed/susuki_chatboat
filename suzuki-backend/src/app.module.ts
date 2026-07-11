import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { VerificationModule } from './verification/verification.module';
import { PrismaModule } from './prisma/prisma.module';
import { StockModule } from './stock/stock.module';
import { SynonymsModule } from './synonyms/synonyms.module';
import { VehicleModelsModule } from './constants/vehicle-models.module';
import { DebugModule } from './debug/debug.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, any>) => {
        const required = ['DATABASE_URL', 'GEMINI_API_KEY'];
        const missing = required.filter(key => !config[key]);
        if (missing.length > 0) {
          throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        return config;
      },
    }),
    PrismaModule,          // @Global() — single Prisma connection pool for the whole app
    SynonymsModule,        // @Global() — SynonymsService available everywhere
    VehicleModelsModule,   // @Global() — VehicleModelsService available everywhere
    ChatModule,
    VerificationModule,
    StockModule,
    DebugModule, // @Global() — DebugService available everywhere
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}