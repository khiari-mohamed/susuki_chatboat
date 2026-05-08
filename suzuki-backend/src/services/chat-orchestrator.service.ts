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

  private isFilterOperation(message: string): boolean {
    const lower = message.toLowerCase();
    
    // CRITICAL: Don't treat car part queries as filter operations
    const isCarPart = this.carPartNames.some(part => lower.includes(part));
    if (isCarPart) {
      return false; // Car parts are not filter operations
    }
    
    const filterPhrases = [
      'appliquer un filtre', 'ajoute un filtre', 'mettre un filtre',
      'filtre pour', 'filtre sur', 'ne montrer que', 'seulement',
      'filtrer', 'tri par', 'trier'
    ];
    return filterPhrases.some(phrase => lower.includes(phrase));
  }

  private parseFilter(message: string): any {
    const lower = message.toLowerCase();
    if (/\b(arriere|arrière|ar)\b/.test(lower)) return { position: 'arrière' };
    if (/\b(avant|av)\b/.test(lower)) return { position: 'avant' };
    if (/\b(gauche|g)\b/.test(lower)) return { side: 'gauche' };
    if (/\b(droite|d|droit)\b/.test(lower)) return { side: 'droite' };
    return null;
  }

  private applyFilters(products: any[], filters: any[]): any[] {
    if (!filters || filters.length === 0) return products;
    
    return products.filter(p => {
      return filters.every(f => {
        const designation = p.designation.toLowerCase();
        
        if (f.position) {
          const hasPosition = f.position === 'avant'
            ? /\b(avant|av)\b/i.test(designation)
            : /\b(arriere|arrière|ar)\b/i.test(designation);
          if (!hasPosition) return false;
        }
        
        if (f.side) {
          const hasSide = f.side === 'gauche'
            ? /\b(gauche|g)\b/i.test(designation)
            : /\b(droite|droit|d)\b/i.test(designation);
          if (!hasSide) return false;
        }
        
        return true;
      });
    });
  }

  async processMessage(message: string, vehicle?: any, sessionId?: string): Promise<ProcessMessageResponse> {
    const startTime = Date.now();

    // 0. AI-POWERED NORMALIZATION - Handle typos, Tunisian, greetings
    const normalized = await this.aiNormalizer.normalizeQuery(message);
    const processedMessage = normalized.normalized;
    
    this.logger.log(`Original: "${message}" → Normalized: "${processedMessage}"`);

    // 1. Get/create session
    const session = await this.sessionService.getOrCreate(sessionId, vehicle);
    const userMessageId = await this.sessionService.saveUserMessage(session.id, message);
    this.contextService.invalidateCache(session.id);

    // 2. Get context
    const context = await this.contextService.get(session.id);
    const conversationHistory = await this.sessionService.getHistory(session.id);

    // Handle greetings/thanks detected by AI
    if (normalized.isGreeting || normalized.isThanks) {
      // CRITICAL: Double-check if it contains position/action keywords
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      
      if (!hasPositionOrAction) {
        const response = normalized.isGreeting 
          ? this.responseService.buildGreetingResponse() 
          : this.responseService.buildThanksResponse();
        await this.sessionService.saveBotResponse(session.id, response, { intent: normalized.isGreeting ? 'GREETING' : 'THANKS' });
        return { 
          response, 
          sessionId: session.id, 
          products: [], 
          confidence: 'HIGH', 
          intent: normalized.isGreeting ? 'GREETING' : 'THANKS', 
          metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId } 
        };
      }
    }

    // Model mismatch blocking
    const vehicleModel = this.vehicleModels.normalize(vehicle?.modele);
    const requestedModel = this.vehicleModels.detectModelInText(processedMessage);

    // Check if it's a car part query first
    const isCarPartQuery = this.carPartNames.some(part => processedMessage.toLowerCase().includes(part));
    
    const isPriceOrAvailabilityQuery =
      !isCarPartQuery && (
        /\b(prix|ch7al|combien|cout|tarif|disponible|famma|avoir)\b/i.test(message) ||
        /\b(prix|ch7al|combien|cout|tarif|disponible|famma|avoir)\b/i.test(processedMessage)
      );

    if (
      !isPriceOrAvailabilityQuery &&
      vehicleModel &&
      requestedModel &&
      vehicleModel !== requestedModel
    ) {
      const response = this.responseService.buildModelMismatchResponse(vehicleModel, requestedModel);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'MODEL_MISMATCH' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'HIGH',
        intent: 'MODEL_MISMATCH',
        metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId }
      };
    }

    // 3. Check for filter operation BEFORE clarification
    if (this.isFilterOperation(processedMessage)) {
      const lastQuery = this.contextService.getLastQuery(session.id);
      if (!lastQuery) {
        const response = this.responseService.buildNoContextFilterResponse();
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'FILTER_NO_CONTEXT' });
        return {
          response,
          sessionId: session.id,
          products: [],
          confidence: 'HIGH',
          intent: 'FILTER_NO_CONTEXT',
          metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 }
        };
      }
      
      // Parse and store filter
      const filter = this.parseFilter(processedMessage);
      if (filter) {
        this.contextService.addFilter(session.id, filter);
      }
      
      // Re-run last search
      let products = await this.searchService.search(lastQuery, vehicle);
      
      // CRITICAL: Apply strict validation
      products = this.strictValidator.validateResults(products, lastQuery, context);
      products = this.filterByVehicleModel(products, vehicle);
      
      // Apply all active filters
      const activeFilters = this.contextService.getActiveFilters(session.id);
      const filteredProducts = this.applyFilters(products, activeFilters);
      
      const response = this.responseService.buildFilteredResponse(filteredProducts, lastQuery, vehicle);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'FILTER_APPLIED', productsFound: filteredProducts.length });
      return {
        response,
        sessionId: session.id,
        products: filteredProducts.slice(0, 1).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt) })),
        confidence: 'HIGH',
        intent: 'FILTER_APPLIED',
        metadata: { productsFound: filteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0 }
      };
    }

    // 4. Check for clarification answer
    const pendingClarification = this.clarificationService.getPending(session.id);
    if (pendingClarification && this.clarificationService.isAnswer(processedMessage, pendingClarification)) {
      const partName = this.clarificationService.extractPartName(pendingClarification.originalQuery);
      this.logger.log(`Clarification answer: "${processedMessage}" for original: "${pendingClarification.originalQuery}"`);
      
      const isPositionAnswer = /^\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)?\s*$/i.test(message.trim());
      this.logger.log(`isPositionAnswer check: "${message.trim()}" → ${isPositionAnswer}`);
      
      // CRITICAL: Combine original query with answer BEFORE clearing pending
      const enrichedQuery = `${pendingClarification.originalQuery} ${processedMessage}`.trim();
      this.logger.log(`Enriched query: "${enrichedQuery}"`);
      
      let products: any[];
      
      // CRITICAL: For TYPE clarifications, filter pending products instead of new search
      if (pendingClarification.dimension === 'type') {
        this.logger.log(`TYPE clarification - filtering ${pendingClarification.products.length} pending products by "${processedMessage}"`);
        const answerLower = processedMessage.toLowerCase().trim();
        const mainTypes = ['air', 'huile', 'gazoile', 'habitacle', 'carburant', 'essence', 'climatiseur'];
        const matchedType = mainTypes.find(t => answerLower.includes(t));
        
        products = pendingClarification.products.filter(p => {
          const designation = p.designation.toLowerCase();
          if (matchedType) {
            return designation.includes(matchedType);
          }
          // Fuzzy match: check if any word in designation contains answer or vice versa
          const words = designation.split(/\s+/);
          return words.some(word => 
            word.includes(answerLower) || answerLower.includes(word) ||
            this.levenshteinDistance(word, answerLower) <= 2
          );
        });
        this.logger.log(`After type filtering: ${products.length} products (matched: ${matchedType || 'general'})`);
      } else {
        // For position/side clarifications, do enriched search
        products = await this.searchService.search(enrichedQuery, vehicle);
      }
      
      // Clear pending AFTER using products
      this.clarificationService.clearPending(session.id);
      this.contextService.setLastPart(session.id, partName);
      
      // CRITICAL: Apply strict validation BEFORE vehicle filtering
      products = this.strictValidator.validateResults(products, enrichedQuery, context);
      products = this.filterByVehicleModel(products, vehicle);
      
      // Apply position validation on fresh results
      if (isPositionAnswer) {
        products = products.filter(p => {
          const designation = p.designation.toLowerCase();
          const answer = processedMessage.toLowerCase().trim();
          
          const hasAvant = /\b(avant|av)\b/i.test(designation);
          const hasArriere = /\b(arriere|arrière|ar)\b/i.test(designation);
          const hasGauche = /\b(gauche|g)\b/i.test(designation);
          const hasDroite = /\b(droite|droit|d)\b/i.test(designation);
          
          // Reject wrong positions
          if ((answer === 'avant' || answer === 'av') && hasArriere) return false;
          if ((answer === 'arriere' || answer === 'arrière' || answer === 'ar') && hasAvant) return false;
          if ((answer === 'gauche' || answer === 'g') && hasDroite) return false;
          if ((answer === 'droite' || answer === 'd' || answer === 'droit') && hasGauche) return false;
          
          // Accept correct positions
          if (answer === 'avant' || answer === 'av') return hasAvant;
          if (answer === 'arriere' || answer === 'arrière' || answer === 'ar') return hasArriere;
          if (answer === 'gauche' || answer === 'g') return hasGauche;
          if (answer === 'droite' || answer === 'd' || answer === 'droit') return hasDroite;
          
          return true;
        });
      }
        
      // Check if still needs clarification
      const clarificationCheck = this.clarificationService.checkNeeded(products, enrichedQuery);
      if (clarificationCheck.needed) {
        const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
        this.clarificationService.setPending(session.id, enrichedQuery, clarificationCheck.dimension, products);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
        return {
          response,
          sessionId: session.id,
          products: [],
          confidence: 'MEDIUM',
          intent: 'CLARIFICATION_NEEDED',
          metadata: { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime }
        };
      }
      
      if (products.length > 0) {
        const response = this.responseService.buildProductResponse(products, enrichedQuery, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'PARTS_SEARCH', productsFound: products.length });
        return {
          response,
          sessionId: session.id,
          products: products.slice(0, 1).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt) })),
          confidence: 'HIGH',
          intent: 'PARTS_SEARCH',
          metadata: { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10, duration: Date.now() - startTime }
        };
      } else {
        const response = this.responseService.buildNoResultsResponse(enrichedQuery, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'NO_RESULTS' });
        return {
          response,
          sessionId: session.id,
          products: [],
          confidence: 'LOW',
          intent: 'NO_RESULTS',
          metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime }
        };
      }
    }

    // 5. Detect intent using AI-powered understanding
    const intent = await this.intelligenceService.detectIntentWithAI(processedMessage, conversationHistory, !!pendingClarification);

    // Store last part for context
    const partName = this.extractPartName(processedMessage);
    if (partName) {
      this.contextService.setLastPart(session.id, partName);
    }

    // 6. Handle non-search intents
    if (intent.type === 'GREETING' || intent.type === 'THANKS') {
      // CRITICAL: Final check - don't treat position queries as greetings
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      
      if (!hasPositionOrAction) {
        const response = intent.type === 'GREETING' 
          ? this.responseService.buildGreetingResponse() 
          : this.responseService.buildThanksResponse();
        await this.sessionService.saveBotResponse(session.id, response, { intent: intent.type });
        return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: intent.type, metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, userMessageId } };
      }
    }
    
    // Handle diagnostic queries BEFORE building search query
    const isDiagnostic = /\b(ne\s+d[eé]marre\s+pas|ne\s+fonctionne\s+pas|bruit|fuite|probleme|problème|panne|defectueux|cass[eé]|voyant|vibration|surchauffe|entretien|maintenance|bizarre|t9allek|ralenti|saccade|perte.*puissance|voiture.*mort|moteur.*fum[eé]e|démarre|démarre pas|démarrer|ne démarre|ne part pas|ne s'allume|caler|cale)\b/i.test(processedMessage);
    if (isDiagnostic) {
      const response = this.responseService.buildDiagnosticRedirectResponse();
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'DIAGNOSTIC_REDIRECT' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'DIAGNOSTIC_REDIRECT', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0, duration: Date.now() - startTime, userMessageId } };
    }
    
    // Handle availability check with context
    if (intent.type === 'STOCK_CHECK' && context.lastPart) {
      const availabilityQuery = `${context.lastPart} ${vehicle?.modele || 'S-PRESSO'}`;
      let stockProducts = await this.searchService.search(availabilityQuery, vehicle);
      
      // CRITICAL: Apply strict validation
      stockProducts = this.strictValidator.validateResults(stockProducts, availabilityQuery, context);
      stockProducts = this.filterByVehicleModel(stockProducts, vehicle);
      
      if (stockProducts.length > 0) {
        const available = stockProducts.filter(p => p.stock?.statut === 'Disponible' || p.available);
        const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
        const response = available.length > 0 
          ? `Oui, ${context.lastPart} est disponible${vehicleInfo}.\n\nPRODUITS DISPONIBLES:\n${available.slice(0, 1).map(p => `• ${p.designation} — ${p.prixHt} TND`).join('\n')}\n\nContactez CarPro au ☎️ 70 603 500 pour réserver.`
          : `Désolé, ${context.lastPart} n'est pas disponible actuellement${vehicleInfo}. Contactez CarPro au ☎️ 70 603 500.`;
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'STOCK_CHECK' });
        return { response, sessionId: session.id, products: available.slice(0, 1).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt) })), confidence: 'HIGH', intent: 'STOCK_CHECK', metadata: { productsFound: available.length, conversationLength: conversationHistory.length, queryClarity: 0 } };
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

    // 7. Handle reference search
    if (this.searchService.isReferenceQuery(processedMessage)) {
      const reference = this.searchService.extractReference(processedMessage);
      let refProducts = await this.searchService.search(processedMessage, vehicle);
      
      // CRITICAL: Apply strict validation
      refProducts = this.strictValidator.validateResults(refProducts, processedMessage, context);
      refProducts = this.filterByVehicleModel(refProducts, vehicle);
      
      if (refProducts.length > 0) {
        const response = this.responseService.buildReferenceResponse(reference, refProducts[0], vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'PARTS_SEARCH', productsFound: refProducts.length });
        return {
          response,
          sessionId: session.id,
          products: refProducts.slice(0, 1).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt) })),
          confidence: 'HIGH',
          intent: 'PARTS_SEARCH',
          metadata: { productsFound: refProducts.length, conversationLength: conversationHistory.length, queryClarity: 10 }
        };
      } else {
        const response = this.responseService.buildReferenceNotFoundResponse(reference, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'NO_RESULTS' });
        return { response, sessionId: session.id, products: [], confidence: 'LOW', intent: 'NO_RESULTS', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
      }
    }

    // 8. Build search query with context - USE AI-NORMALIZED MESSAGE for search
    const searchQuery = this.contextService.buildSearchQuery(processedMessage, context, vehicle);
    let products = await this.searchService.search(searchQuery, vehicle);
    
    // CRITICAL: Apply strict validation BEFORE vehicle filtering
    products = this.strictValidator.validateResults(products, searchQuery, context);
    products = this.filterByVehicleModel(products, vehicle);
    
    const filteredProducts = products;
    
    // Store lastQuery after search
    this.contextService.setLastQuery(session.id, searchQuery);
    
    // Store lastPart after successful search
    if (filteredProducts.length > 0) {
      const partName = this.extractPartName(searchQuery) || this.extractPartName(processedMessage);
      if (partName) {
        this.contextService.setLastPart(session.id, partName);
      }
    }
    

    // 9. CRITICAL: Filter accessories BEFORE clarification check
    const preFilteredProducts = this.filterAccessoriesIfNeeded(filteredProducts, processedMessage);
    this.logger.log(`[ACCESSORY-FILTER] Pre-clarification filter: ${filteredProducts.length} → ${preFilteredProducts.length} products`);

    // 10. Check if clarification needed (on filtered products)
    const clarificationCheck = this.clarificationService.checkNeeded(preFilteredProducts, processedMessage);
    if (clarificationCheck.needed) {
      const partName = this.clarificationService.extractPartName(processedMessage);
      const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
      this.clarificationService.setPending(session.id, searchQuery, clarificationCheck.dimension, preFilteredProducts);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'MEDIUM',
        intent: 'CLARIFICATION_NEEDED',
        metadata: { productsFound: preFilteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0 }
      };
    }

    // 11. Build response based on intent
    this.logger.log(`[RESPONSE-BUILD] Building response for ${preFilteredProducts.length} products, intent: ${intent.type}`);
    
    let response: string;
    // Override intent to PARTS_SEARCH when we actually found and returned parts
    const resolvedIntent = preFilteredProducts.length > 0 ? 'PARTS_SEARCH' : intent.type;

    if (intent.type === 'PRICE_INQUIRY') {
      response = this.responseService.buildPriceResponse(preFilteredProducts, processedMessage, vehicle, context.lastTopic || 'général');
    } else if (preFilteredProducts.length > 0) {
      response = this.responseService.buildProductResponse(preFilteredProducts, searchQuery, vehicle);
    } else {
      response = this.responseService.buildNoResultsResponse(searchQuery, vehicle);
    }

    await this.sessionService.saveBotResponse(session.id, response, { intent: resolvedIntent, productsFound: preFilteredProducts.length });

    // 12. Calculate confidence and suggestions
    const queryClarity = this.intelligenceService.analyzeQueryClarity(processedMessage);
    const confidence = this.intelligenceService.calculateConfidence({
      productsFound: preFilteredProducts.length,
      exactMatch: preFilteredProducts.some(p => p.score > 500),
      conversationContext: conversationHistory.length,
      userFeedbackHistory: 0,
      queryClarity
    });
    const suggestions = this.intelligenceService.generateSmartSuggestions(processedMessage, preFilteredProducts);

    return {
      response,
      sessionId: session.id,
      products: preFilteredProducts.slice(0, 1).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt) })),
      confidence: confidence.level,
      confidenceScore: confidence.score,
      suggestions: [],
      intent: resolvedIntent,
      metadata: { productsFound: preFilteredProducts.length, conversationLength: conversationHistory.length, queryClarity, duration: Date.now() - startTime, userMessageId }
    };
  }

  private filterAccessoriesIfNeeded(products: any[], query: string): any[] {
    const queryLower = query.toLowerCase();
    
    // Accessory keywords that indicate user wants accessories
    const accessoryWords = ['durite', 'tuyau', 'flexible', 'support', 'cache', 'kit', 'joint', 'bouchon', 'vis', 'boulon', 'ecrou', 'agrafe', 'agraffe', 'cercle', 'cable', 'câble', 'courroie', 'sangle'];
    
    const userAskedForAccessory = accessoryWords.some(w => queryLower.includes(w));
    
    // If user explicitly asked for accessory, return all
    if (userAskedForAccessory) {
      this.logger.log(`[ACCESSORY-FILTER] User asked for accessory - returning all ${products.length} products`);
      return products;
    }
    
    // User asked for main part - separate main parts from accessories
    const mainParts: any[] = [];
    const accessories: any[] = [];
    
    for (const p of products) {
      const designation = p.designation.toLowerCase();
      const containsAccessoryWord = accessoryWords.some(w => designation.includes(w));
      
      if (containsAccessoryWord) {
        accessories.push(p);
      } else {
        mainParts.push(p);
      }
    }
    
    // If we have main parts, return only main parts (filter out accessories)
    if (mainParts.length > 0) {
      this.logger.log(`[ACCESSORY-FILTER] Found ${mainParts.length} main parts and ${accessories.length} accessories - returning main parts only`);
      return mainParts;
    }
    
    // If we only have accessories, return all (user asked for main part but DB only has accessories)
    this.logger.log(`[ACCESSORY-FILTER] Only accessories found (${accessories.length}) - returning all`);
    return products;
  }

  private extractPartName(message: string): string {
    const lower = message.toLowerCase();
    
    // Common multi-word parts first
    if (lower.includes('plaquette') && lower.includes('frein')) return 'plaquettes frein';
    if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
    if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
    if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
    if (lower.includes('essuie') && lower.includes('glace')) return 'essuie-glace';
    if (lower.includes('pare') && lower.includes('choc')) return 'pare-choc';
    if (lower.includes('maitre') && lower.includes('cylindre')) return 'maitre cylindre';
    if (lower.includes('maître') && lower.includes('cylindre')) return 'maitre cylindre';
    
    // DYNAMIC: Use synonym map from AdvancedSearchService
    try {
      const synonymMap = this.advancedSearch.getSynonymMap();
      let bestMatch: string | undefined;
      let bestLength = 0;
      
      for (const [category, synonyms] of Object.entries(synonymMap)) {
        for (const syn of synonyms as string[]) {
          if (lower.includes(syn) && syn.length > bestLength) {
            bestLength = syn.length;
            bestMatch = category;
          }
        }
      }
      
      return bestMatch || '';
    } catch (error) {
      // Fallback to empty if synonym map not available
      return '';
    }
  }

  private filterByVehicleModel(products: any[], vehicle?: any): any[] {
    const model = this.vehicleModels.normalize(vehicle?.modele);
    if (!model) return products;

    return products.filter(p => {
      // If the part has fitment rows, use them for precise model matching
      if (Array.isArray(p.fitments) && p.fitments.length > 0) {
        return p.fitments.some((f: any) => this.vehicleModels.normalize(f.modelName) === model);
      }
      // Universal part (no fitment restrictions): fall back to designation text
      const designation = (p.designation || '').toUpperCase();
      const hasModel = this.vehicleModels.hasModelInDesignation(designation);
      return !hasModel || this.vehicleModels.matchesModel(designation, model);
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
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}
