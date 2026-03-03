const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeData() {
  console.log('🔍 ANALYZING DATABASE FOR POSITION/SIDE DATA\n');
  console.log('='.repeat(80));

  // Test queries
  const testQueries = [
    { name: 'amortisseur', query: 'amortisseur' },
    { name: 'retroviseur', query: 'retroviseur' },
    { name: 'filtre', query: 'filtre' },
    { name: 'plaquette', query: 'plaquette' },
    { name: 'disque', query: 'disque' },
    { name: 'phare', query: 'phare' },
  ];

  for (const test of testQueries) {
    console.log(`\n📦 Part: ${test.name.toUpperCase()}`);
    console.log('-'.repeat(80));

    const products = await prisma.$queryRaw`
      SELECT designation, reference, stock
      FROM mart.chatbot_parts_with_fitment
      WHERE designation ILIKE ${'%' + test.query + '%'}
      LIMIT 20
    `;

    console.log(`   Total found: ${products.length}`);

    // Extract positions
    const positions = new Set();
    const sides = new Set();
    
    products.forEach(p => {
      const d = p.designation.toUpperCase();
      
      // Check positions
      if (/\b(AV|AVANT)\b/.test(d)) positions.add('AVANT');
      if (/\b(AR|ARRIERE|ARRIÈRE)\b/.test(d)) positions.add('ARRIERE');
      
      // Check sides
      if (/\b(G|GAUCHE)\b/.test(d)) sides.add('GAUCHE');
      if (/\b(D|DROIT|DROITE)\b/.test(d)) sides.add('DROITE');
    });

    console.log(`   Positions found: ${Array.from(positions).join(', ') || 'NONE'}`);
    console.log(`   Sides found: ${Array.from(sides).join(', ') || 'NONE'}`);
    
    // Show samples
    console.log(`   Sample designations:`);
    products.slice(0, 5).forEach(p => {
      console.log(`      - ${p.designation}`);
    });

    // Decision
    const shouldAskPosition = positions.size > 1;
    const shouldAskSide = sides.size > 1;
    
    console.log(`   ✅ Should ask position? ${shouldAskPosition ? 'YES' : 'NO'}`);
    console.log(`   ✅ Should ask side? ${shouldAskSide ? 'YES' : 'NO'}`);
  }

  console.log('\n\n' + '='.repeat(80));
  console.log('🎯 SUMMARY');
  console.log('='.repeat(80));
  console.log('This shows whether your database has position/side data.');
  console.log('If positions/sides are found, clarification logic will work.');
  console.log('If NOT found, you need to add position/side to designations.');

  await prisma.$disconnect();
}

analyzeData().catch(console.error);
