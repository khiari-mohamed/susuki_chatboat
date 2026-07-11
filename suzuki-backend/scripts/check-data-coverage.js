const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async function main() {
  const stats = await prisma.$queryRawUnsafe(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN search_description IS NULL OR TRIM(search_description) = '' THEN 1 ELSE 0 END) AS missing_search_desc,
      SUM(CASE WHEN designation_2 IS NULL OR TRIM(designation_2) = '' THEN 1 ELSE 0 END) AS missing_designation2,
      SUM(CASE WHEN source = '02_CARPRO' THEN 1 ELSE 0 END) AS carpro_count
    FROM parts;
  `);
  const stock = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*) AS missing_stock
    FROM parts p
    LEFT JOIN stock s ON p.reference = s.reference
    WHERE s.reference IS NULL;
  `);
  const models = await prisma.$queryRawUnsafe(`
    SELECT COUNT(DISTINCT modele) AS vehicle_models FROM vehicle_model_map;
  `);
  console.log('stats:', stats[0]);
  console.log('stock:', stock[0]);
  console.log('vehicles:', models[0]);
  await prisma.$disconnect();
})();
