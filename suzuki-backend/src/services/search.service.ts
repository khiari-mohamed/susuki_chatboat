import { Injectable } from '@nestjs/common';
import { AdvancedSearchService } from '../chat/advanced-search.service';
import { SearchValidatorService } from './search-validator.service';

@Injectable()
export class SearchService {
  constructor(
    private advancedSearch: AdvancedSearchService,
    private validator: SearchValidatorService
  ) {}

  async search(query: string, vehicle?: any): Promise<any[]> {
    console.log(`🔍 SearchService.search called with: "${query}"`);
    const products = await this.advancedSearch.searchParts(query, vehicle);
    console.log(`📦 Found ${products.length} products`);
    
    // ALWAYS validate (don't check env var - it's optional)
    console.log(`🧪 Calling validator...`);
    this.validator.validateSearch(query, products, vehicle).catch(err => {
      console.error('❌ Validation error:', err);
    });
    
    return this.filterAvailable(products || []);
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
    return products.filter(p => {
      const hasStock = typeof p.stock === 'number' && p.stock > 0;
      const hasPrice = p.prixHt !== undefined && p.prixHt !== null;
      return hasStock && hasPrice;
    });
  }
}
