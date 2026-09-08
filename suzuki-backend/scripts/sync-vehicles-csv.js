const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvPath = path.resolve(process.argv.find((arg) => arg.endsWith('.csv')) || 'C:/Users/LENOVO/Downloads/Base_vehicule_080926.csv');
const applyChanges = process.argv.includes('--apply');

function clean(value) {
  return value === undefined || value === null ? '' : String(value).replace(/^\uFEFF/, '').trim();
}

function normalizeTypeCode(value) {
  const code = clean(value).toUpperCase();
  if (!code) return null;
  return code
    .replace(/\s+/g, '-')
    .replace(/-TYPE-/g, '-TYPE');
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
  const vehicleNo = clean(row['N° de série']).toUpperCase();
  if (!vehicleNo) throw new Error('Vehicle row has no N° de série');
  return {
    vehicleNo,
    vin: clean(row.VIN) || null,
    marque: clean(row['Code marque']) || null,
    modele: clean(row['Code modèle']) || null,
    modeleDescription: clean(row['N° modèle version']) || null,
    immatriculation: clean(row['N° Immatriculation']) || null,
    typeCode: normalizeTypeCode(row['Vehicle Type']),
  };
}

function writeBackup(vehicles, modelMaps, typeMasters) {
  const backupDir = path.resolve(__dirname, 'import-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `vehicle-csv-sync-backup-${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify({ createdAt: new Date().toISOString(), csvPath, vehicles, modelMaps, typeMasters }, null, 2),
    'utf8',
  );
  return backupPath;
}

async function main() {
  const rows = await readCsv();
  const mappedRows = rows.map(mapRow);
  const vehicleNos = new Set();
  for (const row of mappedRows) {
    if (vehicleNos.has(row.vehicleNo)) throw new Error(`Duplicate vehicle number in CSV: ${row.vehicleNo}`);
    vehicleNos.add(row.vehicleNo);
  }

  const vehicleList = [...vehicleNos];
  const typeCodes = [...new Set(mappedRows.map((row) => row.typeCode).filter(Boolean))];
  const modelMapPairs = [...new Map(
    mappedRows
      .filter((row) => row.modeleDescription && row.typeCode)
      .map((row) => [`${row.modeleDescription.toUpperCase()}|${row.typeCode}`, {
        modele: row.modeleDescription.toUpperCase(),
        typeCode: row.typeCode,
      }]),
  ).values()];

  const [existingVehicles, existingTypes, existingModelMaps] = await Promise.all([
    prisma.vehicle.findMany({ where: { vehicleNo: { in: vehicleList } } }),
    prisma.vehicleTypeMaster.findMany({ where: { typeCode: { in: typeCodes } } }),
    prisma.vehicleModelMap.findMany({
      where: { OR: modelMapPairs.map((pair) => ({ modele: pair.modele, typeCode: pair.typeCode })) },
    }),
  ]);

  const vehiclesByNo = new Map(existingVehicles.map((vehicle) => [vehicle.vehicleNo.toUpperCase(), vehicle]));
  const existingTypesByCode = new Map(existingTypes.map((type) => [type.typeCode.toUpperCase(), type]));
  const existingMapKeys = new Set(existingModelMaps.map((map) => `${map.modele.toUpperCase()}|${map.typeCode.toUpperCase()}`));

  const summary = {
    mode: applyChanges ? 'APPLY' : 'DRY_RUN',
    csvRows: mappedRows.length,
    existingVehicles: existingVehicles.length,
    newVehicles: mappedRows.filter((row) => !vehiclesByNo.has(row.vehicleNo)).length,
    vehiclesChanged: 0,
    csvTypeCodes: typeCodes.length,
    newTypeMasters: typeCodes.filter((code) => !existingTypesByCode.has(code)).length,
    csvModelTypeMappings: modelMapPairs.length,
    newModelTypeMappings: modelMapPairs.filter((pair) => !existingMapKeys.has(`${pair.modele}|${pair.typeCode}`)).length,
    missingVin: mappedRows.filter((row) => !row.vin).length,
    missingModel: mappedRows.filter((row) => !row.modele).length,
    missingVersion: mappedRows.filter((row) => !row.modeleDescription).length,
  };

  const changedVehicles = [];
  for (const row of mappedRows) {
    const existing = vehiclesByNo.get(row.vehicleNo);
    const merged = {
      ...row,
      vin: row.vin || existing?.vin || null,
      marque: row.marque || existing?.marque || null,
      modele: row.modele || existing?.modele || null,
      modeleDescription: row.modeleDescription || existing?.modeleDescription || null,
    };
    if (!existing || ['vin', 'marque', 'modele', 'modeleDescription', 'immatriculation', 'typeCode']
      .some((field) => (existing[field] ?? null) !== merged[field])) {
      summary.vehiclesChanged++;
      if (existing) changedVehicles.push(existing);
    }
    row.merged = merged;
  }

  console.log(JSON.stringify({ csvPath, ...summary }, null, 2));
  if (!applyChanges) {
    console.log('Dry-run only. No database changes were made. Use --apply after reviewing this summary.');
    return;
  }

  const backupPath = writeBackup(changedVehicles, existingModelMaps, existingTypes);
  let vehiclesUpserted = 0;
  let modelMapsUpserted = 0;
  let typesUpserted = 0;

  await prisma.$transaction(async (tx) => {
    for (const row of mappedRows) {
      await tx.vehicle.upsert({
        where: { vehicleNo: row.vehicleNo },
        create: row.merged,
        update: row.merged,
      });
      vehiclesUpserted++;
    }

    for (const code of typeCodes) {
      const sample = mappedRows.find((row) => row.typeCode === code);
      await tx.vehicleTypeMaster.upsert({
        where: { typeCode: code },
        create: { typeCode: code, modelName: sample?.modeleDescription || sample?.modele || code },
        update: {},
      });
      typesUpserted++;
    }

    for (const pair of modelMapPairs) {
      await tx.vehicleModelMap.upsert({
        where: { modele_typeCode: pair },
        create: pair,
        update: {},
      });
      modelMapsUpserted++;
    }
  }, { timeout: 120000 });

  console.log(JSON.stringify({ applied: true, backupPath, vehiclesUpserted, typesUpserted, modelMapsUpserted }, null, 2));
}

main()
  .catch((error) => {
    console.error('Vehicle CSV sync failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
