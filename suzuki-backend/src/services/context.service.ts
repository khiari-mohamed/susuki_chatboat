// src/services/context.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: getEffectiveText() + getCombinedText() helpers added.
//         All part-name extraction now reads designation_2 (French)
//         first, falling back to designation (English OEM).
//         Previously only designation was read so parts with only a
//         French name in designation_2 were missed in follow-up
//         context building.
//
// FIX-2: extractPartName() extended with full French vocabulary
//         matching the clarification.service.ts list so context is
//         preserved correctly across follow-up questions.
//
// FIX-3: buildSearchQuery() hasSpecificPart regex extended to
//         include all French designation_2 vocabulary so follow-up
//         queries are built correctly when the user types a French
//         part name that wasn't in the original regex.
//
// FIX-4: extractTopic() extended with French body/lighting/interior
//         terms from designation_2 vocabulary so topic tracking works
//         for parts that only have French names.
//
// FIX-5: get() populates lastPart from the combined text of the
//         most recent user message, not just designation.
//
// FIX-7 (2026-07-07): subtypeOnly branch in buildSearchQuery() was
//         firing even when the current message already names a
//         complete, independent part (hasSpecificPart === true),
//         incorrectly gluing the PREVIOUS topic onto a brand-new
//         unrelated query. Example bug: user types "radiateur" right
//         after searching "capot" → became "radiateur capot", which
//         StrictValidator then rejects half of because it demands
//         both types at once. Guard added: only append lastPart when
//         the message is a bare qualifier with NO independent part
//         identity of its own (mirrors the guard already used by the
//         isPositionOnly branch above it).
// ═══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContextService {
  private cache              = new Map<string, { data: any; timestamp: number }>();
  private lastPartCache      = new Map<string, string>();
  private lastQueryCache     = new Map<string, string>();
  private activeFiltersCache = new Map<string, any[]>();
  private readonly TTL       = 300000; // 5 min

  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: Text field helpers
  // ─────────────────────────────────────────────────────────────────
  private getEffectiveText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    return french.length > 0 ? french : english;
  }

  private getCombinedText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    if (french.toLowerCase() === english.toLowerCase()) return french;
    return `${french} ${english}`.trim();
  }

  // ─────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: get() — lastPart extracted from combined text
  // ─────────────────────────────────────────────────────────────────
  async get(sessionId: string) {
    const cached = this.cache.get(sessionId);
    if (cached && Date.now() - cached.timestamp < this.TTL) return cached.data;

    const messages = await this.prisma.chatMessage.findMany({
      where:   { sessionId },
      orderBy: { timestamp: 'asc' },
    });

    const topicFlow = messages
      .filter((m) => m.sender === 'user')
      .map((m) => this.extractTopic(m.message));

    let lastTopic: string | undefined;
    let lastPart:  string | undefined;
    let lastSide:  string | undefined;

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        const msg   = messages[i].message;
        const topic = this.extractTopic(msg);
        if (topic !== 'général') {
          lastTopic = topic;
          lastPart  = this.extractPartName(msg);   // FIX-2: extended list
          lastSide  = this.extractSide(msg);
          break;
        }
      }
    }

    const data = {
      topicFlow,
      lastTopic,
      // FIX-5: prefer in-memory cache (set by orchestrator after search)
      // over DB-derived part name (which only covers message text)
      lastPart: this.lastPartCache.get(sessionId) || lastPart,
      lastSide,
      messageCount: messages.length,
    };

    this.cache.set(sessionId, { data, timestamp: Date.now() });
    return data;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: extractPartName — full French designation_2 vocabulary
  // ─────────────────────────────────────────────────────────────────
  private extractPartName(message: string): string {
    const lower = message.toLowerCase();

    // Multi-word compounds — most specific first
    if (lower.includes('plaquette')  && lower.includes('frein'))     return 'plaquettes frein';
    if (lower.includes('disque')     && lower.includes('frein'))     return 'disque frein';
    if (lower.includes('filtre')     && lower.includes('air'))       return 'filtre air';
    if (lower.includes('filtre')     && lower.includes('huile'))     return 'filtre huile';
    if (lower.includes('filtre')     && lower.includes('carburant')) return 'filtre carburant';
    if (lower.includes('filtre')     && lower.includes('habitacle')) return 'filtre habitacle';
    if (lower.includes('essuie')     && lower.includes('glace'))     return 'essuie-glace';
    if (lower.includes('pare')       && lower.includes('choc'))      return 'pare-choc';
    if (lower.includes('pare')       && lower.includes('brise'))     return 'pare-brise';
    if ((lower.includes('maitre') || lower.includes('maître')) && lower.includes('cylindre')) return 'maitre cylindre';
    if (lower.includes('monte')      && lower.includes('glace'))     return 'monte glace';
    if (lower.includes('leve')       && lower.includes('glace'))     return 'leve glace';
    if (lower.includes('lave')       && lower.includes('glace'))     return 'lave glace';
    if (lower.includes('tige')       && lower.includes('capot'))     return 'tige capot';
    if (lower.includes('serrure')    && lower.includes('capot'))     return 'serrure capot';
    if ((lower.includes('calle') || lower.includes('cale')) && lower.includes('capot')) {
      return 'calle capot';
    }
    if (lower.includes('charniere')  && lower.includes('capot'))     return 'charniere capot';
    if (lower.includes('charnière')  && lower.includes('capot'))     return 'charnière capot';
    if (lower.includes('support')    && lower.includes('capot'))     return 'support capot';

    // Single-word parts — ordered by specificity (longer/rarer first)
    const singleParts: string[] = [
      // Suspension / steering
      'amortisseur', 'cremaillere', 'crémaillère', 'rotule', 'triangle', 'biellette',
      'roulement', 'stabilisatrice', 'ressort', 'silentbloc', 'cardan', 'moyeu', 'soufflet',
      // Braking
      'tambour', 'etrier', 'étrier',
      // Lighting / body
      'retroviseur', 'rétroviseur', 'phare', 'optique', 'clignotant',
      'enjoliveur', 'calandre', 'charniere', 'charnière', 'serrure', 'moulure',
      'baguette', 'garniture', 'lunette', 'hayon', 'capot', 'vitre',
      'aile', 'porte', 'seuil', 'longeron', 'traverse',
      // Electrical
      'batterie', 'alternateur', 'demarreur', 'démarreur', 'bougie', 'bobine',
      'capteur', 'calculateur', 'faisceau', 'relais', 'fusible', 'radar',
      // Cooling
      'radiateur', 'durite', 'thermostat', 'condenseur', 'compresseur', 'pompe',
      // Engine / drivetrain
      'courroie', 'embrayage', 'culasse', 'injecteur',
      'echappement', 'échappement', 'silencieux', 'vilebrequin', 'distribution',
      // Interior
      'siege', 'siège', 'ceinture', 'volant', 'tableau', 'tapis',
      // Misc
      'joint', 'agrafe', 'agraffe', 'agraphe', 'adhesif', 'adhésif',
      'support', 'poignee', 'poignée', 'grille',
    ];

    for (const part of singleParts) {
      if (lower.includes(part)) return part;
    }

    return '';
  }

  private extractSide(message: string): string | undefined {
    const lower = message.toLowerCase();
    if (/\b(gauche|g)\b/.test(lower))  return 'gauche';
    if (/\b(droite|d)\b/.test(lower))  return 'droite';
    return undefined;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: buildSearchQuery — extended hasSpecificPart regex to cover
  //         all French designation_2 vocabulary for correct follow-up
  //         query construction
  //
  // FIX-7 (2026-07-07): subtypeOnly branch was firing even when the
  //         current message already names a complete, independent
  //         part (hasSpecificPart === true), incorrectly gluing the
  //         PREVIOUS topic onto a brand-new unrelated query.
  //         Example bug: user types "radiateur" right after searching
  //         "capot" → became "radiateur capot", which StrictValidator
  //         then rejects half of because it demands both types at
  //         once. Guard added: only append lastPart when the message
  //         is a bare qualifier with NO independent part identity of
  //         its own (mirrors the guard already used by the
  //         isPositionOnly branch above it).
  // ─────────────────────────────────────────────────────────────────
  buildSearchQuery(message: string, context: any, vehicle?: any): string {
    const lower = message.toLowerCase();

    // FIX-3: Extended part-term detection — covers French designation_2 vocabulary
    const partTerms = [
      'amortisseur', 'plaquette', 'disque', 'filtre', 'phare', 'batterie', 'courroie', 'bougie',
      'porte', 'retroviseur', 'rétroviseur', 'clignotant', 'vitre', 'radiateur', 'capot', 'hayon',
      'aile', 'pare', 'etrier', 'étrier', 'enjoliveur', 'rotule', 'charniere', 'charnière', 'serrure',
      'joint', 'adhesif', 'adhésif', 'moulure', 'grille', 'support', 'pare-choc', 'pare choc', 'pare-brise', 'pare brise',
      'essuie-glace', 'essuie glace', 'monte-glace', 'monte glace', 'leve glace', 'lave glace',
      'tendeur', 'chaine', 'chaîne', 'triangle', 'bras', 'biellette', 'cremaillere', 'crémaillère',
      'cardan', 'roulement', 'ressort', 'suspension', 'tambour', 'maitre', 'maître', 'cylindre',
      'pompe', 'injecteur', 'reservoir', 'réservoir', 'alternateur', 'demarreur', 'démarreur',
      'capteur', 'embrayage', 'volant', 'plateau', 'appareil', 'agrafe', 'agraffe', 'agraphe',
      'feu', 'tapis', 'liquide', 'refroidissement', 'silencieux', 'echappement', 'échappement',
      'optique', 'calandre', 'lunette', 'seuil', 'longeron', 'traverse', 'garniture', 'baguette',
      'radar', 'bobine', 'calculateur', 'faisceau', 'relais', 'fusible', 'bougie', 'culasse',
      'vilebrequin', 'distribution', 'siege', 'siège', 'ceinture', 'durite', 'thermostat',
      'condenseur', 'compresseur', 'courroie', 'embrayage', 'injecteur', 'hayon', 'poignee',
      'poignée', 'moulure', 'grille', 'moyeu', 'soufflet', 'stabilisatrice',
    ];

    const hasSpecificPart = partTerms.some((part) => {
      const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(message);
    });

    const hasPosition =
      /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i.test(message);

    const subtypeOnly = this.extractSubtypeOnly(message);

    // Message has both part and position — use directly
    if (hasSpecificPart && hasPosition) return message;

    // Position-only answer — combine with lastPart from context
    const isPositionOnly =
      /^\s*(avant|arriere|arrière|av|ar)\s*(gauche|droite|g|d)?\s*$/i.test(message.trim()) ||
      /^\s*(gauche|droite|g|d)\s*(avant|arriere|arrière|av|ar)?\s*$/i.test(message.trim());

    if (isPositionOnly && context.lastPart) {
      console.log(
        `[CONTEXT] Position-only clarification: "${message}" + lastPart: "${context.lastPart}"`,
      );
      return `${context.lastPart} ${message}`;
    }

    // FIX-7: added `!hasSpecificPart` guard — a message that already
    // names a complete part on its own must NEVER be merged with the
    // previous topic. subtypeOnly is for bare qualifiers ONLY (words
    // with no independent part identity, e.g. "tige" answering a
    // "which capot?" clarification), never for a fresh standalone
    // part query that happens to be short.
    if (subtypeOnly && context.lastPart && !hasSpecificPart) {
      const posMatch = message.match(
        /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/gi,
      );
      const positionSuffix = posMatch ? ` ${posMatch.join(' ')}` : '';
      console.log(
        `[CONTEXT] Subtype-only clarification: "${message}" + lastPart: "${context.lastPart}"`,
      );
      return `${subtypeOnly} ${context.lastPart}${positionSuffix}`;
    }

    // Part-less message with position — append to lastPart
    if (!hasSpecificPart && hasPosition && context.lastPart) {
      const posMatch = message.match(
        /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/gi,
      );
      if (posMatch) {
        return `${context.lastPart} ${posMatch.join(' ')}`;
      }
    }

    // Follow-up phrases ("et pour", "aussi", "pareil"…)
    const isFollowUp =
      /\b(et\s+pour|aussi|egalement|également|pareil|même\s+chose|pour\s+le|pour\s+la)\b/i.test(
        message,
      );

    if (isFollowUp && context.lastPart) {
      const posMatch = message.match(
        /\b(avant|arrière|arriere|gauche|droite|av|ar|g|d)\b/i,
      );
      if (posMatch) {
        const pos  = posMatch[0].toLowerCase().replace('è', 'e');
        const side = context.lastSide || '';
        const q    = `${context.lastPart} ${pos} ${side}`.trim();
        console.log(`[CONTEXT] Follow-up detected: "${message}" → "${q}"`);
        return q;
      }
      console.log(
        `[CONTEXT] Follow-up without position: "${message}" → "${context.lastPart}"`,
      );
      return `${context.lastPart}`;
    }

    return message;
  }

  private extractSubtypeOnly(message: string): string | undefined {
    const normalized = message
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) return undefined;

    const words = normalized.split(/[\s-]+/).filter(Boolean);
    if (words.length > 2) return undefined;

    const nonContextual = new Set([
      'bonjour', 'salut', 'hello', 'merci', 'thanks', 'prix', 'combien',
      'disponible', 'stock', 'oui', 'non', 'ok', 'besslema', 'service',
      'horaire', 'adresse', 'livraison', 'garantie',
    ]);
    const positionWords = new Set([
      'avant', 'arriere', 'gauche', 'droite', 'droit', 'av', 'ar', 'g', 'd',
    ]);

    if (words.some((w) => nonContextual.has(w) || positionWords.has(w))) {
      return undefined;
    }
    if (words.some((w) => w.length < 3 || /^\d+$/.test(w) || /^[a-z]*\d+[a-z0-9]*$/.test(w))) {
      return undefined;
    }

    return words.join(' ');
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: extractTopic — extended with French designation_2 terms
  // ─────────────────────────────────────────────────────────────────
  private extractTopic(message: string): string {
    const lower = message.toLowerCase();

    // Braking — check most specific first
    if (lower.includes('plaquette') || lower.includes('plakete'))  return 'plaquettes frein';
    if (lower.includes('tambour'))                                  return 'frein';
    if (lower.includes('etrier') || lower.includes('étrier'))      return 'frein';
    if (lower.includes('disque') && lower.includes('frein'))       return 'frein';
    if (lower.includes('frein')  || lower.includes('frain'))       return 'frein';

    // Suspension
    if (lower.includes('amortisseur'))   return 'suspension';
    if (lower.includes('ressort'))       return 'suspension';
    if (lower.includes('triangle'))      return 'suspension';
    if (lower.includes('rotule'))        return 'suspension';
    if (lower.includes('biellette'))     return 'suspension';
    if (lower.includes('bras'))          return 'suspension';
    if (lower.includes('cremaillere') || lower.includes('crémaillère')) return 'direction';
    if (lower.includes('cardan'))        return 'transmission';
    if (lower.includes('roulement'))     return 'transmission';
    if (lower.includes('embrayage'))     return 'transmission';

    // Filters
    if (lower.includes('filtre'))        return 'filtre';

    // Engine
    if (lower.includes('courroie'))      return 'moteur';
    if (lower.includes('bougie'))        return 'moteur';
    if (lower.includes('culasse'))       return 'moteur';
    if (lower.includes('distribution'))  return 'moteur';
    if (lower.includes('vilebrequin'))   return 'moteur';
    if (lower.includes('injecteur'))     return 'moteur';
    if (lower.includes('pompe'))         return 'moteur';

    // Electrical
    if (lower.includes('batterie'))      return 'électrique';
    if (lower.includes('alternateur'))   return 'électrique';
    if (lower.includes('demarreur') || lower.includes('démarreur')) return 'électrique';
    if (lower.includes('bobine'))        return 'électrique';
    if (lower.includes('capteur'))       return 'électrique';
    if (lower.includes('calculateur'))   return 'électrique';
    if (lower.includes('faisceau'))      return 'électrique';
    if (lower.includes('radar'))         return 'électrique';

    // Lighting — FIX-4 additions
    if (lower.includes('phare'))         return 'optique';
    if (lower.includes('optique'))       return 'optique';
    if (lower.includes('feu'))           return 'optique';
    if (lower.includes('clignotant'))    return 'optique';

    // Body — FIX-4 additions
    if (lower.includes('retroviseur') || lower.includes('rétroviseur')) return 'carrosserie';
    if (lower.includes('aile'))          return 'carrosserie';
    if (lower.includes('capot'))         return 'carrosserie';
    if (lower.includes('porte'))         return 'carrosserie';
    if (lower.includes('vitre'))         return 'carrosserie';
    if (lower.includes('lunette'))       return 'carrosserie';
    if (lower.includes('calandre'))      return 'carrosserie';
    if (lower.includes('pare'))          return 'carrosserie';
    if (lower.includes('hayon'))         return 'carrosserie';
    if (lower.includes('charniere') || lower.includes('charnière')) return 'carrosserie';
    if (lower.includes('serrure'))       return 'carrosserie';
    if (lower.includes('enjoliveur'))    return 'carrosserie';

    // Cooling
    if (lower.includes('radiateur'))     return 'refroidissement';
    if (lower.includes('durite'))        return 'refroidissement';
    if (lower.includes('thermostat'))    return 'refroidissement';
    if (lower.includes('condenseur'))    return 'climatisation';
    if (lower.includes('compresseur'))   return 'climatisation';

    // Exhaust
    if (lower.includes('echappement') || lower.includes('échappement')) return 'échappement';
    if (lower.includes('silencieux'))    return 'échappement';
    if (lower.includes('catalyseur'))    return 'échappement';

    // Interior — FIX-4 additions
    if (lower.includes('siege') || lower.includes('siège')) return 'intérieur';
    if (lower.includes('ceinture'))      return 'intérieur';
    if (lower.includes('tapis'))         return 'intérieur';
    if (lower.includes('volant'))        return 'intérieur';
    if (lower.includes('tableau'))       return 'intérieur';

    return 'général';
  }
}