import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { AdminGateway } from '../admin/gateway/admin.gateway';
import { ExplorerService } from '../admin/explorer/explorer.service';
import { hasKnownStock } from '../constants/business-rules.constants';
import { ERP_SOURCE } from './erp-source';
import type { ErpEntity, ErpRow, ErpSource } from './erp-source';

export type SyncStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'NOT_CONFIGURED' | 'ALREADY_RUNNING';
export interface EntityStats {
  received: number;
  upserted: number;
  invalid: number;
  failed: number;
  /** Local rows removed because the ERP deleted them (needs SYNC_APPLY_DELETES=true). */
  deleted: number;
  /** Deletions the ERP implies but that were NOT applied (flag off). Review before enabling the flag. */
  pendingDeletes: number;
  /** Rows a snapshot prune refused to delete because the ratio looked abnormal. Makes the run PARTIAL. */
  pruneBlocked?: number;
}
export interface SyncOptions {
  /** Ignore the last sync date and re-read everything. */
  full?: boolean;
}

interface EntitySpec {
  entity: ErpEntity;
  /** Unique selector for a row, or null when the key is missing. */
  where: (row: ErpRow) => Record<string, unknown> | null;
  /** Extra business validation: returns the problem, or null. */
  validate?: (row: ErpRow) => string | null;
  /** Fields identifying a row (same names in the ERP row and the DB row). */
  identity: string[];
  /** The ERP soft-deletes these: a `_deleted` row removes the local row. */
  tombstones?: boolean;
  /** Leaf table rebuilt from a complete ERP snapshot: local rows absent from it are removed. */
  prune?: boolean;
}

const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const keyOf = (spec: EntitySpec, row: Record<string, unknown>): string =>
  spec.identity.map((field) => text(row[field]) ?? '').join('\u0000');

/** Parents first: fitment/stock/item_references have foreign keys to parts and vehicle_type_master. */
const SPECS: EntitySpec[] = [
  {
    entity: 'vehicleTypeMaster',
    identity: ['typeCode'],
    where: (r) => (text(r.typeCode) ? { typeCode: text(r.typeCode) } : null),
    validate: (r) => (!text(r.modelName) ? 'modelName missing' : null),
  },
  {
    // Not pruned: it also holds curated aliases (S-PRESSO, NEW SWIFT...) that the ERP does not know.
    entity: 'vehicleModelMap',
    identity: ['modele', 'typeCode'],
    where: (r) =>
      text(r.modele) && text(r.typeCode)
        ? { modele_typeCode: { modele: text(r.modele), typeCode: text(r.typeCode) } }
        : null,
  },
  {
    entity: 'vehicle',
    identity: ['vehicleNo'],
    tombstones: true,
    where: (r) => (text(r.vehicleNo) ? { vehicleNo: text(r.vehicleNo) } : null),
  },
  {
    entity: 'part',
    identity: ['reference'],
    where: (r) => (text(r.reference) ? { reference: text(r.reference) } : null),
    validate: (r) => (!text(r.designation) ? 'designation missing' : !text(r.source) ? 'source missing' : null),
  },
  {
    // A deleted stock row means "unknown" (chatbot redirects to the Comptoir PR), never 0.
    entity: 'stock',
    identity: ['reference'],
    tombstones: true,
    where: (r) => (text(r.reference) ? { reference: text(r.reference) } : null),
    // CarPro rule: no consolidated value = unknown. Never let the column default to 0.
    validate: (r) =>
      !hasKnownStock({ stockConsolide: r.stockConsolide }) ? 'stockConsolide missing or not numeric' : null,
  },
  {
    entity: 'fitment',
    identity: ['partReference', 'typeCode'],
    prune: true,
    where: (r) =>
      text(r.partReference) && text(r.typeCode)
        ? { partReference_typeCode: { partReference: text(r.partReference), typeCode: text(r.typeCode) } }
        : null,
  },
  {
    entity: 'itemReference',
    identity: ['partReference', 'referenceNo'],
    prune: true,
    where: (r) =>
      text(r.partReference) && text(r.referenceNo)
        ? { partReference_referenceNo: { partReference: text(r.partReference), referenceNo: text(r.referenceNo) } }
        : null,
  },
];

