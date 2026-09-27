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
import { getCatalogPositions, normalizeForMatch } from '../chat/part-constraints';
import type { ConstraintOutcome } from '../chat/part-constraints';
import { evaluateResponseConfidence } from '../chat/confidence-gate';
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
  };
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

  private async verifyCatalogResponse(
    userMessage: string,
    interpretation: StructuredQueryInterpretation,
    vehicle: any,
    response: string,
    products: any[],
  ): Promise<boolean> {
    const candidates = [...new Map(
      (products ?? [])
        .filter((product) => typeof product?.reference === 'string' && product.reference.trim())
        .map((product) => [product.reference.trim().toUpperCase(), product]),
    ).values()];
    if (candidates.length === 0 || interpretation.confidence < 0.6) return false;

    const candidateReferences = candidates.map((product) => product.reference.trim().toUpperCase());
    const vehicleScope = this.advancedSearch.getLastSearchDebug()?.vehicleScope;
    const compatibleTypeCodes: string[] = vehicleScope?.typeCodes ?? [];
    if ((vehicle?.vin || vehicle?.modele) && compatibleTypeCodes.length === 0) return false;
    const evidence = candidates.map((product) => {
      const rawPrice = product.prixTtc ?? product.prix_ttc;
      const stock = Number(product.stock?.stockConsolide ?? product.stock?.stock_consolide ?? 0);
      const frenchName = product.designation2 ?? product.designation_2 ?? null;
      const fitmentTypeCodes: string[] = (product.fitments ?? [])
        .map((fitment: any) => fitment.typeCode)
        .filter(Boolean);
      const universal = fitmentTypeCodes.length === 0;
      const fitmentCompatible = universal || fitmentTypeCodes.some((code) => compatibleTypeCodes.includes(code));
      const priceDisplayForms = rawPrice == null || !Number.isFinite(Number(rawPrice))
        ? []
        : [...new Set([String(rawPrice), `${Number(rawPrice).toFixed(3)} TND`])];
      return {
        reference: product.reference,
        frenchName,
        englishName: product.designation ?? null,
        publicPriceTtcRaw: rawPrice == null ? null : String(rawPrice),
        publicPriceTtcDisplayed: rawPrice == null || !Number.isFinite(Number(rawPrice))
          ? null
          : `${Number(rawPrice).toFixed(3)} TND`,
        priceDisplayForms,
        consolidatedStock: stock,
        availableByBusinessRule: stock >= 2,
        fitmentTypeCodes,
        fitmentCompatibleWithVehicle: fitmentCompatible,
        universalByExistingCatalogRule: universal,
        expectedCustomerName: frenchName ?? product.designation ?? null,
      };
    });

    const normalizedResponse = normalizeForMatch(response);
    for (const item of evidence) {
      const expectedName = normalizeForMatch(item.expectedCustomerName ?? '');
      if (expectedName && !normalizedResponse.includes(expectedName)) return false;

      const saysAvailable = /\bdisponibles?\b/.test(normalizedResponse);
      const saysUnavailable = /\bindisponibles?\b/.test(normalizedResponse);
      if (item.availableByBusinessRule ? !saysAvailable || saysUnavailable : !saysUnavailable) return false;

      const displayedPrice = item.priceDisplayForms.some((price: string) =>
        normalizedResponse.includes(normalizeForMatch(price)),
      );
      if (item.availableByBusinessRule && item.publicPriceTtcRaw != null && !displayedPrice) return false;
      if (!item.availableByBusinessRule && displayedPrice) return false;
      if (!item.fitmentCompatibleWithVehicle) return false;
    }

    const systemPrompt = `You are a read-only semantic cross-checker for a Suzuki parts chatbot. The database rows supplied by the application are the only source of truth. You must never invent, substitute, or select a reference.
Your narrow task is to verify that the selected DB designation represents the part concept requested by the customer, is not merely a related accessory/subcomponent, and matches the requested position/qualifiers. Compare the current request and structured interpretation to the actual French/English designation fields and structured position evidence.
Do NOT judge or require customer-facing prose to mention internal fitment codes, explain compatibility, stock quantities, price arithmetic, or improve wording. The application has already checked those deterministic facts and response fields. Never reject solely because the response does not print internal codes. If the part identity or requested position cannot be confirmed from the supplied designation evidence, set consistent=false. Do not rewrite the response.
Return only JSON: {"consistent":true|false,"confirmedReferences":["..."],"issues":["..."]}. confirmedReferences may contain only references present in the supplied DB evidence.`;
    const userPayload = {
      customerMessage: userMessage,
      interpretation: {
        normalized: interpretation.normalized,
        intent: interpretation.intent,
        catalogPart: interpretation.catalogPart,
        positions: interpretation.positions,
        qualifiers: interpretation.qualifiers,
        confidence: interpretation.confidence,
        uncertainty: interpretation.uncertainty,
      },
      vehicle: {
        marque: vehicle?.marque ?? null,
        modele: vehicle?.modele ?? null,
        typeCode: vehicle?.typeCode ?? null,
        compatibleTypeCodes,
      },
      databaseEvidence: evidence,
      proposedResponse: response,
    };

    try {
      const raw = await this.openaiService.completeJson(
        systemPrompt,
        JSON.stringify(userPayload),
        180,
      );
      const audit = JSON.parse(raw);
      const confirmed = Array.isArray(audit.confirmedReferences)
        ? audit.confirmedReferences.map((reference: unknown) => String(reference).trim().toUpperCase())
        : [];
      const onlyDatabaseReferences = confirmed.every((reference: string) => candidateReferences.includes(reference));
      const allCandidatesConfirmed = candidateReferences.every((reference) => confirmed.includes(reference));
      const accepted = audit.consistent === true && onlyDatabaseReferences && allCandidatesConfirmed;
      if (!accepted) {
        this.logger.warn(`[AI-ANSWER-AUDIT] Rejected DB-backed answer: ${JSON.stringify(audit.issues ?? [])}`);
      }
      return accepted;
    } catch (error: any) {
      this.logger.error(`[AI-ANSWER-AUDIT] Audit failed; withholding catalog answer: ${error?.message}`);
      return false;
    }
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
      const selectedProduct = this.responseService.selectPrimaryProduct(filteredProducts);
      let productsToReturn = selectedProduct ? [this.mapProductForResponse(selectedProduct)] : [];
      let filterIntent = 'FILTER_APPLIED';
      if (
        selectedProduct &&
        !await this.verifyCatalogResponse(message, normalized, vehicle, response, [selectedProduct])
      ) {
        response = this.responseService.buildSecurisationResponse(vehicle);
        productsToReturn = [];
        filterIntent = 'SECURISATION';
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
        metadata:   { productsFound: filteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0 },
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

        let response = securisationCheck.secure
          ? this.responseService.buildProductResponse(products, enrichedQuery, vehicle)
          : this.responseService.buildSecurisationResponse(vehicle);
        let resolvedIntent = securisationCheck.secure ? 'PARTS_SEARCH' : 'SECURISATION';
        let productToReturn = securisationCheck.secure && primaryProduct ? this.mapProductForResponse(primaryProduct) : null;
        if (
          securisationCheck.secure &&
          primaryProduct &&
          !await this.verifyCatalogResponse(message, normalized, vehicle, response, [primaryProduct])
        ) {
          response = this.responseService.buildSecurisationResponse(vehicle);
          resolvedIntent = 'SECURISATION';
          productToReturn = null;
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
          metadata:   { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10, duration: Date.now() - startTime },
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
      const availabilityQuery = `${context.lastPart} ${vehicle?.modele || 'S-PRESSO'}`;
      let stockProducts = await this.searchService.search(availabilityQuery, vehicle);
      stockProducts = this.strictValidator.validateResults(stockProducts, availabilityQuery, context);
      stockProducts = this.filterByVehicleModel(stockProducts, vehicle);

      if (stockProducts.length > 0) {
        const available   = stockProducts.filter(
          (p) => Number(p.stock?.stockConsolide ?? p.stock?.stock_consolide ?? 0) >= 2,
        );
        const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
        // FIX-1: use French name in stock response
        let response    = available.length > 0
          ? `Oui, ${context.lastPart} est disponible${vehicleInfo}.\n\nPRODUITS DISPONIBLES:\n${
              available.slice(0, 1).map((p) => {
                const publicPrice = p.prixTtc ?? p.prix_ttc;
                const priceLine = publicPrice != null ? ` — ${publicPrice} TND` : ' — prix non communiqué';
                return `• ${this.getEffectiveText(p)}${priceLine}`;
              }).join('\n')
            }\n\nContactez le Comptoir Pièces de Rechange CarPro au ☎️ 70 603 518 – 70 603 519 pour réserver.`
          : `Désolé, ${context.lastPart} n'est pas disponible actuellement${vehicleInfo}.\n\n💡 Veuillez contacter Car Pro – Comptoir Pièces de Rechange, Tél N° 70 603 518 – 70 603 519.`;
        const productToAudit = available[0] ?? stockProducts[0];
        let stockProductsToReturn = available.slice(0, 1).map((p) => this.mapProductForResponse(p));
        let stockIntent = 'STOCK_CHECK';
        if (
          productToAudit &&
          !await this.verifyCatalogResponse(message, normalized, vehicle, response, [productToAudit])
        ) {
          response = this.responseService.buildSecurisationResponse(vehicle);
          stockProductsToReturn = [];
          stockIntent = 'SECURISATION';
        }
        await this.sessionService.saveBotResponse(session.id, response, { intent: stockIntent });
        return {
          response,
          sessionId:  session.id,
          products:   stockProductsToReturn,
          confidence: stockIntent === 'STOCK_CHECK' ? 'HIGH' : 'LOW',
          intent:     stockIntent,
          metadata:   { productsFound: stockProductsToReturn.length, conversationLength: conversationHistory.length, queryClarity: 0 },
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
        let response = this.responseService.buildReferenceResponse(reference, refProducts[0], vehicle);
        let referenceProduct = this.mapProductForResponse(refProducts[0]);
        let referenceIntent = 'PARTS_SEARCH';
        if (!await this.verifyCatalogResponse(message, normalized, vehicle, response, [refProducts[0]])) {
          response = this.responseService.buildSecurisationResponse(vehicle);
          referenceProduct = null;
          referenceIntent = 'SECURISATION';
        }
        await this.sessionService.saveBotResponse(session.id, response, { intent: referenceIntent, productsFound: referenceProduct ? 1 : 0 });
        return {
          response,
          sessionId:  session.id,
          products:   referenceProduct ? [referenceProduct] : [],
          confidence: referenceIntent === 'PARTS_SEARCH' ? 'HIGH' : 'LOW',
          intent:     referenceIntent,
          metadata:   { productsFound: referenceProduct ? 1 : 0, conversationLength: conversationHistory.length, queryClarity: 10 },
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

    let securedProduct = securisationCheck.secure ? primaryProduct : null;
    if (securisationCheck.secure && hasAnswerToSecure && primaryProduct) {
      const auditPassed = await this.verifyCatalogResponse(
        message,
        normalized,
        vehicle,
        response,
        [primaryProduct],
      );
      if (!auditPassed) {
        response = this.responseService.buildSecurisationResponse(vehicle);
        resolvedIntent = 'SECURISATION';
        securedProduct = null;
      }
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