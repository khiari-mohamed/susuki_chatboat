import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import {
  ACCESSORY_KEYWORDS,
  MAIN_PART_KEYWORDS,
} from '../constants/part-classification.constants';
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
  userTypedTokens: Set<string>;
}

export interface VehicleSearchScope {
  active: boolean;
  vin: string | null;
  vehicleNo: string | null;
  model: string | null;
  modelDescription: string | null;
  typeCodes: string[];        // all compatible type codes (broad scope)
  primaryTypeCodes: string[]; // type codes for the exact identified model
}

// ─── API response shape ───────────────────────────────────────────
export interface PartResult {
  id: number;
  reference: string;

  // ★ PRIMARY display name — always French when available
  displayName: string;

  // Raw fields — both returned so UI can choose
  designation: string;        // English OEM name
  designation2: string | null; // French name (designation_2)
  searchDescription: string | null;

  // Pricing
  prixHt: string | null;
  prixTtc: string | null;
  unite: string | null;

  // Classification
  categorie: string | null;
  fabricant: string | null;
  fournisseurCode: string | null;
  source: string;   // '01_PROD' | '02_CARPRO'
  sourceLabel: string; // 'Suzuki OEM' | 'CarPro Parts'

  // Stock
  stock: {
    statut: string;
    totalQuantity: number;
    stockDisponible: number;
    stockConsolide: number;
  } | null;

  // Fitments
  fitments: { modelName: string; typeCode: string }[];

  itemReferences?: { referenceNo: string; referenceType: string | null }[];
  identificationSource?: {
    vin: string | null;
    vehicleNo: string | null;
    model: string | null;
    modelDescription: string | null;
    typeCodes: string[];
    articleNumber: string;
  };

  // Internal score (useful for debugging)
  score: number;
}
export interface SearchDebugInfo {
  searchType: 'text' | 'reference';
  originalQuery: string;
  normalizedQuery: string;
  hasTunisianDialect: boolean;
  rawTokens: string[];
  expandedTerms: string[];
  mainPartType: string | null;
  positionInfo: PositionRequirements;
  // Which DB columns this query actually ran against, in priority order
  fieldsSearched: string[];
  // Which Prisma/DB tables were touched to build this response
  tablesQueried: string[];
  dbRawCount: number;      // rows returned by the raw DB query, before scoring
  qualifiedCount: number;  // rows left after scoring/filtering/dedup
  finalCount: number;      // rows actually sent back to the client (max 10)
  sourceBreakdown: { suzukiOem: number; carproParts: number };
  stockBreakdown: { disponible: number; indisponible: number };
  vehicleScope?: VehicleSearchScope;
}

