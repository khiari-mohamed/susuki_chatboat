import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ConfigModule, ChatModule],
  controllers: [VerificationController],
  providers: [VerificationService, PrismaService],
})
export class VerificationModule {}
