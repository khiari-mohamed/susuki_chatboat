// src/admin/search-logs/search-logs.controller.ts
// ═══════════════════════════════════════════════════════════════════
// BUSINESS RULE (email CarPro 2026-09-25 — "Historique des recherches
// et accès aux logs"): "lorsqu'un client se présente dans nos locaux
// ou nous contacte afin d'avoir un complément d'information sur une
// recherche déjà effectuée, notre équipe pourra consulter l'historique
// de sa discussion à partir du VIN." — this is that lookup.
// Read-only, admin-authenticated (JwtAuthGuard + RolesGuard), same
// pattern as admin/stats/stats.controller.ts.
// ═══════════════════════════════════════════════════════════════════

import { Controller, Get, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { SearchLogService } from '../../services/search-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/search-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class SearchLogsController {
  constructor(private readonly searchLog: SearchLogService) {}

  // GET /admin/search-logs?vin=VF1XXXXXXXXXXXXXX&limit=50
  @Get()
  async byVin(@Query('vin') vin?: string, @Query('limit') limit?: string) {
    if (!vin || !vin.trim()) {
      throw new BadRequestException('Query param "vin" is required');
    }
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const entries = await this.searchLog.findByVin({
      vin,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
    });
    return { vin: vin.trim().toUpperCase(), count: entries.length, entries };
  }

  // GET /admin/search-logs/by-session?sessionId=...
  @Get('by-session')
  async bySession(@Query('sessionId') sessionId?: string) {
    if (!sessionId || !sessionId.trim()) {
      throw new BadRequestException('Query param "sessionId" is required');
    }
    const entries = await this.searchLog.findBySession(sessionId.trim());
    return { sessionId, count: entries.length, entries };
  }
}