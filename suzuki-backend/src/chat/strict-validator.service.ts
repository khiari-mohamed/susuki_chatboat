import { Injectable, Logger } from '@nestjs/common';
import { extractRequestedPositions, getCatalogPositions } from './part-constraints';
@Injectable()
export class StrictValidatorService {
  private readonly logger = new Logger(StrictValidatorService.name);
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
  // FIX 2026-09-20: same shared position reader as the search gate (French
  // name first, English only when there is no French name, elisions removed).
  private computePositionFlags(part: any): {
    hasAvant: boolean;
    hasArriere: boolean;
    hasGauche: boolean;
    hasDroite: boolean;
  } {
    const actual = getCatalogPositions(part);
    return {
      hasAvant:   actual.axes.includes('AV'),
      hasArriere: actual.axes.includes('AR'),
      hasGauche:  actual.sides.includes('G'),
      hasDroite:  actual.sides.includes('D'),
    };
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
        // ── RULE 1b: Reject subordinate/accessory parts when user asked for the main part
        if (this.isSubordinatePart(combinedTokens, mainPartType)) {
          this.logger.warn(
            `[STRICT-VALIDATION] REJECTED "${displayName}" — Subordinate part (accessory for ${mainPartType}, not the part itself)`,
          );
          return false;
        }
      }

      // ── RULE 2: Position must not CONFLICT ────────────────────
      // FIX-6: French-priority resolution — see computePositionFlags()
      const queryPosition = this.extractPosition(query);
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
      const querySide = this.extractSide(query);
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
  // Words that indicate a part is an accessory/sub-component OF the main part,
  // not the main part itself. Used to reject e.g. "CLIP RESSORT PLAQUETTE DE FREIN"
  // when the user asked for "plaquette de frein".
  private static readonly SUBORDINATE_PREFIXES = [
    'clip', 'ressort', 'kit', 'agrafe', 'vis', 'boulon', 'ecrou', 'goupille',
    'cache', 'protection', 'tuyau', 'durit', 'durite', 'boitier', 'support',
    'fixation', 'attache', 'bride', 'collier', 'joint', 'rondelle', 'clavette',
  ];

  // Part types that are "main consumable" parts — when the user asks for one of
  // these, reject any result whose designation starts with a subordinate prefix
  // followed by the part type (meaning it's an accessory FOR that part, not the part).
  private static readonly MAIN_CONSUMABLE_TYPES = [
    'plaquette', 'disque', 'tambour', 'etrier', 'ferodo',
    'filtre', 'bougie', 'courroie', 'amortisseur',
  ];

  private isSubordinatePart(designationTokens: string[], mainType: string): boolean {
    if (!StrictValidatorService.MAIN_CONSUMABLE_TYPES.includes(mainType)) return false;
    // The designation must contain the main type word (otherwise it wouldn't have
    // passed hasPartType). Check if the FIRST substantive token is a subordinate prefix.
    const firstToken = designationTokens[0];
    return StrictValidatorService.SUBORDINATE_PREFIXES.includes(firstToken);
  }

  private canonicalizeQueryToken(token: string): string {
    const canonical: Record<string, string> = {
      // Tunisian / phonetic spellings
      plakete:       'plaquette',
      plakette:      'plaquette',
      frain:         'frein',
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
  private extractMainPartType(tokens: string[]): string | null {
    // FIX 2026-09-13 — root cause of the confirmed "pare-brise →
    // pare-chocs" misidentification (CarPro test, atelier 08/09/2026):
    // the generic scan below only recognized the bare root "pare",
    // which hasPartType() then mapped ONLY to bumper synonyms — so ANY
    // "pare-*" query (windshield, mud flap, sun visor...) matched
    // bumper parts. "pare" alone is ambiguous in French (pare-brise /
    // pare-choc / pare-boue / pare-soleil are completely different
    // parts); only the compound word disambiguates it. This check MUST
    // run before the generic single-token scan, on the ordered token
    // list, so it can see "pare" followed by its actual suffix.
    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i] !== 'pare') continue;
      const next = tokens[i + 1];
      if (next === 'brise') return 'pare_brise';
      if (next === 'choc' || next === 'chocs') return 'pare_choc';
      if (next === 'boue') return 'pare_boue';
      if (next === 'soleil') return 'pare_soleil';
    }

    const partTypes = [
      'amortisseur', 'plaquette', 'disque', 'filtre', 'phare', 'batterie', 'courroie', 'bougie',
      'retroviseur', 'feu', 'optique', 'optic', 'clignotant', 'aile', 'capot', 'porte', 'radiateur',
      'durite', 'alternateur', 'demarreur', 'capteur', 'embrayage', 'rotule', 'triangle', 'bras',
      'tambour', 'etrier', 'maitre', 'cylindre', 'pompe', 'injecteur', 'tapis', 'boulon',
      'culasse', 'ressort', 'stabilisatrice', 'bobine', 'tendeur', 'cardan', 'silencieux',
      'distribution', 'thermostat', 'echappement', 'catalyseur', 'vitre', 'lunette',
      // FIX 2026-09-13: bare 'pare' removed from this generic list.
      // It's now ONLY reachable through the compound detection above,
      // which requires a real "pare-X" suffix to resolve to a specific
      // part type — a lone "pare" with no recognized suffix no longer
      // silently falls back to bumper.
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
      // FIX 2026-09-13: the old bare 'pare' → bumper-only mapping is
      // removed. It's replaced by the 4 real compound part types below,
      // now produced by extractMainPartType()'s compound detection.
      // Each keeps both English OEM wording and French compound
      // wording — the multi-word synonym matching below
      // (synWords.every(...)) checks that both halves appear somewhere
      // in the candidate's designation, so "PARE BRISE AVANT" in
      // designation_2 matches too.
      pare_choc:      ['bumper', 'bumper front', 'bumper rear', 'pare choc'],
      pare_brise:     ['windshield', 'windscreen', 'wind shield', 'pare brise', 'glace avant', 'vitre avant'],
      pare_boue:      ['mud flap', 'mudguard', 'garde boue', 'pare boue', 'splash guard'],
      pare_soleil:    ['sun visor', 'visor', 'pare soleil'],
      calandre:       ['grille', 'radiator grille', 'front grille'],
      malle:          ['back door', 'panel back', 'trunk', 'tailgate'],
      serrure:        ['lock', 'latch', 'lock set', 'latch assy'],
      charniere:      ['hinge', 'stay', 'hood hinge'],
      baguette:       ['molding', 'moulding', 'trim'],
      garniture:      ['trim', 'lining', 'garnish'],
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
      return designationTokens.some((t) => t === syn || t.includes(syn));
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Only a single, unambiguous request counts for the conflict rules below.
  private extractPosition(text: string): string | null {
    const { axes } = extractRequestedPositions(text);
    if (axes.length !== 1) return null;
    return axes[0] === 'AV' ? 'avant' : 'arriere';
  }

  private extractSide(text: string): string | null {
    const { sides } = extractRequestedPositions(text);
    if (sides.length !== 1) return null;
    return sides[0] === 'G' ? 'gauche' : 'droite';
  }

  private isReferenceQuery(query: string): boolean {
    const candidates = query.match(/\b[A-Z0-9]{5,}(?:[-_][A-Z0-9]{3,})*\b/gi) || [];
    return candidates.some(
      (candidate) => /\d/.test(candidate) && candidate.replace(/[-_]/g, '').length >= 8,
    );
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