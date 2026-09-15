import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PrismaCrudService, ListResult } from './crud.service';
import { AdminQueryDto } from './admin-query.dto';
import { AdminGateway } from '../gateway/admin.gateway';
import { Roles } from '../auth/roles.decorator';

/**
 * Every concrete admin entity controller (parts, stock, fitments, ...)
 * extends this. It supplies list/get/delete + realtime broadcasting for
 * free; each subclass only has to declare `tableName`, `searchFields`,
 * and its own `create`/`update` methods typed with the entity's DTO
 * (needed so class-validator actually knows which class to validate
 * against — see admin/common/crud.service.ts for why).
 */
export abstract class AdminCrudController<T = Record<string, unknown>> {
  /** Websocket channel name, e.g. 'parts', 'stock', 'fitments'. */
  protected abstract readonly tableName: string;
  /** Fields matched by the `search` query param (case-insensitive contains). */
  protected abstract readonly searchFields: string[];

  constructor(
    protected readonly service: PrismaCrudService<T>,
    protected readonly gateway: AdminGateway,
  ) {}

  @Get()
  @Roles('ADMIN', 'EDITOR')
  list(@Query() query: AdminQueryDto): Promise<ListResult<T>> {
    return this.service.list({
      page: query.page,
      pageSize: query.pageSize,
      sortBy: query.sortBy,
      sortDir: query.sortDir,
      search: query.search,
      searchFields: this.searchFields,
    });
  }

  @Get(':id')
  @Roles('ADMIN', 'EDITOR')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<T> {
    return this.service.findById(id);
  }

  // Deletion is ADMIN-only — an EDITOR can add/correct catalog data but
  // can't remove rows outright (matches how the CarPro team works today).
  @Delete()
  @Roles('ADMIN')
  async bulkDelete(@Body() body: { ids: number[] }): Promise<{ count: number }> {
    const result = await this.service.bulkDelete(body.ids);
    this.gateway.broadcast(this.tableName, 'bulk-deleted', { ids: body.ids });
    return result;
  }

  @Post('bulk-upsert')
  @Roles('ADMIN', 'EDITOR')
  async bulkUpsert(@Body() body: { rows: object[]; uniqueKey: string }): Promise<{ created: number; updated: number }> {
    const result = await this.service.bulkUpsert(body.rows, body.uniqueKey);
    this.gateway.broadcast(this.tableName, 'bulk-upserted', {});
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<T> {
    const record = await this.service.remove(id);
    this.gateway.broadcast(this.tableName, 'deleted', record);
    return record;
  }

  protected async createAndBroadcast(data: object): Promise<T> {
    const record = await this.service.create(data);
    this.gateway.broadcast(this.tableName, 'created', record);
    return record;
  }

  protected async updateAndBroadcast(id: number, data: object): Promise<T> {
    const record = await this.service.update(id, data);
    this.gateway.broadcast(this.tableName, 'updated', record);
    return record;
  }
}
