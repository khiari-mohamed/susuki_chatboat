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

  private readonly carPartNames = [
    'maitre', 'maître', 'cylindre', 'etrier', 'étrier', 'toit', 'cremaillere', 'crémaillère',
    'filtre', 'plaquette', 'disque', 'amortisseur', 'phare', 'batterie', 'courroie', 'bougie',
    'alternateur', 'démarreur', 'capteur', 'pneu', 'joint', 'durite', 'radiateur', 'pompe',
    'injecteur', 'embrayage', 'roulement', 'rotule', 'biellette', 'bras', 'triangle',
    'ressort', 'silentbloc', 'soufflet', 'cache', 'support', 'agrafe', 'agraffe', 'agraphe',
    'valve', 'soupape', 'culasse', 'piston', 'segment', 'bielle', 'vilebrequin',
    'silencieux', 'clignotant',
  ];
  private static readonly AVANT_RE   = /\b(avant|av|front|fr)\b/i;
  private static readonly ARRIERE_RE = /\b(arriere|arrière|ar|rear|rr)\b/i;
  private static readonly GAUCHE_RE  = /\b(gauche|g|left|lh)\b/i;
  private static readonly DROITE_RE  = /\b(droite|droit|d|right|rh)\b/i;

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
      stock?.stockConsolide ?? stock?.stock_consolide ?? totalQuantity,
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


  private getPositionFlags(p: any): {
    hasAvant: boolean;
    hasArriere: boolean;
    hasGauche: boolean;
    hasDroite: boolean;
  } {
    const frenchText   = (p.designation2 ?? p.designation_2 ?? '').toString();
    const fallbackText = (p.designation ?? '').toString();

    const frHasAvant   = ChatOrchestratorService.AVANT_RE.test(frenchText);
    const frHasArriere = ChatOrchestratorService.ARRIERE_RE.test(frenchText);
    const frHasGauche  = ChatOrchestratorService.GAUCHE_RE.test(frenchText);
    const frHasDroite  = ChatOrchestratorService.DROITE_RE.test(frenchText);

    const hasAvant   = (frHasAvant || frHasArriere) ? frHasAvant   : ChatOrchestratorService.AVANT_RE.test(fallbackText);
    const hasArriere = (frHasAvant || frHasArriere) ? frHasArriere : ChatOrchestratorService.ARRIERE_RE.test(fallbackText);
    const hasGauche  = (frHasGauche || frHasDroite) ? frHasGauche  : ChatOrchestratorService.GAUCHE_RE.test(fallbackText);
    const hasDroite  = (frHasGauche || frHasDroite) ? frHasDroite  : ChatOrchestratorService.DROITE_RE.test(fallbackText);

    return { hasAvant, hasArriere, hasGauche, hasDroite };
  }

  // ─────────────────────────────────────────────────────────────────
  private isFilterOperation(message: string): boolean {
    const lower = message.toLowerCase();
    const isCarPart = this.carPartNames.some((part) => lower.includes(part));
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

  // ─────────────────────────────────────────────────────────────────
  // MAIN processMessage
  // ─────────────────────────────────────────────────────────────────
  async processMessage(
    message: string,
    vehicle?: any,
    sessionId?: string,
  ): Promise<ProcessMessageResponse> {
    const startTime = Date.now();

    // 0. AI-powered normalization
    const normalized       = await this.aiNormalizer.normalizeQuery(message);
    const processedMessage = normalized.normalized;
    this.logger.log(`Original: "${message}" → Normalized: "${processedMessage}"`);

    // 1. Get / create session
    const session       = await this.sessionService.getOrCreate(sessionId, vehicle);
    const userMessageId = await this.sessionService.saveUserMessage(session.id, message);
    this.contextService.invalidateCache(session.id);

    // 2. Get context
    const context             = await this.contextService.get(session.id);
    const conversationHistory = await this.sessionService.getHistory(session.id);

    // Handle greetings / thanks
    if (normalized.isGreeting || normalized.isThanks) {
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      // BUGFIX: never short-circuit on greeting if the message also contains a car part name
      const hasCarPart = this.carPartNames.some((part) => processedMessage.toLowerCase().includes(part));
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
    const isCarPartQuery = this.carPartNames.some((part) =>
      processedMessage.toLowerCase().includes(part),
    );
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
    if (this.isFilterOperation(processedMessage)) {
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

      const response = this.responseService.buildFilteredResponse(filteredProducts, lastQuery, vehicle);
      await this.sessionService.saveBotResponse(session.id, response, {
        intent: 'FILTER_APPLIED',
        productsFound: filteredProducts.length,
      });
      return {
        response,
        sessionId:  session.id,
        // FIX-6: use mapProductForResponse
        products:   filteredProducts.slice(0, 1).map((p) => this.mapProductForResponse(p)),
        confidence: 'HIGH',
        intent:     'FILTER_APPLIED',
        metadata:   { productsFound: filteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0 },
      };
    }

    // 4. Clarification answer handling
    const pendingClarification = this.clarificationService.getPending(session.id);
    if (pendingClarification && this.clarificationService.isAnswer(processedMessage, pendingClarification)) {
      const partName = this.clarificationService.extractPartName(pendingClarification.originalQuery);
      this.logger.log(`Clarification answer: "${processedMessage}" for original: "${pendingClarification.originalQuery}"`);

      const isPositionAnswer = /^\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)?\s*$/i.test(message.trim());
      const enrichedQuery    = `${pendingClarification.originalQuery} ${processedMessage}`.trim();
      this.logger.log(`Enriched query: "${enrichedQuery}"`);

      let products: any[];

      if (pendingClarification.dimension === 'type') {
        this.logger.log(`TYPE clarification — re-searching clarified request: "${enrichedQuery}"`);
        products = await this.searchService.search(enrichedQuery, vehicle);
      } else {
        products = await this.searchService.search(enrichedQuery, vehicle);
      }

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
        const response = this.responseService.buildProductResponse(products, enrichedQuery, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'PARTS_SEARCH', productsFound: products.length });
        // FIX-7: selectPrimaryProduct() instead of products.slice(0, 1) —
        // guarantees the card matches the product buildProductResponse()
        // actually described in `response` above, not just whatever
        // happened to sort into index 0 of the raw array.
        const primaryProduct = this.responseService.selectPrimaryProduct(products);
        return {
          response,
          sessionId:  session.id,
          products:   primaryProduct ? [this.mapProductForResponse(primaryProduct)] : [],
          confidence: 'HIGH',
          intent:     'PARTS_SEARCH',
          metadata:   { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10, duration: Date.now() - startTime },
        };
      } else {
        const response = this.responseService.buildNoResultsResponse(enrichedQuery, vehicle);
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
    const intent = await this.intelligenceService.detectIntentWithAI(
      processedMessage,
      conversationHistory,
      !!pendingClarification,
    );

    const partName = this.extractPartName(processedMessage);
    if (partName) this.contextService.setLastPart(session.id, partName);

    // 6. Non-search intents
    if (intent.type === 'GREETING' || intent.type === 'THANKS') {
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      const hasCarPart = this.carPartNames.some((part) => processedMessage.toLowerCase().includes(part));
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
    const isDiagnostic = /\b(ne\s+d[eé]marre\s+pas|ne\s+fonctionne\s+pas|bruit|fuite|probleme|problème|panne|defectueux|cass[eé]|voyant|vibration|surchauffe|entretien|maintenance|bizarre|t9allek|ralenti|saccade|perte.*puissance|voiture.*mort|moteur.*fum[eé]e|démarre|démarre pas|démarrer|ne démarre|ne part pas|ne s'allume|caler|cale)\b/i.test(processedMessage);
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
          (p) => Number(p.stock?.stockConsolide ?? p.stock?.stock_consolide ?? p.stock?.totalQuantity ?? 0) > 2 || p.available,
        );
        const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
        // FIX-1: use French name in stock response
        const response    = available.length > 0
          ? `Oui, ${context.lastPart} est disponible${vehicleInfo}.\n\nPRODUITS DISPONIBLES:\n${
              available.slice(0, 1).map((p) => `• ${this.getEffectiveText(p)} — ${p.prixHt} TND`).join('\n')
            }\n\nContactez CarPro au ☎️ 70 603 500 pour réserver.`
          : `Désolé, ${context.lastPart} n'est pas disponible actuellement${vehicleInfo}. Contactez CarPro au ☎️ 70 603 500.`;
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'STOCK_CHECK' });
        return {
          response,
          sessionId:  session.id,
          // FIX-6
          products:   available.slice(0, 1).map((p) => this.mapProductForResponse(p)),
          confidence: 'HIGH',
          intent:     'STOCK_CHECK',
          metadata:   { productsFound: available.length, conversationLength: conversationHistory.length, queryClarity: 0 },
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
        const response = this.responseService.buildReferenceResponse(reference, refProducts[0], vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'PARTS_SEARCH', productsFound: refProducts.length });
        return {
          response,
          sessionId:  session.id,
          // FIX-6
          products:   refProducts.slice(0, 1).map((p) => this.mapProductForResponse(p)),
          confidence: 'HIGH',
          intent:     'PARTS_SEARCH',
          metadata:   { productsFound: refProducts.length, conversationLength: conversationHistory.length, queryClarity: 10 },
        };
      } else {
        const response = this.responseService.buildReferenceNotFoundResponse(reference, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'NO_RESULTS' });
        return { response, sessionId: session.id, products: [], confidence: 'LOW', intent: 'NO_RESULTS', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
      }
    }

    // 8. Main search
    const searchQuery = this.contextService.buildSearchQuery(processedMessage, context, vehicle);
    let products      = await this.searchService.search(searchQuery, vehicle);
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
    const resolvedIntent = preFilteredProducts.length > 0 ? 'PARTS_SEARCH' : intent.type;

    if (intent.type === 'PRICE_INQUIRY') {
      response = this.responseService.buildPriceResponse(
        preFilteredProducts, processedMessage, vehicle, context.lastTopic || 'général',
      );
    } else if (preFilteredProducts.length > 0) {
      response = this.responseService.buildProductResponse(preFilteredProducts, searchQuery, vehicle);
    } else {
      response = this.responseService.buildNoResultsResponse(searchQuery, vehicle);
    }

    await this.sessionService.saveBotResponse(session.id, response, {
      intent: resolvedIntent,
      productsFound: preFilteredProducts.length,
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
    const primaryProduct = this.responseService.selectPrimaryProduct(preFilteredProducts);

    return {
      response,
      sessionId:      session.id,
      products:       primaryProduct ? [this.mapProductForResponse(primaryProduct)] : [],
      confidence:     confidence.level,
      confidenceScore: confidence.score,
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
    if (userAskedForAccessory) {
      this.logger.log(`[ACCESSORY-FILTER] User asked for accessory — returning all ${products.length}`);
      return products;
    }

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