import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RelayErpSource } from './relay-erp-source';

const realFetch = globalThis.fetch;
const fetchMock: any = jest.fn();

const reply = (body: unknown, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const page = (data: unknown[], totalRecords = data.length) => reply({ page: 1, pageSize: 500, totalRecords, data });

async function collect(iterable: AsyncIterable<any[]>) {
  const out: any[] = [];
  for await (const batch of iterable) out.push(...batch);
  return out;
}

beforeEach(() => {
  process.env.ERP_RELAY_URL = 'http://relay.test:4065';
  process.env.ERP_RELAY_API_KEY = 'secret-key';
  process.env.ERP_RELAY_RETRY_DELAY_MS = '0';
  fetchMock.mockReset();
  (globalThis as any).fetch = fetchMock;
});

afterEach(() => {
  (globalThis as any).fetch = realFetch;
  delete process.env.ERP_RELAY_URL;
  delete process.env.ERP_RELAY_API_KEY;
  delete process.env.ERP_RELAY_RETRY_DELAY_MS;
});

describe('RelayErpSource', () => {
  it('is configured only with a URL and an API key', () => {
    expect(new RelayErpSource().isConfigured()).toBe(true);
    delete process.env.ERP_RELAY_API_KEY;
    expect(new RelayErpSource().isConfigured()).toBe(false);
  });

  it('maps a part to the Prisma shape, drops relay-only fields and sends the API key', async () => {
    fetchMock.mockResolvedValueOnce(
      page([
        {
          id: 100045,
          reference: '5G0853601',
          designation: 'Pare-chocs avant',
          designation2: null,
          searchDescription: null,
          prixHt: 185.42,
          prixTtc: 222.5,
          prixPublic: 280,
          unite: 'PIECE',
          categorie: 'CARROSSERIE',
          fabricant: 'OEM VW',
          fournisseurCode: 'F-001',
          source: 'BC-ERP',
          createdAt: '2026-09-01T10:00:00Z',
          updatedAt: '2026-10-20T14:25:00Z',
        },
      ]),
    );

    const rows = await collect(new RelayErpSource().fetch('part', null));

    expect(rows).toEqual([
      {
        reference: '5G0853601',
        designation: 'Pare-chocs avant',
        designation2: null,
        searchDescription: 'Pare-chocs avant',
        prixHt: 185.42,
        prixTtc: 222.5,
        prixPublic: 280,
        unite: 'PIECE',
        categorie: 'CARROSSERIE',
        fabricant: 'OEM VW',
        fournisseurCode: 'F-001',
        source: 'BC-ERP',
      },
    ]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/chatbot/parts?');
    expect(init.headers['X-Api-Key']).toBe('secret-key');
  });

  it('sends updatedSince (with a 5 minute margin) only for entities that support it', async () => {
    fetchMock.mockResolvedValue(page([]));
    const since = new Date('2026-10-28T18:00:00Z');

    await collect(new RelayErpSource().fetch('part', since));
    await collect(new RelayErpSource().fetch('fitment', since));

    expect(String(fetchMock.mock.calls[0][0])).toContain('updatedSince=2026-10-28T17%3A55%3A00.000Z');
    expect(String(fetchMock.mock.calls[1][0])).not.toContain('updatedSince');
  });

  it('reads every page until totalRecords is reached', async () => {
    fetchMock
      .mockResolvedValueOnce(page([{ partReference: 'A', typeCode: 'T1' }, { partReference: 'B', typeCode: 'T1' }], 3))
      .mockResolvedValueOnce(page([{ partReference: 'C', typeCode: 'T1' }], 3));

    const rows = await collect(new RelayErpSource().fetch('fitment', null));

    expect(rows).toHaveLength(3);
    expect(String(fetchMock.mock.calls[1][0])).toContain('page=2');
  });

  it('throws when the relay stops returning rows before totalRecords', async () => {
    fetchMock.mockResolvedValueOnce(page([], 5));

    await expect(collect(new RelayErpSource().fetch('fitment', null))).rejects.toThrow(/empty/);
  });

  it('retries a 503 but not a 401', async () => {
    fetchMock.mockResolvedValueOnce(reply({}, 503)).mockResolvedValueOnce(page([]));
    await collect(new RelayErpSource().fetch('vehicleTypeMaster', null));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fetchMock.mockReset();
    fetchMock.mockResolvedValue(reply({}, 401));
    await expect(collect(new RelayErpSource().fetch('vehicleTypeMaster', null))).rejects.toThrow(/401/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('normalizes type codes and flags ERP soft-deletes', async () => {
    fetchMock.mockResolvedValueOnce(
      page([{ vehicleNo: 'V1', vin: 'VIN1', typeCode: 'AON312 TYPE1', deleted: true }, { vehicleNo: 'V2', deleted: false }]),
    );

    const rows = await collect(new RelayErpSource().fetch('vehicle', null));

    expect(rows[0]).toMatchObject({ vehicleNo: 'V1', typeCode: 'AON312-TYPE1', _deleted: true });
    expect(rows[1]).not.toHaveProperty('_deleted');
  });

  it('writes vehicle type codes like the vehicles table but keeps the hyphenated form for fitments', async () => {
    fetchMock
      .mockResolvedValueOnce(page([{ vehicleNo: 'V1', typeCode: 'AVH310-TYPE 2' }]))
      .mockResolvedValueOnce(page([{ partReference: 'P1', typeCode: 'AVH310-TYPE 2' }]));

    const vehicles = await collect(new RelayErpSource().fetch('vehicle', null));
    const fitments = await collect(new RelayErpSource().fetch('fitment', null));

    expect(vehicles[0].typeCode).toBe('AVH310-TYPE2');
    expect(fitments[0].typeCode).toBe('AVH310-TYPE-2');
  });

  it('keeps a missing consolidated stock as null and rejects divergent duplicates', async () => {
    fetchMock.mockResolvedValueOnce(
      page([
        { reference: 'R1', stockConsolide: 5, totalQuantity: 2 },
        { reference: 'R1', stockConsolide: 7 },
        { reference: 'R2' },
      ]),
    );

    const rows = await collect(new RelayErpSource().fetch('stock', null));

    expect(rows[0]).toEqual({ reference: 'R1', stockConsolide: 5, totalQuantity: 2 });
    expect(rows[1].stockConsolide).toBeNull();
    expect(rows[2].stockConsolide).toBeNull();
    expect(rows[2]).not.toHaveProperty('totalQuantity');
  });
});