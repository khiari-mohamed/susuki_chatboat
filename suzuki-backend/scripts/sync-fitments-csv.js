const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvPath = path.resolve(process.argv.find((arg) => arg.endsWith('.csv')) || 'C:/Users/LENOVO/Downloads/Model_Vehicule_Pieces_de_rechange.csv');
const applyChanges = process.argv.includes('--apply');

function clean(value) {
  return value === undefined || value === null ? '' : String(value).replace(/^\uFEFF/, '').trim();
}

function normalizeCode(value) {
  return clean(value).toUpperCase().replace(/\s+/g, '-').replace(/-TYPE-/g, '-TYPE');
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

function mapRows(rows) {
  return rows.map((row, index) => {
    const partReference = clean(row['N° article']).toUpperCase();
    const typeCode = normalizeCode(row['Code externe']);
    if (!partReference) throw new Error(`Missing part reference at CSV row ${index + 2}`);
    if (!typeCode) throw new Error(`Missing type code at CSV row ${index + 2}`);
    return { partReference, typeCode };
  });
}

function writeBackup(fitments, typeMasters) {
  const backupDir = path.resolve(__dirname, 'import-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(__dirname, 'import-backups', `fitment-csv-sync-backup-${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify({ createdAt: new Date().toISOString(), csvPath, fitments, typeMasters }, null, 2),
    'utf8',
  );
  return backupPath;
}

async function main() {
  const rows = mapRows(await readCsv());
  const pairMap = new Map();
  for (const row of rows) pairMap.set(`${row.partReference}|${row.typeCode}`, row);
  const desiredPairs = [...pairMap.values()];
  const partReferences = [...new Set(desiredPairs.map((row) => row.partReference))];
  const typeCodes = [...new Set(desiredPairs.map((row) => row.typeCode))];

  const [parts, typeMasters, existingFitments] = await Promise.all([
    prisma.part.findMany({ where: { reference: { in: partReferences } }, select: { reference: true } }),
    prisma.vehicleTypeMaster.findMany({ where: { typeCode: { in: typeCodes } }, select: { typeCode: true, modelName: true } }),
    prisma.fitment.findMany({ select: { id: true, partReference: true, typeCode: true, modelName: true } }),
  ]);

  const partSet = new Set(parts.map((part) => part.reference.toUpperCase()));
  const typeMap = new Map(typeMasters.map((type) => [type.typeCode.toUpperCase(), type]));
  const missingParts = partReferences.filter((reference) => !partSet.has(reference));
  const missingTypes = typeCodes.filter((code) => !typeMap.has(code));
  missingTypes.forEach((code) => typeMap.set(code, { typeCode: code, modelName: code }));
  if (missingParts.length) {
    throw new Error(JSON.stringify({ missingParts: missingParts.slice(0, 20), missingPartCount: missingParts.length }, null, 2));
  }

  const desiredKeys = new Set(desiredPairs.map((row) => `${row.partReference}|${row.typeCode}`));
  const existingKeys = new Set(existingFitments.map((row) => `${row.partReference.toUpperCase()}|${row.typeCode.toUpperCase()}`));
  const toAdd = desiredPairs.filter((row) => !existingKeys.has(`${row.partReference}|${row.typeCode}`));
  const toRemove = existingFitments.filter((row) => !desiredKeys.has(`${row.partReference.toUpperCase()}|${row.typeCode.toUpperCase()}`));
  const toUpdateModelName = desiredPairs.filter((row) => {
    const existing = existingFitments.find((fitment) =>
      fitment.partReference.toUpperCase() === row.partReference && fitment.typeCode.toUpperCase() === row.typeCode,
    );
    return existing && existing.modelName !== typeMap.get(row.typeCode)?.modelName;
  });

  const summary = {
    mode: applyChanges ? 'APPLY' : 'DRY_RUN',
    csvRows: rows.length,
    desiredPairs: desiredPairs.length,
    existingFitments: existingFitments.length,
    partsReferenced: partReferences.length,
    typeCodesReferenced: typeCodes.length,
    newTypeMasters: missingTypes.length,
    addCount: toAdd.length,
    removeCount: toRemove.length,
    modelNameUpdates: toUpdateModelName.length,
    exactCurrentPairs: desiredPairs.length - toAdd.length,
    testedBumperMappings: desiredPairs.filter((row) =>
      ['71811M75T00-799', '71811M76MA0-799'].includes(row.partReference),
    ),
  };

  console.log(JSON.stringify(summary, null, 2));
  if (!applyChanges) {
    console.log('Dry-run only. No database changes were made. Use --apply after reviewing this summary.');
    return;
  }

  const backupPath = writeBackup(existingFitments, typeMasters);
  let added = 0;
  let removed = 0;
  let updated = 0;

  await prisma.$transaction(async (tx) => {
    for (const code of missingTypes) {
      await tx.vehicleTypeMaster.create({ data: { typeCode: code, modelName: code } });
    }

    for (const fitment of toRemove) {
      await tx.fitment.delete({ where: { id: fitment.id } });
      removed++;
    }
    for (const row of desiredPairs) {
      const modelName = typeMap.get(row.typeCode).modelName;
      const result = await tx.fitment.upsert({
        where: { partReference_typeCode: row },
        create: { ...row, modelName },
        update: { modelName },
      });
      if (result) {
        const existing = existingFitments.find((fitment) => fitment.id === result.id);
        if (existing && existing.modelName !== modelName) updated++;
        else if (!existing) added++;
      }
    }
  }, { timeout: 120000 });

  console.log(JSON.stringify({ applied: true, backupPath, added, removed, updated }, null, 2));
}

main()
  .catch((error) => {
    console.error('Fitment CSV sync failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
