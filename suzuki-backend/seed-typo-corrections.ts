// seed-typo-corrections.ts
// ═══════════════════════════════════════════════════════════════════
// ONE-OFF, IDEMPOTENT migration: moves the hardcoded typo-correction
// map that used to live ONLY in ai-query-normalizer.service.ts
// (STATIC_TYPO_FALLBACK) into the `synonyms` table as rows with
// langue='typo'.
//
// Why: once these rows exist in the DB, they're manageable from
// /admin/synonyms (the dashboard's synonym editor now offers 'typo' as
// a langue option) — no code deploy needed to fix a new typo.
//
// Safe to run multiple times:
//  - skipDuplicates relies on the existing @@unique([mot, langue])
//    constraint, so re-running never creates duplicate rows.
//  - The app keeps working identically even if this is never run —
//    AIQueryNormalizerService merges the DB typo map OVER its own
//    static fallback, it doesn't replace it.
//
// Usage:
//   cd suzuki-backend
//   npx ts-node seed-typo-corrections.ts
// ═══════════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

// Kept in sync with AIQueryNormalizerService.STATIC_TYPO_FALLBACK.
// This script only needs to run once per entry — after that, edit /
// add corrections from the admin dashboard instead of this file.
const TYPO_CORRECTIONS: Record<string, string> = {
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
  arier:       'arriere',
  arriére:     'arriere',
  trversear:   'traverse arriere',
  traversear:  'traverse arriere',
  parbrise:    'pare-brise',
  parebrise:   'pare-brise',

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
  roulment:      'roulement',
  roulemnt:      'roulement',
  embrayge:      'embrayage',
  embreyage:     'embrayage',
  charnierre:    'charniere',
  serrur:        'serrure',
  poignée:       'poignee',
  raditaeur:     'radiateur',
  radiatuer:     'radiateur',
  raditeur:      'radiateur',
  alternater:    'alternateur',
  alternatuer:   'alternateur',
  demareur:      'demarreur',
  crmaillere:    'cremaillere',
  crrmaillere:   'cremaillere',
  cienture:      'ceinture',
  disqe:         'disque',
  disqeu:        'disque',
  captuer:       'capteur',
  captueur:      'capteur',
  clignotnat:    'clignotant',
  clignotan:     'clignotant',
  calindre:      'calandre',
  parechoc:      'pare-choc',
  parechocs:     'pare-chocs',
  lunete:        'lunette',
  luunette:      'lunette',
  souffelt:      'soufflet',
  souflet:       'soufflet',
  enjolivuer:    'enjoliveur',
  enjolivueur:   'enjoliveur',
  essuiglace:    'essuie glace',
  leveglace:     'leve glace',
  monteglace:    'monte glace',
  laveglace:     'lave glace',
};

async function seedTypoCorrections(): Promise<void> {
  console.log('🌱 Seeding typo corrections into synonyms (langue=\'typo\')...');
  console.log('✅ IDEMPOTENT | ADDITIVE ONLY | skipDuplicates on (mot, langue)');

  const prisma = new PrismaClient();

  try {
    const rows = Object.entries(TYPO_CORRECTIONS).map(([mot, canonical]) => ({
      mot:      mot.toLowerCase(),
      canonical,
      langue:   'typo',
    }));

    console.log(`Prepared ${rows.length} typo rows to upsert`);

    const result = await prisma.synonym.createMany({
      data: rows,
      skipDuplicates: true,
    });

    console.log(`✅ Inserted: ${result.count}, skipped (already existed): ${rows.length - result.count}`);
    console.log('\nℹ️  These rows take effect on next app restart, or immediately if you');
    console.log('   trigger a reload via /admin/synonyms (create/update/delete any row —');
    console.log('   the admin CRUD calls SynonymsService.reload() + AdvancedSearchService');
    console.log('   .refreshSynonymIndex() automatically).');
  } catch (error) {
    console.error('❌ Error seeding typo corrections:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTypoCorrections().catch(console.error);