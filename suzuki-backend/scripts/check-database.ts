import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 CHECKING DATABASE CONTENTS...\n');

  try {
    // Check PiecesRechange table
    console.log('📦 PIECES RECHANGE TABLE:');
    const partsCount = await prisma.piecesRechange.count();
    console.log(`Total parts: ${partsCount}`);
    
    if (partsCount > 0) {
      const sampleParts = await prisma.piecesRechange.findMany({ take: 5 });
      console.log('Sample parts:');
      sampleParts.forEach((part, i) => {
        console.log(`  ${i+1}. ${part.reference} - ${part.designation} (${part.versionModele}) - ${part.prixHt} TND - Stock: ${part.stock}`);
      });
    }
    console.log('');

    // Check Vehicles table
    console.log('🚗 VEHICLES TABLE:');
    const vehiclesCount = await prisma.vehicle.count();
    console.log(`Total vehicles: ${vehiclesCount}`);
    
    if (vehiclesCount > 0) {
      const sampleVehicles = await prisma.vehicle.findMany({ take: 3 });
      console.log('Sample vehicles:');
      sampleVehicles.forEach((vehicle, i) => {
        console.log(`  ${i+1}. ${vehicle.immatriculation} - ${vehicle.marque} ${vehicle.modele} ${vehicle.annee}`);
      });
    }
    console.log('');

    // Check Chat Sessions
    console.log('💬 CHAT SESSIONS TABLE:');
    const sessionsCount = await prisma.chatSession.count();
    console.log(`Total sessions: ${sessionsCount}`);
    
    if (sessionsCount > 0) {
      const sampleSessions = await prisma.chatSession.findMany({ take: 3 });
      console.log('Sample sessions:');
      sampleSessions.forEach((session, i) => {
        console.log(`  ${i+1}. ${session.id} - Started: ${session.startedAt}`);
      });
    }
    console.log('');

    // Check Chat Messages
    console.log('📝 CHAT MESSAGES TABLE:');
    const messagesCount = await prisma.chatMessage.count();
    console.log(`Total messages: ${messagesCount}`);
    
    if (messagesCount > 0) {
      const sampleMessages = await prisma.chatMessage.findMany({ 
        take: 5,
        orderBy: { timestamp: 'desc' }
      });
      console.log('Recent messages:');
      sampleMessages.forEach((msg, i) => {
        console.log(`  ${i+1}. [${msg.sender}] ${msg.message.substring(0, 50)}...`);
      });
    }
    console.log('');

    // Check unique version models in parts
    if (partsCount > 0) {
      console.log('🏷️ AVAILABLE MODELS IN PARTS:');
      const models = await prisma.piecesRechange.findMany({
        select: { versionModele: true },
        distinct: ['versionModele']
      });
      console.log('Models:', models.map(m => m.versionModele).join(', '));
      console.log('');
    }

    // Test search for common parts
    console.log('🔍 TESTING SEARCH FOR COMMON PARTS:');
    const filterTests = ['filtre', 'air', 'frein', 'plaquette'];
    
    for (const term of filterTests) {
      const results = await prisma.piecesRechange.findMany({
        where: {
          OR: [
            { designation: { contains: term, mode: 'insensitive' } },
            { reference: { contains: term, mode: 'insensitive' } }
          ]
        },
        take: 3
      });
      console.log(`Search "${term}": ${results.length} results`);
      if (results.length > 0) {
        console.log(`  Example: ${results[0].designation} (${results[0].reference})`);
      }
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();