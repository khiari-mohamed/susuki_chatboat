const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const { clean, cleanOrNull, canonicalize, numberOrNull } = require('./lib/data-hygiene');

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
  const prixHt = numberOrNull(row[FIELD_MAP.prixHt], 'Prix unitaire', reference);
  const prixTtc = numberOrNull(row[FIELD_MAP.prixTtc], 'Prix unitaire TTC', reference);

  return {
    reference,
    part: {
      designation: designation || null,
      designation2: cleanOrNull(row[FIELD_MAP.designation2]),
      unite: cleanOrNull(row[FIELD_MAP.unite]),
      prixHt,
      prixTtc,
      // Business rule: catalogue-level lookup fields (categorie,
      // fabricant) are canonicalized (upper-case, whitespace-collapsed)
      // on the way in — this is what actually stops the "Filtre" /
      // "filtre" / "FILTRE" duplicate-variant problem from growing:
      // fixing it once in the DB doesn't help if every future sync
      // reintroduces whatever casing CarPro's export happens to use.
      fabricant: canonicalize(row[FIELD_MAP.fabricant]),
      categorie: canonicalize(row[FIELD_MAP.categorie]),
    },
    stock: {
      totalQuantity: stockConsolide,
      stockDisponible,
      stockConsolide,
      // Business rule (confirmed with client 2026-07-07): sellable
      // only when stock_consolide > 2.
      statut: stockConsolide > 2 ? 'Disponible' : 'Indisponible',
    },
    // Pre-flight anomaly flags — never block the sync, always reported
    // in the dry-run summary so a human decides what to do about them.
    anomalies: {
      priceTtcBelowHt: prixHt !== null && prixTtc !== null && prixTtc < prixHt,
      negativePrice: (prixHt !== null && prixHt < 0) || (prixTtc !== null && prixTtc < 0),
      negativeStock: [stockConsolide, stockDisponible].some((v) => v !== null && v < 0),
      disponibleAboveConsolide: stockDisponible !== null && stockConsolide !== null && stockDisponible > stockConsolide,
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
  const [existingParts, existingStocks, dbPartsNotInCsv] = await Promise.all([
    prisma.part.findMany({ where: { reference: { in: referenceList } } }),
    prisma.stock.findMany({ where: { reference: { in: referenceList } } }),
    // Read-only visibility: parts sourced from this CSV pipeline
    // (source='01_PROD') that this export no longer mentions at all —
    // upserts never delete, so nothing is at risk, but a large number
    // here means the CSV is a partial/filtered export, worth asking
    // CarPro about before assuming "the CSV" is the full catalogue.
    prisma.part.count({ where: { source: newPartSource, reference: { notIn: referenceList } } }),
  ]);
  const partsByReference = new Map(existingParts.map((part) => [part.reference.toUpperCase(), part]));
  const stocksByReference = new Map(existingStocks.map((stock) => [stock.reference.toUpperCase(), stock]));

  const anomalyRows = mappedRows.filter((row) =>
    Object.values(row.anomalies).some(Boolean),
  );

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
    // ── new, actionable visibility ──
    dbPartsNotMentionedInThisCsv: dbPartsNotInCsv,
    priceOrStockAnomalies: anomalyRows.length,
    priceOrStockAnomalySamples: anomalyRows.slice(0, 10).map((row) => ({
      reference: row.reference,
      ...Object.fromEntries(Object.entries(row.anomalies).filter(([, v]) => v)),
      prixHt: row.part.prixHt,
      prixTtc: row.part.prixTtc,
      stockDisponible: row.stock.stockDisponible,
      stockConsolide: row.stock.stockConsolide,
    })),
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