const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const migrations = await prisma.$queryRawUnsafe(
    "SELECT id, migration_name, finished_at, logs FROM _prisma_migrations ORDER BY finished_at;"
  );
  console.log('MIGRATIONS:');
  migrations.forEach((r) => console.log(` - ${r.migration_name} | finished_at=${r.finished_at}`));

  const vinIndexes = await prisma.$queryRawUnsafe(
    "SELECT indexname, indexdef FROM pg_indexes WHERE tablename='vehicles' ORDER BY indexname;"
  );
  console.log('VEHICLES INDEXES:');
  vinIndexes.forEach((r) => console.log(` - ${r.indexname}: ${r.indexdef}`));

  const vinCol = await prisma.$queryRawUnsafe(
    "SELECT column_name, data_type, character_maximum_length, is_nullable FROM information_schema.columns WHERE table_name='vehicles' AND column_name='vin';"
  );
  console.log('VIN COLUMN:');
  vinCol.forEach((r) => console.log(` - ${r.column_name} | ${r.data_type}(${r.character_maximum_length}) nullable=${r.is_nullable}`));

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
