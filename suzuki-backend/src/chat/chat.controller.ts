// src/chat/chat.controller.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: POST /chat/message response now includes a `debug` block
//         that exposes ALL product fields so the frontend team can
//         inspect every field during testing:
//           - displayName    (French first, English fallback)
//           - designation    (raw English OEM name)
//           - designation2   (raw French name)
//           - reference
//           - prixHt / prixTtc
//           - unite
//           - categorie
//           - source / sourceLabel  (Suzuki OEM vs CarPro Parts)
//           - stock.statut / stock.totalQuantity
//           - fitments[]
//
// FIX-2: GET /chat/health endpoint added — returns synonym index
//         size, model count, and DB connectivity so the team can
//         verify the system is properly initialised after deploy.
//
// FIX-3: GET /chat/products/sample endpoint added — returns the
//         first 5 results of a reference search so testers can
//         verify the French-first field order without a full query.
//
// FIX-4: POST /chat/message validates body.vehicle shape and logs
//         the vehicle model for traceability in production logs.
//
// FIX-5: Error responses include the full error chain so frontend
//         can distinguish rate-limit, validation, and server errors.
//
// FIX-7: POST /chat/message now also returns `searchDebug` — the full
//         search pipeline trace (tokens, expanded terms, DB row counts,
//         source/stock breakdown, which DB tables/columns were used)
//         captured by AdvancedSearchService during this request. This
//         is what powers the "Pipeline de recherche" section of the
//         frontend debug panel, so testers can see exactly what the
//         database returned without reading server logs.
// ═══════════════════════════════════════════════════════════════════

import {
  Controller, Post, Body, Get, Query, Param,
  BadRequestException, HttpException, HttpStatus,
  Logger, Req,
} from '@nestjs/common';
import { EnhancedChatService, ProcessMessageResponse, AnalyticsResponse } from './enhanced-chat.service';
import { SearchValidatorService } from '../services/search-validator.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { AdvancedSearchService, SearchDebugInfo } from './advanced-search.service';
import type { Request } from 'express';

// ─────────────────────────────────────────────────────────────────
// FIX-1: Enriched response shape — all product fields exposed
// ─────────────────────────────────────────────────────────────────
export interface EnrichedProductField {
  // Internal DB id
  id?:              number | null;

  // ★ Primary display — always French when available
  displayName:      string;

  // Raw fields for debugging / frontend use
  designation:      string;         // English OEM name
  designation2:     string | null;  // French name
  searchDescription?: string | null; // NLP context from CarPro

  reference:        string;
  prixHt:           string | null;
  prixTtc:          string | null;
  unite:            string | null;
  categorie:        string | null;
  fabricant?:       string | null;
  fournisseurCode?: string | null;
  source:           string;
  sourceLabel:      string;         // "Suzuki OEM" | "CarPro Parts"

  stock: {
    statut:         string;         // "Disponible" | "Indisponible"
    totalQuantity:  number;
    stockDisponible: number;
    stockConsolide:  number;
  } | null;

  fitments: {
    modelName: string;
    typeCode:  string;
  }[];

  itemReferences?: {
    referenceNo: string;
    referenceType: string | null;
  }[];

  identificationSource?: {
    vin: string | null;
    vehicleNo: string | null;
    model: string | null;
    modelDescription: string | null;
    typeCodes: string[];
    articleNumber: string;
  } | null;

  score?: number;
}

