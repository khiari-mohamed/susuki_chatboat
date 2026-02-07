import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUZUKI_MODELS } from '../constants/vehicle-models';
import { applyTunisianFallback } from '../constants/tunisian-fallback';

// Add missing interfaces at the top
interface PositionRequirements {
  avant: boolean;
  arriere: boolean;
  gauche: boolean;
  droite: boolean;
}

interface SearchContext {
  rawTokens: string[];
  expandedTerms: string[];
  positionInfo: PositionRequirements;
  mainPartType: string | undefined;
  originalQuery: string;
  normalizedQuery: string;
  hasTunisianDialect: boolean;
}

interface Part {
  designation: string;
  reference: string;
  stock: number;
  [key: string]: any;
}

@Injectable()
export class AdvancedSearchService {
  private readonly synonyms: Record<string, string[]> = {
    // Tunisian dialect translations
    filtre: ['filtre', 'filter', 'filtr', 'filtere', 'filtration', 'cartouche' , 'filtr'],
    air: ['air', 'admission', 'intake', 'aer' , 'hwe'],
    prix: ['prix', 'price', 'cost', 'cout', 'coût', 'pris', 'tarif', 'taklfa'],
    stock: ['stock', 'disponible', 'availability', 'stok', 'dispo' , ' mawjoud'],
    celerio: ['celerio', 'celirio', 'celario', 'celerio'],
    spresso: [ 's-presso', 'spresso','es-presso'],
    
    // Enhanced brake terms for multilingual support
    brake: ['brake', 'frein', 'freinage', 'frain', 'break', 'fren'],
    brakes: ['brakes', 'freins', 'brake', 'frein'],
    kit: ['kit', 'jeu', 'set', 'ensemble', 'pack'],
 
    // Vitrerie & ouvrants
    vitre: ['vitre', 'vitres', 'glace', 'glaces', 'verre', 'fenetre', 'fenêtre', 'fenêtres', 'window', 'custode', 'lunette', 'vit' , 'belar ', ' chebek'],
    levevitre: ['leve vitre', 'lève vitre', 'leve-vitre', 'lève-vitre', 'lèvevitre', 'levevitre', 'mecanisme vitre', 'mécanisme vitre', 'commande vitre'],
    porte: ['porte', 'portière', 'portieres', 'door', 'portier', 'bab'],
    parebrise: ['parebrise', 'pare-brise', 'pare brise', 'windshield', 'parabrize', 'brise', 'vitre avant'],
    retroviseur: ['retroviseur', 'rétroviseur', 'miroir', 'mirroir', 'retro', 'rétro', 'mirwar', 'miray'],
    lunette: ['lunette', 'vitre arriere', 'vitre arrière', 'glace arriere', 'glace arrière'],

    // Suspension & direction
    amortisseur: ['amortisseur', 'amorto', 'amort', 'suspension', 'amor', 'amortisseure', 'amortiseur', 'amor'],
    biellette: ['biellette', 'biellette de direction', 'tirant', 'bielette', 'bielle direction', 'biel'],
    rotule: ['rotule', 'rotule de direction', 'rot', 'rotul', 'boule direction'],
    triangle: ['triangle', 'triangl', 'bras suspension'],
    bras: ['bras', 'bras de suspension', 'bras direction'],
    cremaillere: ['cremaillere', 'crémaillère', 'direction', 'steering', 'crem'],
    cardans: ['cardan', 'transmission', 'arbre de transmission', 'drive shaft', 'trans'],
    roulement: ['roulement', 'bearing', 'roul', 'rulman', 'roulman'],
    ressort: ['ressort', 'spring', 'suspension', 'susp'],
    suspension: ['suspension', 'susp', 'amortissement'],

    // Freinage
    disque: ['disque', 'disques', 'disc', 'disk', 'disq', 'frein avant', 'brake disc', 'brake disk', 'brake discs'],
    plaquette: ['plaquette', 'plaquettes', 'plaq', 'pad', 'pads', 'plak', 'plaket', 'plakete', 'brake pad', 'brake pads'],
    disc: ['disc', 'disk', 'disque', 'disques', 'brake disc', 'brake disk'],
    pads: ['pads', 'pad', 'plaquette', 'plaquettes', 'brake pad', 'brake pads'],
    etrier: ['etrier', 'étrier', 'etr', 'caliper', 'etrie', 'etri'],
    tambour: ['tambour', 'tambours', 'tam', 'frein arriere', 'frein arrière'],
    frein: ['frein', 'freinage', 'brake', 'frain', 'break', 'fren'],
    maitre_cylindre: ['maitre cylindre', 'maître cylindre', 'master cylinder', 'cylindre', 'mcyl'],

    // Optiques
    phare: ['phare', 'phares', 'optique', 'projecteur', 'headlight', 'light', 'dhou', 'lumiere', 'lumière'],
    feu: ['feu', 'feux', 'clignotant', 'antibrouillard', 'feux stop', 'stop', 'cligno', 'feu position', 'warning'],
    ampoule: ['ampoule', 'lampe', 'bulb', 'led', 'eclairage', 'éclairage'],
    optique: ['optique', 'bloc optique', 'bloc phare', 'lighthouse'],

    // Electricité
    batterie: ['batterie', 'battery', 'batri', 'bateri', 'bataria', 'accumulator', 'accu'],
    alternateur: ['alternateur', 'alternator', 'alter', 'alterno', 'alternato'],
    demarreur: ['demarreur', 'démarreur', 'starter', 'start', 'demar', 'démar'],
    capteur: ['capteur', 'sensor', 'sonde', 'detecteur', 'détecteur', 'capt'],
    faisceau: ['faisceau', 'câblage', 'cablage', 'fil', 'fils', 'wiring', 'cable'],
    boitier: ['boitier', 'boîtier', 'calculateur', 'ecu', 'module', 'control unit'],
    klaxon: ['klaxon', 'avertisseur', 'horn', 'buzzer', 'beeper'],

    // Filtration
    filtreair: ['filtre air', 'filtre à air', 'filtre-a-air', 'air filter', 'filtr air', 'filtre admission', 'filtere air', 'filtre aer'],
    filtrehuile: ['filtre huile', 'filtre à huile', 'filtre-a-huile', 'oil filter', 'filtr huile', 'filtre lubrification'],
    filtrefuel: ['filtre carburant', 'filtre gasoil', 'filtre essence', 'filtre à carburant', 'fuel filter', 'filtre combustible', 'filtr essence'],
    filtrehabitable: ['filtre habitacle', 'filtre pollen', 'filtre cabine', 'cabin filter', 'filtre climatisation', 'filtre interieur', 'filtr habitacle'],
  
    // Moteur & transmission
    courroie: ['courroie', 'courroies', 'belt', 'courroi', 'distribution', 'timing belt', 'accessoires'],
    pompeeau: ['pompe a eau', 'pompe à eau', 'water pump', 'pompe eau', 'pump water', 'pompe refroidissement'],
    pompehuile: ['pompe a huile', 'pompe à huile', 'oil pump', 'pompe huile', 'lubrification'],
    bougie: ['bougie', 'bougies', 'spark plug', 'bougi', 'sparkplug', 'allumage'],
    embrayage: ['embrayage', 'kit embrayage', 'clutch', 'emb', 'embrayag', 'embreyage', 'debrayage'],
    volantmoteur: ['volant moteur', 'volant bimasse', 'flywheel', 'volant', 'bimasse'],
    butee: ['butee', 'butée', 'butée embrayage', 'release bearing'],
    moteur: ['moteur', 'engine', 'bloc moteur', 'culasse', 'cylindre', 'motor'],
    soupape: ['soupape', 'valve', 'admission', 'echappement', 'échappement', 'valv'],
    joint: ['joint', 'gasket', 'seal', 'etancheite', 'étanchéité', 'join'],
    piston: ['piston', 'segment', 'ring', 'cylindre', 'chemise'],
    bielle: ['bielle', 'rod', 'connecting rod', 'biel'],
    vilebrequin: ['vilebrequin', 'crankshaft', 'manivelle', 'crank'],

    // Refroidissement & climatisation
    radiateur: ['radiateur', 'radiateur chauffage', 'radiateur refroidissement', 'refroidissement', 'chauffage'],
    condenseur: ['condenseur', 'condenseur clim'],
    evaporateur: ['evaporateur', 'évaporateur'],
    compresseur: ['compresseur', 'compresseur clim'],
    thermostat: ['thermostat'],
    ventilateur: ['ventilateur', 'ventilateur moteur'],

    // Carburant & alimentation
    pompecarburant: ['pompe carburant', 'pompe essence', 'fuel pump', 'pompe', 'pompe à essence', 'pompe injection', 'jauge'],
    injecteur: ['injecteur', 'injecteurs', 'injection', 'inject', 'gicleur', 'buse injection', 'injector'],
    reservoir: ['reservoir', 'réservoir', 'tank', 'reserv', 'tank essence', 'tank carburant', 'fuel tank'],
    bouchonreservoir: ['bouchon reservoir', 'bouchon réservoir', 'fuel cap', 'bouchon essence', 'cap', 'tappo'],
    carburateur: ['carburateur', 'carbu', 'carburetor', 'mixing', 'melangeur'],
    admission: ['admission', 'intake', 'collecteur admission', 'pipe admission', 'manifold'],
    papillon: ['papillon', 'throttle', 'throttle body', 'boitier papillon', 'corps papillon'],

    // Échappement
    echappement: ['echappement', 'tuyau echappement', 'silencieux', 'exhaust', 'pot', 'systeme echappement', 'sortie', 'tuyau'],
    catalyseur: ['catalyseur', 'catalytic', 'cat', 'convertisseur catalytique', 'depollution'],
    marmite: ['marmite echappement', 'marmite', 'silencieux arriere', 'pot arriere', 'rear silencer'],
    ligne: ['ligne echappement', 'ligne complete', 'full system', 'systeme complet'],

    // Climatisation
    filtreclim: ['filtre clim', 'filtre climatisation', 'deshydrateur', 'secheur'],

    // Autres pièces courantes
    courroiedistribution: ['courroie distribution', 'courroie dentée', 'timing belt', 'distribution kit'],
    chaine: ['chaine', 'chaîne', 'chain', 'distribution chain'],
    cable: ['cable', 'câble', 'wire', 'fil', 'commande', 'control cable'],
    durite: ['durite', 'durites', 'tuyau', 'tube', 'pipe', 'hose', 'flexible'],
    collier: ['collier', 'attache', 'fixation', 'support', 'clamp', 'bracket'],
    vis: ['vis', 'boulon', 'ecrou', 'bolt', 'nut', 'screw', 'fixation'],
    clip: ['clip', 'agrafe', 'attache', 'fastener', 'rivet', 'fixation rapide'],

    // Directions/positions
    avant: ['avant', 'av', 'avent'],
    arriere: ['arriere', 'arrière', 'ar'],
    gauche: ['gauche', 'g', 'conducteur', 'gosh'],
    droite: ['droite', 'd', 'passager', 'droit'],

    // Autres positions
    superieur: ['superieur', 'supérieur'],
    inferieur: ['inferieur', 'inférieur'],
    interieur: ['interieur', 'intérieur'],
    exterieur: ['exterieur', 'extérieur']
  };

