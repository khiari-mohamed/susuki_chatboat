import { Injectable, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EXPLORER_TABLES, ExplorerColumn, ExplorerTable } from './table-manifest';

const TTL = 300; // 5 minutes

export interface ExplorerListParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

@Injectable()
export class ExplorerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  listTables() {
    return [
      { key: 'all', label: 'toutes les tables', columns: [] },
      ...EXPLORER_TABLES.map(({ key, label, columns }) => ({ key, label, columns })),
    ];
  }

  async listAll(params: ExplorerListParams) {
    const { page, pageSize, search, sortBy, sortDir } = params;
    const cacheKey = `explorer:all:${page}:${pageSize}:${search ?? ''}:${sortBy ?? ''}:${sortDir ?? ''}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    const columns: ExplorerColumn[] = [
      { key: '_table', type: 'string' },
      ...EXPLORER_TABLES.flatMap((table) =>
        table.columns.map((column) => ({
          key: `${table.key}.${column.key}`,
          type: column.type,
        })),
      ),
    ];

    const tableRows = await Promise.all(
      EXPLORER_TABLES.map(async (table) => {
        const delegate = (this.prisma as any)[table.prismaModel];
        const data = await delegate.findMany({ orderBy: { id: 'desc' } });
        return data.map((row: Record<string, unknown>) => {
          const combined: Record<string, unknown> = {
            _rowKey: `${table.key}:${String(row.id)}`,
            _table: table.label,
          };
          for (const column of table.columns) {
            combined[`${table.key}.${column.key}`] = row[column.key];
          }
          return combined;
        });
      }),
    );

    let rows = tableRows.flat();
    if (search) {
      const searchText = search.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(searchText)),
      );
    }

    if (sortBy && columns.some((column) => column.key === sortBy)) {
      const direction = sortDir === 'desc' ? -1 : 1;
      rows.sort((left, right) => String(left[sortBy] ?? '').localeCompare(String(right[sortBy] ?? '')) * direction);
    }

    const total = rows.length;
    const data = rows.slice((page - 1) * pageSize, page * pageSize);
    const result = { table: { key: 'all', label: 'toutes les tables', columns }, data, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
    await this.cache.set(cacheKey, result, TTL);
    return result;
  }

  private streamJson(res: Response, columns: ExplorerColumn[], rows: Record<string, unknown>[]) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.flushHeaders();
    res.write(`{"columns":${JSON.stringify(columns)},"total":${rows.length},"data":[`);
    for (let i = 0; i < rows.length; i++) {
      res.write((i > 0 ? ',' : '') + JSON.stringify(rows[i]));
    }
    res.end(']}');
  }

  async exportAll(res: Response, search?: string, limit?: number, offset = 0) {
    const cacheKey = `explorer:export:all:${search ?? ''}:${limit ?? 'all'}:${offset}`;
    const cached = await this.cache.get<{ columns: ExplorerColumn[]; data: Record<string, unknown>[]; total: number }>(cacheKey);
    if (cached) { this.streamJson(res, cached.columns, cached.data); return; }
    const columns: ExplorerColumn[] = [
      { key: '_table', type: 'string' },
      ...EXPLORER_TABLES.flatMap((t) => t.columns.map((c) => ({ key: `${t.key}.${c.key}`, type: c.type }))),
    ];
    const tableRows = await Promise.all(
      EXPLORER_TABLES.map(async (table) => {
        const delegate = (this.prisma as any)[table.prismaModel];
        // When a limit is set and no search, we can cap each table fetch early
        const take = !search && limit ? limit + offset : undefined;
        const data = await delegate.findMany({ orderBy: { id: 'desc' }, ...(take ? { take } : {}) });
        return data.map((row: Record<string, unknown>) => {
          const combined: Record<string, unknown> = { _table: table.label };
          for (const col of table.columns) combined[`${table.key}.${col.key}`] = row[col.key];
          return combined;
        });
      }),
    );
    let rows = tableRows.flat();
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q)));
    }
    const slice = limit ? rows.slice(offset, offset + limit) : rows;
    const result = { columns, data: slice, total: rows.length };
    await this.cache.set(cacheKey, result, TTL);
    this.streamJson(res, columns, slice);
  }

  async exportTable(key: string, res: Response, search?: string, limit?: number, offset = 0) {
    const cacheKey = `explorer:export:${key}:${search ?? ''}:${limit ?? 'all'}:${offset}`;
    const cached = await this.cache.get<{ columns: ExplorerColumn[]; data: Record<string, unknown>[]; total: number }>(cacheKey);
    if (cached) { this.streamJson(res, cached.columns, cached.data); return; }
    const table = this.getTable(key);
    const delegate = (this.prisma as any)[table.prismaModel];
    const stringFields = table.columns.filter((c) => c.type === 'string').map((c) => c.key);
    const where =
      search && stringFields.length > 0
        ? { OR: stringFields.map((f) => ({ [f]: { contains: search, mode: 'insensitive' as const } })) }
        : {};
    const [data, countTotal] = await Promise.all([
      delegate.findMany({ where, orderBy: { id: 'desc' }, ...(limit ? { take: limit, skip: offset } : {}) }),
      delegate.count({ where }),
    ]);
    const result = { columns: table.columns, data, total: countTotal };
    await this.cache.set(cacheKey, result, TTL);
    this.streamJson(res, table.columns, data);
  }

  async invalidate(tableKey?: string) {
    if (tableKey) {
      await Promise.all([
        this.cache.delPattern(`explorer:${tableKey}:*`),
        this.cache.delPattern('explorer:all:*'),
        this.cache.delPattern('explorer:export:all'),
        this.cache.delPattern(`explorer:export:${tableKey}`),
      ]);
    } else {
      await this.cache.delPattern('explorer:*');
    }
  }

  private getTable(key: string): ExplorerTable {
    const table = EXPLORER_TABLES.find((t) => t.key === key);
    if (!table) throw new NotFoundException(`Table inconnue : ${key}`);
    return table;
  }

  async list(key: string, params: ExplorerListParams) {
    const table = this.getTable(key);
    const delegate = (this.prisma as any)[table.prismaModel];
    const { page, pageSize, search, sortBy, sortDir } = params;
    const cacheKey = `explorer:${key}:${page}:${pageSize}:${search ?? ''}:${sortBy ?? ''}:${sortDir ?? ''}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Free-text search only ever targets string columns — filtering a
    // Decimal/DateTime/Json/Boolean field with `contains` would make
    // Prisma throw, so those columns are simply never search targets.
    const stringFields = table.columns.filter((c) => c.type === 'string').map((c) => c.key);
    const where =
      search && stringFields.length > 0
        ? { OR: stringFields.map((field) => ({ [field]: { contains: search, mode: 'insensitive' as const } })) }
        : {};

    // Only sort by a column that's actually declared on this table —
    // an unknown sortBy from the query string silently falls back to
    // the default instead of leaking a Prisma error.
    const validSort = !!sortBy && table.columns.some((c) => c.key === sortBy);

    const [data, total] = await Promise.all([
      delegate.findMany({
        where,
        orderBy: validSort ? { [sortBy as string]: sortDir ?? 'asc' } : { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      delegate.count({ where }),
    ]);

    const result = { table: { key: table.key, label: table.label, columns: table.columns }, data, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
    await this.cache.set(cacheKey, result, TTL);
    return result;
  }
}