import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminQueryDto } from '../common/admin-query.dto';
import { ExplorerService } from './explorer.service';

// Read-only, full-column view of every table in the database — no
// create/update/delete here on purpose. It's meant for "let me see the
// raw data exactly like it is in Postgres", not for editing; editing
// the 8 catalog tables already has its own dedicated, validated CRUD
// under /admin/parts, /admin/stock, etc.
@Controller('admin/explorer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class ExplorerController {
  constructor(private readonly explorer: ExplorerService) {}

  // Declared before ':table' so a request for the literal path
  // /admin/explorer/tables can't be swallowed by the :table param route.
  @Get('tables')
  listTables() {
    return this.explorer.listTables();
  }

  @Get('all')
  listAll(@Query() query: AdminQueryDto) {
    return this.explorer.listAll({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      sortBy: query.sortBy,
      sortDir: query.sortDir,
    });
  }

  @Get(':table')
  list(@Param('table') table: string, @Query() query: AdminQueryDto) {
    return this.explorer.list(table, {
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      sortBy: query.sortBy,
      sortDir: query.sortDir,
    });
  }
}