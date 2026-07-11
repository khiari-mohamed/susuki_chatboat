// src/stock/stock.module.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25):
//
// No structural changes needed — the module is correctly structured.
//
// Confirmed:
//   ✅ PrismaService NOT re-provided here (global from AppModule)
//   ✅ StockService exported for use in ChatModule, SearchModule, etc.
//   ✅ StockController registered
//
// NOTE: If chat-orchestrator.service.ts or advanced-search.service.ts
//       ever need to call StockService directly (e.g. for enriching
//       search results with live stock in a single query), import
//       StockModule into ChatModule and inject StockService there.
//       The exports: [StockService] line already enables this.
// ═══════════════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

// PrismaService is provided at AppModule level and available globally.
// Do NOT re-provide it here — that would create a second connection pool.
@Module({
  controllers: [StockController],
  providers:   [StockService],
  exports:     [StockService],
})
export class StockModule {}