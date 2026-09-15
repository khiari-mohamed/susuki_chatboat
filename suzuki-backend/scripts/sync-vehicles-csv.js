const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const { clean, cleanOrNull, normalizeTypeCode, preferNewOrExisting, JUNK_VALUES } = require('./lib/data-hygiene');

const prisma = new PrismaClient();
const csvPath = path.resolve(process.argv.find((arg) => arg.endsWith('.csv')) || 'C:/Users/LENOVO/Downloads/Base_vehicule_080926.csv');
const applyChanges = process.argv.includes('--apply');

// Every field that can legitimately change on re-sync AND must fall
// back to the existing DB value when the new CSV cell is blank. Fixed
// 2026-09-13: `typeCode` and `immatriculation` used to be excluded
// from this list, so a CSV export with those columns blank for a
// given row would silently erase a previously-known-good value.
const MUTABLE_FIELDS = ['vin', 'marque', 'modele', 'modeleDescription', 'immatriculation', 'typeCode'];

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
      .on('error', reject)
      .on('end', () => resolve(rows));
  });
}

function mapRow(row) {
  const vehicleNo = clean(row['N° de série']).toUpperCase();
  if (!vehicleNo) throw new Error('Vehicle row has no N° de série');

  return {
    vehicleNo,
    vin: cleanOrNull(row.VIN),
    marque: cleanOrNull(row['Code marque']),
    modele: cleanOrNull(row['Code modèle']),
    modeleDescription: cleanOrNull(row['N° modèle version']),
    immatriculation: cleanOrNull(row['N° Immatriculation']),
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

  // ── Business-rule / data-hygiene pre-flight (read-only) ──────────
  const vinCounts = new Map();
  for (const row of mappedRows) {
    if (!row.vin) continue;
    vinCounts.set(row.vin, (vinCounts.get(row.vin) || 0) + 1);
  }
  const duplicateVinsInCsv = [...vinCounts.entries()].filter(([, count]) => count > 1);

  let junkValuesRejected = 0;
  for (const row of rows) {
    for (const col of ['VIN', 'Code marque', 'Code modèle', 'N° modèle version', 'N° Immatriculation']) {
      const raw = clean(row[col]);
      if (raw && !cleanOrNull(row[col])) junkValuesRejected++;
    }
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

  const [existingVehicles, existingTypes, existingModelMaps, dbVehiclesNotInCsv, existingJunkMarque] = await Promise.all([
    prisma.vehicle.findMany({ where: { vehicleNo: { in: vehicleList } } }),
    prisma.vehicleTypeMaster.findMany({ where: { typeCode: { in: typeCodes } } }),
    prisma.vehicleModelMap.findMany({
      where: { OR: modelMapPairs.map((pair) => ({ modele: pair.modele, typeCode: pair.typeCode })) },
    }),
    // Read-only visibility: vehicles this CSV export doesn't mention at
    // all (retired from CarPro's fleet export, or a stale/partial CSV).
    // Nothing is deleted for this — upserts never remove rows — but
    // worth knowing before treating "the CSV" as the full picture.
    prisma.vehicle.count({ where: { vehicleNo: { notIn: vehicleList } } }),
    // Pre-existing junk already in the DB from past imports, which this
    // sync's new fallback logic will now correctly LEAVE UNTOUCHED if
    // the CSV cell is blank for that vehicle (blank ≠ "fix it for me").
    // Cleaning these up is a deliberate, separate, reviewed action —
    // see scripts/cleanup-junk-values.sql.
    prisma.vehicle.count({ where: { marque: { in: [...JUNK_VALUES] } } }),
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
    missingTypeCode: mappedRows.filter((row) => !row.typeCode).length,
    // ── new, actionable visibility ──
    duplicateVinsInCsv: duplicateVinsInCsv.length,
    duplicateVinSamples: duplicateVinsInCsv.slice(0, 5).map(([vin, count]) => ({ vin, count })),
    junkValuesRejectedThisRun: junkValuesRejected,
    dbVehiclesNotMentionedInThisCsv: dbVehiclesNotInCsv,
    dbVehiclesWithPreExistingJunkMarque: existingJunkMarque,
    fieldsThatWouldHaveBeenErasedByTheOldBug: 0,
  };

  const changedVehicles = [];
  const fieldChangeExamples = [];
  for (const row of mappedRows) {
    const existing = vehiclesByNo.get(row.vehicleNo);
    const merged = { vehicleNo: row.vehicleNo };
    for (const field of MUTABLE_FIELDS) {
      merged[field] = preferNewOrExisting(row[field], existing?.[field] ?? null);
      // Would this row's field have gone from "has a value" to null
      // under the OLD (buggy) logic that only protected vin/marque/
      // modele/modeleDescription? Purely informational — the fix
      // above already prevents it either way.
      if (['typeCode', 'immatriculation'].includes(field) && !row[field] && existing?.[field]) {
        summary.fieldsThatWouldHaveBeenErasedByTheOldBug++;
      }
    }

    const changedFields = existing
      ? MUTABLE_FIELDS.filter((field) => (existing[field] ?? null) !== merged[field])
      : MUTABLE_FIELDS;
    if (!existing || changedFields.length > 0) {
      summary.vehiclesChanged++;
      if (existing) {
        changedVehicles.push(existing);
        if (fieldChangeExamples.length < 5) {
          fieldChangeExamples.push({
            vehicleNo: row.vehicleNo,
            changed: Object.fromEntries(changedFields.map((f) => [f, { from: existing[f] ?? null, to: merged[f] }])),
          });
        }
      }
    }
    row.merged = merged;
  }
  summary.fieldChangeExamples = fieldChangeExamples;

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