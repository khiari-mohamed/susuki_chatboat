import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ErpSyncService } from './erp-sync.service';
import type { ErpRow, ErpSource } from './erp-source';

const ENTITIES = ['vehicleTypeMaster', 'vehicleModelMap', 'vehicle', 'part', 'stock', 'fitment', 'itemReference'];

function setup(
  data: Record<string, ErpRow[]>,
  opts: { configured?: boolean; previousSync?: Date | null; local?: Record<string, any[]> } = {},
) {
  const { configured = true, previousSync = new Date('2026-09-30T22:00:00Z'), local = {} } = opts;
  const model = (name: string) => ({
    upsert: jest.fn(async (args: any) => ({ name, ...args })),
    findMany: jest.fn(async () => local[name] ?? []),
    deleteMany: jest.fn(async () => ({ count: 1 })),
  });
  const prisma: any = {
    syncRun: {
      create: jest.fn(async () => ({ id: 'run-1' })),
      update: jest.fn(async () => ({})),
      updateMany: jest.fn(async () => ({ count: 0 })),
      findMany: jest.fn(async () => []),
      findFirst: jest.fn(async () => (previousSync ? { startedAt: previousSync } : null)),
    },
    $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  };
  for (const name of ENTITIES) prisma[name] = model(name);

  const synonyms: any = { reload: jest.fn(async () => undefined) };
  const vehicleModels: any = { reload: jest.fn(async () => undefined) };
  const gateway: any = { broadcast: jest.fn() };
  const explorer: any = { invalidate: jest.fn(async () => undefined) };
  const fetchCalls = jest.fn();
  const source: ErpSource = {
    name: 'fake',
    isConfigured: () => configured,
    supportsIncremental: (entity) => ['vehicle', 'part', 'stock'].includes(entity),
    fetch: (entity, since) => {
      fetchCalls(entity, since);
      return (async function* () {
        if (data[entity]) yield data[entity];
      })();
    },
  };
  const service = new ErpSyncService(prisma, synonyms, source, vehicleModels, gateway, explorer);
  return { service, prisma, synonyms, vehicleModels, gateway, explorer, fetchCalls };
}

afterEach(() => {
  delete process.env.SYNC_APPLY_DELETES;
});

