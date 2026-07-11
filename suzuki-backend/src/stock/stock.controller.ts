// src/stock/stock.controller.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: GET /stock/:reference now returns the enriched shape:
//         { reference, statut, displayName, sourceLabel, categorie }
//         for the PUBLIC endpoint — quantity intentionally omitted
//         to preserve the "never expose raw quantities publicly" rule.
//
// FIX-2: GET /stock/:reference/detail — NEW internal endpoint that
//         returns the FULL StockStatusResult including totalQuantity,
//         designation, designation2, prixHt, prixTtc, and sourceLabel.
//         Tagged with a TODO guard note for production hardening.
//
// FIX-3: GET /stock/bulk — NEW endpoint for bulk status lookup used
//         by the frontend product list to batch-check availability
//         without N+1 requests. Accepts body { references: string[] }.
//         Returns the public shape (no quantity) for each reference.
//
// ALL BUSINESS LOGIC PRESERVED:
//   ✅ Disponible/Indisponible only on public endpoint
//   ✅ Raw quantities NEVER exposed on public GET /stock/:reference
//   ✅ Invalid reference guard (< 3 chars → 404)
//   ✅ TODO: API key guard before public deployment
// ═══════════════════════════════════════════════════════════════════

import {
  Controller, Get, Post, Param, Body,
  HttpCode, HttpStatus, NotFoundException, BadRequestException,
  Logger,
} from '@nestjs/common';
import { StockService } from './stock.service';

// ─────────────────────────────────────────────────────────────────
// Public response shape — quantity intentionally excluded
// ─────────────────────────────────────────────────────────────────
interface PublicStockResponse {
  reference:    string;
  statut:       string;       // 'Disponible' | 'Indisponible'
  // FIX-1: French name
  displayName:  string;
  sourceLabel:  string | null; // 'Suzuki OEM' | 'CarPro Parts'
  categorie:    string | null;
}

@Controller('stock')
export class StockController {
  private readonly logger = new Logger(StockController.name);

  constructor(private readonly stockService: StockService) {}

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: GET /stock/:reference — PUBLIC
  // Returns Disponible/Indisponible + French name.
  // Quantity intentionally NOT included (business rule preserved).
  // TODO: Protect with an API key guard before public deployment.
  // ─────────────────────────────────────────────────────────────────
  @Get(':reference')
  @HttpCode(HttpStatus.OK)
  async getStockStatus(
    @Param('reference') reference: string,
  ): Promise<PublicStockResponse> {
    if (!reference || reference.trim().length < 3) {
      throw new NotFoundException('Référence invalide.');
    }

    const result = await this.stockService.getStockStatus(
      reference.trim().toUpperCase(),
    );

    // FIX-1: Return enriched public shape — quantity excluded
    return {
      reference:   result.reference,
      statut:      result.statut,
      displayName: result.displayName,
      sourceLabel: result.sourceLabel,
      categorie:   result.categorie,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: GET /stock/:reference/detail — INTERNAL / ADMIN
  // Returns full StockStatusResult including quantity, prices, names.
  // TODO: Add role guard / API key guard before exposing externally.
  // ─────────────────────────────────────────────────────────────────
  @Get(':reference/detail')
  @HttpCode(HttpStatus.OK)
  async getStockDetail(
    @Param('reference') reference: string,
  ) {
    if (!reference || reference.trim().length < 3) {
      throw new NotFoundException('Référence invalide.');
    }

    const result = await this.stockService.getStockWithPart(
      reference.trim().toUpperCase(),
    );

    if (!result) {
      // Part not found in DB at all — return safe default
      return {
        reference:     reference.trim().toUpperCase(),
        statut:        'Indisponible',
        totalQuantity: 0,
        stockDisponible: 0,
        stockConsolide:  0,
        displayName:   reference.trim().toUpperCase(),
        designation:   null,
        designation2:  null,
        source:        null,
        sourceLabel:   null,
        prixHt:        null,
        prixTtc:       null,
        categorie:     null,
      };
    }

    return result;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: POST /stock/bulk — batch availability check
  // Accepts { references: string[] }, returns public shape per ref.
  // Used by the frontend product list to avoid N+1 stock requests.
  // TODO: Rate-limit or API key guard before public deployment.
  // ─────────────────────────────────────────────────────────────────
  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  async getBulkStatus(
    @Body() body: { references: string[] },
  ): Promise<Record<string, PublicStockResponse>> {
    if (!body?.references || !Array.isArray(body.references)) {
      throw new BadRequestException('Body must include a `references` string array.');
    }
    if (body.references.length === 0) {
      return {};
    }
    if (body.references.length > 200) {
      throw new BadRequestException('Maximum 200 references per bulk request.');
    }

    const cleanRefs = body.references
      .map((r) => (typeof r === 'string' ? r.trim().toUpperCase() : ''))
      .filter((r) => r.length >= 3);

    if (cleanRefs.length === 0) {
      throw new BadRequestException('No valid references provided (minimum 3 characters each).');
    }

    const bulkMap = await this.stockService.getBulkStockStatus(cleanRefs);

    // Build public response — quantity excluded, displayName included
    const result: Record<string, PublicStockResponse> = {};
    for (const [ref, entry] of bulkMap.entries()) {
      result[ref] = {
        reference:   ref,
        statut:      entry.statut,
        displayName: entry.displayName,
        sourceLabel: null,  // BulkStockEntry doesn't carry sourceLabel — use /detail for that
        categorie:   null,
      };
    }

    this.logger.log(
      `[BULK-STOCK] ${cleanRefs.length} refs checked — ` +
      `${Object.values(result).filter((r) => r.statut === 'Disponible').length} disponible`,
    );

    return result;
  }
}
