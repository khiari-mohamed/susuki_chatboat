const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkParts() {
  const partsToCheck = [
    'AGRAFFE',
    'AGRAFFES',
    'AGRAFES',
    'AGRAFE',
    'AGRAPHE PARA SOLEIL',
    'AGRAFE FEU AR',
    'AGRAFFES FEU AR',
    'APPAREIL MONTE GLACE AR D',
    'BAS DE CAISSE D',
    'BAS DE CAISSE G'
  ];

  console.log('🔍 Checking database for parts...\n');

  for (const part of partsToCheck) {
    const result = await prisma.piecesRechange.findFirst({
      where: { designation: part }
    });
    
    console.log(`${result ? '✅' : '❌'} ${part}`);
  }

  await prisma.$disconnect();
}

checkParts();
