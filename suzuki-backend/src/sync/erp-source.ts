import { Injectable } from '@nestjs/common';

export type ErpEntity =
  | 'vehicleTypeMaster'
  | 'vehicleModelMap'
  | 'vehicle'
  | 'part'
  | 'stock'
  | 'fitment'
  | 'itemReference';

/** `_deleted: true` marks an ERP soft-delete (only vehicles and stock carry one). */
export type ErpRow = Record<string, unknown>;

/**
 * Read-only port to the ERP. Rows must already have the shape of the Prisma
 * model (camelCase fields, no `id`). One implementation per access method
 * (HTTP relay, read-only views, scheduled exports).
 */
export interface ErpSource {
  readonly name: string;
  isConfigured(): boolean;
  /**
   * True when the ERP can filter this entity by modification date. When false,
   * every run returns the full snapshot (which lets the sync detect rows that
   * disappeared from the ERP). Leave the method out if unknown.
   */
  supportsIncremental?(entity: ErpEntity): boolean;
  /** Cheap reachability probe for the dashboard. */
  health?(): Promise<{ reachable: boolean; detail?: string }>;
  /**
   * `since` = start of the last successful sync; a source that cannot do
   * incremental returns everything. The iterator must throw if pagination or
   * any entity fetch is incomplete; an empty incremental delta is valid.
   */
  fetch(entity: ErpEntity, since: Date | null): AsyncIterable<ErpRow[]>;
}

export const ERP_SOURCE = Symbol('ERP_SOURCE');

/** Kept for tests / fallback wiring. */
@Injectable()
export class NotConfiguredErpSource implements ErpSource {
  readonly name = 'none';
  isConfigured(): boolean {
    return false;
  }
  fetch(): AsyncIterable<ErpRow[]> {
    throw new Error('No ERP source configured');
  }
}