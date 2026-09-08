const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvPath = path.resolve(process.argv[2] || 'C:/Users/LENOVO/Downloads/Base_Articles_CPP_080926.csv');

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

function normalizeText(value) {
  return clean(value).replace(/\s+/g, ' ').toUpperCase();
}

function normalizeNumber(value) {
  const cleaned = clean(value).replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function numbersEqual(left, right) {
  const a = normalizeNumber(left);
  const b = normalizeNumber(right);
  if (a === null || b === null) return a === b;
  return Math.abs(a - b) < 0.0005;
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

function csvReference(row) {
  return clean(row['N°'] || row['No'] || row.reference).toUpperCase();
}

function csvValue(row, field) {
  return row[FIELD_MAP[field]];
}

function compareField(field, csvRow, dbPart, dbStock) {
  const csvValueForField = csvValue(csvRow, field);
  const dbValue = field.startsWith('stock')
    ? dbStock?.[field]
    : dbPart?.[field];

  if (['prixHt', 'prixTtc'].includes(field)) {
    return numbersEqual(csvValueForField, dbValue);
  }
  if (['stockDisponible', 'stockConsolide'].includes(field)) {
    return normalizeNumber(csvValueForField) === normalizeNumber(dbValue);
  }
  return normalizeText(csvValueForField) === normalizeText(dbValue);
}

async function main() {
  const rows = await readCsv();
  const validRows = rows.filter((row) => csvReference(row));
  const byReference = new Map();
  const duplicateReferences = [];

  for (const row of validRows) {
    const reference = csvReference(row);
    if (byReference.has(reference)) duplicateReferences.push(reference);
    byReference.set(reference, row);
  }

  const references = [...byReference.keys()];
  const [parts, stocks, allDatabaseParts] = await Promise.all([
    prisma.part.findMany({ where: { reference: { in: references } } }),
    prisma.stock.findMany({ where: { reference: { in: references } } }),
    prisma.part.findMany({ select: { reference: true } }),
  ]);

  const partsByReference = new Map(parts.map((part) => [part.reference.toUpperCase(), part]));
  const stocksByReference = new Map(stocks.map((stock) => [stock.reference.toUpperCase(), stock]));
  const mismatches = [];
  const csvOnly = [];
  const dbOnly = [];
  const fieldCounts = Object.fromEntries(Object.keys(FIELD_MAP).map((field) => [field, 0]));

  for (const [reference, row] of byReference) {
    const part = partsByReference.get(reference);
    const stock = stocksByReference.get(reference);
    if (!part) {
      csvOnly.push(reference);
      continue;
    }

    const fields = Object.keys(FIELD_MAP).filter((field) => !compareField(field, row, part, stock));
    for (const field of fields) fieldCounts[field]++;
    if (fields.length > 0 || !stock) {
      mismatches.push({
        reference,
        fields,
        csv: {
          designation: csvValue(row, 'designation'),
          designation2: csvValue(row, 'designation2'),
          prixHt: csvValue(row, 'prixHt'),
          prixTtc: csvValue(row, 'prixTtc'),
          stockDisponible: csvValue(row, 'stockDisponible'),
          stockConsolide: csvValue(row, 'stockConsolide'),
        },
        database: {
          designation: part.designation,
          designation2: part.designation2,
          prixHt: part.prixHt,
          prixTtc: part.prixTtc,
          stockDisponible: stock?.stockDisponible ?? null,
          stockConsolide: stock?.stockConsolide ?? null,
          statut: stock?.statut ?? null,
        },
      });
    }
  }

  const csvReferences = new Set(references);
  dbOnly.push(...allDatabaseParts
    .map((part) => part.reference.toUpperCase())
    .filter((reference) => !csvReferences.has(reference)));

  const stockMismatches = mismatches.filter((item) =>
    item.fields.some((field) => field === 'stockDisponible' || field === 'stockConsolide') ||
    item.database.statut === null,
  );

  console.log(JSON.stringify({
    csvPath,
    csvRows: rows.length,
    uniqueCsvReferences: references.length,
    databasePartsMatched: parts.length,
    databaseStockRowsMatched: stocks.length,
    missingStockRowsForMatchedParts: parts.length - stocks.length,
    duplicateReferences: [...new Set(duplicateReferences)],
    csvOnlyCount: csvOnly.length,
    csvOnly: csvOnly.slice(0, 100),
    dbOnlyCount: dbOnly.length,
    dbOnly: dbOnly.slice(0, 100),
    mismatchCount: mismatches.length,
    stockMismatchCount: stockMismatches.length,
    mismatches: mismatches.slice(0, 200),
    mismatchCountByField: fieldCounts,
  }, null, 2));

  if (csvOnly.length || dbOnly.length || mismatches.length || duplicateReferences.length) {
    process.exitCode = 2;
  }
}

main()
  .catch((error) => {
    console.error('CSV/DB comparison failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