/**
 * Columns the chatbot keeps itself: the ERP never overwrites them on existing rows.
 * prixTtc = legacy public price of 01_PROD rows (validated by Car Pro); the relay's prixTtc is unconfirmed.
 * source = catalog tag set at creation; the relay stamps 01_PROD on every row and must not re-tag local parts.
 */
const CHATBOT_OWNED_COLUMNS: Record<string, string[]> = { part: ['searchDescription', 'prixTtc', 'source'] };

/** The relay stamps every part with this generic marker; it must not erase the legacy 01_PROD / 02_CARPRO origin. */
const GENERIC_ERP_SOURCE = 'BC-ERP';

/** The ERP may send these empty, but they are never blanked locally: French names drive display and identity checks. */
const NEVER_BLANK_COLUMNS: Record<string, string[]> = { part: ['designation2'] };

/** A snapshot prune that would remove more than max(50, 20 %) of a table is treated as an ERP/relay incident. */
const MIN_PRUNE_GUARD = 50;
const MAX_PRUNE_RATIO = 0.2;

/**
 * ERP → chatbot, ONE WAY. The chatbot never writes back to the ERP.
 * Writes go straight through Prisma, so the admin-dashboard guard keeps protecting
 * the same tables from manual edits.
 *
 * Deletions (ERP soft-deletes on vehicles/stock, fitments/references that vanished
 * from a full snapshot) are applied ONLY when SYNC_APPLY_DELETES=true. Until then they
 * are counted in `pendingDeletes` so IT can review them before agreeing the rule.
 */
@Injectable()
export class ErpSyncService implements OnModuleInit {
  private readonly logger = new Logger(ErpSyncService.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly synonyms: SynonymsService,
    @Inject(ERP_SOURCE) private readonly source: ErpSource,
    private readonly vehicleModels: VehicleModelsService,
    private readonly gateway: AdminGateway,
    private readonly explorer: ExplorerService,
  ) {}

  /** A run left RUNNING by a crash/restart would block the dashboard forever. Single instance assumed. */
  async onModuleInit(): Promise<void> {
    try {
      const { count } = await this.prisma.syncRun.updateMany({
        where: { status: 'RUNNING' },
        data: { status: 'FAILED', finishedAt: new Date(), error: 'Interrupted: server restarted during the run' },
      });
      if (count > 0) this.logger.warn(`[SYNC] ${count} interrupted run(s) marked FAILED`);
    } catch (e: any) {
      this.logger.warn(`[SYNC] could not clean interrupted runs: ${e?.message}`);
    }
  }

  /** End-of-day run (hour to confirm at the Kram visit). Off until SYNC_ENABLED=true. */
  @Cron('0 0 22 * * *', { timeZone: 'Africa/Tunis' })
  async nightly(): Promise<void> {
    if (process.env.SYNC_ENABLED !== 'true') return;
    await this.runSync('CRON');
  }

  /** Validates, then runs in the background so the HTTP call returns immediately. */
  requestManualSync(options: SyncOptions = {}): { accepted: boolean; reason?: 'NOT_CONFIGURED' | 'ALREADY_RUNNING' } {
    if (!this.source.isConfigured()) return { accepted: false, reason: 'NOT_CONFIGURED' };
    if (this.running) return { accepted: false, reason: 'ALREADY_RUNNING' };
    void this.runSync('MANUAL', options);
    return { accepted: true };
  }

  async getStatus() {
    return {
      source: this.source.name,
      configured: this.source.isConfigured(),
      running: this.running,
      applyDeletes: process.env.SYNC_APPLY_DELETES === 'true',
      lastRun: await this.prisma.syncRun.findFirst({ orderBy: { startedAt: 'desc' } }),
    };
  }

