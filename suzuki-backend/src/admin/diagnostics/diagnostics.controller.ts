import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DiagnosticsService } from './diagnostics.service';

@Controller('admin/diagnostics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class DiagnosticsController {
  constructor(private readonly diagnostics: DiagnosticsService) {}

  @Get('overview')
  overview() {
    return this.diagnostics.getOverview();
  }

  @Get('integrity')
  integrity() {
    return this.diagnostics.getIntegrityChecks();
  }

  @Get('columns/:table')
  columns(@Param('table') table: string) {
    return this.diagnostics.getColumnProfile(table);
  }
}