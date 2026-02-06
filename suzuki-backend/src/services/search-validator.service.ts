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

  constructor(private prisma: PrismaService) {}

  async validateSearch(query: string, aiResults: any[]): Promise<void> {
    try {
      // Simple DB search for comparison
      const dbResults = await this.prisma.piecesRechange.findMany({
        where: {
          OR: [
            { designation: { contains: query, mode: 'insensitive' } },
            { reference: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      });

      const aiCount = aiResults.length;
      const dbCount = dbResults.length;
      
      let status: ValidationResult['status'];
      
      if (aiCount === 0 && dbCount > 0) {
        status = 'AI_MISS';
        this.logger.error(`🚨 AI MISS: "${query}"\n  AI found: 0\n  DB found: ${dbCount}\n  DB results: ${dbResults.slice(0, 3).map(r => r.designation).join(', ')}`);
      } else if (aiCount > 0 && dbCount === 0) {
        status = 'AI_FALSE_POSITIVE';
        this.logger.warn(`⚠️ FALSE POSITIVE: "${query}"\n  AI found: ${aiCount}\n  DB found: 0\n  AI results: ${aiResults.slice(0, 3).map(r => r.designation).join(', ')}`);
      } else if (Math.abs(aiCount - dbCount) > 5) {
        status = 'MISMATCH';
        this.logger.warn(`📊 MISMATCH: "${query}"\n  AI: ${aiCount} results\n  DB: ${dbCount} results`);
      } else {
        status = 'MATCH';
        this.logger.debug(`✅ MATCH: "${query}" - AI: ${aiCount}, DB: ${dbCount}`);
      }

      // Store validation result
      const result: ValidationResult = {
        query,
        aiResultCount: aiCount,
        dbResultCount: dbCount,
        status,
        aiTopResults: aiResults.slice(0, 3).map(r => r.designation),
        dbTopResults: dbResults.slice(0, 3).map(r => r.designation),
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
