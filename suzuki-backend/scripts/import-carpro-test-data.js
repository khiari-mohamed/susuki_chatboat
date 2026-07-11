const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function clean(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function numberOrNull(value) {
  const cleaned = clean(value).replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function intOrZero(value) {
  const parsed = numberOrNull(value);
  return parsed === null ? 0 : Math.trunc(parsed);
}

function sourceForModel(model) {
  return clean(model) ? '02_CARPRO' : '02_CARPRO';
}

async function readRows(csvPath) {
  const absolutePath = path.resolve(csvPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CSV file not found: ${absolutePath}`);
  }

  const rows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  return rows;
}

async function writeBackup(references) {
  const backupDir = path.resolve(__dirname, 'import-backups');
  fs.mkdirSync(backupDir, { recursive: true });

  const [parts, stock] = await Promise.all([
    prisma.part.findMany({ where: { reference: { in: references } } }),
    prisma.stock.findMany({ where: { reference: { in: references } } }),
  ]);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `carpro-test-data-backup-${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify({ createdAt: new Date().toISOString(), references, parts, stock }, null, 2),
    'utf8',
  );

  return backupPath;
}

function missing(value) {
  return value === null || value === undefined || value === '';
}

async function importRows(csvPath, options) {
  const rows = await readRows(csvPath);
  let partsInserted = 0;
  let stockInserted = 0;
  let existingSkipped = 0;
  let skipped = 0;
  let backupPath = null;

  const references = rows
    .map((row) => clean(row.reference).toUpperCase())
    .filter(Boolean);

  if (!options.apply) {
    return {
      dryRun: true,
      rows: rows.length,
      validReferences: references.length,
      skipped: rows.length - references.length,
      message: 'No database writes performed. Re-run with --apply to import.',
    };
  }

  backupPath = await writeBackup([...new Set(references)]);

  for (const row of rows) {
    const reference = clean(row.reference).toUpperCase();
    if (!reference) {
      skipped++;
      continue;
    }

    const designation = clean(row.designation) || reference;
    const designation2 = clean(row.designation_2) || null;
    const searchDescription = designation2 || designation;
    const prixHt = numberOrNull(row.prix_ht);
    const prixTtc = numberOrNull(row.prix_ttc);
    const stockDisponible = intOrZero(row.stock_disponible);
    const stockConsolide = intOrZero(row.stock_consolide);
    const statut = stockConsolide > 2 ? 'Disponible' : 'Indisponible';

    const existingPart = await prisma.part.findUnique({ where: { reference } });
    if (existingPart && !options.overwriteExisting) {
      existingSkipped++;
      continue;
    }

    if (!existingPart) {
      await prisma.part.create({
        data: {
          reference,
          designation,
          designation2,
          searchDescription,
          prixHt,
          prixTtc,
          source: sourceForModel(row.model),
        },
      });
      partsInserted++;
    } else {
      await prisma.part.update({
        where: { reference },
        data: {
          designation,
          designation2,
          searchDescription,
          prixHt,
          prixTtc,
          source: sourceForModel(row.model),
        },
      });
    }

    if (!existingPart) {
      await prisma.stock.create({
        data: {
          reference,
          totalQuantity: stockConsolide,
          stockDisponible,
          stockConsolide,
          statut,
        },
      });
      stockInserted++;
    } else {
      await prisma.stock.upsert({
        where: { reference },
        create: {
          reference,
          totalQuantity: stockConsolide,
          stockDisponible,
          stockConsolide,
          statut,
        },
        update: {
          totalQuantity: stockConsolide,
          stockDisponible,
          stockConsolide,
          statut,
        },
      });
    }
  }

  return {
    dryRun: false,
    rows: rows.length,
    partsInserted,
    stockInserted,
    existingSkipped,
    skipped,
    backupPath,
    mode: options.overwriteExisting ? 'overwrite-existing' : 'insert-only',
  };
}

async function main() {
  const args = process.argv.slice(2);
  const csvPath = args.find((arg) => !arg.startsWith('--'));
  const options = {
    apply: args.includes('--apply'),
    overwriteExisting: args.includes('--overwrite-existing'),
  };

  if (!csvPath) {
    throw new Error('Usage: node scripts/import-carpro-test-data.js <path-to-csv> [--apply] [--overwrite-existing]');
  }

  const result = await importRows(csvPath, options);
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
