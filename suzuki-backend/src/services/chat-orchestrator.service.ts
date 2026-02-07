import { Injectable, Logger } from '@nestjs/common';
import { SessionService } from './session.service';
import { ClarificationService } from './clarification.service';
import { ContextService } from './context.service';
import { ResponseService } from './response.service';
import { SearchService } from './search.service';
import { IntelligenceService } from '../chat/intelligence.service';
import { OpenAIService } from '../chat/openai.service';
import { AIQueryNormalizerService } from './ai-query-normalizer.service';
import { SUZUKI_MODELS, hasModelInDesignation, matchesModel } from '../constants/vehicle-models';

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
    error?: string;
  };
}

@Injectable()
export class ChatOrchestratorService {
  private readonly logger = new Logger(ChatOrchestratorService.name);

  constructor(
    private sessionService: SessionService,
    private clarificationService: ClarificationService,
    private contextService: ContextService,
    private responseService: ResponseService,
    private searchService: SearchService,
    private intelligenceService: IntelligenceService,
    private openaiService: OpenAIService,
    private aiNormalizer: AIQueryNormalizerService
  ) {
    setInterval(() => this.clarificationService.cleanup(), 300000);
  }

  async processMessage(message: string, vehicle?: any, sessionId?: string): Promise<ProcessMessageResponse> {
    const startTime = Date.now();

    // 0. AI-POWERED NORMALIZATION - Handle typos, Tunisian, greetings
    const normalized = await this.aiNormalizer.normalizeQuery(message);
    const processedMessage = normalized.normalized;
    
    this.logger.log(`Original: "${message}" → Normalized: "${processedMessage}"`);

    // 1. Get/create session
    const session = await this.sessionService.getOrCreate(sessionId, vehicle);
    await this.sessionService.saveUserMessage(session.id, message);
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
          metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } 
        };
      }
    }

    // 3. Check for clarification answer FIRST
    const pendingClarification = this.clarificationService.getPending(session.id);
    if (pendingClarification && this.clarificationService.isAnswer(processedMessage, pendingClarification)) {
      const partName = this.clarificationService.extractPartName(pendingClarification.originalQuery);
      this.logger.log(`Clarification answer: "${processedMessage}" for original: "${pendingClarification.originalQuery}"`);
      this.clarificationService.clearPending(session.id);
      
      this.contextService.setLastPart(session.id, partName);
      
      const isPositionAnswer = /^\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)\s*(avant|arriere|arrière|av|ar|gauche|droite|g|d|droit|gosh)?\s*$/i.test(message.trim());
      this.logger.log(`isPositionAnswer check: "${message.trim()}" → ${isPositionAnswer}`);
      
      let products: any[];
      let finalQuery = `${partName} ${processedMessage.trim()}`;
      
      if (isPositionAnswer) {
        // CRITICAL: Filter by BOTH part type AND position
        products = pendingClarification.products.filter(p => {
          const designation = p.designation.toLowerCase();
          const answer = processedMessage.toLowerCase().trim();
          const partLower = partName.toLowerCase();
          
          // MUST contain the part type (e.g., "amortisseur")
          const partWords = partLower.split(' ');
          const hasPartType = partWords.some(word => word.length > 2 && designation.includes(word));
          if (!hasPartType) return false;
          
          // MUST match the position answer
          if (answer === 'avant' || answer === 'av') return /\b(avant|av)\b/i.test(designation);
          if (answer === 'arriere' || answer === 'arrière' || answer === 'ar') return /\b(arriere|arrière|ar)\b/i.test(designation);
          if (answer === 'gauche' || answer === 'g') return /\b(gauche|g)\b/i.test(designation);
          if (answer === 'droite' || answer === 'd' || answer === 'droit') return /\b(droite|droit|d)\b/i.test(designation);
          
          // Combined position + side (e.g., "avant gauche")
          if (answer.includes('avant') && answer.includes('gauche')) {
            return /\b(avant|av)\b/i.test(designation) && /\b(gauche|g)\b/i.test(designation);
          }
          if (answer.includes('avant') && answer.includes('droite')) {
            return /\b(avant|av)\b/i.test(designation) && /\b(droite|droit|d)\b/i.test(designation);
          }
          if (answer.includes('arriere') || answer.includes('arrière')) {
            if (answer.includes('gauche')) {
              return /\b(arriere|arrière|ar)\b/i.test(designation) && /\b(gauche|g)\b/i.test(designation);
            }
            if (answer.includes('droite')) {
              return /\b(arriere|arrière|ar)\b/i.test(designation) && /\b(droite|droit|d)\b/i.test(designation);
            }
          }
          
          return designation.includes(answer);
        });
        
        products = this.filterByVehicleModel(products, vehicle);
        
        // If no match, search with combined query (part + position)
        if (products.length === 0) {
          finalQuery = `${partName} ${processedMessage.trim()}`;
          products = this.filterByVehicleModel(await this.searchService.search(finalQuery, vehicle), vehicle);
        }
        
        // Check if still needs clarification for side
        const clarificationCheck = this.clarificationService.checkNeeded(products, finalQuery);
        if (clarificationCheck.needed) {
          const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
          this.clarificationService.setPending(session.id, finalQuery, clarificationCheck.dimension, products);
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
      } else {
        // Not a simple position answer - still combine with part name from clarification
        finalQuery = `${partName} ${processedMessage.trim()}`;
        products = this.filterByVehicleModel(await this.searchService.search(finalQuery, vehicle), vehicle);
        
        // Check if still needs clarification
        const clarificationCheck = this.clarificationService.checkNeeded(products, finalQuery);
        if (clarificationCheck.needed) {
          const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
          this.clarificationService.setPending(session.id, finalQuery, clarificationCheck.dimension, products);
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
      }
      if (products.length > 0) {
        const response = this.responseService.buildProductResponse(products, finalQuery, vehicle);
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
        const response = this.responseService.buildNoResultsResponse(finalQuery, vehicle);
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

    // 4. Detect intent using AI-powered understanding
    const intent = await this.intelligenceService.detectIntentWithAI(processedMessage, conversationHistory, !!pendingClarification);

    // Store last part for context
    const partName = this.extractPartName(processedMessage);
    if (partName) {
      this.contextService.setLastPart(session.id, partName);
    }

    // 5. Handle non-search intents
    if (intent.type === 'GREETING' || intent.type === 'THANKS') {
      // CRITICAL: Final check - don't treat position queries as greetings
      const hasPositionOrAction = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d|chouf|choufli|montre|voir|regarde|wri)\b/i.test(processedMessage);
      
      if (!hasPositionOrAction) {
        const response = intent.type === 'GREETING' 
          ? this.responseService.buildGreetingResponse() 
          : this.responseService.buildThanksResponse();
        await this.sessionService.saveBotResponse(session.id, response, { intent: intent.type });
        return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: intent.type, metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
      }
    }
    
    // Handle availability check with context
    if (intent.type === 'STOCK_CHECK' && context.lastPart) {
      const availabilityQuery = `${context.lastPart} ${vehicle?.modele || 'S-PRESSO'}`;
      const products = this.filterByVehicleModel(await this.searchService.search(availabilityQuery, vehicle), vehicle);
      if (products.length > 0) {
        const available = products.filter(p => p.stock > 0);
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
    
    // Handle diagnostic queries - redirect to professional service
    if (/bruit|fuite|probleme|problème|panne|ne marche pas|defectueux|casse|cassé|voyant|vibration|surchauffe|entretien|maintenance|bizarre|t9allek|ralenti|saccade|perte.*puissance/i.test(processedMessage)) {
      const response = this.responseService.buildDiagnosticRedirectResponse();
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'DIAGNOSTIC_REDIRECT' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'DIAGNOSTIC_REDIRECT', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
    }

    // 6. Handle reference search
    if (this.searchService.isReferenceQuery(processedMessage)) {
      const reference = this.searchService.extractReference(processedMessage);
      const products = this.filterByVehicleModel(await this.searchService.search(processedMessage, vehicle), vehicle);
      if (products.length > 0) {
        const response = this.responseService.buildReferenceResponse(reference, products[0], vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'PARTS_SEARCH', productsFound: products.length });
        return {
          response,
          sessionId: session.id,
          products: products.slice(0, 1).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt) })),
          confidence: 'HIGH',
          intent: 'PARTS_SEARCH',
          metadata: { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10 }
        };
      } else {
        const response = this.responseService.buildReferenceNotFoundResponse(reference, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'NO_RESULTS' });
        return { response, sessionId: session.id, products: [], confidence: 'LOW', intent: 'NO_RESULTS', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
      }
    }

    // 7. Build search query with context - USE ORIGINAL MESSAGE for better context detection
    const searchQuery = this.contextService.buildSearchQuery(message, context, vehicle);
    
    // CRITICAL: Check if user is asking about a different model
    if (vehicle?.modele) {
      const userModel = vehicle.modele.toUpperCase();
      const queryUpper = processedMessage.toUpperCase();
      const mentionedModel = SUZUKI_MODELS.find(model => {
        const modelUpper = model.toUpperCase();
        if (modelUpper === userModel) return false; // Skip their own model
        if (modelUpper === 'S-PRESSO' && queryUpper.includes('SPRESSO')) return true;
        return queryUpper.includes(modelUpper);
      });
      
      if (mentionedModel) {
        const response = `Je vous informe que votre véhicule est un ${vehicle.marque} ${vehicle.modele}. Les pièces que vous recherchez ne sont pas compatibles avec votre modèle. Je ne peux vous renseigner que sur les pièces compatibles avec votre ${vehicle.modele}.\n\nContactez CarPro au ☎️ 70 603 500 pour plus d'informations.`;
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'MODEL_MISMATCH' });
        return {
          response,
          sessionId: session.id,
          products: [],
          confidence: 'HIGH',
          intent: 'MODEL_MISMATCH',
          metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 }
        };
      }
    }
    
    const products = await this.searchService.search(searchQuery, vehicle);
    const filteredProducts = this.filterByVehicleModel(products, vehicle);
    
    // If user asks about different model, inform them politely
    if (vehicle?.modele && products.length > 0 && filteredProducts.length === 0) {
      const response = `Je vous informe que votre véhicule est un ${vehicle.marque} ${vehicle.modele}. Les pièces que vous recherchez ne sont pas compatibles avec votre modèle. Je ne peux vous renseigner que sur les pièces compatibles avec votre ${vehicle.modele}.\n\nContactez CarPro au ☎️ 70 603 500 pour plus d'informations.`;
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'MODEL_MISMATCH' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'HIGH',
        intent: 'MODEL_MISMATCH',
        metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 }
      };
    }

    // 8. Check if clarification needed
    const clarificationCheck = this.clarificationService.checkNeeded(filteredProducts, processedMessage);
    if (clarificationCheck.needed) {
      const partName = this.clarificationService.extractPartName(processedMessage);
      const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
      this.clarificationService.setPending(session.id, searchQuery, clarificationCheck.dimension, filteredProducts);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
      return {
        response,
        sessionId: session.id,
        products: [],
        confidence: 'MEDIUM',
        intent: 'CLARIFICATION_NEEDED',
        metadata: { productsFound: filteredProducts.length, conversationLength: conversationHistory.length, queryClarity: 0 }
      };
    }

    // 9. Build response based on intent
    let response: string;
    if (intent.type === 'PRICE_INQUIRY') {
      response = this.responseService.buildPriceResponse(filteredProducts, processedMessage, vehicle, context.lastTopic || 'général');
    } else if (filteredProducts.length > 0) {
      response = this.responseService.buildProductResponse(filteredProducts, searchQuery, vehicle);
    } else {
      response = this.responseService.buildNoResultsResponse(searchQuery, vehicle);
    }

    await this.sessionService.saveBotResponse(session.id, response, { intent: intent.type, productsFound: filteredProducts.length });

    // 10. Calculate confidence and suggestions
    const queryClarity = this.intelligenceService.analyzeQueryClarity(processedMessage);
    const confidence = this.intelligenceService.calculateConfidence({
      productsFound: filteredProducts.length,
      exactMatch: filteredProducts.some(p => p.score > 500),
      conversationContext: conversationHistory.length,
      userFeedbackHistory: 0,
      queryClarity
    });
    const suggestions = this.intelligenceService.generateSmartSuggestions(processedMessage, filteredProducts);

    return {
      response,
      sessionId: session.id,
      products: filteredProducts.slice(0, 1).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt) })),
      confidence: confidence.level,
      confidenceScore: confidence.score,
      suggestions: [],
      intent: intent.type,
      metadata: { productsFound: filteredProducts.length, conversationLength: conversationHistory.length, queryClarity, duration: Date.now() - startTime }
    };
  }

  private extractPartName(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('plaquette') && lower.includes('frein')) return 'plaquettes frein';
    if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
    if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
    if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
    if (lower.includes('essuie') && lower.includes('glace')) return 'essuie-glace';
    if (lower.includes('pare') && lower.includes('choc')) return 'pare-choc';
    if (lower.includes('amortisseur')) return 'amortisseur';
    if (lower.includes('retroviseur') || lower.includes('rétroviseur')) return 'rétroviseur';
    if (lower.includes('aile')) return 'aile';
    if (lower.includes('porte')) return 'porte';
    if (lower.includes('clignotant')) return 'clignotant';
    if (lower.includes('vitre')) return 'vitre';
    if (lower.includes('radiateur')) return 'radiateur';
    if (lower.includes('capot')) return 'capot';
    if (lower.includes('hayon')) return 'hayon';
    if (lower.includes('etrier') || lower.includes('étrier')) return 'etrier';
    if (lower.includes('enjoliveur')) return 'enjoliveur';
    if (lower.includes('rotule')) return 'rotule';
    if (lower.includes('charniere') || lower.includes('charnière')) return 'charniere';
    if (lower.includes('serrure')) return 'serrure';
    if (lower.includes('joint')) return 'joint';
    if (lower.includes('adhesif') || lower.includes('adhésif')) return 'adhesif';
    if (lower.includes('moulure')) return 'moulure';
    if (lower.includes('grille')) return 'grille';
    if (lower.includes('support')) return 'support';
    if (lower.includes('batterie')) return 'batterie';
    if (lower.includes('phare')) return 'phare';
    if (lower.includes('plaquette')) return 'plaquettes frein';
    if (lower.includes('disque')) return 'disque frein';
    if (lower.includes('filtre')) return 'filtre';
    return '';
  }

  private filterByVehicleModel(products: any[], vehicle?: any): any[] {
    if (!vehicle?.modele) return products;
    
    const model = vehicle.modele.toUpperCase();
    
    return products.filter(p => {
      const designation = p.designation.toUpperCase();
      const hasModel = hasModelInDesignation(designation);
      return !hasModel || matchesModel(designation, model);
    });
  }
}
