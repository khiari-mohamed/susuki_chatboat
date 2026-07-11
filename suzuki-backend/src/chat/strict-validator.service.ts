// src/chat/strict-validator.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: All text checks now run against BOTH designation_2 (French)
//         AND designation (English OEM), in that priority order.
//         Previously only designation (English) was checked, causing
//         valid French-named parts to be wrongly rejected.
//
// FIX-2: hasPartType() extended with French→English mappings so parts
//         whose OEM name is English (e.g. "MIRROR ASSY,OUT REAR VIEW,L")
//         are still correctly matched when user types "retroviseur".
//
// FIX-3: getEffectiveText() helper centralises the field-priority
//         logic (designation_2 ?? designation) used everywhere.
//
// FIX-4: Position and side conflict checks now scan both fields.
//
// FIX-5: Log output uses French name when available.
//
// FIX-6 (2026-07-08): PERMANENT FIX for false position/side rejections
//         (RULE 2 / RULE 3 below). These rules previously scanned a
//         MERGED French+English token list (getCombinedText) for
//         position/side conflicts. Because English OEM text commonly
//         carries standard "LH"/"RH" abbreviations that don't always
//         agree with the French side label — a documented data-quality
//         gap (schema.prisma: "33% NULL designation_2", inconsistent
//         backfills) — a part correctly labelled e.g. "OPTIQUE D"
//         (droite) in French could get falsely rejected here because a
//         stray "lh" token from its English designation looked like a
//         gauche/droite conflict. Root-caused and reproduced via
//         AdvancedSearchService.calculatePositionMatches — same class
//         of bug, same fix applied here for defense-in-depth: RULE 2
//         and RULE 3 now use computePositionFlags(), which resolves
//         each axis (avant/arrière, gauche/droite) from designation_2
//         FIRST, and only consults designation (English) when French
//         has no signal at all for that axis.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StrictValidatorService {
  private readonly logger = new Logger(StrictValidatorService.name);

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: Single source of truth for "display text" of a part.
  // Returns designation_2 (French) if non-empty, else designation (English).
  // All validation logic calls this instead of reading part.designation directly.
  // ─────────────────────────────────────────────────────────────────
  private getEffectiveText(part: any): string {
    const french  = (part.designation2 ?? part.designation_2 ?? '').trim();
    const english = (part.designation ?? '').trim();
    return french.length > 0 ? french : english;
  }

  // Returns BOTH texts concatenated so a token only needs to appear in ONE of them.
  private getCombinedText(part: any): string {
    const french  = (part.designation2 ?? part.designation_2 ?? '').trim();
    const english = (part.designation ?? '').trim();
    // Deduplicate if both fields are identical
    if (french.toLowerCase() === english.toLowerCase()) return french;
    return `${french} ${english}`.trim();
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-6 (2026-07-08): French-priority position/side token sets and
  // resolver. Mirrors AdvancedSearchService.calculatePositionMatches —
  // see the header comment above for the full rationale.
  // ─────────────────────────────────────────────────────────────────
  private static readonly AVANT_TOKENS   = ['avant', 'av', 'front', 'fr', 'avd', 'avg'];
  private static readonly ARRIERE_TOKENS = ['arriere', 'ar', 'rear', 'rr', 'ard', 'arg'];
  private static readonly GAUCHE_TOKENS  = ['gauche', 'gh', 'left', 'lh', 'g', 'avg', 'arg'];
  private static readonly DROITE_TOKENS  = ['droite', 'droit', 'dr', 'right', 'rh', 'd', 'avd', 'ard'];

  private computePositionFlags(part: any): {
    hasAvant: boolean;
    hasArriere: boolean;
    hasGauche: boolean;
    hasDroite: boolean;
  } {
    const frenchTokens   = this.normalize(part.designation2 ?? part.designation_2 ?? '').split(/[\s-]+/).filter(Boolean);
    const fallbackTokens = this.normalize(part.designation ?? '').split(/[\s-]+/).filter(Boolean);

    const frHasAvant   = this.hasAnyToken(frenchTokens, StrictValidatorService.AVANT_TOKENS);
    const frHasArriere = this.hasAnyToken(frenchTokens, StrictValidatorService.ARRIERE_TOKENS);
    const frHasGauche  = this.hasAnyToken(frenchTokens, StrictValidatorService.GAUCHE_TOKENS);
    const frHasDroite  = this.hasAnyToken(frenchTokens, StrictValidatorService.DROITE_TOKENS);

    const hasAvant   = (frHasAvant || frHasArriere) ? frHasAvant   : this.hasAnyToken(fallbackTokens, StrictValidatorService.AVANT_TOKENS);
    const hasArriere = (frHasAvant || frHasArriere) ? frHasArriere : this.hasAnyToken(fallbackTokens, StrictValidatorService.ARRIERE_TOKENS);
    const hasGauche  = (frHasGauche || frHasDroite) ? frHasGauche  : this.hasAnyToken(fallbackTokens, StrictValidatorService.GAUCHE_TOKENS);
    const hasDroite  = (frHasGauche || frHasDroite) ? frHasDroite  : this.hasAnyToken(fallbackTokens, StrictValidatorService.DROITE_TOKENS);

    return { hasAvant, hasArriere, hasGauche, hasDroite };
  }

  // ─────────────────────────────────────────────────────────────────
  // MAIN ENTRY POINT
  // ─────────────────────────────────────────────────────────────────
  validateResults(parts: any[], query: string, context: any): any[] {
    if (!parts || parts.length === 0) return [];

    if (this.isReferenceQuery(query)) {
      this.logger.log(`[STRICT-VALIDATION] Reference detected – skipping token validation`);
      return parts;
    }

    const normalizedQuery  = this.normalize(query);
    const queryTokens      = normalizedQuery
      .split(/[\s-]+/)
      .filter((t) => t.length >= 3)
      .map((t) => this.canonicalizeQueryToken(t));

    this.logger.log(`[STRICT-VALIDATION] Validating ${parts.length} parts for query: "${query}"`);
    this.logger.log(`[STRICT-VALIDATION] Query tokens: [${queryTokens.join(', ')}]`);

    const validated = parts.filter((part) => {
      // FIX-1 + FIX-3: Build token list from COMBINED French + English text
      const combined          = this.normalize(this.getCombinedText(part));
      const combinedTokens    = combined.split(/[\s-]+/).filter((t) => t.length >= 1);

      // Also keep a French-only token list for display in logs
      const displayName = this.normalize(this.getEffectiveText(part));

      // ── RULE 1: Main part type MUST be present ────────────────
      const mainPartType = this.extractMainPartType(queryTokens);
      if (mainPartType) {
        const hasMainType = this.hasPartType(combinedTokens, mainPartType);
        if (!hasMainType) {
          this.logger.warn(
            `[STRICT-VALIDATION] REJECTED "${displayName}" — Missing main type "${mainPartType}"`,
          );
          return false;
        }
      }

      // ── RULE 2: Position must not CONFLICT ────────────────────
      // FIX-6: French-priority resolution — see computePositionFlags()
      const queryPosition = this.extractPosition(normalizedQuery);
      if (queryPosition) {
        const { hasAvant, hasArriere } = this.computePositionFlags(part);
        const partHasWrongPosition =
          (queryPosition === 'avant'   && hasArriere && !hasAvant) ||
          (queryPosition === 'arriere' && hasAvant    && !hasArriere);
        if (partHasWrongPosition) {
          this.logger.warn(
            `[STRICT-VALIDATION] REJECTED "${displayName}" — Wrong position (wanted: ${queryPosition})`,
          );
          return false;
        }
      }

      // ── RULE 3: Side must not CONFLICT ───────────────────────
      // FIX-6: French-priority resolution — see computePositionFlags()
      const querySide = this.extractSide(normalizedQuery);
      if (querySide) {
        const { hasGauche, hasDroite } = this.computePositionFlags(part);
        const partHasWrongSide =
          (querySide === 'gauche' && hasDroite && !hasGauche) ||
          (querySide === 'droite' && hasGauche && !hasDroite);
        if (partHasWrongSide) {
          this.logger.warn(
            `[STRICT-VALIDATION] REJECTED "${displayName}" — Wrong side (wanted: ${querySide})`,
          );
          return false;
        }
      }

      // ── RULE 4: (scoring system handles mandatory word matching) ─

      // ── RULE 5: Reject wrong part categories ──────────────────
      const wrongCategories = this.detectWrongCategory(queryTokens, combinedTokens);
      if (wrongCategories.length > 0) {
        this.logger.warn(
          `[STRICT-VALIDATION] REJECTED "${displayName}" — Wrong categories: ${wrongCategories.join(', ')}`,
        );
        return false;
      }

      // ── RULE 6: Reject conflicting part types ─────────────────
      const hasConflict = this.hasConflictingPartTypes(queryTokens, combinedTokens);
      if (hasConflict) {
        this.logger.warn(
          `[STRICT-VALIDATION] REJECTED "${displayName}" — Conflicting part types`,
        );
        return false;
      }

      this.logger.log(`[STRICT-VALIDATION] ✅ PASSED "${displayName}"`);
      return true;
    });

    this.logger.log(
      `[STRICT-VALIDATION] Final: ${validated.length}/${parts.length} parts passed validation`,
    );
    return validated;
  }

  // ─────────────────────────────────────────────────────────────────
  // Canonicalize plural / variant query tokens
  // ─────────────────────────────────────────────────────────────────
  private canonicalizeQueryToken(token: string): string {
    const canonical: Record<string, string> = {
      plaquettes:    'plaquette',
      disques:       'disque',
      filtres:       'filtre',
      amortisseurs:  'amortisseur',
      phares:        'phare',
      batteries:     'batterie',
      courroies:     'courroie',
      bougies:       'bougie',
      alternateurs:  'alternateur',
      demarreurs:    'demarreur',
      capteurs:      'capteur',
      joints:        'joint',
      durites:       'durite',
      radiateurs:    'radiateur',
      pompes:        'pompe',
      injecteurs:    'injecteur',
      roulements:    'roulement',
      rotules:       'rotule',
      triangles:     'triangle',
      bras:          'bras',
      tambours:      'tambour',
      etriers:       'etrier',
      cylindres:     'cylindre',
      tapis:         'tapis',
      boulons:       'boulon',
      retroviseurs:  'retroviseur',
      amortiseurs:   'amortisseur',
      feux:          'feu',
      optiques:      'optique',
      // BUGFIX: 'optics' wasn't canonicalized, and enjoliveur/hayon
      // plurals weren't handled either, matching the new vocabulary
      // added to extractMainPartType and hasPartType above.
      optics:        'optic',
      enjoliveurs:   'enjoliveur',
      hayons:        'hayon',
      ailes:         'aile',
      portes:        'porte',
      vitres:        'vitre',
      ceintures:     'ceinture',
      ressorts:      'ressort',
      bielles:       'bielle',
      pistons:       'piston',
    };
    return canonical[token] || token;
  }

  // ─────────────────────────────────────────────────────────────────
  // Extract main part type from query tokens
  // BUGFIX: 'optic' was missing from this list. The catalog's
  // designation_2 field uses the short form "OPTIC" (not "optique")
  // for headlamp parts (confirmed in production data: "OPTIC D",
  // "OPTIC G"). Without 'optic' here, extractMainPartType() returned
  // null for queries like "optic", so RULE 1 (main type must be
  // present) silently did nothing — meaning strict validation gave
  // ZERO protection for this query, letting any junk result through
  // unfiltered. Same root-cause class as the capot/cache bug: a term
  // the catalog actually uses wasn't in our recognized vocabulary.
  // ─────────────────────────────────────────────────────────────────
  private extractMainPartType(tokens: string[]): string | null {
    const partTypes = [
      'amortisseur', 'plaquette', 'disque', 'filtre', 'phare', 'batterie', 'courroie', 'bougie',
      'retroviseur', 'feu', 'optique', 'optic', 'clignotant', 'aile', 'capot', 'porte', 'radiateur',
      'durite', 'alternateur', 'demarreur', 'capteur', 'embrayage', 'rotule', 'triangle', 'bras',
      'tambour', 'etrier', 'maitre', 'cylindre', 'pompe', 'injecteur', 'tapis', 'boulon',
      'culasse', 'ressort', 'stabilisatrice', 'bobine', 'tendeur', 'cardan', 'silencieux',
      'distribution', 'thermostat', 'echappement', 'catalyseur', 'vitre', 'lunette', 'pare',
      'calandre', 'serrure', 'charniere', 'roulement', 'malle', 'longeron', 'traverse',
      'condenseur', 'compresseur', 'vilebrequin', 'piston', 'segment', 'bielle', 'soupape',
      'volant', 'cremaillere', 'rotule', 'biellette', 'moyeu', 'differentiel', 'cardan',
      'essuie', 'balai', 'leve', 'monte', 'radar', 'klaxon', 'antenne', 'ceinture', 'siege',
      // BUGFIX: additional short DB-vocabulary terms seen in production
      // designation_2 values that weren't yet in this list
      'enjoliveur', 'garniture', 'baguette', 'moulure', 'seuil', 'hayon',
      'optic',
    ];

    for (const type of partTypes) {
      if (tokens.includes(type)) return type;
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: hasPartType — checks French AND English synonyms
  // ─────────────────────────────────────────────────────────────────
  private hasPartType(designationTokens: string[], partType: string): boolean {
    // Exact match
    if (designationTokens.includes(partType)) return true;
    // Plural forms
    if (designationTokens.includes(partType + 's'))  return true;
    if (designationTokens.includes(partType + 'es')) return true;
    // Compound substring
    if (designationTokens.some((t) => t.includes(partType))) return true;

    // FIX-2: Extended mappings — French part name → English OEM equivalents
    // and English OEM name → French equivalents, so both fields match correctly.
    const specialMappings: Record<string, string[]> = {
      // Braking
      retroviseur:    ['miroir', 'mirror', 'assy', 'rear', 'view', 'out'],
      amortisseur:    ['shock', 'absorber', 'absorb', 'suspension', 'strg', 'spnsn'],
      plaquette:      ['pad', 'pads', 'shoe', 'shoes', 'brake pad', 'pad set'],
      disque:         ['disc', 'disk', 'rotor', 'brake disc'],
      frein:          ['brake', 'frein', 'freinage'],
      tambour:        ['drum', 'brake drum'],
      etrier:         ['caliper', 'brake caliper'],
      maitre:         ['master', 'cylinder assy', 'brake master'],
      cylindre:       ['cylinder', 'master'],

      // Filters
      filtre:         ['filter', 'element', 'cleaner', 'element air'],
      air:            ['air', 'admission', 'intake', 'cleaner'],
      huile:          ['oil', 'huile', 'lube'],
      habitacle:      ['cabin', 'interior', 'habitacle', 'pollen'],
      carburant:      ['fuel', 'carburant', 'essence'],

      // Lighting
      feu:            ['lamp', 'light', 'unit', 'comb', 'lamp unit', 'rear', 'combo'],
      optique:        ['headlamp', 'headlight', 'unit headlamp', 'beam', 'phare'],
      // BUGFIX: 'optic' is the actual short form used in designation_2
      // for this catalog (e.g. "OPTIC D", "OPTIC G"). Without this entry,
      // a query for "optic" would extract 'optic' as the main type
      // (after the extractMainPartType fix above) but then fail
      // hasPartType() validation against parts whose designation only
      // contains "phare"/"headlamp" synonyms, since exact match,
      // plural, and substring checks alone don't cross-reference optic
      // ↔ optique ↔ phare ↔ headlamp.
      optic:          ['optique', 'headlamp', 'headlight', 'unit headlamp', 'beam', 'phare', 'optic', 'optique av', 'optique ar'],
      clignotant:     ['indicator', 'turn', 'signal', 'turn signal'],
      phare:          ['headlamp', 'headlight', 'unit headlamp'],

      // Body / panels
      aile:           ['fender', 'wing', 'panel front fender', 'panel rear fender', 'panel fender'],
      capot:          ['hood', 'panel front hood', 'panel hood', 'comp front hood'],
      porte:          ['door', 'panel door', 'panel assy front door', 'panel assy rear door',
                       'panel assy back door', 'front door', 'rear door'],
      vitre:          ['glass', 'glace', 'window', 'windshield', 'rear window'],
      lunette:        ['rear window', 'glass back', 'glass rear'],
      pare:           ['bumper', 'bumper front', 'bumper rear', 'pare choc'],
      calandre:       ['grille', 'radiator grille', 'front grille'],
      malle:          ['back door', 'panel back', 'trunk', 'tailgate'],
      serrure:        ['lock', 'latch', 'lock set', 'latch assy'],
      charniere:      ['hinge', 'stay', 'hood hinge'],
      baguette:       ['molding', 'moulding', 'trim'],
      garniture:      ['trim', 'lining', 'garnish'],
      // BUGFIX: these were added to extractMainPartType's partTypes list
      // but had no corresponding hasPartType mapping, so RULE 1 would
      // extract them as the main type but then have only weak exact/
      // substring fallback matching against designation tokens.
      enjoliveur:     ['wheel cover', 'hub cap', 'cover wheel', 'enjoliveur'],
      moulure:        ['molding', 'moulding', 'trim', 'side molding'],
      seuil:          ['sill', 'door sill', 'rocker', 'seuil'],
      hayon:          ['back door', 'tailgate', 'liftgate', 'panel back door'],

      // Drivetrain
      embrayage:      ['clutch', 'disc clutch', 'cover clutch', 'plate clutch'],
      cardan:         ['shaft', 'drive shaft', 'cv axle', 'front drive', 'axle'],
      roulement:      ['bearing', 'ball bearing'],
      boite:          ['gearbox', 'transmission', 'gear'],
      differentiel:   ['differential', 'diff'],
      cremaillere:    ['steering rack', 'box strg gear', 'strg gear'],
      rotule:         ['ball joint', 'rod end', 'tie rod'],
      triangle:       ['control arm', 'wishbone', 'suspension arm', 'arm assy'],
      bras:           ['arm', 'control arm', 'arm assy'],
      biellette:      ['link', 'sway bar link', 'stabilizer link'],

      // Cooling
      radiateur:      ['radiator', 'radiator assy', 'rad'],
      condenseur:     ['condenser', 'condenser assy'],
      durite:         ['hose', 'tube', 'pipe', 'hosewtr', 'hose suction', 'hose discharge',
                       'hose htr'],
      pompe:          ['pump', 'pump assy', 'water pump'],
      thermostat:     ['thermostat'],
      vase:           ['reservoir', 'tank', 'tank water', 'reserve'],

      // Electrical
      batterie:       ['battery', 'accu', 'accumulator', 'tray battery'],
      alternateur:    ['generator', 'generator assy', 'alternator'],
      demarreur:      ['starter', 'motor assy starting', 'starting motor'],
      bobine:         ['coil', 'coil assy ignition', 'ignition coil'],
      bougie:         ['spark plug', 'plug', 'spark'],
      calculateur:    ['controller', 'ecu', 'controller assy', 'module assy'],
      faisceau:       ['harness', 'wiring', 'harness assy'],
      capteur:        ['sensor', 'sonde', 'sensor assy', 'probe'],
      radar:          ['sensor park', 'parking sensor', 'sensor assy park'],

      // Engine
      moteur:         ['engine', 'motor', 'motor assy'],
      culasse:        ['cylinder head', 'head', 'cover assy cylinder head'],
      piston:         ['piston'],
      courroie:       ['belt', 'timing belt', 'v belt', 'drive belt'],
      distribution:   ['timing', 'timing chain', 'timing belt'],
      collecteur:     ['manifold', 'pipe exh', 'exhaust manifold'],
      echappement:    ['exhaust', 'muffler', 'silencer', 'pipe exh'],
      injecteur:      ['injector', 'injector assy fuel'],
      compresseur:    ['compressor', 'compressor assy'],
      vilebrequin:    ['crankshaft', 'vilebrequin', 'vilbrequin'],
      soupape:        ['valve', 'soupape'],
      segment:        ['ring', 'piston ring', 'segment'],

      // Suspension
      ressort:        ['spring', 'coil spring'],
      stabilisatrice: ['stabilizer', 'sway', 'anti-roll', 'stab'],
      tendeur:        ['tensioner', 'tension', 'tendeur'],
      moyeu:          ['hub', 'wheel hub', 'hub assy'],

      // Interior
      volant:         ['steering wheel', 'wheel assy steering', 'wheel'],
      siege:          ['seat', 'seat assy', 'chair'],
      tableau:        ['dashboard', 'instrument', 'panel instrument', 'speedometer'],
      ceinture:       ['seatbelt', 'belt', 'safety belt'],
      commande:       ['switch', 'control', 'switch assy'],

      // Wipers / washer
      essuie:         ['wiper', 'wiper assy', 'blade wiper', 'balai', 'windshield wiper'],
      balai:          ['wiper', 'blade', 'wiper blade', 'blade assy wiper'],
      leve:           ['regulator', 'window regulator', 'regulator assy'],
      monte:          ['regulator', 'window regulator', 'regulator assy'],

      // Misc
      silencieux:     ['muffler', 'silencer', 'marmite'],
      klaxon:         ['horn', 'horn assy'],
      antenne:        ['antenna', 'aerial'],
      tapis:          ['mat', 'carpet', 'floor mat'],
      longeron:       ['member', 'side member', 'member front side', 'member side'],
      traverse:       ['beam', 'cross member', 'member fr bumper', 'member hood lock'],
    };

    const synonyms = specialMappings[partType] || [];
    return synonyms.some((syn) => {
      // Multi-word synonym: check if all words appear in tokens
      if (syn.includes(' ')) {
        const synWords = syn.split(' ');
        return synWords.every((sw) => designationTokens.some((dt) => dt.includes(sw)));
      }
      // BUGFIX: removed `syn.includes(t)` reverse-substring check — it was too
      // permissive (e.g. 'headlamp'.includes('head') matched 'BULB HEAD LAMP'
      // as an optique). Only check token-contains-synonym, not the reverse.
      return designationTokens.some((t) => t === syn || t.includes(syn));
    });
  }

  // ─────────────────────────────────────────────────────────────────
  private extractPosition(text: string): string | null {
    if (/\b(avant|av)\b/i.test(text))   return 'avant';
    if (/\b(arriere|ar)\b/i.test(text)) return 'arriere';
    return null;
  }

  private extractSide(text: string): string | null {
    if (/\b(gauche)\b/i.test(text))              return 'gauche';
    if (/\b(droite|droit)\b/i.test(text))        return 'droite';
    // Only match standalone 'g' or 'd' if not part of a longer word
    if (/(?<![a-z])g(?![a-z])/i.test(text))      return 'gauche';
    if (/(?<![a-z])d(?![a-z])/i.test(text) && !/\b(de|du|des|dans|dont|donc)\b/i.test(text)) return 'droite';
    return null;
  }

  private isReferenceQuery(query: string): boolean {
    const candidates = query.match(/\b[A-Z0-9]{5,}(?:[-_][A-Z0-9]{3,})*\b/gi) || [];
    return candidates.some(
      (candidate) => /\d/.test(candidate) && candidate.replace(/[-_]/g, '').length >= 8,
    );
  }

  private hasAnyToken(tokens: string[], expected: string[]): boolean {
    return expected.some((token) => tokens.includes(token));
  }

  // ─────────────────────────────────────────────────────────────────
  // Detect wrong part categories — FIX-1 applied (checks combined text)
  // ─────────────────────────────────────────────────────────────────
  private detectWrongCategory(queryTokens: string[], designationTokens: string[]): string[] {
    const wrongCategories: string[] = [];

    // filtre ≠ frein parts
    if (
      queryTokens.includes('filtre') &&
      designationTokens.some((t) => ['frein', 'brake', 'plaquette', 'disque'].includes(t))
    ) {
      wrongCategories.push('frein instead of filtre');
    }

    // feu ≠ radiateur parts
    if (
      queryTokens.includes('feu') &&
      designationTokens.some((t) => ['radiateur', 'radiator', 'durite', 'eau'].includes(t))
    ) {
      wrongCategories.push('radiateur instead of feu');
    }

    // aile ≠ huile parts
    if (
      queryTokens.includes('aile') &&
      designationTokens.some((t) => ['huile', 'oil', 'filtre'].includes(t))
    ) {
      wrongCategories.push('huile instead of aile');
    }

    // clignotant must be present explicitly
    if (queryTokens.includes('clignotant')) {
      const hasClignotant = designationTokens.some((t) =>
        ['clignotant', 'indicator', 'turn', 'signal'].includes(t),
      );
      if (!hasClignotant) {
        wrongCategories.push('not a clignotant');
      }
    }

    // batterie must be present explicitly
    if (
      queryTokens.includes('batterie') &&
      !designationTokens.some((t) => ['batterie', 'battery', 'accu', 'accumulator'].includes(t))
    ) {
      wrongCategories.push('not a batterie');
    }

    // silencieux ≠ collecteur
    if (
      queryTokens.includes('silencieux') &&
      designationTokens.some((t) => ['collecteur', 'collector', 'manifold'].includes(t)) &&
      !queryTokens.includes('collecteur')
    ) {
      wrongCategories.push('collecteur instead of silencieux');
    }

    // catalyseur ≠ diluant / joint
    if (queryTokens.includes('catalyseur')) {
      if (
        designationTokens.some((t) => ['diluant', 'solvant', 'thinner'].includes(t)) &&
        !queryTokens.some((t) => ['diluant', 'solvant', 'thinner'].includes(t))
      ) {
        wrongCategories.push('diluant instead of catalyseur');
      }
      if (
        designationTokens.some((t) => ['joint', 'ring', 'seal'].includes(t)) &&
        !queryTokens.some((t) => ['joint', 'ring', 'seal'].includes(t))
      ) {
        wrongCategories.push('joint instead of catalyseur');
      }
    }

    return wrongCategories;
  }

  // ─────────────────────────────────────────────────────────────────
  // Detect gross semantic conflicts between query and designation
  // ─────────────────────────────────────────────────────────────────
  private hasConflictingPartTypes(queryTokens: string[], designationTokens: string[]): boolean {
    // filtre but designation is a braking part
    if (
      queryTokens.includes('filtre') &&
      !designationTokens.some((t) =>
        ['filtre', 'filter', 'air', 'huile', 'oil', 'gazoile', 'habitacle', 'carburant', 'fuel', 'element'].includes(t),
      ) &&
      designationTokens.some((t) =>
        ['frein', 'brake', 'plaquette', 'disque', 'etrier', 'tambour', 'caliper', 'pad'].includes(t),
      )
    ) {
      return true;
    }

    return false;
  }

  // ─────────────────────────────────────────────────────────────────
  private levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b.charAt(i - 1) === a.charAt(j - 1)
            ? matrix[i - 1][j - 1]
            : Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1,
              );
      }
    }
    return matrix[b.length][a.length];
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}