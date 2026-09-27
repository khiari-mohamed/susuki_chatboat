// src/services/search-log.service.ts
// ═══════════════════════════════════════════════════════════════════
// BUSINESS RULE (email CarPro 2026-09-25 — "Historique des recherches
// et accès aux logs"): one row per chatbot answer, queryable by VIN,
// so the Comptoir PR can pull up what a customer was told when they
// call or walk in.
//
// Single integration point: called once from
// EnhancedChatService.processMessage(), right after
// ChatOrchestratorService returns its final answer — not scattered
// across the orchestrator's many return points. The orchestrator's
// response object already carries everything the email's field list
// needs (intent, products, response text); this service just shapes
// and persists it.
//
// Logging is best-effort: a failure here must NEVER break the chat
// response the customer is waiting on. Every call is wrapped in
// try/catch and only logged locally on failure.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchLogEntry {
  sessionId?: string | null;
  vin?: string | null;
  vehicleNo?: string | null;
  modelCode?: string | null;
  customerMessage: string;
  identifiedPart?: string | null;
  proposedReferences?: { reference: string; designation: string }[];
  compatibilityResult?: 'CONFIRMEE' | 'NON_CONFORME' | 'NON_VERIFIEE';
  availabilityCommunicated?: 'DISPONIBLE' | 'INDISPONIBLE' | 'NON_COMMUNIQUEE';
  redirectMessage?: string | null;
  intent?: string | null;
}

export interface SearchLogQuery {
  vin: string;
  limit?: number;
  before?: Date;
}

@Injectable()
export class SearchLogService {
  private readonly logger = new Logger(SearchLogService.name);

  constructor(private prisma: PrismaService) {}

  async record(entry: SearchLogEntry): Promise<void> {
    try {
      await this.prisma.searchLog.create({
        data: {
          sessionId:               entry.sessionId ?? null,
          vin:                     entry.vin ?? null,
          vehicleNo:               entry.vehicleNo ?? null,
          modelCode:               entry.modelCode ?? null,
          customerMessage:         entry.customerMessage,
          identifiedPart:          entry.identifiedPart ?? null,
          proposedReferences:      entry.proposedReferences ?? undefined,
          compatibilityResult:     entry.compatibilityResult ?? null,
          availabilityCommunicated: entry.availabilityCommunicated ?? null,
          redirectMessage:         entry.redirectMessage ?? null,
          intent:                  entry.intent ?? null,
        },
      });
    } catch (err: any) {
      // Best-effort — never let a logging failure break the chat response.
      this.logger.error(`[SEARCH-LOG] Failed to record entry: ${err?.message}`, err?.stack);
    }
  }

  /**
   * "Un client se présente ou nous contacte" — retrieve everything the
   * Comptoir PR needs to reconstruct the conversation for a given VIN,
   * newest first.
   */
  async findByVin(query: SearchLogQuery) {
    const vin = (query.vin ?? '').trim().toUpperCase();
    if (!vin) return [];

    return this.prisma.searchLog.findMany({
      where: {
        vin: { equals: vin, mode: 'insensitive' },
        ...(query.before ? { createdAt: { lt: query.before } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(query.limit ?? 50, 200),
    });
  }

  async findBySession(sessionId: string) {
    return this.prisma.searchLog.findMany({
      where:   { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}