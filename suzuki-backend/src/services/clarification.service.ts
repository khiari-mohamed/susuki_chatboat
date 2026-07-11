// src/services/clarification.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: getCombinedText() helper — all text checks now scan BOTH
//         designation_2 (French) AND designation (English OEM).
//         Previously only designation was read, so French-named parts
//         like "RETROVISEUR D" were invisible to position/type detection.
//
// FIX-2: filterBySpec() now checks combined text for position/side,
//         so "RETROVISEUR GAUCHE" in designation_2 is correctly
//         matched/rejected when filtering by side.
//
// FIX-3: extractDimensions() tokenizes combined text so position and
//         side tokens present only in designation_2 are found.
//
// FIX-4: isBilateralPart() checks combined text so French-named
//         bilateral parts trigger the bilateral detection correctly.
//
// FIX-5: isAnswer() type-dimension check now also looks at
//         designation_2 when matching product names against the answer.
//
// FIX-6: extractPartName() extended with all French designation_2
//         vocabulary — monte glace, leve glace, charniere, enjoliveur,
//         and other French terms now present in the primary field.
// ═══════════════════════════════════════════════════════════════════

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

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: Single source of truth for part text.
  // Returns designation_2 (French) when available, else designation.
  // ─────────────────────────────────────────────────────────────────
  private getEffectiveText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    return french.length > 0 ? french : english;
  }

  // Returns BOTH fields combined so a token only needs to appear in ONE.
  private getCombinedText(p: any): string {
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    if (french.toLowerCase() === english.toLowerCase()) return french;
    return `${french} ${english}`.trim();
  }

  private getClarificationText(p: any): string {
    const searchDescription = (p.searchDescription ?? p.search_description ?? '').trim();
    if (searchDescription.length > 0) return searchDescription;
    return this.getEffectiveText(p);
  }

  // ─────────────────────────────────────────────────────────────────
  setPending(sessionId: string, query: string, dimension: string, products: any[]) {
    this.pending.set(sessionId, {
      originalQuery: query,
      dimension:     dimension as any,
      products,
      timestamp:     Date.now(),
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

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: isAnswer — type check now scans designation_2 too
  // ─────────────────────────────────────────────────────────────────
  isAnswer(message: string, context: ClarificationContext): boolean {
    const lower = message.toLowerCase().trim();

    // Contextual follow-up queries
    const isContextualQuery =
      /\b(et pour|aussi|egalement|également|pareil|même chose)\b/i.test(lower);
    if (isContextualQuery) {
      const hasPosition = /\b(avant|arriere|arrière|av|ar)\b/i.test(lower);
      const hasSide     = /\b(gauche|droite|g|d|droit|gosh)\b/i.test(lower);
      return hasPosition || hasSide;
    }

    // Combined position + side answers
    const hasBoth =
      /\b(avant|arriere|arrière|av|ar)\s+(gauche|droite|g|d|droit)\b/i.test(lower) ||
      /\b(gauche|droite|g|d|droit)\s+(avant|arriere|arrière|av|ar)\b/i.test(lower);
    if (hasBoth) return true;

    const hasPosition = /\b(avant|arriere|arrière|av|ar)\b/i.test(lower);
    const hasSide     = /\b(gauche|droite|g|d|droit)\b/i.test(lower);
    if (hasPosition || hasSide) return true;

    if (context.dimension === 'position')
      return ['avant', 'arriere', 'arrière', 'av', 'ar'].includes(lower);
    if (context.dimension === 'side')
      return ['gauche', 'droite', 'g', 'd', 'droit'].includes(lower);

    if (context.dimension === 'type') {
      const filterTypes = ['air', 'huile', 'gazoile', 'habitacle', 'carburant', 'essence', 'climatiseur'];
      if (filterTypes.some((t) => lower.includes(t))) return true;
      // Type answers should match the same text used to build type
      // choices: curated searchDescription when available, otherwise
      // the French display name. Do not accept random OEM-only words.
      return context.products.some((p) => {
        const combined = this.getClarificationText(p).toLowerCase();
        return (
          combined.includes(lower) ||
          (['support', 'joint', 'roulement', 'toc', 'kit'].includes(lower) &&
            combined.includes(lower))
        );
      });
    }
    return false;
  }

  // ─────────────────────────────────────────────────────────────────
  checkNeeded(
    products: any[],
    message: string,
  ): { needed: boolean; variants: string[]; dimension: string } {
    if (!products || products.length === 0)
      return { needed: false, variants: [], dimension: '' };

    const lower = message.toLowerCase();

    if (this.isGenericQuery(lower)) {
      return {
        needed:    true,
        variants:  ['Filtre à air', 'Plaquettes frein', 'Amortisseur', 'Batterie', 'Phare'],
        dimension: 'type',
      };
    }

    const hasPos  = /\b(avant|arrière|arriere|av|ar)\b/i.test(message);
    const hasSide = /\b(gauche|droite|droit|dr|g|gh)\b/i.test(message);

    // Parts that are single central pieces — never have a left/right side.
    // Asking for side clarification on these is always wrong.
    const noSideParts = [
      'radiateur', 'calandre', 'capot', 'pare brise', 'parebrise',
      'lunette', 'toit', 'reservoir', 'batterie', 'moteur',
    ];
    const queryHasNoSidePart = noSideParts.some((p) => lower.includes(p));

    // FIX-2: filterBySpec now uses combined text
    let candidates = this.filterBySpec(products, message);
    if (candidates.length === 0) candidates = products;

    if (candidates.length === 1) return { needed: false, variants: [], dimension: '' };

    // BUGFIX: pass the normalized query tokens through so
    // extractDimensions can tell the query term itself ("capot") apart
    // from genuine distinguishing qualifiers ("tige", "serrure", "calle").
    const queryTokens = lower
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[\s-]+/)
      .filter((t) => t.length >= 3);

    // FIX-3: extractDimensions now uses combined text
    const dims = this.extractDimensions(candidates, queryTokens);

    if (!hasPos && dims.positions.length > 1) {
      return { needed: true, variants: dims.positions, dimension: 'position' };
    }

    // BUGFIX: side clarification was gated behind
    // `candidates.length >= 2 && candidates.length <= 3`, which silently
    // SKIPPED the side question whenever more than 3 position-filtered
    // candidates remained — e.g. "amortisseur" → "Avant" → 10 results
    // for "AMORTISSEUR AV *" containing both D and G variants. The user
    // got zero side clarification and the bot returned them all mixed
    // together as if there were no ambiguity. The cap had no principled
    // justification: ambiguity (dims.sides.length > 1) is the only
    // correct trigger condition, regardless of candidate count.
    if (!hasSide && !queryHasNoSidePart && dims.sides.length > 1) {
      return { needed: true, variants: dims.sides, dimension: 'side' };
    }

    if (!hasPos && !hasSide && dims.types.length > 1) {
      return { needed: true, variants: dims.types, dimension: 'type' };
    }

    // BUGFIX: genericSubTypes catches the case the old logic completely
    // missed — query results that are genuinely DIFFERENT PARTS sharing
    // a common word, with no position/side/fluid-type ambiguity at all.
    // Example: "capot" → TIGE CAPOT (hood stay), SERRURE CAPOT (hood
    // lock), CALLE CAPOT (hood wedge). Without this check, all of these
    // were silently dumped together as if they were the same part.
    //
    // Threshold: only trigger if there are at least 2 distinct
    // qualifying words AND they appear across at least 2 different
    // products (avoids over-triggering on a single odd token).
    if (!hasPos && !hasSide && dims.genericSubTypes.length >= 2) {
      // Only ask if the candidates are genuinely split across these
      // qualifiers — i.e. not all candidates share the exact same
      // qualifier set (which would mean no real ambiguity).
      const distinctQualifierSets = new Set(
        candidates.map((p) => {
          const text   = this.getClarificationText(p).toUpperCase();
          const tokens = text.split(/[\s\-\/\(\),]+/).filter(Boolean);
          const qualifiers = dims.genericSubTypes
            .map((g) => g.toUpperCase())
            .filter((g) => tokens.includes(g));
          return qualifiers.sort().join('|');
        }),
      );
      if (distinctQualifierSets.size > 1) {
        return {
          needed:    true,
          variants:  dims.genericSubTypes.slice(0, 5).map(
            (g) => g.charAt(0).toUpperCase() + g.slice(1),
          ),
          dimension: 'type',
        };
      }
    }

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
      /^pi[èe]ces.*suzuki/i,
    ];
    return patterns.some((pattern) => pattern.test(message.trim()));
  }

  // FIX-4: isBilateralPart checks combined text
  private isBilateralPart(products: any[]): boolean {
    const bilateral = [
      'retroviseur', 'feu', 'phare', 'aile', 'amortisseur', 'amorto', 'porte',
      'clignotant', 'essuie', 'vitre', 'poignee', 'poignée',
      // FIX-4: French designation_2 terms also bilateral
      'optique', 'charniere', 'serrure', 'enjoliveur', 'custode',
    ];
    return products.some((p) => {
      const combined = this.getCombinedText(p).toLowerCase();
      return bilateral.some((part) => combined.includes(part));
    });
  }

  buildQuestion(partName: string, variants: string[], dimension: string): string {
    const variantList = variants
      .map((v) => `• ${v.charAt(0).toUpperCase() + v.slice(1)}`)
      .join('\n');
    const dimLabel =
      dimension === 'position' ? 'la position' :
      dimension === 'side'     ? 'le côté'     : 'le type';
    return (
      `Merci pour votre demande concernant ${partName}.\n\n` +
      `Afin d'identifier précisément la pièce compatible, merci de préciser ${dimLabel} :\n` +
      `${variantList}\n\n` +
      `Dès confirmation, je pourrai vous communiquer la référence et le prix.`
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-6: extractPartName — extended French vocabulary
  // ─────────────────────────────────────────────────────────────────
  extractPartName(query: string): string {
    const lower = query.toLowerCase();

    // Multi-word compounds — check most specific first
    if (lower.includes('plaquette')   && lower.includes('frein'))    return 'plaquettes frein';
    if (lower.includes('disque')      && lower.includes('frein'))    return 'disque frein';
    if (lower.includes('filtre')      && lower.includes('air'))      return 'filtre air';
    if (lower.includes('filtre')      && lower.includes('huile'))    return 'filtre huile';
    if (lower.includes('filtre')      && lower.includes('carburant')) return 'filtre carburant';
    if (lower.includes('filtre')      && lower.includes('habitacle')) return 'filtre habitacle';
    if (lower.includes('essuie')      && lower.includes('glace'))    return 'essuie-glace';
    if (lower.includes('pare')        && lower.includes('choc'))     return 'pare-choc';
    if (lower.includes('pare')        && lower.includes('brise'))    return 'pare-brise';
    if ((lower.includes('maitre') || lower.includes('maître')) && lower.includes('cylindre')) return 'maitre cylindre';
    if (lower.includes('monte')       && lower.includes('glace'))    return 'monte glace';
    if (lower.includes('leve')        && lower.includes('glace'))    return 'leve glace';
    if (lower.includes('lave')        && lower.includes('glace'))    return 'lave glace';

    // Single-word French parts — extended FIX-6
    const singleParts: [string, string][] = [
      // Suspension / steering
      ['amortisseur',  'amortisseur'],
      ['cremaillere',  'crémaillère'],
      ['crémaillère',  'crémaillère'],
      ['rotule',       'rotule'],
      ['triangle',     'triangle'],
      ['biellette',    'biellette'],
      ['roulement',    'roulement'],
      ['stabilisatrice','stabilisatrice'],
      ['ressort',      'ressort'],
      ['silentbloc',   'silentbloc'],
      ['cardan',       'cardan'],
      ['moyeu',        'moyeu'],
      ['soufflet',     'soufflet'],
      // Braking
      ['tambour',      'tambour'],
      ['etrier',       'étrier'],
      ['étrier',       'étrier'],
      // Lighting
      ['retroviseur',  'rétroviseur'],
      ['rétroviseur',  'rétroviseur'],
      ['phare',        'phare'],
      ['optique',      'optique'],
      ['feu',          'feu'],
      ['clignotant',   'clignotant'],
      // Body
      ['aile',         'aile'],
      ['capot',        'capot'],
      ['porte',        'porte'],
      ['vitre',        'vitre'],
      ['lunette',      'lunette'],
      ['calandre',     'calandre'],
      ['charniere',    'charnière'],
      ['charnière',    'charnière'],
      ['serrure',      'serrure'],
      ['enjoliveur',   'enjoliveur'],
      ['moulure',      'moulure'],
      ['baguette',     'baguette'],
      ['garniture',    'garniture'],
      ['seuil',        'seuil'],
      ['hayon',        'hayon'],
      ['poignee',      'poignée'],
      ['poignée',      'poignée'],
      ['grille',       'grille'],
      ['longeron',     'longeron'],
      ['traverse',     'traverse'],
      // Electrical
      ['batterie',     'batterie'],
      ['alternateur',  'alternateur'],
      ['demarreur',    'démarreur'],
      ['démarreur',    'démarreur'],
      ['bougie',       'bougie'],
      ['bobine',       'bobine'],
      ['capteur',      'capteur'],
      ['calculateur',  'calculateur'],
      ['faisceau',     'faisceau'],
      ['relais',       'relais'],
      ['fusible',      'fusible'],
      ['radar',        'radar'],
      // Cooling
      ['radiateur',    'radiateur'],
      ['durite',       'durite'],
      ['thermostat',   'thermostat'],
      ['condenseur',   'condenseur'],
      ['compresseur',  'compresseur'],
      // Engine / drivetrain
      ['courroie',     'courroie'],
      ['embrayage',    'embrayage'],
      ['culasse',      'culasse'],
      ['pompe',        'pompe'],
      ['injecteur',    'injecteur'],
      ['echappement',  'échappement'],
      ['échappement',  'échappement'],
      ['silencieux',   'silencieux'],
      ['vilebrequin',  'vilebrequin'],
      ['distribution', 'distribution'],
      // Misc
      ['joint',        'joint'],
      ['agrafe',       'agrafe'],
      ['agraffe',      'agraffe'],
      ['agraphe',      'agraphe'],
      ['adhesif',      'adhésif'],
      ['adhésif',      'adhésif'],
      ['support',      'support'],
      ['tapis',        'tapis'],
      ['siege',        'siège'],
      ['siège',        'siège'],
      ['ceinture',     'ceinture'],
      ['volant',       'volant'],
    ];

    for (const [match, label] of singleParts) {
      if (lower.includes(match)) return label;
    }

    return query;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: filterBySpec — checks combined text (French + English)
  // ─────────────────────────────────────────────────────────────────
  private filterBySpec(products: any[], message: string): any[] {
    const lower = message.toLowerCase();
    const pos   =
      lower.includes('avant')   ? 'avant'   :
      lower.includes('arrière') || lower.includes('arriere') ? 'arrière' : null;
    const side  =
      lower.includes('gauche')  ? 'gauche'  :
      lower.includes('droite')  || lower.includes('droit')   ? 'droite'  : null;

    if (!pos && !side) return products;

    return products.filter((p) => {
      // FIX-2: use combined text for filtering
      const combined = this.getCombinedText(p).toLowerCase();

      // Reject wrong position
      if (pos === 'avant'   && /\b(arriere|arrière|ar|rear|rr)\b/i.test(combined)) return false;
      if (pos === 'arrière' && /\b(avant|av|front|fr)\b/i.test(combined))           return false;

      // Reject wrong side
      if (side === 'gauche' && /\b(droite|droit|d|right|rh)\b/i.test(combined))    return false;
      if (side === 'droite' && /\b(gauche|g|left|lh)\b/i.test(combined))            return false;

      // Require correct position
      const matchPos =
        !pos ||
        (pos === 'avant'   && /\b(avant|av|front|fr)\b/i.test(combined)) ||
        (pos === 'arrière' && /\b(arriere|arrière|ar|rear|rr)\b/i.test(combined));

      // Require correct side
      const matchSide =
        !side ||
        (side === 'gauche' && /\b(gauche|g|left|lh)\b/i.test(combined)) ||
        (side === 'droite' && /\b(droite|droit|d|right|rh)\b/i.test(combined));

      return matchPos && matchSide;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: extractDimensions — tokenizes combined text
  // BUGFIX: added genericSubTypes detection. Previously this function
  // only recognized position (avant/arrière), side (gauche/droite),
  // and a tiny fixed list of filter-fluid / accessory "type" words
  // (air, huile, support, joint...). Real catalog results for a query
  // like "capot" return GENUINELY DIFFERENT PARTS that all contain the
  // word "capot" — "TIGE CAPOT" (hood stay), "SERRURE CAPOT" (hood
  // lock), "CALLE CAPOT" (hood wedge) — none of which differ by
  // position or side. With no type detected either, checkNeeded()
  // silently fell through to "no clarification needed" and dumped
  // all of them together as if they were variants of one part.
  // ─────────────────────────────────────────────────────────────────
  private extractDimensions(products: any[], queryTokens: string[] = []) {
    const positions = new Set<string>();
    const sides     = new Set<string>();
    const types     = new Set<string>();
    const genericSubTypeCounts = new Map<string, { label: string; count: number }>();

    // Words that never count as a meaningful distinguishing qualifier
    const stopQualifiers = new Set([
      'AV', 'AVANT', 'AVG', 'AVD', 'FRONT', 'FR',
      'AR', 'ARRIERE', 'ARRIÈRE', 'ARG', 'ARD', 'REAR', 'RR',
      'G', 'GH', 'GAUCHE', 'LEFT', 'LH', 'CONDUCTEUR',
      'D', 'DR', 'DROITE', 'DROIT', 'RIGHT', 'RH', 'PASSAGER',
      'DE', 'DU', 'LA', 'LE', 'LES', 'ET', 'ASSY', 'COMP', 'SET',
      'PIECE', 'PIECES', 'SUZUKI', 'OEM',
    ]);

    products.forEach((p) => {
      // FIX-3: use COMBINED text — tokenize both French and English fields
      const combined = this.getCombinedText(p).toUpperCase();
      const tokens   = combined.split(/[\s\-\/\(\),]+/).filter(Boolean);

      // ── POSITION ──────────────────────────────────────────────
      const hasAv = tokens.some((t) =>
        ['AV', 'AVANT', 'AVG', 'AVD', 'FRONT', 'FR'].includes(t),
      );
      const hasAr = tokens.some((t) =>
        ['AR', 'ARRIERE', 'ARRIÈRE', 'ARG', 'ARD', 'REAR', 'RR'].includes(t),
      );
      if (hasAv) positions.add('avant');
      if (hasAr) positions.add('arrière');

      // ── SIDE ──────────────────────────────────────────────────
      const hasG = tokens.some((t) =>
        ['G', 'GH', 'GAUCHE', 'AVG', 'ARG', 'LEFT', 'LH', 'CONDUCTEUR'].includes(t),
      );
      const hasD = tokens.some((t) =>
        ['D', 'DR', 'DROITE', 'DROIT', 'AVD', 'ARD', 'RIGHT', 'RH', 'PASSAGER'].includes(t),
      );
      if (hasG) sides.add('gauche');
      if (hasD) sides.add('droite');

      // ── TYPE (filter fluid / accessory words) ──────────────────
      tokens.forEach((w) => {
        if (
          ['AIR', 'HUILE', 'GAZOILE', 'HABITACLE', 'CARBURANT',
           'ESSENCE', 'CLIMATISEUR'].includes(w)
        ) {
          types.add(w.toLowerCase());
        }
        if (
          ['SUPPORT', 'JOINT', 'ROULEMENT', 'TOC', 'KIT', 'JEU'].includes(w)
        ) {
          types.add(w.toLowerCase());
        }
      });

      // ── BUGFIX: GENERIC SUB-TYPE (the actual distinguishing word) ──
      // Find tokens that are NOT the query term itself, NOT a position/
      // side word, and NOT a generic stop-qualifier. These are the words
      // that make "TIGE CAPOT" different from "SERRURE CAPOT" — they
      // are the real signal that the results are different parts, not
      // variants of the same part.
      const queryTokensUpper = queryTokens.map((t) => t.toUpperCase());
      const clarificationText = this.getClarificationText(p).toUpperCase();
      const clarificationTokens = new Set(
        clarificationText.split(/[\s\-\/\(\),]+/).filter(Boolean),
      );
      clarificationTokens.forEach((t) => {
        if (t.length < 3) return;
        if (stopQualifiers.has(t)) return;
        if (queryTokensUpper.includes(t)) return;
        if (/^\d+$/.test(t)) return;
        if (/^[A-Z]*\d+[A-Z0-9]*$/.test(t)) return;
        if (/^\d{4,}/.test(t)) return;

        const normalizedToken = t
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const existing = genericSubTypeCounts.get(normalizedToken);
        if (existing) {
          existing.count += 1;
        } else {
          genericSubTypeCounts.set(normalizedToken, {
            label: t.toLowerCase(),
            count: 1,
          });
        }
      });
    });

    const genericSubTypes = Array.from(genericSubTypeCounts.values())
      .filter((entry) => entry.count > 0 && entry.count < products.length)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .map((entry) => entry.label);

    return {
      positions: Array.from(positions),
      sides:     Array.from(sides),
      types:     Array.from(types),
      genericSubTypes,
    };
  }
}
