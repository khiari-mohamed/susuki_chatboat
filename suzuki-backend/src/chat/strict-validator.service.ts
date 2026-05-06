import { Injectable, Logger } from '@nestjs/common';

/**
 * STRICT VALIDATION SERVICE
 * Ensures ZERO wrong parts are returned to users
 * Every result MUST pass ALL validation rules
 */
@Injectable()
export class StrictValidatorService {
  private readonly logger = new Logger(StrictValidatorService.name);

  /**
   * CRITICAL: Validate search results before returning to user
   * Returns only parts that pass ALL strict validation rules
   */
  validateResults(parts: any[], query: string, context: any): any[] {
    if (!parts || parts.length === 0) return [];

    // If the query contains a reference number, skip token-based validation
    const hasReference = /\b\d{8,}\b/.test(query) || /\b[A-Z0-9]{5,}-[A-Z0-9]{3,}\b/i.test(query);
    if (hasReference) {
      this.logger.log(`[STRICT-VALIDATION] Reference detected – skipping token validation`);
      return parts;  // keep all parts found by reference search
    }

    const normalizedQuery = this.normalize(query);
    const queryTokens = normalizedQuery
      .split(' ')
      .filter(t => t.length >= 3)
      .map(t => this.canonicalizeQueryToken(t));
    
    this.logger.log(`[STRICT-VALIDATION] Validating ${parts.length} parts for query: "${query}"`);
    this.logger.log(`[STRICT-VALIDATION] Query tokens: [${queryTokens.join(', ')}]`);

    const validated = parts.filter(part => {
      const designation = this.normalize(part.designation);
      const designationTokens = designation.split(' ').filter(t => t.length >= 1);

      // RULE 1: Main part type MUST match
      const mainPartType = this.extractMainPartType(queryTokens);
      if (mainPartType) {
        const hasMainType = this.hasPartType(designationTokens, mainPartType);
        if (!hasMainType) {
          this.logger.warn(`[STRICT-VALIDATION] REJECTED "${part.designation}" - Missing main type "${mainPartType}"`);
          return false;
        }
      }

      // RULE 2: Position must not CONFLICT (part with wrong position is rejected;
      // parts with no position word are kept)
      const queryPosition = this.extractPosition(normalizedQuery);
      if (queryPosition) {
        const partHasWrongPosition =
          (queryPosition === 'avant' && /\b(arriere|ar)\b/i.test(designation)) ||
          (queryPosition === 'arriere' && /\b(avant|av)\b/i.test(designation));
        if (partHasWrongPosition) {
          this.logger.warn(`[STRICT-VALIDATION] REJECTED "${part.designation}" - Wrong position (wanted: ${queryPosition})`);
          return false;
        }
      }

      // RULE 3: Side must not CONFLICT
      const querySide = this.extractSide(normalizedQuery);
      if (querySide) {
        const partHasWrongSide =
          (querySide === 'gauche' && /\b(droite|droit|dr)\b/i.test(designation)) ||
          (querySide === 'droite' && /\b(gauche|gh)\b/i.test(designation));
        if (partHasWrongSide) {
          this.logger.warn(`[STRICT-VALIDATION] REJECTED "${part.designation}" - Wrong side (wanted: ${querySide})`);
          return false;
        }
      }

      // RULE 4: Only car-part words are required to appear in the designation.
      // Common filler words, Tunisian expressions, and action verbs are NOT required.
      const CAR_PART_WORDS = new Set([
        'amortisseur', 'plaquette', 'disque', 'filtre', 'phare', 'batterie', 'courroie', 'bougie',
        'retroviseur', 'feu', 'clignotant', 'aile', 'capot', 'porte', 'radiateur', 'durite',
        'alternateur', 'demarreur', 'capteur', 'embrayage', 'rotule', 'triangle', 'bras',
        'tambour', 'etrier', 'maitre', 'cylindre', 'pompe', 'injecteur', 'tapis', 'boulon',
        'pare', 'brise', 'choc', 'essuie', 'glace', 'tendeur', 'cardan', 'roulement', 'ressort',
        'suspension', 'barre', 'moteur', 'boite', 'echappement', 'silencieux', 'catalyseur',
        'liquide', 'refroidissement', 'huile', 'frein', 'culasse', 'joint', 'stabilisatrice',
        'bobine', 'distribution', 'thermostat'
      ]);

      const mandatoryPartWords = queryTokens.filter(t => CAR_PART_WORDS.has(t));

      for (const pw of mandatoryPartWords) {
        const hasWord = this.hasWordMatch(designationTokens, pw) || this.hasPartType(designationTokens, pw);
        if (!hasWord) {
          this.logger.warn(`[STRICT-VALIDATION] REJECTED "${part.designation}" - Missing part word "${pw}"`);
          return false;
        }
      }

      // RULE 5: Reject wrong part categories
      const wrongCategories = this.detectWrongCategory(queryTokens, designationTokens);
      if (wrongCategories.length > 0) {
        this.logger.warn(`[STRICT-VALIDATION] REJECTED "${part.designation}" - Wrong categories: ${wrongCategories.join(', ')}`);
        return false;
      }

      // RULE 6: Reject if designation contains conflicting part types
      const hasConflict = this.hasConflictingPartTypes(queryTokens, designationTokens);
      if (hasConflict) {
        this.logger.warn(`[STRICT-VALIDATION] REJECTED "${part.designation}" - Conflicting part types`);
        return false;
      }

      this.logger.log(`[STRICT-VALIDATION] ✅ PASSED "${part.designation}"`);
      return true;
    });

    this.logger.log(`[STRICT-VALIDATION] Final: ${validated.length}/${parts.length} parts passed validation`);
    return validated;
  }

