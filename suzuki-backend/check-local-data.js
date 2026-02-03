const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public'
    }
  }
});

async function checkData() {
  try {
    console.log('🔍 Checking local database data...\n');

    const vehicleCount = await prisma.vehicle.count();
    const piecesCount = await prisma.piecesRechange.count();
    const clientCount = await prisma.client.count();
    const employeCount = await prisma.employe.count();
    const venteCount = await prisma.vente.count();
    const chatSessionCount = await prisma.chatSession.count();

    console.log('📊 DATA COUNTS:');
    console.log('================');
    console.log(`Vehicles: ${vehicleCount}`);
    console.log(`Pièces Rechange: ${piecesCount}`);
    console.log(`Clients: ${clientCount}`);
    console.log(`Employés: ${employeCount}`);
    console.log(`Ventes: ${venteCount}`);
    console.log(`Chat Sessions: ${chatSessionCount}`);
    console.log('================\n');

    if (piecesCount > 0) {
      console.log('📦 Sample Parts (first 5):');
      const sampleParts = await prisma.piecesRechange.findMany({ take: 5 });
      sampleParts.forEach(part => {
        console.log(`  - ${part.reference}: ${part.designation} (${part.prix_vente_ttc} TND)`);
      });
    }

    console.log('\n✅ Check complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
