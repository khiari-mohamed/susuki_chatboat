import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaCrudService } from './crud.service';

function make(model: string) {
  const delegate = {
    create: jest.fn(async (args: any) => ({ id: 1, ...args.data })),
    update: jest.fn(async (args: any) => ({ id: 1, ...args.data })),
    delete: jest.fn(async () => ({ id: 1 })),
    deleteMany: jest.fn(async () => ({ count: 1 })),
    findUnique: jest.fn(async () => ({ id: 1 })),
    findFirst: jest.fn(async () => null),
    findMany: jest.fn(async () => []),
    count: jest.fn(async () => 0),
  };
  return { delegate, service: new PrismaCrudService({ [model]: delegate } as any, model) };
}

afterEach(() => {
  delete process.env.ERP_READ_ONLY;
});

describe('PrismaCrudService: ERP is the only writer', () => {
  it('refuses every write on an ERP-sourced table by default', async () => {
    const { service, delegate } = make('part');
    await expect(service.create({ reference: 'X' })).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.update(1, { unite: 'PCS' })).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.remove(1)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.bulkDelete([1])).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.bulkUpsert([{ reference: 'X' }], 'reference')).rejects.toBeInstanceOf(ForbiddenException);
    for (const method of [delegate.create, delegate.update, delegate.delete, delegate.deleteMany]) {
      expect(method).not.toHaveBeenCalled();
    }
    expect(service.isReadOnly).toBe(true);
  });

  it('keeps ERP tables read-only even when ERP_READ_ONLY=false is set', async () => {
    process.env.ERP_READ_ONLY = 'false';
    const { service, delegate } = make('part');
    await expect(service.create({ reference: 'X' })).rejects.toBeInstanceOf(ForbiddenException);
    expect(delegate.create).not.toHaveBeenCalled();
  });

  it('never blocks tables that are not ERP-sourced', async () => {
    const { service, delegate } = make('synonym');
    await service.create({ mot: 'a', canonical: 'b' });
    expect(delegate.create).toHaveBeenCalledTimes(1);
    expect(service.isErpSourced).toBe(false);
  });

  it('still lets ERP tables be read', async () => {
    const { service } = make('stock');
    await expect(service.list({ page: 1, pageSize: 10 })).resolves.toMatchObject({ total: 0 });
  });
});

describe('PrismaCrudService: input checks', () => {
  it('ignores an unknown sort field instead of failing', async () => {
    const { service, delegate } = make('synonym');
    await service.list({ page: 1, pageSize: 10, sortBy: 'drop_table' });
    expect((delegate.findMany.mock.calls[0][0] as any).orderBy).toEqual({ id: 'desc' });
  });

  it('only searches String columns', async () => {
    const { service, delegate } = make('synonym');
    await service.list({ page: 1, pageSize: 10, search: 'x', searchFields: ['mot', 'id'] });
    const where = (delegate.findMany.mock.calls[0][0] as any).where;
    expect(where.AND[0].OR).toHaveLength(1);
  });

  it('rejects malformed bulk requests', async () => {
    const { service } = make('synonym');
    await expect(service.bulkDelete([] as number[])).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.bulkUpsert([{ mot: 'a' }], 'id')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.bulkUpsert([{ nope: 1 }], 'mot')).rejects.toBeInstanceOf(BadRequestException);
  });
});