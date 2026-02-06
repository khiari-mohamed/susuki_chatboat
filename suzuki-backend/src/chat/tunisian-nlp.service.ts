/*import { Injectable } from '@nestjs/common';
import * as levenshtein from 'fast-levenshtein';

@Injectable()
export class TunisianNlpService {
  // ===== EXPANDED ALIASES (NEW WORDS) =====
  private readonly expandedAliases = {
    // ===== BASIC VERBS =====
    'nchouf': 'voir',
    'nra': 'voir',
    'nrid': 'vouloir',
    'n7awel': 'essayer',
    'n7el': 'ouvrir',
    'nsaker': 'fermer',
    'nsakar': 'fermer',
    'nsala7': 'réparer',
    'nwasel': 'continuer',

    // ===== REQUESTS =====
    'atini': 'donnez-moi',
    'a3tini': 'donnez-moi',
    'habbeb': 'svp',
    'stp': 'svp',
    'svp': 'svp',
    'mchet': 'parti',
    'mchich': 'pas parti',

    // ===== QUESTIONS =====
    'qadeh': 'combien',
    '9adeh': 'combien',
    'kifeh': 'comment',
    'wesh': 'quoi',
    'chnowa': 'quoi',
    'chnoa': 'quoi',
    'shenhou': 'quoi',
    '9bal': 'avant',
    'ba3d': 'après',

    // ===== LOCATIONS =====
    'branch': 'agence',
    'ferrana': 'où',
    'hinni': 'où',
    'mnathe': 'où',

    // ===== COMMON EXPRESSIONS =====
    'tawa': 'maintenant',
    'daba': 'maintenant',
    'tawa tawa': 'tout de suite',
    'zarba': 'rapidement',
    'barcha': 'beaucoup',
    'yekhi': 'vraiment',
    'saretli': 'il m\'est arrivé',
    'yoj3ni': 'me fait mal',
    'mrigel': 'bien',
    'mouch mrigel': 'pas bon',

    // ===== VEHICLE USAGE =====
    'yitfassakh': 's\'efface',
    'ysayb': 'lâche',
    'ysakar': 'ferme',
    'ytfasakh': 'supprimer',
    'y7izz': 'soulève',
    'yrawwah': 'chauffe',
    'yatfa': 's\'éteint',

    // ===== CONDITIONS / PROBLEMS =====
    'yetnaffakh': 'gonfle',
    'tnaffakh': 'gonfle',
    'yisrag': 'fuit',
    'tsarbig': 'glisse',
    'yetfasakh': 's\'efface',
    'yrouj': 'vibre',
    'yrekbek': 'claque',
    'yfasakh': 'supprimer',
    'y7mi': 'chauffe',

    // ===== CAR MECHANIC TERMS =====
    'motour': 'moteur',
    'piloto': 'volant',
    'karcho': 'carrosserie',
    'flech': 'phare',
    'flach': 'phare',
    'stop': 'feu arrière',
    'rampi': 'rampe',
    'bwita': 'boîte de vitesse',
    'bit vitess': 'boîte de vitesse',
    'bit vitesse': 'boîte de vitesse',
    'vitesse': 'vitesse',
    'boita': 'boîte de vitesse',
    'demarage': 'démarrage',
    'contact': 'contact',

    // ==== MORE AUTO-PART SLANG ====
    'bouret': 'bouchon',
    'tabouna': 'échappement',
    'echap': 'échappement',
    'pot echap': 'échappement',
    'kabssa': 'pédale',
    'frina': 'frein',
    'kabda': 'levier',
    'darwila': 'roulement',
    'roulement': 'roulement',
    'blasa': 'endroit',
    'lassa': 'joint',
    'joint': 'joint',

    // ===== TUNISIAN NOISE DESCRIPTIONS =====
    'tqalleq': 'fait du bruit',
    'y9alleq': 'fait du bruit',
    'yhdem': 'marche mal',
    'ytratar': 'ratatouille',
    'yregdeg': 'vibre',
    'yetnaffa5': 'gonfle',
    'ydayekh': 'étouffe',
    'ysouff': 'souffle',

    // ===== SALES / DEALERSHIP =====
    'pris': 'prix',
    'pry': 'prix',
    's3r': 'prix',
    'tsoum': 'prix',
    'tas3ira': 'prix',
    'tarif': 'prix',

    // ===== FINANCE =====
    'kredy': 'crédit',
    'kredit': 'crédit',
    'taslif': 'crédit',
    'versement': 'versement',
    'qist': 'mensualité',
    'qast': 'mensualité',

    // ===== DELIVERY / SERVICE =====
    'livri': 'livrer',
    'liveri': 'livrer',
    'livraison': 'livraison',
    'rdv': 'rendez-vous',
    'rendez vous': 'rendez-vous',
    'mtjorra': 'commande',
    'command': 'commande',
    'sav': 'service après vente',
    'atelier': 'atelier',
  };

  private readonly tunisianAliases = {
    'nheb': 'je veux',
    'nhab': 'je veux',
    'n7eb': 'je veux',
    'nchri': 'acheter',
    'nheb nchri': 'je veux acheter',
    'n3abi': 'remplir',
    'n9aleb': 'chercher',
    'nfasakh': 'chercher',
    'n7awel': 'essayer',
    'n7ot': 'mettre',
    'nrod': 'retourner',
    'n9ayed': 'réparer',
    'n9awem': 'réparer',
    'n3amer': 'remplir',
    'najm': 'puis-je',
    'najem': 'puis-je',
    'ch7al': 'combien',
    'chhal': 'combien',
    'kifesh': 'comment',
    'kifech': 'comment',
    'win': 'où',
    'oukif': 'où',
    'fein': 'où',
    'mawjoud': 'disponible',
    'mawjouda': 'disponible',
    'mawjoudin': 'disponible',
    'fama': 'y a-t-il',
    'ynajjem': 'puis-je',
    'istarja3': 'retourner',
    'tbdil': 'remplacement',
    'tbaddel': 'changer',
    'badel': 'changer',
    'taslih': 'réparation',
    'salah': 'réparation',
    'tsalih': 'réparation',
    't3amir': 'remplissage',
    't3abiya': 'remplissage',
    'zit': 'huile',
    'zid': 'huile',
    'frin': 'frein',
    'frein': 'frein',
    'batarie': 'batterie',
    'batri': 'batterie',
    'bataria': 'batterie',
    'klaxon': 'klaxon',
    'klakson': 'klaxon',
    'capot': 'capot',
    'kabout': 'capot',
    'capo': 'capot',
    'retroviseur': 'rétroviseur',
    'retrviseur': 'rétroviseur',
    'retro': 'rétroviseur',
    'miray': 'rétroviseur',
    'mirroir': 'rétroviseur',
    'vitre': 'vitre',
    'vitra': 'vitre',
    'bzaza': 'vitre',
    'portiere': 'portière',
    'beb': 'portière',
    'bab': 'portière',
    'coffre': 'coffre',
    'cofre': 'coffre',
    'pneu': 'pneu',
    'pnio': 'pneu',
    'roue': 'roue',
    'rwiya': 'roue',
    'balai': 'essuie-glace',
    'essuie': 'essuie-glace',
    'wipers': 'essuie-glace',
    'plaquette': 'plaquette de frein',
    'plaquet': 'plaquette de frein',
    'plakit': 'plaquette de frein',
    'disque': 'disque de frein',
    'disk': 'disque de frein',
    'filtre': 'filtre',
    'filter': 'filtre',
    'bougie': 'bougie',
    'bugi': 'bougie',
    'borgia': 'bougie',
    'courroie': 'courroie',
    'kouraya': 'courroie',
    'amortisseur': 'amortisseur',
    'amortisur': 'amortisseur',
    'amortis': 'amortisseur',
    'radiateur': 'radiateur',
    'redyateur': 'radiateur',
    'radiatir': 'radiateur',
    'ventilateur': 'ventilateur',
    'ventilo': 'ventilateur',
    'clim': 'climatisation',
    'klim': 'climatisation',
    'climatisation': 'climatisation',
    'airbag': 'airbag',
    'serpentine': 'courroie',
    'alternateur': 'alternateur',
    'altirnator': 'alternateur',
    'demarreur': 'démarreur',
    'dmarreur': 'démarreur',
    'démarreur': 'démarreur',
    'essence': 'essence',
    'mazout': 'diesel',
    'mazot': 'diesel',
    'carburant': 'carburant',
    'benzine': 'essence',
    'huile moteur': 'huile moteur',
    'liquide frein': 'liquide de frein',
    'liquide radiateur': 'liquide de refroidissement',
    'marka': 'marque',
    'modil': 'modèle',
    'modele': 'modèle',
    'suzuki': 'suzuki',
    'swift': 'swift',
    'vitara': 'vitara',
    'ciaz': 'ciaz',
    'alto': 'alto',
    'jimny': 'jimny',
    'ya3ni': 'c\'est-à-dire',
    'bech': 'va',
    'beshi': 'va',
    'saretli': 'il m\'est arrivé',
    'saret': 'arrivé',
    'mouch': 'pas',
    'moch': 'pas',
    'mush': 'pas',
    'barsha': 'beaucoup',
    'yesser': 'beaucoup',
    'akther': 'plus',
    'klem': 'paroles',
    'lazem': 'il faut',
    '3andkom': 'avez-vous',
    'andkom': 'avez-vous',
    'retrovisor': 'rétroviseur',
    'moteur': 'moteur',
    'phare': 'phare',
    'feu': 'feu',
    'pare': 'pare-choc',
    'siege': 'siège',
    'volant': 'volant',
    'pedale': 'pédale',
    'embrayage': 'embrayage',
    'transmission': 'transmission',
  };

  // ===== CUSTOM WORDS (YOUR CHOICE) =====
  private readonly customWords = {
    'barsha': 'beaucoup',
    'shnuwa': 'quoi',
    '3lech': 'pourquoi',
    'kifeh': 'comment',
    'wen': 'où',
    'ama': 'mais',
    'yesser': 'beaucoup',
    'behi': 'bien',
    'mouch': 'pas',
    'malla': 'quel',
    '9adeh': 'combien',
    'qol': 'dire',
    'mahouch': 'pas',
    'manich': 'pas',
    'nheb': 'vouloir',
    'naaref': 'savoir',
    'maareftech': 'ne sais pas',
    'yemchi': 'fonctionne',
    'mayemchich': 'ne fonctionne pas',
    'sabb': 'verser',
    'khater': 'parce que',
    'aayeb': 'honteux',
    'fama': 'il y a',
    'mafama': 'pas',
    'saghir': 'petit',
    'kbir': 'grand',
    'zid': 'ajoute',
    'n9es': 'réduire',
    '3ayyet': 'appeler',
    'jibli': 'apporte',
    'khrej': 'sortir',
    'dkhel': 'entrer',
    'mrigel': 'propre',
    'fassed': 'cassé',
    'msaker': 'fermé',
    'maftouh': 'ouvert',
    'mouchkila': 'problème',
    'sahl': 'facile',
    'saab': 'difficile',
    '7adhra': 'conversation',
    'tawa': 'maintenant',
    'baad': 'après',
    '9bal': 'avant',
    'yom': 'jour',
    'layli': 'nuit',
    'sbah': 'matin',
    'gharbi': 'occidental',
    'sharqi': 'oriental',
    'mte3': 'de',
    'mtoubal': 'assaisonné',
    'mrid': 'malade',
    'taaben': 'fatigué',
    'marqoud': 'malchanceux',
    'meziana': 'jolie',
    'zwina': 'belle',
    'krohom': 'empruntez',
    'nestahel': 'mériter',
    'nrouh': 'rentrer',
    'ne5dem': 'travailler',
    'bech': 'pour',
    'ya3tik saha': 'merci',
    'yebarek': 'bénir',
    'mabrouk': 'félicitations',
    'tfadhal': 'voilà',
    'nesta3mel': 'utiliser',
    'nabda': 'commencer',
    'nkamel': 'finir',
    'tsna': 'attendre',
    'estanna': 'attends',
    'sari3': 'rapide',
    'bshwaya': 'doucement',
    'mchet': 'partie',
    'mcha': 'parti',
    'jib': 'apporte',
    'hat': 'mettre',
    'shof': 'regarde',
    'isma3': 'écoute',
    'fhem': 'comprends',
    'mafhamekch': 'pas compris',
    'ya hassen': 'mon dieu',
    'ya latif': 'oh mon dieu',
    'tawa tawa': 'tout de suite',
    'sayeb': 'lâche',
    'saker': 'fermer',
    '7ell': 'ouvrir',
    'ktar': 'plus',
    '9alil': 'peu',
    'fadd': 'ennuyé',
    'frach': 'propre',
    'dalla3': 'gâter',
    'barcha flouss': 'beaucoup argent',
    '9ars': 'mordre',
    'nizel': 'descendre',
    'tla3': 'monter',
    '9awem': 'lever',
    'okhra': 'autre',
    'madi': 'passé',
    'mouhim': 'important',
    'ma3lich': 'pas grave',
    'choufli': 'regarde pour moi',
    'sir': 'va',
    'ji': 'viens',
    'mouch haka': 'pas comme ça',
    'ki yatleb': 'quand demande',
    'marra': 'fois',
    'nesma3': 'écoute',
    'nharek ziin': 'bonne journée',
    'leila sa3ida': 'bonne nuit',
    'rani': 'je suis',
    'rani jai': 'arrive',
    '9awd': 'répète',
    't9oul': 'dire',
    '3ade': 'donc',
    'mouch mochkla': 'pas problème',
    'sayebni': 'laisse-moi',
    '3tini': 'donne-moi',
    'mabrrouk': 'félicitations',
    'barcha mra': 'très souvent',
    'hkeya': 'histoire',
    'tari9': 'route',
    'malla jaw': 'quel temps',
    '9ahwa': 'café',
    'may': 'eau',
    'beyya': 'bien',
    '3ali': 'sur',
    'ta7t': 'sous',
    'fou9': 'dessus',
    'dhaher': 'visible',
    'mghayer': 'différent',
    'masroura': 'contente',
    'farhan': 'content',
    'metghach': 'fâché',
    'mesta3jel': 'pressé',
    '7asra': 'dommage',
    'ya hram': 'quel dommage',
    'msamna': 'feuilleté',
    'makroudh': 'gâteau traditionnel',
    'bnina': 'délicieux',
    'mkarmla': 'caramélisée',
    'mrattba': 'rangée',
    'ghali': 'cher',
    'rkhis': 'pas cher',
    'moujoud': 'disponible',
    'mesker': 'fermé',
    'moufid': 'utile',
    'nabdh': 'pouls',
    'najjim': 'peux',
    'yhebb': 'aime',
    'mawjoudin': 'présents',
    'bascouta': 'essuie-glace',
  };

  private readonly carParts = [
    'rétroviseur', 'essuie-glace', 'plaquette de frein', 'disque de frein',
    'filtre à huile', 'filtre à air', 'bougie', 'courroie', 'amortisseur',
    'pneu', 'batterie', 'phare', 'feu arrière', 'pare-choc', 'capot',
    'portière', 'vitre', 'volant', 'siège', 'pédale', 'embrayage',
    'radiateur', 'ventilateur', 'climatisation', 'huile moteur', 'liquide de frein',
    'liquide de refroidissement', 'transmission', 'alternateur', 'démarreur',
    'klaxon', 'ceinture de sécurité', 'airbag', 'coffre', 'roue'
  ];

  normalizeTunisianText(text: string): string {
    let normalized = text.toLowerCase().trim();
    
    normalized = normalized.replace(/3/g, 'a');
    normalized = normalized.replace(/7/g, 'h');
    normalized = normalized.replace(/9/g, 'q');
    
    Object.entries(this.customWords).forEach(([tunisian, french]) => {
      const regex = new RegExp(`\\b${tunisian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      normalized = normalized.replace(regex, french);
    });

    Object.entries(this.expandedAliases).forEach(([tunisian, french]) => {
      const regex = new RegExp(`\\b${tunisian}\\b`, 'gi');
      normalized = normalized.replace(regex, french);
    });

    Object.entries(this.tunisianAliases).forEach(([tunisian, french]) => {
      const regex = new RegExp(`\\b${tunisian}\\b`, 'gi');
      normalized = normalized.replace(regex, french);
    });
    
    return normalized;
  }

  correctTypos(word: string, threshold: number = 2): string {
    let bestMatch = word;
    let minDistance = threshold;
    
    for (const part of this.carParts) {
      const distance = levenshtein.get(word.toLowerCase(), part.toLowerCase());
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = part;
      }
    }
    
    return bestMatch;
  }

  fuzzyMatchParts(query: string): string[] {
    const normalized = this.normalizeTunisianText(query);
    const words = normalized.split(' ');
    const matches: string[] = [];
    
    words.forEach(word => {
      if (word.length > 3) {
        const corrected = this.correctTypos(word);
        if (corrected !== word) {
          matches.push(corrected);
        }
      }
    });
    
    return matches.length > 0 ? matches : [normalized];
  }

  extractSearchTerms(message: string): string[] {
    const normalized = this.normalizeTunisianText(message);
    const fuzzyMatches = this.fuzzyMatchParts(message);
    
    return [...new Set([...normalized.split(' '), ...fuzzyMatches])].filter(
      term => term.length > 2
    );
  }
}
*/