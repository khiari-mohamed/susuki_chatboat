import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { VehicleModelsService } from '../src/constants/vehicle-models.service';
import { PrismaService } from '../src/prisma/prisma.service';

type VehicleTypeMasterRow = {
  typeCode: string;
  modelName: string | null;
};

type SeedCandidate = {
  modele: string;
  typeCode: string;
  sourceModelName: string | null;
};

const BATCH_SIZE = 500;

function parseArgs(argv: string[]) {
  return {
    apply: argv.includes('--apply'),
  };
}

async function writeBackup(prisma: PrismaClient, backupDir: string) {
  const rows = await prisma.vehicleModelMap.findMany({
    select: {
      id: true,
      modele: true,
      typeCode: true,
    },
    orderBy: [{ modele: 'asc' }, { typeCode: 'asc' }],
  });

  fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `vehicle-model-map-backup-${timestamp}.json`);

  fs.writeFileSync(backupPath, JSON.stringify({ createdAt: new Date().toISOString(), rows }, null, 2), 'utf8');
  return backupPath;
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  const prisma = new PrismaClient();
  const prismaService = new PrismaService();
  const vehicleModelsService = new VehicleModelsService(prismaService);

  try {
    await prismaService.onModuleInit();
    await vehicleModelsService.onModuleInit();

    const rows = await prisma.vehicleTypeMaster.findMany({
      select: {
        typeCode: true,
        modelName: true,
      },
      orderBy: [{ typeCode: 'asc' }, { modelName: 'asc' }],
    });

    const candidates: SeedCandidate[] = [];
    const seen = new Set<string>();

    for (const row of rows as VehicleTypeMasterRow[]) {
      const normalizedModele = vehicleModelsService.normalize(row.modelName ?? undefined);
      if (!normalizedModele) {
        continue;
      }

      const key = `${normalizedModele}::${row.typeCode}`;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      candidates.push({
        modele: normalizedModele,
        typeCode: row.typeCode,
        sourceModelName: row.modelName,
      });
    }

    const existingRows = await prisma.vehicleModelMap.findMany({
      select: { modele: true, typeCode: true },
      orderBy: [{ modele: 'asc' }, { typeCode: 'asc' }],
    });
    const existingSet = new Set(existingRows.map((row) => `${row.modele}::${row.typeCode}`));
    const newRows = candidates.filter((row) => !existingSet.has(`${row.modele}::${row.typeCode}`));

    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'preview',
      vehicleTypeMasterRows: rows.length,
      normalizedCandidates: candidates.length,
      existingMappings: existingRows.length,
      newMappings: newRows.length,
      sampleCandidates: newRows.slice(0, 10),
    }, null, 2));

    if (!apply) {
      console.log('Dry run only. Re-run with --apply to insert new mappings.');
      return;
    }

    const backupDir = path.resolve(__dirname, '..', 'backups', 'vehicle-model-map');
    const backupPath = await writeBackup(prisma, backupDir);
    console.log(`Backup written to ${backupPath}`);

    let inserted = 0;
    for (let index = 0; index < newRows.length; index += BATCH_SIZE) {
      const batch = newRows.slice(index, index + BATCH_SIZE);
      const result = await prisma.vehicleModelMap.createMany({
        data: batch.map((row) => ({ modele: row.modele, typeCode: row.typeCode })),
        skipDuplicates: true,
      });
      inserted += result.count;
    }

    console.log(JSON.stringify({
      applied: true,
      inserted,
      skippedExisting: newRows.length - inserted,
      backupPath,
    }, null, 2));
  } finally {
    await prismaService.$disconnect();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
