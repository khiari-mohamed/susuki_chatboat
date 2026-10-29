import { Injectable } from '@nestjs/common';

export type ErpEntity =
  | 'vehicleTypeMaster'
  | 'vehicleModelMap'
  | 'vehicle'
  | 'part'
  | 'stock'
  | 'fitment'
  | 'itemReference';

export type ErpRow = Record<string, unknown>;

/**
 * Read-only port to the ERP. Rows must already have the shape of the Prisma
 * model (camelCase fields, no `id`). One implementation per access method
 * (HTTP API from IT/DeltaSoft, read-only views, scheduled exports).
 */
export interface ErpSource {
  readonly name: string;
  isConfigured(): boolean;
  /**
   * `since` = start of the last successful sync; a source that cannot do
   * incremental returns everything. The iterator must throw if pagination or
   * any entity fetch is incomplete; an empty incremental delta is valid.
   */
  fetch(entity: ErpEntity, since: Date | null): AsyncIterable<ErpRow[]>;
}

export const ERP_SOURCE = Symbol('ERP_SOURCE');

/** Default until the Kram meeting decides the access method. */
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