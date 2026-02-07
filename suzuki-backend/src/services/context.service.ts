import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContextService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private lastPartCache = new Map<string, string>();
  private readonly TTL = 300000;

  constructor(private prisma: PrismaService) {}

  setLastPart(sessionId: string, partName: string) {
    this.lastPartCache.set(sessionId, partName);
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
    if (lower.includes('plaquette') && lower.includes('frein')) return 'plaquettes frein';
    if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
    if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
    if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
    if (lower.includes('essuie') && lower.includes('glace')) return 'essuie-glace';
    if (lower.includes('pare') && lower.includes('choc')) return 'pare-choc';
    if (lower.includes('amortisseur')) return 'amortisseur';
    if (lower.includes('retroviseur') || lower.includes('rétroviseur')) return 'rétroviseur';
    if (lower.includes('aile')) return 'aile';
    if (lower.includes('porte')) return 'porte';
    if (lower.includes('clignotant')) return 'clignotant';
    if (lower.includes('vitre')) return 'vitre';
    if (lower.includes('radiateur')) return 'radiateur';
    if (lower.includes('capot')) return 'capot';
    if (lower.includes('hayon')) return 'hayon';
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
    const parts = ['filtre', 'plaquette', 'disque', 'phare', 'batterie', 'courroie', 'bougie'];
    for (const p of parts) if (lower.includes(p)) return p;
    return '';
  }

  private extractSide(message: string): string | undefined {
    const lower = message.toLowerCase();
    if (/\b(gauche|g)\b/.test(lower)) return 'gauche';
    if (/\b(droite|d)\b/.test(lower)) return 'droite';
    return undefined;
  }

  buildSearchQuery(message: string, context: any, vehicle?: any): string {
    const lower = message.toLowerCase();
    const hasSpecificPart = /\b(amortisseur|plaquette|disque|filtre|phare|batterie|courroie|bougie|porte|retroviseur|rétroviseur|clignotant|vitre|radiateur|capot|hayon|aile|etrier|étrier|enjoliveur|rotule|charniere|charnière|serrure|joint|adhesif|adhésif|moulure|grille|support|pare-choc|essuie-glace)\b/i.test(message);
    const hasPosition = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i.test(message);
    
    if (hasSpecificPart && hasPosition) return message.trim();

    const isPositionOnly = /^\s*(avant|arriere|arrière|av|ar)\s*(gauche|droite|g|d)?\s*$/i.test(message.trim()) ||
                          /^\s*(gauche|droite|g|d)\s*(avant|arriere|arrière|av|ar)?\s*$/i.test(message.trim());
    if (isPositionOnly && context.lastPart) {
      console.log(`[CONTEXT] Position-only clarification: "${message}" + lastPart: "${context.lastPart}"`);
      return `${context.lastPart} ${message.trim()}`;
    }

    // CRITICAL: Detect follow-up for same part FIRST ("behi choufli l'avant", "ok l'avant", "d'accord montre-moi l'avant")
    const isFollowUpSamePart = /\b(behi|ok|yezzi|montre|regarde|voir|chouf|choufli|wri|d'accord|bien)\b/i.test(message);
    if (isFollowUpSamePart && !hasSpecificPart && hasPosition && context.lastPart) {
      // Follow-up for same part with different position
      const posMatch = message.match(/\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/gi);
      if (posMatch) {
        return `${context.lastPart} ${posMatch.join(' ')}`;
      }
      return `${context.lastPart} ${message.trim()}`;
    }

    // CRITICAL: Detect new part requests ("je veux aile droite", "maintenant je veux aile droite")
    const isNewPartRequest = /\b(je veux|n7eb|bghit|nchri|maintenant.*\b(aile|porte|capot|phare))\b/i.test(message);
    if (isNewPartRequest && hasSpecificPart) {
      // New part request - don't use context.lastPart
      return message.trim();
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

    const isContextual = /\b(combien pour|prix pour|deux jeux|les deux)\b/i.test(message);
    
    if (isContextual && context.lastTopic) {
      if (context.lastTopic === 'plaquettes frein' || context.lastTopic.includes('frein')) {
        return `plaquettes frein ${vehicle?.modele || 'S-PRESSO'}`;
      }
      return `${context.lastTopic} ${vehicle?.modele || 'S-PRESSO'}`;
    }

    return message.trim();
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
