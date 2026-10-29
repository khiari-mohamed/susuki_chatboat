'use strict';
/**
 * fix-test-failures.js
 *
 * Fixes the 3 root causes behind Cases 22, 27, 35 failures:
 *
 *   Case 27 — DB typo: designation_2 = "BASSSES" (triple-S) → "BASSES"
 *             The search query uses the correct spelling so ILIKE never matches.
 *
 *   Case 22 — "baie" (baie de pare-brise) is not in the synonym vocabulary.
 *             The search cannot anchor on it and returns a wrong part.
 *
 *   Case 35 — "adhesif" is not in the synonym vocabulary.
 *             The search falls back to OR mode and returns a wrong part.
 *
 * After running this script, restart the backend (or call POST /admin/synonyms/reload)
 * so the in-memory synonym index picks up the new rows.
 *
 * Usage:
 *   node fix-test-failures.js
 *   node fix-test-failures.js --dry-run
 */

const { PrismaClient } = require('@prisma/client');

const DRY_RUN = process.argv.includes('--dry-run');
const prisma = new PrismaClient();

async function main() {
  console.log(DRY_RUN ? '[DRY RUN] No changes will be written.\n' : '');

  // ── Fix 1: Case 27 — correct the triple-S typo in the DB designation ──────
  const typoRef = '24430M86J00';
  const badDesignation = 'ENSEMBLE ANNEAU SYNCHRO BASSSES VITESSES 1ERE 2EME';
  const goodDesignation = 'ENSEMBLE ANNEAU SYNCHRO BASSES VITESSES 1ERE 2EME';
  const goodSearchDesc = 'ENSEMBLE ANNEAU SYNCHRO BASSES VITESSES 1ERE 2EME ; RING ASSY, LOW GEAR SYNC';

  const part = await prisma.part.findFirst({ where: { reference: typoRef }, select: { id: true, designation2: true, searchDescription: true } });
  if (!part) {
    console.error(`[FIX 1] Part ${typoRef} not found in DB — skipping.`);
  } else if (part.designation2 === goodDesignation) {
    console.log(`[FIX 1] ${typoRef} designation already correct — skipping.`);
  } else {
    console.log(`[FIX 1] ${typoRef}: "${part.designation2}" → "${goodDesignation}"`);
    if (!DRY_RUN) {
      await prisma.part.update({
        where: { id: part.id },
        data: { designation2: goodDesignation, searchDescription: goodSearchDesc },
      });
      console.log(`[FIX 1] ✔ Updated.`);
    }
  }

  // ── Fix 2: Case 22 — add "baie" as a synonym for "renfort" ──────────────────
  // "baie de pare-brise" is a structural cavity concept; "renfort" is the part
  // category. Adding "baie" → "renfort" lets the search find RENFORT parts when
  // the customer says "baie pare-brise".
  const synonymsToAdd = [
    { mot: 'baie', canonical: 'renfort', langue: 'fr' },
    { mot: 'adhesif', canonical: 'adhesif', langue: 'fr' },
    { mot: 'adhésif', canonical: 'adhesif', langue: 'fr' },
  ];

  for (const syn of synonymsToAdd) {
    const existing = await prisma.synonym.findFirst({ where: { mot: syn.mot, langue: syn.langue } });
    if (existing) {
      console.log(`[FIX 2/3] Synonym "${syn.mot}" already exists (canonical="${existing.canonical}") — skipping.`);
    } else {
      console.log(`[FIX 2/3] Adding synonym: "${syn.mot}" → "${syn.canonical}" (${syn.langue})`);
      if (!DRY_RUN) {
        await prisma.synonym.create({ data: syn });
        console.log(`[FIX 2/3] ✔ Inserted.`);
      }
    }
  }

  if (!DRY_RUN) {
    console.log('\n✔ All fixes applied. Restart the backend or call POST /admin/synonyms/reload to reload the synonym index.');
  } else {
    console.log('\n[DRY RUN] Done. Run without --dry-run to apply.');
  }
}

main()
  .catch((err) => { console.error('Fatal:', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
