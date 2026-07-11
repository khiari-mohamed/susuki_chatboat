// src/chat/advanced-search
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SynonymsService } from '../synonyms/synonyms.service';
import axios from 'axios';

interface PositionRequirements {
  avant: boolean;
  arriere: boolean;
  gauche: boolean;
  droite: boolean;
}

interface SearchContext {
  rawTokens: string[];
  expandedTerms: string[];
  filteredQueryWords: string[];
  positionInfo: PositionRequirements;
  mainPartType: string | undefined;
  originalQuery: string;
  normalizedQuery: string;
  hasTunisianDialect: boolean;
  userTypedTokens: Set<string>; // tokens actually typed by the user (before expansion)
}

interface Part {
  designation: string;
  reference: string;
  stock: number;
  [key: string]: any;
}

@Injectable()
export class AdvancedSearchService implements OnModuleInit {
  private readonly logger = console;
  private readonly openaiKey: string;

  // Populated from SynonymsService on startup — replaces the old hardcoded synonyms object
  private synonymsMap: Record<string, string[]> = {};

  private readonly typeWeights: Record<string, number> = {
    'porte': 1.2, 'joint': 1.2, 'vitesse': 1.2, 'roulement': 1.3, 'culbuteur': 1.2, 'support': 1.3,
    'bielle': 1.2, 'vitre': 1.2, 'capteur': 1.2, 'pare': 1.0, 'synchro': 1.15, 'cache': 1.2,
    'sup': 1.15, 'bouchon': 1.15, 'radiateur': 1.3, 'charniere': 1.15, 'inf': 1.15, 'feu': 1.15,
    'boite': 1.15, 'huile': 1.15, 'aile': 1.2, 'glace': 1.15, 'moteur': 1.2, 'serrure': 1.15,
    'frein': 1.5, 'agrafe': 1.2, 'agrafes': 1.2, 'agraffe': 1.3, 'agraffes': 1.3, 'agraphe': 1.3,
    'agraphes': 1.3, 'roue': 1.1, 'capot': 1.2, 'baguette': 1.1, 'choc': 1.1, 'garniture': 1.1,
    'tableau': 1.1, 'bord': 1.1, 'toit': 1.1, 'arbre': 1.1, 'soupape': 1.1, 'essuie': 1.1,
    'cable': 1.1, 'circlip': 1.1, 'pompe': 1.2, 'panneau': 1.1, 'stdt': 1.1, 'amortisseur': 1.5,
    'bas': 1.1, 'filtre': 1.3, 'embrayage': 1.3, 'carburant': 1.1, 'montant': 1.1, 'ust': 1.1,
    'traverse': 1.2, 'int': 1.1, 'air': 1.1, 'malle': 1.1, 'corps': 1.1, 'dhuile': 1.1,
    'reservoir': 1.1, 'deau': 1.1, 'retroviseur': 1.5, 'plaque': 1.1, 'abs': 1.1, 'batterie': 1.3,
    'moyeu': 1.1, 'durite': 1.4, 'coussinet': 1.1, 'extension': 1.1, 'roulment': 1.1, 'ressort': 1.1,
    'siege': 1.1, 'plancher': 1.1, 'tige': 1.1, 'clim': 1.1, 'eau': 1.1, 'carter': 1.2, 'cle': 1.1,
    'longeron': 1.1, 'moustache': 1.1, 'adhesif': 1.1, 'volant': 1.2, 'anneau': 1.1, 'contre': 1.1,
    'appareil': 1.8, 'monte': 1.1, 'balai': 1.1, 'caisse': 1.1, 'thermostat': 1.1, 'bouton': 1.4,
    'direction': 1.1, 'pression': 1.1, 'central': 1.1, 'haute': 1.1, 'disque': 1.5, 'ecrou': 1.1,
    'flexible': 1.1, 'jeu': 1.1, 'echappement': 1.2, 'passage': 1.1, 'pignonarbre': 1.1,
    'dentree': 1.1, 'poignee': 1.1, 'renfort': 1.1, 'relais': 1.1, 'sigle': 1.1, 'tete': 1.1,
    'para': 1.1, 'moulure': 1.1, 'bague': 1.1, 'boulon': 1.1, 'remorquage': 1.2, 'bras': 1.3,
    'calculateur': 1.2, 'lampe': 1.2, 'ensemble': 1.1, 'leve': 1.1, 'caoutchouc': 1.1,
    'collecteur': 1.1, 'admission': 1.1, 'ceinture': 1.1, 'synchroniseur': 1.1, 'lateral': 1.1,
    'condenseur': 1.1, 'remplissage': 1.1, 'courroie': 1.3, 'faisceau': 1.1, 'complet': 1.1,
    'gardeboue': 1.1, 'tablier': 1.1, 'interieur': 1.1, 'goupille': 1.1, 'jante': 1.1,
    'manchon': 1.1, 'brise': 1.1, 'boue': 1.1, 'differentiel': 1.1, 'rail': 1.1, 'absorbeur': 1.1,
    'rondelle': 1.1, 'soleil': 1.1, 'bag': 1.1, 'alimentateur': 1.1, 'antenne': 1.1,
    'transmission': 1.1, 'dallumage': 1.1, 'boitier': 1.1, 'douille': 1.1, 'vidange': 1.1,
    'ventilateur': 1.1, 'butee': 1.1, 'stationnement': 1.1, 'trappe': 1.1, 'airbag': 1.1,
    'troisieme': 1.1, 'stop': 1.1, 'calandre': 1.2, 'cale': 1.1, 'calle': 1.1, 'poigne': 1.1,
    'position': 1.1, 'vilebrequin': 1.1, 'dembrayage': 1.1, 'frenage': 1.1, 'dair': 1.1,
    'cardan': 1.3, 'catadioptre': 1.1, 'injecteur': 1.2, 'darbre': 1.1, 'collier': 1.1,
    'compresseur': 1.1, 'conduite': 1.1, 'papillon': 1.1, 'couvercle': 1.1, 'cremaillere': 1.3,
    'cric': 1.1, 'culasse': 1.1, 'durit': 1.1, 'seuil': 1.1, 'etrier': 1.3, 'cote': 1.1,
    'canister': 1.1, 'fourchette': 1.1, 'fusee': 1.1, 'qtr': 1.1, 'goujon': 1.1, 'chaine': 1.1,
    'distribution': 1.1, 'piston': 1.1, 'acier': 1.1, 'interrieur': 1.1, 'dechappement': 1.1,
    'torique': 1.1, 'eme': 1.1, 'synchronisation': 1.1, 'membre': 1.1, 'miroire': 1.1,
    'module': 1.1, 'basse': 1.1, 'optique': 1.1, 'assemblage': 1.1, 'secour': 1.1, 'vase': 1.1,
    'poulie': 1.1, 'tendeur': 1.1, 'demarreur': 1.2, 'section': 1.1, 'sonde': 1.1, 'lambda': 1.1,
    'soufflet': 1.1, 'tocs': 1.2, 'toc': 1.2, 'tolle': 1.1, 'triangle': 1.3, 'tube': 1.1,
    'tuyau': 1.2, 'vis': 1.1, 'clip': 1.1, 'plaquette': 1.5, 'coffre': 1.1, 'passager': 1.1,
    'alternateur': 1.2, 'assiette': 1.1, 'attache': 1.1, 'spirale': 1.1, 'droit': 1.1,
    'base': 1.1, 'berceau': 1.1, 'bloc': 1.1, 'bobine': 1.1, 'body': 1.1, 'socket': 1.1,
    'outils': 1.1, 'bouchant': 1.1, 'purge': 1.1, 'suspension': 1.3, 'bougie': 1.2,
    'detresse': 1.1, 'buse': 1.1, 'glasse': 1.1, 'butte': 1.1, 'selecteur': 1.1, 'fusible': 1.1,
    'poussiere': 1.1, 'usb': 1.1, 'epi': 1.1, 'caprteur': 1.1, 'camme': 1.1, 'recule': 1.1,
    'marche': 1.1, 'gaz': 1.1, 'mettre': 1.1, 'sortie': 1.1, 'evaporateur': 1.1, 'temp': 1.1,
    'refroidissement': 1.1, 'temperature': 1.1, 'causse': 1.1, 'cerclip': 1.1, 'comptage': 1.1,
    'circlips': 1.1, 'clavette': 1.1, 'demilune': 1.1, 'queue': 1.1, 'clignotant': 1.1,
    'colone': 1.1, 'dinstrument': 1.1, 'commande': 1.1, 'commodo': 1.1, 'comodo': 1.1,
    'lumiere': 1.1, 'contacteur': 1.1, 'controleur': 1.1, 'parking': 1.1, 'climatiseur': 1.1,
    'colonne': 1.1, 'recul': 1.1, 'deflecteur': 1.1, 'enjoliveur': 1.1, 'otr': 1.1, 'mbr': 1.1,
    'lwr': 1.1, 'actuateur': 1.1, 'feutre': 1.1, 'garnitrur': 1.1, 'bochon': 1.1, 'ctr': 1.1,
    'gauge': 1.1, 'essence': 1.1, 'gaugon': 1.1, 'grille': 1.1, 'guide': 1.1, 'jauge': 1.1,
    'niveau': 1.1, 'goupilles': 1.1, 'glissantes': 1.1, 'machoires': 1.1, 'plaquettes': 1.1,
    'segments': 1.1, 'soupappe': 1.1, 'echappment': 1.1, 'corp': 1.1, 'interieure': 1.1,
    'leche': 1.1, 'lecheur': 1.1, 'tampon': 1.1, 'jupe': 1.1, 'kasarole': 1.1, 'kasaroule': 1.1,
    'klaxon': 1.1, 'loquet': 1.1, 'lunette': 1.1, 'manette': 1.1, 'marmite': 1.1, 'eps': 1.1,
    'monogramme': 1.1, 'presso': 1.1, 'centrale': 1.1, 'feux': 1.1, 'rouge': 1.1, 'bour': 1.1,
    'villebrequin': 1.1, 'vilbrequin': 1.1, 'ard': 1.1, 'pin': 1.1, 'plage': 1.1, 'planche': 1.1,
    'claison': 1.1, 'poste': 1.1, 'radio': 1.1, 'protecteur': 1.1, 'chauffage': 1.1,
    'retenue': 1.1, 'revettment': 1.1, 'ring': 1.1, 'rotule': 1.3, 'axial': 1.1, 'usust': 1.1,
    'ustwhite': 1.1, 'ustblanc': 1.1, 'diff': 1.1, 'manivelle': 1.1, 'damortisseur': 1.1,
    'sangle': 1.1, 'laterale': 1.1, 'sensor': 1.1, 'assyclutch': 1.1, 'speed': 1.1, 'male': 1.1,
    'dammortisseur': 1.1, 'suzuki': 1.1, 'supp': 1.1, 'actionneur': 1.1, 'crochet': 1.1,
    'inferieur': 1.1, 'tambour': 1.3, 'frien': 1.1, 'tensionneur': 1.1, 'tiran': 1.2,
    'tirant': 1.2, 'train': 1.2, 'valve': 1.1, 'longerons': 1.1, 'boudain': 1.1, 'pedale': 1.1,
    'plateau': 1.3, 'maitre': 1.3, 'cylindre': 1.3, 'std': 1.2, 'us': 1.2, 'white': 1.2, 'blanc': 1.2,
  };

