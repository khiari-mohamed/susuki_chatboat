import { Injectable, Logger } from '@nestjs/common';
import { SessionService } from './session.service';
import { ClarificationService } from './clarification.service';
import { ContextService } from './context.service';
import { ResponseService } from './response.service';
import { SearchService } from './search.service';
import { IntelligenceService } from '../chat/intelligence.service';
import { OpenAIService } from '../chat/openai.service';
import { AIQueryNormalizerService } from './ai-query-normalizer.service';
import { AdvancedSearchService } from '../chat/advanced-search.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { StrictValidatorService } from '../chat/strict-validator.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { extractRequestedPositions, getCatalogPositions, normalizeForMatch } from '../chat/part-constraints';
import type { ConstraintOutcome } from '../chat/part-constraints';
import { evaluateResponseConfidence, MIN_UNDERSTANDING_CONFIDENCE } from '../chat/confidence-gate';
import {
  checkResponseAgainstCatalog,
  decideAfterAiFlags,
  stockIsAvailable,
  verifyProductAgainstCatalog,
} from '../chat/catalog-verifier';
import type {
  AiFlag,
  AiFlagType,
  CheckStatus,
  ProductVerification,
} from '../chat/catalog-verifier';
import type { StructuredQueryInterpretation } from './ai-query-normalizer.service';

export interface ProcessMessageResponse {
  response: string;
  sessionId: string;
  products: any[];
  confidence: string;
  confidenceScore?: number;
  suggestions?: string[];
  intent: string;
  metadata: {
    productsFound: number;
    conversationLength: number;
    queryClarity: number;
    duration?: number;
    userMessageId?: string;
    error?: string;
    verification?: AnswerVerification;
  };
}

export interface AnswerVerification {
  compatibility: 'CONFIRMEE' | 'NON_CONFORME' | 'NON_VERIFIEE';
  checks: {
    identity: CheckStatus;
    position: CheckStatus;
    qualifiers: CheckStatus;
    vehicle: CheckStatus;
    stockPrice: CheckStatus;
  };
  reasons: string[];
  aiAudit: 'ran' | 'unavailable' | 'skipped';
  aiFlags: { effective: AiFlag[]; ignored: AiFlag[] };
}

interface VerifiedAnswer {
  accepted: boolean;
  response: string;
  products: any[];
  verification: AnswerVerification;
}

@Injectable()
export class ChatOrchestratorService {
  private readonly logger = new Logger(ChatOrchestratorService.name);

  // The local carPartNames list that used to live here was removed —
  // isCarPart checks below now call synonymsService.isKnownAutomotiveTerm(),
  // the same DB-backed check used by AIQueryNormalizerService and
  // IntelligenceService (see synonyms.service.ts). This was one of three
  // copies of the same list that could silently drift out of sync.
  constructor(
    private sessionService: SessionService,
    private clarificationService: ClarificationService,
    private contextService: ContextService,
    private responseService: ResponseService,
    private searchService: SearchService,
    private intelligenceService: IntelligenceService,
    private openaiService: OpenAIService,
    private aiNormalizer: AIQueryNormalizerService,
    private advancedSearch: AdvancedSearchService,
    private vehicleModels: VehicleModelsService,
    private strictValidator: StrictValidatorService,
    private synonymsService: SynonymsService,
  ) {
    setInterval(() => this.clarificationService.cleanup(), 300000);
  }
  private formatStock(stock: any): {
    statut: string;
    totalQuantity: number;
    stockDisponible: number;
    stockConsolide: number;
  } {
    const totalQuantity = Number(stock?.totalQuantity ?? stock?.total_quantity ?? 0);
    const stockDisponible = Number(stock?.stockDisponible ?? stock?.stock_disponible ?? 0);
    const stockConsolide = Number(
      stock?.stockConsolide ?? stock?.stock_consolide ?? 0,
    );

    return {
      statut: stockConsolide >= 2 ? 'Disponible' : 'Indisponible',
      totalQuantity,
      stockDisponible,
      stockConsolide,
    };
  }

  private mapProductForResponse(p: any): any {
    const frenchOrEnglish =
      (p.designation2 ?? p.designation_2 ?? '').trim() ||
      (p.designation ?? '').trim();
    const displayName = p.displayName ?? frenchOrEnglish;

    return {
      id:           p.id,
      // ★ Primary display field — French name when available
      designation:  displayName,
      // Raw fields for debugging / future use
      designationOem: p.designation,
      designation2:   p.designation2 ?? p.designation_2 ?? null,
      searchDescription: p.searchDescription ?? p.search_description ?? null,
      reference:    p.reference,
      prixHt:       p.prixHt != null ? String(p.prixHt) : null,
      prixTtc:      p.prixTtc != null ? String(p.prixTtc) : null,
      unite:        p.unite ?? null,
      categorie:    p.categorie ?? null,
      fabricant:        p.fabricant        ?? null,
      fournisseurCode:  p.fournisseurCode  ?? null,
      source:       p.source ?? null,
      sourceLabel:  p.sourceLabel ?? (p.source === '02_CARPRO' ? 'CarPro Parts' : p.source === '01_PROD' ? 'Suzuki OEM' : null),
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
      // Carry the internal relevance score through for debug visibility.
      score: p.score ?? undefined,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: Get the effective text to use for text-based filtering.
  // Returns designation_2 (French) if available, else designation.
  // ─────────────────────────────────────────────────────────────────
  private getEffectiveText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    return french.length > 0 ? french : english;
  }

  // Returns BOTH fields combined so filters check either language
  private getCombinedText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    if (french.toLowerCase() === english.toLowerCase()) return french;
    return `${french} ${english}`.trim();
  }


