import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../chat/openai.service';
import { normalizeText } from '../chat/tunisian-dictionary';

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
    // CRITICAL: Check if query is a car part name FIRST
    const carPartNames = [
      'maitre', 'maître', 'cylindre', 'etrier', 'étrier', 'toit', 'cremaillere', 'crémaillère',
      'filtre', 'plaquette', 'disque', 'amortisseur', 'phare', 'batterie', 'courroie', 'bougie',
      'alternateur', 'démarreur', 'capteur', 'pneu', 'joint', 'durite', 'radiateur', 'pompe',
      'injecteur', 'embrayage', 'roulement', 'rotule', 'biellette', 'bras', 'triangle',
      'ressort', 'silentbloc', 'soufflet', 'cache', 'support', 'agrafe', 'agraffe', 'agraphe',
      'valve', 'soupape', 'culasse', 'piston', 'segment', 'bielle', 'vilebrequin'
    ];
    
    const lowerQuery = query.toLowerCase();
    const isCarPart = carPartNames.some(part => lowerQuery.includes(part));
    
    if (isCarPart) {
      // Don't treat car parts as greetings
      return {
        normalized: query,
        isGreeting: false,
        isThanks: false,
        confidence: 0.9
      };
    }
    // CRITICAL: Rule-based pre-correction for common typos
    // Sort by length (longest first) to avoid overlapping replacements
    const knownCorrections: Record<string, string> = {
      ilbrequin: 'vilebrequin',
      vilbrequin: 'vilebrequin',
      rtaverse: 'traverse',
      rtavers: 'traverse',
      olle: 'tolle',
      avlve: 'valve',
      avse: 'vase',
      garaffes: 'agraffes',  // Longest first
      garafes: 'agrafes',
      garaffe: 'agraffe',
      garafe: 'agrafe',
      graffes: 'agraffes',
      graffe: 'agraffe',
      garaphe: 'agraphe',
      graphe: 'agraphe',
      iale: 'aile',
      ial: 'aile',
      ivtre: 'vitre',
      amorto: 'amortisseur',
      ovlant: 'volant',
      olant: 'volant',
     
    };
    
    // Sort corrections by typo length (longest first) to prevent overlaps
    const sortedCorrections = Object.entries(knownCorrections)
      .sort(([a], [b]) => b.length - a.length);
    
    let correctedQuery = query;
    const appliedCorrections = new Set<string>();
    
    for (const [typo, correct] of sortedCorrections) {
      const lowerQuery = correctedQuery.toLowerCase();
      if (lowerQuery.includes(typo) && !appliedCorrections.has(correct)) {
        correctedQuery = correctedQuery.replace(new RegExp(typo, 'gi'), correct);
        appliedCorrections.add(correct);
        this.logger.log(`✅ Pre-corrected: ${typo} → ${correct}`);
      }
    }
    
    try {
      const aiResult = await this.normalizeWithAI(correctedQuery);
      
      // ADAPTIVE: Validate AI result - extract meaningful words from ORIGINAL query (not corrected)
      const originalWords = this.extractMeaningfulWords(query);
      const correctedWords = this.extractMeaningfulWords(correctedQuery);
      const resultWords = this.extractMeaningfulWords(aiResult.normalized);
      
      // Check if AI removed or changed any meaningful words from CORRECTED query
      for (const qWord of correctedWords) {
        const hasExactMatch = resultWords.some(rw => rw === qWord);
        const hasPluralMatch = resultWords.some(rw => 
          rw === qWord + 's' || rw === qWord + 'es' || qWord === rw + 's' || qWord === rw + 'es'
        );
        const hasFuzzyMatch = resultWords.some(rw => this.levenshtein(qWord, rw) <= 1);
        
        // If corrected word is NOT in AI result → REJECT AI result
        if (!hasExactMatch && !hasPluralMatch && !hasFuzzyMatch) {
          this.logger.warn(`⚠️ AI changed/removed word "${qWord}" - using corrected query instead`);
          return {
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks: aiResult.isThanks,
            confidence: 0.7
          };
        }
      }
      
      // CRITICAL: Check if AI ADDED extra letters (e.g., "agraffes" → "aaagraffes")
      for (const rWord of resultWords) {
        // Check if result word has repeated first letters (aaa, bbb, etc.)
        if (rWord.length >= 4 && rWord[0] === rWord[1] && rWord[1] === rWord[2]) {
          this.logger.warn(`⚠️ AI added triple letters "${rWord}" - rejecting AI result`);
          this.logger.warn(`   Returning correctedQuery: "${correctedQuery}"`);
          return {
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks: aiResult.isThanks,
            confidence: 0.7
          };
        }
        
        // Check if result word starts with "a" or "aa" + corrected word (e.g., "aagraphe" when corrected is "agraphe")
        for (const cWord of correctedWords) {
          if (rWord === 'a' + cWord || rWord === 'aa' + cWord) {
            this.logger.warn(`⚠️ AI added prefix to "${cWord}" → "${rWord}" - rejecting AI result`);
            this.logger.warn(`   Returning correctedQuery: "${correctedQuery}"`);
            return {
              normalized: correctedQuery,
              isGreeting: aiResult.isGreeting,
              isThanks: aiResult.isThanks,
              confidence: 0.7
            };
          }
        }
      }
      
      this.logger.log(`✅ AI: "${query}" → "${aiResult.normalized}" (${aiResult.confidence})`);
      return aiResult;
    } catch (error) {
      this.logger.warn(`⚠️ AI failed: ${error.message}`);
      const fallbackNormalized = normalizeText(correctedQuery);
      return { 
        normalized: fallbackNormalized || correctedQuery, 
        isGreeting: /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(correctedQuery),
        isThanks: /^(merci|thanks|3aychek|barcha)\b/i.test(correctedQuery),
        confidence: 0.5 
      };
    }
  }
  
  private extractMeaningfulWords(text: string): string[] {
    const normalized = this.normalizeForComparison(text);
    const words = normalized.split(/\s+/).filter(w => 
      w.length >= 3 && 
      !['avant','arriere','gauche','droite','pour','avec','sans','tout','tous','des','les','une'].includes(w)
    );
    return words;
  }
  
  private normalizeForComparison(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  private levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
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

  private async normalizeWithAI(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    const prompt = `You are a car parts query parser. Segment and translate concatenated French/Tunisian car parts queries.

CRITICAL RULES:
1. PRESERVE ORIGINAL WORDS - only expand abbreviations and fix spacing
2. DO NOT change "agrafe" to "agrave" or similar mistakes
3. DO NOT change "agraffes" to "àgraves" or similar mistakes
4. Recognize ALL position indicators: avant/av, arriere/ar, gauche/g, droite/d, superieur/sup, inferieur/inf
5. Recognize car parts: agrafe, agraffe, agraphe, alimentateur, aile, porte, capot, phare, filtre, plaquette, disque, amortisseur, etc.
6. PRESERVE ALL POSITIONS - if query has "ar" AND "av", keep BOTH
7. Return properly spaced French
8. isGreeting=true ONLY if pure greeting with NO car parts/positions
9. PRESERVE SINGLE-LETTER POSITIONS: if query has "g" (gauche) or "d" (droite), keep them.
   Example: "g ar glace monte appareil" → "gauche arrière glace monte appareil" (NOT "glace arrière monte appareil")

EXAMPLES:
- "adhesifarporteavg" → "adhésif arrière porte avant gauche" (has AR and AV)
- "adhesifporteavd" → "adhésif porte avant droite"
- "plaquetteavg" → "plaquette avant gauche"
- "àgràffes feu àr" → "agraffes feu arrière" (NOT "àgraves feu arrière")
- "garafe feu ar" → "agrafe feu arrière"
- "àlimentàteur toit" → "alimentateur toit"
- "ahla" → "bonjour" (isGreeting=true)
- "choufli avant" → "montre-moi avant" (isGreeting=false)
- "g ar glace monte appareil" → "gauche arrière glace monte appareil"

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
