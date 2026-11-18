import { Injectable, Logger } from '@nestjs/common';
import type { ErpEntity, ErpRow, ErpSource } from './erp-source';

type Dto = Record<string, unknown>;
interface PageBody {
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  data?: Dto[] | null;
}
interface Endpoint {
  path: string;
  incremental: boolean;
  map: (dto: Dto) => ErpRow;
}

const MAX_ATTEMPTS = 3;
const MAX_PAGES = 10_000;
/** Covers clock drift between this server and the relay when using updatedSince. */
const DELTA_MARGIN_MS = 5 * 60_000;

const text = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
/** DB convention (schema note on vehicle_type_master): hyphens. fitment holds 16 044 rows, all hyphenated. */
const typeCode = (v: unknown): string | null => text(v)?.replace(/\s+/g, '-') ?? null;
/**
 * vehicles.type_code convention: no separator before the number, e.g. AVH310-TYPE2.
 * The ERP writes "AVH310-TYPE 2"; type master, fitment and model map keep "AVH310-TYPE-2".
 */
const vehicleTypeCode = (v: unknown): string | null => typeCode(v)?.replace(/-TYPE-(\d)/i, '-TYPE$1') ?? null;
const withTombstone = (row: ErpRow, dto: Dto): ErpRow => (dto.deleted === true ? { ...row, _deleted: true } : row);

const ENDPOINTS: Record<ErpEntity, Endpoint> = {
  vehicleTypeMaster: {
    path: '/api/chatbot/vehicle-types',
    incremental: false,
    map: (d) => ({ typeCode: typeCode(d.typeCode), modelName: text(d.modelName) }),
  },
  vehicleModelMap: {
    path: '/api/chatbot/vehicle-models',
    incremental: false,
    map: (d) => ({ modele: text(d.modele), typeCode: typeCode(d.typeCode) }),
  },
  vehicle: {
    path: '/api/chatbot/vehicles',
    incremental: true,
    map: (d) =>
      withTombstone(
        {
          vehicleNo: text(d.vehicleNo),
          vin: text(d.vin),
          marque: text(d.marque),
          modele: text(d.modele),
          modeleDescription: text(d.modeleDescription),
          typeCode: vehicleTypeCode(d.typeCode),
          immatriculation: text(d.immatriculation),
        },
        d,
      ),
  },
  part: {
    path: '/api/chatbot/parts',
    incremental: true,
    map: (d) => {
      const designation = text(d.designation);
      const designation2 = text(d.designation2);
      return {
        reference: text(d.reference),
        designation,
        designation2,
        // Chatbot-owned after creation (the sync never overwrites it); backfilled at creation per the schema rule.
        searchDescription: (text(d.searchDescription) ?? designation2 ?? designation)?.slice(0, 200) ?? null,
        prixHt: num(d.prixHt),
        prixTtc: num(d.prixTtc),
        prixPublic: num(d.prixPublic),
        unite: text(d.unite),
        categorie: text(d.categorie),
        fabricant: text(d.fabricant),
        fournisseurCode: text(d.fournisseurCode),
        source: text(d.source),
      };
    },
  },
  stock: {
    path: '/api/chatbot/stock',
    incremental: true,
    map: (d) => {
      const row: ErpRow = {
        reference: text(d.reference),
        // null = unknown. The sync rejects it; it must never become 0.
        stockConsolide: num(d.stockConsolide),
      };
      // Absent quantities are left out so they neither default to 0 on update nor overwrite.
      const total = num(d.totalQuantity);
      const disponible = num(d.stockDisponible);
      if (total !== null) row.totalQuantity = total;
      if (disponible !== null) row.stockDisponible = disponible;
      return withTombstone(row, d);
    },
  },
  fitment: {
    path: '/api/chatbot/fitments',
    incremental: false,
    // modelName is a redundant NOT NULL copy (see schema): never block a fitment on it.
    map: (d) => ({ partReference: text(d.partReference), typeCode: typeCode(d.typeCode), modelName: text(d.modelName) ?? '' }),
  },
  itemReference: {
    path: '/api/chatbot/item-references',
    incremental: false,
    map: (d) => ({
      partReference: text(d.partReference),
      referenceNo: text(d.referenceNo),
      referenceType: d.referenceType === null || d.referenceType === undefined ? null : String(d.referenceType),
    }),
  },
};

