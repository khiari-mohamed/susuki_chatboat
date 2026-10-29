import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { hasKnownStock } from '../constants/business-rules.constants';
import { ERP_SOURCE } from './erp-source';
import type { ErpRow, ErpSource } from './erp-source';

export type SyncStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'NOT_CONFIGURED' | 'ALREADY_RUNNING';
export interface EntityStats {
  received: number;
  upserted: number;
  invalid: number;
  failed: number;
}

interface EntitySpec {
  entity: string;
  /** Unique selector for a row, or null when the key is missing. */
  where: (row: ErpRow) => Record<string, unknown> | null;
  /** Extra business validation: returns the problem, or null. */
  validate?: (row: ErpRow) => string | null;
}

const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/** Parents first: fitment/stock/item_references have foreign keys to parts and vehicle_type_master. */
const SPECS: EntitySpec[] = [
  { entity: 'vehicleTypeMaster', where: (r) => (text(r.typeCode) ? { typeCode: text(r.typeCode) } : null) },
  {
    entity: 'vehicleModelMap',
    where: (r) =>
      text(r.modele) && text(r.typeCode)
        ? { modele_typeCode: { modele: text(r.modele), typeCode: text(r.typeCode) } }
        : null,
  },
  { entity: 'vehicle', where: (r) => (text(r.vehicleNo) ? { vehicleNo: text(r.vehicleNo) } : null) },
  {
    entity: 'part',
    where: (r) => (text(r.reference) ? { reference: text(r.reference) } : null),
    validate: (r) =>
      !text(r.designation)
        ? 'designation missing'
        : !['01_PROD', '02_CARPRO'].includes(String(r.source))
          ? 'source must be 01_PROD or 02_CARPRO'
          : null,
  },
  {
    entity: 'stock',
    where: (r) => (text(r.reference) ? { reference: text(r.reference) } : null),
    // CarPro rule: no consolidated value = unknown. Never let the column default to 0.
    validate: (r) =>
      !hasKnownStock({ stockConsolide: r.stockConsolide }) ? 'stockConsolide missing or not numeric' : null,
  },
  {
    entity: 'fitment',
    where: (r) =>
      text(r.partReference) && text(r.typeCode)
        ? { partReference_typeCode: { partReference: text(r.partReference), typeCode: text(r.typeCode) } }
        : null,
  },
  {
    entity: 'itemReference',
    where: (r) =>
      text(r.partReference) && text(r.referenceNo)
        ? { partReference_referenceNo: { partReference: text(r.partReference), referenceNo: text(r.referenceNo) } }
        : null,
  },
];

/** Columns the chatbot enriches itself: the ERP never overwrites them. */
const CHATBOT_OWNED_COLUMNS: Record<string, string[]> = { part: ['searchDescription'] };

/**
 * ERP → chatbot, ONE WAY. The chatbot never writes back to the ERP.
 * Writes go straight through Prisma, so the admin-dashboard guard (ERP_READ_ONLY)
 * keeps protecting the same tables from manual edits.
 * Rows are only created/updated: nothing is deleted until the deletion rule is
 * agreed with IT (a missing stock row must stay "unknown", never become 0).
 */
@Injectable()
export class ErpSyncService {
  private readonly logger = new Logger(ErpSyncService.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly synonyms: SynonymsService,
    @Inject(ERP_SOURCE) private readonly source: ErpSource,
  ) {}

  /** End-of-day run (hour to confirm at the Kram visit). Off until SYNC_ENABLED=true. */
  @Cron('0 0 22 * * *', { timeZone: 'Africa/Tunis' })
  async nightly(): Promise<void> {
    if (process.env.SYNC_ENABLED !== 'true') return;
    await this.runSync('CRON');
  }

  /** Validates, then runs in the background so the HTTP call returns immediately. */
  requestManualSync(): { accepted: boolean; reason?: 'NOT_CONFIGURED' | 'ALREADY_RUNNING' } {
    if (!this.source.isConfigured()) return { accepted: false, reason: 'NOT_CONFIGURED' };
    if (this.running) return { accepted: false, reason: 'ALREADY_RUNNING' };
    void this.runSync('MANUAL');
    return { accepted: true };
  }

