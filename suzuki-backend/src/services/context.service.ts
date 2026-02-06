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
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        const topic = this.extractTopic(messages[i].message);
        if (topic !== 'général') {
          lastTopic = topic;
          break;
        }
      }
    }

    const data = { topicFlow, lastTopic, messageCount: messages.length };
    this.cache.set(sessionId, { data, timestamp: Date.now() });
    return data;
  }

  buildSearchQuery(message: string, context: any, vehicle?: any): string {
    const normalized = this.tunisianNormalizer.normalize(message) || message;
    const lower = normalized.toLowerCase();
    const hasSpecificPart = /\b(amortisseur|plaquette|disque|filtre|phare|batterie|courroie|bougie)\b/i.test(message);
    const hasPosition = /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i.test(message);
    
    if (hasSpecificPart && hasPosition) return normalized.trim();

    const isContextual = /\b(aussi|egalement|également|pareil|même chose|et pour|arrière|arriere|et.*arrière|et.*arriere|pour.*arrière|pour.*arriere|deux jeux|les deux|combien pour)\b/i.test(normalized);
    
    if (isContextual && context.lastTopic) {
      const posMatch = normalized.match(/\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i);
      const pos = posMatch ? posMatch[0].toLowerCase() : '';
      
      if ((pos.match(/arrière|arriere|ar/i) || lower.includes('arrière') || lower.includes('arriere')) && (context.lastTopic === 'plaquettes frein' || context.lastTopic.includes('frein'))) {
        return `plaquettes frein arriere ${vehicle?.modele || 'CELERIO'}`;
      }
      if (pos.match(/avant|av/i) && (context.lastTopic === 'plaquettes frein' || context.lastTopic.includes('frein'))) {
        return `plaquettes frein avant ${vehicle?.modele || 'CELERIO'}`;
      }
      if ((lower.includes('combien') || lower.includes('prix')) && (context.lastTopic === 'plaquettes frein' || context.lastTopic.includes('frein'))) {
        return `plaquettes frein ${vehicle?.modele || 'CELERIO'}`;
      }
      if (pos && context.lastTopic) {
        const normPos = pos === 'arriere' ? 'arriere' : pos === 'ar' ? 'arriere' : pos;
        return `${context.lastTopic} ${normPos} ${vehicle?.modele || 'CELERIO'}`;
      }
      if (context.lastTopic) return `${context.lastTopic} ${vehicle?.modele || 'CELERIO'}`;
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
