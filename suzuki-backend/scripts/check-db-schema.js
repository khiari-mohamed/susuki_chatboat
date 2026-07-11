const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
  );
  console.log('TABLES:');
  tables.forEach((r) => console.log(' -', r.table_name));

  const cols = await prisma.$queryRawUnsafe(
    "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('parts', 'vehicle_model_map', 'fitment', 'stock') ORDER BY table_name, column_name;"
  );
  console.log('COLUMNS:');
  cols.forEach((r) => console.log(` - ${r.table_name}.${r.column_name}: ${r.data_type}`));

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
