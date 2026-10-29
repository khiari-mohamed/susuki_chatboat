import { Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../admin/auth/jwt-auth.guard';
import { RolesGuard } from '../admin/auth/roles.guard';
import { Roles } from '../admin/auth/roles.decorator';
import { ErpSyncService } from './erp-sync.service';

@Controller('admin/sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SyncController {
  constructor(private readonly sync: ErpSyncService) {}

  /** "Synchroniser maintenant": starts the run and returns at once; poll GET /admin/sync/status. */
  @Post()
  @Roles('ADMIN')
  run() {
    const result = this.sync.requestManualSync();
    if (result.accepted) return { started: true };
    throw new HttpException(
      result.reason === 'ALREADY_RUNNING' ? 'Une synchronisation est déjà en cours' : "Source ERP non configurée",
      result.reason === 'ALREADY_RUNNING' ? HttpStatus.CONFLICT : HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  @Get('status')
  @Roles('ADMIN', 'EDITOR')
  status() {
    return this.sync.getStatus();
  }
}