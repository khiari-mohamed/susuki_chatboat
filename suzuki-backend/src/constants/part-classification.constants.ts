// src/constants/part-classification.constants.ts
// ═══════════════════════════════════════════════════════════════════
// SINGLE SOURCE OF TRUTH — "is this a main assembly or a sub-component
// / accessory of it?" vocabulary.
//
// FIX 2026-09-15 (CarPro "pare-choc → accessoire" report):
// This list used to exist twice, independently, with different
// content:
//   - chat-orchestrator.service.ts  (filterAccessoriesIfNeeded)
//   - chat/advanced-search.service.ts (calculateContentMatches)
// The two had already drifted apart (see git history), which is
// exactly how a real gap slipped through: "renfort", "extension",
// "moulure", "baguette", "sabot", "elargisseur", "moustache" and
// "spoiler" were on NEITHER list, so a query like "pare choc" could
// surface "RENFORT PARE CHOC AV" or "SUPPORT PARE CHOC AV D" as if it
// were the bumper itself.
//
// The words below were derived directly from the live CarPro article
// export (Base_Articles_CPP_080926.csv, 9,559 rows), not guessed:
// every one of "renfort/extension/moulure/baguette/sabot/
// elargisseur/moustache/spoiler" appears in that file EXCLUSIVELY as
// part of a sub-component designation (e.g. "RENFORT CHARNIERE DE
// PORTE AV D", "SPOILER PARE CHOC AV") — never as the head noun of a
// standalone customer request. Zero occurrences were found where
// adding them could cause a false rejection of a genuine primary
// part.
//
// IMPORTANT — parts.categorie is NOT a reliable signal for this
// distinction. Checked directly against the same export: of 361 rows
// whose French designation contains "SUPPORT" or "ACCESSOIRE", only
// 3 are tagged categorie = 'ACCESSOIRES'. The rest (195 CARROSSERIE,
// 133 MÉCANIQUE, 29 PR, 1 ELECTRIQUE) share their categorie with
// thousands of genuine primary parts. Every "SUPPORT PARE CHOC AV/AR
// G/D" row, for example, is tagged CARROSSERIE — the exact same
// category as the standalone "PARE CHOC AV"/"PARE CHOC AR" bumpers
// themselves. categorie === 'ACCESSOIRES' DOES reliably catch genuine
// dealer add-ons (SPOILER, CHROME trim, MOULURE-as-decoration) — it's
// kept as a signal for that — but it cannot replace the keyword list
// for the "bracket vs. the part it holds" distinction. Both signals
// are combined; neither alone is sufficient.
// ═══════════════════════════════════════════════════════════════════

/**
 * A part is treated as a sub-component/accessory (relative to the
 * main assembly it belongs to) when its designation contains any of
 * these words. Used to filter OUT accessory-only results when the
 * customer asked for the main part, and to filter them IN when the
 * customer explicitly asked for an accessory (see
 * EXPLICIT_ACCESSORY_REQUEST_WORDS below).
 */
export const ACCESSORY_KEYWORDS: string[] = [
  // Hardware / fasteners / consumables
  'vis', 'boulon', 'ecrou', 'agrafe', 'agraffe', 'agraphe', 'clip',
  'sangle', 'cable', 'câble', 'toc', 'bushing', 'silent', 'silentbloc',
  'coupelle', 'adhesif', 'chapeau', 'tige', 'arret', 'switcher',
  'reservoir', 'cercle', 'causse',

  // Mounting / structural sub-components (bracket-of-a-part)
  'support', 'fixation', 'contacteur', 'loquet', 'serrure',
  'charniere', 'charnière', 'montant', 'tiran', 'tirant', 'traverse',
  'tete', 'vase', 'calle', 'cale',
  // FIX 2026-09-15 — confirmed via the live article export (see file
  // header): these were the actual missing words behind the reported
  // "pare choc" → bracket/trim substitution bug.
  'renfort', 'extension', 'moulure', 'baguette', 'sabot',
  'elargisseur', 'moustache',

  // Fluid transfer (never the assembly itself)
  'durite', 'tuyau', 'flexible', 'joint', 'bouchon',

  // Coverings / trim shells
  'cache', 'couvercle', 'boitier', 'chrome', 'isolant', 'sigle',
  'monogramme',

  // Sets / kits (the box, not the identified single part)
  'kit', 'ensemble', 'set', 'jeu',

  // Decorative dealer add-ons — also covered by categorie==='ACCESSOIRES'
  // in most cases, kept here as a second, independent signal.
  'spoiler',
];

/**
 * When the customer's own message contains one of these words, they
 * are explicitly asking FOR an accessory/sub-component — accessory
 * results must be shown (not filtered out) in that case.
 * Kept intentionally narrower than ACCESSORY_KEYWORDS: this list only
 * has words a customer would plausibly type as their actual request
 * (e.g. "je veux un support de pare-choc"), not every word that can
 * merely appear inside a longer designation.
 */
export const EXPLICIT_ACCESSORY_REQUEST_WORDS: string[] = [
  'support', 'joint', 'contacteur', 'loquet', 'serrure', 'charniere',
  'charnière', 'agrafe', 'agraffe', 'agraphe', 'vis', 'boulon',
  'ecrou', 'kit', 'sangle', 'cable', 'câble', 'toc', 'bushing',
  'silentbloc', 'accessoire', 'accessoires', 'spoiler', 'renfort',
  'moulure', 'baguette', 'sabot', 'elargisseur', 'moustache',
  'extension',
];

/**
 * Main assembly / part-type words used by the scoring layer
 * (advanced-search.service.ts) to decide whether the customer's
 * query targets a specific main part at all. Extends the original
 * list with the compound "pare-*" families (bumper/windshield/mud
 * flap/sun visor) and the grille, which were previously absent —
 * meaning queries for those parts never benefited from the
 * main-vs-accessory scoring nudge in the first place. The hard
 * grammatical disambiguation of "pare-*" itself (which exact family)
 * happens in strict-validator.service.ts's extractMainPartType(); this
 * list only needs the individual tokens so the scoring layer treats
 * the query as "a specific main part was requested" at all.
 */
export const MAIN_PART_KEYWORDS: string[] = [
  'radiateur', 'moteur', 'alternateur', 'demarreur', 'batterie',
  'phare', 'feu', 'porte', 'capot', 'aile', 'retroviseur',
  'amortisseur', 'disque', 'plaquette', 'filtre', 'pompe',
  'compresseur', 'etrier', 'tambour', 'volant', 'siege', 'tableau',
  // FIX 2026-09-15: the "pare-*" family and the grille were entirely
  // absent, so this scoring layer was a no-op for bumper/windshield/
  // mud-flap/sun-visor/grille queries (it neither helped nor hurt —
  // the hard reject correctly happens downstream in
  // strict-validator.service.ts and chat-orchestrator.service.ts, but
  // this layer should not stay blind to them either).
  'choc', 'brise', 'boue', 'soleil', 'calandre',
];

export function containsClassificationKeyword(text: string, keyword: string): boolean {
  const normalizedText = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  const normalizedKeyword = keyword
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  return ` ${normalizedText} `.includes(` ${normalizedKeyword} `);
}