  async getStatus() {
    return {
      source: this.source.name,
      configured: this.source.isConfigured(),
      running: this.running,
      lastRun: await this.prisma.syncRun.findFirst({ orderBy: { startedAt: 'desc' } }),
    };
  }

  /** Never rejects. */
  async runSync(trigger: 'CRON' | 'MANUAL'): Promise<{ status: SyncStatus; summary?: Record<string, EntityStats> }> {
    if (!this.source.isConfigured()) return { status: 'NOT_CONFIGURED' };
    if (this.running) return { status: 'ALREADY_RUNNING' };
    this.running = true;

    const summary: Record<string, EntityStats> = {};
    let runId: string | null = null;
    try {
      const previous = await this.prisma.syncRun.findFirst({
        where: { status: 'SUCCESS' },
        orderBy: { startedAt: 'desc' },
      });
      runId = (await this.prisma.syncRun.create({ data: { trigger, status: 'RUNNING' } })).id;
      this.logger.log(`[SYNC] ${trigger} started (source=${this.source.name})`);

      for (const spec of SPECS) {
        const stats: EntityStats = (summary[spec.entity] = { received: 0, upserted: 0, invalid: 0, failed: 0 });
        for await (const batch of this.source.fetch(spec.entity as any, previous?.startedAt ?? null)) {
          stats.received += batch.length;
          await this.upsertBatch(spec, batch, stats);
        }
        this.logger.log(`[SYNC] ${spec.entity}: ${JSON.stringify(stats)}`);
      }

      if (!previous) {
        const missingInitialEntities = ['vehicle', 'part'].filter(
          (entity) => summary[entity]?.received === 0,
        );
        if (missingInitialEntities.length > 0) {
          throw new Error(`Initial ERP sync returned no rows for required entities: ${missingInitialEntities.join(', ')}`);
        }
      }

      const dirty = Object.values(summary).some((s) => s.invalid + s.failed > 0);
      const status: SyncStatus = dirty ? 'PARTIAL' : 'SUCCESS';
      await this.finish(runId, status, summary);
      await this.synonyms.reload(); // designations may have changed
      return { status, summary };
    } catch (error: any) {
      this.logger.error(`[SYNC] failed: ${error?.message}`, error?.stack);
      if (runId) await this.finish(runId, 'FAILED', summary, error?.message);
      return { status: 'FAILED', summary };
    } finally {
      this.running = false;
    }
  }

  private async finish(runId: string, status: SyncStatus, summary: object, error?: string): Promise<void> {
    try {
      await this.prisma.syncRun.update({
        where: { id: runId },
        data: { status, finishedAt: new Date(), summary: summary as any, error: error ?? null },
      });
    } catch (e: any) {
      this.logger.warn(`[SYNC] could not record run status: ${e?.message}`);
    }
  }

  private async upsertBatch(spec: EntitySpec, rows: ErpRow[], stats: EntityStats): Promise<void> {
    const delegate = (this.prisma as any)[spec.entity];
    const items: { where: Record<string, unknown>; data: ErpRow }[] = [];
    for (const raw of rows) {
      const { id: _ignored, ...data } = raw;
      const where = spec.where(data);
      const problem = spec.validate?.(data) ?? null;
      if (!where || problem) {
        stats.invalid++;
        if (problem) this.logger.warn(`[SYNC] ${spec.entity} row skipped: ${problem}`);
        continue;
      }
      items.push({ where, data });
    }
    if (items.length === 0) return;

    const owned = CHATBOT_OWNED_COLUMNS[spec.entity] ?? [];
    const upsert = (i: { where: Record<string, unknown>; data: ErpRow }) =>
      delegate.upsert({
        where: i.where,
        create: i.data,
        update: Object.fromEntries(Object.entries(i.data).filter(([key]) => !owned.includes(key))),
      });
    try {
      await this.prisma.$transaction(items.map(upsert));
      stats.upserted += items.length;
    } catch {
      // One bad row (e.g. a foreign key to an unknown part) must not drop the whole batch.
      for (const item of items) {
        try {
          await upsert(item);
          stats.upserted++;
        } catch (e: any) {
          stats.failed++;
          this.logger.warn(`[SYNC] ${spec.entity} row failed: ${e?.message?.split('\n').pop()}`);
        }
      }
    }
  }
}