describe('ErpSyncService', () => {
  it('upserts valid rows, strips id, and reloads the synonym index', async () => {
    const { service, prisma, synonyms } = setup({
      part: [{ id: 99, reference: 'R1', designation: 'PARE CHOC AV', source: '01_PROD' }],
      stock: [{ reference: 'R1', stockConsolide: 3 }],
    });
    const result = await service.runSync('MANUAL');

    expect(result.status).toBe('SUCCESS');
    expect(prisma.part.upsert).toHaveBeenCalledWith({
      where: { reference: 'R1' },
      create: { reference: 'R1', designation: 'PARE CHOC AV', source: '01_PROD' },
      update: { reference: 'R1', designation: 'PARE CHOC AV' },
    });
    expect(synonyms.reload).toHaveBeenCalled();
  });

  it('accepts the ERP source value (BC-ERP) but rejects a part without any source', async () => {
    const { service, prisma } = setup({
      part: [
        { reference: 'R1', designation: 'X', source: 'BC-ERP' },
        { reference: 'R2', designation: 'Y' },
      ],
    });
    const result = await service.runSync('MANUAL');

    expect(prisma.part.upsert).toHaveBeenCalledTimes(1);
    expect(result.summary?.part.invalid).toBe(1);
  });

  it('creates parts with the ERP marker but never overwrites an existing origin with it', async () => {
    const { service, prisma } = setup({
      part: [{ reference: 'R1', designation: 'X', source: 'BC-ERP', prixPublic: 280 }],
    });

    await service.runSync('MANUAL');

    const call = (prisma.part.upsert as any).mock.calls[0][0];
    expect(call.create.source).toBe('BC-ERP');
    expect(call.update).not.toHaveProperty('source');
    expect(call.update.prixPublic).toBe(280);
  });

  it('updates prixTtc from the ERP but never blanks an existing one', async () => {
    const { service, prisma } = setup({
      part: [
        { reference: 'R1', designation: 'X', source: '01_PROD', prixTtc: 119 },
        { reference: 'R2', designation: 'Y', source: '01_PROD', prixTtc: null },
      ],
    });

    await service.runSync('MANUAL');

    const calls = (prisma.part.upsert as any).mock.calls.map((c: any[]) => c[0]);
    expect(calls[0].update.prixTtc).toBe(119);
    expect(calls[1].update).not.toHaveProperty('prixTtc');
  });

  it('never blanks the identity fields of an existing vehicle, and freezes modeleDescription', async () => {
    const { service, prisma } = setup({
      vehicle: [{ vehicleNo: 'V1', vin: 'VIN1', typeCode: null, marque: null, modele: null, modeleDescription: 'NEW', immatriculation: null }],
    });

    await service.runSync('MANUAL');

    const call = (prisma.vehicle.upsert as any).mock.calls[0][0];
    expect(call.update).toEqual({ vehicleNo: 'V1', vin: 'VIN1' });
  });

  it('never blanks an existing French designation when the ERP sends none', async () => {
    const { service, prisma } = setup({
      part: [{ reference: 'R1', designation: 'X', designation2: null, source: '01_PROD' }],
    });

    await service.runSync('MANUAL');

    const call = (prisma.part.upsert as any).mock.calls[0][0];
    expect(call.create.designation2).toBeNull();
    expect(call.update).not.toHaveProperty('designation2');
  });

  it('never turns a missing consolidated stock into 0: the row is skipped and the run is PARTIAL', async () => {
    const { service, prisma } = setup({ stock: [{ reference: 'R1' }] });
    const result = await service.runSync('CRON');

    expect(prisma.stock.upsert).not.toHaveBeenCalled();
    expect(result.status).toBe('PARTIAL');
    expect(result.summary?.stock.invalid).toBe(1);
  });

  it('rejects blank consolidated stock instead of importing it as zero', async () => {
    const { service, prisma } = setup({ stock: [{ reference: 'R1', stockConsolide: '  ' }] });

    const result = await service.runSync('MANUAL');

    expect(prisma.stock.upsert).not.toHaveBeenCalled();
    expect(result.summary?.stock.invalid).toBe(1);
    expect(result.status).toBe('PARTIAL');
  });

  it('does nothing while no ERP source is configured', async () => {
    const { service, prisma } = setup({ part: [{ reference: 'R1', designation: 'X', source: '01_PROD' }] }, { configured: false });

    expect((await service.runSync('CRON')).status).toBe('NOT_CONFIGURED');
    expect(service.requestManualSync()).toEqual({ accepted: false, reason: 'NOT_CONFIGURED' });
    expect(prisma.part.upsert).not.toHaveBeenCalled();
  });

  it('does not mark an empty first snapshot as a successful sync', async () => {
    const { service } = setup({}, { previousSync: null });

    const result = await service.runSync('CRON');

    expect(result.status).toBe('FAILED');
  });

  it('a full sync ignores the last sync date and still refuses an empty snapshot', async () => {
    const empty = setup({});
    expect((await empty.service.runSync('MANUAL', { full: true })).status).toBe('FAILED');

    const { service, fetchCalls } = setup({
      vehicle: [{ vehicleNo: 'V1' }],
      part: [{ reference: 'R1', designation: 'X', source: 'BC-ERP' }],
    });
    expect((await service.runSync('MANUAL', { full: true })).status).toBe('SUCCESS');
    expect(fetchCalls).toHaveBeenCalledWith('part', null);
  });

  it('refreshes the in-memory caches and tells the dashboard when a run ends', async () => {
    const { service, synonyms, vehicleModels, explorer, gateway } = setup({
      part: [{ reference: 'R1', designation: 'X', source: 'BC-ERP' }],
    });

    await service.runSync('MANUAL');

    expect(synonyms.reload).toHaveBeenCalled();
    expect(vehicleModels.reload).toHaveBeenCalled();
    expect(explorer.invalidate).toHaveBeenCalled();
    expect(gateway.broadcast).toHaveBeenCalledWith('sync', 'finished', expect.objectContaining({ status: 'SUCCESS', runId: 'run-1' }));
  });

  it('a failing cache refresh does not turn a good run into FAILED', async () => {
    const { service, vehicleModels } = setup({ part: [{ reference: 'R1', designation: 'X', source: 'BC-ERP' }] });
    (vehicleModels.reload as any).mockRejectedValueOnce(new Error('boom'));

    expect((await service.runSync('MANUAL')).status).toBe('SUCCESS');
  });
});

