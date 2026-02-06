import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async getOrCreate(sessionId?: string, vehicle?: any) {
    if (sessionId) {
      const existing = await this.prisma.chatSession.findUnique({ where: { id: sessionId } });
      if (existing) return existing;
    }
    return this.prisma.chatSession.create({ data: { vehicleInfo: vehicle || {} } });
  }

  async saveUserMessage(sessionId: string, message: string) {
    const saved = await this.prisma.chatMessage.create({
      data: { sessionId, sender: 'user', message, timestamp: new Date() }
    });
    return saved.id;
  }

  async saveBotResponse(sessionId: string, response: string, metadata?: any) {
    await this.prisma.chatMessage.create({
      data: { sessionId, sender: 'bot', message: response, metadata, timestamp: new Date() }
    });
  }

  async getHistory(sessionId: string, limit = 10) {
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: limit
    });
    return messages.map(m => ({ role: m.sender, content: m.message }));
  }
}
