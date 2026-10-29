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
import { SearchLogService, normalizeVin } from '../../services/search-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

const MAX_STATS_DAYS = 365;

@Controller('admin/search-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class SearchLogsController {
  constructor(private readonly searchLog: SearchLogService) {}

  // GET /admin/search-logs?vin=VF1XXXXXXXXXXXXXX&limit=50&before=2026-09-30T00:00:00Z
  @Get()
  async byVin(
    @Query('vin') vin?: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const normalizedVin = normalizeVin(vin);
    if (!normalizedVin) {
      throw new BadRequestException('Query param "vin" is required (5 to 25 letters or digits)');
    }
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;

    let beforeDate: Date | undefined;
    if (before) {
      beforeDate = new Date(before);
      if (Number.isNaN(beforeDate.getTime())) {
        throw new BadRequestException('Query param "before" must be an ISO date');
      }
    }

    const entries = await this.searchLog.findByVin({
      vin: normalizedVin,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
      before: beforeDate,
    });
    return { vin: normalizedVin, count: entries.length, entries };
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

  // GET /admin/search-logs/redirect-stats?days=30
  // How often, and why, answers were redirected to the Comptoir PR.
  @Get('redirect-stats')
  async redirectStats(@Query('days') days?: string) {
    const parsed = days ? parseInt(days, 10) : undefined;
    const bounded = Number.isFinite(parsed) ? Math.min(Math.max(parsed as number, 1), MAX_STATS_DAYS) : undefined;
    return this.searchLog.countRedirectReasons(bounded);
  }
}