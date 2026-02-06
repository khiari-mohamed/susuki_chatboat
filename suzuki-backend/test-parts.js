const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TEST_PARTS = [
  // Bilateral parts (should ask gauche/droite)
  { query: 'amortisseur avant', expectedClarification: 'side' },
  { query: 'rétroviseur avant', expectedClarification: 'side' },
  { query: 'porte avant', expectedClarification: 'side' },
  { query: 'phare avant', expectedClarification: 'side' },
  { query: 'clignotant avant', expectedClarification: 'side' },
  
  // Position parts (should ask avant/arrière)
  { query: 'plaquette frein', expectedClarification: 'position' },
  { query: 'disque frein', expectedClarification: 'position' },
  
  // Specific parts (should return directly)
  { query: 'amortisseur avant gauche', expectedClarification: 'none' },
  { query: 'plaquette frein avant', expectedClarification: 'none' },
  { query: 'batterie', expectedClarification: 'none' },
  { query: 'filtre air', expectedClarification: 'none' },
  { query: 'filtre huile', expectedClarification: 'none' },
];

async function testParts() {
  console.log('\n🧪 TESTING PARTS SEARCH FOR SPRESSO\n');
  console.log('='.repeat(80));
  
  for (const test of TEST_PARTS) {
    console.log(`\n📝 Testing: "${test.query}"`);
    console.log(`   Expected: ${test.expectedClarification === 'side' ? 'Ask gauche/droite' : test.expectedClarification === 'position' ? 'Ask avant/arrière' : 'Direct result'}`);
    
    try {
      // Search in database
      const words = test.query.toLowerCase().split(' ');
      const results = await prisma.piecesRechange.findMany({
        where: {
          AND: words.map(word => ({
            designation: {
              contains: word,
              mode: 'insensitive'
            }
          })),
          versionModele: 'SPRESSO'
        },
        take: 5
      });
      
      console.log(`   ✅ Found: ${results.length} parts`);
      
      if (results.length > 0) {
        console.log(`   📦 Sample: ${results[0].designation}`);
        
        // Check if multiple positions/sides exist
        const hasAvant = results.some(r => /\b(avant|av)\b/i.test(r.designation));
        const hasArriere = results.some(r => /\b(arriere|arrière|ar)\b/i.test(r.designation));
        const hasGauche = results.some(r => /\b(gauche|g)\b/i.test(r.designation));
        const hasDroite = results.some(r => /\b(droite|droit|d)\b/i.test(r.designation));
        
        if (hasGauche && hasDroite) {
          console.log(`   🔍 Analysis: Has both gauche/droite → Should ask for side`);
        } else if (hasAvant && hasArriere) {
          console.log(`   🔍 Analysis: Has both avant/arrière → Should ask for position`);
        } else {
          console.log(`   🔍 Analysis: Single variant → Direct result`);
        }
      } else {
        console.log(`   ❌ No parts found in database`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Test complete!\n');
}

testParts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
