require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const MAX_LENGTH = 200;
const applyChanges = process.argv.includes('--apply');

function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/^\uFEFF/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalized(value) {
  return clean(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isUsable(value) {
  const text = clean(value);
  if (!text) return false;
  if (/^(nan|n\/a|na|null|none|undefined|#n\/a|#ref!|#value!|[-–—]+)$/i.test(text)) return false;
  if (/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F\u2500-\u257F]/.test(text)) return false;
  if (/^(?:ß|Ã|Â|â)[A-ZÀ-Ý]/.test(text)) return false;
  return true;
}

function appendWithinLimit(primary, secondary) {
  if (!primary) return secondary.slice(0, MAX_LENGTH);
  if (!secondary) return primary.slice(0, MAX_LENGTH);
  const combined = `${primary} ; ${secondary}`;
  if (combined.length <= MAX_LENGTH) return combined;
  return primary.slice(0, MAX_LENGTH);
}

function buildSearchDescription(part) {
  const french = isUsable(part.designation2) ? clean(part.designation2) : '';
  const english = isUsable(part.designation) ? clean(part.designation) : '';
  const frenchKey = normalized(french);
  const englishKey = normalized(english);

  if (french && frenchKey === englishKey) return french.slice(0, MAX_LENGTH);
  if (french && english) return appendWithinLimit(french, english);
  return (french || english).slice(0, MAX_LENGTH);
}

function writeBackup(rows) {
  const backupDir = path.resolve(__dirname, 'import-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `search-description-backup-${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify({ createdAt: new Date().toISOString(), rows }, null, 2),
    'utf8',
  );
  return backupPath;
}

async function main() {
  const parts = await prisma.part.findMany({
    select: {
      id: true,
      reference: true,
      designation: true,
      designation2: true,
      searchDescription: true,
    },
    orderBy: { id: 'asc' },
  });

  const changes = [];
  const stats = {
    mode: applyChanges ? 'APPLY' : 'DRY_RUN',
    totalParts: parts.length,
    changed: 0,
    unchanged: 0,
    frenchOnly: 0,
    englishOnly: 0,
    bilingualCombined: 0,
    duplicateCollapsed: 0,
    unusableFrenchFallbacks: 0,
    emptyAfter: 0,
  };

  for (const part of parts) {
    const frenchUsable = isUsable(part.designation2);
    const englishUsable = isUsable(part.designation);
    const nextDescription = buildSearchDescription(part);
    const frenchKey = normalized(part.designation2);
    const englishKey = normalized(part.designation);

    if (frenchUsable && englishUsable && frenchKey === englishKey) stats.duplicateCollapsed++;
    else if (frenchUsable && englishUsable) stats.bilingualCombined++;
    else if (frenchUsable) stats.frenchOnly++;
    else if (englishUsable) {
      stats.englishOnly++;
      if (part.designation2) stats.unusableFrenchFallbacks++;
    }
    if (!nextDescription) stats.emptyAfter++;

    if (clean(part.searchDescription) !== nextDescription) {
      stats.changed++;
      changes.push({
        id: part.id,
        reference: part.reference,
        previous: part.searchDescription,
        next: nextDescription,
      });
    } else {
      stats.unchanged++;
    }
  }

  console.log(JSON.stringify({ ...stats, sampleChanges: changes.slice(0, 10) }, null, 2));
  if (!applyChanges) {
    console.log('Dry-run only. No database changes were made. Use --apply after reviewing this summary.');
    return;
  }

  const backupPath = writeBackup(changes);
  await prisma.$transaction(async (tx) => {
    for (const change of changes) {
      await tx.part.update({
        where: { id: change.id },
        data: { searchDescription: change.next || null },
      });
    }
  }, { timeout: 120000 });

  console.log(JSON.stringify({ applied: true, backupPath, updated: changes.length }, null, 2));
}

main()
  .catch((error) => {
    console.error('Search-description enrichment failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = { buildSearchDescription, isUsable, normalized };