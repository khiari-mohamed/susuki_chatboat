import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../chat/openai.service';
import { applyTunisianFallback } from '../constants/tunisian-fallback';

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
    // CRITICAL: Rule-based pre-correction for common typos
    const knownCorrections: Record<string, string> = {
      ilbrequin: 'vilebrequin',
      vilbrequin: 'vilebrequin',
      rtaverse: 'traverse',
      rtavers: 'traverse',
      olle: 'tolle',
      avlve: 'valve',
      avse: 'vase',
      garafe: 'agrafe',
      garafes: 'agrafes',
      garaffe: 'agraffe',
      garaffes: 'agraffes',
      graffe: 'agraffe',
      graffes: 'agraffes',
      garaphe: 'agraphe',
      graphe: 'agraphe',
      iale: 'aile',
      ial: 'aile',
      itre: 'vitre',
      ivtre: 'vitre',
      ovlant: 'volant',
      olant: 'volant'
    };
    
    let correctedQuery = query;
    for (const [typo, correct] of Object.entries(knownCorrections)) {
      if (correctedQuery.toLowerCase().includes(typo)) {
        correctedQuery = correctedQuery.replace(new RegExp(typo, 'gi'), correct);
        this.logger.log(`✅ Pre-corrected: ${typo} → ${correct}`);
      }
    }
    
    try {
      const aiResult = await this.normalizeWithAI(correctedQuery);
      this.logger.log(`✅ AI: "${query}" → "${aiResult.normalized}" (${aiResult.confidence})`);
      return aiResult;
    } catch (error) {
      this.logger.warn(`⚠️ AI failed: ${error.message}`);
      const fallbackNormalized = applyTunisianFallback(correctedQuery);
      return { 
        normalized: fallbackNormalized || correctedQuery, 
        isGreeting: /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(correctedQuery),
        isThanks: /^(merci|thanks|3aychek|barcha)\b/i.test(correctedQuery),
        confidence: 0.5 
      };
    }
  }

  private async normalizeWithAI(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    const prompt = `You are a car parts query parser. Segment and translate concatenated French/Tunisian car parts queries.

RULES:
1. Recognize ALL position indicators: avant/av, arriere/ar, gauche/g, droite/d, superieur/sup, inferieur/inf
2. Recognize car parts: adhesif, porte, aile, capot, phare, filtre, plaquette, disque, amortisseur, etc.
3. PRESERVE ALL POSITIONS - if query has "ar" AND "av", keep BOTH
4. Return properly spaced French
5. isGreeting=true ONLY if pure greeting with NO car parts/positions

EXAMPLES:
- "adhesifarporteavg" → "adhésif arrière porte avant gauche" (has AR and AV)
- "adhesifporteavd" → "adhésif porte avant droite"
- "plaquetteavg" → "plaquette avant gauche"
- "ahla" → "bonjour" (isGreeting=true)
- "choufli avant" → "montre-moi avant" (isGreeting=false)

QUERY: "${query}"

JSON:
{"normalized":"French with ALL positions","isGreeting":true/false,"isThanks":true/false,"confidence":0.0-1.0}`;

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


}
