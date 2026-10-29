import { describe, expect, it, jest } from '@jest/globals';
import { ErpSyncService } from './erp-sync.service';
import type { ErpRow, ErpSource } from './erp-source';

function setup(data: Record<string, ErpRow[]>, configured = true, previousSync: Date | null = new Date('2026-09-30T22:00:00Z')) {
  const upsert = (name: string) => jest.fn(async (args: any) => ({ name, ...args }));
  const prisma: any = {
    part: { upsert: upsert('part') },
    stock: { upsert: upsert('stock') },
    syncRun: {
      create: jest.fn(async () => ({ id: 'run-1' })),
      update: jest.fn(async () => ({})),
      findFirst: jest.fn(async () => previousSync ? { startedAt: previousSync } : null),
    },
    $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  };
  const synonyms: any = { reload: jest.fn(async () => undefined) };
  const source: ErpSource = {
    name: 'fake',
    isConfigured: () => configured,
    fetch: (entity) =>
      (async function* () {
        if (data[entity]) yield data[entity];
      })(),
  };
  return { service: new ErpSyncService(prisma, synonyms, source), prisma, synonyms };
}

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
      update: { reference: 'R1', designation: 'PARE CHOC AV', source: '01_PROD' },
    });
    expect(synonyms.reload).toHaveBeenCalled();
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
    const { service, prisma } = setup({ part: [{ reference: 'R1', designation: 'X', source: '01_PROD' }] }, false);

    expect((await service.runSync('CRON')).status).toBe('NOT_CONFIGURED');
    expect(service.requestManualSync()).toEqual({ accepted: false, reason: 'NOT_CONFIGURED' });
    expect(prisma.part.upsert).not.toHaveBeenCalled();
  });

  it('does not mark an empty first snapshot as a successful sync', async () => {
    const { service } = setup({}, true, null);

    const result = await service.runSync('CRON');

    expect(result.status).toBe('FAILED');
  });
});