import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../admin/auth/jwt-auth.guard';
import { RolesGuard } from '../admin/auth/roles.guard';
import { Roles } from '../admin/auth/roles.decorator';
import { ErpSyncService } from './erp-sync.service';

@Controller('admin/sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SyncController {
  constructor(private readonly sync: ErpSyncService) {}

  /**
   * "Synchroniser maintenant": starts the run and returns at once; poll GET /admin/sync/status.
   * Body `{ "full": true }` re-reads everything instead of only what changed since the last success.
   */
  @Post()
  @Roles('ADMIN')
  run(@Body() body?: { full?: boolean }) {
    const result = this.sync.requestManualSync({ full: body?.full === true });
    if (result.accepted) return { started: true };
    throw new HttpException(
      result.reason === 'ALREADY_RUNNING' ? 'Une synchronisation est déjà en cours' : 'Source ERP non configurée',
      result.reason === 'ALREADY_RUNNING' ? HttpStatus.CONFLICT : HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  @Get('status')
  @Roles('ADMIN', 'EDITOR')
  status() {
    return this.sync.getStatus();
  }

  /** Calls the relay's /health: is the ERP reachable right now? */
  @Get('health')
  @Roles('ADMIN', 'EDITOR')
  health() {
    return this.sync.getHealth();
  }

  @Get('runs')
  @Roles('ADMIN', 'EDITOR')
  runs(@Query('limit') limit?: string) {
    const n = Math.min(Math.max(parseInt(limit ?? '20', 10) || 20, 1), 50);
    return this.sync.listRuns(n);
  }
}