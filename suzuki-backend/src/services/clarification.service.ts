import { Injectable } from '@nestjs/common';

interface ClarificationContext {
  originalQuery: string;
  dimension: 'position' | 'side' | 'type';
  products: any[];
  timestamp: number;
}

@Injectable()
export class ClarificationService {
  private pending = new Map<string, ClarificationContext>();

  setPending(sessionId: string, query: string, dimension: string, products: any[]) {
    this.pending.set(sessionId, { originalQuery: query, dimension: dimension as any, products, timestamp: Date.now() });
  }

  getPending(sessionId: string) {
    return this.pending.get(sessionId);
  }

  clearPending(sessionId: string) {
    this.pending.delete(sessionId);
  }

  cleanup() {
    const now = Date.now();
    for (const [id, ctx] of this.pending.entries()) {
      if (now - ctx.timestamp > 600000) this.pending.delete(id);
    }
  }

  isAnswer(message: string, context: ClarificationContext): boolean {
    const lower = message.toLowerCase().trim();
    
    // Check for contextual queries that reference previous topic
    const isContextualQuery = /\b(et pour|aussi|egalement|également|pareil|même chose)\b/i.test(lower);
    if (isContextualQuery) {
      const hasPosition = /\b(avant|arriere|arrière|av|ar)\b/i.test(lower);
      const hasSide = /\b(gauche|droite|g|d|droit|gosh)\b/i.test(lower);
      return hasPosition || hasSide;
    }
    
    // CRITICAL: Combined position + side answers (e.g., "arriere gauche")
    const hasBoth = /\b(avant|arriere|arrière|av|ar)\s+(gauche|droite|g|d|droit|gosh)\b/i.test(lower) ||
                    /\b(gauche|droite|g|d|droit|gosh)\s+(avant|arriere|arrière|av|ar)\b/i.test(lower);
    if (hasBoth) return true;
    
    // Direct position/side answers
    const hasPosition = /\b(avant|arriere|arrière|av|ar)\b/i.test(lower);
    const hasSide = /\b(gauche|droite|g|d|droit|gosh)\b/i.test(lower);
    
    if (hasPosition || hasSide) return true;
    if (context.dimension === 'position') return ['avant', 'arriere', 'arrière', 'av', 'ar'].includes(lower);
    if (context.dimension === 'side') return ['gauche', 'droite', 'g', 'd', 'droit', 'gosh'].includes(lower);
    if (context.dimension === 'type') {
      return context.products.some(p => {
        const d = (p.designation || '').toLowerCase();
        return d.includes(lower) || ['support', 'joint', 'roulement', 'toc', 'kit'].includes(lower) && d.includes(lower);
      });
    }
    return false;
  }

  checkNeeded(products: any[], message: string): { needed: boolean; variants: string[]; dimension: string } {
    if (!products || products.length <= 1) return { needed: false, variants: [], dimension: '' };

    const lower = message.toLowerCase();
    
    // CRITICAL: Detect generic queries FIRST
    if (this.isGenericQuery(lower)) {
      return { 
        needed: true, 
        variants: ['Filtre à air', 'Plaquettes frein', 'Amortisseur', 'Batterie', 'Phare'],
        dimension: 'type' 
      };
    }
    
    // Brake pads: ALWAYS ask position if not specified
    if (lower.includes('plaquette') && lower.includes('frein')) {
      if (/\b(avant|arrière|arriere|av|ar)\b/i.test(message)) return { needed: false, variants: [], dimension: '' };
      return { needed: true, variants: ['avant', 'arrière'], dimension: 'position' };
    }

    const filtered = this.filterBySpec(products, message);
    if (filtered.length === 1) return { needed: false, variants: [], dimension: '' };
    
    const toAnalyze = filtered.length > 0 ? filtered : products;
    const hasPos = /\b(avant|arrière|arriere|av)\b/i.test(message);
    const hasSide = /\b(gauche|droite|g|d|droit|gosh)\b/i.test(message);
    const dims = this.extractDimensions(toAnalyze);
    
    // CRITICAL: Ask ONLY position if multiple positions exist
    if (!hasPos && dims.positions.length > 1) return { needed: true, variants: dims.positions, dimension: 'position' };
    
    // CRITICAL: Ask side ONLY if position already specified AND part is bilateral
    if (hasPos && !hasSide && dims.sides.length > 1 && this.isBilateralPart(toAnalyze)) {
      return { needed: true, variants: dims.sides, dimension: 'side' };
    }
    
    if (dims.types.length > 1) return { needed: true, variants: dims.types, dimension: 'type' };

    return { needed: false, variants: [], dimension: '' };
  }

