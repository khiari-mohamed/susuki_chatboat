const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = ['parts', 'vehicle_model_map', 'item_references', 'vehicles'];
  for (const table of tables) {
    const indexes = await prisma.$queryRawUnsafe(
      `SELECT schemaname, tablename, indexname, indexdef FROM pg_indexes WHERE tablename='${table}' ORDER BY indexname;`
    );
    console.log(`TABLE ${table.toUpperCase()} INDEXES:`);
    indexes.forEach((idx) => console.log(` - ${idx.schemaname}.${idx.indexname}: ${idx.indexdef}`));
    console.log('');
  }
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