class RelayHttpError extends Error {
  constructor(message: string, readonly retriable: boolean) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const envInt = (name: string, fallback: number, min = 1): number => {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n >= min ? n : fallback;
};

/**
 * ERP → chatbot through the .NET relay (Business Central SOAP behind REST).
 * GET only. Env: ERP_RELAY_URL, ERP_RELAY_API_KEY, ERP_RELAY_PAGE_SIZE (500),
 * ERP_RELAY_TIMEOUT_MS (120000), ERP_RELAY_RETRY_DELAY_MS (2000).
 */
@Injectable()
export class RelayErpSource implements ErpSource {
  readonly name = 'relay';
  private readonly logger = new Logger(RelayErpSource.name);

  isConfigured(): boolean {
    return !!process.env.ERP_RELAY_URL?.trim() && !!process.env.ERP_RELAY_API_KEY?.trim();
  }

  supportsIncremental(entity: ErpEntity): boolean {
    return ENDPOINTS[entity].incremental;
  }

  async health(): Promise<{ reachable: boolean; detail?: string }> {
    if (!this.isConfigured()) return { reachable: false, detail: 'ERP_RELAY_URL / ERP_RELAY_API_KEY not set' };
    try {
      const res = await globalThis.fetch(new URL('/api/chatbot/health', this.baseUrl()), {
        headers: this.headers(),
        signal: AbortSignal.timeout(5000),
      });
      const body = (await res.json()) as Record<string, unknown>;
      return { reachable: res.ok && String(body.erpReachable) === 'true', detail: String(body.status ?? res.status) };
    } catch (e: any) {
      return { reachable: false, detail: e?.message ?? 'unreachable' };
    }
  }

  async *fetch(entity: ErpEntity, since: Date | null): AsyncGenerator<ErpRow[]> {
    const endpoint = ENDPOINTS[entity];
    const query: Record<string, string | number> = { pageSize: envInt('ERP_RELAY_PAGE_SIZE', 500) };
    if (since && endpoint.incremental) {
      query.updatedSince = new Date(since.getTime() - DELTA_MARGIN_MS).toISOString();
    }

    const stockSeen = new Map<string, unknown>();
    let received = 0;
    for (let page = 1; page <= MAX_PAGES; page++) {
      const body = await this.getPage(endpoint.path, { ...query, page });
      const data = body.data ?? [];
      if (!Array.isArray(data) || !Number.isInteger(body.totalRecords)) {
        throw new Error(`ERP relay ${endpoint.path}: unexpected response shape`);
      }
      const total = body.totalRecords as number;
      received += data.length;
      if (data.length > 0) {
        const rows = data.map((dto) => endpoint.map(dto));
        if (entity === 'stock') this.flagStockConflicts(rows, stockSeen);
        yield rows;
      }
      if (received >= total) return;
      if (data.length === 0) {
        throw new Error(`ERP relay ${endpoint.path}: page ${page} is empty but only ${received}/${total} rows were received`);
      }
    }
    throw new Error(`ERP relay ${endpoint.path}: more than ${MAX_PAGES} pages`);
  }

  /** One row per reference is expected. Divergent duplicates (per-warehouse rows?) are rejected, not guessed. */
  private flagStockConflicts(rows: ErpRow[], seen: Map<string, unknown>): void {
    for (const row of rows) {
      const reference = row.reference as string | null;
      if (!reference) continue;
      if (seen.has(reference) && seen.get(reference) !== row.stockConsolide) {
        this.logger.error(`[ERP] stock ${reference}: several rows with different stockConsolide`);
        row.stockConsolide = null; // → invalid in the sync → run ends PARTIAL
      } else {
        seen.set(reference, row.stockConsolide);
      }
    }
  }

  private baseUrl(): string {
    return process.env.ERP_RELAY_URL!.trim();
  }

  private headers(): Record<string, string> {
    return { 'X-Api-Key': process.env.ERP_RELAY_API_KEY!.trim(), Accept: 'application/json' };
  }

  private async getPage(path: string, query: Record<string, string | number>): Promise<PageBody> {
    const url = new URL(path, this.baseUrl());
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));

    let lastError: Error = new Error('unreachable');
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await globalThis.fetch(url, {
          headers: this.headers(),
          signal: AbortSignal.timeout(envInt('ERP_RELAY_TIMEOUT_MS', 120_000)),
        });
        if (res.ok) return (await res.json()) as PageBody;
        throw new RelayHttpError(`ERP relay ${path} answered HTTP ${res.status}`, res.status >= 500 || res.status === 429);
      } catch (e: any) {
        lastError = e;
        if (e instanceof RelayHttpError && !e.retriable) throw e;
        if (attempt < MAX_ATTEMPTS) {
          this.logger.warn(`[ERP] ${path} attempt ${attempt} failed: ${e?.message}`);
          await sleep(envInt('ERP_RELAY_RETRY_DELAY_MS', 2000, 0) * attempt);
        }
      }
    }
    throw lastError;
  }
}