  private canonicalizeQueryToken(token: string): string {
    const canonical: Record<string, string> = {
      plaquettes: 'plaquette',
      disques: 'disque',
      filtres: 'filtre',
      amortisseurs: 'amortisseur',
      phares: 'phare',
      batteries: 'batterie',
      courroies: 'courroie',
      bougies: 'bougie',
      alternateurs: 'alternateur',
      demarreurs: 'demarreur',
      capteurs: 'capteur',
      joints: 'joint',
      durites: 'durite',
      radiateurs: 'radiateur',
      pompes: 'pompe',
      injecteurs: 'injecteur',
      roulements: 'roulement',
      rotules: 'rotule',
      triangles: 'triangle',
      bras: 'bras',
      tambours: 'tambour',
      etriers: 'etrier',
      cylindres: 'cylindre',
      tapis: 'tapis',
      boulons: 'boulon',
    };

    return canonical[token] || token;
  }

  private extractMainPartType(tokens: string[]): string | null {
    const partTypes = [
      'amortisseur', 'plaquette', 'disque', 'filtre', 'phare', 'batterie', 'courroie', 'bougie',
      'retroviseur', 'feu', 'clignotant', 'aile', 'capot', 'porte', 'radiateur', 'durite',
      'alternateur', 'demarreur', 'capteur', 'embrayage', 'rotule', 'triangle', 'bras',
      'tambour', 'etrier', 'maitre', 'cylindre', 'pompe', 'injecteur', 'tapis', 'boulon',
      'culasse', 'ressort', 'stabilisatrice', 'bobine', 'tendeur', 'cardan', 'silencieux',
      'distribution', 'thermostat', 'echappement'
    ];

    for (const type of partTypes) {
      if (tokens.includes(type)) return type;
    }
    return null;
  }

  private hasPartType(designationTokens: string[], partType: string): boolean {
    // Check exact match
    if (designationTokens.includes(partType)) return true;

    // Check plural forms
    if (designationTokens.includes(partType + 's')) return true;
    if (designationTokens.includes(partType + 'es')) return true;

    // Check compound words
    const compound = designationTokens.some(t => t.includes(partType));
    if (compound) return true;

    // Special cases
    const specialMappings: Record<string, string[]> = {
      'retroviseur': ['miroir', 'mirror'],
      'feu': ['light', 'lamp', 'lampe'],
      'clignotant': ['feu', 'light', 'indicator', 'turn'],
      'aile': ['fender', 'wing'],
      'batterie': ['battery', 'accu'],
      'courroie': ['belt'],
      'bougie': ['spark', 'plug'],
      'amortisseur': ['shock', 'absorber'],
      'plaquette': ['pad', 'pads', 'shoe', 'shoes', 'plaquette', 'plaquettes'],
      'disque': ['disc', 'disk', 'rotor'],
      'filtre': ['filter'],
      'radiateur': ['radiator'],
      'durite': ['hose', 'tube'],
      'tapis': ['mat', 'carpet'],
      'tambour': ['drum'],
      'etrier': ['caliper'],
      'maitre': ['master'],
      'cylindre': ['cylinder'],
      'culasse': ['cylinder head', 'head gasket', 'culasse'],
      'ressort': ['spring', 'coil spring'],
      'stabilisatrice': ['stabilizer', 'stab', 'sway'],
      'bobine': ['coil', 'ignition coil'],
      'tendeur': ['tensioner', 'tension'],
      'injecteur': ['injector'],
      'cardan': ['cv axle', 'drive shaft', 'cardan', 'axle'],
      'triangle': ['control arm', 'wishbone', 'suspension arm', 'arm'],
      'bras': ['arm', 'control arm'],
      'silencieux': ['muffler', 'silencer', 'silencieux', 'echappement'],
      'echappement': ['exhaust', 'muffler', 'silencer', 'echappement'],
      'distribution': ['timing', 'distribution'],
      'pompe': ['pump'],
      'frein': ['brake', 'frein']
    };

    const synonyms = specialMappings[partType] || [];
    return synonyms.some(syn => designationTokens.some(t => t.includes(syn)));
  }

