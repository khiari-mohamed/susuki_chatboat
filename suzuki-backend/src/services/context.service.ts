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
    if (lower.includes('porte')) return 'porte';
    if (lower.includes('clignotant')) return 'clignotant';
    if (lower.includes('vitre')) return 'vitre';
    if (lower.includes('radiateur')) return 'radiateur';
    if (lower.includes('capot')) return 'capot';
    if (lower.includes('hayon')) return 'hayon';
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
    const hasSpecificPart = /\b(amortisseur|plaquette|disque|filtre|phare|batterie|courroie|bougie|porte|retroviseur|rétroviseur|clignotant|vitre|radiateur|capot|hayon)\b/i.test(message);
    const hasPosition = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i.test(message);
    
    if (hasSpecificPart && hasPosition) return message.trim();

    const isPositionOnly = /^(avant|arriere|arrière|av|ar)\s*(gauche|droite|g|d)?$/i.test(message.trim()) ||
                          /^(gauche|droite|g|d)\s*(avant|arriere|arrière|av|ar)?$/i.test(message.trim());
    if (isPositionOnly && context.lastPart) {
      return `${context.lastPart} ${message.trim()} ${vehicle?.modele || 'S-PRESSO'}`;
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