  // FIX 2026-09-20: single shared position reader (part-constraints.ts).
  // The old regexes read "BOUGIE D'ALLUMAGE" as droite and mixed French and
  // English text.
  private getPositionFlags(p: any): {
    hasAvant: boolean;
    hasArriere: boolean;
    hasGauche: boolean;
    hasDroite: boolean;
  } {
    const actual = getCatalogPositions(p);
    return {
      hasAvant:   actual.axes.includes('AV'),
      hasArriere: actual.axes.includes('AR'),
      hasGauche:  actual.sides.includes('G'),
      hasDroite:  actual.sides.includes('D'),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  private isFilterOperation(message: string): boolean {
    const lower = message.toLowerCase();
    const isCarPart = this.synonymsService.isKnownAutomotiveTerm(lower);
    if (isCarPart) return false;

    const filterPhrases = [
      'appliquer un filtre', 'ajoute un filtre', 'mettre un filtre',
      'filtre pour', 'filtre sur', 'ne montrer que', 'seulement',
      'filtrer', 'tri par', 'trier',
    ];
    return filterPhrases.some((phrase) => lower.includes(phrase));
  }

  private parseFilter(message: string): any {
    const lower = message.toLowerCase();
    if (/\b(arriere|arrière|ar)\b/.test(lower)) return { position: 'arrière' };
    if (/\b(avant|av)\b/.test(lower))           return { position: 'avant' };
    if (/\b(gauche|g)\b/.test(lower))           return { side: 'gauche' };
    if (/\b(droite|d|droit)\b/.test(lower))     return { side: 'droite' };
    return null;
  }

  // FIX-3 + FIX-8: applyFilters checks BOTH text fields, French-priority
  private applyFilters(products: any[], filters: any[]): any[] {
    if (!filters || filters.length === 0) return products;

    return products.filter((p) => {
      // FIX-8: French-priority resolution instead of a merged blob
      const { hasAvant, hasArriere, hasGauche, hasDroite } = this.getPositionFlags(p);

      return filters.every((f) => {
        if (f.position) {
          return f.position === 'avant' ? hasAvant : hasArriere;
        }
        if (f.side) {
          return f.side === 'gauche' ? hasGauche : hasDroite;
        }
        return true;
      });
    });
  }

  private async answerFromVerifiedProducts(options: {
    message: string;
    interpretation: StructuredQueryInterpretation;
    vehicle: any;
    products: any[];
    build: (shownProducts: any[]) => string;
    requireUnderstanding?: boolean;
    chooseProduct?: (products: any[]) => any;
  }): Promise<VerifiedAnswer> {
    const { message, interpretation, vehicle } = options;
    const noChecks: AnswerVerification['checks'] = {
      identity: 'not-applicable', position: 'not-applicable', qualifiers: 'not-applicable',
      vehicle: 'not-applicable', stockPrice: 'not-applicable',
    };
    const withheld = (
      reasons: string[],
      partial: Partial<AnswerVerification> = {},
    ): VerifiedAnswer => {
      this.logger.warn(`[VERIFY] Answer withheld: ${reasons.join(' | ') || 'unspecified'}`);
      return {
        accepted: false,
        response: this.responseService.buildSecurisationResponse(vehicle),
        products: [],
        verification: {
          compatibility: 'NON_VERIFIEE', checks: noChecks, reasons,
          aiAudit: 'skipped', aiFlags: { effective: [], ignored: [] }, ...partial,
        },
      };
    };

    const seenReferences = new Set<string>();
    const candidates = (options.products ?? []).filter((product) => {
      if (typeof product?.reference !== 'string' || !product.reference.trim()) return false;
      const key = product.reference.trim().toUpperCase();
      if (seenReferences.has(key)) return false;
      seenReferences.add(key);
      return true;
    });
    if (candidates.length === 0) return withheld(['no DB candidate']);
    if (
      options.requireUnderstanding !== false &&
      (!Number.isFinite(interpretation.confidence) || interpretation.confidence < MIN_UNDERSTANDING_CONFIDENCE)
    ) {
      return withheld([`understanding confidence ${interpretation.confidence} < ${MIN_UNDERSTANDING_CONFIDENCE}`]);
    }

    const vehicleScoped = !!(
      vehicle?.vin || vehicle?.vehicleNo || vehicle?.vehicle_no || vehicle?.modele ||
      vehicle?.model || vehicle?.typeCode || vehicle?.type_code
    );
    const compatibleTypeCodes = vehicleScoped
      ? await this.advancedSearch.resolveVehicleTypeCodes(vehicle)
      : [];
    const scope = { scoped: vehicleScoped, compatibleTypeCodes };
    const checked = candidates.map((product) => ({
      product,
      verification: verifyProductAgainstCatalog(product, interpretation, scope),
    }));
    const verifiedCandidates = checked.filter(({ verification }) => verification.verified);
    if (verifiedCandidates.length === 0) {
      const reasons = checked.flatMap(({ verification }) => verification.issues);
      const compatibility = checked.some(({ verification }) => verification.vehicle === 'failed')
        ? 'NON_CONFORME'
        : 'NON_VERIFIEE';
      return withheld(reasons.length ? reasons : ['no candidate passed DB verification'], { compatibility });
    }

    const eligible = verifiedCandidates.map(({ product }) => product);
    const primary = options.chooseProduct?.(eligible) ?? this.responseService.selectPrimaryProduct(eligible) ?? eligible[0];
    const primaryVerification = verifiedCandidates.find(({ product }) => product === primary)?.verification
      ?? verifiedCandidates[0].verification;
    // The response and returned product card must describe the same one DB row.
    const shownProducts = [primary];
    const response = options.build(shownProducts);
    const responseCheck = checkResponseAgainstCatalog(response, shownProducts);
    const verificationFor = (
      aiAudit: AnswerVerification['aiAudit'],
      reasons: string[],
      aiFlags: AnswerVerification['aiFlags'],
      stockPrice: CheckStatus,
    ): AnswerVerification => ({
      compatibility: primaryVerification.vehicle === 'confirmed' ? 'CONFIRMEE'
        : primaryVerification.vehicle === 'failed' ? 'NON_CONFORME' : 'NON_VERIFIEE',
      checks: {
        identity: primaryVerification.identity,
        position: primaryVerification.position,
        qualifiers: primaryVerification.qualifiers,
        vehicle: primaryVerification.vehicle,
        stockPrice,
      },
      reasons, aiAudit, aiFlags,
    });
    if (responseCheck.status === 'failed') {
      return withheld(responseCheck.issues, verificationFor('skipped', responseCheck.issues, { effective: [], ignored: [] }, 'failed'));
    }

    const aiAudit = await this.flagInconsistencies(
      message,
      interpretation,
      vehicle,
      response,
      shownProducts.map((product) => ({
        product,
        verification: { ...primaryVerification, stockPrice: responseCheck.status },
      })),
      compatibleTypeCodes,
    );
    const decision = decideAfterAiFlags(
      [{ ...primaryVerification, stockPrice: responseCheck.status }],
      aiAudit.flags,
    );
    if (decision.ignored.length) {
      this.logger.log(`[AI-FLAGS] Ignored because DB checks settled them: ${JSON.stringify(decision.ignored)}`);
    }
    if (!decision.accept) {
      const reasons = decision.effective.map((flag) =>
        `AI ${flag.type}${flag.reference ? ` ${flag.reference}` : ''}: ${flag.detail ?? 'possible inconsistency'}`,
      );
      return withheld(reasons, verificationFor(aiAudit.status, reasons, decision, responseCheck.status));
    }

    return {
      accepted: true,
      response,
      products: shownProducts,
      verification: verificationFor(aiAudit.status, [], decision, responseCheck.status),
    };
  }

  private async flagInconsistencies(
    message: string,
    interpretation: StructuredQueryInterpretation,
    vehicle: any,
    response: string,
    rows: { product: any; verification: ProductVerification }[],
    compatibleTypeCodes: string[],
  ): Promise<{ status: 'ran' | 'unavailable'; flags: AiFlag[] }> {
    const systemPrompt = `You are a read-only inconsistency detector for a Suzuki parts chatbot. The supplied database rows are the only source of product facts. You cannot approve answers, select or suggest references, confirm vehicle compatibility, override deterministic checks, or write customer-facing text. Compare the customer request and structured interpretation with the shown DB designation and proposed response. Return only concrete suspected semantic inconsistencies. The application will decide using deterministic code; your flags are advisory and may only trigger a more cautious response when deterministic evidence is genuinely inconclusive.
Allowed flag types: PART_IDENTITY, POSITION, QUALIFIER, VEHICLE, PRICE_STOCK. Never flag a fact already confirmed by deterministicChecks. A reference must exactly match one of the supplied DB rows. Return only JSON: {"flags":[{"type":"PART_IDENTITY|POSITION|QUALIFIER|VEHICLE|PRICE_STOCK","reference":"DB reference","detail":"short reason"}]}. Return an empty flags array if there is no concrete concern.`;
    const payload = {
      customerMessage: message.replace(/\b[A-HJ-NPR-Z0-9]{17}\b/gi, '[VIN]'),
      interpretation: {
        normalized: interpretation.normalized,
        intent: interpretation.intent,
        catalogPart: interpretation.catalogPart,
        catalogAliases: interpretation.catalogAliases ?? [],
        positions: interpretation.positions,
        qualifiers: interpretation.qualifiers,
        uncertainty: interpretation.uncertainty,
      },
      vehicle: {
        marque: vehicle?.marque ?? null,
        modele: vehicle?.modele ?? null,
        compatibleTypeCodes,
      },
      databaseRows: rows.map(({ product, verification }) => ({
        reference: product.reference,
        frenchName: product.designation2 ?? product.designation_2 ?? null,
        englishName: product.designation ?? null,
        fitmentTypeCodes: (product.fitments ?? []).map((fitment: any) => fitment.typeCode).filter(Boolean),
        publicPriceTtc: product.prixTtc ?? product.prix_ttc ?? null,
        consolidatedStock: product.stock?.stockConsolide ?? product.stock?.stock_consolide ?? null,
        deterministicChecks: {
          identity: verification.identity,
          position: verification.position,
          qualifiers: verification.qualifiers,
          vehicle: verification.vehicle,
          stockPrice: verification.stockPrice,
        },
      })),
      proposedResponse: response,
    };

    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const raw = await Promise.race([
        this.openaiService.completeJson(systemPrompt, JSON.stringify(payload), 180),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => reject(new Error('AI cross-check timeout')), 6000);
        }),
      ]);
      const parsed = JSON.parse(raw);
      const allowedTypes: AiFlagType[] = ['PART_IDENTITY', 'POSITION', 'QUALIFIER', 'VEHICLE', 'PRICE_STOCK'];
      const flags: AiFlag[] = (Array.isArray(parsed?.flags) ? parsed.flags : [])
        .filter((flag: any) => flag && typeof flag === 'object')
        .map((flag: any) => ({
          type: allowedTypes.includes(flag.type) ? flag.type as AiFlagType : 'OTHER',
          reference: typeof flag.reference === 'string' ? flag.reference.trim() : null,
          detail: typeof flag.detail === 'string' ? flag.detail.slice(0, 200) : undefined,
        }));
      return { status: 'ran', flags };
    } catch (error: any) {
      this.logger.warn(`[AI-CROSSCHECK] unavailable; DB verification stands: ${error?.message}`);
      return { status: 'unavailable', flags: [] };
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  private async enrichClarifiedInterpretation(
    interpretation: StructuredQueryInterpretation,
    query: string,
  ): Promise<StructuredQueryInterpretation> {
    const normalizedQuery = normalizeForMatch(query);
    for (const [canonical, variants] of Object.entries(this.synonymsService.getInterpretationCandidates())) {
      const aliases = [...new Set([canonical, ...variants])];
      const hasAlias = aliases.some((alias) => {
        const normalizedAlias = normalizeForMatch(alias);
        if (` ${normalizedQuery} `.includes(` ${normalizedAlias} `)) return true;
        const compactAlias = normalizedAlias.replace(/[\s/-]+/g, '');
        return compactAlias.length >= 4 && normalizedQuery.replace(/[\s/-]+/g, '').includes(compactAlias);
      });
      if (hasAlias && await this.synonymsService.hasCatalogDesignationConcept(canonical, aliases)) {
        return {
          ...interpretation,
          normalized: query,
          catalogPart: interpretation.catalogPart ?? canonical,
          catalogAliases: interpretation.catalogAliases?.length ? interpretation.catalogAliases : variants,
          positions: extractRequestedPositions(query),
        };
      }
    }
    return { ...interpretation, normalized: query, positions: extractRequestedPositions(query) };
  }

  // ─────────────────────────────────────────────────────────────────
  // MAIN processMessage
  // ─────────────────────────────────────────────────────────────────
  async processMessage(
    message: string,
    vehicle?: any,
    sessionId?: string,
  ): Promise<ProcessMessageResponse> {
    const startTime = Date.now();

    // 0. Load the latest conversation turns before normalization so the
    // AI can resolve short elliptical follow-ups without guessing from
    // stale or unrelated session state.
    const session = await this.sessionService.getOrCreate(sessionId, vehicle);
    const previousHistory = await this.sessionService.getHistory(session.id);

    // 1. AI-powered normalization (context is used only for clear elliptical follow-ups)
    const normalized = await this.aiNormalizer.normalizeQuery(message, previousHistory, vehicle);
    const processedMessage = normalized.normalized;
    const safeLog = (s: string) => s.replace(/[\r\n\t]/g, ' ').slice(0, 200);
    this.logger.log(`Original: "${safeLog(message)}" → Normalized: "${safeLog(processedMessage)}"`);

    const userMessageId = await this.sessionService.saveUserMessage(session.id, message);
    this.contextService.invalidateCache(session.id);

    // 2. Get context
    const context             = await this.contextService.get(session.id);
    const conversationHistory = await this.sessionService.getHistory(session.id);

    // Handle greetings / thanks
    if (normalized.isGreeting || normalized.isThanks) {
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      // BUGFIX: never short-circuit on greeting if the message also contains a car part name
      const hasCarPart = this.synonymsService.isKnownAutomotiveTerm(processedMessage);
      if (!hasPositionOrAction && !hasCarPart) {
        const response = normalized.isGreeting
          ? this.responseService.buildGreetingResponse()
          : this.responseService.buildThanksResponse();
        await this.sessionService.saveBotResponse(session.id, response, {
          intent: normalized.isGreeting ? 'GREETING' : 'THANKS',
        });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'HIGH',
          intent:     normalized.isGreeting ? 'GREETING' : 'THANKS',
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId },
        };
      }
    }

    // Model mismatch blocking
    const vehicleModel   = this.vehicleModels.normalize(vehicle?.modele);
    const requestedModel = this.vehicleModels.detectModelInText(processedMessage);
    const isCarPartQuery = this.synonymsService.isKnownAutomotiveTerm(processedMessage);
    const isPriceOrAvailabilityQuery =
      !isCarPartQuery &&
      (/\b(prix|ch7al|combien|cout|tarif|disponible|famma|avoir)\b/i.test(message) ||
       /\b(prix|ch7al|combien|cout|tarif|disponible|famma|avoir)\b/i.test(processedMessage));

    if (!isPriceOrAvailabilityQuery && vehicleModel && requestedModel && vehicleModel !== requestedModel) {
      const response = this.responseService.buildModelMismatchResponse(vehicleModel, requestedModel);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'MODEL_MISMATCH' });
      return {
        response,
        sessionId:  session.id,
        products:   [],
        confidence: 'HIGH',
        intent:     'MODEL_MISMATCH',
        metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId },
      };
    }

    // 3. Filter operation check
    if (this.isFilterOperation(processedMessage) || (normalized.intent === 'FILTER' && normalized.confidence >= 0.6)) {
      const lastQuery = this.contextService.getLastQuery(session.id);
      if (!lastQuery) {
        const response = this.responseService.buildNoContextFilterResponse();
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'FILTER_NO_CONTEXT' });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'HIGH',
          intent:     'FILTER_NO_CONTEXT',
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 },
        };
      }

      const filter = this.parseFilter(processedMessage);
      if (filter) this.contextService.addFilter(session.id, filter);

      let products = await this.searchService.search(lastQuery, vehicle);
      products = this.strictValidator.validateResults(products, lastQuery, context);
      products = this.filterByVehicleModel(products, vehicle);

      const activeFilters     = this.contextService.getActiveFilters(session.id);
      const filteredProducts  = this.applyFilters(products, activeFilters);

      let response = this.responseService.buildFilteredResponse(filteredProducts, lastQuery, vehicle);
      let productsToReturn: any[] = [];
      let filterIntent = 'FILTER_APPLIED';
      let filterVerification: AnswerVerification | undefined;
      if (filteredProducts.length > 0) {
        const checked = await this.answerFromVerifiedProducts({
          message,
          interpretation: normalized,
          vehicle,
          products: filteredProducts,
          build: (shown) => this.responseService.buildFilteredResponse(shown, lastQuery, vehicle),
        });
        response = checked.response;
        filterVerification = checked.verification;
        if (checked.accepted) productsToReturn = checked.products.map((product) => this.mapProductForResponse(product));
        else filterIntent = 'SECURISATION';
      }
      await this.sessionService.saveBotResponse(session.id, response, {
        intent: filterIntent,
        productsFound: productsToReturn.length,
      });
      return {
        response,
        sessionId:  session.id,
        products:   productsToReturn,
        confidence: 'HIGH',
        intent:     filterIntent,
        metadata:   { productsFound: filteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0, verification: filterVerification },
      };
    }

    // 4. Clarification answer handling
    const pendingClarification = this.clarificationService.getPending(session.id);
    const isPendingClarificationAnswer =
      !!pendingClarification && this.clarificationService.isAnswer(processedMessage, pendingClarification);
    if (pendingClarification && !isPendingClarificationAnswer) {
      this.clarificationService.clearPending(session.id);
      this.logger.log('New request received; cleared the previous pending clarification');
    }

    if (pendingClarification && isPendingClarificationAnswer) {
      const partName = this.clarificationService.extractPartName(pendingClarification.originalQuery);
      this.logger.log(`Clarification answer: "${processedMessage}" for original: "${pendingClarification.originalQuery}"`);

      const isPositionAnswer = /^\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)?\s*$/i.test(message.trim());
      const enrichedQuery    = `${pendingClarification.originalQuery} ${processedMessage}`.trim();
      this.logger.log(`Enriched query: "${enrichedQuery}"`);

      if (pendingClarification.dimension === 'type') {
        this.logger.log(`TYPE clarification — re-searching clarified request: "${enrichedQuery}"`);
      }
      const clarifiedSearch = await this.searchService.searchWithDiagnostics(enrichedQuery, vehicle);
      let products: any[] = clarifiedSearch.products;
      const clarifiedConstraint: ConstraintOutcome | null = clarifiedSearch.constraint;

      this.clarificationService.clearPending(session.id);
      this.contextService.setLastPart(session.id, partName);

      products = this.strictValidator.validateResults(products, enrichedQuery, context);
      products = this.filterByVehicleModel(products, vehicle);

      // A type clarification is a hard constraint on the selected variant.
      // Match the answer against catalog words so "Base" cannot fall back to
      // the available but different "Antenne radio" product.
      if (pendingClarification.dimension === 'type') {
        const answerTokens = processedMessage
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .split(/[^a-z0-9]+/)
          .filter((token) => token.length > 1);
        if (answerTokens.length > 0) {
          const typedProducts = products.filter((product) => {
            const catalogTokens = this.getCombinedText(product)
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .split(/[^a-z0-9]+/)
              .filter((token) => token.length > 1);
            return answerTokens.every((token) => catalogTokens.includes(token));
          });
          if (typedProducts.length > 0) products = typedProducts;
        }
      }

      // Position answer refinement
      // FIX-8: French-priority resolution instead of scanning a merged
      // French+English blob — see header comment for full rationale.
      if (isPositionAnswer) {
        products = products.filter((p) => {
          const { hasAvant, hasArriere, hasGauche, hasDroite } = this.getPositionFlags(p);
          const answer = processedMessage.toLowerCase().trim();

          if ((answer === 'avant'   || answer === 'av') && hasArriere && !hasAvant) return false;
          if ((answer === 'arriere' || answer === 'arrière' || answer === 'ar') && hasAvant && !hasArriere) return false;
          if ((answer === 'gauche'  || answer === 'g')  && hasDroite && !hasGauche) return false;
          if ((answer === 'droite'  || answer === 'd'   || answer === 'droit') && hasGauche && !hasDroite) return false;

          if (answer === 'avant'   || answer === 'av')                            return hasAvant;
          if (answer === 'arriere' || answer === 'arrière' || answer === 'ar')    return hasArriere;
          if (answer === 'gauche'  || answer === 'g')                             return hasGauche;
          if (answer === 'droite'  || answer === 'd'   || answer === 'droit')     return hasDroite;

          return true;
        });
      }

      const clarificationCheck = this.clarificationService.checkNeeded(products, enrichedQuery);
      if (clarificationCheck.needed) {
        const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
        this.clarificationService.setPending(session.id, enrichedQuery, clarificationCheck.dimension, products);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'MEDIUM',
          intent:     'CLARIFICATION_NEEDED',
          metadata:   { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime },
        };
      }

      if (products.length > 0) {
        // FIX-7: selectPrimaryProduct() instead of products.slice(0, 1) —
        // guarantees the card matches the product buildProductResponse()
        // actually described in `response` below, not just whatever
        // happened to sort into index 0 of the raw array.
        const primaryProduct = this.responseService.selectPrimaryProduct(products);

        // FIX (confidence gate, email CarPro 2026-09-25): a clarification
        // answer narrows candidates but does not by itself guarantee
        // vehicle compatibility or a resolved model code — re-check
        // before committing to a confident answer here too.
        const securisationCheck = evaluateResponseConfidence({
          vehicle,
          vehicleModelResolved:    !!this.vehicleModels.normalize(vehicle?.modele),
          selectedProduct:         primaryProduct,
          understandingConfidence: normalized.confidence,
          unresolvedClarification: false,
          constraintOutcome:       clarifiedConstraint,
        });

        let response = this.responseService.buildSecurisationResponse(vehicle);
        let resolvedIntent = 'SECURISATION';
        let productToReturn: any = null;
        let clarifiedVerification: AnswerVerification | undefined;
        if (securisationCheck.secure && primaryProduct) {
          const clarificationInterpretation = await this.enrichClarifiedInterpretation(normalized, enrichedQuery);
          const checked = await this.answerFromVerifiedProducts({
            message,
            interpretation: clarificationInterpretation,
            vehicle,
            products,
            build: (shown) => this.responseService.buildProductResponse(shown, enrichedQuery, vehicle),
          });
          response = checked.response;
          clarifiedVerification = checked.verification;
          if (checked.accepted) {
            productToReturn = this.mapProductForResponse(checked.products[0]);
            resolvedIntent = 'PARTS_SEARCH';
          }
        }
        if (!securisationCheck.secure) {
          this.logger.log(`[SECURISATION] Clarified answer withheld (${securisationCheck.reasons.join(', ')})`);
        }

        await this.sessionService.saveBotResponse(session.id, response, { intent: resolvedIntent, productsFound: productToReturn ? 1 : 0 });
        return {
          response,
          sessionId:  session.id,
          products:   productToReturn ? [productToReturn] : [],
          confidence: productToReturn ? 'HIGH' : 'LOW',
          intent:     resolvedIntent,
          metadata:   { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10, duration: Date.now() - startTime, verification: clarifiedVerification },
        };
      } else {
        const response = clarifiedConstraint?.noExactMatch
          ? this.responseService.buildNoExactMatchResponse(clarifiedConstraint, vehicle)
          : this.responseService.buildNoResultsResponse(enrichedQuery, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'NO_RESULTS' });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'LOW',
          intent:     'NO_RESULTS',
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime },
        };
      }
    }

    // 5. Detect intent
    const fallbackIntent = await this.intelligenceService.detectIntentWithAI(
      processedMessage,
      conversationHistory,
      isPendingClarificationAnswer,
    );
    const intent = normalized.intent !== 'UNKNOWN' && normalized.confidence >= 0.6
      ? { ...fallbackIntent, type: normalized.intent }
      : fallbackIntent;

    const partName = this.extractPartName(processedMessage);
    if (partName) this.contextService.setLastPart(session.id, partName);

    // 6. Non-search intents
    if (intent.type === 'GREETING' || intent.type === 'THANKS') {
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      const hasCarPart = this.synonymsService.isKnownAutomotiveTerm(processedMessage);
      if (!hasPositionOrAction && !hasCarPart) {
        const response = intent.type === 'GREETING'
          ? this.responseService.buildGreetingResponse()
          : this.responseService.buildThanksResponse();
        await this.sessionService.saveBotResponse(session.id, response, { intent: intent.type });
        return {
          response,
          sessionId:  session.id,
          products:   [],
          confidence: 'HIGH',
          intent:     intent.type,
          metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId },
        };
      }
    }

    // Diagnostic redirect
    const isDiagnostic = normalized.intent === 'DIAGNOSTIC' || /\b(ne\s+d[eé]marre\s+pas|ne\s+fonctionne\s+pas|bruit|fuite|probleme|problème|panne|defectueux|cass[eé]|voyant|vibration|surchauffe|entretien|maintenance|bizarre|t9allek|ralenti|saccade|perte.*puissance|voiture.*mort|moteur.*fum[eé]e|démarre|démarre pas|démarrer|ne démarre|ne part pas|ne s'allume|caler|cale)\b/i.test(processedMessage);
    if (isDiagnostic) {
      const response = this.responseService.buildDiagnosticRedirectResponse();
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'DIAGNOSTIC_REDIRECT' });
      return {
        response,
        sessionId:  session.id,
        products:   [],
        confidence: 'HIGH',
        intent:     'DIAGNOSTIC_REDIRECT',
        metadata:   { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime, userMessageId },
      };
    }

    // Stock check with context
    if (intent.type === 'STOCK_CHECK' && context.lastPart) {
      const availabilityQuery = `${context.lastPart} ${vehicle?.modele ?? ''}`.trim();
      let stockProducts = await this.searchService.search(availabilityQuery, vehicle);
      stockProducts = this.strictValidator.validateResults(stockProducts, availabilityQuery, context);
      stockProducts = this.filterByVehicleModel(stockProducts, vehicle);

      if (stockProducts.length > 0) {
        const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
        const buildStockResponse = (shown: any[]): string => {
          const product = shown[0];
          if (stockIsAvailable(product)) {
            const publicPrice = product.prixTtc ?? product.prix_ttc;
            const numericPrice = publicPrice == null ? NaN : Number(publicPrice);
            const priceLine = Number.isFinite(numericPrice) ? ` — ${numericPrice.toFixed(3)} TND` : ' — prix non communiqué';
            return `Oui, ${context.lastPart} est disponible${vehicleInfo}.\n\nPRODUITS DISPONIBLES:\n• ${this.getEffectiveText(product)}${priceLine}\n\nContactez le Comptoir Pièces de Rechange CarPro au ☎️ 70 603 518 – 70 603 519 pour réserver.`;
          }
          return `Désolé, ${context.lastPart} n'est pas disponible actuellement${vehicleInfo}.\n\n💡 Veuillez contacter Car Pro – Comptoir Pièces de Rechange, Tél N° 70 603 518 – 70 603 519.`;
        };
        const checkedStock = await this.answerFromVerifiedProducts({
          message,
          interpretation: normalized,
          vehicle,
          products: stockProducts,
          build: buildStockResponse,
        });
        const response = checkedStock.response;
        const stockProductsToReturn = checkedStock.accepted
          ? checkedStock.products.map((product) => this.mapProductForResponse(product))
          : [];
        const stockIntent = checkedStock.accepted ? 'STOCK_CHECK' : 'SECURISATION';
        await this.sessionService.saveBotResponse(session.id, response, { intent: stockIntent });
        return {
          response,
          sessionId:  session.id,
          products:   stockProductsToReturn,
          confidence: stockIntent === 'STOCK_CHECK' ? 'HIGH' : 'LOW',
          intent:     stockIntent,
          metadata:   { productsFound: stockProductsToReturn.length, conversationLength: conversationHistory.length, queryClarity: 0, verification: checkedStock.verification },
        };
      }
    }

    if (intent.type === 'COMPLAINT') {
      const response = this.responseService.buildComplaintResponse();
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'COMPLAINT' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'COMPLAINT', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
    }
    if (intent.type === 'SERVICE_QUESTION') {
      const response = this.responseService.buildServiceQuestionResponse();
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'SERVICE_QUESTION' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'SERVICE_QUESTION', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
    }

    // 7. Reference search
    if (this.searchService.isReferenceQuery(processedMessage)) {
      const reference  = this.searchService.extractReference(processedMessage);
      let refProducts  = await this.searchService.search(processedMessage, vehicle);
      refProducts      = this.strictValidator.validateResults(refProducts, processedMessage, context);
      refProducts      = this.filterByVehicleModel(refProducts, vehicle);

      if (refProducts.length > 0) {
        const checkedReference = await this.answerFromVerifiedProducts({
          message,
          interpretation: normalized,
          vehicle,
          products: refProducts,
          requireUnderstanding: false,
          build: (shown) => this.responseService.buildReferenceResponse(reference, shown[0], vehicle),
        });
        const response = checkedReference.response;
        const referenceProduct = checkedReference.accepted
          ? this.mapProductForResponse(checkedReference.products[0])
          : null;
        const referenceIntent = checkedReference.accepted ? 'PARTS_SEARCH' : 'SECURISATION';
        await this.sessionService.saveBotResponse(session.id, response, { intent: referenceIntent, productsFound: referenceProduct ? 1 : 0 });
        return {
          response,
          sessionId:  session.id,
          products:   referenceProduct ? [referenceProduct] : [],
          confidence: referenceIntent === 'PARTS_SEARCH' ? 'HIGH' : 'LOW',
          intent:     referenceIntent,
          metadata:   { productsFound: referenceProduct ? 1 : 0, conversationLength: conversationHistory.length, queryClarity: 10, verification: checkedReference.verification },
        };
      } else {
        const response = this.responseService.buildReferenceNotFoundResponse(reference, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'NO_RESULTS' });
        return { response, sessionId: session.id, products: [], confidence: 'LOW', intent: 'NO_RESULTS', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
      }
    }

    // 8. Main search
    const searchQuery = this.contextService.buildSearchQuery(processedMessage, context, vehicle);
    const mainSearch  = await this.searchService.searchWithDiagnostics(searchQuery, vehicle);
    const mainConstraint: ConstraintOutcome | null = mainSearch.constraint;
    let products      = mainSearch.products;
    products          = this.strictValidator.validateResults(products, searchQuery, context);
    products          = this.filterByVehicleModel(products, vehicle);

    this.contextService.setLastQuery(session.id, searchQuery);
    if (products.length > 0) {
      const foundPart = this.extractPartName(searchQuery) || this.extractPartName(processedMessage);
      if (foundPart) this.contextService.setLastPart(session.id, foundPart);
    }

    // 9. Accessory pre-filter before clarification check
    const preFilteredProducts = this.filterAccessoriesIfNeeded(products, processedMessage);
    this.logger.log(`[ACCESSORY-FILTER] Pre-clarification: ${products.length} → ${preFilteredProducts.length}`);

    // 10. Clarification check
    const clarificationCheck = this.clarificationService.checkNeeded(preFilteredProducts, processedMessage);
    const hasExplicitFilterType = /\b(filtre|filter)\s+(?:de\s+)?(?:habitacle|climatiseur|air|huile|carburant|gazoile|essence)\b/i.test(processedMessage);
    if (clarificationCheck.needed && !hasExplicitFilterType) {
      const clPartName = this.clarificationService.extractPartName(processedMessage);
      const response   = this.clarificationService.buildQuestion(clPartName, clarificationCheck.variants, clarificationCheck.dimension);
      this.clarificationService.setPending(session.id, searchQuery, clarificationCheck.dimension, preFilteredProducts);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
      return {
        response,
        sessionId:  session.id,
        products:   [],
        confidence: 'MEDIUM',
        intent:     'CLARIFICATION_NEEDED',
        metadata:   { productsFound: preFilteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0 },
      };
    }

    // 11. Build final response
    this.logger.log(`[RESPONSE-BUILD] ${preFilteredProducts.length} products, intent: ${intent.type}`);

    let response: string;
    let resolvedIntent = preFilteredProducts.length > 0 ? 'PARTS_SEARCH' : intent.type;
    const primaryProduct = this.responseService.selectPrimaryProduct(preFilteredProducts);

    // FIX (confidence gate, email CarPro 2026-09-25 — "sécurisation des
    // réponses", 4-condition version): evaluate compatibility / model
    // code / understanding / consistency BEFORE committing to a
    // confident answer. This can override a found product — the rule
    // is about confidence, not result count. See chat/confidence-gate.ts.
    const securisationCheck = evaluateResponseConfidence({
      vehicle,
      vehicleModelResolved:    !!vehicleModel,
      selectedProduct:         primaryProduct,
      understandingConfidence: normalized.confidence,
      unresolvedClarification: false,
      constraintOutcome:       mainConstraint,
    });
    const hasAnswerToSecure =
      !!primaryProduct || (intent.type === 'PRICE_INQUIRY' && preFilteredProducts.length > 0);

    if (!securisationCheck.secure && hasAnswerToSecure) {
      this.logger.log(
        `[SECURISATION] Response withheld (${securisationCheck.reasons.join(', ')}) ` +
        `for query "${safeLog(processedMessage)}"`,
      );
      response = this.responseService.buildSecurisationResponse(vehicle);
      resolvedIntent = 'SECURISATION';
    } else if (intent.type === 'PRICE_INQUIRY') {
      response = this.responseService.buildPriceResponse(
        preFilteredProducts, processedMessage, vehicle, context.lastTopic || 'général',
      );
    } else if (preFilteredProducts.length > 0) {
      response = this.responseService.buildProductResponse(preFilteredProducts, searchQuery, vehicle);
    } else if (mainConstraint?.noExactMatch && products.length === 0) {
      response = this.responseService.buildNoExactMatchResponse(mainConstraint, vehicle);
    } else {
      response = this.responseService.buildNoResultsResponse(searchQuery, vehicle);
    }

    let securedProduct: any = null;
    let mainVerification: AnswerVerification | undefined;
    if (securisationCheck.secure && preFilteredProducts.length > 0) {
      const checked = await this.answerFromVerifiedProducts({
        message,
        interpretation: normalized,
        vehicle,
        products: preFilteredProducts,
        build: (shown) => intent.type === 'PRICE_INQUIRY'
          ? this.responseService.buildPriceResponse(shown, processedMessage, vehicle, context.lastTopic || 'général')
          : this.responseService.buildProductResponse(shown, searchQuery, vehicle),
      });
      response = checked.response;
      mainVerification = checked.verification;
      if (checked.accepted) securedProduct = checked.products[0];
      else resolvedIntent = 'SECURISATION';
    }

    await this.sessionService.saveBotResponse(session.id, response, {
      intent: resolvedIntent,
      productsFound: securedProduct ? 1 : 0,
    });

    // 12. Confidence + suggestions
    const queryClarity = this.intelligenceService.analyzeQueryClarity(processedMessage);
    const confidence   = this.intelligenceService.calculateConfidence({
      productsFound:          preFilteredProducts.length,
      exactMatch:             preFilteredProducts.some((p) => p.score > 500),
      conversationContext:    conversationHistory.length,
      userFeedbackHistory:    0,
      queryClarity,
    });
    const suggestions  = this.intelligenceService.generateSmartSuggestions(processedMessage, preFilteredProducts);

    return {
      response,
      sessionId:      session.id,
      products:       securedProduct ? [this.mapProductForResponse(securedProduct)] : [],
      confidence:     securedProduct ? confidence.level : 'LOW',
      confidenceScore: securedProduct ? confidence.score : 0,
      suggestions:    [],
      intent:         resolvedIntent,
      metadata: {
        productsFound:       preFilteredProducts.length,
        conversationLength:  conversationHistory.length,
        queryClarity,
        duration:            Date.now() - startTime,
        userMessageId,
        verification:        mainVerification,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: filterAccessoriesIfNeeded — checks BOTH text fields
  // ─────────────────────────────────────────────────────────────────
  private filterAccessoriesIfNeeded(products: any[], query: string): any[] {
    const queryLower = query.toLowerCase();

    const accessoryWords = [
      'durite', 'tuyau', 'flexible', 'support', 'cache', 'kit', 'joint', 'bouchon', 'vis',
      'boulon', 'ecrou', 'agrafe', 'agraffe', 'cercle', 'cable', 'câble', 'courroie', 'sangle',
      'toc', 'bushing', 'silent', 'silentbloc', 'coupelle',
      // BUGFIX: door/hood accessories that were ranking above the actual panel
      'contacteur', 'loquet', 'serrure', 'charniere', 'montant', 'tiran', 'tirant', 'adhesif',
      'chapeau', 'agrafe', 'tige', 'arret', 'switcher', 'reservoir',
      // BUGFIX: radiateur accessories — prevent false side clarification on radiateur query
      'traverse', 'tete', 'vase',
      // BUGFIX: capot accessories — calle/cale capot must not outrank the actual capot panel
      'calle', 'cale',
      // BUGFIX: calandre accessories — chrome trim, isolant must not trigger type clarification
      // NOTE: 'grille' removed — it is a synonym for calandre (main part), not an accessory
      'chrome', 'isolant', 'sigle', 'monogramme',
      // BUGFIX: filtre queries — durit/tuyau/boitier are accessories of the filter assembly,
      // not the filter element itself. Only applies when the query is about a filter.
      ...(queryLower.includes('filtre') ? ['durit', 'boitier', 'tuyau'] : []),
    ];
    const explicitAccessoryWords = [
      'support', 'joint', 'contacteur', 'loquet', 'serrure', 'charniere',
      'charnière', 'agrafe', 'agraffe', 'agraphe', 'vis', 'boulon', 'ecrou',
      'kit', 'sangle', 'cable', 'câble', 'toc', 'bushing', 'silentbloc',
      // BUGFIX 2026-09-13: 'accessoire'/'accessoires' itself — if the
      // customer explicitly asks for an accessory, don't filter it out.
      'accessoire', 'accessoires',
    ];
    const userAskedForAccessory = explicitAccessoryWords.some((w) =>
      new RegExp(`(^|\\s)${w}(\\s|$)`, 'i').test(queryLower),
    );
    const mainParts:   any[] = [];
    const accessories: any[] = [];

    for (const p of products) {
      // FIX 2026-09-13 (root cause of "pare-brise/pare-choc → returned
      // an accessory" reports): this used to rely ONLY on the
      // accessoryWords keyword list scanned against the designation
      // text. That list has no way to catch something like "Accessoire
      // pour pare-chocs" — none of its words appear in that text, so it
      // sailed through as a "main part" for a bumper/windshield query.
      // parts.categorie already has a dedicated 'ACCESSOIRES' value
      // (confirmed in the live data) — checking it directly is the
      // reliable, data-driven signal the keyword list was trying to
      // approximate. Both signals are kept: categorie catches anything
      // tagged as an accessory regardless of wording, the keyword list
      // still catches consumables/hardware that aren't tagged
      // 'ACCESSOIRES' in categorie but still aren't "the main part"
      // (a bolt, a clip, a hose clamp, ...).
      const categorie = String(p.categorie ?? '').trim().toUpperCase();
      const isTaggedAccessory = categorie === 'ACCESSOIRES';

      const combined = this.getCombinedText(p).toLowerCase();
      const containsAccessoryWord = accessoryWords.some((w) => {
        const regex = new RegExp(`(^|\\s)${w}(\\s|$)`, 'i');
        return regex.test(combined);
      });

      if (isTaggedAccessory || containsAccessoryWord) {
        accessories.push(p);
        this.logger.log(
          `[ACCESSORY-FILTER] Detected accessory: "${this.getEffectiveText(p)}" ` +
          `(categorie=${categorie || 'n/a'}, keyword=${containsAccessoryWord})`,
        );
      } else {
        mainParts.push(p);
      }
    }

    if (userAskedForAccessory) {
      this.logger.log(`[ACCESSORY-FILTER] User asked for accessory — returning ${accessories.length} accessories`);
      return accessories;
    }

    if (mainParts.length > 0) {
      this.logger.log(`[ACCESSORY-FILTER] ${mainParts.length} main parts, ${accessories.length} accessories — returning main only`);
      return mainParts;
    }

    this.logger.log(`[ACCESSORY-FILTER] Only accessories found (${accessories.length}) — returning none for a main-part request`);
    return [];
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: extractPartName — checks both text fields for part names
  // ─────────────────────────────────────────────────────────────────
  private extractPartName(message: string): string {
    const lower = message.toLowerCase();

    // Multi-word parts first
    if (lower.includes('plaquette') && lower.includes('frein'))  return 'plaquettes frein';
    if (lower.includes('disque')    && lower.includes('frein'))  return 'disque frein';
    if (lower.includes('filtre')    && lower.includes('air'))    return 'filtre air';
    if (lower.includes('filtre')    && lower.includes('huile'))  return 'filtre huile';
    if (lower.includes('essuie')    && lower.includes('glace'))  return 'essuie-glace';
    if (lower.includes('pare')      && lower.includes('choc'))   return 'pare-choc';
    if ((lower.includes('maitre') || lower.includes('maître')) && lower.includes('cylindre')) return 'maitre cylindre';
    if (lower.includes('monte')     && lower.includes('glace'))  return 'monte glace';

    // Use synonym map from AdvancedSearchService
    try {
      const synonymMap = this.advancedSearch.getSynonymMap();
      let bestMatch: string | undefined;
      let bestLength  = 0;

      for (const [category, synonyms] of Object.entries(synonymMap)) {
        for (const syn of synonyms as string[]) {
          if (lower.includes(syn) && syn.length > bestLength) {
            bestLength = syn.length;
            bestMatch  = category;
          }
        }
      }
      return bestMatch || '';
    } catch {
      return '';
    }
  }
  private filterByVehicleModel(products: any[], vehicle?: any): any[] {
    const model = this.vehicleModels.normalize(vehicle?.modele);
    if (!model) return products;

    return products.filter((p) => {
      if (Array.isArray(p.fitments) && p.fitments.length > 0) {
        const combinedText = [p.displayName, p.designation2, p.designation]
          .filter(Boolean).join(' ').toUpperCase();
        const hasOtherModel = this.vehicleModels.hasModelInDesignation(combinedText) &&
                              !this.vehicleModels.matchesModel(combinedText, model);
        return !hasOtherModel;
      }

      // Universal part (no fitment rows) — check designation for model name
      const combinedText = [p.displayName, p.designation2, p.designation]
        .filter(Boolean).join(' ').toUpperCase();
      const hasModel = this.vehicleModels.hasModelInDesignation(combinedText);
      return !hasModel || this.vehicleModels.matchesModel(combinedText, model);
    });
  }

  private levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b.charAt(i - 1) === a.charAt(j - 1)
            ? matrix[i - 1][j - 1]
            : Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1,
              );
      }
    }
    return matrix[b.length][a.length];
  }
}