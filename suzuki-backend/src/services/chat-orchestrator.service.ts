// src/services/chat-orchestrator.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: All product mappings in API responses now use displayName
//         (designation_2 French first, designation English fallback)
//         instead of always using raw designation (English OEM).
//
// FIX-2: filterAccessoriesIfNeeded() now checks BOTH designation_2
//         and designation when scanning for accessory words, so
//         French-named accessories are correctly detected.
//
// FIX-3: applyFilters() checks position/side in BOTH text fields.
//
// FIX-4: filterByVehicleModel() uses displayName in log output.
//
// FIX-5: extractPartName() checks both fields when building context.
//
// FIX-6: processMessage() maps products consistently via
//         mapProductForResponse() helper that always uses displayName.
//
// FIX-7 (2026-07-08): the chat TEXT and the products[]/card data were
//         being selected by two DIFFERENT pieces of logic on the same
//         array — buildProductResponse()/buildPriceResponse() split
//         preFilteredProducts into available/unavailable internally
//         and can describe a different product than
//         preFilteredProducts[0]/products[0], which is what the card
//         was built from. Symptom: chat text said "Pièces
//         disponibles... 499.048 TND" (an available LUNETTE AR) while
//         the expandable card showed a DIFFERENT LUNETTE AR reference
//         (2253.495 TND, Indisponible) — because the card just took
//         index 0 regardless of availability.
//         Fix: added ResponseService.selectPrimaryProduct() (single
//         source of truth for "which product are we talking about"),
//         and both the main search/PRICE_INQUIRY return block and the
//         clarification-answer return block now call it instead of
//         duplicating ad-hoc slice(0, 1) selection. This guarantees
//         the card the customer expands always matches the product
//         named in the chat bubble.
//
// FIX-8 (2026-07-08): PERMANENT FIX for false position/side rejections
//         in the clarification-answer position filter and applyFilters().
//         Both previously scanned a MERGED French+English text blob
//         (getCombinedText) for avant/arrière/gauche/droite. Because
//         the English OEM text commonly carries "LH"/"RH" abbreviations
//         that don't always agree with the French side label (a
//         documented data-quality gap — see schema.prisma: "33% NULL
//         designation_2", inconsistent backfills), a part correctly
//         labelled e.g. "OPTIQUE D" (droite) in French could get
//         filtered out here even after correctly surviving search and
//         strict validation. Root-caused via
//         AdvancedSearchService.calculatePositionMatches — same class
//         of bug, same fix applied here: both call sites now use
//         getPositionFlags(), which resolves each axis independently
//         from designation_2 FIRST, only consulting designation
//         (English) when French has no signal at all for that axis.
// ═══════════════════════════════════════════════════════════════════

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

  // ─────────────────────────────────────────────────────────────────
  // FIX-8 (2026-07-08): French-priority position/side token patterns.
  // See header comment above for full rationale.
  // ─────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────
  // FIX-1 + FIX-6: Centralised product mapper for API responses.
  // Always surfaces designation_2 (French) as the primary name.
  // Also includes both raw fields so the frontend can choose.
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

  private mapProductForResponse(p: any): any {
    // displayName is already set by AdvancedSearchService.formatPartResult().
    // Fall back gracefully if calling code passes a raw Prisma row.
    // BUGFIX: '??' and '||' cannot be mixed without parentheses (TS5076).
    // Wrapped the designation2/designation fallback chain explicitly.
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
      // BUGFIX: these two fields are declared in chat.controller.ts's
      // EnrichedProductField interface but were never populated here,
      // so they always arrived as undefined in productsDetail[].
      fabricant:        p.fabricant        ?? null,
      fournisseurCode:  p.fournisseurCode  ?? null,
      source:       p.source ?? null,
      // BUGFIX (consistency with chat.controller.ts enrichProduct / response.service.ts
      // getSourceSuffix / stock.service.ts resolveSourceLabel): compute sourceLabel
      // from source when not already set, instead of silently falling through to null.
      sourceLabel:  p.sourceLabel ?? (p.source === '02_CARPRO' ? 'CarPro Parts' : p.source === '01_PROD' ? 'Suzuki OEM' : null),
      // BUGFIX-1 (consistency with AdvancedSearchService.formatPartResult):
      // stock must never be null in the API response. If a raw Prisma row
      // is passed in directly (fallback path) and has no stock row,
      // default to Indisponible/0 instead of leaking null to the frontend.
      stock: this.formatStock(p.stock),
      // BUGFIX (root cause of empty fitments[] in productsDetail): this
      // mapper was building a brand-new object and never copying p.fitments
      // through from AdvancedSearchService.formatPartResult(). Every product
      // reached the controller's enrichProduct() with fitments already gone,
      // so it always showed fitments: [] regardless of real fitment data.
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

  // ─────────────────────────────────────────────────────────────────
  // FIX-8 (2026-07-08): French-priority position/side resolver.
  // For EACH axis independently (avant/arrière, gauche/droite): if
  // designation_2 (French) has any signal on that axis, trust it
  // exclusively and ignore designation (English) for that axis.
  // English is only consulted when French says nothing at all about
  // that axis. This mirrors AdvancedSearchService.calculatePositionMatches
  // and StrictValidatorService.computePositionFlags — see header
  // comment for the full rationale.
  // ─────────────────────────────────────────────────────────────────
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
        this.logger.log(`TYPE clarification — filtering ${pendingClarification.products.length} pending products`);
        const answerLower = processedMessage.toLowerCase().trim();
        const mainTypes   = ['air', 'huile', 'gazoile', 'habitacle', 'carburant', 'essence', 'climatiseur'];
        const matchedType = mainTypes.find((t) => answerLower.includes(t));

        products = pendingClarification.products.filter((p) => {
          // FIX-2: check combined text for type filtering
          const combined = this.getCombinedText(p).toLowerCase();
          if (matchedType) return combined.includes(matchedType);
          const words = combined.split(/\s+/);
          return words.some(
            (word) =>
              word.includes(answerLower) ||
              answerLower.includes(word) ||
              this.levenshteinDistance(word, answerLower) <= 2,
          );
        });
        this.logger.log(`After type filtering: ${products.length} products (matched: ${matchedType || 'general'})`);
      } else {
        products = await this.searchService.search(enrichedQuery, vehicle);
      }

      this.clarificationService.clearPending(session.id);
      this.contextService.setLastPart(session.id, partName);

      products = this.strictValidator.validateResults(products, enrichedQuery, context);
      products = this.filterByVehicleModel(products, vehicle);

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
    if (clarificationCheck.needed) {
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

    // FIX-7 (2026-07-08): selectPrimaryProduct() replaces the previous
    // preFilteredProducts.slice(0, 1) selection, which could pick a
    // DIFFERENT product than the one `response` above (buildProductResponse()
    // / buildPriceResponse()) actually described — e.g. text said
    // "Pièces disponibles... 499.048 TND" (an available LUNETTE AR) while
    // the card showed a different, out-of-stock LUNETTE AR reference at
    // 2253.495 TND. Both the text and the card now derive from the same
    // selection logic (ResponseService.selectPrimaryProduct), covering
    // both the normal PARTS_SEARCH path and the PRICE_INQUIRY path since
    // they share this one return block.
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

    const userAskedForAccessory = accessoryWords.some((w) => queryLower.includes(w));
    if (userAskedForAccessory) {
      this.logger.log(`[ACCESSORY-FILTER] User asked for accessory — returning all ${products.length}`);
      return products;
    }

    const mainParts:   any[] = [];
    const accessories: any[] = [];

    for (const p of products) {
      // FIX-2: scan BOTH fields for accessory word detection
      const combined = this.getCombinedText(p).toLowerCase();

      const containsAccessoryWord = accessoryWords.some((w) => {
        const regex = new RegExp(`(^|\\s)${w}(\\s|$)`, 'i');
        return regex.test(combined);
      });

      if (containsAccessoryWord) {
        accessories.push(p);
        this.logger.log(`[ACCESSORY-FILTER] Detected accessory: "${this.getEffectiveText(p)}"`);
      } else {
        mainParts.push(p);
      }
    }

    if (mainParts.length > 0) {
      this.logger.log(`[ACCESSORY-FILTER] ${mainParts.length} main parts, ${accessories.length} accessories — returning main only`);
      return mainParts;
    }

    this.logger.log(`[ACCESSORY-FILTER] Only accessories found (${accessories.length}) — returning all`);
    return products;
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

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: filterByVehicleModel — uses displayName in log output
  // BUGFIX-4: fitment.modelName contains type codes like "ABU310-TYPE1"
  //   NOT friendly model names like "S-PRESSO". Normalizing a type code
  //   against vehicleModels returns null → every fitment-bearing part
  //   was being wrongly stripped. Fix: treat any part WITH fitments as
  //   compatible (fitment exists = part is for some Suzuki model) and
  //   only filter when designation explicitly names a DIFFERENT model.
  // ─────────────────────────────────────────────────────────────────
  private filterByVehicleModel(products: any[], vehicle?: any): any[] {
    const model = this.vehicleModels.normalize(vehicle?.modele);
    if (!model) return products;

    return products.filter((p) => {
      // BUGFIX-4: If the part has fitments, the fitment.modelName is an
      // internal type code (e.g. "ABU310-TYPE1"), NOT a friendly model name.
      // vehicleModels.normalize() returns null for type codes, causing all
      // fitment-bearing parts to be wrongly rejected.
      //
      // Correct logic:
      //  - If part has fitments → it is already matched to specific vehicle
      //    types by the search query scope. Keep it (don't double-filter).
      //  - If part has NO fitments → it may be a universal part or a part
      //    whose designation mentions a specific model. Only filter then.
      if (Array.isArray(p.fitments) && p.fitments.length > 0) {
        // Part has fitment data — it passed the search filter already.
        // Only reject if designation explicitly names a DIFFERENT model.
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