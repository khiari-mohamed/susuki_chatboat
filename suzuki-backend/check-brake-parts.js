const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBrakeParts() {
  try {
    console.log('🔍 Checking brake parts for Celerio...\n');
    
    // Search for brake-related parts
    const brakeTerms = ['frein', 'brake', 'plaquette', 'disque', 'disc', 'pad'];
    
    for (const term of brakeTerms) {
      const parts = await prisma.piecesRechange.findMany({
        where: {
          OR: [
            { designation: { contains: term, mode: 'insensitive' } },
            { reference: { contains: term, mode: 'insensitive' } }
          ]
        },
        take: 10
      });
      
      if (parts.length > 0) {
        console.log(`📋 Parts containing "${term}":`);
        parts.forEach(part => {
          console.log(`  - ${part.designation} (${part.reference}) - Stock: ${part.stock} - Prix: ${part.prixHt} TND`);
        });
        console.log('');
      }
    }
    
    // Check total parts count
    const totalParts = await prisma.piecesRechange.count();
    console.log(`📊 Total parts in database: ${totalParts}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBrakeParts();