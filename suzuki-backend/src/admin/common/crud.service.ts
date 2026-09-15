import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ListParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  searchFields?: string[];
  /** Extra static filter merged with the search clause (e.g. scoping by FK). */
  where?: Record<string, unknown>;
}

export interface ListResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Thin generic wrapper around a single Prisma delegate (prisma.part,
 * prisma.stock, ...), giving every admin entity the same list/get/
 * create/update/delete behaviour without duplicating the same 60 lines
 * 8 times.
 *
 * Trade-off, by design: this layer is intentionally loosely typed
 * (delegate methods take `Record<string, unknown>`) because Prisma's
 * per-model input types aren't easily unified across models. Type
 * safety for *input* is enforced one layer up, at the controller
 * boundary, by each entity's class-validator DTO (CreatePartDto,
 * UpdatePartDto, ...) — that's where malformed data actually gets
 * rejected, before it ever reaches this service.
 */
export class PrismaCrudService<T = Record<string, unknown>> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
    protected readonly include?: Record<string, unknown>,
  ) {}

  protected get delegate(): any {
    return (this.prisma as any)[this.modelName];
  }

  async list(params: ListParams): Promise<ListResult<T>> {
    const { page, pageSize, sortBy, sortDir, search, searchFields, where = {} } = params;

    const searchClause =
      search && searchFields && searchFields.length > 0
        ? {
            OR: searchFields.map((field) => ({
              [field]: { contains: search, mode: 'insensitive' as const },
            })),
          }
        : {};

    const clauses = [where, searchClause].filter((clause) => Object.keys(clause).length > 0);
    const finalWhere = clauses.length > 0 ? { AND: clauses } : {};

    const [data, total] = await Promise.all([
      this.delegate.findMany({
        where: finalWhere,
        include: this.include,
        orderBy: sortBy ? { [sortBy]: sortDir ?? 'asc' } : { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.delegate.count({ where: finalWhere }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  async findById(id: number): Promise<T> {
    const record = await this.delegate.findUnique({ where: { id }, include: this.include });
    if (!record) throw new NotFoundException(`${this.modelName} #${id} introuvable`);
    return record;
  }

  async create(data: object): Promise<T> {
    return this.delegate.create({ data, include: this.include });
  }

  async update(id: number, data: object): Promise<T> {
    await this.findById(id); // 404 early, with a clear message, instead of Prisma's raw P2025
    return this.delegate.update({ where: { id }, data, include: this.include });
  }

  async bulkDelete(ids: number[]): Promise<{ count: number }> {
    const result = await this.delegate.deleteMany({ where: { id: { in: ids } } });
    return { count: result.count };
  }

  async bulkUpsert(rows: object[], uniqueKey: string): Promise<{ created: number; updated: number }> {
    let created = 0, updated = 0;
    for (const row of rows) {
      const key = (row as any)[uniqueKey];
      if (!key) continue;
      const existing = await this.delegate.findFirst({ where: { [uniqueKey]: key } });
      if (existing) {
        await this.delegate.update({ where: { id: existing.id }, data: row });
        updated++;
      } else {
        await this.delegate.create({ data: row });
        created++;
      }
    }
    return { created, updated };
  }

  async remove(id: number): Promise<T> {
    await this.findById(id);
    return this.delegate.delete({ where: { id } });
  }
}
