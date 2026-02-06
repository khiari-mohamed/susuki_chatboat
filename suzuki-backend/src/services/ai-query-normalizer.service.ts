import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../chat/openai.service';

@Injectable()
export class AIQueryNormalizerService {
  private readonly logger = new Logger(AIQueryNormalizerService.name);

  constructor(private openaiService: OpenAIService) {}

  async normalizeQuery(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    try {
      const aiResult = await this.normalizeWithAI(query);
      this.logger.log(`✅ AI: "${query}" → "${aiResult.normalized}" (${aiResult.confidence})`);
      return aiResult;
    } catch (error) {
      this.logger.warn(`⚠️ AI failed, fallback: ${error.message}`);
      return this.fallbackNormalization(query);
    }
  }

  private async normalizeWithAI(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    const prompt = `Normalize to French. Fix typos, translate Tunisian dialect.

EXAMPLES:
- "salem" → "bonjour" (greeting)
- "amortiseeur" → "amortisseur" (typo)
- "bghit filtre" → "je veux filtre" (Tunisian)
- "plakette frain" → "plaquette frein" (typos)
- "merci" → "merci" (thanks)
- "3aychek" → "merci" (thanks, Tunisian)
- "barcha" → "merci beaucoup" (thanks, Tunisian)

QUERY: "${query}"

JSON only:
{"normalized":"...","isGreeting":true/false,"isThanks":true/false,"confidence":0.0-1.0}`;

    const response = await this.openaiService.chat(prompt, [], 'JSON only');
    const jsonMatch = response.match(/\{[^}]+\}/);
    if (!jsonMatch) throw new Error('No JSON');

    const result = JSON.parse(jsonMatch[0]);
    return {
      normalized: result.normalized || query,
      isGreeting: !!result.isGreeting,
      isThanks: !!result.isThanks,
      confidence: result.confidence || 0.9
    };
  }

  private fallbackNormalization(query: string): {
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  } {
    const lower = query.toLowerCase().trim();
    const isGreeting = /^(bonjour|salut|hello|hi|salem|ahla|salam|assalam)\b/i.test(lower);
    const isThanks = /^(merci|thanks|shukran|3aychek|barcha|brcha)\b/i.test(lower);
    
    let normalized = query
      .replace(/amortiseeur|amortiseur|amortisor/gi, 'amortisseur')
      .replace(/plakette|plakete/gi, 'plaquette')
      .replace(/bateri|batri/gi, 'batterie')
      .replace(/frain|frin/gi, 'frein')
      .replace(/filtere|filtr\b/gi, 'filtre')
      .replace(/\b(salem|ahla|salam|assalam)\b/gi, 'bonjour')
      .replace(/\b(bghit|n7eb)\b/gi, 'je veux')
      .replace(/\b(famma|mawjoud)\b/gi, 'disponible')
      .replace(/\bkifech\b/gi, 'comment')
      .replace(/\b(ta3|mte3)\b/gi, 'de')
      .replace(/\bch7al\b/gi, 'combien');
    
    return { normalized, isGreeting, isThanks, confidence: 0.6 };
  }
}