  private readonly typeWeights: Record<string, number> = {
    'filtre': 1.2,
    'huile': 1.2,
    'frein': 1.3,
    'plaquette': 1.3,
    'amortisseur': 1.5,
    'courroie': 1.25,
    'batterie': 1.2,
    'phare': 1.15,
    'lampe': 1.15,
    'joint': 1.1,
    'moteur': 1.1
  };

  // Real-time stock tracking - NO CACHE
  private cacheHits = 0;
  private cacheMisses = 0;

  // normalized synonym lookup for robust matching
  private normalizedSynonymLookup: Record<string, string> = {};
  
  constructor(private prisma: PrismaService) {
    this.buildNormalizedSynonymIndex();
  }

  async searchParts(query: string, vehicle?: any): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    console.log(`[SEARCH] Input query: "${query}"`);
    
    // Check for reference pattern FIRST (before normalization)
    // Enhanced patterns to catch various reference formats including bare part numbers
    const referencePatterns = [
      /^\s*([A-Z0-9]{8,}(?:-[A-Z0-9]+)*)\s*$/i,           // Exact match: 13780M62S00
      /^\s*([A-Z]{2}-\d{4,}-[A-Z0-9]{2,}(?:-[A-Z0-9]+)*)\s*$/i, // FA-17220-M68K00-INVALID
      /\b([A-Z0-9]{8,})\b/i,                              // Embedded: 13780M62S00
      /\b([A-Z]{2}-?\d{4,}-?[A-Z0-9]{2,}(?:-[A-Z0-9]+)*)\b/i, // Embedded: FA-17220-M68K00
      /\bref[eé]rence[\s:]*([A-Z0-9]{5,}[-_]?[A-Z0-9]*)\b/i // "référence 13780M62S00"
    ];
    
