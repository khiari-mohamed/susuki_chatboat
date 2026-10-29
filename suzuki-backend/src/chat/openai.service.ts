import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createHash } from 'crypto';
import { COMPTOIR_REDIRECT_MESSAGE } from '../constants/business-rules.constants';
import { GEMINI_CHAT_PROMPT, GEMINI_OCR_PROMPT } from './prompt-templates';

/**
 * Model names as they may appear on a registration card (spaces, dots and
 * hyphens stripped). Matching tries the LONGEST key first, so "GRANDVITARA"
 * is never swallowed by "VITARA". The catalog-side model resolution lives in
 * VehicleModelsService; this map only cleans OCR output.
 */
const SUZUKI_MODELS_CANONICAL: Readonly<Record<string, string>> = {
  CELERIO: 'CELERIO', NEWCELERIO: 'CELERIO',
  SWIFT: 'SWIFT', NEWSWIFT: 'SWIFT', SWIFTIV: 'SWIFT', SWIFT4: 'SWIFT',
  SPRESSO: 'S-PRESSO', SPRES: 'S-PRESSO',
  VITARA: 'VITARA',
  JIMNY: 'JIMNY', JIMNY5D: 'JIMNY',
  BALENO: 'BALENO', NEWBALENO: 'BALENO',
  IGNIS: 'IGNIS',
  ALTO: 'ALTO',
  ERTIGA: 'ERTIGA',
  DZIRE: 'DZIRE', NEWDZIRE: 'DZIRE',
  CIAZ: 'CIAZ', NEWCIAZ: 'CIAZ',
  SCROSS: 'S-CROSS',
  WAGON: 'WAGON R', WAGONR: 'WAGON R',
  FRONX: 'FRONX', NEWFRONX: 'FRONX',
  GRAND: 'GRAND VITARA', GRANDVITARA: 'GRAND VITARA',
};
const MODEL_KEYS_BY_SPECIFICITY = Object.entries(SUZUKI_MODELS_CANONICAL).sort(
  ([a], [b]) => b.length - a.length,
);

const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']);
const MAX_CACHE_ENTRIES = 500;

export interface ExtractedVehicleInfo {
  immatriculation: string | null;
  marque: 'SUZUKI';
  modele: string;
  typeMoteur: string | null;
  annee: string | number | null;
  /** 17-character VIN when readable and valid, otherwise null. */
  vin: string | null;
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-4o-mini';
  private readonly CACHE_TTL = 5 * 60 * 1000;
  private readonly responseCache = new Map<string, { response: string; timestamp: number }>();

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

