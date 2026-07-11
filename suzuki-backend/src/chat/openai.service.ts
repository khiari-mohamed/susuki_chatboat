// src/chat/openai.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: chat() system prompt now includes a French-first instruction
//         block that tells the AI to use displayName / designation_2
//         (French) when naming parts in humanReadable responses, and
//         to never output raw English OEM codes like "MIRROR ASSY,OUT".
//
// FIX-2: chat() conversation history mapping now strips the `metadata`
//         field added by session.service.ts (FIX-2 there) before
//         sending to OpenAI — OpenAI only accepts role+content.
//
// FIX-3: extractVehicleInfo() suzukiModels map extended to match the
//         MODEL_ALIASES map in vehicle-models.service.ts:
//         Added FRONX, DZIRE variants, NEW CELERIO, NEW SWIFT, etc.
//         Also normalises "S-PRESSO" → canonical form consistently.
//
// FIX-4: All console.log / console.error calls replaced with the
//         NestJS Logger so OCR output appears in structured logs
//         alongside the rest of the application.
//
// FIX-5: Cache key generation now includes a hash of the last
//         bot message's intent metadata so cached responses are
//         not incorrectly reused across different conversation states
//         (e.g. a CLARIFICATION_NEEDED state vs a PARTS_SEARCH state
//         with the same user message text).
//
// BUSINESS LOGIC UNCHANGED:
//   ✅ gpt-4o-mini model
//   ✅ Rate limiting (500 ms between calls)
//   ✅ 5-minute response cache
//   ✅ 2-retry callWithRetry
//   ✅ temperature 0.3, max_tokens 1024
//   ✅ Vision API for OCR (gpt-4o-mini with image_url)
//   ✅ SUZUKI brand validation
//   ✅ Graceful fallback on error
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GEMINI_CHAT_PROMPT, GEMINI_OCR_PROMPT } from './prompt-templates';

