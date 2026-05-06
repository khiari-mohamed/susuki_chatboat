import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const MODEL_ALIASES: Record<string, string> = {
  'NEW CIAZ': 'CIAZ',
  'NEW CELERIO POP 6AB': 'CELERIO',
  'SWIFT IV': 'SWIFT',
  'JIMNY 5D AT': 'JIMNY',
  'SPRESSO': 'S-PRESSO',
  'S PRESSO': 'S-PRESSO',
  'WAGONR': 'WAGON R',
  'WAGON-R': 'WAGON R',
};

@Injectable()
export class VehicleModelsService implements OnModuleInit {
  private readonly logger = new Logger(VehicleModelsService.name);
  private models: string[] = [];
  private modelsSet: Set<string> = new Set();

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadModels();
  }

  private async loadModels() {
    try {
      const rows = await this.prisma.vehicle.findMany({
        select: { modele: true },
        distinct: ['modele'],
        where: { 
          modele: { not: null },
          marque: { equals: 'SUZUKI', mode: 'insensitive' }
        },
      });

      this.models = rows
        .map(r => r.modele?.toUpperCase().trim())
        .filter((m): m is string => m !== null && m !== undefined && m !== '')
        .sort();

      this.modelsSet = new Set(this.models);

      this.logger.log(`✅ Loaded ${this.models.length} Suzuki models from database: ${this.models.join(', ')}`);
    } catch (error) {
      this.logger.error('❌ Failed to load vehicle models from database:', error);
      // Fallback to hardcoded list if DB fails
      this.models = ['CELERIO', 'CIAZ', 'SWIFT', 'S-PRESSO', 'BALENO', 'VITARA', 'JIMNY', 'IGNIS'];
      this.modelsSet = new Set(this.models);
      this.logger.warn(`⚠️ Using fallback model list: ${this.models.join(', ')}`);
    }
  }

  /**
   * Get all Suzuki models
   */
  getAll(): string[] {
    return [...this.models];
  }

  /**
   * Normalize a model name (handles aliases and variations)
   */
  normalize(model?: string): string | null {
    if (!model) return null;
    
    const upper = model.toUpperCase().trim();
    
    // Check aliases first
    if (MODEL_ALIASES[upper]) {
      return MODEL_ALIASES[upper];
    }
    
    // Check exact match
    if (this.modelsSet.has(upper)) {
      return upper;
    }
    
    // Check if it's a substring match (e.g., "SPRESSO" matches "S-PRESSO")
    for (const m of this.models) {
      if (m.replace(/[-\s]/g, '') === upper.replace(/[-\s]/g, '')) {
        return m;
      }
    }
    
    return null;
  }

  /**
   * Check if a model exists
   */
  exists(model: string): boolean {
    const normalized = this.normalize(model);
    return normalized !== null;
  }

  /**
   * Check if a designation contains any Suzuki model name
   */
  hasModelInDesignation(designation: string): boolean {
    const upper = designation.toUpperCase();
    // Check for SPRESSO (without hyphen) as well
    if (upper.includes('SPRESSO')) return true;
    return this.models.some(model => upper.includes(model));
  }

  /**
   * Check if a designation matches a specific model
   */
  matchesModel(designation: string, model: string): boolean {
    const designationUpper = designation.toUpperCase();
    const modelUpper = model.toUpperCase();
    
    // Handle S-PRESSO vs SPRESSO mismatch
    if (modelUpper === 'S-PRESSO' || modelUpper === 'SPRESSO') {
      return designationUpper.includes('SPRESSO') || designationUpper.includes('S-PRESSO');
    }
    
    return designationUpper.includes(modelUpper);
  }

  /**
   * Detect model in text
   */
  detectModelInText(text: string): string | null {
    const normalizedText = this.normalizeTextForModelDetection(text);
    
    // Check for SPRESSO variations
    if (this.containsExplicitModel(normalizedText, 'SPRESSO') || this.containsExplicitModel(normalizedText, 'S-PRESSO')) {
      return 'S-PRESSO';
    }
    
    // Check aliases
    for (const [alias, canonical] of Object.entries(MODEL_ALIASES)) {
      if (this.containsExplicitModel(normalizedText, alias)) {
        return canonical;
      }
    }
    
    // Check exact models
    for (const model of this.models) {
      if (this.containsExplicitModel(normalizedText, model)) {
        return model;
      }
    }
    
    return null;
  }

  private containsExplicitModel(normalizedText: string, model: string): boolean {
    const normalizedModel = this.normalizeTextForModelDetection(model);
    if (!normalizedModel) return false;

    const modelTokens = normalizedModel.split(' ').filter(Boolean);
    if (modelTokens.length === 0) return false;

    // Avoid false positives from short database codes such as "S" inside part names.
    if (modelTokens.length === 1 && modelTokens[0].length < 3) {
      return false;
    }

    const pattern = modelTokens
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('\\s+');

    return new RegExp(`(^|\\s)${pattern}(\\s|$)`).test(normalizedText);
  }

  private normalizeTextForModelDetection(text: string): string {
    return (text || '')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Reload models from database (useful for admin operations)
   */
  async reload(): Promise<void> {
    await this.loadModels();
  }
}
