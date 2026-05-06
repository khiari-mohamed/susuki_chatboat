import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContextService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private lastPartCache = new Map<string, string>();
  private lastQueryCache = new Map<string, string>();
  private activeFiltersCache = new Map<string, any[]>();
  private readonly TTL = 300000;

  constructor(private prisma: PrismaService) {}

  setLastPart(sessionId: string, partName: string) {
    this.lastPartCache.set(sessionId, partName);
  }

  setLastQuery(sessionId: string, query: string) {
    this.lastQueryCache.set(sessionId, query);
  }

  getLastQuery(sessionId: string): string | undefined {
    return this.lastQueryCache.get(sessionId);
  }

  addFilter(sessionId: string, filter: any) {
    const filters = this.activeFiltersCache.get(sessionId) || [];
    filters.push(filter);
    this.activeFiltersCache.set(sessionId, filters);
  }

  getActiveFilters(sessionId: string): any[] {
    return this.activeFiltersCache.get(sessionId) || [];
  }

  clearFilters(sessionId: string) {
    this.activeFiltersCache.delete(sessionId);
  }

  invalidateCache(sessionId: string) {
    this.cache.delete(sessionId);
  }

  async get(sessionId: string) {
    const cached = this.cache.get(sessionId);
    if (cached && Date.now() - cached.timestamp < this.TTL) return cached.data;

    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    });

    const topicFlow = messages.filter(m => m.sender === 'user').map(m => this.extractTopic(m.message));
    let lastTopic: string | undefined;
    let lastPart: string | undefined;
    let lastSide: string | undefined;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        const msg = messages[i].message;
        const topic = this.extractTopic(msg);
        if (topic !== 'général') {
          lastTopic = topic;
          lastPart = this.extractPartName(msg);
          lastSide = this.extractSide(msg);
          break;
        }
      }
    }

    const data = { topicFlow, lastTopic, lastPart: lastPart || this.lastPartCache.get(sessionId), lastSide, messageCount: messages.length };
    this.cache.set(sessionId, { data, timestamp: Date.now() });
    return data;
  }

  private extractPartName(message: string): string {
    const lower = message.toLowerCase();
    
    // Common multi-word parts first (keep these for performance)
    if (lower.includes('plaquette') && lower.includes('frein')) return 'plaquettes frein';
    if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
    if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
    if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
    if (lower.includes('essuie') && lower.includes('glace')) return 'essuie-glace';
    if (lower.includes('pare') && lower.includes('choc')) return 'pare-choc';
    if (lower.includes('maitre') && lower.includes('cylindre')) return 'maitre cylindre';
    if (lower.includes('maître') && lower.includes('cylindre')) return 'maitre cylindre';
    
    // Fallback to common single-word parts (minimal hardcoded list)
    const commonParts = [
      'amortisseur', 'retroviseur', 'rétroviseur', 'phare', 'batterie', 'courroie',
      'bougie', 'triangle', 'cardan', 'suspension', 'tambour', 'alternateur',
      'demarreur', 'démarreur', 'embrayage', 'agrafe', 'agraffe', 'agraphe'
    ];
    
    for (const p of commonParts) {
      if (lower.includes(p)) return p;
    }
    
    return '';
  }

  private extractSide(message: string): string | undefined {
    const lower = message.toLowerCase();
    if (/\b(gauche|g)\b/.test(lower)) return 'gauche';
    if (/\b(droite|d)\b/.test(lower)) return 'droite';
    return undefined;
  }

  buildSearchQuery(message: string, context: any, vehicle?: any): string {
    // CRITICAL: message is already AI-normalized, use it directly
    const lower = message.toLowerCase();
    const hasSpecificPart = /\b(amortisseur|plaquette|disque|filtre|phare|batterie|courroie|bougie|porte|retroviseur|rétroviseur|clignotant|vitre|radiateur|capot|hayon|aile|etrier|étrier|enjoliveur|rotule|charniere|charnière|serrure|joint|adhesif|adhésif|moulure|grille|support|pare-choc|essuie-glace|tendeur|chaine|chaîne|triangle|bras|biellette|cremaillere|crémaillère|cardan|roulement|ressort|suspension|tambour|maitre|maître|cylindre|pompe|injecteur|reservoir|réservoir|alternateur|demarreur|démarreur|capteur|embrayage|volant|plateau|appareil|agrafe|agraffe|agraphe|feu|tapis|liquide|refroidissement|clignotant)\b/i.test(message);
    const hasPosition = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i.test(message);
    
    // Always return the AI-normalized message if it has both part and position
    if (hasSpecificPart && hasPosition) return message;

    const isPositionOnly = /^\s*(avant|arriere|arrière|av|ar)\s*(gauche|droite|g|d)?\s*$/i.test(message.trim()) ||
                          /^\s*(gauche|droite|g|d)\s*(avant|arriere|arrière|av|ar)?\s*$/i.test(message.trim());
    if (isPositionOnly && context.lastPart) {
      console.log(`[CONTEXT] Position-only clarification: "${message}" + lastPart: "${context.lastPart}"`);
      return `${context.lastPart} ${message}`;
    }

    // Follow-up without new part mentioned
    if (!hasSpecificPart && hasPosition && context.lastPart) {
      const posMatch = message.match(/\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/gi);
      if (posMatch) {
        return `${context.lastPart} ${posMatch.join(' ')}`;
      }
    }

    const isFollowUp = /\b(et\s+pour|aussi|egalement|également|pareil|même\s+chose|pour\s+le|pour\s+la)\b/i.test(message);
    if (isFollowUp && context.lastPart) {
      const posMatch = message.match(/\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i);
      if (posMatch) {
        const pos = posMatch[0].toLowerCase().replace('è', 'e');
        const side = context.lastSide || '';
        const query = `${context.lastPart} ${pos} ${side}`.trim();
        console.log(`[CONTEXT] Follow-up detected: "${message}" → "${query}"`);
        return query;
      }
      console.log(`[CONTEXT] Follow-up without position: "${message}" → "${context.lastPart}"`);
      return `${context.lastPart}`;
    }

    return message;
  }

  private extractTopic(message: string): string {
    const topics = {
      'plaquettes frein': ['plaquette', 'plakete', 'brake pad'],
      'frein': ['frein', 'disque', 'etrier', 'tambour', 'brake', 'frain'],
      'filtre': ['filtre', 'filter', 'air', 'huile', 'carburant'],
      'suspension': ['suspension', 'amortisseur', 'ressort'],
      'moteur': ['moteur', 'engine', 'bougie', 'courroie'],
      'électrique': ['batterie', 'alternateur', 'demarreur'],
      'optique': ['phare', 'feu', 'ampoule']
    };
    const lower = message.toLowerCase();
    
    if (lower.includes('amortisseur')) return 'suspension';
    if (lower.includes('plaquette') || lower.includes('plakete')) return 'plaquettes frein';
    if (lower.includes('frein') || lower.includes('frain')) {
      if (lower.includes('plaquette') || lower.includes('plakete')) return 'plaquettes frein';
      return 'frein';
    }
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(k => lower.includes(k))) return topic;
    }
    return 'général';
  }
}
