import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUZUKI_MODELS } from '../constants/vehicle-models';
import { tunisianDictionary } from '../chat/tunisian-dictionary';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
  private readonly logger = console;
  private readonly openaiKey: string;
  private readonly synonyms: Record<string, string[]> = {
    // Tunisian dialect translations
    filtre: ['filtre', 'filter', 'filtr', 'filtere', 'filtration', 'cartouche', 'filtr', 'fitlre', 'filtere'],
    air: ['air', 'admission', 'intake', 'aer' , 'hwe'],
    huile: ['huile', 'oil', 'hile', 'huil', 'oile'],
    prix: ['prix', 'price', 'cost', 'cout', 'coût', 'pris', 'tarif', 'taklfa'],
    stock: ['stock', 'disponible', 'availability', 'stok', 'dispo' , ' mawjoud'],
    celerio: ['celerio', 'celirio', 'celario', 'celerio'],
    spresso: [ 's-presso', 'spresso','es-presso'],
    
    // Enhanced brake terms for multilingual support
    brake: ['brake', 'frein', 'freinage', 'frain', 'break', 'fren'],
    brakes: ['brakes', 'freins', 'brake', 'frein'],
    kit: ['kit', 'jeu', 'set', 'ensemble', 'pack'],
 
    // Vitrerie & ouvrants
    vitre: ['vitre', 'vitres', 'glace', 'glaces', 'verre', 'fenetre', 'fenêtre', 'fenêtres', 'window', 'custode', 'lunette', 'vit', 'belar', 'chebek'],
    levevitre: ['leve vitre', 'lève vitre', 'leve-vitre', 'lève-vitre', 'lèvevitre', 'levevitre', 'mecanisme vitre', 'mécanisme vitre', 'commande vitre'],
    porte: ['porte', 'portière', 'portieres', 'door', 'portier', 'bab'],
    baguette: ['baguette', 'baguettes', 'moulure', 'jonc'],
    cache: ['cache', 'caches', 'couvercle', 'capot'],
    parebrise: ['parebrise', 'pare-brise', 'pare brise', 'windshield', 'parabrize', 'brise', 'vitre avant'],
    retroviseur: ['retroviseur', 'rétroviseur', 'miroir', 'mirroir', 'retro', 'rétro', 'mirwar', 'miray', 'miroire'],
    lunette: ['lunette', 'vitre arriere', 'vitre arrière', 'glace arriere', 'glace arrière'],

    // Suspension & direction
    amortisseur: ['amortisseur', 'amortiseur', 'amorsteur', 'amorto', 'amort', 'suspension', 'amor', 'amortisseure', 'amortos', 'amortisseurs'],
    biellette: ['biellette', 'biellette de direction', 'tirant', 'bielette', 'bielle direction', 'biel'],
    rotule: ['rotule', 'rotule de direction', 'rot', 'rotul', 'boule direction'],
    triangle: ['triangle', 'triangl', 'bras suspension', 'triangles', 'tiangle', 'trangle', 'riangle', 'rtiangle'],
    signalisation: ['signalisation', 'signal', 'warning', 'detresse'],
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
    collier: ['collier', 'attache', 'fixation', 'clamp', 'bracket'],
    support: ['support', 'collier', 'fixation'],
    vis: ['vis', 'boulon', 'ecrou', 'bolt', 'nut', 'screw', 'fixation'],
    clip: ['clip', 'attache', 'fastener', 'rivet', 'fixation rapide'],
    agrafe: ['agrafe', 'agrafes', 'agraffe', 'agraffes', 'agraphe', 'agraphes', 'garafe', 'garafes', 'garaffe', 'garaffes', 'graffe', 'graffes', 'garaphe', 'graphe', 'garfe', 'garfes'],
    agraphe: ['agraphe', 'agraphes', 'garaphe', 'graphe'],
    agraffe: ['agraffe', 'agraffes', 'garaffe', 'garaffes', 'graffe', 'graffes'],
    appareil: ['appareil', 'ppareil', 'papareil', 'apareil'],
    plateau: ['plateau', 'plateaux', 'plato'],
    maitre: ['maitre', 'maître', 'master'],
    cylindre: ['cylindre', 'cylinder', 'cilindre'],
    bouton: ['bouton', 'boutons'],
    combin: ['combin', 'combiné', 'combine'],
    dinstrument: ['dinstrument', 'd\'instrument'],
    feu_detresse: ['feu de détresse', 'feu detresse'],
    para: ['para', 'pare'],

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
    'porte': 1.2, 'joint': 1.2, 'vitesse': 1.2, 'roulement': 1.3, 'culbuteur': 1.2, 'support': 1.3, 'bielle': 1.2, 'vitre': 1.2, 'capteur': 1.2, 'pare': 1.0, 'synchro': 1.15, 'cache': 1.2, 'sup': 1.15, 'bouchon': 1.15, 'radiateur': 1.3, 'charniere': 1.15, 'inf': 1.15, 'feu': 1.15, 'boite': 1.15, 'huile': 1.15, 'aile': 1.2, 'glace': 1.15, 'moteur': 1.2, 'serrure': 1.15, 'frein': 1.5, 'agrafe': 1.2, 'agrafes': 1.2, 'agraffe': 1.3, 'agraffes': 1.3, 'agraphe': 1.3, 'agraphes': 1.3, 'roue': 1.1, 'capot': 1.2, 'baguette': 1.1, 'choc': 1.1, 'garniture': 1.1, 'tableau': 1.1, 'bord': 1.1, 'toit': 1.1, 'arbre': 1.1, 'soupape': 1.1, 'essuie': 1.1, 'cable': 1.1, 'circlip': 1.1, 'pompe': 1.2, 'panneau': 1.1, 'stdt': 1.1, 'amortisseur': 1.5, 'bas': 1.1, 'filtre': 1.3, 'embrayage': 1.3, 'carburant': 1.1, 'montant': 1.1, 'ust': 1.1, 'traverse': 1.2, 'int': 1.1, 'air': 1.1, 'malle': 1.1, 'corps': 1.1, 'dhuile': 1.1, 'reservoir': 1.1, 'deau': 1.1, 'retroviseur': 1.5, 'plaque': 1.1, 'abs': 1.1, 'batterie': 1.3, 'moyeu': 1.1, 'durite': 1.4, 'coussinet': 1.1, 'extension': 1.1, 'roulment': 1.1, 'ressort': 1.1, 'siege': 1.1, 'plancher': 1.1, 'tige': 1.1, 'clim': 1.1, 'eau': 1.1, 'carter': 1.2, 'cle': 1.1, 'longeron': 1.1, 'moustache': 1.1, 'adhesif': 1.1, 'volant': 1.2, 'anneau': 1.1, 'contre': 1.1, 'appareil': 1.8, 'monte': 1.1, 'balai': 1.1, 'caisse': 1.1, 'thermostat': 1.1, 'bouton': 1.4, 'direction': 1.1, 'pression': 1.1, 'central': 1.1, 'haute': 1.1, 'disque': 1.5, 'ecrou': 1.1, 'flexible': 1.1, 'jeu': 1.1, 'echappement': 1.2, 'passage': 1.1, 'pignonarbre': 1.1, 'dentree': 1.1, 'poignee': 1.1, 'renfort': 1.1, 'relais': 1.1, 'sigle': 1.1, 'tete': 1.1, 'para': 1.1, 'moulure': 1.1, 'bague': 1.1, 'boulon': 1.1, 'remorquage': 1.2, 'bras': 1.3, 'calculateur': 1.2, 'lampe': 1.2, 'ensemble': 1.1, 'leve': 1.1, 'caoutchouc': 1.1, 'collecteur': 1.1, 'admission': 1.1, 'ceinture': 1.1, 'synchroniseur': 1.1, 'lateral': 1.1, 'condenseur': 1.1, 'remplissage': 1.1, 'courroie': 1.3, 'faisceau': 1.1, 'complet': 1.1, 'gardeboue': 1.1, 'tablier': 1.1, 'interieur': 1.1, 'goupille': 1.1, 'jante': 1.1, 'manchon': 1.1, 'brise': 1.1, 'boue': 1.1, 'differentiel': 1.1, 'rail': 1.1, 'absorbeur': 1.1, 'rondelle': 1.1, 'soleil': 1.1, 'bag': 1.1, 'alimentateur': 1.1, 'antenne': 1.1, 'transmission': 1.1, 'dallumage': 1.1, 'boitier': 1.1, 'douille': 1.1, 'vidange': 1.1, 'ventilateur': 1.1, 'butee': 1.1, 'stationnement': 1.1, 'trappe': 1.1, 'airbag': 1.1, 'troisieme': 1.1, 'stop': 1.1, 'calandre': 1.2, 'cale': 1.1, 'calle': 1.1, 'poigne': 1.1, 'position': 1.1, 'vilebrequin': 1.1, 'dembrayage': 1.1, 'frenage': 1.1, 'dair': 1.1, 'cardan': 1.3, 'catadioptre': 1.1, 'injecteur': 1.2, 'darbre': 1.1, 'collier': 1.1, 'compresseur': 1.1, 'conduite': 1.1, 'papillon': 1.1, 'couvercle': 1.1, 'cremaillere': 1.3, 'cric': 1.1, 'culasse': 1.1, 'durit': 1.1, 'seuil': 1.1, 'etrier': 1.3, 'cote': 1.1, 'canister': 1.1, 'fourchette': 1.1, 'fusee': 1.1, 'qtr': 1.1, 'goujon': 1.1, 'chaine': 1.1, 'distribution': 1.1, 'piston': 1.1, 'acier': 1.1, 'interrieur': 1.1, 'dechappement': 1.1, 'torique': 1.1, 'eme': 1.1, 'synchronisation': 1.1, 'membre': 1.1, 'miroire': 1.1, 'module': 1.1, 'basse': 1.1, 'optique': 1.1, 'assemblage': 1.1, 'secour': 1.1, 'vase': 1.1, 'poulie': 1.1, 'tendeur': 1.1, 'demarreur': 1.2, 'section': 1.1, 'sonde': 1.1, 'lambda': 1.1, 'soufflet': 1.1, 'tocs': 1.2, 'toc': 1.2, 'tolle': 1.1, 'triangle': 1.3, 'tube': 1.1, 'tuyau': 1.2, 'vis': 1.1, 'clip': 1.1, 'plaquette': 1.5, 'coffre': 1.1, 'passager': 1.1, 'alternateur': 1.2, 'assiette': 1.1, 'attache': 1.1, 'spirale': 1.1, 'droit': 1.1, 'base': 1.1, 'berceau': 1.1, 'bloc': 1.1, 'bobine': 1.1, 'body': 1.1, 'socket': 1.1, 'outils': 1.1, 'bouchant': 1.1, 'purge': 1.1, 'suspension': 1.3, 'bougie': 1.2, 'detresse': 1.1, 'buse': 1.1, 'glasse': 1.1, 'butte': 1.1, 'selecteur': 1.1, 'fusible': 1.1, 'poussiere': 1.1, 'usb': 1.1, 'epi': 1.1, 'caprteur': 1.1, 'camme': 1.1, 'recule': 1.1, 'marche': 1.1, 'gaz': 1.1, 'mettre': 1.1, 'sortie': 1.1, 'evaporateur': 1.1, 'temp': 1.1, 'refroidissement': 1.1, 'temperature': 1.1, 'causse': 1.1, 'cerclip': 1.1, 'comptage': 1.1, 'circlips': 1.1, 'clavette': 1.1, 'demilune': 1.1, 'queue': 1.1, 'clignotant': 1.1, 'colone': 1.1, 'dinstrument': 1.1, 'commande': 1.1, 'commodo': 1.1, 'comodo': 1.1, 'lumiere': 1.1, 'contacteur': 1.1, 'controleur': 1.1, 'parking': 1.1, 'climatiseur': 1.1, 'colonne': 1.1, 'recul': 1.1, 'deflecteur': 1.1, 'enjoliveur': 1.1, 'otr': 1.1, 'mbr': 1.1, 'lwr': 1.1, 'actuateur': 1.1, 'feutre': 1.1, 'garnitrur': 1.1, 'bochon': 1.1, 'ctr': 1.1, 'gauge': 1.1, 'essence': 1.1, 'gaugon': 1.1, 'grille': 1.1, 'guide': 1.1, 'jauge': 1.1, 'niveau': 1.1, 'goupilles': 1.1, 'glissantes': 1.1, 'machoires': 1.1, 'plaquettes': 1.1, 'segments': 1.1, 'soupappe': 1.1, 'echappment': 1.1, 'corp': 1.1, 'interieure': 1.1, 'leche': 1.1, 'lecheur': 1.1, 'tampon': 1.1, 'jupe': 1.1, 'kasarole': 1.1, 'kasaroule': 1.1, 'klaxon': 1.1, 'loquet': 1.1, 'lunette': 1.1, 'manette': 1.1, 'marmite': 1.1, 'eps': 1.1, 'monogramme': 1.1, 'presso': 1.1, 'centrale': 1.1, 'feux': 1.1, 'rouge': 1.1, 'bour': 1.1, 'villebrequin': 1.1, 'vilbrequin': 1.1, 'ard': 1.1, 'pin': 1.1, 'plage': 1.1, 'planche': 1.1, 'claison': 1.1, 'poste': 1.1, 'radio': 1.1, 'protecteur': 1.1, 'chauffage': 1.1, 'retenue': 1.1, 'revettment': 1.1, 'ring': 1.1, 'rotule': 1.3, 'axial': 1.1, 'usust': 1.1, 'ustwhite': 1.1, 'ustblanc': 1.1, 'diff': 1.1, 'manivelle': 1.1, 'damortisseur': 1.1, 'sangle': 1.1, 'laterale': 1.1, 'sensor': 1.1, 'assyclutch': 1.1, 'speed': 1.1, 'male': 1.1, 'dammortisseur': 1.1, 'suzuki': 1.1, 'supp': 1.1, 'actionneur': 1.1, 'crochet': 1.1, 'inferieur': 1.1, 'tambour': 1.3, 'frien': 1.1, 'tensionneur': 1.1, 'tiran': 1.2, 'tirant': 1.2, 'train': 1.2, 'valve': 1.1, 'longerons': 1.1, 'boudain': 1.1, 'pedale': 1.1, 'plateau': 1.3, 'maitre': 1.3, 'cylindre': 1.3, 'std': 1.2, 'us': 1.2, 'white': 1.2, 'blanc': 1.2
  };

  // Real-time stock tracking - NO CACHE
  private cacheHits = 0;
  private cacheMisses = 0;

  // normalized synonym lookup for robust matching
  private normalizedSynonymLookup: Record<string, string> = {};
  
  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.openaiKey = this.config.get<string>('OPENAI_API_KEY') || '';
    this.buildNormalizedSynonymIndex();
  }

  async searchParts(query: string, vehicle?: any): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    console.log(`[SEARCH] Input query: "${query}"`);
    
    // Check for reference pattern FIRST (before normalization)
    const referencePatterns = [
      /^\s*([A-Z0-9]{8,}(?:-[A-Z0-9]+)*)\s*$/i,
      /^\s*([A-Z]{2}-\d{4,}-[A-Z0-9]{2,}(?:-[A-Z0-9]+)*)\s*$/i,
      /\b([A-Z0-9]{8,})\b/i,
      /\b([A-Z]{2}-?\d{4,}-?[A-Z0-9]{2,}(?:-[A-Z0-9]+)*)\b/i,
      /\bref[eé]rence[\s:]*([A-Z0-9]{5,}[-_]?[A-Z0-9]*)\b/i
    ];
    
    for (const pattern of referencePatterns) {
      const refMatch = query.match(pattern);
      if (refMatch) {
        const reference = refMatch[1] || refMatch[0];
        if (/[A-Z]/.test(reference) && /[0-9]/.test(reference) && reference.length >= 8) {
          console.log(`[SEARCH] Reference pattern detected: "${reference}"`);
          const refResults = await this.searchByReference(reference, vehicle);
          console.log(`[SEARCH] Reference search returned ${refResults.length} results`);
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
    console.log(`[SEARCH] Real-time query - no cache`);
    const normalized = this.normalize(searchQuery);
    console.log(`[SEARCH] Normalized query: "${normalized}"`);
    
    // CRITICAL: Get ALL tokens including short ones (g, d, ar, av)
    const allTokens = await this.tokenize(normalized, true);
    const rawTokens = allTokens.filter(t => t.length > 2);
    console.log(`[SEARCH] All tokens: [${allTokens.join(', ')}]`);
    console.log(`[SEARCH] Raw tokens (>2 chars): [${rawTokens.join(', ')}]`);
    
    const expandedTerms = this.expandWithSynonymsContextual(rawTokens, normalized);
    console.log(`[SEARCH] Expanded terms: [${expandedTerms.join(', ')}]`);
    const positionInfo = this.detectPositionRequirements(allTokens, expandedTerms);
    console.log(`[SEARCH] Position info - avant: ${positionInfo.avant}, arrière: ${positionInfo.arriere}, gauche: ${positionInfo.gauche}, droite: ${positionInfo.droite}`);
    const searchConditions = this.buildSearchConditions(rawTokens, expandedTerms);
    
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
      take: 500
    });
    console.log(`[SEARCH] Database returned ${parts.length} raw results`);
    if (parts.length > 0) {
      console.log(`[SEARCH] Sample DB results: ${parts.slice(0, 1).map(p => `"${p.designation}"`).join(', ')}`);
    }
    const correctedTokens = expandedTerms.filter(t => {
      const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd'];
      return !positionWords.includes(t);
    });
    
    const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd'];
    const accessoryWords = ['support', 'sangle', 'cable', 'causse', 'fixation', 'adhesif', 'clip', 'vis', 'boulon', 'pare', 'boue', 'cache', 'baguette', 'joint', 'catadioptre', 'bouchon', 'couvercle', 'garniture'];
    const firstToken = correctedTokens.find(t => t.length >= 3 && !positionWords.includes(t));
    const isFirstTokenAccessory = firstToken && accessoryWords.includes(firstToken);
    
    const mainPartType = correctedTokens
      .filter(token => Object.keys(this.typeWeights).includes(token) && !positionWords.includes(token))
      .sort((a, b) => {
        if (isFirstTokenAccessory && (a === firstToken || b === firstToken)) {
          return a === firstToken ? -1 : 1;
        }
        const weightA = this.typeWeights[a] || 1.0;
        const weightB = this.typeWeights[b] || 1.0;
        if (weightB !== weightA) return weightB - weightA;
        return b.length - a.length;
      })[0];
    console.log(`[SEARCH] Main part type detected: "${mainPartType || 'NONE'}" from tokens: [${rawTokens.join(', ')}]`);
    
    // --- FORCE appareil when monte glace is present ---
    const queryLower = query.toLowerCase();
    let forcedMainPartType = mainPartType;
    if (queryLower.includes('monte glace') || queryLower.includes('monte-glace')) {
      forcedMainPartType = 'appareil';
      console.log(`[SEARCH] Forced main part type to "appareil" due to "monte glace"`);
    }
    
    const context: SearchContext = {
      rawTokens: allTokens, // Use ALL tokens including positions
      expandedTerms,
      positionInfo,
      mainPartType: forcedMainPartType,
      originalQuery: query,
      normalizedQuery: normalized,
      hasTunisianDialect
    };
    const scored = parts.map(part => {
      const score = this.calculatePartScore(part, context);
      return { ...part, score };
    });
    
    // CRITICAL: Filter out wrong matches (e.g., METTRE CYLINDRE when searching for MAITRE CYLINDRE)
    const filtered = scored.filter(p => {
      const designation = this.normalize(p.designation);
      const queryNorm = context.normalizedQuery;
      
      // Check for conflicting words (ONLY reject if query has word A but result has word B and NOT word A)
      const conflicts = [
        { query: 'maitre', wrong: 'mettre' },
        { query: 'cable', wrong: 'calle' }
      ];
      
      for (const conflict of conflicts) {
        // ONLY reject if: query contains 'maitre' AND designation contains 'mettre' AND designation does NOT contain 'maitre'
        if (queryNorm.includes(conflict.query) && designation.includes(conflict.wrong) && !designation.includes(conflict.query)) {
          return false;
        }
      }
      
      return true;
    });
    
    let results = filtered
      .filter(p => p.score >= this.getMinimumScore(context))
      .sort((a, b) => b.score - a.score || b.stock - a.stock);
    
    console.log(`[SEARCH] After scoring/filtering: ${results.length} qualified results (minScore: ${this.getMinimumScore(context)})`);
    if (results.length > 0) {
      console.log(`[SEARCH] Top 3 scores: ${results.slice(0, 3).map(p => `"${p.designation}" (${p.score})`).join(', ')}`);
    }
    const TOP_N = this.calculateOptimalResultLimit(context, results.length);
    const finalResults = results.slice(0, TOP_N);
    console.log(`[SEARCH] Final results returned: ${finalResults.length} (TOP_N: ${TOP_N})`);
    return finalResults;
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
    const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd', 'sup', 'inf'];
    
    // Get all meaningful terms (not just main part type)
    const meaningfulTerms = expandedTerms.filter(t => 
      t.length >= 3 && !positionWords.includes(t)
    );
    
    if (meaningfulTerms.length === 0) return [];
    
    // CRITICAL: Single OR condition with ALL terms
    // This gets all parts that contain ANY of the terms
    const orConditions = meaningfulTerms.map(term => ({
      OR: [
        { designation: { contains: term, mode: 'insensitive' } },
        { reference: { contains: term, mode: 'insensitive' } }
      ]
    }));
    
    return orConditions;
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
    const designationNormalized = this.normalizeForDB(part.designation);
    const queryNormalized = this.normalizeForDB(context.originalQuery);
    
    // PRIORITY 1: Exact match after removing special chars
    if (designationNormalized === queryNormalized) {
      return 100000;
    }
    
    // PRIORITY 2: Exact designation match (agraffe must match AGRAFFE, not AGRAFE)
    const queryLower = context.originalQuery.toLowerCase().trim();
    const designationLower = part.designation.toLowerCase().trim();
    if (designationLower === queryLower) {
      return 100000;
    }
    
    const designationWords = designation.split(' ').filter(w => w.length >= 1);
    const queryWords = context.rawTokens.filter(w => w.length >= 1);
    
    // ADAPTIVE: Extract ALL meaningful words from query (length >= 3, not positions)
    const meaningfulQueryWords = queryWords.filter(w => 
      w.length >= 3 && 
      !['avant','arriere','gauche','droite','sup','inf','para','pour','avec','sans','tout','tous'].includes(w)
    );
    
    // CRITICAL: For EACH meaningful query word, check if designation has it or a close variant
    for (const qw of meaningfulQueryWords) {
      const hasExactMatch = designationWords.some(dw => dw === qw);
      const hasPluralMatch = designationWords.some(dw => 
        dw === qw + 's' || dw === qw + 'es' || qw === dw + 's' || qw === dw + 'es'
      );
      const hasFuzzyMatch = designationWords.some(dw => this.levenshtein(qw, dw) <= 1);
      
      // If query word is NOT in designation at all → REJECT
      if (!hasExactMatch && !hasPluralMatch && !hasFuzzyMatch) {
        return -1000000;
      }
    }
    
    const positionMap = {
      'avant': ['avant', 'av'],
      'av': ['avant', 'av'],
      'arriere': ['arriere', 'ar'],
      'ar': ['arriere', 'ar'],
      'gauche': ['gauche', 'g'],
      'g': ['gauche', 'g'],
      'droite': ['droite', 'd', 'droit'],
      'd': ['droite', 'd', 'droit'],
      'droit': ['droite', 'd', 'droit'],
      'superieur': ['superieur', 'sup'],
      'sup': ['superieur', 'sup'],
      'inferieur': ['inferieur', 'inf'],
      'inf': ['inferieur', 'inf'],
      'de': ['de']
    };
    
    // Helper to check if word matches
    const wordMatches = (qw: string, dw: string): boolean => {
      // EXACT WORD MATCH - highest priority
      if (qw === dw) return true;
      if (dw === qw) return true;
      if (dw.startsWith(qw + ' ') || dw.endsWith(' ' + qw) || dw.includes(' ' + qw + ' ')) {
        return true;
      }
      if (dw.startsWith(qw) || qw.startsWith(dw)) return true;
      
      // EXACT plural match with double letter (agraffes → AGRAFFES) – highest priority
      if (qw.endsWith('s') && dw === qw) return true;
      if (qw.endsWith('es') && dw === qw) return true;
      
      // Plural/singular matching
      if (qw.endsWith('s') && dw === qw.slice(0, -1)) return true;
      if (dw.endsWith('s') && qw === dw.slice(0, -1)) return true;
      if (qw.endsWith('es') && dw === qw.slice(0, -2)) return true;
      if (dw.endsWith('es') && qw === dw.slice(0, -2)) return true;
      
      // EXACT plural match (agraffes = agraffes)
      if (qw === dw + 's' || dw === qw + 's') return true;
      if (qw === dw + 'es' || dw === qw + 'es') return true;
      
      // Penalize double-letter mismatches – but don't reject
      const qwDouble = qw.includes('ff') || qw.includes('pp') || qw.includes('ll');
      const dwDouble = dw.includes('ff') || dw.includes('pp') || dw.includes('ll');
      if (qwDouble && !dwDouble) {
        // Still match, but we'll apply penalty later
      }
      
      if (this.levenshtein(qw, dw) <= 2) return true;
      return false;
    };
    
    // --- MAIN PART TYPE MATCHING ---
    if (context.mainPartType) {
      const partTypeVariants = this.synonyms[context.mainPartType] || [context.mainPartType];
      const hasMainType = partTypeVariants.some(v => 
        designationWords.some(dw => wordMatches(v, dw))
      );
      
      // CRITICAL: Reject if main part type is missing
      if (!hasMainType) {
        return -1000000; // Absolute rejection
      }
      
      score += 5000; // Bonus if present
    }
    
    // --- NUMERIC DIMENSION MATCHING ---
    const queryNumbers = context.originalQuery.match(/\d+(?:[.,]\d+)?/g) || [];
    const designationNumbers = part.designation.match(/\d+(?:[.,]\d+)?/g) || [];

    if (queryNumbers.length > 0 && designationNumbers.length > 0) {
      const hasExactMatch = queryNumbers.some(qn => 
        designationNumbers.some(dn => {
          const qNum = parseFloat(qn.replace(',', '.'));
          const dNum = parseFloat(dn.replace(',', '.'));
          // CRITICAL: Handle both "3.24" and "324" formats
          // If query is "324" and DB is "3.24", divide query by 100
          const qNumAdjusted = qNum >= 100 ? qNum / 100 : qNum;
          return Math.abs(qNumAdjusted - dNum) < 0.01; // 0.01 tolerance
        })
      );
      
      if (!hasExactMatch) {
        return -1000000; // REJECT – wrong dimension
      }
      
      // Bonus for exact match (adds to score)
      const exactBonus = queryNumbers.filter(qn => 
        designationNumbers.some(dn => {
          const qNum = parseFloat(qn.replace(',', '.'));
          const dNum = parseFloat(dn.replace(',', '.'));
          const qNumAdjusted = qNum >= 100 ? qNum / 100 : qNum;
          return Math.abs(qNumAdjusted - dNum) < 0.01;
        })
      ).length * 50000;
      score += exactBonus;
    }
    
    // Count how many query words match
    let matchCount = 0;
    let mainPartMatched = false;
    const matchedWords = new Set<string>();
    
    queryWords.forEach(qw => {
      const variants = positionMap[qw] || [qw];
      const withPlural = [...variants, ...variants.map(v => v + 's'), ...variants.map(v => v + 'es')];
      const fuzzyMatches = this.findFuzzyMatches(qw);
      const allVariants = [...withPlural, ...fuzzyMatches];
      
      if (allVariants.some(v => designationWords.some(dw => wordMatches(v, dw)))) {
        matchCount++;
        matchedWords.add(qw);
        if (context.mainPartType && qw === context.mainPartType) {
          mainPartMatched = true;
        }
      }
    });
    
    // If NO query words match at all → reject
    if (matchCount === 0) {
      return -1000000;
    }
    
    // CRITICAL: ALL important words must match
    const importantQueryWords = queryWords.filter(w => 
      w.length > 2 && 
      !['avant','arriere','gauche','droite','av','ar','g','d','sup','inf','para','de'].includes(w)
    );

    // STRICT: Reject if ANY important word is missing
    const missingImportantWords = importantQueryWords.filter(w => !matchedWords.has(w));
    if (missingImportantWords.length > 0) {
      // Check if missing words have fuzzy matches in designation
      const hasFuzzyMatch = missingImportantWords.every(mw => {
        const fuzzy = this.findFuzzyMatches(mw);
        return fuzzy.some(f => designationWords.some(dw => wordMatches(f, dw)));
      });
      
      if (!hasFuzzyMatch) {
        return -1000000; // REJECT if important words missing
      }
    }
    
    // CRITICAL: Heavy penalty for double-letter mismatches (agraffe vs agrafe)
    for (const qw of queryWords) {
      // Check if query has double letters
      const hasDoubleF = qw.includes('ff');
      const hasDoubleP = qw.includes('pp');
      const hasDoubleL = qw.includes('ll');
      
      if (hasDoubleF || hasDoubleP || hasDoubleL) {
        // Check if designation has the SAME double letter
        const designationHasDoubleF = designationWords.some(dw => dw.includes('ff'));
        const designationHasDoubleP = designationWords.some(dw => dw.includes('pp'));
        const designationHasDoubleL = designationWords.some(dw => dw.includes('ll'));
        
        // If query has 'ff' but designation doesn't → REJECT
        if (hasDoubleF && !designationHasDoubleF) {
          return -1000000;
        }
        if (hasDoubleP && !designationHasDoubleP) {
          return -1000000;
        }
        if (hasDoubleL && !designationHasDoubleL) {
          return -1000000;
        }
      }
    }
    
    // Perfect match bonus
    if (matchCount === queryWords.length && designationWords.length === queryWords.length) {
      return 100000;
    }
    
    // CRITICAL: Bonus for matching ALL query words (even if designation has extra words)
    if (matchCount === queryWords.length) {
      score += 80000; // was 60000 – higher bonus for complete match
    }
    
    // Good match with extra words
    const extraWords = designationWords.length - queryWords.length;
    score += 50000 - (extraWords * 2000);
    
    return score;
  }

  private calculatePositionMatches(part: any, positionInfo: PositionRequirements): number {
    let score = 0;
    const designation = part.designation.toLowerCase();
    
    const hasAvant = /\b(avant|av)\b/i.test(designation);
    const hasArriere = /\b(arriere|arrière|ar)\b/i.test(designation);
    const hasGauche = /\b(gauche|g|conducteur)\b/i.test(designation);
    const hasDroite = /\b(droite|d|passager)\b/i.test(designation);
    
    // CRITICAL: Parts can have MULTIPLE positions (e.g., "ADHESIF AR PORTE AV G")
    // Only reject if part has WRONG position AND doesn't have the RIGHT one
    if (positionInfo.avant && !hasAvant && hasArriere) return -100000;
    if (positionInfo.arriere && !hasArriere && hasAvant) return -100000;
    if (positionInfo.gauche && !hasGauche && hasDroite) return -100000;
    if (positionInfo.droite && !hasDroite && hasGauche) return -100000;
    
    // Reduced bonus for correct position (was 8000, now 500)
    if (positionInfo.avant && hasAvant) score += 500;
    if (positionInfo.arriere && hasArriere) score += 500;
    if (positionInfo.gauche && hasGauche) score += 500;
    if (positionInfo.droite && hasDroite) score += 500;
    
    // Penalty for containing opposite position when query specifies position
    if (positionInfo.avant && hasArriere) score -= 20000;
    if (positionInfo.arriere && hasAvant) score -= 20000;
    if (positionInfo.gauche && hasDroite) score -= 20000;
    if (positionInfo.droite && hasGauche) score -= 20000;
    
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
    const isOnlyPosition = context.expandedTerms.length === 1 && 
                          (context.positionInfo.avant || context.positionInfo.arriere || 
                           context.positionInfo.gauche || context.positionInfo.droite);
    
    if (isOnlyPosition) return 0;
    
    // DYNAMIC: Lower thresholds based on token coverage
    const contentTokens = context.rawTokens.filter(t => 
      t.length >= 3 && 
      !['avant','arriere','gauche','droite','av','ar','g','d'].includes(t)
    );
    
    // CRITICAL: Much lower thresholds to allow multi-word matches like "agraphe para soleil"
    if (contentTokens.length >= 3) return 200; // was 500
    if (contentTokens.length === 2) return 100; // was 300
    return 50; // was 100
  }

  private calculateOptimalResultLimit(context: SearchContext, availableResults: number): number {
    // Show up to 10 good results (allows left/right variants)
    return Math.min(availableResults, 10);
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents: é→e, è→e, à→a
      .replace(/[^a-z0-9\s-]/g, ' ') // Remove special chars: (,):' etc
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Normalize for DB comparison (handles special chars in DB)
  private normalizeForDB(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[(),:'\.\-]/g, '') // Remove parentheses, commas, colons, apostrophes, dots, hyphens
      .replace(/\s+/g, '')
      .trim();
  }

  // Tokenize with an option to preserve short tokens (like 'av','ar') used for position detection.
  private async tokenize(text: string, preserveShort = false): Promise<string[]> {
    if (!text || text.trim().length === 0) return [];
    
    // CRITICAL: Handle concatenated words (no spaces)
    if (!text.includes(' ') && text.length > 6) {
      const segmented = await this.segmentConcatenatedQuery(text);
      if (segmented.length > 1) {
        console.log(`[TOKENIZE] Segmented "${text}" → [${segmented.join(', ')}]`);
        text = segmented.join(' ');
      }
    }
    
    const parts = text.split(' ').map(p => p.trim()).filter(Boolean);
    if (preserveShort) return parts;
    return parts.filter(t => t.length > 2);
  }
  
  private async segmentConcatenatedQuery(text: string): Promise<string[]> {
    try {
      const prompt = `You are a car parts query parser. Segment this concatenated French car parts query into separate words.

Rules:
- Recognize car part names: adhesif, porte, aile, capot, phare, filtre, plaquette, disque, amortisseur, etc.
- Recognize positions: avant/av, arriere/ar, gauche/g, droite/d, superieur/sup, inferieur/inf
- Return ONLY the segmented words separated by spaces
- If already segmented, return as-is

Query: "${text}"

Segmented:`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 100
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`
        },
        timeout: 5000
      });

      const segmented = response.data.choices?.[0]?.message?.content?.trim() || text;
      const words = segmented.split(/\s+/).filter(Boolean);
      console.log(`[AI-SEGMENT] "${text}" → [${words.join(', ')}]`);
      return words.length > 1 ? words : [text];
    } catch (error) {
      console.error('[AI-SEGMENT] Error:', error.message);
      return this.fallbackSegmentation(text);
    }
  }

  private fallbackSegmentation(text: string): string[] {
    const knownWords = [
      ...Object.keys(this.typeWeights),
      ...Object.keys(this.synonyms),
      'avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'sup', 'inf', 'int', 'ext', 'de'
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
    
    // If we still have leftover text, try right-to-left segmentation
    if (remaining.length > 0 && segments.length === 0) {
      const reversed = text.split('').reverse().join('');
      const revSegments = this.fallbackSegmentation(reversed);
      if (revSegments.length > 1) {
        return revSegments.map(s => s.split('').reverse().join('')).reverse();
      }
    }
    
    return segments.length > 1 ? segments : [text];
  }

  private expandWithSynonymsContextual(tokens: string[], originalQuery: string): string[] {
    const expanded = new Set<string>();
    
    tokens.forEach(token => {
      expanded.add(token);
      
      // CRITICAL: If token has double letters (ff, pp, ll), DON'T add fuzzy matches
      const hasDoubleLetters = token.includes('ff') || token.includes('pp') || token.includes('ll');
      
      // Only add fuzzy matches if token is NOT a known category AND doesn't have double letters
      const normalizedToken = this.normalize(token);
      const isKnown = this.normalizedSynonymLookup[normalizedToken] !== undefined;
      
      // CRITICAL: Don't fuzzy expand if token has double letters OR is a known word
      if (!isKnown && !hasDoubleLetters) {
        const fuzzyMatches = this.findFuzzyMatches(token);
        if (fuzzyMatches.length > 0) {
          // CRITICAL: Filter out fuzzy matches that differ in double letters
          const validFuzzy = fuzzyMatches.filter(fm => {
            const tokenHasFF = token.includes('ff');
            const tokenHasPP = token.includes('pp');
            const tokenHasLL = token.includes('ll');
            const fmHasFF = fm.includes('ff');
            const fmHasPP = fm.includes('pp');
            const fmHasLL = fm.includes('ll');
            // Only allow if double-letter status matches
            return (tokenHasFF === fmHasFF) && (tokenHasPP === fmHasPP) && (tokenHasLL === fmHasLL);
          });
          if (validFuzzy.length > 0) {
            expanded.add(validFuzzy[0]); // Best fuzzy match only
          }
        }
      }
      
      // Always add primary category if exists
      const primaryCategory = this.findPrimaryCategory(token);
      if (primaryCategory) {
        expanded.add(primaryCategory);
      }
    });
    
    return Array.from(expanded);
  }
  
  private findFuzzyMatches(token: string): string[] {
    if (token.length < 3) return [];
    
    // If token is already a known category, don't fuzzy expand to a different category
    const normalizedToken = this.normalize(token);
    if (this.normalizedSynonymLookup[normalizedToken]) {
      return []; // Exact known word → no fuzzy matches
    }
    
    const matches: string[] = [];
    const knownWords = [...new Set([
      ...Object.keys(this.typeWeights),
      ...Object.keys(this.synonyms)
    ])];
    
    for (const word of knownWords) {
      if (word === token || word.length < 3) continue;
      
      // Transposition of first two letters (garafe → agrafe)
      if (word.length === token.length && 
          word[0] === token[1] && 
          word[1] === token[0] && 
          word.slice(2) === token.slice(2)) {
        matches.push(word);
        continue;
      }
      
      // PRIORITY 1: Exact substring match (grafe in agrafe)
      if (word.includes(token) && word.length - token.length <= 2) {
        matches.push(word);
        continue;
      }
      if (token.includes(word) && token.length - word.length <= 2) {
        matches.push(word);
        continue;
      }
      
      // PRIORITY 2: Missing/extra first letter (grafe → agrafe, iale → aile)
      if (word.length === token.length + 1 && word.slice(1) === token) {
        matches.push(word);
        continue;
      }
      if (token.length === word.length + 1 && token.slice(1) === word) {
        matches.push(word);
        continue;
      }
      
      // PRIORITY 3: Same length, different first letter (garafe → agrafe)
      if (word.length === token.length && word.slice(1) === token.slice(1)) {
        matches.push(word);
        continue;
      }
      
      // PRIORITY 3.5: Double first letter typo (ppareil → appareil)
      if (token.length >= 4 && token[0] === token[1]) {
        const withoutDouble = token[0] + token.slice(2);
        if (word === withoutDouble || this.levenshtein(word, withoutDouble) <= 1) {
          matches.push(word);
          continue;
        }
      }
      
      // PRIORITY 4: Levenshtein distance <= 2 for similar-length words (garafes → agrafes, garafe → agrafe)
      // RELAXED: Allow distance 2 for words 5+ chars
      const distance = this.levenshtein(word, token);
      if (distance <= 2 && Math.abs(word.length - token.length) <= 2 && word.length >= 4) {
        matches.push(word);
      }
    }
    
    // PRIORITY 5: Plural handling (agrafe ↔ agrafes, agraffe ↔ agraffes)
    if (token.endsWith('s') && token.length > 3) {
      const singular = token.slice(0, -1);
      if (knownWords.includes(singular)) {
        matches.push(singular);
      }
      // Handle -es plural (agrafes → agrafe)
      if (token.endsWith('es') && token.length > 4) {
        const singularEs = token.slice(0, -2);
        if (knownWords.includes(singularEs)) {
          matches.push(singularEs);
        }
      }
    } else {
      // Add plural forms
      const pluralS = token + 's';
      const pluralEs = token + 'es';
      if (knownWords.includes(pluralS)) matches.push(pluralS);
      if (knownWords.includes(pluralEs)) matches.push(pluralEs);
    }
    
    return [...new Set(matches)];
  }
  
  private longestCommonSubstring(str1: string, str2: string): string {
    let longest = '';
    for (let i = 0; i < str1.length; i++) {
      for (let j = i + 1; j <= str1.length; j++) {
        const substring = str1.slice(i, j);
        if (str2.includes(substring) && substring.length > longest.length) {
          longest = substring;
        }
      }
    }
    return longest;
  }
  
  private levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
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

  private findPrimaryCategory(token: string): string | null {
    const normalizedToken = this.normalize(token);
    if (this.normalizedSynonymLookup[normalizedToken]) {
      return this.normalizedSynonymLookup[normalizedToken];
    }
    return null;
  }

  private normalizeTunisian(query: string): string {
    // CRITICAL: Don't apply Tunisian fallback to "triangle" queries
    const normalized = this.normalize(query);
    if (normalized.includes('triangle') || normalized.includes('triangl')) {
      return ''; // Return empty to skip Tunisian normalization
    }
    
    // Apply word-by-word Tunisian normalization using unified dictionary
    let result = query.toLowerCase();
    for (const [tunisian, french] of Object.entries(tunisianDictionary)) {
      const regex = new RegExp(`\\b${tunisian}\\b`, 'gi');
      result = result.replace(regex, french);
    }
    
    return result !== query.toLowerCase() ? result : '';
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

  getSynonymMap(): Record<string, string[]> {
    return this.synonyms;
  }
}