describe('ErpSyncService: deletions', () => {
  it('keeps ERP soft-deleted stock until SYNC_APPLY_DELETES is on', async () => {
    const rows = [{ reference: 'R1', _deleted: true }];

    const off = setup({ stock: rows });
    const offResult = await off.service.runSync('MANUAL');
    expect(off.prisma.stock.deleteMany).not.toHaveBeenCalled();
    expect(offResult.summary?.stock.pendingDeletes).toBe(1);
    expect(offResult.status).toBe('SUCCESS');

    process.env.SYNC_APPLY_DELETES = 'true';
    const on = setup({ stock: rows });
    const onResult = await on.service.runSync('MANUAL');
    expect(on.prisma.stock.deleteMany).toHaveBeenCalledWith({ where: { reference: 'R1' } });
    expect(onResult.summary?.stock.deleted).toBe(1);
  });

  it('reports fitments that vanished from the ERP, and deletes them only when allowed', async () => {
    const local = {
      fitment: [
        { id: 1, partReference: 'R1', typeCode: 'T1' },
        { id: 2, partReference: 'R1', typeCode: 'T9' },
      ],
    };
    const fitments = [{ partReference: 'R1', typeCode: 'T1', modelName: 'X' }];

    const off = setup({ fitment: fitments }, { local });
    const offResult = await off.service.runSync('MANUAL');
    expect(off.prisma.fitment.deleteMany).not.toHaveBeenCalled();
    expect(offResult.summary?.fitment.pendingDeletes).toBe(1);

    process.env.SYNC_APPLY_DELETES = 'true';
    const on = setup({ fitment: fitments }, { local });
    const onResult = await on.service.runSync('MANUAL');
    expect(on.prisma.fitment.deleteMany).toHaveBeenCalledWith({ where: { id: { in: [2] } } });
    expect(onResult.summary?.fitment.deleted).toBe(1);
  });

  it('refuses an abnormal mass deletion and flags the run PARTIAL', async () => {
    process.env.SYNC_APPLY_DELETES = 'true';
    const local = {
      fitment: Array.from({ length: 100 }, (_, i) => ({ id: i + 1, partReference: `R${i}`, typeCode: 'T1' })),
    };
    const { service, prisma } = setup({ fitment: [{ partReference: 'R0', typeCode: 'T1', modelName: 'X' }] }, { local });

    const result = await service.runSync('MANUAL');

    expect(prisma.fitment.deleteMany).not.toHaveBeenCalled();
    expect(result.summary?.fitment.pruneBlocked).toBe(99);
    expect(result.status).toBe('PARTIAL');
  });

  it('never prunes from an empty snapshot', async () => {
    process.env.SYNC_APPLY_DELETES = 'true';
    const { service, prisma } = setup({}, { local: { fitment: [{ id: 1, partReference: 'R1', typeCode: 'T1' }] } });

    await service.runSync('MANUAL');

    expect(prisma.fitment.deleteMany).not.toHaveBeenCalled();
  });
});