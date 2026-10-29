// ═══════════════════════════════════════════════════════════════════
// Search history — CarPro "Historique des recherches et accès aux logs".
// One row per chatbot answer, retrievable by VIN, so the Comptoir PR can
// see what a customer was told when they call or walk in.
//
// Single integration point: EnhancedChatService calls recordAnswer() once
// per orchestrator result (and recordFailure() when the orchestrator
// throws). The row is shaped by the pure buildSearchLogEntry() from the
// answer that was actually sent, never from a separate re-computation.
//
// Logging is best-effort: nothing here may ever break a chat response.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import type { Prisma, SearchLog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { COMPTOIR_PR_PHONES, COMPTOIR_REDIRECT_MESSAGE } from '../constants/business-rules.constants';
import type { ProcessMessageResponse } from './chat-orchestrator.service';

export type CompatibilityResult = 'CONFIRMEE' | 'NON_CONFORME' | 'NON_VERIFIEE';
export type AvailabilityCommunicated = 'DISPONIBLE' | 'INDISPONIBLE' | 'NON_COMMUNIQUEE';

export type RedirectReason =
  | 'NO_VEHICLE'
  | 'MODEL_CODE_MISSING'
  | 'VEHICLE_NOT_VERIFIED'
  | 'NO_FITMENT'
  | 'STOCK_UNKNOWN'
  | 'POSITION_UNVERIFIED'
  | 'QUALIFIER_UNVERIFIED'
  | 'VEHICLE_INCOMPATIBLE'
  | 'IDENTITY_UNVERIFIED'
  | 'IDENTITY_MISMATCH'
  | 'POSITION_MISMATCH'
  | 'QUALIFIER_MISMATCH'
  | 'STOCK_PRICE_MISMATCH'
  | 'LOW_UNDERSTANDING'
  | 'JUDGE_UNAVAILABLE'
  | 'AI_FLAG'
  | 'CLARIFICATION_UNRESOLVED'
  | 'NO_CANDIDATE'
  | 'NO_RESULTS'
  | 'SYSTEM_ERROR'
  | 'UNSPECIFIED';

export interface SearchLogEntry {
  sessionId?: string | null;
  vin?: string | null;
  vehicleNo?: string | null;
  modelCode?: string | null;
  customerMessage: string;
  identifiedPart?: string | null;
  proposedReferences?: { reference: string; designation: string }[];
  compatibilityResult?: CompatibilityResult | null;
  availabilityCommunicated?: AvailabilityCommunicated | null;
  redirectMessage?: string | null;
  redirectReason?: RedirectReason | null;
  intent?: string | null;
}

export interface SearchLogQuery {
  vin: string;
  limit?: number;
  before?: Date;
}

/** The parts of an orchestrator answer that end up in the log. */
export type LoggableAnswer = Pick<
  ProcessMessageResponse,
  'response' | 'sessionId' | 'products' | 'intent' | 'metadata'
>;

// Column sizes from schema.prisma; longer values would make the whole insert fail.
const LIMITS = {
  vin: 25,
  vehicleNo: 20,
  modelCode: 30,
  identifiedPart: 200,
  designation: 200,
  intent: 40,
  redirectReason: 60,
  customerMessage: 10_000,
} as const;

const MIN_VIN_LENGTH = 5;
const MAX_PROPOSED_REFERENCES = 5;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const MAX_SESSION_LOOKUP = 200;
const MAX_SESSION_ROWS = 500;

/** Small talk is not a search: it would only bury the rows the counter needs. */
const NON_SEARCH_INTENTS: ReadonlySet<string> = new Set(['GREETING', 'THANKS']);