@Injectable()
export class AdvancedSearchService implements OnModuleInit {
  private readonly logger = console;
  private readonly openaiKey: string;

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
    // FIX-1: Additional French terms from designation_2 field (previously unsearchable)
    'pare brise': 1.2, 'parebrise': 1.2, 'mecanisme': 1.1,
    'leve vitre': 1.2, 'leve-vitre': 1.2, 'porte avant': 1.1,
    'porte arriere': 1.1, 'porte reservoir': 1.1,
    'radar recul': 1.2, 'radar': 1.2,
  };

  private static readonly SCORE_REJECTION = -1_000_000;
  private static readonly SCORE_EXACT_FULL = 100_000;
  private static readonly SCORE_EXACT_REFERENCE = 1_000;
  private static readonly SCORE_REFERENCE_CONTAINS = 400;
  private static readonly SCORE_MAIN_TYPE_PRESENT = 5_000;
  private static readonly SCORE_ALL_WORDS_MATCH = 80_000;
  private static readonly SCORE_NUMERIC_EXACT = 50_000;
  private static readonly SCORE_FRENCH_FIELD_BONUS = 20_000;


  private static readonly AVANT_TOKENS   = ['avant', 'av', 'avg', 'avd'];
  private static readonly ARRIERE_TOKENS = ['arriere', 'ar', 'arg', 'ard'];
  private static readonly GAUCHE_TOKENS  = ['gauche', 'g', 'conducteur', 'avg', 'arg'];
  private static readonly DROITE_TOKENS  = ['droite', 'd', 'passager', 'droit', 'avd', 'ard'];

  private static readonly AVANT_TOKENS_EN   = ['front', 'fr'];
  private static readonly ARRIERE_TOKENS_EN = ['rear', 'rr'];
  private static readonly GAUCHE_TOKENS_EN  = ['left', 'lh'];
  private static readonly DROITE_TOKENS_EN  = ['right', 'rh'];

  private aiSegmentationAvailable = true;
  private aiSegmentationFailCount = 0;
  private static readonly AI_FAIL_THRESHOLD = 3;

  private normalizedSynonymLookup: Record<string, string> = {};
  private fuzzyMatchCache: Map<string, string[]> = new Map();
  private lastSearchDebug: SearchDebugInfo | null = null;

  getLastSearchDebug(): SearchDebugInfo | null {
    return this.lastSearchDebug;
  }

  private computeSourceAndStockBreakdown(results: PartResult[]): {
    sourceBreakdown: { suzukiOem: number; carproParts: number };
    stockBreakdown: { disponible: number; indisponible: number };
  } {
    const sourceBreakdown = { suzukiOem: 0, carproParts: 0 };
    const stockBreakdown  = { disponible: 0, indisponible: 0 };
    for (const r of results) {
      if (r.source === '02_CARPRO') sourceBreakdown.carproParts++;
      else sourceBreakdown.suzukiOem++;
      if (this.isStockAvailable(r.stock)) stockBreakdown.disponible++;
      else stockBreakdown.indisponible++;
    }
    return { sourceBreakdown, stockBreakdown };
  }

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private synonymsService: SynonymsService,
    private vehicleModels: VehicleModelsService,
  ) {
    this.openaiKey = this.config.get<string>('OPENAI_API_KEY') || '';
  }

  async onModuleInit(): Promise<void> {
    this.synonymsMap = this.synonymsService.getCategoryVariants();
    this.normalizedSynonymLookup = this.synonymsService.getNormalizedLookup();
    this.logger.log(
      `[AdvancedSearchService] Synonym index ready — ${Object.keys(this.synonymsMap).length} categories, ${Object.keys(this.normalizedSynonymLookup).length} normalized tokens`,
    );
  }

  // ─── PUBLIC: refreshSynonymIndex ────────────────────────────────
  // Re-pulls the in-memory synonym snapshot from SynonymsService and
  // clears the fuzzy-match cache. onModuleInit() only ran once at
  // boot, so this snapshot goes stale after SynonymsService.reload()
  // is called (e.g. from the admin dashboard or /chat/synonyms/reload).
  // Call this right after synonymsService.reload() to keep search
  // results in sync with the synonyms table in real time.
  refreshSynonymIndex(): void {
    this.synonymsMap = this.synonymsService.getCategoryVariants();
    this.normalizedSynonymLookup = this.synonymsService.getNormalizedLookup();
    this.fuzzyMatchCache.clear();
    this.logger.log(
      `[AdvancedSearchService] Synonym index refreshed — ${Object.keys(this.synonymsMap).length} categories, ${Object.keys(this.normalizedSynonymLookup).length} normalized tokens`,
    );
  }

  // ─── PUBLIC: getDisplayName ─────────────────────────────────────
  // FIX-1: Always return French name (designation_2) when available
  getDisplayName(part: { designation: string; designation2?: string | null }): string {
    return (part.designation2 && part.designation2.trim().length > 0)
      ? part.designation2.trim()
      : part.designation.trim();
  }

  // ─── PUBLIC: getSourceLabel ─────────────────────────────────────
  // FIX-5: Human-readable source label
  getSourceLabel(source: string): string {
    switch (source) {
      case '01_PROD':    return 'Suzuki OEM';
      case '02_CARPRO':  return 'CarPro Parts';
      default:           return source;
    }
  }

  // ─── PUBLIC: formatPartResult ───────────────────────────────────
  private isStockAvailable(stock: any): boolean {
    const consolidated = Number(
      stock?.stockConsolide ?? stock?.stock_consolide ?? 0,
    );
    return consolidated >= 2;
  }

  private formatStock(stock: any): {
    statut: string;
    totalQuantity: number;
    stockDisponible: number;
    stockConsolide: number;
  } {
    const totalQuantity = Number(stock?.totalQuantity ?? stock?.total_quantity ?? 0);
    const stockDisponible = Number(stock?.stockDisponible ?? stock?.stock_disponible ?? 0);
    const stockConsolide = Number(
      stock?.stockConsolide ?? stock?.stock_consolide ?? 0,
    );

    return {
      statut: stockConsolide >= 2 ? 'Disponible' : 'Indisponible',
      totalQuantity,
      stockDisponible,
      stockConsolide,
    };
  }

  private pickVehicleValue(vehicle: any, keys: string[]): string | null {
    for (const key of keys) {
      const value = vehicle?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
  }

  private generateModelVariants(value: string): string[] {
    const upper = value.toUpperCase().trim();
    const variants = new Set<string>([
      upper,
      upper.replace(/-/g, ''),
      upper.replace(/\s+/g, ''),
      upper.replace(/[-\s]+/g, ''),
      upper.replace(/-/g, ' '),
      upper.replace(/\s+/g, '-'),
    ]);
    return [...variants].filter((v) => v.length > 0);
  }

  private async resolveVehicleScope(vehicle?: any): Promise<VehicleSearchScope> {
    const empty: VehicleSearchScope = {
      active: false,
      vin: null,
      vehicleNo: null,
      model: null,
      modelDescription: null,
      typeCodes: [],
      primaryTypeCodes: [],
    };
    if (!vehicle) return empty;

    const vin = this.pickVehicleValue(vehicle, ['vin', 'VIN', 'numeroChassis', 'numChassis', 'chassis']);
    const vehicleNo = this.pickVehicleValue(vehicle, ['vehicleNo', 'vehicle_no', 'numeroVehicule']);
    let explicitTypeCode = this.pickVehicleValue(vehicle, ['typeCode', 'type_code', 'type']);

    let dbVehicle: any = null;
    if (vin) {
      // FIX 2026-09-13: 109 confirmed duplicate VINs in the source data
      // (two vehicle_no sharing the same VIN — confirmed present in
      // CarPro's own raw export, not introduced by our import).
      // findFirst() with no orderBy was non-deterministic about which
      // duplicate it returned — could silently resolve the wrong
      // modele/typeCode for that vehicle. Now: fetch every match and
      // prefer the one that actually has a typeCode set (more useful
      // for compatibility search), falling back to the most recently
      // created row.
      const vinMatches = await this.prisma.vehicle.findMany({
        where: { vin: { equals: vin, mode: 'insensitive' } },
        select: {
          vin: true,
          vehicleNo: true,
          modele: true,
          modeleDescription: true,
          typeCode: true,
        },
        orderBy: { id: 'desc' },
      });
      dbVehicle = vinMatches.find((v) => v.typeCode) ?? vinMatches[0] ?? null;
    }
    if (!dbVehicle && vehicleNo) {
      dbVehicle = await this.prisma.vehicle.findFirst({
        where: { vehicleNo: { equals: vehicleNo, mode: 'insensitive' } },
        select: {
          vin: true,
          vehicleNo: true,
          modele: true,
          modeleDescription: true,
          typeCode: true,
        },
      });
    }

    explicitTypeCode = explicitTypeCode || dbVehicle?.typeCode || null;

    // primaryCandidates: the most specific model identifiers — modeleDescription
    // (e.g. "ALL NEW SW GL MT", "NEW CELERIO POP 6AB") comes first because it
    // uniquely identifies the exact variant. modele (e.g. "SWIFT IV", "CELERIO")
    // is a broader fallback used only for the wider compatibility scope.
    const primaryCandidates = [
      dbVehicle?.modeleDescription,
      vehicle.modeleDescription,
      vehicle.model,
      vehicle.modelName,
    ]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());

    const broadCandidates = [
      dbVehicle?.modele,
      vehicle.modele,
    ]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());

    const modelCandidates = [...new Set([...primaryCandidates, ...broadCandidates])];

    const normalizedModel = modelCandidates
      .map((value) => this.vehicleModels.normalize(value))
      .find((value): value is string => !!value) ?? null;

    const modelValues = Array.from(new Set([
      ...modelCandidates,
      ...(normalizedModel ? [normalizedModel] : []),
    ].map((value) => value.toUpperCase().trim())));

    const typeCodes = new Set<string>();
    const primaryTypeCodes = new Set<string>(); // codes for the exact identified model
    if (explicitTypeCode) {
      const normalizedTypeCode = explicitTypeCode.toUpperCase().replace(/\s+/g, '-').replace(/-TYPE-/g, '-TYPE');
      typeCodes.add(normalizedTypeCode);
      primaryTypeCodes.add(normalizedTypeCode);
    }

    if (!explicitTypeCode && modelValues.length > 0) {
      // Primary: exact match on modeleDescription / specific model name only
      // (e.g. "ALL NEW SW GL MT" → AON312, "NEW CELERIO" → AXM310)
      if (primaryCandidates.length > 0) {
        const exactPrimaryRows = await this.prisma.vehicleModelMap.findMany({
          where: {
            OR: primaryCandidates.map((modele) => ({
              modele: { equals: modele, mode: 'insensitive' },
            })),
          },
          select: { typeCode: true },
        });
        exactPrimaryRows.forEach((row) => {
          typeCodes.add(row.typeCode);
          primaryTypeCodes.add(row.typeCode);
        });
      }

      // Broader: all candidates including modele (e.g. "SWIFT IV" → AVH310)
      const modelMapRows = await this.prisma.vehicleModelMap.findMany({
        where: {
          OR: modelValues.map((modele) => ({
            modele: { equals: modele, mode: 'insensitive' },
          })),
        },
        select: { typeCode: true },
      });
      modelMapRows.forEach((row) => typeCodes.add(row.typeCode));

      // FIX-8: normalize/strip hyphens & spaces before querying
      // vehicle_type_master — the fallback `contains` lookup must not
      // silently miss rows just because "S-PRESSO" is stored as
      // "SPRESSO" or "S PRESSO" (or vice versa).
      const modelValueVariants = Array.from(
        new Set(modelValues.flatMap((value) => this.generateModelVariants(value))),
      );

      // FIX 2026-09-13: vehicle_type_master.modelName is unreliable for
      // most rows — a live data sample showed it mirrors type_code
      // itself ("A3K415-TYPE1" as its own "model name") rather than a
      // real human-readable name, for roughly 86% of the table. That
      // made the vehicleTypeMaster `contains` fallback below largely
      // ineffective for anything but a code-shaped query.
      // vehicle_model_map.modele has much richer data ("N SW GLX A
      // SLDA", "CELERIO GL-POP", ...), so try a fuzzy (contains) pass
      // against it too — same variant list, better-quality field —
      // before falling through to vehicle_type_master. Gated on
      // typeCodes still being empty so it never overrides a good exact
      // match above; this only fires when the strict paths found
      // nothing, exactly where a fuzzier net is safe to cast.
      if (typeCodes.size === 0) {
        const fuzzyModelMapRows = await this.prisma.vehicleModelMap.findMany({
          where: {
            OR: modelValueVariants.map((modele) => ({
              modele: { contains: modele, mode: 'insensitive' },
            })),
          },
          select: { typeCode: true },
        });
        fuzzyModelMapRows.forEach((row) => typeCodes.add(row.typeCode));
      }

      const typeRows = await this.prisma.vehicleTypeMaster.findMany({
        where: {
          OR: modelValueVariants.map((modelName) => ({
            modelName: { contains: modelName, mode: 'insensitive' },
          })),
        },
        select: { typeCode: true },
      });
      typeRows.forEach((row) => typeCodes.add(row.typeCode));
    }

    return {
      active: typeCodes.size > 0,
      vin: dbVehicle?.vin ?? vin ?? null,
      vehicleNo: dbVehicle?.vehicleNo ?? vehicleNo ?? null,
      model: normalizedModel ?? dbVehicle?.modele ?? vehicle.modele ?? null,
      modelDescription: dbVehicle?.modeleDescription ?? vehicle.modeleDescription ?? null,
      typeCodes: [...typeCodes],
      primaryTypeCodes: primaryTypeCodes.size > 0 ? [...primaryTypeCodes] : [...typeCodes],
    };
  }


  private buildCompatibilityWhere(scope: VehicleSearchScope): any {
    if (!scope.active || scope.typeCodes.length === 0) return {};
    return {
      fitments: {
        some: {
          typeCode: { in: scope.typeCodes },
        },
      },
    };
  }

  formatPartResult(part: any, score: number, scope?: VehicleSearchScope): PartResult {
    const frenchName  = (part.designation2 ?? '').trim();
    const englishName = (part.designation  ?? '').trim();
    const designationOem = (part.designationOem ?? '').trim() || englishName;

    return {
      id:               part.id,
      reference:        part.reference,
      displayName:      this.getDisplayName(part),         // ★ French first
      designation:      designationOem,                    // English OEM (true)
      designation2:     frenchName || null,                // French name
      searchDescription: part.searchDescription ?? null,
      prixHt:           part.prixHt  != null ? String(part.prixHt)  : null,
      prixTtc:          part.prixTtc != null ? String(part.prixTtc) : null,
      unite:            part.unite           ?? null,
      categorie:        part.categorie       ?? null,
      fabricant:        part.fabricant       ?? null,
      fournisseurCode:  part.fournisseurCode ?? null,
      source:           part.source,
      sourceLabel:      this.getSourceLabel(part.source),  // ★ Human-readable
      // BUGFIX-1: always return a stock object, never null
      stock: this.formatStock(part.stock),
      fitments: (part.fitments ?? []).map((f: any) => ({
        modelName: f.modelName,
        typeCode:  f.typeCode,
      })),
      itemReferences: (part.itemReferences ?? []).map((r: any) => ({
        referenceNo: r.referenceNo,
        referenceType: r.referenceType ?? null,
      })),
      identificationSource: scope
        ? {
            vin: scope.vin,
            vehicleNo: scope.vehicleNo,
            model: scope.model,
            modelDescription: scope.modelDescription,
            typeCodes: scope.typeCodes,
            articleNumber: part.reference,
          }
        : undefined,
      score,
    };
  }

  // ─── MAIN SEARCH ────────────────────────────────────────────────
  async searchParts(query: string, vehicle?: any): Promise<PartResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    this.logger.log(`[SEARCH] Input query: "${query}"`);

    // ── Reference pattern detection ──────────────────────────────
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
        const isAlphaNumericRef = /[A-Z]/.test(reference) && /[0-9]/.test(reference) && reference.length >= 8;
        const isNumericRef = /^\d{8,}$/.test(reference);
        if ((isAlphaNumericRef || isNumericRef) && reference.length >= 8) {
          this.logger.log(`[SEARCH] Reference pattern detected: "${reference}"`);
          const refResults = await this.searchByReference(reference, vehicle);
          this.logger.log(`[SEARCH] Reference search returned ${refResults.length} results`);
          return refResults;
        }
      }
    }

    // ── Tunisian dialect normalization ───────────────────────────
    const tunisianNormalized = this.normalizeTunisian(query);
    const tunisianValid = (() => {
      if (!tunisianNormalized) return false;
      const originalTokens = this.normalize(query).split(' ').filter(Boolean);
      const normalizedTokens = this.normalize(tunisianNormalized).split(' ').filter(Boolean);
      const allAlreadyKnown = originalTokens.every(
        (t) => this.normalizedSynonymLookup[t] !== undefined || Object.keys(this.typeWeights).includes(t),
      );
      if (allAlreadyKnown) return false;
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

    const normalized = this.normalize(searchQuery);
    this.logger.log(`[SEARCH] Normalized query: "${normalized}"`);

    const allTokens = await this.tokenize(normalized, true);
    const rawTokens = allTokens.filter((t) => t.length > 2);
    this.logger.log(`[SEARCH] Raw tokens (>2 chars): [${rawTokens.join(', ')}]`);

    const expandedTerms = this.expandWithSynonymsContextual(rawTokens, normalized);
    this.logger.log(`[SEARCH] Expanded terms: [${expandedTerms.join(', ')}]`);
    const positionInfo = this.detectPositionRequirements(allTokens, expandedTerms);
    const vehicleScope = await this.resolveVehicleScope(vehicle);
    if (vehicleScope.active) {
      this.logger.log(`[SEARCH] Vehicle compatibility scope: typeCodes=[${vehicleScope.typeCodes.join(', ')}] vin=${vehicleScope.vin ?? 'n/a'}`);
    }

    // ── FIX-2: Build search conditions across ALL three text fields ──
    const searchConditions = this.buildSearchConditions(rawTokens, expandedTerms);
    const whereParts = [
      ...(searchConditions.length > 0 ? [{ OR: searchConditions }] : []),
      ...(vehicleScope.active ? [this.buildCompatibilityWhere(vehicleScope)] : []),
    ];
    const whereCondition: any = whereParts.length > 0 ? { AND: whereParts } : {};

    // ── FIX-3: No source filter — include both 01_PROD and 02_CARPRO ──
    let parts = await this.prisma.part.findMany({
      where: whereCondition,
      include: {
        stock: {
          select: {
            statut: true,
            totalQuantity: true,  // FIX-5: include quantity
            stockDisponible: true,
            stockConsolide: true,
          },
        },
        fitments: {
          select: {
            modelName: true,
            typeCode: true,
          },
        },
        itemReferences: {
          select: {
            referenceNo: true,
            referenceType: true,
          },
        },
      },
      take: 500,
    });

    // Compound windshield searches must match the windshield term as well as
    // the shared "pare" token; otherwise unrelated "pare huile" parts can
    // survive because the DB conditions are intentionally broad OR clauses.
    if (/\bpare\s*-?\s*brise\b/i.test(normalized) || /\bparebrise\b/i.test(normalized)) {
      parts = parts.filter((part: any) => {
        const text = this.normalize([
          part.designation2,
          part.searchDescription,
          part.designation,
        ].filter(Boolean).join(' '));
        const windshieldText = text.includes('brise') || text.includes('windshield') || text.includes('windscreen');
        const accessoryText = [
          'moustache', 'garnish', 'garniture', 'joint', 'molding', 'moulure',
          'trim', 'wiper', 'essuie', 'motor', 'moteur',
        ].some((term) => text.includes(term));
        return windshieldText && !accessoryText;
      });
    }
    this.logger.log(`[SEARCH] Database returned ${parts.length} raw results`);

    // ── Conflict filter ──────────────────────────────────────────
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

    const queryLower = query.toLowerCase();
    let forcedMainPartType = mainPartType;
    if (queryLower.includes('monte glace') || queryLower.includes('monte-glace')) {
      forcedMainPartType = 'appareil';
    }

    const filteredQueryWords = expandedTerms.filter((w) => {
      if (w.length < 3) return false;
      // Drop conversational/filler words and model name tokens from scoring words
      const noiseWords = ['bonjour', 'cherche', 'pour', 'new', 'all', 'swift', 'celerio', 'baleno',
        'vitara', 'ciaz', 'fronx', 'ignis', 'jimny', 'spresso', 'dzire', 'ertiga', 'kizashi',
        'samurai', 'splash', 'swace', 'alto', 'apv', 'eeco', 'merci', 'salut', 'bonsoir',
        'une', 'besoin', 'veux', 'voudrais', 'chercher', 'trouver', 'avoir', 'besoin',
        'elle', 'est', 'disponible', 'dispo', 'ils', 'elles', 'vous', 'nous', 'ils'];
      if (noiseWords.includes(w)) return false;
      for (const [category, syns] of Object.entries(this.synonymsMap)) {
        if (syns.includes(w) && expandedTerms.includes(category) && w !== category) {
          return false;
        }
      }
      return true;
    });
    if (/\btraverse\b/i.test(normalized) && /\b(arriere|arrière|ar|rear|rr)\b/i.test(normalized)) {
      parts = parts.filter((part: any) => {
        const text = this.normalize([
          part.designation2,
          part.searchDescription,
          part.designation,
        ].filter(Boolean).join(' '));
        return text.includes('traverse') && /\b(arriere|ar|rear|rr)\b/.test(text);
      });
    }
    const context: SearchContext = {
      rawTokens: allTokens,
      expandedTerms,
      filteredQueryWords,
      positionInfo,
      mainPartType: forcedMainPartType,
      originalQuery: query,
      normalizedQuery: normalized,
      hasTunisianDialect,
      userTypedTokens: new Set(rawTokens),
    };

    // The database query intentionally uses broad OR conditions for recall,
    // but that can fill the 500-row pool with parts matching only one word of
    // a compound request. Prefer the narrower all-meaningful-terms set when
    // it exists, so "buse eau essuie-glace" cannot be displaced by "pompe a
    // eau" or another unrelated single-term match.
    const positionTerms = new Set(['avant', 'arriere', 'arrière', 'gauche', 'droite', 'av', 'ar', 'g', 'd', 'sup', 'inf']);
    const meaningfulSearchTerms = expandedTerms
      .map((term) => this.normalize(term).replace(/-/g, ' ').trim())
      .filter((term) => term.length >= 3 && !positionTerms.has(term));
    if (meaningfulSearchTerms.length > 1) {
      const compoundMatches = parts.filter((part: any) => {
        const catalogText = this.normalize([
          part.designation2,
          part.searchDescription,
          part.designation,
          part.categorie,
          part.fabricant,
        ].filter(Boolean).join(' ')).replace(/-/g, ' ');
        return meaningfulSearchTerms.every((term) => catalogText.includes(term));
      });
      if (compoundMatches.length > 0) parts = compoundMatches;
    }

    // ── Score and filter ─────────────────────────────────────────
    const scored = parts.map((part) => ({
      ...part,
      _score: this.calculatePartScore(part, context, vehicleScope),
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
      .filter((p) => p._score >= 0)
      .sort((a, b) => b._score - a._score);

    // BUGFIX-3: Deduplicate by reference — the OR query across 4 fields
    // (designation2, searchDescription, designation, reference) can return
    // the same part multiple times if all fields match. Keep highest score.
    const seenRefs = new Set<string>();
    results = results.filter((p) => {
      if (seenRefs.has(p.reference)) return false;
      seenRefs.add(p.reference);
      return true;
    });

    this.logger.log(`[SEARCH] After scoring/filtering/dedup: ${results.length} qualified results`);

    const TOP_N = Math.min(results.length, 10);
    const finalResults = results.slice(0, TOP_N);

    this.logger.log(`[SEARCH] Final results returned: ${finalResults.length}`);

    // ── FIX-4 + FIX-5: Map to enriched PartResult ───────────────
    const mappedResults = finalResults.map((p) => this.formatPartResult(p, p._score, vehicleScope));
    // FIX-7 (debug): capture the full pipeline trace for the frontend
    // debug panel — same numbers as the console logs above, structured.
    this.lastSearchDebug = {
      searchType:         'text',
      originalQuery:      query,
      normalizedQuery:    normalized,
      hasTunisianDialect,
      rawTokens,
      expandedTerms,
      mainPartType:       forcedMainPartType ?? null,
      positionInfo,
      fieldsSearched:     ['designation_2', 'search_description', 'designation', 'reference', 'categorie', 'fabricant', 'fournisseur_code', 'item_references.reference_no'],
      tablesQueried:      vehicleScope.active
        ? ['vehicles', 'vehicle_model_map', 'vehicle_type_master', 'parts', 'stock', 'fitment', 'item_references']
        : ['parts', 'stock', 'fitment', 'item_references'],
      dbRawCount:         parts.length,
      qualifiedCount:     results.length,
      finalCount:         mappedResults.length,
      vehicleScope,
      ...this.computeSourceAndStockBreakdown(mappedResults),
    };
    return mappedResults;
  }

  // ── FIX-2: Search conditions now include designation_2 ─────────
  private buildSearchConditions(rawTokens: string[], expandedTerms: string[]): any[] {
    const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd', 'sup', 'inf'];
    const meaningfulTerms = expandedTerms.filter((t) => t.length >= 3 && !positionWords.includes(t));

    // Also include short position abbreviations (av, ar) as search terms so
    // designations like "AILE AV G" are matched by the DB query.
    const positionAbbrevs = expandedTerms.filter((t) => t === 'av' || t === 'ar');
    const allTerms = [...new Set([...meaningfulTerms, ...positionAbbrevs])];

    if (allTerms.length === 0) return [];

    return allTerms.flatMap((term) => [
      { designation2:        { contains: term, mode: 'insensitive' } },
      { searchDescription:   { contains: term, mode: 'insensitive' } },
      { designation:         { contains: term, mode: 'insensitive' } },
      { reference:           { contains: term, mode: 'insensitive' } },
      { categorie:           { contains: term, mode: 'insensitive' } },
      { fabricant:           { contains: term, mode: 'insensitive' } },
      { fournisseurCode:     { contains: term, mode: 'insensitive' } },
      { itemReferences:      { some: { referenceNo: { contains: term, mode: 'insensitive' } } } },
    ]);
  }

  private detectPositionRequirements(allTokens: string[], expandedTerms: string[]): PositionRequirements {
    const hasAvToken      = allTokens.some((t) => t === 'av');
    const hasArToken      = allTokens.some((t) => t === 'ar');
    const hasGToken       = allTokens.some((t) => t === 'g' && !allTokens.includes('gauche'));
    const hasDToken       = allTokens.some((t) => t === 'd' && !allTokens.includes('droite') && !allTokens.includes('droit'));
    const hasAvantWord    = allTokens.some((t) => t === 'avant');
    const hasArriereWord  = allTokens.some((t) => t === 'arriere' || t === 'arrière');
    const hasGaucheWord   = allTokens.some((t) => t === 'gauche');
    const hasDroiteWord   = allTokens.some((t) => t === 'droite' || t === 'droit');

    return {
      avant:   hasAvToken   || hasAvantWord   || this.hasPosition(expandedTerms, ['avant', 'av']),
      arriere: hasArToken   || hasArriereWord  || this.hasPosition(expandedTerms, ['arriere', 'arrière', 'ar']),
      gauche:  hasGToken    || hasGaucheWord   || this.hasPosition(expandedTerms, ['gauche', 'conducteur']),
      droite:  hasDToken    || hasDroiteWord   || this.hasPosition(expandedTerms, ['droite', 'passager']),
    };
  }

  // ─── SCORING ────────────────────────────────────────────────────
  private calculatePartScore(part: any, context: SearchContext, vehicleScope?: VehicleSearchScope): number {
    const exactScore = this.calculateExactMatches(part, context);
    const contentScore = this.calculateContentMatches(part, context);
    if (contentScore <= AdvancedSearchService.SCORE_REJECTION) {
      return AdvancedSearchService.SCORE_REJECTION;
    }

    const positionScore = this.calculatePositionMatches(part, context.positionInfo);
    if (positionScore <= AdvancedSearchService.SCORE_REJECTION) {
      return AdvancedSearchService.SCORE_REJECTION;
    }

    const businessScore = this.calculateBusinessScores(part, context, vehicleScope);
    return exactScore + contentScore + positionScore + businessScore;
  }

  private calculateExactMatches(part: any, context: SearchContext): number {
    let score = 0;
    const ref = this.normalize(part.reference);
    const alternateRefs = (part.itemReferences ?? [])
      .map((itemRef: any) => this.normalize(itemRef.referenceNo || ''))
      .filter(Boolean);
    if (ref === context.normalizedQuery) {
      score += AdvancedSearchService.SCORE_EXACT_REFERENCE;
    } else if (ref.includes(context.normalizedQuery)) {
      score += AdvancedSearchService.SCORE_REFERENCE_CONTAINS;
    }
    if (alternateRefs.some((altRef: string) => altRef === context.normalizedQuery)) {
      score += AdvancedSearchService.SCORE_EXACT_REFERENCE;
    } else if (alternateRefs.some((altRef: string) => altRef.includes(context.normalizedQuery))) {
      score += AdvancedSearchService.SCORE_REFERENCE_CONTAINS;
    }
    return score;
  }

  private calculateContentMatches(part: any, context: SearchContext): number {
    let score = 0;

    // ── FIX-6: Check French field (designation_2) first ──────────
    const frenchName      = this.normalize(part.designation2 || '');
    const englishName     = this.normalize(part.designation);
    const searchDesc      = this.normalize(part.searchDescription || '');
    const auxiliaryText   = this.normalize([
      part.reference || '',
      part.categorie || '',
      part.fabricant || '',
      part.fournisseurCode || '',
      ...(part.itemReferences ?? []).map((itemRef: any) => itemRef.referenceNo || ''),
    ].join(' '));
    const queryNormalized = this.normalizeForDB(context.originalQuery);

    // Exact full match checks — prefer French field
    if (frenchName && this.normalizeForDB(part.designation2 || '') === queryNormalized) {
      return AdvancedSearchService.SCORE_EXACT_FULL + AdvancedSearchService.SCORE_FRENCH_FIELD_BONUS;
    }
    if (searchDesc && this.normalizeForDB(part.searchDescription || '') === queryNormalized) {
      return AdvancedSearchService.SCORE_EXACT_FULL;
    }
    if (this.normalizeForDB(part.designation) === queryNormalized) {
      return AdvancedSearchService.SCORE_EXACT_FULL;
    }

    // Determine which text fields to score against
    // Compatibility is already scoped in the DB query; here we use every
    // descriptive text field so search_description can add CarPro context.
    const hasFrenchName = frenchName.length > 0;

    const queryWords     = context.filteredQueryWords;
    const frenchWords    = frenchName.split(' ').filter((w) => w.length >= 1);
    const searchDescWords = searchDesc.split(' ').filter((w) => w.length >= 1);
    const englishWords   = englishName.split(' ').filter((w) => w.length >= 1);
    const primaryWords   = [...frenchWords, ...searchDescWords, ...englishWords];
    const auxiliaryWords = auxiliaryText.split(' ').filter((w) => w.length >= 1);
    const userTypedTokens = context.userTypedTokens;

    // ── Accessory / main part filtering ─────────────────────────
    // FIX 2026-09-15: now sourced from the single shared constants
    // file (previously an independent, drifted-apart copy — see
    // part-classification.constants.ts for the data-driven rationale
    // and chat-orchestrator.service.ts for the authoritative
    // post-search filter that uses the same list).
    const accessoryWords = ACCESSORY_KEYWORDS;
    const mainPartWords = MAIN_PART_KEYWORDS;

    const userAskedForAccessory = queryWords.some((qw) => accessoryWords.includes(qw));
    const userAskedForMainPart  = queryWords.some((qw) => mainPartWords.includes(qw));
    const hasAccessoryWord      = accessoryWords.some((acc) => primaryWords.includes(acc));
    const hasMainPartWord       = mainPartWords.some((main) => primaryWords.includes(main));

    if (userAskedForAccessory && hasAccessoryWord) {
      score += 50000;
    } else if (userAskedForAccessory && !hasAccessoryWord) {
      score -= 50000;
    }
    if (userAskedForMainPart && !userAskedForAccessory) {
      if (hasAccessoryWord && hasMainPartWord) {
        score -= 30000;
      } else if (hasAccessoryWord && !hasMainPartWord) {
        return AdvancedSearchService.SCORE_REJECTION;
      } else if (!hasAccessoryWord && hasMainPartWord) {
        score += 50000;
      }
    }

    const meaningfulQueryWords = queryWords.filter(
      (w) => w.length >= 3 && !['avant', 'arriere', 'gauche', 'droite', 'sup', 'inf',
        'para', 'pour', 'avec', 'sans', 'tout', 'tous'].includes(w),
    );

    const mandatoryWords = meaningfulQueryWords.filter((w) => userTypedTokens.has(w));

    const positionMap: Record<string, string[]> = {
      avant: ['avant', 'av'], av: ['avant', 'av'],
      arriere: ['arriere', 'ar'], ar: ['arriere', 'ar'],
      gauche: ['gauche', 'g'], g: ['gauche', 'g'],
      droite: ['droite', 'd', 'droit'], d: ['droite', 'd', 'droit'], droit: ['droite', 'd', 'droit'],
      superieur: ['superieur', 'sup'], sup: ['superieur', 'sup'],
      inferieur: ['inferieur', 'inf'], inf: ['inferieur', 'inf'],
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

    // Check mandatory words against primary text (French or fallback)
    for (const qw of mandatoryWords) {
      const hasExact  = primaryWords.some((dw) => dw === qw);
      const hasPlural = primaryWords.some((dw) => dw === qw + 's' || dw === qw + 'es' || qw === dw + 's' || qw === dw + 'es');
      const hasFuzzy  = primaryWords.some((dw) => this.levenshtein(qw, dw) <= 1);

      // If not found in primary, check English OEM name as fallback
      const hasInEnglish = englishWords.some((dw) => dw === qw || this.levenshtein(qw, dw) <= 1);
      const hasInAuxiliary = auxiliaryWords.some((dw) => dw === qw || this.levenshtein(qw, dw) <= 1);

      if (!hasExact && !hasPlural && !hasFuzzy && !hasInEnglish && !hasInAuxiliary) {
        return AdvancedSearchService.SCORE_REJECTION;
      }
    }

    if (context.mainPartType) {
      const partTypeVariants = this.synonymsMap[context.mainPartType] || [context.mainPartType];
      const hasMainType = partTypeVariants.some((v) =>
        primaryWords.some((dw) => wordMatches(v, dw)) ||
        englishWords.some((dw) => wordMatches(v, dw)),
      );
      if (!hasMainType) {
        return AdvancedSearchService.SCORE_REJECTION;
      }
      score += AdvancedSearchService.SCORE_MAIN_TYPE_PRESENT;
    }

    // Numeric matching
    const queryNumbers      = context.originalQuery.match(/\d+(?:[.,]\d+)?/g) || [];
    const designationNumbers = [
      part.designation2 || '',
      part.searchDescription || '',
      part.designation || '',
    ].join(' ').match(/\d+(?:[.,]\d+)?/g) || [];

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
      const exactBonus = queryNumbers.filter((qn) =>
        designationNumbers.some((dn) => {
          const qNum = parseFloat(qn.replace(',', '.'));
          const dNum = parseFloat(dn.replace(',', '.'));
          const qNumAdjusted = qNum >= 100 ? qNum / 100 : qNum;
          return Math.abs(qNumAdjusted - dNum) < 0.01;
        }),
      ).length * AdvancedSearchService.SCORE_NUMERIC_EXACT;
      score += exactBonus;
    }

    // Word-level match count
    let matchCount = 0;
    const matchedWords = new Set<string>();

    queryWords.forEach((qw) => {
      const variants = positionMap[qw] || [qw];
      const withPlural = [...variants, ...variants.map((v) => v + 's'), ...variants.map((v) => v + 'es')];
      const fuzzyMatches = this.findFuzzyMatches(qw);
      const allVariants = [...withPlural, ...fuzzyMatches];

      // FIX-6: Check French field first, give bonus if matched there
      const matchedInFrench = hasFrenchName && allVariants.some((v) =>
        frenchWords.some((dw) => wordMatches(v, dw)),
      );
      const matchedInSearchDescription = allVariants.some((v) =>
        searchDescWords.some((dw) => wordMatches(v, dw)),
      );
      const matchedInEnglish = allVariants.some((v) =>
        englishWords.some((dw) => wordMatches(v, dw)),
      );
      const matchedInAuxiliary = allVariants.some((v) =>
        auxiliaryWords.some((dw) => wordMatches(v, dw)),
      );

      if (matchedInFrench || matchedInSearchDescription || matchedInEnglish || matchedInAuxiliary) {
        matchCount++;
        matchedWords.add(qw);
        if (matchedInFrench) {
          score += AdvancedSearchService.SCORE_FRENCH_FIELD_BONUS / queryWords.length;
        } else if (matchedInSearchDescription) {
          score += 1000;
        } else if (matchedInAuxiliary) {
          score += 500;
        }
      }
    });

    if (matchCount === 0) {
      return AdvancedSearchService.SCORE_REJECTION;
    }

    // Validate important mandatory words
    const importantQueryWords = queryWords.filter(
      (w) => w.length > 2 && !['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd', 'sup', 'inf', 'para', 'de'].includes(w),
    );
    const importantMandatory    = importantQueryWords.filter((w) => userTypedTokens.has(w));
    const missingImportantWords = importantMandatory.filter((w) => !matchedWords.has(w));

    if (missingImportantWords.length > 0) {
      const hasFuzzyMatch = missingImportantWords.every((mw) => {
        const fuzzy = this.findFuzzyMatches(mw);
        return fuzzy.some((f) =>
          primaryWords.some((dw) => wordMatches(f, dw)) ||
          englishWords.some((dw) => wordMatches(f, dw)) ||
          auxiliaryWords.some((dw) => wordMatches(f, dw)),
        );
      });
      if (!hasFuzzyMatch) {
        return AdvancedSearchService.SCORE_REJECTION;
      }
    }

    // Double-letter checks (ff, pp, ll)
    for (const qw of queryWords) {
      if (qw.includes('ff') || qw.includes('pp') || qw.includes('ll')) {
        const checkWords = [...primaryWords, ...englishWords];
        if (qw.includes('ff') && !checkWords.some((dw) => dw.includes('ff'))) return AdvancedSearchService.SCORE_REJECTION;
        if (qw.includes('pp') && !checkWords.some((dw) => dw.includes('pp'))) return AdvancedSearchService.SCORE_REJECTION;
        if (qw.includes('ll') && !checkWords.some((dw) => dw.includes('ll'))) return AdvancedSearchService.SCORE_REJECTION;
      }
    }

    if (matchCount === queryWords.length && primaryWords.length === queryWords.length) {
      return AdvancedSearchService.SCORE_EXACT_FULL + (hasFrenchName ? AdvancedSearchService.SCORE_FRENCH_FIELD_BONUS : 0);
    }
    if (matchCount === queryWords.length) {
      score += AdvancedSearchService.SCORE_ALL_WORDS_MATCH;
    }

    const extraWords = primaryWords.length - queryWords.length;
    score += 50000 - extraWords * 2000;
    return score;
  }
  private computePositionFlags(frenchTokens: string[], fallbackTokens: string[]): {
    hasAvant: boolean;
    hasArriere: boolean;
    hasGauche: boolean;
    hasDroite: boolean;
  } {
    const frHasAvant   = this.hasAnyToken(frenchTokens, AdvancedSearchService.AVANT_TOKENS);
    const frHasArriere = this.hasAnyToken(frenchTokens, AdvancedSearchService.ARRIERE_TOKENS);
    const frHasGauche  = this.hasAnyToken(frenchTokens, AdvancedSearchService.GAUCHE_TOKENS);
    const frHasDroite  = this.hasAnyToken(frenchTokens, AdvancedSearchService.DROITE_TOKENS);

    const hasAvant   = (frHasAvant || frHasArriere)
      ? frHasAvant
      : this.hasAnyToken(fallbackTokens, [...AdvancedSearchService.AVANT_TOKENS, ...AdvancedSearchService.AVANT_TOKENS_EN]);
    const hasArriere = (frHasAvant || frHasArriere)
      ? frHasArriere
      : this.hasAnyToken(fallbackTokens, [...AdvancedSearchService.ARRIERE_TOKENS, ...AdvancedSearchService.ARRIERE_TOKENS_EN]);
    const hasGauche  = (frHasGauche || frHasDroite)
      ? frHasGauche
      : this.hasAnyToken(fallbackTokens, [...AdvancedSearchService.GAUCHE_TOKENS, ...AdvancedSearchService.GAUCHE_TOKENS_EN]);
    const hasDroite  = (frHasGauche || frHasDroite)
      ? frHasDroite
      : this.hasAnyToken(fallbackTokens, [...AdvancedSearchService.DROITE_TOKENS, ...AdvancedSearchService.DROITE_TOKENS_EN]);

    return { hasAvant, hasArriere, hasGauche, hasDroite };
  }

  private calculatePositionMatches(part: any, positionInfo: PositionRequirements): number {
    let score = 0;
    // FIX-9: French (designation_2) and fallback (designation + searchDescription)
    // tokenized SEPARATELY — never merged into one blob — so per-axis
    // French-priority resolution actually works. See computePositionFlags().
    const frenchTokens = this.normalize(part.designation2 || '').split(/[\s-]+/).filter(Boolean);
    const fallbackTokens = this.normalize(
      [part.designation || '', part.searchDescription || ''].join(' '),
    ).split(/[\s-]+/).filter(Boolean);

    const { hasAvant, hasArriere, hasGauche, hasDroite } = this.computePositionFlags(frenchTokens, fallbackTokens);

    if (positionInfo.avant   && !hasAvant)   return AdvancedSearchService.SCORE_REJECTION;
    if (positionInfo.arriere && !hasArriere) return AdvancedSearchService.SCORE_REJECTION;
    if (positionInfo.gauche  && !hasGauche)  return AdvancedSearchService.SCORE_REJECTION;
    if (positionInfo.droite  && !hasDroite)  return AdvancedSearchService.SCORE_REJECTION;

    if (positionInfo.avant   && hasAvant  ) score += 500;
    if (positionInfo.arriere && hasArriere) score += 500;
    if (positionInfo.gauche  && hasGauche ) score += 500;
    if (positionInfo.droite  && hasDroite ) score += 500;

    if (positionInfo.avant   && hasArriere) score -= 100000;
    if (positionInfo.arriere && hasAvant  ) score -= 100000;
    if (positionInfo.gauche  && hasDroite ) score -= 100000;
    if (positionInfo.droite  && hasGauche ) score -= 100000;

    return score;
  }

  private hasAnyToken(tokens: string[], expected: string[]): boolean {
    return expected.some((token) => tokens.includes(token));
  }

  private calculateBusinessScores(part: any, context: SearchContext, vehicleScope?: VehicleSearchScope): number {
    let score = 0;
    if (this.isStockAvailable(part.stock)) score += 8;

    if (vehicleScope?.active && vehicleScope.typeCodes.length > 0 && part.fitments?.length > 0) {
      const fitmentCodes = (part.fitments as any[]).map((f) => f.typeCode as string);
      const primaryCodes = new Set(vehicleScope.primaryTypeCodes);
      const allScopeCodes = new Set(vehicleScope.typeCodes);
      const totalFitments = fitmentCodes.length;
      const primaryMatches = fitmentCodes.filter((c) => primaryCodes.has(c)).length;
      const scopeMatches   = fitmentCodes.filter((c) => allScopeCodes.has(c)).length;

      if (primaryMatches > 0 && primaryMatches === totalFitments) {
        score += 60000; // exclusively fits the identified model
      } else if (primaryMatches > 0) {
        // Has at least one primary match — strong bonus regardless of total fitments
        // (e.g. AON312 part that also fits AVH310 still beats a pure AVH310 part)
        score += 50000 + Math.round((primaryMatches / totalFitments) * 10000);
      } else if (scopeMatches === totalFitments) {
        score += 10000; // fits only related/secondary models in scope
      } else if (scopeMatches > 0) {
        score += Math.round((scopeMatches / totalFitments) * 5000);
      }
    }

    return score;
  }

  // ─── REFERENCE SEARCH ───────────────────────────────────────────
  private async searchByReference(reference: string, vehicle?: any): Promise<PartResult[]> {
    const cleanRef   = reference.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const originalRef = reference.toUpperCase();
    const vehicleScope = await this.resolveVehicleScope(vehicle);
    const compatibilityWhere = this.buildCompatibilityWhere(vehicleScope);

    this.logger.log(`[SEARCH] Searching for reference: original="${originalRef}", clean="${cleanRef}"`);

    const include = {
      stock: { select: { statut: true, totalQuantity: true, stockDisponible: true, stockConsolide: true } },
      fitments: { select: { modelName: true, typeCode: true } },
      itemReferences: { select: { referenceNo: true, referenceType: true } },
    } as const;

    let results = await this.prisma.part.findMany({
      where: {
        AND: [
          {
            OR: [
              { reference: { equals: originalRef, mode: 'insensitive' } },
              { reference: { equals: cleanRef,    mode: 'insensitive' } },
            ],
          },
        ],
      },
      include,
      take: 5,
    });

    if (results.length === 0) {
      const altRefs = await this.prisma.itemReference.findMany({
        where: {
          AND: [
            {
              OR: [
                { referenceNo: { equals: originalRef, mode: 'insensitive' } },
                { referenceNo: { equals: cleanRef,    mode: 'insensitive' } },
              ],
            },
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
          AND: [
            {
              OR: [
                { reference: { contains: cleanRef,    mode: 'insensitive' } },
                { reference: { contains: originalRef, mode: 'insensitive' } },
                { itemReferences: { some: { referenceNo: { contains: cleanRef, mode: 'insensitive' } } } },
                { itemReferences: { some: { referenceNo: { contains: originalRef, mode: 'insensitive' } } } },
              ],
            },
            ...(vehicleScope.active ? [compatibilityWhere] : []),
          ],
        },
        include,
        take: 10,
      });
    }

    this.logger.log(`[SEARCH] Reference search found ${results.length} results`);
    const mappedRefResults = results.map((part) => this.formatPartResult(part, 1000, vehicleScope));
    // FIX-7 (debug): reference-lookup path gets its own trace shape —
    // there are no tokens/synonyms/scoring here, just a direct lookup.
    this.lastSearchDebug = {
      searchType:         'reference',
      originalQuery:      reference,
      normalizedQuery:    cleanRef,
      hasTunisianDialect: false,
      rawTokens:          [reference],
      expandedTerms:      [cleanRef],
      mainPartType:       null,
      positionInfo:       { avant: false, arriere: false, gauche: false, droite: false },
      fieldsSearched:     ['reference', 'item_references.reference_no'],
      tablesQueried:      vehicleScope.active
        ? ['vehicles', 'vehicle_model_map', 'vehicle_type_master', 'parts', 'stock', 'fitment', 'item_references']
        : ['parts', 'stock', 'fitment', 'item_references'],
      dbRawCount:         mappedRefResults.length,
      qualifiedCount:     mappedRefResults.length,
      finalCount:         mappedRefResults.length,
      vehicleScope,
      ...this.computeSourceAndStockBreakdown(mappedRefResults),
    };
    return mappedRefResults;
  }

  // ─── TOKENIZATION ────────────────────────────────────────────────
  private async tokenize(text: string, preserveShort = false): Promise<string[]> {
    if (!text || text.trim().length === 0) return [];

    if (!text.includes(' ') && text.length > 6) {
      const segmented = await this.segmentConcatenatedQuery(text);
      if (segmented.length > 1) {
        text = segmented.join(' ');
      }
    }

    // Split on spaces AND hyphens so "pare-brise" → ["pare", "brise"]
    // and "pare-choc" → ["pare", "choc"] — both are already keys in
    // typeWeights, so no fuzzy correction fires and the DB query uses
    // the correct space-separated form that matches catalog values like
    // "PARE BRISE AVANT" and "SUPPORT PARE CHOC AV D".
    // strict-validator.service.ts already does this correctly with
    // split(/[\s-]+/) — this aligns tokenize() with that behaviour.
    let parts = text.split(/[\s-]+/).map((p) => p.trim()).filter(Boolean);
    const stopWords = this.synonymsService.getStopWords();
    parts = parts.filter((token) => !stopWords.has(token));

    if (preserveShort) return parts;
    return parts.filter((t) => t.length > 2);
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
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.openaiKey}` },
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
        this.logger.error(`[AI-SEGMENT] Circuit open after ${this.aiSegmentationFailCount} failures`);
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

    while (remaining.length > 0 && attempts < 50) {
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
      if (!found && remaining.length >= 2 && ['av', 'ar'].includes(remaining.slice(0, 2))) {
        segments.push(remaining.slice(0, 2));
        remaining = remaining.slice(2);
        found = true;
      }
      if (!found && remaining.length >= 3 && ['sup', 'inf', 'int', 'ext'].includes(remaining.slice(0, 3))) {
        segments.push(remaining.slice(0, 3));
        remaining = remaining.slice(3);
        found = true;
      }
      if (!found) {
        if (segments.length === 0) return [text];
        if (remaining.length >= 2) segments.push(remaining);
        break;
      }
    }

    return segments.length > 1 ? segments : [text];
  }
  private expandWithSynonymsContextual(tokens: string[], originalQuery: string): string[] {
    const expanded = new Set<string>();

    // Model name tokens must never be expanded or replaced — they are vehicle identifiers,
    // not part type synonyms. Expanding them corrupts the query (e.g. celerio → roue).
    // Also includes common French filler/conversational words that must pass through unchanged.
    const modelNameTokens = new Set(['new', 'all', 'swift', 'celerio', 'baleno', 'vitara', 'ciaz',
      'fronx', 'ignis', 'jimny', 'spresso', 'dzire', 'ertiga', 'kizashi', 'samurai', 'splash',
      'swace', 'alto', 'apv', 'eeco', 'sx4',
      // French filler/conversational words that must not be synonym-expanded
      'une', 'besoin', 'pour', 'cherche', 'bonjour', 'salut', 'bonsoir', 'merci',
      'veux', 'voudrais', 'chercher', 'trouver', 'avoir',
      'elle', 'est', 'disponible', 'dispo', 'ils', 'elles', 'vous', 'nous']);

    tokens.forEach((token) => {
      // Model name tokens are kept as-is — never expanded or replaced
      if (modelNameTokens.has(token)) {
        expanded.add(token);
        return;
      }

      const hasDoubleLetters = token.includes('ff') || token.includes('pp') || token.includes('ll');
      const normalizedToken  = this.normalize(token);
      const isKnown          = this.normalizedSynonymLookup[normalizedToken] !== undefined;
      const isPartType       = Object.keys(this.typeWeights).includes(token);
      let addedByExpansion   = false;

      // Catalog descriptions commonly store "pare choc" with a space,
      // while customers often type the compact form "parchoc".
      if (normalizedToken === 'parchoc' || normalizedToken === 'parechoc') {
        expanded.add('pare');
        expanded.add('choc');
        expanded.add(normalizedToken);
        return;
      }
      if (isPartType) {
        expanded.add(token);
        return;
      }

      if (!isKnown && !hasDoubleLetters) {
        const fuzzyMatches = this.findFuzzyMatches(token);
        if (fuzzyMatches.length > 0) {
          const validFuzzy = fuzzyMatches.filter((fm) => {
            return (
              token.includes('ff') === fm.includes('ff') &&
              token.includes('pp') === fm.includes('pp') &&
              token.includes('ll') === fm.includes('ll')
            );
          });
          if (validFuzzy.length > 0) {
            expanded.add(validFuzzy[0]);
            addedByExpansion = true;
            return;
          }
        }
      }
      const primaryCategory = this.findPrimaryCategory(token);
      if (primaryCategory) {
        expanded.add(primaryCategory);
        addedByExpansion = true;
        return;
      }

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
      if (word.length === token.length && word[0] === token[1] && word[1] === token[0] && word.slice(2) === token.slice(2)) { matches.push(word); continue; }
      if (word.includes(token) && word.length - token.length <= 2) { matches.push(word); continue; }
      if (token.includes(word) && token.length - word.length <= 2) { matches.push(word); continue; }
      if (word.length === token.length + 1 && word.slice(1) === token) { matches.push(word); continue; }
      if (token.length === word.length + 1 && token.slice(1) === word) { matches.push(word); continue; }
      if (word.length === token.length && word.slice(1) === token.slice(1)) { matches.push(word); continue; }
      if (token.length >= 4 && token[0] === token[1]) {
        const withoutDouble = token[0] + token.slice(2);
        if (word === withoutDouble || this.levenshtein(word, withoutDouble) <= 1) { matches.push(word); continue; }
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
      if (knownWords.includes(token + 's'))  matches.push(token + 's');
      if (knownWords.includes(token + 'es')) matches.push(token + 'es');
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

    // Do not apply Tunisian normalization if the query contains a known model name
    // that includes English words (e.g. "New Celerio", "New Swift", "All New Swift")
    // — "new" would be wrongly translated to "neuf" corrupting the query.
    const modelNameWords = ['new', 'all', 'swift', 'celerio', 'baleno', 'vitara', 'ciaz', 'fronx', 'ignis', 'jimny', 'spresso', 'dzire', 'ertiga', 'kizashi', 'samurai', 'splash', 'swace'];
    const queryLower = query.toLowerCase();
    const hasModelWord = modelNameWords.some((w) => queryLower.includes(w));
    if (hasModelWord) return '';

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

  getSearchStats(): { totalSynonyms: number } {
    return { totalSynonyms: Object.keys(this.synonymsMap).length };
  }

  getSynonymMap(): Record<string, string[]> {
    return this.synonymsMap;
  }
}
