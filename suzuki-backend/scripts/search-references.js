const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function searchReferences() {
  console.log('🔍 SEARCHING FOR TEST REFERENCES...\n');

  try {
    // Search for 13780M62S00
    console.log('1. Searching for reference: 13780M62S00');
    const ref1Results = await prisma.piecesRechange.findMany({
      where: {
        OR: [
          { reference: { contains: '13780M62S00', mode: 'insensitive' } },
          { reference: { contains: '13780', mode: 'insensitive' } },
          { reference: { contains: 'M62S00', mode: 'insensitive' } }
        ]
      }
    });
    console.log(`Found ${ref1Results.length} results for 13780M62S00`);
    ref1Results.forEach(part => {
      console.log(`  - ${part.reference}: ${part.designation}`);
    });
    console.log('');

    // Search for FA-17220-M68K00
    console.log('2. Searching for reference: FA-17220-M68K00-INVALID');
    const ref2Results = await prisma.piecesRechange.findMany({
      where: {
        OR: [
          { reference: { contains: 'FA-17220', mode: 'insensitive' } },
          { reference: { contains: '17220', mode: 'insensitive' } },
          { reference: { contains: 'M68K00', mode: 'insensitive' } }
        ]
      }
    });
    console.log(`Found ${ref2Results.length} results for FA-17220-M68K00`);
    ref2Results.forEach(part => {
      console.log(`  - ${part.reference}: ${part.designation}`);
    });
    console.log('');

    // Show some sample references that do exist
    console.log('3. Sample existing references:');
    const sampleRefs = await prisma.piecesRechange.findMany({
      select: { reference: true, designation: true },
      take: 10
    });
    sampleRefs.forEach(part => {
      console.log(`  - ${part.reference}: ${part.designation}`);
    });
    console.log('');

    // Search for filter parts specifically
    console.log('4. Searching for filter parts:');
    const filterParts = await prisma.piecesRechange.findMany({
      where: {
        OR: [
          { designation: { contains: 'filtre', mode: 'insensitive' } },
          { designation: { contains: 'filter', mode: 'insensitive' } },
          { designation: { contains: 'air', mode: 'insensitive' } }
        ]
      },
      take: 5
    });
    console.log(`Found ${filterParts.length} filter-related parts:`);
    filterParts.forEach(part => {
      console.log(`  - ${part.reference}: ${part.designation} (Stock: ${part.stock})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

searchReferences();