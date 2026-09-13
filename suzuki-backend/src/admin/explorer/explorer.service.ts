import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EXPLORER_TABLES, ExplorerColumn, ExplorerTable } from './table-manifest';

export interface ExplorerListParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

@Injectable()
export class ExplorerService {
  constructor(private readonly prisma: PrismaService) {}

  listTables() {
    return [
      { key: 'all', label: 'toutes les tables', columns: [] },
      ...EXPLORER_TABLES.map(({ key, label, columns }) => ({ key, label, columns })),
    ];
  }

  async listAll(params: ExplorerListParams) {
    const { page, pageSize, search, sortBy, sortDir } = params;
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
    return {
      table: { key: 'all', label: 'toutes les tables', columns },
      data,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
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

    return {
      table: { key: table.key, label: table.label, columns: table.columns },
      data,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }
}