  // ─────────────────────────────────────────────────────────────────
  // Customer-facing chat
  // ─────────────────────────────────────────────────────────────────
  async chat(
    message: string,
    conversationHistory: Array<{ role: string; content: string; metadata?: any }>,
    context?: string,
    hasPendingClarification?: boolean,
  ): Promise<string> {
    this.metrics.totalCalls++;

    // OpenAI only accepts role + content: strip metadata.
    const cleanHistory = (conversationHistory || []).map((m) => ({ role: m.role, content: m.content }));
    const { message: sanitizedMessage, conversationHistory: sanitizedHistory } =
      this.validateAndSanitizeInput(message, cleanHistory);

    const isSimpleConversation =
      context && (context.includes('greeting') || context.includes('acknowledgment'));

    const frenchFirstInstruction = `
🇫🇷 FRENCH NAME RULE (CRITICAL):
- The parts database has TWO name fields per part:
    • designation_2 / displayName → FRENCH name (e.g. "Rétroviseur extérieur gauche") — USE THIS
    • designation → English OEM code (e.g. "MIRROR ASSY,OUT REAR VIEW,LH") — NEVER show to user
- In humanReadable and frenchResponse: ALWAYS use the French displayName
- NEVER output raw English OEM codes to the user
- If only an English code is available, translate it naturally into French
- Parts can come from two sources — show sourceLabel to the user:
    • "Suzuki OEM" = original manufacturer part
    • "CarPro Parts" = CarPro wholesale stock (equally valid)`;

    let systemPrompt = isSimpleConversation
      ? (context ?? '')
      : `${GEMINI_CHAT_PROMPT}${frenchFirstInstruction}\n\nCONTEXTE: ${context || 'Aucun véhicule détecté'}`;

    if (hasPendingClarification) {
      systemPrompt +=
        `\n\nIMPORTANT: L'utilisateur répond à une question de clarification précédente ` +
        `(position/côté/type). Traitez cette réponse comme une clarification, pas comme une nouvelle requête.`;
    }

    // The last bot intent is part of the cache key to avoid cross-state cache hits.
    const lastBotMeta = (conversationHistory || [])
      .filter((m) => m.role === 'bot' || m.role === 'assistant')
      .slice(-1)[0]?.metadata;
    const cacheKey = this.generateCacheKey(
      sanitizedMessage,
      context,
      sanitizedHistory,
      hasPendingClarification,
      lastBotMeta?.intent ?? '',
    );

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

      this.metrics.successfulCalls++;
      this.metrics.averageResponseTime =
        (this.metrics.averageResponseTime * (this.metrics.successfulCalls - 1) + (Date.now() - start)) /
        this.metrics.successfulCalls;
      return response;
    } catch (error: any) {
      this.metrics.failedCalls++;
      this.logger.error('OpenAI API error:', error.response?.data || error.message || error);
      return this.getGracefulFallback();
    }
  }

  /**
   * Machine-task JSON completion (query normalization, judge). No customer
   * persona: temperature 0, JSON mode, small budget. Throws when the API keeps
   * failing so callers can fall back deterministically.
   */
  async completeJson(
    systemPrompt: string,
    userPrompt: string,
    maxTokens = 200,
    maxInputChars = 4000,
  ): Promise<string> {
    this.metrics.totalCalls++;
    const boundedUserPrompt = String(userPrompt).slice(0, maxInputChars);
    const cacheKey = `json::${createHash('sha256').update(systemPrompt).update('\u0000').update(boundedUserPrompt).digest('hex')}`;
    const cached = this.getCachedResponse(cacheKey);
    if (cached) {
      this.metrics.cacheHits++;
      return cached;
    }

    let lastErr: any;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const resp = await axios.post(
          this.apiUrl,
          {
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: boundedUserPrompt },
            ],
            temperature: 0,
            max_tokens: maxTokens,
            response_format: { type: 'json_object' },
          },
          { headers: this.headers(), timeout: 8000 },
        );
        const content: string = resp.data.choices?.[0]?.message?.content ?? '';
        this.metrics.successfulCalls++;
        if (content) this.cacheResponse(cacheKey, content);
        return content;
      } catch (err: any) {
        lastErr = err;
        if (attempt === 0 && this.isRetryable(err)) await this.delay(this.retryDelay(err, 400));
        else break;
      }
    }
    this.metrics.failedCalls++;
    throw lastErr || new Error('completeJson failed');
  }

  private async callWithRetry(
    systemPrompt: string,
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    maxRetries = 2,
  ): Promise<string> {
    let lastErr: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.callOpenAIAPI(systemPrompt, message, conversationHistory);
      } catch (err: any) {
        lastErr = err;
        this.logger.warn(`OpenAI API attempt ${attempt + 1} failed: ${err.message || err}`);
        if (!this.isRetryable(err)) break;
        if (attempt < maxRetries - 1) await this.delay(this.retryDelay(err, 500 * (attempt + 1)));
      }
    }
    throw lastErr || new Error('All retry attempts failed');
  }

  private async callOpenAIAPI(
    systemPrompt: string,
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const resp = await axios.post(
      this.apiUrl,
      { model: this.model, messages, temperature: 0.3, max_tokens: 1024, top_p: 0.8 },
      { headers: this.headers(), timeout: 15000 },
    );
    return resp.data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
  }

  // ─────────────────────────────────────────────────────────────────
  // HTTP helpers
  // ─────────────────────────────────────────────────────────────────
  private headers() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` };
  }

  /** Network errors, rate limits and server errors are worth a retry; 4xx are not. */
  private isRetryable(err: any): boolean {
    const status = err?.response?.status;
    return status === undefined || status === 429 || status >= 500;
  }

  private retryDelay(err: any, fallbackMs: number): number {
    const retryAfterSeconds = Number(err?.response?.headers?.['retry-after']);
    return Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
      ? Math.min(retryAfterSeconds * 1000, 2000)
      : fallbackMs;
  }

  // ─────────────────────────────────────────────────────────────────
  // Cache helpers
  // ─────────────────────────────────────────────────────────────────
  private generateCacheKey(
    message: string,
    context?: string,
    history?: Array<{ role: string; content: string }>,
    hasPendingClarification?: boolean,
    intentHint?: string,
  ): string {
    const hist = (history || []).slice(-3).map((h) => `${h.role}:${h.content}`).join('|');
    return [message, context || '', hist, hasPendingClarification ? 'pending' : 'no-pending', intentHint || ''].join('::');
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
    // Bounded: evict the oldest entry (Map preserves insertion order).
    while (this.responseCache.size >= MAX_CACHE_ENTRIES) {
      const oldest = this.responseCache.keys().next().value;
      if (oldest === undefined) break;
      this.responseCache.delete(oldest);
    }
    this.responseCache.set(key, { response, timestamp: Date.now() });
  }

  private validateAndSanitizeInput(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): { message: string; conversationHistory: Array<{ role: string; content: string }> } {
    return {
      message: String(message || '').trim().slice(0, 4000),
      conversationHistory: (conversationHistory || []).slice(-10).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: String(msg.content || '').slice(0, 2000),
      })),
    };
  }

  private getGracefulFallback(): string {
    return `Je rencontre actuellement des difficultés techniques. Veuillez réessayer dans quelques instants. ${COMPTOIR_REDIRECT_MESSAGE}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getMetrics() {
    const served = this.metrics.successfulCalls + this.metrics.cacheHits;
    return {
      ...this.metrics,
      successRate: this.metrics.totalCalls > 0 ? (served / this.metrics.totalCalls) * 100 : 0,
      cacheSize: this.responseCache.size,
    };
  }

  clearCache(): void {
    this.responseCache.clear();
    this.logger.log('OpenAI response cache cleared');
  }

  // ─────────────────────────────────────────────────────────────────
  // OCR — registration card via gpt-4o-mini Vision
  // ─────────────────────────────────────────────────────────────────

  /** Accepts a data URL, or raw base64 together with its mime type. */
  private toImageDataUrl(imageBase64: string, mimeType?: string): { dataUrl: string; mime: string } {
    const match = /^data:([\w.+/-]+);base64,/i.exec(imageBase64);
    if (match) return { dataUrl: imageBase64, mime: match[1].toLowerCase() };
    const mime = (mimeType || 'image/jpeg').toLowerCase();
    return { dataUrl: `data:${mime};base64,${imageBase64}`, mime };
  }

  /**
   * A VIN never contains I, O or Q: the usual OCR confusions are resolved
   * (I→1, O→0, Q→0) before the 17-character check.
   */
  private normalizeVin(raw: unknown): string | null {
    const vin = String(raw ?? '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .replace(/[OQ]/g, '0')
      .replace(/I/g, '1');
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin) ? vin : null;
  }

  private canonicalModel(rawModel: string): { model: string; matched: boolean } {
    const compact = rawModel.toUpperCase().replace(/[\s.-]+/g, '');
    const hit = MODEL_KEYS_BY_SPECIFICITY.find(([key]) => compact.includes(key));
    return hit ? { model: hit[1], matched: true } : { model: rawModel.toUpperCase(), matched: false };
  }

  async extractVehicleInfo(imageBase64: string, mimeType?: string): Promise<ExtractedVehicleInfo> {
    this.logger.log('🔍 Starting OCR extraction with OpenAI Vision...');

    const { dataUrl, mime } = this.toImageDataUrl(imageBase64, mimeType);
    if (!SUPPORTED_IMAGE_TYPES.has(mime)) {
      this.logger.warn(`❌ Unsupported OCR file type: ${mime}`);
      throw new Error('OCR_FAILED');
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: GEMINI_OCR_PROMPT },
                { type: 'image_url', image_url: { url: dataUrl } },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 2048,
        },
        { headers: this.headers(), timeout: 30000 },
      );

      const text: string = response.data.choices?.[0]?.message?.content || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        this.logger.warn('❌ No JSON found in OCR response');
        throw new Error('OCR_FAILED');
      }

      let parsed: any;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e: any) {
        this.logger.warn(`❌ OCR JSON parse error: ${e.message}`);
        throw new Error('OCR_FAILED');
      }

      if (parsed.error === 'invalid_brand') {
        this.logger.warn('❌ Invalid brand detected by OpenAI Vision');
        throw new Error('INVALID_BRAND');
      }

      const marque = (parsed.marque || '').toString().toUpperCase().trim();
      if (!marque.includes('SUZUKI')) {
        this.logger.warn(`❌ Brand validation failed — not SUZUKI: "${marque}"`);
        throw new Error('INVALID_BRAND');
      }

      const modeleRaw = (parsed.modele || '').toString().trim();
      const { model, matched } = this.canonicalModel(modeleRaw);
      const vin = this.normalizeVin(parsed.vin);

      const result: ExtractedVehicleInfo = {
        immatriculation: parsed.immatriculation?.toString().trim().toUpperCase() || null,
        marque: 'SUZUKI',
        modele: model,
        typeMoteur: parsed.typeMoteur?.toString().trim() || null,
        annee: parsed.annee || null,
        vin,
      };

      // Plate and VIN are personal data: keep them out of the info-level logs.
      this.logger.log(`🎯 OCR done — model "${result.modele}" (${matched ? 'canonical' : 'raw'}), VIN ${vin ? 'read' : 'not read'}`);
      this.logger.debug(`OCR result: ${JSON.stringify(result)}`);
      return result;
    } catch (error: any) {
      this.logger.error(
        `OpenAI Vision error: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`,
      );
      throw error;
    }
  }
}