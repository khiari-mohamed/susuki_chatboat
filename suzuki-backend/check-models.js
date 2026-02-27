const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.piecesRechange.count();
  console.log(`Total parts: ${total}`);
  
  const sample = await prisma.piecesRechange.findMany({ take: 10 });
  console.log('\nSample parts:');
  sample.forEach(p => {
    console.log(`${p.designation} | Model: "${p.versionModele}"`);
  });
  
  const models = await prisma.piecesRechange.groupBy({
    by: ['versionModele'],
    _count: true
  });
  
  console.log('\nAll models in DB:');
  models.forEach(m => {
    console.log(`"${m.versionModele}": ${m._count} parts`);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