    for (const pattern of referencePatterns) {
      const refMatch = query.match(pattern);
      if (refMatch) {
        // Extract the actual reference (for "référence XXX" format, use group 1)
        const reference = refMatch[1] || refMatch[0];
        if (/[A-Z]/.test(reference) && /[0-9]/.test(reference) && reference.length >= 8) {
          console.log(`[SEARCH] Reference pattern detected: "${reference}"`);
          const refResults = await this.searchByReference(reference, vehicle);
          console.log(`[SEARCH] Reference search returned ${refResults.length} results`);
          // Always return reference search results (even if empty) to indicate reference was processed
          return refResults;
        }
      }
    }
    
    const tunisianNormalized = this.normalizeTunisian(query);
    const searchQuery = tunisianNormalized || query;
    const hasTunisianDialect = tunisianNormalized !== '';
    if (tunisianNormalized) {
      console.log(`[SEARCH] Tunisian detected, normalized to: "${tunisianNormalized}"`);
    }
    // Real-time: Always query database for fresh stock data
    console.log(`[SEARCH] Real-time query - no cache`);
    const normalized = this.normalize(searchQuery);
    console.log(`[SEARCH] Normalized query: "${normalized}"`);
    const rawTokens = this.tokenize(normalized);
    console.log(`[SEARCH] Raw tokens (>2 chars): [${rawTokens.join(', ')}]`);
    // preserve short tokens for position detection (e.g., 'av','ar')
    const positionTokens = this.tokenize(normalized, true);
    console.log(`[SEARCH] Position tokens (all): [${positionTokens.join(', ')}]`);
    const expandedTerms = this.expandWithSynonymsContextual(rawTokens, normalized);
    console.log(`[SEARCH] Expanded terms: [${expandedTerms.join(', ')}]`);
    const positionInfo = this.detectPositionRequirements(positionTokens, expandedTerms);
    console.log(`[SEARCH] Position info - avant: ${positionInfo.avant}, arrière: ${positionInfo.arriere}, gauche: ${positionInfo.gauche}, droite: ${positionInfo.droite}`);
    const searchConditions = this.buildSearchConditions(rawTokens, expandedTerms);
    