  private isGenericQuery(message: string): boolean {
    const patterns = [
      /^je cherche des pi[èe]ces/i,
      /pi[èe]ces pour (?:ma|mon)?\s*suzuki/i,
      /^besoin de pi[èe]ces/i,
      /^quelles? pi[èe]ces/i,
      /^aide.*pi[èe]ces/i
    ];
    return patterns.some(pattern => pattern.test(message));
  }

  private isBilateralPart(products: any[]): boolean {
    // Parts that ALWAYS come in left/right pairs
    const bilateral = ['retroviseur', 'feu', 'phare', 'aile'];
    return products.some(p => {
      const d = (p.designation || '').toLowerCase();
      return bilateral.some(part => d.includes(part));
    });
  }

  buildQuestion(partName: string, variants: string[], dimension: string): string {
    const variantList = variants.map(v => `• ${v.charAt(0).toUpperCase() + v.slice(1)}`).join('\n');
    const dimLabel = dimension === 'position' ? 'la position' : dimension === 'side' ? 'le côté' : 'le type';
    return `Merci pour votre demande concernant ${partName}.\n\nAfin d'identifier précisément la pièce compatible, merci de préciser ${dimLabel} :\n${variantList}\n\nDès confirmation, je pourrai vous communiquer la référence et le prix.`;
  }

  extractPartName(query: string): string {
    const lower = query.toLowerCase();
    if (lower.includes('amortisseur')) return 'amortisseur';
    if (lower.includes('plaquette') && lower.includes('frein')) return 'plaquettes frein';
    if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
    if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
    if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
    const parts = ['amortisseur', 'plaquette', 'disque', 'filtre', 'phare', 'batterie'];
    for (const p of parts) if (lower.includes(p)) return p;
    return query;
  }

  private filterBySpec(products: any[], message: string) {
    const lower = message.toLowerCase();
    const pos = lower.includes('avant') ? 'avant' : lower.includes('arrière') || lower.includes('arriere') ? 'arrière' : null;
    const side = lower.includes('gauche') ? 'gauche' : lower.includes('droite') || lower.includes('droit') ? 'droite' : null;
    if (!pos && !side) return products;
    return products.filter(p => {
      const d = (p.designation || '').toLowerCase();
      const matchPos = !pos || d.includes(pos);
      const matchSide = !side || (side === 'gauche' && (d.includes('gauche') || d.includes(' g '))) || (side === 'droite' && (d.includes('droite') || d.includes('droit') || d.includes(' d ')));
      return matchPos && matchSide;
    });
  }

  private extractDimensions(products: any[]) {
    const positions = new Set<string>();
    const sides = new Set<string>();
    const types = new Set<string>();
    products.forEach(p => {
      const d = (p.designation || '').toUpperCase();
      const posMatch = d.match(/\b(?:AV|AVANT|AR|ARRI[ÈE]RE)\b/);
      if (posMatch) {
        const pos = posMatch[0];
        if (pos === 'AV' || pos === 'AVANT') positions.add('avant');
        if (pos === 'AR' || pos.startsWith('ARRI')) positions.add('arrière');
      }
      const sideMatch = d.match(/\b(?:G|GAUCHE|D|DROIT[E]?)\b/);
      if (sideMatch) {
        const side = sideMatch[0];
        if (side === 'G' || side === 'GAUCHE') sides.add('gauche');
        if (side === 'D' || side.startsWith('DROIT')) sides.add('droite');
      }
      const words = d.split(/\s+/);
      words.forEach(w => {
        if (['SUPPORT', 'SUPPORTS'].includes(w)) types.add('support');
        if (['JOINT', 'JOINTS'].includes(w)) types.add('joint');
        if (['ROULEMENT', 'ROULEMENTS'].includes(w)) types.add('roulement');
        if (w === 'TOC') types.add('toc');
        if (w === 'KIT') types.add('kit');
      });
    });
    return { positions: Array.from(positions), sides: Array.from(sides), types: Array.from(types) };
  }
}
