import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GEMINI_CHAT_PROMPT, GEMINI_OCR_PROMPT } from './prompt-templates';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  // Rate limiting
  private readonly RATE_LIMIT_DELAY = 1000; // ms between calls
  private lastCallTime = 0;

  // Simple in-memory cache
  private readonly responseCache: Map<string, { response: string; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Metrics
  private metrics = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageResponseTime: 0,
    cacheHits: 0,
  };


  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('GEMINI_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.error('❌ GEMINI_API_KEY not configured');
      throw new Error('GEMINI_API_KEY not configured');
    }
    this.logger.log('✅ GeminiService initialized');
  }

  async chat(message: string, conversationHistory: Array<{ role: string; content: string }>, context?: string): Promise<string> {
    this.metrics.totalCalls++;

    const { message: sanitizedMessage, conversationHistory: sanitizedHistory } = this.validateAndSanitizeInput(message, conversationHistory);

    await this.enforceRateLimit();

    const systemPrompt = `${GEMINI_CHAT_PROMPT}

CONTEXTE: ${context || 'Aucun véhicule détecté'}`;

    const cacheKey = this.generateCacheKey(sanitizedMessage, context, sanitizedHistory);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) {
      this.metrics.cacheHits++;
      this.logger.log('Returning cached Gemini response');
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
      this.logger.error('Gemini API error:', error.response?.data || error.message || error);
      return this.getGracefulFallback();
    }
  }

  private async callWithRetry(systemPrompt: string, message: string, conversationHistory: Array<{ role: string; content: string }>, maxRetries = 2): Promise<string> {
    let lastErr: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.callGeminiAPI(systemPrompt, message, conversationHistory);
      } catch (err: any) {
        lastErr = err;
        this.logger.warn(`Gemini API attempt ${attempt + 1} failed: ${err.message || err}`);
        if (attempt < maxRetries - 1) await this.delay(500 * (attempt + 1)); // Reduced delay
      }
    }
    throw lastErr || new Error('All retry attempts failed');
  }

  private async callGeminiAPI(systemPrompt: string, message: string, conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...conversationHistory.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const resp = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, {
      contents,
      generationConfig: { temperature: 0.3, topK: 40, topP: 0.8, maxOutputTokens: 1024 }
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }); // Reduced timeout

    return resp.data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu générer de réponse.";
  }

  private generateCacheKey(message: string, context?: string, history?: Array<{ role: string; content: string }>): string {
    const hist = (history || []).slice(-3).map(h => `${h.role}:${h.content}`).join('|');
    return `${message}::${context || ''}::${hist}`;
  }

  private getCachedResponse(key: string): string | null {
    const entry = this.responseCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.CACHE_TTL) { this.responseCache.delete(key); return null; }
    return entry.response;
  }

  private cacheResponse(key: string, response: string): void { try { this.responseCache.set(key, { response, timestamp: Date.now() }); } catch (e) { this.logger.warn('Cache set failed', e as any); } }

  private validateAndSanitizeInput(message: string, conversationHistory: Array<{ role: string; content: string }>): { message: string; conversationHistory: Array<{ role: string; content: string }> } {
    const sanitizedMessage = String(message || '').trim().slice(0, 4000);
    const sanitizedHistory = (conversationHistory || []).slice(-10).map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', content: String(msg.content || '').slice(0, 2000) }));
    return { message: sanitizedMessage, conversationHistory: sanitizedHistory };
  }

  private async enforceRateLimit(): Promise<void> { const now = Date.now(); const since = now - this.lastCallTime; if (since < this.RATE_LIMIT_DELAY) await this.delay(this.RATE_LIMIT_DELAY - since); this.lastCallTime = Date.now(); }

  private getGracefulFallback(): string { return "Je rencontre actuellement des difficultés techniques. Veuillez réessayer dans quelques instants ou contacter CarPro au ☎️ 70 603 500 pour une assistance immédiate."; }

  private delay(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }

  getMetrics() { return { ...this.metrics, successRate: this.metrics.totalCalls > 0 ? (this.metrics.successfulCalls / this.metrics.totalCalls) * 100 : 0, cacheSize: this.responseCache.size }; }

  clearCache(): void { this.responseCache.clear(); this.logger.log('Gemini response cache cleared'); }

  async extractVehicleInfo(imageBase64: string, mimeType?: string): Promise<any> {
    const prompt = GEMINI_OCR_PROMPT;

    console.log('🔍 Starting OCR extraction...');
    
    try {
      // Detect mime type from base64 or use provided
      let detectedMimeType = mimeType;
      if (!detectedMimeType) {
        if (imageBase64.startsWith('data:image/png')) detectedMimeType = 'image/png';
        else if (imageBase64.startsWith('data:image/webp')) detectedMimeType = 'image/webp';
        else if (imageBase64.startsWith('data:image/heic')) detectedMimeType = 'image/heic';
        else if (imageBase64.startsWith('data:application/pdf')) detectedMimeType = 'application/pdf';
        else detectedMimeType = 'image/jpeg';
      }

      console.log('📷 Detected MIME type:', detectedMimeType);
      const base64Data = imageBase64.split(',')[1];
      console.log('📦 Base64 data size:', `${(base64Data.length / 1024).toFixed(2)} KB`);

      console.log('🚀 Calling Gemini Vision API...');
      const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: detectedMimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1, // Low temperature for accurate OCR
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // 30 second timeout for large files
      });

      console.log('✅ Gemini API response received');
      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      console.log('📝 Raw OCR text:', text);
      
      // Better JSON extraction
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

      if (parsed.error === 'invalid_model') {
        console.log('❌ Invalid model detected by Gemini');
        throw new Error('INVALID_MODEL');
      }

      // Normalize data
      const marque = (parsed.marque || '').toString().toUpperCase().trim();
      console.log('🔍 Validating brand:', marque);
      
      if (!marque.includes('SUZUKI')) {
        console.log('❌ Brand validation failed - Not SUZUKI');
        console.log('📊 Match percentage: 0% (Wrong brand)');
        throw new Error('INVALID_MODEL');
      }
      console.log('✅ Brand validated: SUZUKI');

      const modeleRaw = (parsed.modele || '').toString().trim();
      const modeleNorm = modeleRaw.toUpperCase().replace(/\s+/g, '').replace(/\./g, '');
      console.log('🔍 Validating model:', modeleRaw, '(normalized:', modeleNorm + ')');
      
      let modeleCanon = '';
      let matchPercentage = 0;
      
      if (modeleNorm.includes('CELERIO')) {
        modeleCanon = 'CELERIO';
        matchPercentage = 95;
        console.log('✅ Model validated: CELERIO');
      } else if (modeleNorm.includes('SPRESSO') || modeleNorm.includes('S-PRESSO')) {
        modeleCanon = 'S-PRESSO';
        matchPercentage = 95;
        console.log('✅ Model validated: S-PRESSO');
      } else {
        console.log('❌ Model validation failed - Not Celerio or S-Presso');
        console.log('📊 Match percentage: 0% (Wrong model)');
        throw new Error('INVALID_MODEL');
      }

      const result = {
        immatriculation: parsed.immatriculation?.trim().toUpperCase() || null,
        marque: 'SUZUKI',
        modele: modeleCanon,
        typeMoteur: parsed.typeMoteur?.trim() || null,
        annee: parsed.annee || null
      };

      console.log('🎯 FINAL RESULT:');
      console.log('  • Immatriculation:', result.immatriculation || 'N/A');
      console.log('  • Marque:', result.marque);
      console.log('  • Modèle:', result.modele);
      console.log('  • Type Moteur:', result.typeMoteur || 'N/A');
      console.log('  • Année:', result.annee || 'N/A');
      console.log(`📊 Match Confidence: ${matchPercentage}%`);

      return result;
    } catch (error) {
      console.error('Gemini vision error:', error.response?.data || error.message);
      throw error;
    }
  }
}
