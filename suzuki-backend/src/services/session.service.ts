// Thin DB layer for sessions and messages. Product mapping and French-first
// display live in ChatOrchestratorService and ResponseService.

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_HISTORY_LIMIT = 10;

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns the existing session, or creates a new one (the caller must use the returned id). */
  async getOrCreate(sessionId?: string, vehicle?: any) {
    if (sessionId) {
      const existing = await this.prisma.chatSession.findUnique({ where: { id: sessionId } });
      if (existing) return existing;
    }
    return this.prisma.chatSession.create({ data: { vehicleInfo: vehicle || {} } });
  }

  async saveUserMessage(sessionId: string, message: string): Promise<string> {
    const saved = await this.prisma.chatMessage.create({
      data: { sessionId, sender: 'user', message, timestamp: new Date() },
    });
    return saved.id;
  }

  /** `metadata` carries the intent, the product count and the part name (fallback for the conversation context). */
  async saveBotResponse(sessionId: string, response: string, metadata?: Record<string, any>): Promise<void> {
    await this.prisma.chatMessage.create({
      data: { sessionId, sender: 'bot', message: response, metadata: metadata ?? undefined, timestamp: new Date() },
    });
  }

  /** Oldest first, metadata preserved so intent labels stored on bot messages stay readable. */
  async getHistory(
    sessionId: string,
    limit = DEFAULT_HISTORY_LIMIT,
  ): Promise<{ role: string; content: string; metadata?: any }[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
    return messages.reverse().map((m) => ({
      role: m.sender,
      content: m.message,
      metadata: m.metadata ?? undefined,
    }));
  }

  async getSessionInfo(sessionId: string): Promise<{
    id: string;
    vehicleInfo: any;
    startedAt: Date;
    messageCount: number;
  } | null> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { _count: { select: { messages: true } } },
    });
    if (!session) return null;
    return {
      id: session.id,
      vehicleInfo: session.vehicleInfo,
      startedAt: session.startedAt,
      messageCount: session._count.messages,
    };
  }
}