// ─────────────────────────────────────────────────────────────────
// Redirect reason: derived from the engine/verifier reason strings.
// The patterns are co-located here on purpose: if a reason text changes in
// adaptive-decision-engine.ts or catalog-verifier.ts, this table and its
// spec are the only other place to update. Order = priority (first match wins).
// ─────────────────────────────────────────────────────────────────
const REASON_RULES: ReadonlyArray<readonly [RedirectReason, RegExp]> = [
  ['NO_VEHICLE', /vehicle scope missing/],
  ['MODEL_CODE_MISSING', /model code missing|model code inferred|no compatible type code/],
  ['VEHICLE_NOT_VERIFIED', /vehicle compatibility not verified/],
  ['NO_FITMENT', /no fitment (?:evidence|data)/],
  ['VEHICLE_INCOMPATIBLE', /fitment type codes do not match|deterministic check vehicle failed|designation identifies a different model/],
  ['STOCK_UNKNOWN', /stock unknown/],
  ['POSITION_UNVERIFIED', /position unverified/],
  ['QUALIFIER_UNVERIFIED', /qualifiers? unverified/],
  ['IDENTITY_UNVERIFIED', /no French designation|not as its head noun|identity unverified/],
  ['IDENTITY_MISMATCH', /^identity:|deterministic check identity failed/],
  ['POSITION_MISMATCH', /^position:|deterministic check position failed|position or identity not confirmed/],
  ['QUALIFIER_MISMATCH', /^qualifiers?:|deterministic check qualifiers failed/],
  ['STOCK_PRICE_MISMATCH', /^stockPrice:|deterministic check stockPrice failed/],
  ['LOW_UNDERSTANDING', /understanding confidence/],
  ['JUDGE_UNAVAILABLE', /AI judge unavailable/],
  ['AI_FLAG', /^AI [A-Z_]+/],
  ['CLARIFICATION_UNRESOLVED', /clarification unresolved/],
  ['NO_CANDIDATE', /no DB candidate|no candidate passed/],
];

export function classifyRedirectReason(
  reasons: readonly string[],
  intent: string,
  response = '',
): RedirectReason {
  for (const [code, pattern] of REASON_RULES) {
    if (reasons.some((reason) => pattern.test(reason))) return code;
  }
  if (/\ben position\b/i.test(response) && response.includes(COMPTOIR_PR_PHONES)) {
    return 'POSITION_MISMATCH';
  }
  if (intent === 'NO_RESULTS') return 'NO_RESULTS';
  if (intent === 'ERROR') return 'SYSTEM_ERROR';
  if (intent === 'SECURISATION') return 'NO_CANDIDATE';
  return 'UNSPECIFIED';
}

// ─────────────────────────────────────────────────────────────────
// Field helpers
// ─────────────────────────────────────────────────────────────────

function clip(value: unknown, max: number): string | null {
  const text = value == null ? '' : String(value).trim();
  return text ? text.slice(0, max) : null;
}