    // CRITICAL: Add vehicle model filter to WHERE condition
    let whereCondition: any;
    if (vehicle?.modele && searchConditions.length > 0) {
      const modelUpper = vehicle.modele.toUpperCase();
      whereCondition = {
        AND: [
          { OR: searchConditions },
          {
            OR: [
              ...SUZUKI_MODELS.map(model => ({ NOT: { designation: { contains: model } } })),
              { designation: { contains: modelUpper } }
            ]
          }
        ]
      };
    } else {
      whereCondition = searchConditions.length > 0 ? { OR: searchConditions } : {};
    }
    
    const parts = await this.prisma.piecesRechange.findMany({
      where: whereCondition,
      take: 100
    });
    console.log(`[SEARCH] Database returned ${parts.length} raw results`);
    if (parts.length > 0) {
      console.log(`[SEARCH] Sample DB results: ${parts.slice(0, 1).map(p => `"${p.designation}"`).join(', ')}`);
    }
    const mainPartType = rawTokens.find(token => Object.keys(this.typeWeights).includes(token));
    const context: SearchContext = {
      rawTokens,
      expandedTerms,
      positionInfo,
      mainPartType,
      originalQuery: query,
      normalizedQuery: normalized,
      hasTunisianDialect
    };
    const scored = parts.map(part => {
      const score = this.calculatePartScore(part, context);
      return { ...part, score };
    });
    
    let filtered = scored
      .filter(p => p.score >= this.getMinimumScore(context))
      .sort((a, b) => b.score - a.score || b.stock - a.stock);
    
