import {
  Body, Controller, Get, HttpException, HttpStatus, Logger,
  BadRequestException, Post, Query, Req, UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { EnhancedChatService } from './enhanced-chat.service';
import type { AnalyticsResponse, ProcessMessageResponse } from './enhanced-chat.service';
import { SearchValidatorService } from '../services/search-validator.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { AdvancedSearchService } from './advanced-search.service';
import type { SearchDebugInfo } from './advanced-search.service';
import { MIN_AVAILABLE_STOCK, PUBLIC_PRICE_SOURCE, isQuantityAvailable } from '../constants/business-rules.constants';
import { JwtAuthGuard } from '../admin/auth/jwt-auth.guard';
import { RolesGuard } from '../admin/auth/roles.guard';
import { Roles } from '../admin/auth/roles.decorator';

export interface EnrichedProductField {
  id?: number | null;
  /** Primary display name: French when available. */
  displayName: string;
  /** English OEM name. */
  designation: string;
  /** French name (designation_2). */
  designation2: string | null;
  searchDescription?: string | null;

  reference: string;
  prixHt: string | null;
  /** Public price (01_PROD) only. */
  prixTtc: string | null;
  unite: string | null;
  categorie: string | null;
  fabricant?: string | null;
  fournisseurCode?: string | null;
  source: string;
  /** "Suzuki OEM" | "CarPro Parts" */
  sourceLabel: string;

  /** Never null: parts without a stock row are "Indisponible". */
  stock: {
    statut: string;
    totalQuantity: number;
    stockDisponible: number;
    stockConsolide: number;
  };

  fitments: { modelName: string; typeCode: string }[];
  itemReferences?: { referenceNo: string; referenceType: string | null }[];

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
  productsDetail: EnrichedProductField[];
  /** Search pipeline trace. Null in production unless CHAT_EXPOSE_DEBUG=true. */
  searchDebug: SearchDebugInfo | null;
}

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  private readonly exposeSearchDebug: boolean;

  constructor(
    private readonly chatService: EnhancedChatService,
    private readonly validator: SearchValidatorService,
    private readonly synonyms: SynonymsService,
    private readonly vehicleModels: VehicleModelsService,
    private readonly advancedSearch: AdvancedSearchService,
    config: ConfigService,
  ) {
    // getLastSearchDebug() is shared state (last search of ANY customer) and
    // exposes internals: on by default in development only.
    const flag = config.get<string>('CHAT_EXPOSE_DEBUG');
    this.exposeSearchDebug = (flag ?? (config.get<string>('NODE_ENV') === 'production' ? 'false' : 'true')) === 'true';
  }

  // ─────────────────────────────────────────────────────────────────
  // Public: customer chat
  // ─────────────────────────────────────────────────────────────────
  @Post('message')
  async chat(
    @Body() body: { message: string; vehicle?: any; sessionId?: string },
    @Req() req: Request,
  ): Promise<EnrichedProcessMessageResponse> {
    if (!body || typeof body.message !== 'string' || body.message.trim().length === 0) {
      throw new HttpException(
        { message: 'Body must include a non-empty `message` string', error: 'Bad Request', statusCode: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
      const result = await this.chatService.processMessage(body.message, body.vehicle, body.sessionId, clientIp);
      return {
        ...result,
        productsDetail: (result.products || []).map((product: any) => this.enrichProduct(product)),
        searchDebug: this.exposeSearchDebug ? this.advancedSearch.getLastSearchDebug() : null,
      };
    } catch (err: any) {
      if (err instanceof HttpException) throw err; // 400s from the service keep their status
      const message = err?.message || 'Internal server error while processing message';
      this.logger.error(`[CHAT] Error processing message: ${message}`, err?.stack);
      throw new HttpException(
        { error: message, details: err?.cause?.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('feedback')
  async feedback(
    @Body() body: { messageId: string; rating: number; comment?: string },
  ): Promise<any> {
    if (!body || typeof body.messageId !== 'string' || !body.messageId.trim()) {
      throw new BadRequestException('Body must include a non-empty `messageId` string');
    }
    if (!Number.isInteger(body.rating) || body.rating < 0 || body.rating > 5) {
      throw new BadRequestException('Body must include `rating` as an integer between 0 and 5');
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

  @Get('analytics')
  async getAnalytics(
    @Query('cached') cached?: string,
    @Query('timeRange') timeRange?: string,
  ): Promise<AnalyticsResponse> {
    const options: { cached?: boolean; timeRange?: string } = {};
    if (cached !== undefined) options.cached = String(cached).toLowerCase() === 'true';
    if (timeRange) options.timeRange = timeRange;

    try {
      return await this.chatService.getAnalytics(options);
    } catch (err: any) {
      throw new HttpException(
        { error: err?.message || 'Failed to fetch analytics' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async health(): Promise<{
    status: string;
    synonyms: { normalizedLookupSize: number; categoryCount: number; tunisianMapSize: number; stopWordCount: number };
    vehicleModels: { count: number; models: string[] };
    timestamp: string;
  }> {
    const models = this.vehicleModels.getAll();
    return {
      status: 'ok',
      synonyms: this.synonymStats(),
      vehicleModels: { count: models.length, models },
      timestamp: new Date().toISOString(),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // Internal endpoints: JWT + role required. These mutate data, trigger
  // OpenAI-backed jobs or expose internals; none of them is for customers.
  // ─────────────────────────────────────────────────────────────────
  @Post('trigger-learning')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async triggerLearning(
    @Body() body: { sessionId?: string },
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (body?.sessionId) {
        await this.chatService.triggerLearningFromSession(body.sessionId);
        return { success: true, message: `Learning triggered for session ${body.sessionId}` };
      }
      await this.chatService.analyzeAndLearnFromConversations();
      return { success: true, message: 'Full learning cycle triggered' };
    } catch (error: any) {
      this.logger.error('Learning trigger failed:', error);
      return { success: false, message: 'Learning failed: ' + error.message };
    }
  }

  @Get('search-validation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async getSearchValidation(): Promise<any> {
    return this.validator.getValidationReport();
  }

  @Post('search-validation/clear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async clearValidationLog(): Promise<{ success: boolean; message: string }> {
    this.validator.clearLog();
    return { success: true, message: 'Validation log cleared' };
  }

  /** Runs a real chat turn (creates a session and a search-log row): admin diagnostics only. */
  @Get('products/sample')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async sampleProduct(
    @Query('reference') reference?: string,
  ): Promise<{ note: string; fields: string[]; sample: EnrichedProductField | null }> {
    const ref = reference || '00533069';
    const result = await this.chatService.processMessage(ref, undefined, undefined, '127.0.0.1');
    const first = result.products?.[0] ? this.enrichProduct(result.products[0]) : null;

    return {
      note: `Sample product for reference "${ref}". These fields are present in every /chat/message response under productsDetail[].`,
      fields: [
        'displayName      — French name (designation_2) or English fallback',
        'designation      — Raw English OEM name',
        'designation2     — Raw French name (designation_2)',
        'reference        — Part reference number',
        'prixHt           — Price excl. tax (TND string)',
        `prixTtc          — Public TTC, ${PUBLIC_PRICE_SOURCE} rows only (TND string)`,
        'unite            — Unit (UNITE / PCS)',
        'categorie        — Part category',
        'fabricant        — Manufacturer',
        'fournisseurCode  — Supplier code',
        'source           — Data source code (01_PROD / 02_CARPRO)',
        'sourceLabel      — Human-readable source (Suzuki OEM / CarPro Parts)',
        'stock.statut     — Disponible | Indisponible',
        'stock.totalQuantity — Total quantity',
        'stock.stockDisponible — Source stock disponible',
        `stock.stockConsolide  — Consolidated stock; available only when >= ${MIN_AVAILABLE_STOCK}`,
        'fitments[]       — Compatible vehicle types [{modelName, typeCode}]',
        'itemReferences[] — Alternate references / barcodes',
        'identificationSource — VIN/typeCode/model/article evidence used for filtering',
        'score            — Internal relevance score (debug)',
      ],
      sample: first,
    };
  }

  @Post('synonyms/seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async seedSynonyms(): Promise<{ success: boolean; inserted: number; skipped: number; message: string }> {
    try {
      this.logger.log('[ADMIN] Seeding French synonyms from designation_2...');
      const result = await this.synonyms.seedFrenchDesignation2Synonyms();
      return {
        success: true,
        inserted: result.inserted,
        skipped: result.skipped,
        message: `Inserted ${result.inserted} new synonyms, skipped ${result.skipped} duplicates. Synonym index reloaded.`,
      };
    } catch (error: any) {
      this.logger.error('[ADMIN] Synonym seeding failed:', error);
      throw new HttpException(
        { error: error.message || 'Synonym seeding failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('synonyms/reload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async reloadSynonyms(): Promise<{ success: boolean; message: string; stats: any }> {
    try {
      await this.synonyms.reload();
      // AdvancedSearchService keeps its own snapshot: refresh it too.
      this.advancedSearch.refreshSynonymIndex();
      return {
        success: true,
        message: 'Synonym index reloaded from database',
        stats: this.synonymStats(),
      };
    } catch (error: any) {
      throw new HttpException(
        { error: error.message || 'Synonym reload failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('vehicle-models/reload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async reloadVehicleModels(): Promise<{ success: boolean; count: number; models: string[] }> {
    try {
      await this.vehicleModels.reload();
      const models = this.vehicleModels.getAll();
      return { success: true, count: models.length, models };
    } catch (error: any) {
      throw new HttpException(
        { error: error.message || 'Vehicle model reload failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────
  private synonymStats() {
    return {
      normalizedLookupSize: this.synonyms.getNormalizedLookupSize(),
      categoryCount: this.synonyms.getCategoryCount(),
      tunisianMapSize: this.synonyms.getTunisianMapSize(),
      stopWordCount: this.synonyms.getStopWordCount(),
    };
  }

  private formatStock(stock: any): EnrichedProductField['stock'] {
    const stockConsolide = Number(stock?.stockConsolide ?? stock?.stock_consolide ?? 0);
    return {
      statut: isQuantityAvailable(stockConsolide) ? 'Disponible' : 'Indisponible',
      totalQuantity: Number(stock?.totalQuantity ?? stock?.total_quantity ?? 0),
      stockDisponible: Number(stock?.stockDisponible ?? stock?.stock_disponible ?? 0),
      stockConsolide,
    };
  }

  private enrichProduct(p: any): EnrichedProductField {
    const displayName =
      p.displayName?.trim() ||
      (p.designation2 ?? p.designation_2 ?? '').trim() ||
      (p.designation ?? '').trim();

    // mapProductForResponse() puts the OEM name in designationOem; raw rows in designation.
    const designation = (p.designationOem ?? p.designation ?? '').trim();

    return {
      id: p.id ?? null,
      displayName,
      designation,
      designation2: p.designation2 ?? p.designation_2 ?? null,
      searchDescription: p.searchDescription ?? p.search_description ?? null,
      reference: p.reference ?? '',
      prixHt: p.prixHt != null ? String(p.prixHt) : null,
      prixTtc: p.source === PUBLIC_PRICE_SOURCE && p.prixTtc != null ? String(p.prixTtc) : null,
      unite: p.unite ?? null,
      categorie: p.categorie ?? null,
      fabricant: p.fabricant ?? null,
      fournisseurCode: p.fournisseurCode ?? null,
      source: p.source ?? '',
      sourceLabel: p.sourceLabel ?? (p.source === '02_CARPRO' ? 'CarPro Parts' : 'Suzuki OEM'),
      stock: this.formatStock(p.stock),
      fitments: (p.fitments ?? []).map((f: any) => ({
        modelName: f.modelName ?? '',
        typeCode: f.typeCode ?? '',
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