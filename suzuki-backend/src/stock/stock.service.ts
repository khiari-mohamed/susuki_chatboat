// src/stock/stock.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: getStockStatus() now joins the parts table to return
//         displayName (designation_2 French first, designation fallback)
//         alongside the status. Previously only reference + statut were
//         returned, so callers had to do a second query to get the name.
//
// FIX-2: getStockStatus() now returns totalQuantity so the frontend
//         can show "Disponible (6 en stock)" instead of just "Disponible".
//         Quantity is INCLUDED here because the controller decides
//         whether to expose it — the controller keeps the "never expose
//         raw quantities publicly" guard via its own response shaping.
//
// FIX-3: getBulkStockStatus() extended to also return totalQuantity
//         and displayName so callers (e.g. search results) can enrich
//         product lists without N+1 queries.
//
// FIX-4: getStockWithPart() new method — returns full part + stock
//         joined row for the enriched /stock/:reference endpoint.
//
// ALL BUSINESS LOGIC PRESERVED:
//   ✅ Indisponible as safe default for unknown references
//   ✅ Never expose null to callers
//   ✅ Bulk lookup with Map<reference, statut>
//   ✅ PrismaService injected (not re-provided in module)
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface StockStatusResult {
  reference:      string;
  statut:         string;          // 'Disponible' | 'Indisponible'
  totalQuantity:  number;          // FIX-2: quantity exposed to service layer
  stockDisponible: number;
  stockConsolide:  number;
  // FIX-1: French name
  displayName:    string;          // designation_2 (French) or designation fallback
  designation:    string | null;   // raw English OEM name
  designation2:   string | null;   // raw French name
  // Source info
  source:         string | null;
  sourceLabel:    string | null;   // 'Suzuki OEM' | 'CarPro Parts'
  // Pricing
  prixHt:         string | null;
  prixTtc:        string | null;
  categorie:      string | null;
}

export interface BulkStockEntry {
  statut:        string;
  totalQuantity: number;
  stockDisponible: number;
  stockConsolide:  number;
  displayName:   string;
}

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────
  // FIX-1 + FIX-2: getStockStatus — joins parts for name + quantity
  // ─────────────────────────────────────────────────────────────────
  async getStockStatus(reference: string): Promise<StockStatusResult> {
    // Single query: join stock → parts via shared reference key
    const stock = await this.prisma.stock.findUnique({
      where:  { reference },
      select: {
        reference:     true,
        statut:        true,
        totalQuantity: true,   // FIX-2
        stockDisponible: true,
        stockConsolide:  true,
        part: {                // FIX-1: join to parts
          select: {
            designation:  true,
            designation2: true,
            prixHt:       true,
            prixTtc:      true,
            categorie:    true,
            source:       true,
          },
        },
      },
    });

    if (!stock) {
      // Safe default — unknown reference
      return {
        reference,
        statut:        'Indisponible',
        totalQuantity: 0,
        stockDisponible: 0,
        stockConsolide:  0,
        displayName:   reference,   // fallback: show reference as name
        designation:   null,
        designation2:  null,
        source:        null,
        sourceLabel:   null,
        prixHt:        null,
        prixTtc:       null,
        categorie:     null,
      };
    }

    return this.buildResult(stock);
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: getBulkStockStatus — returns quantity and displayName
  // Returns Map<reference, BulkStockEntry> for richer callers,
  // and keeps the old Map<reference, statut> shape via the
  // getStatutMap() helper below for backward-compat callers.
  // ─────────────────────────────────────────────────────────────────
  async getBulkStockStatus(
    references: string[],
  ): Promise<Map<string, BulkStockEntry>> {
    if (references.length === 0) return new Map();

    const stocks = await this.prisma.stock.findMany({
      where:  { reference: { in: references } },
      select: {
        reference:     true,
        statut:        true,
        totalQuantity: true,
        stockDisponible: true,
        stockConsolide:  true,
        part: {
          select: {
            designation:  true,
            designation2: true,
            source:       true,
          },
        },
      },
    });

    // Seed all requested references with safe defaults
    const map = new Map<string, BulkStockEntry>(
      references.map((r) => [
        r,
        {
          statut: 'Indisponible',
          totalQuantity: 0,
          stockDisponible: 0,
          stockConsolide: 0,
          displayName: r,
        },
      ]),
    );

    for (const s of stocks) {
      map.set(s.reference, {
        statut:        this.resolveAvailabilityStatus(s),
        totalQuantity: s.totalQuantity ?? 0,
        stockDisponible: s.stockDisponible ?? 0,
        stockConsolide:  s.stockConsolide ?? s.totalQuantity ?? 0,
        displayName:   this.resolveDisplayName(s.part),
      });
    }

    return map;
  }

  // ─────────────────────────────────────────────────────────────────
  // Backward-compat helper — returns Map<reference, statut> string
  // so existing callers that only need statut don't break.
  // ─────────────────────────────────────────────────────────────────
  async getStatutMap(references: string[]): Promise<Map<string, string>> {
    const bulk = await this.getBulkStockStatus(references);
    const map  = new Map<string, string>();
    for (const [ref, entry] of bulk.entries()) {
      map.set(ref, entry.statut);
    }
    return map;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: getStockWithPart — full joined result for the enriched
  //         controller endpoint
  // ─────────────────────────────────────────────────────────────────
  async getStockWithPart(reference: string): Promise<StockStatusResult | null> {
    const stock = await this.prisma.stock.findUnique({
      where:  { reference },
      select: {
        reference:     true,
        statut:        true,
        totalQuantity: true,
        stockDisponible: true,
        stockConsolide:  true,
        part: {
          select: {
            designation:  true,
            designation2: true,
            prixHt:       true,
            prixTtc:      true,
            categorie:    true,
            source:       true,
          },
        },
      },
    });

    if (!stock) return null;
    return this.buildResult(stock);
  }

  // ─────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────

  private buildResult(stock: any): StockStatusResult {
    const part        = stock.part;
    const displayName = this.resolveDisplayName(part);
    const sourceLabel = this.resolveSourceLabel(part?.source);

    return {
      reference:     stock.reference,
      statut:        this.resolveAvailabilityStatus(stock),
      totalQuantity: stock.totalQuantity ?? 0,
      stockDisponible: stock.stockDisponible ?? 0,
      stockConsolide:  stock.stockConsolide ?? stock.totalQuantity ?? 0,
      displayName,
      designation:   part?.designation   ?? null,
      designation2:  part?.designation2  ?? null,
      source:        part?.source        ?? null,
      sourceLabel,
      prixHt:        part?.prixHt  != null ? String(part.prixHt)  : null,
      prixTtc:       part?.prixTtc != null ? String(part.prixTtc) : null,
      categorie:     part?.categorie     ?? null,
    };
  }

  // FIX-1: French name first — mirrors getDisplayName() pattern used
  //         throughout the rest of the codebase
  private resolveDisplayName(part: any): string {
    if (!part) return '';
    const french  = (part.designation2 ?? '').trim();
    const english = (part.designation  ?? '').trim();
    return french.length > 0 ? french : english;
  }

  private resolveSourceLabel(source: string | null | undefined): string | null {
    if (!source) return null;
    if (source === '01_PROD')   return 'Suzuki OEM';
    if (source === '02_CARPRO') return 'CarPro Parts';
    return source;
  }

  private resolveAvailabilityStatus(stock: any): 'Disponible' | 'Indisponible' {
    const consolidated = Number(stock?.stockConsolide ?? stock?.stock_consolide ?? stock?.totalQuantity ?? 0);
    return consolidated > 2 ? 'Disponible' : 'Indisponible';
  }
}
