const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const migrationFile = path.join(__dirname, '..', 'prisma', 'migrations', '20260504144334_production_data_redesign', 'migration.sql');
  const content = fs.readFileSync(migrationFile, 'utf8');
  const checksum = crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  console.log('file checksum:', checksum);

  const rows = await prisma.$queryRawUnsafe(
    "SELECT migration_name, checksum, finished_at, logs FROM _prisma_migrations WHERE migration_name='20260504144334_production_data_redesign';"
  );
  console.log('db record:');
  console.log(rows);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
