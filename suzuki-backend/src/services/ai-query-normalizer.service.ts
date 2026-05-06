// src/services/ai-query-normalizer.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../chat/openai.service';
import { SynonymsService } from '../synonyms/synonyms.service';

@Injectable()
export class AIQueryNormalizerService {
  private readonly logger = new Logger(AIQueryNormalizerService.name);
  private tunisianWordSet: Set<string> | null = null;

  constructor(
    private openaiService: OpenAIService,
    private synonymsService: SynonymsService,
  ) {}

  private getTunisianWordSet(): Set<string> {
    if (!this.tunisianWordSet) {
      this.tunisianWordSet = new Set(Object.keys(this.synonymsService.getTunisianMap()));
    }
    return this.tunisianWordSet;
  }

  async normalizeQuery(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    const carPartNames = [
      'maitre', 'maître', 'cylindre', 'etrier', 'étrier', 'toit', 'cremaillere', 'crémaillère',
      'filtre', 'plaquette', 'disque', 'amortisseur', 'phare', 'batterie', 'courroie', 'bougie',
      'alternateur', 'démarreur', 'capteur', 'pneu', 'joint', 'durite', 'radiateur', 'pompe',
      'injecteur', 'embrayage', 'roulement', 'rotule', 'biellette', 'bras', 'triangle',
      'ressort', 'silentbloc', 'soufflet', 'cache', 'support', 'agrafe', 'agraffe', 'agraphe',
      'valve', 'soupape', 'culasse', 'piston', 'segment', 'bielle', 'vilebrequin', 'frein', 'frina',
      'silencieux', 'echappement',
    ];

    const lowerQuery = query.toLowerCase();
    const isCarPart = carPartNames.some((part) => lowerQuery.includes(part));
    const isServiceQuestion =
      /ouvrez|ouvert|heure|horaire|livraison|délai|garantie|situé|adresse|où|localisation/i.test(lowerQuery);

    // If the query contains Tunisian markers, always go through full normalization
    // even when a car part name is detected.
    const hasTunisianMarker = /[0-9]/.test(lowerQuery.replace(/\s/g, '')) ||
      /\b(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)\b/i.test(lowerQuery) ||
      [...this.getTunisianWordSet()].some(
        (tn) => new RegExp(`\\b${tn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerQuery),
      );

    if (isCarPart && !hasTunisianMarker) {
      return { normalized: query, isGreeting: false, isThanks: false, confidence: 0.9 };
    }
    if (isServiceQuestion && !hasTunisianMarker) {
      return { normalized: query, isGreeting: false, isThanks: false, confidence: 0.9 };
    }

    const knownCorrections: Record<string, string> = {
      ilbrequin: 'vilebrequin',
      vilbrequin: 'vilebrequin',
      rtaverse: 'traverse',
      rtavers: 'traverse',
      olle: 'tolle',
      avlve: 'valve',
      avse: 'vase',
      garaffes: 'agraffes',
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

    const sortedCorrections = Object.entries(knownCorrections).sort(([a], [b]) => b.length - a.length);

    let correctedQuery = query;
    const appliedCorrections = new Set<string>();

    for (const [typo, correct] of sortedCorrections) {
      const lq = correctedQuery.toLowerCase();
      if (lq.includes(typo) && !appliedCorrections.has(correct)) {
        correctedQuery = correctedQuery.replace(new RegExp(typo, 'gi'), correct);
        appliedCorrections.add(correct);
        this.logger.log(`✅ Pre-corrected: ${typo} → ${correct}`);
      }
    }

    try {
      const aiResult = await this.normalizeWithAI(correctedQuery);
      const correctedWords = this.extractMeaningfulWords(correctedQuery);
      const resultWords = this.extractMeaningfulWords(aiResult.normalized);

      // Tunisian tokens (containing digits, or known Tunisian words) are ALLOWED to be
      // transformed/removed by the AI — do not require them to survive verbatim.
      const tunisianPattern = /[0-9]|^(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|salam|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)$/i;
      const tunisianMap = this.synonymsService.getTunisianMap();

      for (const qWord of correctedWords) {
        // Skip check for Tunisian words — AI is allowed to translate them
        if (tunisianPattern.test(qWord) || tunisianMap[qWord] !== undefined) continue;

        const hasExactMatch = resultWords.some((rw) => rw === qWord);
        const hasPluralMatch = resultWords.some(
          (rw) => rw === qWord + 's' || rw === qWord + 'es' || qWord === rw + 's' || qWord === rw + 'es',
        );
        const hasFuzzyMatch = resultWords.some((rw) => this.levenshtein(qWord, rw) <= 1);

        if (!hasExactMatch && !hasPluralMatch && !hasFuzzyMatch) {
          this.logger.warn(`⚠️ AI changed/removed word "${qWord}" - using corrected query instead`);
          return {
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks: aiResult.isThanks,
            confidence: 0.7,
          };
        }
      }

      for (const rWord of resultWords) {
        if (rWord.length >= 4 && rWord[0] === rWord[1] && rWord[1] === rWord[2]) {
          this.logger.warn(`⚠️ AI added triple letters "${rWord}" - rejecting AI result`);
          return {
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks: aiResult.isThanks,
            confidence: 0.7,
          };
        }
        for (const cWord of correctedWords) {
          if (rWord === 'a' + cWord || rWord === 'aa' + cWord) {
            this.logger.warn(`⚠️ AI added prefix to "${cWord}" → "${rWord}" - rejecting AI result`);
            return {
              normalized: correctedQuery,
              isGreeting: aiResult.isGreeting,
              isThanks: aiResult.isThanks,
              confidence: 0.7,
            };
          }
        }
      }

      this.logger.log(`✅ AI: "${query}" → "${aiResult.normalized}" (${aiResult.confidence})`);
      return aiResult;
    } catch (error: any) {
      this.logger.warn(`⚠️ AI failed: ${error.message}`);
      // Fallback: apply Tunisian normalization using DB-driven map
      const fallbackNormalized = this.applyTunisianNormalization(correctedQuery);
      return {
        normalized: fallbackNormalized || correctedQuery,
        isGreeting: /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(correctedQuery),
        isThanks:
          /\b(merci|thanks|3aychek|barcha|au revoir|bye|à bientôt|bonne journée|besslema|sahha|ciao|adieu)\b/i.test(
            correctedQuery,
          ),
        confidence: 0.5,
      };
    }
  }

  /**
   * Replaces Tunisian words in the query with their French equivalents.
   * Uses the DB-driven TN map from SynonymsService — replaces the old normalizeText() import.
   */
  private applyTunisianNormalization(query: string): string {
    const tunisianMap = this.synonymsService.getTunisianMap();
    let result = query.toLowerCase().trim();
    for (const [tunisian, french] of Object.entries(tunisianMap)) {
      const escaped = tunisian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      result = result.replace(regex, french);
    }
    return result;
  }

  private extractMeaningfulWords(text: string): string[] {
    const normalized = this.normalizeForComparison(text);
    return normalized
      .split(/\s+/)
      .filter(
        (w) =>
          w.length >= 3 &&
          !['avant', 'arriere', 'gauche', 'droite', 'pour', 'avec', 'sans', 'tout', 'tous', 'des', 'les', 'une', 'stock', 'disponible'].includes(w),
      );
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
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
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
9. isThanks=true for goodbyes (au revoir, bye, besslema, à bientôt, bonne journée) AND thanks (merci, thank you)
10. PRESERVE SINGLE-LETTER POSITIONS: if query has "g" (gauche) or "d" (droite), keep them.

EXAMPLES:
- "adhesifarporteavg" → "adhésif arrière porte avant gauche"
- "plaquetteavg" → "plaquette avant gauche"
- "garafe feu ar" → "agrafe feu arrière"
- "ahla" → "bonjour" (isGreeting=true)
- "merci" → "merci" (isThanks=true)
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
      confidence: result.confidence || 0.9,
    };
  }
}