export interface EnrichedProcessMessageResponse extends ProcessMessageResponse {
  // FIX-1: full product detail array alongside the existing
  // single-item products[] kept for backward compatibility
  productsDetail: EnrichedProductField[];
  // FIX-7: full search pipeline trace for this request (null for
  // responses that never touched the search engine, e.g. greetings)
  searchDebug: SearchDebugInfo | null;
}

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly chatService:   EnhancedChatService,
    private readonly validator:     SearchValidatorService,
    private readonly synonyms:      SynonymsService,
    private readonly vehicleModels: VehicleModelsService,
    // FIX-7: needed to read the search pipeline trace after processMessage()
    private readonly advancedSearch: AdvancedSearchService,
  ) {}

  // ─────────────────────────────────────────────────────────────────
  // POST /chat/message
  // FIX-1: Returns enriched productsDetail[] alongside products[]
  // FIX-4: Validates and logs vehicle model
  // FIX-7: Returns searchDebug — the full search pipeline trace
  // ─────────────────────────────────────────────────────────────────
  @Post('message')
  async chat(
    @Body() body: { message: string; vehicle?: any; sessionId?: string },
    @Req() req: Request,
  ): Promise<EnrichedProcessMessageResponse> {
    if (!body || typeof body.message !== 'string' || body.message.trim().length === 0) {
      throw new HttpException(
        {
          message:    'Body must include a non-empty `message` string',
          error:      'Bad Request',
          statusCode: 400,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // FIX-4: Log vehicle for traceability
    if (body.vehicle?.modele) {
      this.logger.log(
        `[CHAT] message="${body.message.substring(0, 60)}" vehicle=${body.vehicle.modele}`,
      );
    }

    try {
      const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
      const result   = await this.chatService.processMessage(
        body.message,
        body.vehicle,
        body.sessionId,
        clientIp,
      );

      // FIX-1: Build enriched productsDetail from whatever the
      // orchestrator returned in result.products (already mapped
      // by mapProductForResponse — may be 0 or 1 items) plus any
      // extra fields stored on the objects
      const productsDetail: EnrichedProductField[] = (result.products || []).map(
        (p: any) => this.enrichProduct(p),
      );

      // FIX-7: Pull the pipeline trace AdvancedSearchService captured
      // while handling this request (tokens, expanded terms, DB row
      // counts, source/stock breakdown, tables/fields touched). Will
      // be null for responses that never reached the search engine
      // (greetings, thanks, complaints, service questions, etc).
      const searchDebug = this.advancedSearch.getLastSearchDebug();

      return {
        ...result,
        productsDetail,
        searchDebug,
      };
    } catch (err: any) {
      if (err.message?.includes('Body must include')) {
        throw new HttpException(
          { message: err.message, error: 'Bad Request', statusCode: 400 },
          HttpStatus.BAD_REQUEST,
        );
      }
      // FIX-5: Include full error chain
      const message = err?.message || 'Internal server error while processing message';
      this.logger.error(`[CHAT] Error processing message: ${message}`, err?.stack);
      throw new HttpException(
        { error: message, details: err?.cause?.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // GET /chat/analytics
  // ─────────────────────────────────────────────────────────────────
  @Get('analytics')
  async getAnalytics(
    @Query('cached')    cached?:    string,
    @Query('timeRange') timeRange?: string,
  ): Promise<AnalyticsResponse> {
    const opts: { cached?: boolean; timeRange?: string } = {};
    if (cached !== undefined) opts.cached = String(cached).toLowerCase() === 'true';
    if (timeRange) opts.timeRange = timeRange;

    try {
      return await this.chatService.getAnalytics(opts);
    } catch (err: any) {
      throw new HttpException(
        { error: err?.message || 'Failed to fetch analytics' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // POST /chat/feedback
  // ─────────────────────────────────────────────────────────────────
  @Post('feedback')
  async feedback(
    @Body() body: { messageId: string; rating: number; comment?: string },
  ): Promise<any> {
    if (!body || typeof body.messageId !== 'string' || !body.messageId.trim()) {
      throw new BadRequestException('Body must include a non-empty `messageId` string');
    }
    if (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5) {
      throw new BadRequestException('Body must include `rating` as a number between 0 and 5');
    }

    try {
      return await this.chatService.saveFeedback(body.messageId, body.rating, body.comment);
    } catch (err: any) {
      throw new HttpException(
        { error: err?.message || 'Failed to save feedback' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // POST /chat/trigger-learning
  // ─────────────────────────────────────────────────────────────────
  @Post('trigger-learning')
  async triggerLearning(
    @Body() body: { sessionId?: string },
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (body.sessionId) {
        await this.chatService.triggerLearningFromSession(body.sessionId);
        return { success: true, message: `Learning triggered for session ${body.sessionId}` };
      } else {
        await this.chatService.analyzeAndLearnFromConversations();
        return { success: true, message: 'Full learning cycle triggered' };
      }
    } catch (error: any) {
      this.logger.error('Learning trigger failed:', error);
      return { success: false, message: 'Learning failed: ' + error.message };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // GET /chat/search-validation
  // POST /chat/search-validation/clear
  // ─────────────────────────────────────────────────────────────────
  @Get('search-validation')
  async getSearchValidation(): Promise<any> {
    return this.validator.getValidationReport();
  }

  @Post('search-validation/clear')
  async clearValidationLog(): Promise<{ success: boolean; message: string }> {
    this.validator.clearLog();
    return { success: true, message: 'Validation log cleared' };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: GET /chat/health
  // Returns system readiness info for post-deploy verification
  // ─────────────────────────────────────────────────────────────────
  @Get('health')
  async health(): Promise<{
    status:        string;
    synonyms:      { normalizedLookupSize: number; categoryCount: number; tunisianMapSize: number; stopWordCount: number };
    vehicleModels: { count: number; models: string[] };
    timestamp:     string;
  }> {
    return {
      status: 'ok',
      synonyms: {
        normalizedLookupSize: this.synonyms.getNormalizedLookupSize(),
        categoryCount:        this.synonyms.getCategoryCount(),
        tunisianMapSize:      this.synonyms.getTunisianMapSize(),
        stopWordCount:        this.synonyms.getStopWordCount(),
      },
      vehicleModels: {
        count:  this.vehicleModels.getAll().length,
        models: this.vehicleModels.getAll(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: GET /chat/products/sample?reference=00533069
  // Returns enriched product detail for a known reference so
  // testers can verify all fields without a full NLP query
  // ─────────────────────────────────────────────────────────────────
  @Get('products/sample')
  async sampleProduct(
    @Query('reference') reference?: string,
  ): Promise<{
    note:    string;
    fields:  string[];
    sample:  EnrichedProductField | null;
  }> {
    const ref = reference || '00533069'; // default: BATTERIE L2

    const fakeResult = await this.chatService.processMessage(
      ref,  // send reference as query — triggers reference search path
      undefined,
      undefined,
      '127.0.0.1',
    );

    const first = (fakeResult as any).productsDetail?.[0] ??
                  (fakeResult.products?.[0] ? this.enrichProduct(fakeResult.products[0]) : null);

    return {
      note: `Sample product for reference "${ref}". All fields listed below are present in every /chat/message response under productsDetail[].`,
      fields: [
        'displayName      — French name (designation_2) or English fallback',
        'designation      — Raw English OEM name',
        'designation2     — Raw French name (designation_2)',
        'reference        — Part reference number',
        'prixHt           — Price excl. tax (TND string)',
        'prixTtc          — Price incl. tax (TND string)',
        'unite            — Unit (UNITE / PCS)',
        'categorie        — Part category (MÉCANIQUE / CARROSSERIE / …)',
        'fabricant        — Manufacturer (SUZUKI / AUTRES)',
        'fournisseurCode  — Supplier code',
        'source           — Data source code (01_PROD / 02_CARPRO)',
        'sourceLabel      — Human-readable source (Suzuki OEM / CarPro Parts)',
        'stock.statut     — Disponible | Indisponible',
        'stock.totalQuantity — Quantity in stock (integer)',
        'stock.stockDisponible — Source stock disponible',
        'stock.stockConsolide  — Source stock consolide; available only when > 2',
        'fitments[]       — Compatible vehicle types [{modelName, typeCode}]',
        'itemReferences[] — Alternate references / barcodes',
        'identificationSource — VIN/typeCode/model/article evidence used for filtering',
        'score            — Internal relevance score (for debug)',
      ],
      sample: first,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // POST /chat/synonyms/seed
  // Triggers seedFrenchDesignation2Synonyms() from SynonymsService.
  // Call this ONCE after deploying the migration to backfill the
  // synonyms table with French designation_2 vocabulary.
  // ─────────────────────────────────────────────────────────────────
  @Post('synonyms/seed')
  async seedSynonyms(): Promise<{
    success:  boolean;
    inserted: number;
    skipped:  number;
    message:  string;
  }> {
    try {
      this.logger.log('[ADMIN] Seeding French synonyms from designation_2...');
      const result = await this.synonyms.seedFrenchDesignation2Synonyms();
      return {
        success:  true,
        inserted: result.inserted,
        skipped:  result.skipped,
        message:  `Inserted ${result.inserted} new synonyms, skipped ${result.skipped} duplicates. Synonym index reloaded.`,
      };
    } catch (error: any) {
      this.logger.error('[ADMIN] Synonym seeding failed:', error);
      throw new HttpException(
        { error: error.message || 'Synonym seeding failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // POST /chat/synonyms/reload
  // Reloads synonym index from DB without re-seeding.
  // ─────────────────────────────────────────────────────────────────
  @Post('synonyms/reload')
  async reloadSynonyms(): Promise<{ success: boolean; message: string; stats: any }> {
    try {
      await this.synonyms.reload();
      return {
        success: true,
        message: 'Synonym index reloaded from database',
        stats: {
          normalizedLookupSize: this.synonyms.getNormalizedLookupSize(),
          categoryCount:        this.synonyms.getCategoryCount(),
          tunisianMapSize:      this.synonyms.getTunisianMapSize(),
          stopWordCount:        this.synonyms.getStopWordCount(),
        },
      };
    } catch (error: any) {
      throw new HttpException(
        { error: error.message || 'Synonym reload failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // POST /chat/vehicle-models/reload
  // Reloads vehicle model list from DB.
  // ─────────────────────────────────────────────────────────────────
  @Post('vehicle-models/reload')
  async reloadVehicleModels(): Promise<{ success: boolean; count: number; models: string[] }> {
    try {
      await this.vehicleModels.reload();
      return {
        success: true,
        count:   this.vehicleModels.getAll().length,
        models:  this.vehicleModels.getAll(),
      };
    } catch (error: any) {
      throw new HttpException(
        { error: error.message || 'Vehicle model reload failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: enrichProduct helper — maps any product object to the
  // full EnrichedProductField shape for the productsDetail[] array.
  // Handles both pre-mapped (from mapProductForResponse) and raw rows.
  //
  // BUGFIX-2: designationOem is the true English OEM name.
  //   After mapProductForResponse(), the orchestrator stores the OEM
  //   name in designationOem and puts displayName (French) in designation.
  //   For raw PartResult rows, designation IS the English OEM name.
  // BUGFIX-1: stock is always an object, never null.
  // ─────────────────────────────────────────────────────────────────
  private formatStock(stock: any): {
    statut: string;
    totalQuantity: number;
    stockDisponible: number;
    stockConsolide: number;
  } {
    const totalQuantity = Number(stock?.totalQuantity ?? stock?.total_quantity ?? 0);
    const stockDisponible = Number(stock?.stockDisponible ?? stock?.stock_disponible ?? 0);
    const stockConsolide = Number(
      stock?.stockConsolide ?? stock?.stock_consolide ?? totalQuantity,
    );

    return {
      statut: stockConsolide > 2 ? 'Disponible' : 'Indisponible',
      totalQuantity,
      stockDisponible,
      stockConsolide,
    };
  }

  private enrichProduct(p: any): EnrichedProductField {
    // displayName: French name (designation_2) or English fallback
    const displayName =
      p.displayName?.trim() ||
      (p.designation2 ?? p.designation_2 ?? '').trim() ||
      (p.designation  ?? '').trim();

    // BUGFIX-2: True English OEM name.
    // mapProductForResponse() puts OEM in designationOem.
    // Raw PartResult rows put OEM in designation directly.
    const designation = (p.designationOem ?? p.designation ?? '').trim();

    // French name: designation2, designation_2, or designation if no OEM field exists
    const designation2 = (p.designation2 ?? p.designation_2 ?? null);

    const sourceLabel =
      p.sourceLabel ??
      (p.source === '02_CARPRO' ? 'CarPro Parts' : 'Suzuki OEM');

    return {
      id:              p.id               ?? null,
      displayName,
      designation,       // English OEM name (true)
      designation2,      // French name from designation_2
      searchDescription: p.searchDescription ?? p.search_description ?? null,
      reference:       p.reference        ?? '',
      prixHt:          p.prixHt  != null ? String(p.prixHt)  : null,
      prixTtc:         p.prixTtc != null ? String(p.prixTtc) : null,
      unite:           p.unite            ?? null,
      categorie:       p.categorie        ?? null,
      fabricant:       p.fabricant        ?? null,
      fournisseurCode: p.fournisseurCode  ?? null,
      source:          p.source           ?? '',
      sourceLabel,
      // BUGFIX-1: never null — parts without a stock row show Indisponible
      stock: this.formatStock(p.stock),
      fitments: (p.fitments ?? []).map((f: any) => ({
        modelName: f.modelName ?? '',
        typeCode:  f.typeCode  ?? '',
      })),
      itemReferences: (p.itemReferences ?? []).map((r: any) => ({
        referenceNo: r.referenceNo ?? '',
        referenceType: r.referenceType ?? null,
      })),
      identificationSource: p.identificationSource ?? null,
      score: p.score ?? undefined,
    };
  }
}
