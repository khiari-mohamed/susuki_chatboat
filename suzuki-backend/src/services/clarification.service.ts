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
    this.pending.set(sessionId, {
      originalQuery: query,
      dimension: dimension as any,
      products,
      timestamp: Date.now(),
    });
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
    const hasBoth = /\b(avant|arriere|arrière|av|ar)\s+(gauche|droite|g|d|droit)\b/i.test(lower) ||
                    /\b(gauche|droite|g|d|droit)\s+(avant|arriere|arrière|av|ar)\b/i.test(lower);
    if (hasBoth) return true;
    
    // Direct position/side answers
    const hasPosition = /\b(avant|arriere|arrière|av|ar)\b/i.test(lower);
    const hasSide = /\b(gauche|droite|g|d|droit)\b/i.test(lower);
    
    if (hasPosition || hasSide) return true;
    if (context.dimension === 'position') return ['avant', 'arriere', 'arrière', 'av', 'ar'].includes(lower);
    if (context.dimension === 'side') return ['gauche', 'droite', 'g', 'd', 'droit'].includes(lower);
    if (context.dimension === 'type') {
      const filterTypes = ['air', 'huile', 'gazoile', 'habitacle', 'carburant', 'essence', 'climatiseur'];
      if (filterTypes.some(t => lower.includes(t))) return true;
      return context.products.some(p => {
        const d = (p.designation || '').toLowerCase();
        return d.includes(lower) || ['support', 'joint', 'roulement', 'toc', 'kit'].includes(lower) && d.includes(lower);
      });
    }
    return false;
  }

  checkNeeded(products: any[], message: string): { needed: boolean; variants: string[]; dimension: string } {
    if (!products || products.length === 0) return { needed: false, variants: [], dimension: '' };

    const lower = message.toLowerCase();

    // Generic query → ask what type of part
    if (this.isGenericQuery(lower)) {
      return {
        needed: true,
        variants: ['Filtre à air', 'Plaquettes frein', 'Amortisseur', 'Batterie', 'Phare'],
        dimension: 'type',
      };
    }

    // What has the user already specified?
    const hasPos  = /\b(avant|arrière|arriere|av|ar)\b/i.test(message);
    const hasSide = /\b(gauche|droite|droit|dr|g|gh)\b/i.test(message);

    // Step 1 — filter to only the products that match what's already specified
    let candidates = this.filterBySpec(products, message);
    if (candidates.length === 0) candidates = products; // safety fallback

    // Step 2 — if only 1 candidate left, no clarification needed
    if (candidates.length === 1) return { needed: false, variants: [], dimension: '' };

    // Step 3 — check what ambiguity remains in candidates
    const dims = this.extractDimensions(candidates);

    // ALWAYS ask position before side
    if (!hasPos && dims.positions.length > 1) {
      return { needed: true, variants: dims.positions, dimension: 'position' };
    }

    // CRITICAL: Don't ask for G/D clarification when user asks for main part
    // Only ask when there are 2-3 products (user wants ONE specific part)
    // Skip when there are many products (user wants to see all options)
    if (!hasSide && dims.sides.length > 1) {
      // Only ask for side clarification if we have 2-3 products (not many)
      if (candidates.length >= 2 && candidates.length <= 3) {
        return { needed: true, variants: dims.sides, dimension: 'side' };
      }
      // Skip clarification if we have many products - return all
      return { needed: false, variants: [], dimension: '' };
    }

    // Type ambiguity (e.g. filtre air vs filtre huile)
    if (dims.types.length > 1) {
      return { needed: true, variants: dims.types, dimension: 'type' };
    }

    // No ambiguity left
    return { needed: false, variants: [], dimension: '' };
  }

  private isGenericQuery(message: string): boolean {
    const patterns = [
      /^je cherche des pi[èe]ces/i,
      /pi[èe]ces pour (?:ma|mon)?\s*suzuki/i,
      /^besoin de pi[èe]ces/i,
      /^quelles? pi[èe]ces/i,
      /^aide.*pi[èe]ces/i,
      /^des pi[èe]ces pour/i,
      /^pi[èe]ces.*suzuki/i
    ];
    return patterns.some(pattern => pattern.test(message.trim()));
  }

  private isBilateralPart(products: any[]): boolean {
    // Parts that ALWAYS come in left/right pairs
    const bilateral = ['retroviseur', 'feu', 'phare', 'aile', 'amortisseur', 'amorto', 'porte', 'clignotant', 'essuie', 'vitre', 'poignee', 'poignée'];
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
    
    // CRITICAL: Check compound terms FIRST (most specific to least specific)
    if (lower.includes('plaquette') && lower.includes('frein')) return 'plaquettes frein';
    if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
    if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
    if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
    if (lower.includes('filtre') && lower.includes('carburant')) return 'filtre carburant';
    if (lower.includes('filtre') && lower.includes('habitacle')) return 'filtre habitacle';
    if (lower.includes('essuie') && lower.includes('glace')) return 'essuie-glace';
    if (lower.includes('pare') && lower.includes('choc')) return 'pare-choc';
    
    // Then check single terms
    if (lower.includes('amortisseur')) return 'amortisseur';
    if (lower.includes('batterie')) return 'batterie';
    if (lower.includes('phare')) return 'phare';
    if (lower.includes('courroie')) return 'courroie';
    if (lower.includes('bougie')) return 'bougie';
    if (lower.includes('alternateur')) return 'alternateur';
    if (lower.includes('demarreur') || lower.includes('démarreur')) return 'démarreur';
    if (lower.includes('retroviseur') || lower.includes('rétroviseur')) return 'rétroviseur';
    if (lower.includes('porte')) return 'porte';
    if (lower.includes('clignotant')) return 'clignotant';
    if (lower.includes('vitre')) return 'vitre';
    if (lower.includes('radiateur')) return 'radiateur';
    if (lower.includes('echappement') || lower.includes('échappement')) return 'échappement';
    if (lower.includes('capot')) return 'capot';
    if (lower.includes('hayon')) return 'hayon';
    if (lower.includes('aile')) return 'aile';
    if (lower.includes('etrier') || lower.includes('étrier')) return 'etrier';
    if (lower.includes('enjoliveur')) return 'enjoliveur';
    if (lower.includes('rotule')) return 'rotule';
    if (lower.includes('charniere') || lower.includes('charnière')) return 'charniere';
    if (lower.includes('serrure')) return 'serrure';
    if (lower.includes('joint')) return 'joint';
    if (lower.includes('adhesif') || lower.includes('adhésif')) return 'adhesif';
    if (lower.includes('moulure')) return 'moulure';
    if (lower.includes('grille')) return 'grille';
    if (lower.includes('support')) return 'support';
    
    // Fallback: return first significant word
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
      
      // CRITICAL: Check for WRONG position/side first - REJECT
      if (pos === 'avant' && /\b(arriere|arrière|ar)\b/i.test(d)) return false;
      if (pos === 'arrière' && /\b(avant|av)\b/i.test(d)) return false;
      if (side === 'gauche' && /\b(droite|droit|d)\b/i.test(d)) return false;
      if (side === 'droite' && /\b(gauche|g)\b/i.test(d)) return false;
      
      // Now check for CORRECT match
      const matchPos = !pos || /\b(avant|av)\b/i.test(d) && pos === 'avant' || /\b(arriere|arrière|ar)\b/i.test(d) && pos === 'arrière';
      const matchSide = !side || (side === 'gauche' && /\b(gauche|g)\b/i.test(d)) || (side === 'droite' && /\b(droite|droit|d)\b/i.test(d));
      
      return matchPos && matchSide;
    });
  }

  private extractDimensions(products: any[]) {
    const positions = new Set<string>();
    const sides     = new Set<string>();
    const types     = new Set<string>();

    products.forEach(p => {
      const raw = (p.designation || '').toUpperCase();
      // Tokenize on spaces and hyphens
      const tokens = raw.split(/[\s\-]+/);

      // ── POSITION ────────────────────────────────────────────────────
      const hasAv = tokens.some(t => ['AV', 'AVANT', 'AVG', 'AVD', 'AVDROIT', 'AVGAUCHE', 'FRONT'].includes(t));
      const hasAr = tokens.some(t => ['AR', 'ARRIERE', 'ARRIÈRE', 'ARG', 'ARD', 'REAR'].includes(t));
      if (hasAv) positions.add('avant');
      if (hasAr) positions.add('arrière');

      // ── SIDE ────────────────────────────────────────────────────────
      const hasG = tokens.some(t => ['G', 'GH', 'GAUCHE', 'AVG', 'ARG', 'LEFT', 'LH', 'CONDUCTEUR'].includes(t));
      const hasD = tokens.some(t => ['D', 'DR', 'DROITE', 'DROIT', 'AVD', 'ARD', 'RIGHT', 'RH', 'PASSAGER'].includes(t));
      if (hasG) sides.add('gauche');
      if (hasD) sides.add('droite');

      // ── TYPE ────────────────────────────────────────────────────────
      tokens.forEach(w => {
        if (['AIR', 'HUILE', 'GAZOILE', 'HABITACLE', 'CARBURANT', 'ESSENCE', 'CLIMATISEUR'].includes(w)) {
          types.add(w.toLowerCase());
        }
        if (['SUPPORT', 'JOINT', 'ROULEMENT', 'TOC', 'KIT', 'JEU'].includes(w)) {
          types.add(w.toLowerCase());
        }
      });
    });

    return {
      positions: Array.from(positions),
      sides:     Array.from(sides),
      types:     Array.from(types),
    };
  }
}