  private extractPosition(text: string): string | null {
    if (/\b(avant|av)\b/i.test(text)) return 'avant';
    if (/\b(arriere|ar)\b/i.test(text)) return 'arriere';
    return null;
  }

  private extractSide(text: string): string | null {
    if (/\b(gauche|g)\b/i.test(text)) return 'gauche';
    if (/\b(droite|d|droit)\b/i.test(text)) return 'droite';
    return null;
  }

  private hasWordMatch(designationTokens: string[], queryWord: string): boolean {
    // Exact match
    if (designationTokens.includes(queryWord)) return true;

    // Plural forms
    if (designationTokens.includes(queryWord + 's')) return true;
    if (designationTokens.includes(queryWord + 'es')) return true;
    if (queryWord.endsWith('s') && designationTokens.includes(queryWord.slice(0, -1))) return true;

    // Substring match for compound words
    if (designationTokens.some(t => t.includes(queryWord) || queryWord.includes(t))) return true;

    // Levenshtein distance <= 1 for typos
    if (designationTokens.some(t => this.levenshtein(t, queryWord) <= 1)) return true;

    return false;
  }

  private detectWrongCategory(queryTokens: string[], designationTokens: string[]): string[] {
    const wrongCategories: string[] = [];

    // If user asks for "filtre", reject "frein" parts
    if (queryTokens.includes('filtre') && designationTokens.some(t => ['frein', 'brake', 'plaquette', 'disque'].includes(t))) {
      wrongCategories.push('frein instead of filtre');
    }

    // If user asks for "feu", reject "radiateur" parts
    if (queryTokens.includes('feu') && designationTokens.some(t => ['radiateur', 'durite', 'eau'].includes(t))) {
      wrongCategories.push('radiateur instead of feu');
    }

    // If user asks for "aile", reject "huile" parts
    if (queryTokens.includes('aile') && designationTokens.some(t => ['huile', 'oil', 'filtre'].includes(t))) {
      wrongCategories.push('huile instead of aile');
    }

    // If user asks for "clignotant", must have "clignotant" or "indicator" in designation
    // Simple "FEU AR" without "clignotant" is NOT a clignotant
    if (queryTokens.includes('clignotant')) {
      const hasClignotant = designationTokens.some(t => ['clignotant', 'indicator', 'turn', 'signal'].includes(t));
      if (!hasClignotant) {
        wrongCategories.push('not a clignotant');
      }
    }

    // If user asks for "batterie", reject "batrie" typo corrections that lead to wrong parts
    if (queryTokens.includes('batterie') && !designationTokens.some(t => ['batterie', 'battery', 'accu'].includes(t))) {
      wrongCategories.push('not a batterie');
    }

    return wrongCategories;
  }

  private hasConflictingPartTypes(queryTokens: string[], designationTokens: string[]): boolean {
    // This check is intentionally simplified — RULE 1 (main part type match)
    // already handles the core rejection. Exclusive groups caused false rejections.
    // Only flag the most obvious semantic conflicts:

    // User asked for filtre but designation is about frein (not filter-related)
    if (queryTokens.includes('filtre') &&
        !designationTokens.some(t => ['filtre', 'filter', 'air', 'huile', 'gazoile', 'habitacle', 'carburant'].includes(t)) &&
        designationTokens.some(t => ['frein', 'brake', 'plaquette', 'disque', 'etrier', 'tambour'].includes(t))) {
      return true;
    }

    return false;
  }

  private levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
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
