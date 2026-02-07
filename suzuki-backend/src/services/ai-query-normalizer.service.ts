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
    try {
      const aiResult = await this.normalizeWithAI(query);
      this.logger.log(`✅ AI: "${query}" → "${aiResult.normalized}" (${aiResult.confidence})`);
      return aiResult;
    } catch (error) {
      this.logger.warn(`⚠️ AI failed: ${error.message}`);
      const fallbackNormalized = applyTunisianFallback(query);
      return { 
        normalized: fallbackNormalized || query, 
        isGreeting: /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(query),
        isThanks: /^(merci|thanks|3aychek|barcha)\b/i.test(query),
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
    const prompt = `You are a native Tunisian speaker and expert translator. Understand and translate ANY Tunisian dialect (Darija) word or phrase to French naturally.

You understand:
- ALL Tunisian Arabic words and slang
- Numbers as Arabic letters (3=ع, 7=ح, 9=ق, 5=خ, 8=غ, 2=ء)
- French-Arabic mix
- Regional variations
- Informal speech

Translate naturally to French for car parts context.

Common Tunisian patterns (examples - you know MORE):
- n7eb/bghit/nchri = je veux/acheter
- chouf/choufli/wri = regarde/montre-moi
- behi/yezzi/ok = ok/d'accord
- famma/mawjoud = disponible/il y a
- ch7al/9ad/9adech = combien
- mte3/ta3/lel = de/pour
- karhba/makina = voiture
- miray/mirwar = rétroviseur
- frina/frin = frein
- batri/bataria = batterie
- amorto/amor = amortisseur
- plak/plakete = plaquette
- disk/disq = disque
- dhou/dhaw/fnar = phare
- aile/el aile = aile
- 9oddem/goddem = avant
- wra/louta = arrière
- ysar/chmel/gosh = gauche
- ymin/limen = droite
- ahla/salem/salam = bonjour
- 3aychek/ya3tik/barcha = merci/beaucoup

IMPORTANT:
- isGreeting=true ONLY if it's a PURE greeting with NO car parts or positions mentioned
- If query mentions positions (avant/arrière/gauche/droite) or actions (chouf/montre/voir), it's NOT a greeting
- "behi choufli l'avant" = NOT a greeting (it's asking to show front parts)
- "ahla" alone = greeting

QUERY: "${query}"

JSON:
{"normalized":"French translation","isGreeting":true/false,"isThanks":true/false,"confidence":0.0-1.0}`;

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
