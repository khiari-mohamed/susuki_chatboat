import { Injectable, Logger } from '@nestjs/common';
import { SessionService } from './session.service';
import { ClarificationService } from './clarification.service';
import { ContextService } from './context.service';
import { ResponseService } from './response.service';
import { SearchService } from './search.service';
import { IntelligenceService } from '../chat/intelligence.service';

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
    private intelligenceService: IntelligenceService
  ) {
    setInterval(() => this.clarificationService.cleanup(), 300000);
  }

  async processMessage(message: string, vehicle?: any, sessionId?: string): Promise<ProcessMessageResponse> {
    const startTime = Date.now();

    // 1. Get/create session
    const session = await this.sessionService.getOrCreate(sessionId, vehicle);
    await this.sessionService.saveUserMessage(session.id, message);

    // 2. Get context
    const context = await this.contextService.get(session.id);
    const conversationHistory = await this.sessionService.getHistory(session.id);

    // 3. Check for clarification answer FIRST
    const pendingClarification = this.clarificationService.getPending(session.id);
    if (pendingClarification && this.clarificationService.isAnswer(message, pendingClarification)) {
      const partName = this.clarificationService.extractPartName(pendingClarification.originalQuery);
      const combinedQuery = `${partName} ${message}`;
      this.clarificationService.clearPending(session.id);
      const products = await this.searchService.search(combinedQuery);
      
      if (products.length > 0) {
        const response = this.responseService.buildProductResponse(products, combinedQuery, vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'PARTS_SEARCH', productsFound: products.length });
        return {
          response,
          sessionId: session.id,
          products: products.slice(0, 3).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt), stock: p.stock })),
          confidence: 'HIGH',
          intent: 'PARTS_SEARCH',
          metadata: { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10, duration: Date.now() - startTime }
        };
      } else {
        const response = this.responseService.buildNoResultsResponse(combinedQuery, vehicle);
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

    // 4. Detect intent
    const intent = this.intelligenceService.detectIntent(message, !!pendingClarification);

    // 5. Handle non-search intents
    if (intent.type === 'GREETING') {
      const response = this.responseService.buildGreetingResponse(message);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'GREETING' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'GREETING', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
    }
    if (intent.type === 'THANKS') {
      const response = this.responseService.buildThanksResponse();
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'THANKS' });
      return { response, sessionId: session.id, products: [], confidence: 'HIGH', intent: 'THANKS', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
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

    // 6. Handle reference search
    if (this.searchService.isReferenceQuery(message)) {
      const reference = this.searchService.extractReference(message);
      const products = await this.searchService.search(message);
      if (products.length > 0) {
        const response = this.responseService.buildReferenceResponse(reference, products[0], vehicle);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'PARTS_SEARCH', productsFound: products.length });
        return {
          response,
          sessionId: session.id,
          products: products.slice(0, 3).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt), stock: p.stock })),
          confidence: 'HIGH',
          intent: 'PARTS_SEARCH',
          metadata: { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 10 }
        };
      } else {
        const response = this.responseService.buildReferenceNotFoundResponse(reference);
        await this.sessionService.saveBotResponse(session.id, response, { intent: 'NO_RESULTS' });
        return { response, sessionId: session.id, products: [], confidence: 'LOW', intent: 'NO_RESULTS', metadata: { productsFound: 0, conversationLength: conversationHistory.length, queryClarity: 0 } };
      }
    }

    // 7. Build search query with context
    const searchQuery = this.contextService.buildSearchQuery(message, context, vehicle);
    const products = await this.searchService.search(searchQuery);

    // 8. Check if clarification needed
    const clarificationCheck = this.clarificationService.checkNeeded(products, message);
    if (clarificationCheck.needed) {
      const partName = this.clarificationService.extractPartName(message);
      const response = this.clarificationService.buildQuestion(partName, clarificationCheck.variants, clarificationCheck.dimension);
      this.clarificationService.setPending(session.id, message, clarificationCheck.dimension, products);
      await this.sessionService.saveBotResponse(session.id, response, { intent: 'CLARIFICATION_NEEDED' });
      return {
        response,
        sessionId: session.id,
        products: products.length > 0 ? products.slice(0, 3).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt), stock: p.stock })) : [],
        confidence: 'MEDIUM',
        intent: 'CLARIFICATION_NEEDED',
        metadata: { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity: 0 }
      };
    }

    // 9. Build response based on intent
    let response: string;
    if (intent.type === 'PRICE_INQUIRY') {
      response = this.responseService.buildPriceResponse(products, searchQuery, vehicle, context.lastTopic || 'général');
    } else if (products.length > 0) {
      response = this.responseService.buildProductResponse(products, searchQuery, vehicle);
    } else {
      response = this.responseService.buildNoResultsResponse(searchQuery, vehicle);
    }

    await this.sessionService.saveBotResponse(session.id, response, { intent: intent.type, productsFound: products.length });

    // 10. Calculate confidence and suggestions
    const queryClarity = this.intelligenceService.analyzeQueryClarity(message);
    const confidence = this.intelligenceService.calculateConfidence({
      productsFound: products.length,
      exactMatch: products.some(p => p.score > 500),
      conversationContext: conversationHistory.length,
      userFeedbackHistory: 0,
      queryClarity
    });
    const suggestions = this.intelligenceService.generateSmartSuggestions(message, products);

    return {
      response,
      sessionId: session.id,
      products: products.slice(0, 3).map(p => ({ id: p.id, designation: p.designation, reference: p.reference, prixHt: String(p.prixHt), stock: p.stock })),
      confidence: confidence.level,
      confidenceScore: confidence.score,
      suggestions,
      intent: intent.type,
      metadata: { productsFound: products.length, conversationLength: conversationHistory.length, queryClarity, duration: Date.now() - startTime }
    };
  }
}