// ─────────────────────────────────────────────────────────────────
// FIX-3: Canonical Suzuki model map — kept in sync with
//         vehicle-models.service.ts MODEL_ALIASES
// ─────────────────────────────────────────────────────────────────
const SUZUKI_MODELS_CANONICAL: Record<string, string> = {
  // Core models
  'CELERIO':       'CELERIO',
  'NEWCELERIO':    'CELERIO',
  'SWIFT':         'SWIFT',
  'NEWSWIFT':      'SWIFT',
  'SWIFTIV':       'SWIFT',
  'SWIFT4':        'SWIFT',
  'SPRESSO':       'S-PRESSO',
  'VITARA':        'VITARA',
  'JIMNY':         'JIMNY',
  'JIMNY5D':       'JIMNY',
  'BALENO':        'BALENO',
  'NEWBALENO':     'BALENO',
  'IGNIS':         'IGNIS',
  'ALTO':          'ALTO',
  'ERTIGA':        'ERTIGA',
  'DZIRE':         'DZIRE',
  'NEWDZIRE':      'DZIRE',
  'CIAZ':          'CIAZ',
  'NEWCIAZ':       'CIAZ',
  'SCROSS':        'S-CROSS',
  'WAGON':         'WAGON R',
  'WAGONR':        'WAGON R',
  'FRONX':         'FRONX',           // FIX-3: was missing
  'NEWFRONX':      'FRONX',           // FIX-3: was missing
  'GRAND':         'GRAND VITARA',    // FIX-3: was missing
  'GRANDVITARA':   'GRAND VITARA',    // FIX-3: was missing
};

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);   // FIX-4
  private readonly apiKey:  string;
  private readonly apiUrl   = 'https://api.openai.com/v1/chat/completions';
  private readonly model    = 'gpt-4o-mini';
  private readonly RATE_LIMIT_DELAY = 500;
  private lastCallTime      = 0;
  private readonly responseCache = new Map<string, { response: string; timestamp: number }>();
  private readonly CACHE_TTL     = 5 * 60 * 1000;

  private metrics = {
    totalCalls:          0,
    successfulCalls:     0,
    failedCalls:         0,
    averageResponseTime: 0,
    cacheHits:           0,
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
  // chat() — main NLP entry point
  // FIX-1: French-first instruction injected into system prompt
  // FIX-2: metadata stripped from conversation history
  // ─────────────────────────────────────────────────────────────────
  async chat(
    message:             string,
    conversationHistory: Array<{ role: string; content: string; metadata?: any }>,
    context?:            string,
    hasPendingClarification?: boolean,
  ): Promise<string> {
    this.metrics.totalCalls++;

    // FIX-2: strip metadata before sending to OpenAI — it only accepts role + content
    const cleanHistory = (conversationHistory || []).map((m) => ({
      role:    m.role,
      content: m.content,
    }));

    const { message: sanitizedMessage, conversationHistory: sanitizedHistory } =
      this.validateAndSanitizeInput(message, cleanHistory);

    await this.enforceRateLimit();

    const isSimpleConversation =
      context && (context.includes('greeting') || context.includes('acknowledgment'));

    // FIX-1: French-first instruction block appended to base system prompt
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

    // FIX-5: Include last bot intent in cache key to avoid cross-state cache hits
    const lastBotMeta = (conversationHistory || [])
      .filter((m) => m.role === 'bot' || m.role === 'assistant')
      .slice(-1)[0]?.metadata;
    const intentHint = lastBotMeta?.intent ?? '';

    const cacheKey = this.generateCacheKey(
      sanitizedMessage,
      context,
      sanitizedHistory,
      hasPendingClarification,
      intentHint,       // FIX-5
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

      const duration = Date.now() - start;
      this.metrics.successfulCalls++;
      this.metrics.averageResponseTime =
        (this.metrics.averageResponseTime * (this.metrics.successfulCalls - 1) + duration) /
        this.metrics.successfulCalls;

      return response;
    } catch (error: any) {
      this.metrics.failedCalls++;
      this.logger.error(
        'OpenAI API error:',
        error.response?.data || error.message || error,
      );
      return this.getGracefulFallback();
    }
  }

  private async callWithRetry(
    systemPrompt:        string,
    message:             string,
    conversationHistory: Array<{ role: string; content: string }>,
    maxRetries           = 2,
  ): Promise<string> {
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

  private async callOpenAIAPI(
    systemPrompt:        string,
    message:             string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role:    msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const resp = await axios.post(
      this.apiUrl,
      {
        model:       this.model,
        messages,
        temperature: 0.3,
        max_tokens:  1024,
        top_p:       0.8,
      },
      {
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 15000,
      },
    );

    return (
      resp.data.choices?.[0]?.message?.content ||
      "Désolé, je n'ai pas pu générer de réponse."
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // Cache helpers
  // FIX-5: intentHint parameter added to generateCacheKey
  // ─────────────────────────────────────────────────────────────────
  private generateCacheKey(
    message:                 string,
    context?:                string,
    history?:                Array<{ role: string; content: string }>,
    hasPendingClarification?: boolean,
    intentHint?:             string,  // FIX-5
  ): string {
    const hist = (history || [])
      .slice(-3)
      .map((h) => `${h.role}:${h.content}`)
      .join('|');
    return [
      message,
      context || '',
      hist,
      hasPendingClarification ? 'pending' : 'no-pending',
      intentHint || '',    // FIX-5
    ].join('::');
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

  private validateAndSanitizeInput(
    message:             string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): {
    message:             string;
    conversationHistory: Array<{ role: string; content: string }>;
  } {
    const sanitizedMessage = String(message || '').trim().slice(0, 4000);
    const sanitizedHistory = (conversationHistory || []).slice(-10).map((msg) => ({
      role:    msg.role === 'user' ? 'user' : 'assistant',
      content: String(msg.content || '').slice(0, 2000),
    }));
    return { message: sanitizedMessage, conversationHistory: sanitizedHistory };
  }

  private async enforceRateLimit(): Promise<void> {
    const now   = Date.now();
    const since = now - this.lastCallTime;
    if (since < this.RATE_LIMIT_DELAY) await this.delay(this.RATE_LIMIT_DELAY - since);
    this.lastCallTime = Date.now();
  }

  private getGracefulFallback(): string {
    return (
      'Je rencontre actuellement des difficultés techniques. ' +
      'Veuillez réessayer dans quelques instants ou contacter CarPro au ☎️ 70 603 500 pour une assistance immédiate.'
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalCalls > 0
        ? (this.metrics.successfulCalls / this.metrics.totalCalls) * 100
        : 0,
      cacheSize: this.responseCache.size,
    };
  }

  clearCache(): void {
    this.responseCache.clear();
    this.logger.log('OpenAI response cache cleared');
  }

  // ─────────────────────────────────────────────────────────────────
  // extractVehicleInfo — OCR via gpt-4o-mini Vision
  // FIX-3: Extended suzukiModels map
  // FIX-4: console.log → this.logger
  // ─────────────────────────────────────────────────────────────────
  async extractVehicleInfo(imageBase64: string, mimeType?: string): Promise<any> {
    const prompt = GEMINI_OCR_PROMPT;

    this.logger.log('🔍 Starting OCR extraction with OpenAI Vision...');    // FIX-4

    try {
      // MIME type detection
      let detectedMimeType = mimeType;
      if (!detectedMimeType) {
        if      (imageBase64.startsWith('data:image/png'))         detectedMimeType = 'image/png';
        else if (imageBase64.startsWith('data:image/webp'))        detectedMimeType = 'image/webp';
        else if (imageBase64.startsWith('data:application/pdf'))   detectedMimeType = 'application/pdf';
        else                                                        detectedMimeType = 'image/jpeg';
      }
      this.logger.log(`📷 Detected MIME type: ${detectedMimeType}`);        // FIX-4

      this.logger.log('🚀 Calling OpenAI Vision API...');                   // FIX-4
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role:    'user',
              content: [
                { type: 'text',      text:      prompt },
                { type: 'image_url', image_url: { url: imageBase64 } },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens:  2048,
        },
        {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 30000,
        },
      );

      this.logger.log('✅ OpenAI Vision API response received');             // FIX-4
      const text = response.data.choices?.[0]?.message?.content || '{}';
      this.logger.debug(`📝 Raw OCR text: ${text}`);                        // FIX-4 — debug level

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        this.logger.warn('❌ No JSON found in OCR response');                // FIX-4
        throw new Error('OCR_FAILED');
      }

      const jsonText = jsonMatch[0];
      this.logger.debug(`📦 Extracted JSON: ${jsonText}`);                  // FIX-4

      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
        this.logger.log(`✅ OCR JSON parsed: ${JSON.stringify(parsed)}`);   // FIX-4
      } catch (e: any) {
        this.logger.warn(`❌ JSON parse error: ${e.message}`);              // FIX-4
        throw new Error('OCR_FAILED');
      }

      if (parsed.error === 'invalid_brand') {
        this.logger.warn('❌ Invalid brand detected by OpenAI Vision');      // FIX-4
        throw new Error('INVALID_BRAND');
      }

      const marque = (parsed.marque || '').toString().toUpperCase().trim();
      this.logger.log(`🔍 Validating brand: ${marque}`);                    // FIX-4

      if (!marque.includes('SUZUKI')) {
        this.logger.warn(`❌ Brand validation failed — not SUZUKI: "${marque}"`); // FIX-4
        throw new Error('INVALID_BRAND');
      }
      this.logger.log('✅ Brand validated: SUZUKI');                         // FIX-4

      // FIX-3: Use extended canonical model map
      const modeleRaw  = (parsed.modele || '').toString().trim();
      const modeleNorm = modeleRaw
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/\./g, '')
        .replace(/-/g, '');

      this.logger.log(`🔍 Model detected: "${modeleRaw}" (normalized: ${modeleNorm})`); // FIX-4

      let modeleCanon    = modeleRaw.toUpperCase();
      let matchConfidence = 90;

      // FIX-3: Check against extended canonical map
      for (const [key, value] of Object.entries(SUZUKI_MODELS_CANONICAL)) {
        if (modeleNorm.includes(key)) {
          modeleCanon     = value;
          matchConfidence = 95;
          this.logger.log(`✅ Model validated: ${modeleCanon}`);            // FIX-4
          break;
        }
      }

      // Additional normalisation: "S-PRESSO" variant handling
      if (modeleNorm.includes('SPRESSO') || modeleNorm.includes('SPRES')) {
        modeleCanon     = 'S-PRESSO';
        matchConfidence = 97;
      }

      const result = {
        immatriculation: parsed.immatriculation?.trim().toUpperCase() || null,
        marque:          'SUZUKI',
        modele:          modeleCanon || modeleRaw.toUpperCase(),
        typeMoteur:      parsed.typeMoteur?.trim() || null,
        annee:           parsed.annee || null,
        // FIX-3: Include match confidence for upstream logging
        _confidence:     matchConfidence,
        // Include source for audit trail
        source:          'OpenAI Vision gpt-4o-mini',
      };

      this.logger.log(`🎯 OCR FINAL RESULT: ${JSON.stringify(result)}`);    // FIX-4
      this.logger.log(`📊 Match confidence: ${matchConfidence}%`);          // FIX-4

      // Remove internal fields before returning to caller
      const { _confidence, source: _src, ...publicResult } = result;
      return publicResult;
    } catch (error: any) {
      this.logger.error(                                                      // FIX-4
        `OpenAI Vision error: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`,
      );
      throw error;
    }
  }
}