const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvPath = path.resolve(process.argv.find((arg) => arg.endsWith('.csv')) || 'C:/Users/LENOVO/Downloads/Base_Articles_CPP_080926.csv');
const applyChanges = process.argv.includes('--apply');
const newPartSource = '01_PROD';

const FIELD_MAP = {
  designation: 'Description',
  designation2: 'Description 2',
  unite: 'Unité de base',
  prixHt: 'Prix unitaire',
  prixTtc: 'Prix unitaire TTC',
  stockDisponible: 'Stock disponible',
  stockConsolide: 'Stock consolidé',
  fabricant: 'Libellé fabricant',
  categorie: 'Catégorie Article',
};

function clean(value) {
  return value === undefined || value === null ? '' : String(value).replace(/^\uFEFF/, '').trim();
}

function numberOrNull(value, field, reference) {
  const cleaned = clean(value).replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid ${field} for ${reference}: ${value}`);
  return parsed;
}

function csvReference(row) {
  return clean(row['N°'] || row['No'] || row.reference).toUpperCase();
}

function readCsv() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(csvPath)) {
      reject(new Error(`CSV file not found: ${csvPath}`));
      return;
    }
    const rows = [];
    fs.createReadStream(csvPath)
      .pipe(csv({ mapHeaders: ({ header }) => clean(header) }))
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

function mapRow(row) {
  const reference = csvReference(row);
  if (!reference) throw new Error('CSV row has no reference');

  const designation = clean(row[FIELD_MAP.designation]);

  const stockConsolide = numberOrNull(row[FIELD_MAP.stockConsolide], 'Stock consolidé', reference);
  const stockDisponible = numberOrNull(row[FIELD_MAP.stockDisponible], 'Stock disponible', reference);

  return {
    reference,
    part: {
      designation: designation || null,
      designation2: clean(row[FIELD_MAP.designation2]) || null,
      unite: clean(row[FIELD_MAP.unite]) || null,
      prixHt: numberOrNull(row[FIELD_MAP.prixHt], 'Prix unitaire', reference),
      prixTtc: numberOrNull(row[FIELD_MAP.prixTtc], 'Prix unitaire TTC', reference),
      fabricant: clean(row[FIELD_MAP.fabricant]) || null,
      categorie: clean(row[FIELD_MAP.categorie]) || null,
    },
    stock: {
      totalQuantity: stockConsolide,
      stockDisponible,
      stockConsolide,
      statut: stockConsolide > 2 ? 'Disponible' : 'Indisponible',
    },
  };
}

function writeBackup(parts, stocks) {
  const backupDir = path.resolve(__dirname, 'import-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `csv-sync-backup-${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify({ createdAt: new Date().toISOString(), csvPath, parts, stocks }, null, 2),
    'utf8',
  );
  return backupPath;
}

async function main() {
  const rows = await readCsv();
  const mappedRows = rows.map(mapRow);
  const references = new Set();
  for (const row of mappedRows) {
    if (references.has(row.reference)) throw new Error(`Duplicate reference in CSV: ${row.reference}`);
    references.add(row.reference);
  }

  const referenceList = [...references];
  const [existingParts, existingStocks] = await Promise.all([
    prisma.part.findMany({ where: { reference: { in: referenceList } } }),
    prisma.stock.findMany({ where: { reference: { in: referenceList } } }),
  ]);
  const partsByReference = new Map(existingParts.map((part) => [part.reference.toUpperCase(), part]));
  const stocksByReference = new Map(existingStocks.map((stock) => [stock.reference.toUpperCase(), stock]));

  const summary = {
    mode: applyChanges ? 'APPLY' : 'DRY_RUN',
    csvRows: mappedRows.length,
    existingParts: existingParts.length,
    newParts: mappedRows.filter((row) => !partsByReference.has(row.reference)).length,
    existingStockRows: existingStocks.length,
    newStockRows: mappedRows.filter((row) => !stocksByReference.has(row.reference)).length,
    partsChanged: 0,
    stockChanged: 0,
    stockAvailableAfterSync: mappedRows.filter((row) => row.stock.stockConsolide > 2).length,
    stockUnavailableAfterSync: mappedRows.filter((row) => row.stock.stockConsolide <= 2).length,
    designationFallbacks: 0,
  };

  const changedPartSnapshots = [];
  const changedStockSnapshots = [];
  for (const row of mappedRows) {
    const existingPart = partsByReference.get(row.reference);
    const existingStock = stocksByReference.get(row.reference);
    if (!row.part.designation) {
      row.part.designation = existingPart?.designation || row.reference;
      summary.designationFallbacks++;
    }
    if (!existingPart || JSON.stringify({
      designation: existingPart.designation,
      designation2: existingPart.designation2,
      unite: existingPart.unite,
      prixHt: String(existingPart.prixHt ?? ''),
      prixTtc: String(existingPart.prixTtc ?? ''),
      fabricant: existingPart.fabricant,
      categorie: existingPart.categorie,
    }) !== JSON.stringify({
      designation: row.part.designation,
      designation2: row.part.designation2,
      unite: row.part.unite,
      prixHt: String(row.part.prixHt ?? ''),
      prixTtc: String(row.part.prixTtc ?? ''),
      fabricant: row.part.fabricant,
      categorie: row.part.categorie,
    })) {
      summary.partsChanged++;
      if (existingPart) changedPartSnapshots.push(existingPart);
    }
    if (!existingStock ||
      existingStock.totalQuantity !== row.stock.totalQuantity ||
      existingStock.stockDisponible !== row.stock.stockDisponible ||
      existingStock.stockConsolide !== row.stock.stockConsolide ||
      existingStock.statut !== row.stock.statut) {
      summary.stockChanged++;
      if (existingStock) changedStockSnapshots.push(existingStock);
    }
  }

  console.log(JSON.stringify({ csvPath, ...summary }, null, 2));
  if (!applyChanges) {
    console.log('Dry-run only. No database changes were made. Use --apply after reviewing this summary.');
    return;
  }

  const backupPath = writeBackup(changedPartSnapshots, changedStockSnapshots);
  let partsUpserted = 0;
  let stocksUpserted = 0;

  await prisma.$transaction(async (tx) => {
    for (const row of mappedRows) {
      const partData = {
        designation: row.part.designation,
        designation2: row.part.designation2,
        searchDescription: row.part.designation2 || row.part.designation,
        prixHt: row.part.prixHt,
        prixTtc: row.part.prixTtc,
        unite: row.part.unite,
        categorie: row.part.categorie,
        fabricant: row.part.fabricant,
      };

      await tx.part.upsert({
        where: { reference: row.reference },
        create: { reference: row.reference, source: newPartSource, ...partData },
        update: partData,
      });
      partsUpserted++;

      await tx.stock.upsert({
        where: { reference: row.reference },
        create: { reference: row.reference, ...row.stock },
        update: row.stock,
      });
      stocksUpserted++;
    }
  }, { timeout: 120000 });

  console.log(JSON.stringify({ applied: true, backupPath, partsUpserted, stocksUpserted }, null, 2));
}

main()
  .catch((error) => {
    console.error('CSV sync failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