/** Uppercase alphanumerics only, 5–25 characters (vehicles.vin is VarChar(25)); otherwise null. */
export function normalizeVin(raw: unknown): string | null {
  const vin = String(raw ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return vin.length >= MIN_VIN_LENGTH && vin.length <= LIMITS.vin ? vin : null;
}

function firstPresent(source: Record<string, any>, keys: readonly string[]): unknown {
  for (const key of keys) {
    const value = source[key];
    if (value != null && String(value).trim() !== '') return value;
  }
  return null;
}

function asRecord(vehicle: unknown): Record<string, any> {
  return vehicle && typeof vehicle === 'object' ? (vehicle as Record<string, any>) : {};
}

const VIN_KEYS = ['vin', 'VIN', 'numeroChassis', 'numChassis', 'chassis'] as const;
const VEHICLE_NO_KEYS = ['vehicleNo', 'vehicle_no', 'numeroVehicule'] as const;
const TYPE_CODE_KEYS = ['typeCode', 'type_code', 'type'] as const;

// ─────────────────────────────────────────────────────────────────
// Shaping (pure, unit-tested)
// ─────────────────────────────────────────────────────────────────

/**
 * Shapes an orchestrator answer into the email's field list.
 * Returns null for answers that are not searches (greetings, thanks).
 */
export function buildSearchLogEntry(
  message: string,
  vehicleInput: unknown,
  result: LoggableAnswer,
): SearchLogEntry | null {
  if (NON_SEARCH_INTENTS.has(result.intent)) return null;

  const vehicle = asRecord(vehicleInput);
  const trace = result.metadata?.trace;
  const verification = result.metadata?.verification;
  const shown = result.products?.[0];

  // A redirect is the client's exact sentence, not any mention of the counter:
  // "pour réserver" invitations on a successful answer are not redirects.
  const response = typeof result.response === 'string' ? result.response : '';
  // Exact sentence, a withheld answer, or a "no exact match" that sends the customer to the counter.
  // A plain "contactez-nous pour réserver" on a successful answer is not a redirect.
  const redirected =
    response.includes(COMPTOIR_REDIRECT_MESSAGE) ||
    result.intent === 'SECURISATION' ||
    (result.intent === 'NO_RESULTS' && response.includes(COMPTOIR_PR_PHONES));

  const proposed = trace?.proposedReferences?.length
    ? trace.proposedReferences
    : (result.products ?? [])
        .filter((product: any) => product?.reference)
        .map((product: any) => ({ reference: String(product.reference), designation: String(product.designation ?? '') }));

  let compatibilityResult: CompatibilityResult | null = null;
  if (result.intent === 'MODEL_MISMATCH') compatibilityResult = 'NON_CONFORME';
  else if (verification) compatibilityResult = verification.compatibility;
  else if (shown || result.intent === 'SECURISATION') compatibilityResult = 'NON_VERIFIEE';

  // Availability counts only when a product was actually shown to the customer.
  let availabilityCommunicated: AvailabilityCommunicated = 'NON_COMMUNIQUEE';
  if (shown?.stock?.statut === 'Disponible') availabilityCommunicated = 'DISPONIBLE';
  else if (shown?.stock?.statut === 'Indisponible') availabilityCommunicated = 'INDISPONIBLE';

  return {
    sessionId: result.sessionId,
    vin: normalizeVin(firstPresent(vehicle, VIN_KEYS)),
    vehicleNo: clip(firstPresent(vehicle, VEHICLE_NO_KEYS), LIMITS.vehicleNo),
    // "Le code modèle utilisé" = the code the engine resolved, not the model name.
    modelCode: clip(trace?.modelCode ?? firstPresent(vehicle, TYPE_CODE_KEYS), LIMITS.modelCode),
    customerMessage: message,
    identifiedPart: clip(trace?.identifiedPart ?? shown?.designation, LIMITS.identifiedPart),
    proposedReferences: proposed.slice(0, MAX_PROPOSED_REFERENCES).map((item) => ({
      reference: item.reference,
      designation: item.designation.slice(0, LIMITS.designation),
    })),
    compatibilityResult,
    availabilityCommunicated,
    redirectMessage: redirected ? result.response : null,
    redirectReason: redirected
      ? classifyRedirectReason(verification?.reasons ?? [], result.intent, response)
      : null,
    intent: result.intent,
  };
}

// ─────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────

@Injectable()
export class SearchLogService {
  private readonly logger = new Logger(SearchLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Shapes and stores one answer. Never throws. */
  async recordAnswer(message: string, vehicle: unknown, result: LoggableAnswer): Promise<void> {
    try {
      const entry = buildSearchLogEntry(message, vehicle, result);
      if (entry) await this.record(entry);
    } catch (err: any) {
      this.logger.error(`[SEARCH-LOG] recordAnswer failed: ${err?.message}`, err?.stack);
    }
  }

  /** The orchestrator threw: keep a trace of the request so errors can be analysed. Never throws. */
  async recordFailure(message: string, vehicleInput: unknown, sessionId?: string | null): Promise<void> {
    try {
      const vehicle = asRecord(vehicleInput);
      await this.record({
        sessionId: sessionId ?? null,
        vin: normalizeVin(firstPresent(vehicle, VIN_KEYS)),
        vehicleNo: clip(firstPresent(vehicle, VEHICLE_NO_KEYS), LIMITS.vehicleNo),
        modelCode: clip(firstPresent(vehicle, TYPE_CODE_KEYS), LIMITS.modelCode),
        customerMessage: message,
        availabilityCommunicated: 'NON_COMMUNIQUEE',
        redirectReason: 'SYSTEM_ERROR',
        intent: 'ERROR',
      });
    } catch (err: any) {
      this.logger.error(`[SEARCH-LOG] recordFailure failed: ${err?.message}`, err?.stack);
    }
  }

  /** Low-level insert. Never throws: a log failure must not reach the customer. */
  async record(entry: SearchLogEntry): Promise<void> {
    try {
      await this.prisma.searchLog.create({
        data: {
          sessionId: entry.sessionId ?? null,
          vin: normalizeVin(entry.vin),
          vehicleNo: clip(entry.vehicleNo, LIMITS.vehicleNo),
          modelCode: clip(entry.modelCode, LIMITS.modelCode),
          customerMessage: (entry.customerMessage ?? '').slice(0, LIMITS.customerMessage),
          identifiedPart: clip(entry.identifiedPart, LIMITS.identifiedPart),
          proposedReferences: entry.proposedReferences?.length ? entry.proposedReferences : undefined,
          compatibilityResult: entry.compatibilityResult ?? null,
          availabilityCommunicated: entry.availabilityCommunicated ?? null,
          redirectMessage: entry.redirectMessage ?? null,
          redirectReason: clip(entry.redirectReason, LIMITS.redirectReason),
          intent: clip(entry.intent, LIMITS.intent),
        },
      });
    } catch (err: any) {
      this.logger.error(`[SEARCH-LOG] Failed to record entry: ${err?.message}`, err?.stack);
    }
  }

  /**
   * Everything the counter needs to reconstruct a customer's discussion, newest
   * first: rows carrying the VIN, plus the rest of every session in which that
   * VIN appeared (earlier messages were written before the carte grise scan).
   */
  async findByVin(query: SearchLogQuery): Promise<SearchLog[]> {
    const vin = normalizeVin(query.vin);
    if (!vin) return [];
    const limit = Math.min(Math.max(Math.trunc(query.limit ?? DEFAULT_LIMIT) || DEFAULT_LIMIT, 1), MAX_LIMIT);

    const sessions = await this.prisma.searchLog.findMany({
      where: { vin, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ['sessionId'],
      orderBy: { createdAt: 'desc' },
      take: MAX_SESSION_LOOKUP,
    });
    const sessionIds = sessions.map((row) => row.sessionId).filter((id): id is string => !!id);

    const where: Prisma.SearchLogWhereInput = {
      OR: [{ vin }, ...(sessionIds.length > 0 ? [{ sessionId: { in: sessionIds } }] : [])],
      ...(query.before ? { createdAt: { lt: query.before } } : {}),
    };
    return this.prisma.searchLog.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit });
  }

  async findBySession(sessionId: string): Promise<SearchLog[]> {
    return this.prisma.searchLog.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: MAX_SESSION_ROWS,
    });
  }

  /** How often, and why, answers were redirected to the counter. Feeds the data-quality follow-up. */
  async countRedirectReasons(days = 30): Promise<{
    since: Date;
    totalAnswers: number;
    redirected: number;
    byReason: { reason: string; count: number }[];
  }> {
    const since = new Date(Date.now() - Math.max(days, 1) * 24 * 60 * 60 * 1000);
    const [totalAnswers, grouped] = await Promise.all([
      this.prisma.searchLog.count({ where: { createdAt: { gte: since } } }),
      this.prisma.searchLog.groupBy({
        by: ['redirectReason'],
        where: { createdAt: { gte: since }, redirectReason: { not: null } },
        _count: { _all: true },
      }),
    ]);
    const byReason = grouped
      .map((row) => ({ reason: row.redirectReason ?? 'UNSPECIFIED', count: row._count._all }))
      .sort((a, b) => b.count - a.count);
    return { since, totalAnswers, redirected: byReason.reduce((sum, row) => sum + row.count, 0), byReason };
  }
}