  private static readonly SCORE_REJECTION = -1_000_000;
  private static readonly SCORE_EXACT_FULL = 100_000;
  private static readonly SCORE_EXACT_REFERENCE = 1_000;
  private static readonly SCORE_REFERENCE_CONTAINS = 400;
  private static readonly SCORE_MAIN_TYPE_PRESENT = 5_000;
  private static readonly SCORE_ALL_WORDS_MATCH = 80_000;
  private static readonly SCORE_NUMERIC_EXACT = 50_000;

  private aiSegmentationAvailable = true;
  private aiSegmentationFailCount = 0;
  private static readonly AI_FAIL_THRESHOLD = 3;

  // Normalized synonym lookup — populated from SynonymsService in onModuleInit
  private normalizedSynonymLookup: Record<string, string> = {};
  private fuzzyMatchCache: Map<string, string[]> = new Map();

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private synonymsService: SynonymsService,
  ) {
    this.openaiKey = this.config.get<string>('OPENAI_API_KEY') || '';
    // NOTE: index is built in onModuleInit after SynonymsService has loaded from DB
  }

  async onModuleInit(): Promise<void> {
    // SynonymsService.onModuleInit() has already completed (NestJS resolves deps first)
    this.synonymsMap = this.synonymsService.getCategoryVariants();
    this.normalizedSynonymLookup = this.synonymsService.getNormalizedLookup();
    this.logger.log(
      `[AdvancedSearchService] Synonym index ready — ${Object.keys(this.synonymsMap).length} categories, ${Object.keys(this.normalizedSynonymLookup).length} normalized tokens`,
    );
  }

  async searchParts(query: string, vehicle?: any): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    this.logger.log(`[SEARCH] Input query: "${query}"`);

    const referencePatterns = [
      /^\s*([A-Z0-9]{8,}(?:-[A-Z0-9]+)*)\s*$/i,
      /^\s*([A-Z]{2}-\d{4,}-[A-Z0-9]{2,}(?:-[A-Z0-9]+)*)\s*$/i,
      /\b([A-Z0-9]{8,})\b/i,
      /\b([A-Z]{2}-?\d{4,}-?[A-Z0-9]{2,}(?:-[A-Z0-9]+)*)\b/i,
      /\bref[eé]rence[\s:]*([A-Z0-9]{5,}[-_]?[A-Z0-9]*)\b/i,
    ];

    for (const pattern of referencePatterns) {
      const refMatch = query.match(pattern);
      if (refMatch) {
        const reference = refMatch[1] || refMatch[0];
        // Either alphanumeric with at least one letter + one digit, or purely numeric with min 8 digits
const isAlphaNumericRef = /[A-Z]/.test(reference) && /[0-9]/.test(reference) && reference.length >= 8;
const isNumericRef = /^\d{8,}$/.test(reference);  // all digits, 8+ chars

if ((isAlphaNumericRef || isNumericRef) && reference.length >= 8) {
          this.logger.log(`[SEARCH] Reference pattern detected: "${reference}"`);
          const refResults = await this.searchByReference(reference, vehicle);
          this.logger.log(`[SEARCH] Reference search returned ${refResults.length} results`);
          return refResults;
        }
      }
    }

    const tunisianNormalized = this.normalizeTunisian(query);
    // Reject Tunisian normalization if it produces duplicate tokens
    // (e.g. "disque frein" → "disque de frein frein" is a false positive)
    const tunisianValid = (() => {
      if (!tunisianNormalized) return false;
      const originalTokens = this.normalize(query).split(' ').filter(Boolean);
      const normalizedTokens = this.normalize(tunisianNormalized).split(' ').filter(Boolean);
      // If every original token already appears in the normalized synonym lookup, skip Tunisian expansion
      const allAlreadyKnown = originalTokens.every(
        (t) => this.normalizedSynonymLookup[t] !== undefined || Object.keys(this.typeWeights).includes(t),
      );
      if (allAlreadyKnown) return false;
      // If normalization produces duplicate meaningful tokens, reject it
      const seen = new Set<string>();
      for (const t of normalizedTokens) {
        if (t.length >= 4 && seen.has(t)) return false;
        seen.add(t);
      }
      return true;
    })();
    const searchQuery = tunisianValid ? tunisianNormalized : query;
    const hasTunisianDialect = tunisianValid;
    if (tunisianValid) {
      this.logger.log(`[SEARCH] Tunisian detected, normalized to: "${tunisianNormalized}"`);
    }
    this.logger.log(`[SEARCH] Real-time query - no cache`);
    const normalized = this.normalize(searchQuery);
    this.logger.log(`[SEARCH] Normalized query: "${normalized}"`);

    const allTokens = await this.tokenize(normalized, true);
    const rawTokens = allTokens.filter((t) => t.length > 2);
    this.logger.log(`[SEARCH] All tokens: [${allTokens.join(', ')}]`);
    this.logger.log(`[SEARCH] Raw tokens (>2 chars): [${rawTokens.join(', ')}]`);

    const expandedTerms = this.expandWithSynonymsContextual(rawTokens, normalized);
    this.logger.log(`[SEARCH] Expanded terms: [${expandedTerms.join(', ')}]`);
    const positionInfo = this.detectPositionRequirements(allTokens, expandedTerms);
    this.logger.log(
      `[SEARCH] Position info - avant: ${positionInfo.avant}, arrière: ${positionInfo.arriere}, gauche: ${positionInfo.gauche}, droite: ${positionInfo.droite}`,
    );
    const searchConditions = this.buildSearchConditions(rawTokens, expandedTerms);

    const whereCondition: any = searchConditions.length > 0 ? { OR: searchConditions } : {};

    const parts = await this.prisma.part.findMany({
      where: whereCondition,
      include: {
        stock: { select: { statut: true } },
        fitments: { select: { modelName: true, typeCode: true } },
      },
      take: 500,
    });
    this.logger.log(`[SEARCH] Database returned ${parts.length} raw results`);
    if (parts.length > 0) {
      this.logger.log(
        `[SEARCH] Sample DB results: ${parts.slice(0, 1).map((p: any) => `"${p.designation}"`).join(', ')}`,
      );
    }

    const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd'];
    const correctedTokens = expandedTerms.filter((t) => !positionWords.includes(t));

    const accessoryWords = [
      'support', 'sangle', 'cable', 'causse', 'fixation', 'adhesif', 'clip', 'vis', 'boulon',
      'pare', 'boue', 'cache', 'baguette', 'joint', 'catadioptre', 'bouchon', 'couvercle', 'garniture',
    ];
    const firstToken = correctedTokens.find((t) => t.length >= 3 && !positionWords.includes(t));
    const isFirstTokenAccessory = firstToken && accessoryWords.includes(firstToken);

    const mainPartType = correctedTokens
      .filter((token) => Object.keys(this.typeWeights).includes(token) && !positionWords.includes(token))
      .sort((a, b) => {
        if (isFirstTokenAccessory && (a === firstToken || b === firstToken)) {
          return a === firstToken ? -1 : 1;
        }
        const weightA = this.typeWeights[a] || 1.0;
        const weightB = this.typeWeights[b] || 1.0;
        if (weightB !== weightA) return weightB - weightA;
        return b.length - a.length;
      })[0];
    this.logger.log(
      `[SEARCH] Main part type detected: "${mainPartType || 'NONE'}" from tokens: [${rawTokens.join(', ')}]`,
    );

    const queryLower = query.toLowerCase();
    let forcedMainPartType = mainPartType;
    if (queryLower.includes('monte glace') || queryLower.includes('monte-glace')) {
      forcedMainPartType = 'appareil';
      this.logger.log(`[SEARCH] Forced main part type to "appareil" due to "monte glace"`);
    }

    // Computed ONCE — reused inside calculateContentMatches for every part
    const filteredQueryWords = expandedTerms.filter((w) => {
      if (w.length < 3) return false;
      for (const [category, syns] of Object.entries(this.synonymsMap)) {
        if (syns.includes(w) && expandedTerms.includes(category) && w !== category) {
          return false;
        }
      }
      return true;
    });

    const context: SearchContext = {
      rawTokens: allTokens,
      expandedTerms,
      filteredQueryWords,
      positionInfo,
      mainPartType: forcedMainPartType,
      originalQuery: query,
      normalizedQuery: normalized,
      hasTunisianDialect,
      // rawTokens = tokens that survived stop-word removal and length filter (>2 chars).
      // These represent the user's actual intent words — expansion adds to expandedTerms but NOT here.
      userTypedTokens: new Set(rawTokens),
    };

    const scored = parts.map((part) => ({
      ...part,
      score: this.calculatePartScore(part, context),
    }));

    const filtered = scored.filter((p) => {
      const designation = this.normalize(p.designation);
      const queryNorm = context.normalizedQuery;

      const conflicts = [
        { query: 'maitre', wrong: 'mettre' },
        { query: 'cable', wrong: 'calle' },
      ];

      for (const conflict of conflicts) {
        if (
          queryNorm.includes(conflict.query) &&
          designation.includes(conflict.wrong) &&
          !designation.includes(conflict.query)
        ) {
          return false;
        }
      }
      return true;
    });

    let results = filtered
      .filter((p) => p.score >= this.getMinimumScore(context))
      .sort((a, b) => b.score - a.score);

    this.logger.log(
      `[SEARCH] After scoring/filtering: ${results.length} qualified results (minScore: ${this.getMinimumScore(context)})`,
    );
    if (results.length > 0) {
      this.logger.log(
        `[SEARCH] Top 3 scores: ${results.slice(0, 3).map((p: any) => `"${p.designation}" (${p.score})`).join(', ')}`,
      );
    }

    const TOP_N = this.calculateOptimalResultLimit(context, results.length);
    const finalResults = results.slice(0, TOP_N);
    this.logger.log(`[SEARCH] Final results returned: ${finalResults.length} (TOP_N: ${TOP_N})`);
    return finalResults;
  }

  private detectPositionRequirements(allTokens: string[], expandedTerms: string[]): PositionRequirements {
    const text = allTokens.join(' ').toLowerCase();
    
    // Check for explicit position tokens (exact matches only)
    const hasAvToken = allTokens.some((t) => t === 'av');
    const hasArToken = allTokens.some((t) => t === 'ar');
    const hasGToken = allTokens.some((t) => t === 'g' && !allTokens.includes('gauche'));
    const hasDToken = allTokens.some((t) => t === 'd' && !allTokens.includes('droite') && !allTokens.includes('droit'));
    
    // Check for full position words
    const hasAvantWord = allTokens.some((t) => t === 'avant');
    const hasArriereWord = allTokens.some((t) => t === 'arriere' || t === 'arrière');
    const hasGaucheWord = allTokens.some((t) => t === 'gauche');
    const hasDroiteWord = allTokens.some((t) => t === 'droite' || t === 'droit');

    return {
      avant: hasAvToken || hasAvantWord || this.hasPosition(expandedTerms, ['avant', 'av']),
      arriere: hasArToken || hasArriereWord || this.hasPosition(expandedTerms, ['arriere', 'arrière', 'ar']),
      gauche: hasGToken || hasGaucheWord || this.hasPosition(expandedTerms, ['gauche', 'conducteur']),
      droite: hasDToken || hasDroiteWord || this.hasPosition(expandedTerms, ['droite', 'passager']),
    };
  }

  private buildSearchConditions(rawTokens: string[], expandedTerms: string[]): any[] {
    const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd', 'sup', 'inf'];
    const meaningfulTerms = expandedTerms.filter((t) => t.length >= 3 && !positionWords.includes(t));
    if (meaningfulTerms.length === 0) return [];

    return meaningfulTerms.flatMap((term) => [
      { designation: { contains: term, mode: 'insensitive' } },
      { reference: { contains: term, mode: 'insensitive' } },
    ]);
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
      score += AdvancedSearchService.SCORE_EXACT_REFERENCE;
    } else if (ref.includes(context.normalizedQuery)) {
      score += AdvancedSearchService.SCORE_REFERENCE_CONTAINS;
    }
    return score;
  }

  private calculateContentMatches(part: any, context: SearchContext): number {
    let score = 0;
    const designation = this.normalize(part.designation);
    const designationNormalized = this.normalizeForDB(part.designation);
    const queryNormalized = this.normalizeForDB(context.originalQuery);

    if (designationNormalized === queryNormalized) {
      return AdvancedSearchService.SCORE_EXACT_FULL;
    }

    const queryWords = context.filteredQueryWords;
    const designationWords = designation.split(' ').filter((w) => w.length >= 1);
    // userTypedTokens = only the tokens the user actually typed (not synonym-expanded additions)
    const userTypedTokens = context.userTypedTokens;

    // ── MAIN PART vs ACCESSORY FILTERING ──────────────────────────────────────
    const accessoryWords = ['sangle', 'support', 'causse', 'clip', 'jeu', 'kit', 'ensemble', 'set', 'boitier', 'cache', 'couvercle', 'durite', 'tuyau', 'flexible', 'cable', 'câble', 'joint', 'bouchon', 'vis', 'boulon', 'ecrou', 'agrafe', 'agraffe', 'cercle', 'agraffe'];
    const mainPartWords = ['radiateur', 'moteur', 'alternateur', 'demarreur', 'batterie', 'phare', 'feu', 'porte', 'capot', 'aile', 'retroviseur', 'amortisseur', 'disque', 'plaquette', 'filtre', 'pompe', 'compresseur', 'etrier', 'tambour', 'volant', 'siege', 'tableau'];
    
    const userAskedForAccessory = queryWords.some((qw) => accessoryWords.includes(qw));
    const userAskedForMainPart = queryWords.some((qw) => mainPartWords.includes(qw));
    const hasAccessoryWord = accessoryWords.some((acc) => designationWords.includes(acc));
    const hasMainPartWord = mainPartWords.some((main) => designationWords.includes(main));

    // RULE 1: User asked for accessory → BOOST accessories
    if (userAskedForAccessory && hasAccessoryWord) {
      score += 50000; // Strong boost for matching accessory
    } else if (userAskedForAccessory && !hasAccessoryWord) {
      score -= 50000; // Penalize non-accessories when user wants accessory
    }
    
    // RULE 2: User asked for main part → PENALIZE accessories heavily
    if (userAskedForMainPart && !userAskedForAccessory) {
      if (hasAccessoryWord && hasMainPartWord) {
        // Compound part like "DURITE DE RADIATEUR" when user asked "radiateur"
        // Allow it but score much lower than pure main parts
        score -= 30000;
      } else if (hasAccessoryWord && !hasMainPartWord) {
        // Pure accessory like "SUPPORT" when user asked "radiateur"
        return AdvancedSearchService.SCORE_REJECTION;
      } else if (!hasAccessoryWord && hasMainPartWord) {
        // Pure main part like "RADIATEUR" when user asked "radiateur"
        score += 50000; // Strong boost for pure main parts
      }
    }
    
    const meaningfulQueryWords = queryWords.filter(
      (w) =>
        w.length >= 3 &&
        !['avant', 'arriere', 'gauche', 'droite', 'sup', 'inf', 'para', 'pour', 'avec', 'sans', 'tout', 'tous'].includes(w),
    );

    // Only require matches for words that originated from the user query (not added by synonym expansion)
    const mandatoryWords = meaningfulQueryWords.filter((w) => userTypedTokens.has(w));
    const optionalWords = meaningfulQueryWords.filter((w) => !userTypedTokens.has(w));

    const positionMap: Record<string, string[]> = {
      avant: ['avant', 'av'],
      av: ['avant', 'av'],
      arriere: ['arriere', 'ar'],
      ar: ['arriere', 'ar'],
      gauche: ['gauche', 'g'],
      g: ['gauche', 'g'],
      droite: ['droite', 'd', 'droit'],
      d: ['droite', 'd', 'droit'],
      droit: ['droite', 'd', 'droit'],
      superieur: ['superieur', 'sup'],
      sup: ['superieur', 'sup'],
      inferieur: ['inferieur', 'inf'],
      inf: ['inferieur', 'inf'],
      de: ['de'],
    };

    const wordMatches = (qw: string, dw: string): boolean => {
      if (qw === dw) return true;
      if (dw.startsWith(qw + ' ') || dw.endsWith(' ' + qw) || dw.includes(' ' + qw + ' ')) return true;
      if (dw.startsWith(qw) || qw.startsWith(dw)) return true;
      if (qw.endsWith('s') && dw === qw.slice(0, -1)) return true;
      if (dw.endsWith('s') && qw === dw.slice(0, -1)) return true;
      if (qw.endsWith('es') && dw === qw.slice(0, -2)) return true;
      if (dw.endsWith('es') && qw === dw.slice(0, -2)) return true;
      if (qw === dw + 's' || dw === qw + 's') return true;
      if (qw === dw + 'es' || dw === qw + 'es') return true;
      if (this.levenshtein(qw, dw) <= 2) return true;
      return false;
    };

    for (const qw of mandatoryWords) {
      const hasExactMatch = designationWords.some((dw) => dw === qw);
      const hasPluralMatch = designationWords.some(
        (dw) => dw === qw + 's' || dw === qw + 'es' || qw === dw + 's' || qw === dw + 'es',
      );
      const hasFuzzyMatch = designationWords.some((dw) => this.levenshtein(qw, dw) <= 1);
      if (!hasExactMatch && !hasPluralMatch && !hasFuzzyMatch) {
        return AdvancedSearchService.SCORE_REJECTION;
      }
    }

    if (context.mainPartType) {
      const partTypeVariants = this.synonymsMap[context.mainPartType] || [context.mainPartType];
      const hasMainType = partTypeVariants.some((v) => designationWords.some((dw) => wordMatches(v, dw)));
      if (!hasMainType) {
        return AdvancedSearchService.SCORE_REJECTION;
      }
      score += AdvancedSearchService.SCORE_MAIN_TYPE_PRESENT;
    }

    const queryNumbers = context.originalQuery.match(/\d+(?:[.,]\d+)?/g) || [];
    const designationNumbers = part.designation.match(/\d+(?:[.,]\d+)?/g) || [];

    if (queryNumbers.length > 0 && designationNumbers.length > 0) {
      const hasNumericMatch = queryNumbers.some((qn) =>
        designationNumbers.some((dn) => {
          const qNum = parseFloat(qn.replace(',', '.'));
          const dNum = parseFloat(dn.replace(',', '.'));
          const qNumAdjusted = qNum >= 100 ? qNum / 100 : qNum;
          return Math.abs(qNumAdjusted - dNum) < 0.01;
        }),
      );
      if (!hasNumericMatch) {
        return AdvancedSearchService.SCORE_REJECTION;
      }
      const exactBonus =
        queryNumbers.filter((qn) =>
          designationNumbers.some((dn) => {
            const qNum = parseFloat(qn.replace(',', '.'));
            const dNum = parseFloat(dn.replace(',', '.'));
            const qNumAdjusted = qNum >= 100 ? qNum / 100 : qNum;
            return Math.abs(qNumAdjusted - dNum) < 0.01;
          }),
        ).length * AdvancedSearchService.SCORE_NUMERIC_EXACT;
      score += exactBonus;
    }

    let matchCount = 0;
    const matchedWords = new Set<string>();

    queryWords.forEach((qw) => {
      const variants = positionMap[qw] || [qw];
      const withPlural = [...variants, ...variants.map((v) => v + 's'), ...variants.map((v) => v + 'es')];
      const fuzzyMatches = this.findFuzzyMatches(qw);
      const allVariants = [...withPlural, ...fuzzyMatches];
      if (allVariants.some((v) => designationWords.some((dw) => wordMatches(v, dw)))) {
        matchCount++;
        matchedWords.add(qw);
      }
    });

    if (matchCount === 0) {
      return AdvancedSearchService.SCORE_REJECTION;
    }

    const importantQueryWords = queryWords.filter(
      (w) =>
        w.length > 2 &&
        !['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd', 'sup', 'inf', 'para', 'de'].includes(w),
    );
    // Only enforce important words that were present in the original user query
    const importantMandatory = importantQueryWords.filter((w) => userTypedTokens.has(w));
    const missingImportantWords = importantMandatory.filter((w) => !matchedWords.has(w));
    if (missingImportantWords.length > 0) {
      const hasFuzzyMatch = missingImportantWords.every((mw) => {
        const fuzzy = this.findFuzzyMatches(mw);
        return fuzzy.some((f) => designationWords.some((dw) => wordMatches(f, dw)));
      });
      if (!hasFuzzyMatch) {
        return AdvancedSearchService.SCORE_REJECTION;
      }
    }

    for (const qw of queryWords) {
      const hasDoubleF = qw.includes('ff');
      const hasDoubleP = qw.includes('pp');
      const hasDoubleL = qw.includes('ll');
      if (hasDoubleF || hasDoubleP || hasDoubleL) {
        const designationHasDoubleF = designationWords.some((dw) => dw.includes('ff'));
        const designationHasDoubleP = designationWords.some((dw) => dw.includes('pp'));
        const designationHasDoubleL = designationWords.some((dw) => dw.includes('ll'));
        if (hasDoubleF && !designationHasDoubleF) return AdvancedSearchService.SCORE_REJECTION;
        if (hasDoubleP && !designationHasDoubleP) return AdvancedSearchService.SCORE_REJECTION;
        if (hasDoubleL && !designationHasDoubleL) return AdvancedSearchService.SCORE_REJECTION;
      }
    }

    if (matchCount === queryWords.length && designationWords.length === queryWords.length) {
      return AdvancedSearchService.SCORE_EXACT_FULL;
    }
    if (matchCount === queryWords.length) {
      score += AdvancedSearchService.SCORE_ALL_WORDS_MATCH;
    }

    const extraWords = designationWords.length - queryWords.length;
    score += 50000 - extraWords * 2000;
    return score;
  }

  private calculatePositionMatches(part: any, positionInfo: PositionRequirements): number {
    let score = 0;
    const designationTokens = this.normalize(part.designation).split(/[\s-]+/).filter(Boolean);
    const hasAvant = this.hasAnyToken(designationTokens, ['avant', 'av', 'front', 'fr', 'avg', 'avd']);
    const hasArriere = this.hasAnyToken(designationTokens, ['arriere', 'ar', 'rear', 'rr', 'arg', 'ard']);
    const hasGauche = this.hasAnyToken(designationTokens, ['gauche', 'g', 'conducteur', 'left', 'lh', 'avg', 'arg']);
    const hasDroite = this.hasAnyToken(designationTokens, ['droite', 'd', 'passager', 'droit', 'right', 'rh', 'avd', 'ard']);

    if (positionInfo.avant && !hasAvant && hasArriere) return -100000;
    if (positionInfo.arriere && !hasArriere && hasAvant) return -100000;
    if (positionInfo.gauche && !hasGauche && hasDroite) return -100000;
    if (positionInfo.droite && !hasDroite && hasGauche) return -100000;

    if (positionInfo.avant && hasAvant) score += 500;
    if (positionInfo.arriere && hasArriere) score += 500;
    if (positionInfo.gauche && hasGauche) score += 500;
    if (positionInfo.droite && hasDroite) score += 500;

    if (positionInfo.avant && hasArriere) score -= 100000;
    if (positionInfo.arriere && hasAvant) score -= 100000;
    if (positionInfo.gauche && hasDroite) score -= 100000;
    if (positionInfo.droite && hasGauche) score -= 100000;

    return score;
  }

  private hasAnyToken(tokens: string[], expected: string[]): boolean {
    return expected.some(token => tokens.includes(token));
  }

  private calculateBusinessScores(part: any, context: SearchContext): number {
    let score = 0;
    if (part.stock?.statut === 'Disponible') score += 8;
    if (
      context.originalQuery.toLowerCase().includes('celerio') &&
      part.designation.toLowerCase().includes('celerio')
    ) {
      score += 50;
    }
    return score;
  }

  private getMinimumScore(context: SearchContext): number {
    return 0;
  }

  private calculateOptimalResultLimit(context: SearchContext, availableResults: number): number {
    return Math.min(availableResults, 10);
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

  private normalizeForDB(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[(),:'\.\-]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  private async tokenize(text: string, preserveShort = false): Promise<string[]> {
    if (!text || text.trim().length === 0) return [];

    if (!text.includes(' ') && text.length > 6) {
      const segmented = await this.segmentConcatenatedQuery(text);
      if (segmented.length > 1) {
        this.logger.log(`[TOKENIZE] Segmented "${text}" → [${segmented.join(', ')}]`);
        text = segmented.join(' ');
      }
    }

    let parts = text.split(' ').map(p => p.trim()).filter(Boolean);
    // 🆕 Remove database‑driven stop‑words
    const stopWords = this.synonymsService.getStopWords();
    parts = parts.filter(token => !stopWords.has(token));

    if (preserveShort) return parts;
    return parts.filter(t => t.length > 2);
  }

  private async segmentConcatenatedQuery(text: string): Promise<string[]> {
    if (!this.aiSegmentationAvailable) {
      return this.fallbackSegmentation(text);
    }
    try {
      const prompt = `You are a car parts query parser. Segment this concatenated French car parts query into separate words.

Rules:
- Recognize car part names: adhesif, porte, aile, capot, phare, filtre, plaquette, disque, amortisseur, etc.
- Recognize positions: avant/av, arriere/ar, gauche/g, droite/d, superieur/sup, inferieur/inf
- Return ONLY the segmented words separated by spaces
- If already segmented, return as-is

Query: "${text}"

Segmented:`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openaiKey}`,
          },
          timeout: 5000,
        },
      );

      this.aiSegmentationFailCount = 0;
      this.aiSegmentationAvailable = true;

      const segmented = response.data.choices?.[0]?.message?.content?.trim() || text;
      const words = segmented.split(/\s+/).filter(Boolean);
      this.logger.log(`[AI-SEGMENT] "${text}" → [${words.join(', ')}]`);
      return words.length > 1 ? words : [text];
    } catch (error: any) {
      this.aiSegmentationFailCount++;
      if (this.aiSegmentationFailCount >= AdvancedSearchService.AI_FAIL_THRESHOLD) {
        this.aiSegmentationAvailable = false;
        this.logger.error(
          `[AI-SEGMENT] Circuit open after ${this.aiSegmentationFailCount} failures — using fallback only`,
        );
      } else {
        this.logger.error(`[AI-SEGMENT] Error (attempt ${this.aiSegmentationFailCount}): ${error.message}`);
      }
      return this.fallbackSegmentation(text);
    }
  }

  private fallbackSegmentation(text: string): string[] {
    const knownWords = [
      ...Object.keys(this.typeWeights),
      ...Object.keys(this.synonymsMap),
      'avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'sup', 'inf', 'int', 'ext', 'de',
    ].sort((a, b) => b.length - a.length);

    const segments: string[] = [];
    let remaining = text.toLowerCase();
    let attempts = 0;
    const maxAttempts = 50;

    while (remaining.length > 0 && attempts < maxAttempts) {
      attempts++;
      let found = false;

      for (const word of knownWords) {
        if (remaining.startsWith(word) && word.length >= 2) {
          segments.push(word);
          remaining = remaining.slice(word.length);
          found = true;
          break;
        }
      }

      if (!found && remaining.length >= 1 && ['g', 'd', 'b', 'h'].includes(remaining[0])) {
        segments.push(remaining[0]);
        remaining = remaining.slice(1);
        found = true;
      }
      if (!found && remaining.length >= 2) {
        const twoLetter = remaining.slice(0, 2);
        if (['av', 'ar'].includes(twoLetter)) {
          segments.push(twoLetter);
          remaining = remaining.slice(2);
          found = true;
        }
      }
      if (!found && remaining.length >= 3) {
        const threeLetter = remaining.slice(0, 3);
        if (['sup', 'inf', 'int', 'ext'].includes(threeLetter)) {
          segments.push(threeLetter);
          remaining = remaining.slice(3);
          found = true;
        }
      }
      if (!found) {
        if (segments.length === 0) return [text];
        if (remaining.length >= 2) segments.push(remaining);
        break;
      }
    }

    if (remaining.length > 0 && segments.length === 0) {
      const reversed = text.split('').reverse().join('');
      const revSegments = this.fallbackSegmentation(reversed);
      if (revSegments.length > 1) {
        return revSegments.map((s) => s.split('').reverse().join('')).reverse();
      }
    }

    return segments.length > 1 ? segments : [text];
  }

  private expandWithSynonymsContextual(tokens: string[], originalQuery: string): string[] {
    const expanded = new Set<string>();

    tokens.forEach((token) => {
      const hasDoubleLetters = token.includes('ff') || token.includes('pp') || token.includes('ll');
      const normalizedToken = this.normalize(token);
      const isKnown = this.normalizedSynonymLookup[normalizedToken] !== undefined;

      let addedByExpansion = false;

      // Fuzzy matches (typo corrections) — if found, add the correction but do NOT keep the original token
      // If the token is a known car-part type (even if not in synonyms), keep it
      const isPartType = Object.keys(this.typeWeights).includes(token);

      if (!isKnown && !hasDoubleLetters && !isPartType) {
        const fuzzyMatches = this.findFuzzyMatches(token);
        if (fuzzyMatches.length > 0) {
          const validFuzzy = fuzzyMatches.filter((fm) => {
            const tokenHasFF = token.includes('ff');
            const tokenHasPP = token.includes('pp');
            const tokenHasLL = token.includes('ll');
            const fmHasFF = fm.includes('ff');
            const fmHasPP = fm.includes('pp');
            const fmHasLL = fm.includes('ll');
            return tokenHasFF === fmHasFF && tokenHasPP === fmHasPP && tokenHasLL === fmHasLL;
          });
          if (validFuzzy.length > 0) {
            expanded.add(validFuzzy[0]);
            addedByExpansion = true;
            // Do NOT keep original typo token — it would poison scoring
            return;
          }
        }
      }

      // If token maps to a primary canonical category, add the category and drop the original token
      const primaryCategory = this.findPrimaryCategory(token);
      if (primaryCategory) {
        expanded.add(primaryCategory);
        addedByExpansion = true;
        // Do NOT add original token — canonical replaces it
        return;
      }

      // If nothing else added the token, keep the original user token
      if (!addedByExpansion) {
        expanded.add(token);
      }
    });

    return Array.from(expanded);
  }

  private findFuzzyMatches(token: string): string[] {
    if (token.length < 3) return [];
    const cached = this.fuzzyMatchCache.get(token);
    if (cached !== undefined) return cached;
    const normalizedToken = this.normalize(token);
    if (this.normalizedSynonymLookup[normalizedToken]) {
      this.fuzzyMatchCache.set(token, []);
      return [];
    }

    const matches: string[] = [];
    const knownWords = [...new Set([...Object.keys(this.typeWeights), ...Object.keys(this.synonymsMap)])];

    for (const word of knownWords) {
      if (word === token || word.length < 3) continue;
      if (
        word.length === token.length &&
        word[0] === token[1] &&
        word[1] === token[0] &&
        word.slice(2) === token.slice(2)
      ) {
        matches.push(word);
        continue;
      }
      if (word.includes(token) && word.length - token.length <= 2) { matches.push(word); continue; }
      if (token.includes(word) && token.length - word.length <= 2) { matches.push(word); continue; }
      if (word.length === token.length + 1 && word.slice(1) === token) { matches.push(word); continue; }
      if (token.length === word.length + 1 && token.slice(1) === word) { matches.push(word); continue; }
      if (word.length === token.length && word.slice(1) === token.slice(1)) { matches.push(word); continue; }
      if (token.length >= 4 && token[0] === token[1]) {
        const withoutDouble = token[0] + token.slice(2);
        if (word === withoutDouble || this.levenshtein(word, withoutDouble) <= 1) {
          matches.push(word);
          continue;
        }
      }
      const distance = this.levenshtein(word, token);
      if (distance <= 2 && Math.abs(word.length - token.length) <= 2 && word.length >= 4) {
        matches.push(word);
      }
    }

    if (token.endsWith('s') && token.length > 3) {
      const singular = token.slice(0, -1);
      if (knownWords.includes(singular)) matches.push(singular);
      if (token.endsWith('es') && token.length > 4) {
        const singularEs = token.slice(0, -2);
        if (knownWords.includes(singularEs)) matches.push(singularEs);
      }
    } else {
      const pluralS = token + 's';
      const pluralEs = token + 'es';
      if (knownWords.includes(pluralS)) matches.push(pluralS);
      if (knownWords.includes(pluralEs)) matches.push(pluralEs);
    }

    const result = [...new Set(matches)];
    this.fuzzyMatchCache.set(token, result);
    return result;
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
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
    }
    return matrix[b.length][a.length];
  }

  private findPrimaryCategory(token: string): string | null {
    const normalizedToken = this.normalize(token);
    return this.normalizedSynonymLookup[normalizedToken] ?? null;
  }

  private normalizeTunisian(query: string): string {
    const normalized = this.normalize(query);
    if (normalized.includes('triangle') || normalized.includes('triangl')) {
      return '';
    }

    const tunisianMap = this.synonymsService.getTunisianMap();
    let result = query.toLowerCase();
    for (const [tunisian, french] of Object.entries(tunisianMap)) {
      const escaped = tunisian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      result = result.replace(regex, french);
    }

    return result !== query.toLowerCase() ? result : '';
  }

  private hasPosition(tokens: string[], positions: string[]): boolean {
    return tokens.some((t) => positions.includes(t));
  }

  private async searchByReference(reference: string, vehicle?: any): Promise<any[]> {
    const cleanRef = reference.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const originalRef = reference.toUpperCase();

    this.logger.log(`[SEARCH] Searching for reference: original="${originalRef}", clean="${cleanRef}"`);

    const include = {
      stock: { select: { statut: true } },
      fitments: { select: { modelName: true, typeCode: true } },
    } as const;

    let results = await this.prisma.part.findMany({
      where: {
        OR: [
          { reference: { equals: originalRef, mode: 'insensitive' } },
          { reference: { equals: cleanRef, mode: 'insensitive' } },
        ],
      },
      include,
      take: 5,
    });

    if (results.length === 0) {
      const altRefs = await this.prisma.itemReference.findMany({
        where: {
          OR: [
            { referenceNo: { equals: originalRef, mode: 'insensitive' } },
            { referenceNo: { equals: cleanRef, mode: 'insensitive' } },
          ],
        },
        include: { part: { include } },
        take: 5,
      });
      results = altRefs.map((r) => r.part);
    }

    if (results.length === 0) {
      results = await this.prisma.part.findMany({
        where: {
          OR: [
            { reference: { contains: cleanRef, mode: 'insensitive' } },
            { reference: { contains: originalRef, mode: 'insensitive' } },
          ],
        },
        include,
        take: 10,
      });
    }

    this.logger.log(`[SEARCH] Reference search found ${results.length} results`);
    if (results.length > 0) {
      this.logger.log(`[SEARCH] First result: ${results[0].reference} - ${results[0].designation}`);
    }
    return results.map((part) => ({ ...part, score: 1000 }));
  }

  getSearchStats(): { totalSynonyms: number } {
    return {
      totalSynonyms: Object.keys(this.synonymsMap).length,
    };
  }

  getSynonymMap(): Record<string, string[]> {
    return this.synonymsMap;
  }
}
