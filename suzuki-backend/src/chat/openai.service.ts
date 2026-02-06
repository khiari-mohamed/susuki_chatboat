import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GEMINI_CHAT_PROMPT, GEMINI_OCR_PROMPT } from './prompt-templates';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-4o-mini'; 
  private readonly RATE_LIMIT_DELAY = 500;
  private lastCallTime = 0;
  private readonly responseCache: Map<string, { response: string; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; 

  // Metrics
  private metrics = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageResponseTime: 0,
    cacheHits: 0,
  };

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('OPENAI_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.error('❌ OPENAI_API_KEY not configured');
      throw new Error('OPENAI_API_KEY not configured');
    }
    this.logger.log('✅ OpenAIService initialized with gpt-4o-mini');
  }

  async chat(message: string, conversationHistory: Array<{ role: string; content: string }>, context?: string, hasPendingClarification?: boolean): Promise<string> {
    this.metrics.totalCalls++;
    const { message: sanitizedMessage, conversationHistory: sanitizedHistory } = this.validateAndSanitizeInput(message, conversationHistory);
    await this.enforceRateLimit();
    
    // For simple greetings/thanks, use simple context
    const isSimpleConversation = context && (context.includes('greeting') || context.includes('acknowledgment'));
    let systemPrompt = isSimpleConversation 
      ? context 
      : `${GEMINI_CHAT_PROMPT}\n\nCONTEXTE: ${context || 'Aucun véhicule détecté'}`;
    
    if (hasPendingClarification) {
      systemPrompt += `\n\nIMPORTANT: L'utilisateur répond à une question de clarification précédente (position/côté). Traitez cette réponse comme une clarification, pas comme une nouvelle requête.`;
    }
    const cacheKey = this.generateCacheKey(sanitizedMessage, context, sanitizedHistory, hasPendingClarification);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) {
      this.metrics.cacheHits++;
      this.logger.log('Returning cached OpenAI response');
      return cached;
    }
    const start = Date.now();
    try {
      const response = await this.callWithRetry(systemPrompt, sanitizedMessage, sanitizedHistory);

      if (response && !response.includes("Désolé, je n'ai pas pu générer de réponse.")) {
        this.cacheResponse(cacheKey, response);
      }
      const duration = Date.now() - start;
      this.metrics.successfulCalls++;
      this.metrics.averageResponseTime = (this.metrics.averageResponseTime * (this.metrics.successfulCalls - 1) + duration) / this.metrics.successfulCalls;
      return response;
    } catch (error: any) {
      this.metrics.failedCalls++;
      this.logger.error('OpenAI API error:', error.response?.data || error.message || error);
      return this.getGracefulFallback();
    }
  }

  private async callWithRetry(systemPrompt: string, message: string, conversationHistory: Array<{ role: string; content: string }>, maxRetries = 2): Promise<string> {
    let lastErr: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.callOpenAIAPI(systemPrompt, message, conversationHistory);
      } catch (err: any) {
        lastErr = err;
        this.logger.warn(`OpenAI API attempt ${attempt + 1} failed: ${err.message || err}`);
        if (attempt < maxRetries - 1) await this.delay(500 * (attempt + 1));
      }
    }
    throw lastErr || new Error('All retry attempts failed');
  }

  private async callOpenAIAPI(systemPrompt: string, message: string, conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({ 
        role: msg.role === 'user' ? 'user' : 'assistant', 
        content: msg.content 
      })),
      { role: 'user', content: message }
    ];

    const resp = await axios.post(this.apiUrl, {
      model: this.model,
      messages,
      temperature: 0.3,
      max_tokens: 1024,
      top_p: 0.8
    }, { 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }, 
      timeout: 15000 
    });

    return resp.data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
  }

  private generateCacheKey(message: string, context?: string, history?: Array<{ role: string; content: string }>, hasPendingClarification?: boolean): string {
    const hist = (history || []).slice(-3).map(h => `${h.role}:${h.content}`).join('|');
    return `${message}::${context || ''}::${hist}::${hasPendingClarification ? 'pending' : 'no-pending'}`;
  }

  private getCachedResponse(key: string): string | null {
    const entry = this.responseCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.CACHE_TTL) { 
      this.responseCache.delete(key); 
      return null; 
    }
    return entry.response;
  }

  private cacheResponse(key: string, response: string): void { 
    try { 
      this.responseCache.set(key, { response, timestamp: Date.now() }); 
    } catch (e) { 
      this.logger.warn('Cache set failed', e as any); 
    } 
  }

  private validateAndSanitizeInput(message: string, conversationHistory: Array<{ role: string; content: string }>): { message: string; conversationHistory: Array<{ role: string; content: string }> } {
    const sanitizedMessage = String(message || '').trim().slice(0, 4000);
    const sanitizedHistory = (conversationHistory || []).slice(-10).map(msg => ({ 
      role: msg.role === 'user' ? 'user' : 'assistant', 
      content: String(msg.content || '').slice(0, 2000) 
    }));
    return { message: sanitizedMessage, conversationHistory: sanitizedHistory };
  }

  private async enforceRateLimit(): Promise<void> { 
    const now = Date.now(); 
    const since = now - this.lastCallTime; 
    if (since < this.RATE_LIMIT_DELAY) await this.delay(this.RATE_LIMIT_DELAY - since); 
    this.lastCallTime = Date.now(); 
  }

  private getGracefulFallback(): string { 
    return "Je rencontre actuellement des difficultés techniques. Veuillez réessayer dans quelques instants ou contacter CarPro au ☎️ 70 603 500 pour une assistance immédiate."; 
  }

  private delay(ms: number): Promise<void> { 
    return new Promise(resolve => setTimeout(resolve, ms)); 
  }

  getMetrics() { 
    return { 
      ...this.metrics, 
      successRate: this.metrics.totalCalls > 0 ? (this.metrics.successfulCalls / this.metrics.totalCalls) * 100 : 0, 
      cacheSize: this.responseCache.size 
    }; 
  }

  clearCache(): void { 
    this.responseCache.clear(); 
    this.logger.log('OpenAI response cache cleared'); 
  }

  async extractVehicleInfo(imageBase64: string, mimeType?: string): Promise<any> {
    const prompt = GEMINI_OCR_PROMPT;

    console.log('🔍 Starting OCR extraction with OpenAI Vision...');
    
    try {
      let detectedMimeType = mimeType;
      if (!detectedMimeType) {
        if (imageBase64.startsWith('data:image/png')) detectedMimeType = 'image/png';
        else if (imageBase64.startsWith('data:image/webp')) detectedMimeType = 'image/webp';
        else if (imageBase64.startsWith('data:application/pdf')) detectedMimeType = 'application/pdf';
        else detectedMimeType = 'image/jpeg';
      }

      console.log('📷 Detected MIME type:', detectedMimeType);

      console.log('🚀 Calling OpenAI Vision API...');
      const response = await axios.post(this.apiUrl, {
        model: 'gpt-4o-mini', // Vision support
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }],
        temperature: 0.1,
        max_tokens: 2048
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 30000
      });

      console.log('✅ OpenAI API response received');
      const text = response.data.choices?.[0]?.message?.content || '{}';
      console.log('📝 Raw OCR text:', text);
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log('❌ No JSON found in response');
        throw new Error('OCR_FAILED');
      }
      
      const jsonText = jsonMatch[0];
      console.log('📦 Extracted JSON:', jsonText);
      
      let parsed;
      try {
        parsed = JSON.parse(jsonText);
        console.log('✅ JSON parsed successfully:', parsed);
      } catch (e) {
        console.log('❌ JSON parse error:', e.message);
        throw new Error('OCR_FAILED');
      }

      if (parsed.error === 'invalid_brand') {
        console.log('❌ Invalid brand detected by OpenAI');
        throw new Error('INVALID_BRAND');
      }

      const marque = (parsed.marque || '').toString().toUpperCase().trim();
      console.log('🔍 Validating brand:', marque);
      
      if (!marque.includes('SUZUKI')) {
        console.log('❌ Brand validation failed - Not SUZUKI');
        throw new Error('INVALID_BRAND');
      }
      console.log('✅ Brand validated: SUZUKI');

      const modeleRaw = (parsed.modele || '').toString().trim();
      const modeleNorm = modeleRaw.toUpperCase().replace(/\s+/g, '').replace(/\./g, '').replace(/-/g, '');
      console.log('🔍 Model detected:', modeleRaw, '(normalized:', modeleNorm + ')');
      
      const suzukiModels: Record<string, string> = {
        'CELERIO': 'CELERIO', 'SPRESSO': 'S-PRESSO', 'SWIFT': 'SWIFT',
        'VITARA': 'VITARA', 'JIMNY': 'JIMNY', 'BALENO': 'BALENO',
        'IGNIS': 'IGNIS', 'ALTO': 'ALTO', 'ERTIGA': 'ERTIGA',
        'DZIRE': 'DZIRE', 'CIAZ': 'CIAZ', 'SCROSS': 'S-CROSS',
        'WAGON': 'WAGON R', 'WAGONR': 'WAGON R'
      };
      
      let modeleCanon = modeleRaw.toUpperCase();
      let matchPercentage = 90;
      
      for (const [key, value] of Object.entries(suzukiModels)) {
        if (modeleNorm.includes(key)) {
          modeleCanon = value;
          matchPercentage = 95;
          console.log(`✅ Model validated: ${modeleCanon}`);
          break;
        }
      }

      const result = {
        immatriculation: parsed.immatriculation?.trim().toUpperCase() || null,
        marque: 'SUZUKI',
        modele: modeleCanon || modeleRaw.toUpperCase(),
        typeMoteur: parsed.typeMoteur?.trim() || null,
        annee: parsed.annee || null
      };

      console.log('🎯 FINAL RESULT:', result);
      console.log(`📊 Match Confidence: ${matchPercentage}%`);

      return result;
    } catch (error) {
      console.error('OpenAI vision error:', error.response?.data || error.message);
      throw error;
    }
  }
}
