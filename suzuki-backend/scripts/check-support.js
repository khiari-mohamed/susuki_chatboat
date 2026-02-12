const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSupport() {
  console.log('🔍 Checking for SUPPORT parts in database...\n');
  
  const parts = await prisma.piecesRechange.findMany({
    where: {
      designation: {
        contains: 'support',
        mode: 'insensitive'
      }
    },
    take: 20
  });
  
  console.log(`Found ${parts.length} parts with "SUPPORT":\n`);
  parts.forEach(p => {
    console.log(`- ${p.designation} (Ref: ${p.reference})`);
  });
  
  console.log('\n🔍 Checking for parts with MOTEUR...\n');
  
  const moteurParts = await prisma.piecesRechange.findMany({
    where: {
      designation: {
        contains: 'moteur',
        mode: 'insensitive'
      }
    },
    take: 20
  });
  
  console.log(`Found ${moteurParts.length} parts with "MOTEUR":\n`);
  moteurParts.forEach(p => {
    console.log(`- ${p.designation} (Ref: ${p.reference})`);
  });
  
  await prisma.$disconnect();
}

checkSupport().catch(console.error);
