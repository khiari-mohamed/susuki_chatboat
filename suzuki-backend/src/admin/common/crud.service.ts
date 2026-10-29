import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ERP_READ_ONLY_MESSAGE, ERP_SOURCED_MODELS, isErpReadOnly } from './erp-sourced';

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

const MAX_PAGE_SIZE = 500;
const DEFAULT_PAGE_SIZE = 25;
const MAX_BULK_DELETE = 1000;
const MAX_BULK_UPSERT = 5000;

/**
 * Generic wrapper around one Prisma delegate. Input shape is validated one
 * layer up by each entity's DTO; this layer additionally
 *  - refuses every write on ERP-sourced tables while ERP_READ_ONLY is on,
 *  - checks field names (sort, search, bulk keys) against the Prisma schema.
 */
export class PrismaCrudService<T = Record<string, unknown>> {
  /** column name → Prisma scalar type ('String', 'Int', ...). */
  private readonly fieldTypes: Map<string, string>;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
    protected readonly include?: Record<string, unknown>,
  ) {
    const model = Prisma.dmmf.datamodel.models.find((m) => m.name.toLowerCase() === modelName.toLowerCase());
    if (!model) throw new Error(`PrismaCrudService: unknown Prisma model "${modelName}"`);
    this.fieldTypes = new Map(
      model.fields.filter((f) => f.kind === 'scalar' || f.kind === 'enum').map((f) => [f.name, f.type]),
    );
  }

  protected get delegate(): any {
    return (this.prisma as any)[this.modelName];
  }

  get isErpSourced(): boolean {
    return ERP_SOURCED_MODELS.has(this.modelName);
  }

  /** True when writes are currently refused. */
  get isReadOnly(): boolean {
    return this.isErpSourced && isErpReadOnly();
  }

  private assertWritable(): void {
    if (this.isReadOnly) throw new ForbiddenException(ERP_READ_ONLY_MESSAGE);
  }

  async list(params: ListParams): Promise<ListResult<T>> {
    const { sortBy, sortDir, search, searchFields, where = {} } = params;
    const page = Math.max(1, Math.trunc(Number(params.page)) || 1);
    const pageSize = Math.min(Math.max(Math.trunc(Number(params.pageSize)) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);

    // `contains` only works on String columns.
    const textFields = (searchFields ?? []).filter((field) => this.fieldTypes.get(field) === 'String');
    const searchClause =
      search && textFields.length > 0
        ? { OR: textFields.map((field) => ({ [field]: { contains: search, mode: 'insensitive' as const } })) }
        : {};

    const clauses = [where, searchClause].filter((clause) => Object.keys(clause).length > 0);
    const finalWhere = clauses.length > 0 ? { AND: clauses } : {};
    const orderBy = sortBy && this.fieldTypes.has(sortBy) ? { [sortBy]: sortDir === 'desc' ? 'desc' : 'asc' } : { id: 'desc' };

    const [data, total] = await Promise.all([
      this.delegate.findMany({
        where: finalWhere,
        include: this.include,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.delegate.count({ where: finalWhere }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  async findById(id: number): Promise<T> {
    const record = await this.delegate.findUnique({ where: { id }, include: this.include });
    if (!record) throw new NotFoundException(`${this.modelName} #${id} introuvable`);
    return record;
  }

  async create(data: object): Promise<T> {
    this.assertWritable();
    return this.delegate.create({ data, include: this.include });
  }

  async update(id: number, data: object): Promise<T> {
    this.assertWritable();
    await this.findById(id); // 404 early, with a clear message, instead of Prisma's raw P2025
    return this.delegate.update({ where: { id }, data, include: this.include });
  }

  async bulkDelete(ids: number[]): Promise<{ count: number }> {
    this.assertWritable();
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_BULK_DELETE || !ids.every(Number.isInteger)) {
      throw new BadRequestException(`"ids" doit être un tableau de 1 à ${MAX_BULK_DELETE} entiers`);
    }
    const result = await this.delegate.deleteMany({ where: { id: { in: ids } } });
    return { count: result.count };
  }

  async bulkUpsert(
    rows: object[],
    uniqueKey: string,
  ): Promise<{ created: number; updated: number; skipped: number }> {
    this.assertWritable();
    if (!Array.isArray(rows) || rows.length === 0 || rows.length > MAX_BULK_UPSERT) {
      throw new BadRequestException(`"rows" doit contenir entre 1 et ${MAX_BULK_UPSERT} lignes`);
    }
    if (typeof uniqueKey !== 'string' || uniqueKey === 'id' || !this.fieldTypes.has(uniqueKey)) {
      throw new BadRequestException(`"uniqueKey" invalide pour ${this.modelName}`);
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    for (const raw of rows) {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new BadRequestException('Chaque ligne doit être un objet');
      const { id: _ignored, ...row } = raw as Record<string, unknown>;
      const unknown = Object.keys(row).filter((key) => !this.fieldTypes.has(key));
      if (unknown.length > 0) throw new BadRequestException(`Colonnes inconnues : ${unknown.join(', ')}`);

      const key = row[uniqueKey];
      if (key === undefined || key === null || key === '') {
        skipped++;
        continue;
      }
      const existing = await this.delegate.findFirst({ where: { [uniqueKey]: key } });
      if (existing) {
        await this.delegate.update({ where: { id: existing.id }, data: row });
        updated++;
      } else {
        await this.delegate.create({ data: row });
        created++;
      }
    }
    return { created, updated, skipped };
  }

  async remove(id: number): Promise<T> {
    this.assertWritable();
    await this.findById(id);
    return this.delegate.delete({ where: { id } });
  }
}