    console.log(`[SEARCH] After scoring/filtering: ${filtered.length} qualified results (minScore: ${this.getMinimumScore(context)})`);
    const TOP_N = this.calculateOptimalResultLimit(context, filtered.length);
    const results = filtered.slice(0, TOP_N);
    console.log(`[SEARCH] Final results returned: ${results.length} (TOP_N: ${TOP_N})`);
    return results;
  }

  private detectPositionRequirements(rawTokens: string[], expandedTerms: string[]): PositionRequirements {
    const text = rawTokens.join(' ').toLowerCase();
    
    return {
      avant: this.hasPosition(expandedTerms, ['avant', 'av']) || 
             /(droite|gauche|d|g)[\s-]*(avant|av)|(avant|av)[\s-]*(droite|gauche|d|g)/i.test(text),
      arriere: this.hasPosition(expandedTerms, ['arriere', 'arrière', 'ar']) ||
               /(droite|gauche|d|g)[\s-]*(arriere|arrière|ar)|(arriere|arrière|ar)[\s-]*(droite|gauche|d|g)/i.test(text),
      gauche: this.hasPosition(expandedTerms, ['gauche', 'g', 'conducteur']) ||
              /(avant|av|arriere|arrière|ar)[\s-]*(gauche|g)|(gauche|g)[\s-]*(avant|av|arriere|arrière|ar)/i.test(text),
      droite: this.hasPosition(expandedTerms, ['droite', 'd', 'passager']) ||
              /(avant|av|arriere|arrière|ar)[\s-]*(droite|d)|(droite|d)[\s-]*(avant|av|arriere|arrière|ar)/i.test(text)
    };
  }

  private buildSearchConditions(rawTokens: string[], expandedTerms: string[]): any[] {
    const conditions: any[] = [];
    const allTerms = [...new Set([...rawTokens, ...expandedTerms])].filter(t => t && t.length > 0);
    
    if (allTerms.length === 0) {
      return [];
    }
    
    // CRITICAL: Expand position terms to include abbreviations
    const expandedWithAbbreviations = new Set(allTerms);
    allTerms.forEach(term => {
      if (term === 'avant') expandedWithAbbreviations.add('av');
      if (term === 'arriere' || term === 'arrière') expandedWithAbbreviations.add('ar');
      if (term === 'gauche') expandedWithAbbreviations.add('g');
      if (term === 'droite') expandedWithAbbreviations.add('d');
    });
    
    Array.from(expandedWithAbbreviations).slice(0, 10).forEach(term => {
      if (term.length >= 1) { // Allow single-char abbreviations like 'g', 'd', 'ar'
        conditions.push({
          OR: [
            { designation: { contains: term, mode: 'insensitive' } },
            { reference: { contains: term, mode: 'insensitive' } }
          ]
        });
      }
    });

    return conditions;
  }

  private getImportantTerms(terms: string[]): string[] {
    return terms
      .filter(term => term.length >= 3)
      .sort((a, b) => b.length - a.length)
      .slice(0, 8);
  }

  private calculatePartScore(part: any, context: SearchContext): number {
    let score = 0;
    score += this.calculateExactMatches(part, context);
    score += this.calculateContentMatches(part, context);
    score += this.calculatePositionMatches(part, context.positionInfo);
    score += this.calculateBusinessScores(part, context);
    return Math.max(0, score);
  }

  private calculateExactMatches(part: any, context: SearchContext): number {
    let score = 0;
    const ref = this.normalize(part.reference);
    
    if (ref === context.normalizedQuery) {
      score += 1000;
    } else if (ref.includes(context.normalizedQuery)) {
      score += 400;
    }
    
    return score;
  }

  private calculateContentMatches(part: any, context: SearchContext): number {
    let score = 0;
    const designation = this.normalize(part.designation);
    const ref = this.normalize(part.reference);
    
    // CRITICAL: Exact word match bonus - "air" in query should prioritize "AIR" over "HUILE"
    for (const token of context.rawTokens) {
      if (token.length >= 3) {
        const exactWordMatch = new RegExp(`\\b${token}\\b`, 'i').test(designation);
        if (exactWordMatch) {
          score += 1000; // Strong bonus for exact word match
        }
      }
    }
    
    // CRITICAL: Part type MUST match if specified in query
    if (context.mainPartType) {
      const partTypeVariants = this.synonyms[context.mainPartType] || [context.mainPartType];
      const hasPartType = partTypeVariants.some(variant => designation.includes(variant));
      
      if (hasPartType) {
        score += 2500;
      } else {
        score -= 4000; // Very strong penalty for wrong part type
      }
    }
    
    // CRITICAL: Exact part name match - BATTERIE must rank higher than SANGLE BATTERIE
    if (context.mainPartType) {
      const exactMatch = new RegExp(`\\b${context.mainPartType}\\b`, 'i').test(designation);
      const isAccessory = /support|sangle|cable|causse|fixation|adhesif|clip|vis|boulon|pare|boue/i.test(designation);
      const startsWithPart = designation.toLowerCase().startsWith(context.mainPartType);
      const isExactPartOnly = new RegExp(`^${context.mainPartType}\\s*$`, 'i').test(designation.trim());
      
      if (isExactPartOnly) {
        score += 5000; // Highest priority for exact part name only (e.g., "BATTERIE")
      } else if (startsWithPart && !isAccessory) {
        score += 3000; // Strong bonus for part name at start without accessory
      } else if (exactMatch && !isAccessory) {
        score += 2000; // Bonus for exact part (not accessory)
      } else if (isAccessory) {
        score -= 3500; // Very strong penalty for accessories
      }
    }
    
    if (ref === context.normalizedQuery) {
      score += 400;
    } else if (ref.includes(context.normalizedQuery)) {
      score += 200;
    }
    
    const allTokensPresent = context.rawTokens.every(token => 
      designation.includes(token) || ref.includes(token)
    );
    if (allTokensPresent) {
      score += 150;
    }
    
    if (context.mainPartType && designation.includes(context.mainPartType)) {
      for (const [type, weight] of Object.entries(this.typeWeights)) {
        if (designation.includes(type)) {
          const baseScore = type === context.mainPartType ? 100 : 10;
          score += baseScore * weight;
        }
      }
    }

    return score;
  }

  private calculatePositionMatches(part: any, positionInfo: PositionRequirements): number {
    let score = 0;
    const designation = part.designation.toLowerCase();
    
    const hasAvant = /\b(avant|av)\b/i.test(designation);
    const hasArriere = /\b(arriere|arrière|ar)\b/i.test(designation);
    const hasGauche = /\b(gauche|g|conducteur)\b/i.test(designation);
    const hasDroite = /\b(droite|d|passager)\b/i.test(designation);
    
    if (positionInfo.avant && hasAvant) score += 300;
    if (positionInfo.arriere && hasArriere) score += 300;
    if (positionInfo.gauche && hasGauche) score += 300;
    if (positionInfo.droite && hasDroite) score += 300;
    
    if (positionInfo.avant && hasArriere) score -= 500;
    if (positionInfo.arriere && hasAvant) score -= 500;
    if (positionInfo.gauche && hasDroite) score -= 500;
    if (positionInfo.droite && hasGauche) score -= 500;
    
    return score;
  }

  private calculateBusinessScores(part: any, context: SearchContext): number {
    let score = 0;
    if (part.stock > 0) score += 8;
    if (context.originalQuery.toLowerCase().includes('celerio') && 
        part.designation.toLowerCase().includes('celerio')) {
      score += 50;
    }
    return score;
  }

  private getMinimumScore(context: SearchContext): number {
    // CRITICAL: If query is ONLY a position word (avant/arrière/gauche/droite), lower threshold
    const isOnlyPosition = context.rawTokens.length === 1 && 
                          (context.positionInfo.avant || context.positionInfo.arriere || 
                           context.positionInfo.gauche || context.positionInfo.droite);
    
    if (isOnlyPosition) {
      return 0; // Allow any match when searching by position only
    }
    
    return context.hasTunisianDialect ? 5 : 8;
  }

  private calculateOptimalResultLimit(context: SearchContext, availableResults: number): number {
    const hasSpecificPosition = Object.values(context.positionInfo).some(Boolean);
    
    if (hasSpecificPosition && availableResults >= 5) {
      return 5;
    }
    if (availableResults >= 10) {
      return 10;
    }
    return Math.min(availableResults, 15);
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents: é→e, è→e, à→a
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Tokenize with an option to preserve short tokens (like 'av','ar') used for position detection.
  private tokenize(text: string, preserveShort = false): string[] {
    if (!text || text.trim().length === 0) return [];
    const parts = text.split(' ').map(p => p.trim()).filter(Boolean);
    if (preserveShort) return parts;
    return parts.filter(t => t.length > 2);
  }

  private expandWithSynonymsContextual(tokens: string[], originalQuery: string): string[] {
    const expanded = new Set<string>();
    
    tokens.forEach(token => {
      expanded.add(token);
      
      const primaryCategory = this.findPrimaryCategory(token);
      if (primaryCategory) {
        expanded.add(primaryCategory);
        
        const relevantSynonyms = this.synonyms[primaryCategory]
          .filter(syn => syn !== token)
          .slice(0, 1);
        
        relevantSynonyms.forEach(syn => expanded.add(syn));
      }
    });
    
    return Array.from(expanded);
  }

  private findPrimaryCategory(token: string): string | null {
    const normalizedToken = this.normalize(token);
    if (this.normalizedSynonymLookup[normalizedToken]) {
      return this.normalizedSynonymLookup[normalizedToken];
    }
    return null;
  }

  private normalizeTunisian(query: string): string {
    // MINIMAL FALLBACK - AI handles everything
    return applyTunisianFallback(query);
  }

  private buildNormalizedSynonymIndex(): void {
    try {
      for (const [category, synonyms] of Object.entries(this.synonyms)) {
        const normalizedCategory = this.normalize(category);
        this.normalizedSynonymLookup[normalizedCategory] = category;
        for (const syn of synonyms) {
          const norm = this.normalize(syn);
          if (norm && !this.normalizedSynonymLookup[norm]) {
            this.normalizedSynonymLookup[norm] = category;
          }
        }
      }
    } catch (err) {
      // defensive - keep the lookup empty on error
      this.normalizedSynonymLookup = {};
    }
  }

  private hasPosition(tokens: string[], positions: string[]): boolean {
    return tokens.some(t => positions.includes(t));
  }

  private filterByVehicleModel(products: any[], model: string): any[] {
    const modelUpper = model.toUpperCase();
    return products.filter(p => {
      const designation = p.designation.toUpperCase();
      const hasModelInName = designation.includes('CELERIO') || designation.includes('S-PRESSO') || 
                             designation.includes('SWIFT') || designation.includes('VITARA');
      return !hasModelInName || designation.includes(modelUpper);
    });
  }

  private async searchByReference(reference: string, vehicle?: any): Promise<any[]> {
    const cleanRef = reference.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const originalRef = reference.toUpperCase();
    
    console.log(`[SEARCH] Searching for reference: original="${originalRef}", clean="${cleanRef}"`);
    
    // Try exact matches first
    let results = await this.prisma.piecesRechange.findMany({
      where: {
        OR: [
          { reference: { equals: originalRef, mode: 'insensitive' } },
          { reference: { equals: cleanRef, mode: 'insensitive' } }
        ]
      },
      take: 5
    });
    
    // If no exact match, try partial matches
    if (results.length === 0) {
      let partialWhere: any = {
        OR: [
          { reference: { contains: cleanRef, mode: 'insensitive' } },
          { reference: { contains: originalRef, mode: 'insensitive' } }
        ]
      };
      
      // Add vehicle model filter
      if (vehicle?.modele) {
        const modelUpper = vehicle.modele.toUpperCase();
        partialWhere = {
          AND: [
            partialWhere,
            {
              OR: [
                ...SUZUKI_MODELS.map(model => ({ NOT: { designation: { contains: model } } })),
                { designation: { contains: modelUpper } }
              ]
            }
          ]
        };
      }
      
      results = await this.prisma.piecesRechange.findMany({
        where: partialWhere,
        take: 10
      });
    }
    
    console.log(`[SEARCH] Reference search found ${results.length} results`);
    if (results.length > 0) {
      console.log(`[SEARCH] First result: ${results[0].reference} - ${results[0].designation}`);
    }
    
    return results.map(part => ({ ...part, score: 1000 }));
  }

  getSearchStats(): {
    totalSynonyms: number;
  } {
    return {
      totalSynonyms: Object.keys(this.synonyms).length,
    };
  }
}