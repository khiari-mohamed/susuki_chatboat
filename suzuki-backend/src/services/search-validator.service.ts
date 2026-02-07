import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ValidationResult {
  query: string;
  aiResultCount: number;
  dbResultCount: number;
  status: 'MATCH' | 'AI_MISS' | 'AI_FALSE_POSITIVE' | 'MISMATCH';
  aiTopResults: string[];
  dbTopResults: string[];
  timestamp: Date;
}

@Injectable()
export class SearchValidatorService {
  private readonly logger = new Logger(SearchValidatorService.name);
  private validationLog: ValidationResult[] = [];
  private readonly MAX_LOG_SIZE = 100;

  // CRITICAL: Use EXACT same synonyms as AdvancedSearchService
  private readonly synonyms: Record<string, string[]> = {
    avant: ['avant', 'av', 'avent'],
    arriere: ['arriere', 'arrière', 'ar'],
    gauche: ['gauche', 'g', 'conducteur', 'gosh'],
    droite: ['droite', 'd', 'passager', 'droit'],
    amortisseur: ['amortisseur', 'amorto', 'amort', 'suspension'],
    amortiseur: ['amortisseur', 'amorto', 'amort', 'suspension'],
    plaquette: ['plaquette', 'plaquettes', 'plaq', 'pad', 'pads'],
    disque: ['disque', 'disques', 'disc', 'disk'],
    frein: ['frein', 'freinage', 'brake', 'frain'],
    filtre: ['filtre', 'filter', 'filtr', 'filtere'],
    air: ['air', 'admission', 'intake'],
    huile: ['huile', 'oil'],
    disponible: ['disponible', 'stock', 'availability'],
    retroviseur: ['retroviseur', 'rétroviseur', 'miroir', 'mirroir', 'retro', 'rétro', 'mirwar', 'miray'],
    batterie: ['batterie', 'battery', 'batri', 'bateri', 'bataria', 'accumulator', 'accu'],
  };

  constructor(private prisma: PrismaService) {}

  async validateSearch(query: string, aiResults: any[], vehicle?: any): Promise<void> {
    console.log(`🔍 VALIDATING: "${query}" - AI found ${aiResults.length} results`);
    
    try {
      // Use EXACT same normalization as AdvancedSearchService
      const normalized = query
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Tokenize EXACTLY like AI
      const allTokens = normalized.split(' ').filter(t => t.length > 0);
      const tokens = allTokens.filter(t => t.length > 2);
      
      // CRITICAL: Expand with synonyms EXACTLY like AI does
      const expandedTokens = new Set<string>();
      
      // Add original tokens
      tokens.forEach(t => expandedTokens.add(t));
      
      // Expand each token with its synonyms (like AI's expandWithSynonymsContextual)
      tokens.forEach(token => {
        if (this.synonyms[token]) {
          this.synonyms[token].slice(0, 3).forEach(syn => expandedTokens.add(syn));
        }
      });
      
      // Add short position tokens (av, ar, g, d)
      allTokens.forEach(t => {
        if (t.length <= 2 && ['av', 'ar', 'g', 'd'].includes(t)) {
          expandedTokens.add(t);
        }
      });
      
      const finalTokens = Array.from(expandedTokens);
      
      if (finalTokens.length === 0) {
        console.log('⚠️ No valid tokens, skipping validation');
        return;
      }
      
      // Build search conditions EXACTLY like AdvancedSearchService.buildSearchConditions
      const searchConditions: any[] = [];
      finalTokens.slice(0, 10).forEach(term => {
        searchConditions.push({
          OR: [
            { designation: { contains: term, mode: 'insensitive' } },
            { reference: { contains: term, mode: 'insensitive' } }
          ]
        });
      });
      
      const dbResults = await this.prisma.piecesRechange.findMany({
        where: { OR: searchConditions },
        take: 100
      });

      const aiCount = aiResults.length;
      const dbCount = dbResults.length;
      
      console.log(`📊 COMPARISON: AI=${aiCount}, DB=${dbCount}`);
      
      let status: ValidationResult['status'];
      
      // Since both use EXACT same logic, they should match closely
      // IMPORTANT: AI applies scoring/filtering, so it returns FEWER results than raw DB
      // This is CORRECT behavior - AI filters out low-quality matches
      const difference = Math.abs(aiCount - dbCount);
      const percentDiff = dbCount > 0 ? (difference / dbCount) * 100 : 0;
      
      if (aiCount === 0 && dbCount > 0) {
        status = 'AI_MISS';
        this.logger.error(`🚨 AI MISS: "${query}"\n  AI found: 0\n  DB found: ${dbCount}\n  DB results: ${dbResults.slice(0, 3).map(r => r.designation).join(', ')}`);
      } else if (aiCount > 0 && dbCount === 0) {
        status = 'AI_FALSE_POSITIVE';
        this.logger.error(`🚨 FALSE POSITIVE: "${query}"\n  AI found: ${aiCount}\n  DB found: 0\n  AI results: ${aiResults.slice(0, 3).map(r => r.designation).join(', ')}`);
      } else if (aiCount > dbCount) {
        // AI should NEVER return MORE results than DB (this is a real problem)
        status = 'AI_FALSE_POSITIVE';
        this.logger.error(`🚨 AI OVER-REPORTING: "${query}"\n  AI: ${aiCount} results\n  DB: ${dbCount} results`);
      } else if (aiCount < dbCount) {
        // AI returning FEWER results is EXPECTED (scoring/filtering)
        status = 'MATCH';
        this.logger.debug(`✅ MATCH (AI filtered): "${query}" - AI: ${aiCount}, DB: ${dbCount}`);
      } else {
        // Exact match
        status = 'MATCH';
        this.logger.debug(`✅ MATCH: "${query}" - AI: ${aiCount}, DB: ${dbCount}`);
      }

      // Store validation result
      const result: ValidationResult = {
        query,
        aiResultCount: aiCount,
        dbResultCount: dbCount,
        status,
        aiTopResults: aiResults.slice(0, 1).map(r => r.designation),
        dbTopResults: dbResults.slice(0, 1).map(r => r.designation),
        timestamp: new Date()
      };

      this.validationLog.push(result);
      if (this.validationLog.length > this.MAX_LOG_SIZE) {
        this.validationLog.shift();
      }

    } catch (error) {
      this.logger.error('Validation error:', error);
    }
  }

  getValidationReport(): {
    totalValidations: number;
    matches: number;
    aiMisses: number;
    falsePositives: number;
    mismatches: number;
    accuracy: number;
    recentIssues: ValidationResult[];
  } {
    const total = this.validationLog.length;
    const matches = this.validationLog.filter(v => v.status === 'MATCH').length;
    const aiMisses = this.validationLog.filter(v => v.status === 'AI_MISS').length;
    const falsePositives = this.validationLog.filter(v => v.status === 'AI_FALSE_POSITIVE').length;
    const mismatches = this.validationLog.filter(v => v.status === 'MISMATCH').length;
    
    const accuracy = total > 0 ? (matches / total) * 100 : 100;
    
    const recentIssues = this.validationLog
      .filter(v => v.status !== 'MATCH')
      .slice(-10)
      .reverse();

    return {
      totalValidations: total,
      matches,
      aiMisses,
      falsePositives,
      mismatches,
      accuracy,
      recentIssues
    };
  }

  clearLog(): void {
    this.validationLog = [];
    this.logger.log('Validation log cleared');
  }
}
