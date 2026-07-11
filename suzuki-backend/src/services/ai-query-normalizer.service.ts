// src/services/ai-query-normalizer.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: carPartNames list extended to cover ALL French terms now
//         present in designation_2 (the primary search field).
//         Previously many French part names were missing, causing
//         the AI normalizer to call the OpenAI API unnecessarily —
//         or worse, to mutate valid French part queries.
//
// FIX-2: knownCorrections map extended with French-specific typos
//         that users commonly make when typing designation_2 names.
//
// FIX-3: AI prompt updated to explicitly mention designation_2 is
//         now the primary field, and that French names must be
//         preserved verbatim (not translated to English OEM).
//
// FIX-4: extractMeaningfulWords() stop-word list extended to include
//         common French filler words that appear in designation_2
//         values and should not be validated as mandatory tokens.
//
// FIX-5: applyTunisianNormalization() fallback now also preserves
//         any French part name tokens that survived alongside
//         Tunisian words (mixed queries like "n7eb retroviseur").
//
// NOTE: synonyms.service.ts is architecturally correct and does not
//       need structural changes. See synonyms.service.ts fix notes
//       at the bottom of this file.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../chat/openai.service';
import { SynonymsService } from '../synonyms/synonyms.service';

@Injectable()
export class AIQueryNormalizerService {
  private readonly logger = new Logger(AIQueryNormalizerService.name);
  private tunisianWordSet: Set<string> | null = null;

  constructor(
    private openaiService: OpenAIService,
    private synonymsService: SynonymsService,
  ) {}

