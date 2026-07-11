import { Injectable } from '@nestjs/common';
import { AdvancedSearchService } from '../chat/advanced-search.service';
import { SearchValidatorService } from './search-validator.service';
import { StrictValidatorService } from '../chat/strict-validator.service';

@Injectable()
export class SearchService {
  constructor(
    private advancedSearch: AdvancedSearchService,
    private validator: SearchValidatorService,
    private strictValidator: StrictValidatorService,
  ) {}

  async search(query: string, vehicle?: any): Promise<any[]> {
    console.log(`🔍 SearchService.search called with: "${query}"`);
    const products = await this.advancedSearch.searchParts(query, vehicle);
    console.log(`📦 Found ${products.length} products`);

    // ── STRICT VALIDATION ──────────────────────────────────────
    const validated = this.strictValidator.validateResults(products, query, { vehicle });
    if (validated.length < products.length) {
      console.log(`[STRICT] Filtered out ${products.length - validated.length} invalid parts for: "${query}"`);
    }
    // ───────────────────────────────────────────────────────────
    
    console.log(`🧪 Calling validator...`);
    this.validator.validateSearch(query, validated, vehicle).catch(err => {
      console.error('❌ Validation error:', err);
    });
    
    return this.filterAvailable(validated);
  }

  isReferenceQuery(message: string): boolean {
    const trimmed = message.trim();
    if (trimmed.length < 6) return false;
    const tunisianWords = ['nchri', 'n7eb', 'famma', 'chouf', 'barcha', 'mte3', 'w'];
    if (tunisianWords.some(w => trimmed.toLowerCase().includes(w))) return false;
    if (trimmed.toLowerCase().startsWith('référence') || trimmed.toLowerCase().startsWith('reference')) {
      const refMatch = trimmed.match(/ref[eé]rence[\s:]*([a-z0-9-]{5,})/i);
      if (refMatch && refMatch[1]) {
        const ref = refMatch[1];
        if (/[a-z]/i.test(ref) && /[0-9]/.test(ref)) return true;
      }
    }
    const standaloneMatch = trimmed.match(/^\s*([a-z0-9-]{6,})\s*$/i);
    if (standaloneMatch) {
      const ref = standaloneMatch[1];
      if (/[a-z]/i.test(ref) && /[0-9]/.test(ref)) return true;
    }
    const anywhereMatch = trimmed.match(/\b([a-z0-9]{8,}(?:-[a-z0-9]+)*)\b/i);
    if (anywhereMatch) {
      const ref = anywhereMatch[1];
      if (/[a-z]/i.test(ref) && /[0-9]/.test(ref)) return true;
    }
    return false;
  }

  extractReference(message: string): string {
    const refKeywordMatch = message.match(/ref[eé]rence[\s:]*([a-z0-9-]{5,})/i);
    if (refKeywordMatch) return refKeywordMatch[1];
    const standaloneMatch = message.match(/\b([a-z0-9]{5,}(?:-[a-z0-9]+)*)\b/i);
    if (standaloneMatch) return standaloneMatch[1];
    return message.trim();
  }

  private filterAvailable(products: any[]): any[] {
    if (!Array.isArray(products)) return [];
    return products.map(p => {
      const stockConsolide = Number(
        p.stock?.stockConsolide ?? p.stock?.stock_consolide ?? p.stock?.totalQuantity ?? 0,
      );
      const statut: string = stockConsolide > 2 ? 'Disponible' : 'Indisponible';
      const hasPrice = p.prixHt !== undefined && p.prixHt !== null;
      // Prisma Int id is safe; guard BigInt just in case
      const safeId = typeof p.id === 'bigint' ? p.id.toString() : p.id;

      return {
        ...p,
        id: safeId,
        stockStatut: statut,          // expose the label, never the quantity
        available: stockConsolide > 2 && hasPrice,
      };
    });
  }
}
