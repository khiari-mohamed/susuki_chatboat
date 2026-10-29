// ═══════════════════════════════════════════════════════════════════
// Conversation context: the last part, last side and last query of a
// session, plus the refinements ("seulement à gauche") applied to it.
// No part vocabulary lives here: the orchestrator resolves the part name
// from the synonym table and stores it (in memory, and on each bot message
// as `metadata.part`, which is the fallback after a restart).
// ═══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  extractRequestedPositions,
  hasAnyPosition,
  isFillerToken,
  isPositionToken,
  normalizeForMatch,
  positionsToWords,
  tokenizeName,
} from '../chat/part-constraints';
import type { PositionRequest } from '../chat/part-constraints';

export interface ConversationContext {
  lastPart?: string;
  lastQuery?: string;
  lastSide?: 'gauche' | 'droite';
}

interface SessionState {
  lastPart?: string;
  lastQuery?: string;
  filters: PositionRequest[];
  touchedAt: number;
}

const STATE_TTL_MS = 30 * 60_000;
const HISTORY_WINDOW = 20;
/** A word this long that is not a position or filler is a new noun, not a bare answer. */
const NOUN_MIN_LENGTH = 5;
const FOLLOW_UP_PATTERN = /\b(et pour|aussi|egalement|pareil|meme chose|pour le|pour la)\b/;
const AVAILABILITY_PRICE_PATTERN = /\b(prix|price|combien|tarif|cout|co[uû]t|stock|disponible|dispo|ch7al|mawjoud|famma)\b/;

@Injectable()
export class ContextService {
  private readonly states = new Map<string, SessionState>();

  constructor(private readonly prisma: PrismaService) {}

  private state(sessionId: string): SessionState {
    const existing = this.states.get(sessionId);
    if (existing) {
      existing.touchedAt = Date.now();
      return existing;
    }
    const created: SessionState = { filters: [], touchedAt: Date.now() };
    this.states.set(sessionId, created);
    return created;
  }

  setLastPart(sessionId: string, partName: string): void {
    this.state(sessionId).lastPart = partName;
  }

  getLastPart(sessionId: string): string | undefined {
    return this.states.get(sessionId)?.lastPart;
  }

  setLastQuery(sessionId: string, query: string): void {
    this.state(sessionId).lastQuery = query;
  }

  getLastQuery(sessionId: string): string | undefined {
    return this.states.get(sessionId)?.lastQuery;
  }

  addFilter(sessionId: string, filter: PositionRequest): void {
    this.state(sessionId).filters.push(filter);
  }

  getActiveFilters(sessionId: string): PositionRequest[] {
    return this.states.get(sessionId)?.filters ?? [];
  }

  clearFilters(sessionId: string): void {
    const state = this.states.get(sessionId);
    if (state) state.filters = [];
  }

  /** Drops the state of idle sessions so the maps cannot grow without bound. */
  cleanup(): void {
    const limit = Date.now() - STATE_TTL_MS;
    for (const [id, state] of this.states.entries()) {
      if (state.touchedAt < limit) this.states.delete(id);
    }
  }

  /**
   * lastPart: in-memory value first, then the part stored on the latest bot
   * message. lastSide: the side the customer mentioned most recently.
   */
  async get(sessionId: string): Promise<ConversationContext> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
      take: HISTORY_WINDOW,
      select: { sender: true, message: true, metadata: true },
    });

    let lastSide: ConversationContext['lastSide'];
    let persistedPart: string | undefined;
    for (const message of messages) {
      if (!lastSide && message.sender === 'user') {
        const { sides } = extractRequestedPositions(message.message);
        if (sides.length === 1) lastSide = sides[0] === 'G' ? 'gauche' : 'droite';
      }
      if (!persistedPart && message.sender === 'bot') {
        const part = (message.metadata as { part?: unknown } | null)?.part;
        if (typeof part === 'string' && part.length > 0) persistedPart = part;
      }
      if (lastSide && persistedPart) break;
    }

    const lastQuery = this.states.get(sessionId)?.lastQuery;
    return {
      lastPart: this.states.get(sessionId)?.lastPart ?? persistedPart,
      lastSide,
      ...(lastQuery ? { lastQuery } : {}),
    };
  }

  /**
   * Completes an elliptical message with the previous part:
   *   "avant"             → "porte avant"
   *   "et pour l'arrière" → "porte arriere gauche" (side kept from the context)
   * A message that names its own part (`hasPartInMessage`) is a new request and
   * is returned as is, as is anything that introduces another noun.
   */
  buildSearchQuery(message: string, context: ConversationContext, hasPartInMessage = false): string {
    const { lastPart, lastQuery } = context;
     // The previous query is a valid anchor even when the part has no synonym key.
     if (hasPartInMessage || (!lastPart && !lastQuery)) return message;
     const anchor = lastPart ?? lastQuery ?? '';

    const tokens = tokenizeName(message);
    if (tokens.length === 0) return message;

    const requested = extractRequestedPositions(message);
    const hasPosition = hasAnyPosition(requested);
    const words = positionsToWords(requested);

    // Bare position answer: "avant", "g", "avd".
    if (tokens.every(isPositionToken)) return `${anchor} ${words.join(' ')}`;

    const normalizedMessage = normalizeForMatch(message);
    // A word this long that is neither a position nor filler is a new noun ("aileron arrière sport").
    const hasNewNoun = tokens.some(
      (token) => token.length >= NOUN_MIN_LENGTH && !isPositionToken(token) && !isFillerToken(token),
    );
    // A price/stock message is a follow-up unless it carries a long word that is neither
    // a position, filler nor a price/stock word (that would be a new part name).
    const isAvailabilityPriceOnly = AVAILABILITY_PRICE_PATTERN.test(normalizedMessage) &&
      !tokens.some((token) => token.length >= NOUN_MIN_LENGTH && !isPositionToken(token) &&
        !isFillerToken(token) && !AVAILABILITY_PRICE_PATTERN.test(token) && token !== 'accord');
    const isFollowUp = FOLLOW_UP_PATTERN.test(normalizedMessage) || isAvailabilityPriceOnly;

    if (!isFollowUp && !(hasPosition && !hasNewNoun)) return message;
    if (!hasPosition) return lastQuery || lastPart || message;

    // "et pour l'arrière": keep the side the customer was talking about.
    if (isFollowUp && requested.sides.length === 0 && context.lastSide) words.push(context.lastSide);
    return `${anchor} ${words.join(' ')}`;
  }
}