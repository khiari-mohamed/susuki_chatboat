import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TunisianNormalizerService } from './tunisian-normalizer.service';

@Injectable()
export class ContextService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 300000;

  constructor(private prisma: PrismaService, private tunisianNormalizer: TunisianNormalizerService) {}

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
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        const msg = messages[i].message;
        const topic = this.extractTopic(msg);
        if (topic !== 'général') {
          lastTopic = topic;
          lastPart = this.extractPartName(msg);
          break;
        }
      }
    }

    const data = { topicFlow, lastTopic, lastPart, messageCount: messages.length };
    this.cache.set(sessionId, { data, timestamp: Date.now() });
    return data;
  }

  private extractPartName(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('amortisseur')) return 'amortisseur';
    if (lower.includes('plaquette') && lower.includes('frein')) return 'plaquettes frein';
    if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
    if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
    if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
    const parts = ['filtre', 'plaquette', 'disque', 'phare', 'batterie', 'courroie', 'bougie'];
    for (const p of parts) if (lower.includes(p)) return p;
    return '';
  }

  buildSearchQuery(message: string, context: any, vehicle?: any): string {
    const normalized = this.tunisianNormalizer.normalize(message) || message;
    const lower = normalized.toLowerCase();
    const hasSpecificPart = /\b(amortisseur|plaquette|disque|filtre|phare|batterie|courroie|bougie)\b/i.test(message);
    const hasPosition = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i.test(message);
    
    if (hasSpecificPart && hasPosition) return normalized.trim();

    // CRITICAL: Handle "et pour" follow-up questions
    const isFollowUp = /\b(et\s+pour|aussi|egalement|également|pareil|même\s+chose)\b/i.test(normalized);
    if (isFollowUp && context.lastPart) {
      const posMatch = message.match(/\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i);
      if (posMatch) {
        const pos = posMatch[0].toLowerCase().replace('è', 'e');
        return `${context.lastPart} ${pos} ${vehicle?.modele || 'S-PRESSO'}`;
      }
      return `${context.lastPart} ${vehicle?.modele || 'S-PRESSO'}`;
    }

    // Handle contextual queries
    const isContextual = /\b(aussi|egalement|également|pareil|même chose|et pour|arrière|arriere|et.*arrière|et.*arriere|pour.*arrière|pour.*arriere|deux jeux|les deux|combien pour)\b/i.test(normalized);
    
    if (isContextual && context.lastTopic) {
      const posMatch = message.match(/\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i);
      const pos = posMatch ? posMatch[0].toLowerCase().replace('è', 'e') : '';
      
      if (context.lastTopic === 'plaquettes frein' || context.lastTopic.includes('frein')) {
        if (pos.match(/arrière|arriere|ar/i) || lower.includes('arrière') || lower.includes('arriere')) {
          return `plaquettes frein arriere ${vehicle?.modele || 'S-PRESSO'}`;
        }
        if (pos.match(/avant|av/i)) {
          return `plaquettes frein avant ${vehicle?.modele || 'S-PRESSO'}`;
        }
        if (lower.includes('combien') || lower.includes('prix')) {
          return `plaquettes frein ${vehicle?.modele || 'S-PRESSO'}`;
        }
      }
      
      if (context.lastTopic === 'suspension' || lower.includes('amortisseur')) {
        if (pos.match(/arrière|arriere|ar/i) || lower.includes('arrière') || lower.includes('arriere')) {
          const side = message.match(/\b(gauche|droite|g|d)\b/i)?.[0] || '';
          return side ? `amortisseur arriere ${side} ${vehicle?.modele || 'S-PRESSO'}` : `amortisseur arriere ${vehicle?.modele || 'S-PRESSO'}`;
        }
        if (pos.match(/avant|av/i)) {
          const side = message.match(/\b(gauche|droite|g|d)\b/i)?.[0] || '';
          return side ? `amortisseur avant ${side} ${vehicle?.modele || 'S-PRESSO'}` : `amortisseur avant ${vehicle?.modele || 'S-PRESSO'}`;
        }
      }
      
      if (pos && context.lastTopic) {
        const normPos = pos === 'arriere' ? 'arriere' : pos === 'ar' ? 'arriere' : pos;
        return `${context.lastTopic} ${normPos} ${vehicle?.modele || 'S-PRESSO'}`;
      }
      
      if (context.lastTopic) return `${context.lastTopic} ${vehicle?.modele || 'S-PRESSO'}`;
    }

    return normalized.trim();
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
    const normalized = this.tunisianNormalizer.normalize(lower) || lower;
    
    // CRITICAL: Check for amortisseur first
    if (lower.includes('amortisseur') || normalized.includes('amortisseur')) return 'suspension';
    
    if (lower.includes('plaquette') || lower.includes('plakete') || normalized.includes('plaquette')) return 'plaquettes frein';
    if (lower.includes('frein') || lower.includes('frain') || normalized.includes('frein')) {
      if (lower.includes('plaquette') || lower.includes('plakete') || normalized.includes('plaquette')) return 'plaquettes frein';
      return 'frein';
    }
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(k => lower.includes(k) || normalized.includes(k))) return topic;
    }
    return 'général';
  }
}