  private getTunisianWordSet(): Set<string> {
    if (!this.tunisianWordSet) {
      this.tunisianWordSet = new Set(Object.keys(this.synonymsService.getTunisianMap()));
    }
    return this.tunisianWordSet;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: Comprehensive French car part name list.
  // Covers BOTH designation_2 French names AND designation English
  // OEM terms so that queries in either language bypass unnecessary
  // AI normalization when no Tunisian marker is present.
  // ─────────────────────────────────────────────────────────────────
  private readonly carPartNames: string[] = [
    // ── Braking ──────────────────────────────────────────────────
    'maitre', 'maître', 'cylindre', 'etrier', 'étrier', 'frein', 'frina',
    'plaquette', 'plaquettes', 'disque', 'disques', 'tambour', 'sabot',
    // ── Suspension / steering ────────────────────────────────────
    'amortisseur', 'amortisseurs', 'ressort', 'rotule', 'triangle', 'biellette',
    'bras', 'cremaillere', 'crémaillère', 'silent', 'silentbloc', 'coupelle',
    'moyeu', 'roulement', 'roulements', 'soufflet', 'stabilisatrice',
    // ── Engine ───────────────────────────────────────────────────
    'culasse', 'piston', 'segment', 'bielle', 'vilebrequin', 'vilbrequin',
    'soupape', 'joint', 'joints', 'courroie', 'distribution', 'tendeur',
    'poulie', 'volant', 'cardan', 'embrayage',
    // ── Filters ──────────────────────────────────────────────────
    'filtre', 'filtres',
    // ── Electrical ───────────────────────────────────────────────
    'batterie', 'alternateur', 'démarreur', 'demarreur', 'bougie', 'bougies',
    'bobine', 'capteur', 'capteurs', 'calculateur', 'faisceau', 'fusible',
    'relais', 'contacteur', 'commodo', 'commande', 'radar',
    // ── Cooling ──────────────────────────────────────────────────
    'radiateur', 'durite', 'durites', 'pompe', 'thermostat', 'condenseur',
    'compresseur', 'vase', 'reservoir',
    // ── Fuel / injection ─────────────────────────────────────────
    'injecteur', 'injecteurs',
    // ── Exhaust ──────────────────────────────────────────────────
    'silencieux', 'echappement', 'catalyseur', 'collecteur',
    // ── Body / panels — FIX-1: these were missing ────────────────
    'aile', 'capot', 'porte', 'pare', 'choc', 'parechoc', 'pare-choc',
    'calandre', 'malle', 'coffre', 'vitre', 'lunette', 'parebrise',
    'pare-brise', 'baguette', 'moulure', 'seuil', 'longeron', 'traverse',
    'renfort', 'tablier', 'plancher', 'toit', 'custode', 'hayon',
    'charniere', 'serrure', 'loquet', 'poignee', 'garniture', 'enjoliveur',
    // ── Lighting — FIX-1: these were missing ─────────────────────
    'phare', 'phares', 'feu', 'feux', 'optique', 'clignotant', 'clignotants',
    'catadioptre', 'lampe', 'ampoule',
    // ── Interior — FIX-1: these were missing ─────────────────────
    'siege', 'sièges', 'ceinture', 'volant', 'tableau', 'tapis', 'airbag',
    'retroviseur', 'rétroviseur', 'retro',
    // ── Wipers / washer — FIX-1: these were missing ──────────────
    'essuie', 'balai', 'leve', 'monte',
    // ── Misc ─────────────────────────────────────────────────────
    'agrafe', 'agraffe', 'agraphe', 'agrafes', 'agraffes', 'agraphes',
    'valve', 'soupape', 'cache', 'support', 'clip', 'vis', 'boulon',
    'ecrou', 'rondelle', 'cric', 'antenne', 'klaxon',
  ];

  async normalizeQuery(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    const lowerQuery = query.toLowerCase();

    // FIX-1: Use the extended car part name list
    const isCarPart = this.carPartNames.some((part) => lowerQuery.includes(part));

    const isServiceQuestion =
      /ouvrez|ouvert|heure|horaire|livraison|délai|garantie|situé|adresse|où|localisation/i.test(lowerQuery);

    // Tunisian marker detection — unchanged
    const hasTunisianMarker =
      /[0-9]/.test(lowerQuery.replace(/\s/g, '')) ||
      /\b(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)\b/i.test(lowerQuery) ||
      [...this.getTunisianWordSet()].some((tn) =>
        new RegExp(`\\b${tn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerQuery),
      );

    // Pure French/English car part query with no Tunisian — pass through unchanged
    if (isCarPart && !hasTunisianMarker) {
      return { normalized: query, isGreeting: false, isThanks: false, confidence: 0.9 };
    }
    if (isServiceQuestion && !hasTunisianMarker) {
      return { normalized: query, isGreeting: false, isThanks: false, confidence: 0.9 };
    }

    // ── FIX-2: Extended typo correction map ──────────────────────
    // Covers French designation_2 vocabulary typos users commonly make
    const knownCorrections: Record<string, string> = {
      // Original corrections
      ilbrequin:   'vilebrequin',
      vilbrequin:  'vilebrequin',
      rtaverse:    'traverse',
      rtavers:     'traverse',
      olle:        'tolle',
      avlve:       'valve',
      avse:        'vase',
      garaffes:    'agraffes',
      garafes:     'agrafes',
      garaffe:     'agraffe',
      garafe:      'agrafe',
      graffes:     'agraffes',
      graffe:      'agraffe',
      garaphe:     'agraphe',
      graphe:      'agraphe',
      iale:        'aile',
      ial:         'aile',
      ivtre:       'vitre',
      amorto:      'amortisseur',
      ovlant:      'volant',
      olant:       'volant',

      // FIX-2: Additional French designation_2 typos
      retrovisuer:   'retroviseur',
      retrovisseur:  'retroviseur',
      retrovissuer:  'retroviseur',
      retrovizeur:   'retroviseur',
      rétrovisseur:  'retroviseur',
      amortiseur:    'amortisseur',
      amortizeur:    'amortisseur',
      plaquetes:     'plaquettes',
      plaquete:      'plaquette',
      courorie:      'courroie',
      courroi:       'courroie',
      roulement:     'roulement',   // keep — already correct
      roulment:      'roulement',
      roulemnt:      'roulement',
      embrayge:      'embrayage',
      embreyage:     'embrayage',
      charniere:     'charniere',   // keep — already correct
      charnierre:    'charniere',
      charnieres:    'charnieres',
      serrur:        'serrure',
      serrures:      'serrures',    // keep
      poignée:       'poignee',
      radiateur:     'radiateur',   // keep
      raditaeur:     'radiateur',
      radiatuer:     'radiateur',
      raditeur:      'radiateur',
      alternater:    'alternateur',
      alternatuer:   'alternateur',
      demarreur:     'demarreur',   // keep
      demareur:      'demarreur',
      cremaillere:   'cremaillere', // keep
      crmaillere:    'cremaillere',
      crrmaillere:   'cremaillere',
      ceinture:      'ceinture',    // keep
      cienture:      'ceinture',
      disqe:         'disque',
      disqeu:        'disque',
      captuer:       'capteur',
      captueur:      'capteur',
      clignotnat:    'clignotant',
      clignotan:     'clignotant',
      calindre:      'calandre',
      calandre:      'calandre',    // keep
      parechoc:      'pare-choc',
      parechocs:     'pare-chocs',
      lunete:        'lunette',
      luunette:      'lunette',
      souffelt:      'soufflet',
      souflet:       'soufflet',
      enjolivuer:    'enjoliveur',
      enjolivueur:   'enjoliveur',
      essuiglace:    'essuie glace',
      'essuie-glace':  'essuie-glace',  // keep
      leveglace:     'leve glace',
      monteglace:    'monte glace',
      laveglace:     'lave glace',
    };

    const sortedCorrections = Object.entries(knownCorrections).sort(
      ([a], [b]) => b.length - a.length,
    );

    let correctedQuery = query;
    const appliedCorrections = new Set<string>();

    for (const [typo, correct] of sortedCorrections) {
      const lq = correctedQuery.toLowerCase();
      if (lq.includes(typo) && !appliedCorrections.has(correct)) {
        correctedQuery = correctedQuery.replace(new RegExp(typo, 'gi'), correct);
        appliedCorrections.add(correct);
        this.logger.log(`✅ Pre-corrected: ${typo} → ${correct}`);
      }
    }

    try {
      const aiResult = await this.normalizeWithAI(correctedQuery);
      const correctedWords = this.extractMeaningfulWords(correctedQuery);
      const resultWords    = this.extractMeaningfulWords(aiResult.normalized);

      const tunisianPattern =
        /[0-9]|^(n7eb|ch7al|bghit|famma|choufli|chouf|wach|mte3|ken|behi|barcha|ahla|salem|salam|yezzi|mouch|mech|3aychek|ta3|9ad|zeda|wri)$/i;
      const tunisianMap = this.synonymsService.getTunisianMap();

      for (const qWord of correctedWords) {
        if (tunisianPattern.test(qWord) || tunisianMap[qWord] !== undefined) continue;

        const hasExactMatch  = resultWords.some((rw) => rw === qWord);
        const hasPluralMatch = resultWords.some(
          (rw) =>
            rw === qWord + 's'  || rw === qWord + 'es' ||
            qWord === rw + 's'  || qWord === rw + 'es',
        );
        const hasFuzzyMatch  = resultWords.some((rw) => this.levenshtein(qWord, rw) <= 1);

        if (!hasExactMatch && !hasPluralMatch && !hasFuzzyMatch) {
          this.logger.warn(`⚠️ AI changed/removed word "${qWord}" — using corrected query instead`);
          return {
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks:   aiResult.isThanks,
            confidence: 0.7,
          };
        }
      }

      // Reject AI output that adds suspicious prefixes or triple letters
      for (const rWord of resultWords) {
        if (rWord.length >= 4 && rWord[0] === rWord[1] && rWord[1] === rWord[2]) {
          this.logger.warn(`⚠️ AI added triple letters "${rWord}" — rejecting AI result`);
          return {
            normalized: correctedQuery,
            isGreeting: aiResult.isGreeting,
            isThanks:   aiResult.isThanks,
            confidence: 0.7,
          };
        }
        for (const cWord of correctedWords) {
          if (rWord === 'a' + cWord || rWord === 'aa' + cWord) {
            this.logger.warn(`⚠️ AI added prefix to "${cWord}" → "${rWord}" — rejecting AI result`);
            return {
              normalized: correctedQuery,
              isGreeting: aiResult.isGreeting,
              isThanks:   aiResult.isThanks,
              confidence: 0.7,
            };
          }
        }
      }

      this.logger.log(`✅ AI: "${query}" → "${aiResult.normalized}" (${aiResult.confidence})`);
      return aiResult;
    } catch (error: any) {
      this.logger.warn(`⚠️ AI failed: ${error.message}`);
      // FIX-5: Tunisian fallback preserves French part name tokens
      const fallbackNormalized = this.applyTunisianNormalization(correctedQuery);
      return {
        normalized: fallbackNormalized || correctedQuery,
        isGreeting:
          /^(bonjour|salut|hello|hi|salem|ahla|salam)\b/i.test(correctedQuery),
        isThanks:
          /\b(merci|thanks|3aychek|barcha|au revoir|bye|à bientôt|bonne journée|besslema|sahha|ciao|adieu)\b/i.test(
            correctedQuery,
          ),
        confidence: 0.5,
      };
    }
  }


  // ─────────────────────────────────────────────────────────────────
  // FIX-5: applyTunisianNormalization
  // Replaces Tunisian words with French equivalents while preserving
  // any French part name tokens already present in the query.
  // Uses DB-driven TN map from SynonymsService.
  // ─────────────────────────────────────────────────────────────────
  private applyTunisianNormalization(query: string): string {
    const tunisianMap = this.synonymsService.getTunisianMap();
    let result = query.toLowerCase().trim();

    for (const [tunisian, french] of Object.entries(tunisianMap)) {
      const escaped = tunisian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex   = new RegExp(`\\b${escaped}\\b`, 'gi');
      result = result.replace(regex, french);
    }

    // FIX-5: After replacement, deduplicate tokens that may have been
    // introduced twice (e.g. "retroviseur retroviseur" if both the Tunisian
    // word AND the French word were in the original query)
    const tokens     = result.split(/\s+/).filter(Boolean);
    const seen       = new Set<string>();
    const deduped: string[] = [];
    for (const token of tokens) {
      if (!seen.has(token)) {
        seen.add(token);
        deduped.push(token);
      }
    }
    return deduped.join(' ');
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: extractMeaningfulWords — extended stop-word list
  // Covers French filler words that appear in designation_2 values
  // and should NOT be treated as mandatory search tokens.
  // ─────────────────────────────────────────────────────────────────
  private extractMeaningfulWords(text: string): string[] {
    const normalized = this.normalizeForComparison(text);
    const stopWords  = new Set([
      // Original stop words
      'avant', 'arriere', 'gauche', 'droite',
      'pour', 'avec', 'sans', 'tout', 'tous',
      'des', 'les', 'une', 'stock', 'disponible',
      // FIX-4: French filler words common in designation_2
      'assy', 'comp', 'set', 'kit', 'sub', 'and',
      'the', 'de', 'du', 'la', 'le', 'et', 'en',
      'sur', 'sous', 'par', 'ou', 'car',
      // Position abbreviations — not meaningful tokens to validate
      'av', 'ar', 'sup', 'inf', 'int', 'ext',
      'lh', 'rh', 'fr', 'rr',
    ]);

    return normalized
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));
  }

  private normalizeForComparison(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

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

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: AI prompt updated to:
  //  - Mention that French names (designation_2) are primary
  //  - Explicitly forbid translating French names to English OEM
  //  - Add French body/lighting/interior examples
  // ─────────────────────────────────────────────────────────────────
  private async normalizeWithAI(query: string): Promise<{
    normalized: string;
    isGreeting: boolean;
    isThanks: boolean;
    confidence: number;
  }> {
    const prompt = `You are a car parts query parser for a Suzuki parts catalog.
The catalog uses FRENCH names as primary display names (designation_2 field).
Your job is to normalize user queries into clean French search terms.

CRITICAL RULES:
1. PRESERVE ORIGINAL WORDS — only expand abbreviations and fix spacing/typos.
2. OUTPUT IN FRENCH — do NOT translate French part names to English OEM codes.
   BAD: "retroviseur" → "mirror assy out rear view"
   GOOD: "retroviseur" → "retroviseur"
3. DO NOT change "agrafe" to "agrave" or add wrong accents.
4. Recognize ALL position indicators: avant/av, arriere/ar, gauche/g, droite/d, sup, inf.
5. Recognize French car part names: retroviseur, aile, capot, porte, phare, feu, clignotant,
   optique, calandre, vitre, lunette, pare-choc, charniere, serrure, garniture, baguette,
   amortisseur, plaquette, disque, filtre, durite, radiateur, batterie, courroie, embrayage,
   cardan, rotule, triangle, cremaillere, culasse, injecteur, pompe, compresseur, etc.
6. PRESERVE ALL POSITIONS — if query has "ar" AND "av", keep BOTH.
7. isGreeting=true ONLY for pure greetings with NO car parts or positions.
8. isThanks=true for thanks (merci, 3aychek, barcha) AND goodbyes (au revoir, besslema).
9. PRESERVE SINGLE-LETTER POSITIONS: keep "g" (gauche) and "d" (droite).
10. Fix concatenated words by inserting spaces between recognizable part names.
11. Translate Tunisian dialect words to French equivalents.

EXAMPLES:
- "adhesifarporteavg" → "adhesif arriere porte avant gauche"
- "plaquetteavg" → "plaquette avant gauche"
- "garafe feu ar" → "agrafe feu arriere"
- "n7eb retroviseur" → "je veux retroviseur"
- "retroviseur gauche" → "retroviseur gauche"   (keep French, do NOT say "mirror lh")
- "aile avant droite" → "aile avant droite"
- "feu arriere gauche" → "feu arriere gauche"
- "ahla" → "bonjour" (isGreeting=true)
- "merci" → "merci" (isThanks=true)
- "g ar glace monte appareil" → "gauche arriere glace monte appareil"
- "ch7al retroviseur" → "prix retroviseur"

QUERY: "${query}"

Respond with ONLY valid JSON, no markdown:
{"normalized":"clean French query","isGreeting":true/false,"isThanks":true/false,"confidence":0.0-1.0}`;

    const response  = await this.openaiService.chat(prompt, [], 'JSON only');
    const jsonMatch = response.match(/\{[^}]+\}/);
    if (!jsonMatch) throw new Error('No JSON in AI response');

    const result = JSON.parse(jsonMatch[0]);
    return {
      normalized: result.normalized || query,
      isGreeting: !!result.isGreeting,
      isThanks:   !!result.isThanks,
      confidence: result.confidence || 0.9,
    };
  }
}