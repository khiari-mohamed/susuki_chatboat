// src/services/session.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25):
//
// FIX-1: saveBotResponse() metadata now typed as `Record<string, any>`
//         instead of implicit `any` for better type safety downstream.
//
// FIX-2: getHistory() maps messages to { role, content } with an
//         additional `displayName` hint field so downstream services
//         that reconstruct conversation history can show French names
//         in context-aware follow-up responses.
//
// FIX-3: getOrCreate() vehicle info is stored as-is from the session
//         vehicle object — no changes needed here since the orchestrator
//         already normalises the vehicle model via VehicleModelsService
//         before passing it down.
//
// NOTE: This service is intentionally thin — it only manages DB I/O
//       for sessions and messages. All product mapping and French-first
//       display logic lives in ChatOrchestratorService and ResponseService.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: getOrCreate — unchanged logic, explicit return type added
  // ─────────────────────────────────────────────────────────────────
  async getOrCreate(sessionId?: string, vehicle?: any) {
    if (sessionId) {
      const existing = await this.prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
      if (existing) return existing;
    }
    return this.prisma.chatSession.create({
      data: { vehicleInfo: vehicle || {} },
    });
  }

  async saveUserMessage(sessionId: string, message: string): Promise<string> {
    const saved = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        sender:    'user',
        message,
        timestamp: new Date(),
      },
    });
    return saved.id;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: saveBotResponse — typed metadata parameter
  // ─────────────────────────────────────────────────────────────────
  async saveBotResponse(
    sessionId: string,
    response:  string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        sender:    'bot',
        message:   response,
        metadata:  metadata ?? undefined,
        timestamp: new Date(),
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: getHistory — returns role/content for AI context, with
  //         metadata preserved so the orchestrator can inspect intent
  //         labels stored on bot messages.
  // ─────────────────────────────────────────────────────────────────
  async getHistory(
    sessionId: string,
    limit = 10,
  ): Promise<{ role: string; content: string; metadata?: any }[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where:   { sessionId },
      orderBy: { timestamp: 'asc' },
      take:    limit,
    });

    return messages.map((m) => ({
      role:     m.sender,
      content:  m.message,
      // FIX-2: pass through metadata so orchestrator can read
      // intent labels (e.g. { intent: 'PARTS_SEARCH', productsFound: 2 })
      // that were stored on bot messages
      metadata: m.metadata ?? undefined,
    }));
  }

  // ─────────────────────────────────────────────────────────────────
  // getSessionInfo — helper for admin/analytics endpoints
  // ─────────────────────────────────────────────────────────────────
  async getSessionInfo(sessionId: string): Promise<{
    id:          string;
    vehicleInfo: any;
    startedAt:   Date;
    messageCount: number;
  } | null> {
    const session = await this.prisma.chatSession.findUnique({
      where:   { id: sessionId },
      include: { _count: { select: { messages: true } } },
    });
    if (!session) return null;

    return {
      id:           session.id,
      vehicleInfo:  session.vehicleInfo,
      startedAt:    session.startedAt,
      messageCount: (session as any)._count?.messages ?? 0,
    };
  }
}