import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaCrudService, ListResult } from './crud.service';
import { AdminQueryDto } from './admin-query.dto';
import { AdminGateway } from '../gateway/admin.gateway';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

/**
 * Base for ERP-sourced tables (parts, stock, fitments, vehicles, ...): list / get / meta ONLY.
 * No write route exists on these controllers, so the chatbot database stays read-only
 * (ERP → chatbot, one way). PrismaCrudService still refuses writes as a second barrier.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
export abstract class AdminReadOnlyController<T = Record<string, unknown>> {
  /** Websocket channel name, e.g. 'parts', 'stock', 'fitments'. */
  protected abstract readonly tableName: string;
  /** Fields matched by the `search` query param (case-insensitive contains). */
  protected abstract readonly searchFields: string[];

  constructor(
    protected readonly service: PrismaCrudService<T>,
    protected readonly gateway: AdminGateway,
  ) {}

  /** Lets the dashboard hide edit buttons on ERP-sourced tables. Declared before ':id'. */
  @Get('meta')
  @Roles('ADMIN', 'EDITOR')
  meta(): { table: string; erpSourced: boolean; readOnly: boolean } {
    return { table: this.tableName, erpSourced: this.service.isErpSourced, readOnly: this.service.isReadOnly };
  }

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
}

/**
 * Base for chatbot-owned tables that humans may edit (synonyms): adds delete + realtime
 * broadcasting. Each subclass declares its own `create`/`update` methods typed with its DTO.
 * Authentication lives HERE, so no subclass can forget it.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
export abstract class AdminCrudController<T = Record<string, unknown>> extends AdminReadOnlyController<T> {
  // Deletion is ADMIN-only: an EDITOR can add/correct data but not remove rows.
  @Delete()
  @Roles('ADMIN')
  async bulkDelete(@Body() body: { ids: number[] }): Promise<{ count: number }> {
    const result = await this.service.bulkDelete(body?.ids);
    this.gateway.broadcast(this.tableName, 'bulk-deleted', { ids: body.ids });
    return result;
  }

  @Post('bulk-upsert')
  @Roles('ADMIN', 'EDITOR')
  async bulkUpsert(
    @Body() body: { rows: object[]; uniqueKey: string },
  ): Promise<{ created: number; updated: number; skipped: number }> {
    const result = await this.service.bulkUpsert(body?.rows, body?.uniqueKey);
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