  /** Separate from getStatus: the dashboard polls status while running, this one calls the relay. */
  async getHealth(): Promise<{ reachable: boolean; detail?: string }> {
    return this.source.health ? this.source.health() : { reachable: this.source.isConfigured() };
  }

  listRuns(limit = 20) {
    return this.prisma.syncRun.findMany({ orderBy: { startedAt: 'desc' }, take: limit });
  }

  /** Never rejects. */
  async runSync(
    trigger: 'CRON' | 'MANUAL',
    options: SyncOptions = {},
  ): Promise<{ status: SyncStatus; summary?: Record<string, EntityStats> }> {
    if (!this.source.isConfigured()) return { status: 'NOT_CONFIGURED' };
    if (this.running) return { status: 'ALREADY_RUNNING' };
    this.running = true;

    const summary: Record<string, EntityStats> = {};
    const applyDeletes = process.env.SYNC_APPLY_DELETES === 'true';
    let runId: string | null = null;
    let status: SyncStatus = 'FAILED';
    try {
      const previous = await this.prisma.syncRun.findFirst({
        where: { status: 'SUCCESS' },
        orderBy: { startedAt: 'desc' },
      });
      const since = options.full ? null : (previous?.startedAt ?? null);
      runId = (await this.prisma.syncRun.create({ data: { trigger, status: 'RUNNING' } })).id;
      this.logger.log(`[SYNC] ${trigger} started (source=${this.source.name}, ${since ? `since ${since.toISOString()}` : 'full'})`);
      this.notify('started', { runId, trigger, full: since === null });

      for (const spec of SPECS) {
        const stats: EntityStats = (summary[spec.entity] = {
          received: 0,
          upserted: 0,
          invalid: 0,
          failed: 0,
          deleted: 0,
          pendingDeletes: 0,
        });
        const seen = new Set<string>();
        for await (const batch of this.source.fetch(spec.entity, since)) {
          stats.received += batch.length;
          await this.applyBatch(spec, batch, stats, seen, applyDeletes);
        }
        // The fetch completed without throwing: if it was a full snapshot, rows missing from it were removed in the ERP.
        const snapshot = since === null || this.source.supportsIncremental?.(spec.entity) === false;
        if (spec.prune && snapshot) await this.pruneMissing(spec, seen, stats, applyDeletes);
        this.logger.log(`[SYNC] ${spec.entity}: ${JSON.stringify(stats)}`);
      }

      if (since === null) {
        const missingInitialEntities = ['vehicle', 'part'].filter((entity) => summary[entity]?.received === 0);
        if (missingInitialEntities.length > 0) {
          throw new Error(`Full ERP sync returned no rows for required entities: ${missingInitialEntities.join(', ')}`);
        }
      }

      const dirty = Object.values(summary).some((s) => s.invalid + s.failed + (s.pruneBlocked ?? 0) > 0);
      status = dirty ? 'PARTIAL' : 'SUCCESS';
      await this.finish(runId, status, summary);
    } catch (error: any) {
      status = 'FAILED';
      this.logger.error(`[SYNC] failed: ${error?.message}`, error?.stack);
      if (runId) await this.finish(runId, 'FAILED', summary, error?.message);
    } finally {
      if (runId) {
        // Data may have changed even when the run failed midway: refresh in every case.
        await this.refreshCaches();
        this.notify('finished', { runId, trigger, status });
      }
      this.running = false;
    }
    return { status, summary };
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

  /** In-memory caches built from the synced tables. A failure here never changes the run status. */
  private async refreshCaches(): Promise<void> {
    const steps: [string, () => Promise<unknown>][] = [
      ['synonyms', () => this.synonyms.reload()], // designations may have changed
      ['vehicle models', () => this.vehicleModels.reload()], // modele list comes from the vehicles table
      ['explorer cache', () => this.explorer.invalidate()],
    ];
    for (const [name, step] of steps) {
      try {
        await step();
      } catch (e: any) {
        this.logger.warn(`[SYNC] could not refresh ${name}: ${e?.message}`);
      }
    }
  }

  private notify(event: 'started' | 'finished', payload: object): void {
    try {
      this.gateway.broadcast('sync', event, payload);
    } catch (e: any) {
      this.logger.warn(`[SYNC] could not notify dashboard: ${e?.message}`);
    }
  }

  private async applyBatch(
    spec: EntitySpec,
    rows: ErpRow[],
    stats: EntityStats,
    seen: Set<string>,
    applyDeletes: boolean,
  ): Promise<void> {
    const delegate = (this.prisma as any)[spec.entity];
    const items: { where: Record<string, unknown>; data: ErpRow }[] = [];
    const tombstones: Record<string, unknown>[] = [];

    for (const raw of rows) {
      const { id: _ignored, _deleted, ...data } = raw;
      const where = spec.where(data);
      if (!where) {
        stats.invalid++;
        continue;
      }
      seen.add(keyOf(spec, data));

      if (_deleted === true) {
        if (!spec.tombstones) {
          stats.invalid++;
        } else if (applyDeletes) {
          tombstones.push(where);
        } else {
          stats.pendingDeletes++;
        }
        continue;
      }

      const problem = spec.validate?.(data) ?? null;
      if (problem) {
        stats.invalid++;
        this.logger.warn(`[SYNC] ${spec.entity} row skipped: ${problem}`);
        continue;
      }
      items.push({ where, data });
    }

    for (const where of tombstones) {
      try {
        stats.deleted += (await delegate.deleteMany({ where })).count;
      } catch (e: any) {
        stats.failed++;
        this.logger.warn(`[SYNC] ${spec.entity} delete failed: ${e?.message?.split('\n').pop()}`);
      }
    }
    if (items.length === 0) return;

    const owned = CHATBOT_OWNED_COLUMNS[spec.entity] ?? [];
    const neverBlank = NEVER_BLANK_COLUMNS[spec.entity] ?? [];
    const upsert = (i: { where: Record<string, unknown>; data: ErpRow }) =>
      delegate.upsert({
        where: i.where,
        create: i.data,
        update: Object.fromEntries(
          Object.entries(i.data).filter(
            ([key, value]) =>
              !owned.includes(key) &&
              !(neverBlank.includes(key) && value == null) &&
              // Existing parts keep their real origin; only a real value from the ERP replaces it.
              !(spec.entity === 'part' && key === 'source' && value === GENERIC_ERP_SOURCE),
          ),
        ),
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

  /**
   * Removes local rows that no longer exist in a complete ERP snapshot (a corrected compatibility
   * must disappear, not linger). Skipped on an empty or dirty snapshot, and blocked when the
   * volume looks abnormal.
   */
  private async pruneMissing(spec: EntitySpec, seen: Set<string>, stats: EntityStats, applyDeletes: boolean): Promise<void> {
    if (stats.received === 0 || stats.invalid + stats.failed > 0) return;
    const delegate = (this.prisma as any)[spec.entity];
    try {
      const select = { id: true, ...Object.fromEntries(spec.identity.map((field) => [field, true])) };
      const local: Array<Record<string, unknown> & { id: number }> = await delegate.findMany({ select });
      const stale = local.filter((row) => !seen.has(keyOf(spec, row)));
      if (stale.length === 0) return;

      if (!applyDeletes) {
        stats.pendingDeletes += stale.length;
        return;
      }
      if (stale.length > Math.max(MIN_PRUNE_GUARD, local.length * MAX_PRUNE_RATIO)) {
        stats.pruneBlocked = stale.length;
        this.logger.error(`[SYNC] ${spec.entity}: refusing to delete ${stale.length}/${local.length} rows missing from the ERP`);
        return;
      }
      for (let i = 0; i < stale.length; i += 1000) {
        const ids = stale.slice(i, i + 1000).map((row) => row.id);
        stats.deleted += (await delegate.deleteMany({ where: { id: { in: ids } } })).count;
      }
    } catch (e: any) {
      stats.failed++;
      this.logger.warn(`[SYNC] ${spec.entity} prune failed: ${e?.message?.split('\n').pop()}`);
    }
  }
}