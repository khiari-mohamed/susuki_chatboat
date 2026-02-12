const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simulate the typeWeights
const typeWeights = {
  'support': 1.3,
  'moteur': 1.2
};

async function testSupportMoteur() {
  console.log('🧪 Testing "support moteur" search logic\n');
  
  const rawTokens = ['support', 'moteur'];
  const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd'];
  const accessoryWords = ['support', 'sangle', 'cable', 'causse', 'fixation', 'adhesif', 'clip', 'vis', 'boulon', 'pare', 'boue', 'cache', 'baguette', 'joint', 'catadioptre', 'bouchon', 'couvercle', 'garniture'];
  
  const firstToken = rawTokens.find(t => t.length >= 3 && !positionWords.includes(t));
  console.log(`First token: "${firstToken}"`);
  console.log(`Is first token an accessory? ${accessoryWords.includes(firstToken)}\n`);
  
  const candidates = rawTokens
    .filter(token => Object.keys(typeWeights).includes(token) && !positionWords.includes(token));
  
  console.log(`Candidates: [${candidates.join(', ')}]\n`);
  
  const sorted = candidates.sort((a, b) => {
    console.log(`Comparing "${a}" vs "${b}":`);
    
    if (firstToken && accessoryWords.includes(firstToken) && (a === firstToken || b === firstToken)) {
      console.log(`  → First token "${firstToken}" is accessory, prioritizing it`);
      return a === firstToken ? -1 : 1;
    }
    
    const weightA = typeWeights[a] || 1.0;
    const weightB = typeWeights[b] || 1.0;
    console.log(`  → Weight: ${a}=${weightA}, ${b}=${weightB}`);
    
    if (weightB !== weightA) {
      console.log(`  → Winner by weight: ${weightB > weightA ? b : a}`);
      return weightB - weightA;
    }
    
    console.log(`  → Winner by length: ${b.length > a.length ? b : a}`);
    return b.length - a.length;
  });
  
  console.log(`\n✅ Main part type: "${sorted[0]}"\n`);
  
  // Now search database
  console.log('🔍 Searching database for parts with "support" AND "moteur"...\n');
  
  const parts = await prisma.piecesRechange.findMany({
    where: {
      AND: [
        { designation: { contains: 'support', mode: 'insensitive' } },
        { designation: { contains: 'moteur', mode: 'insensitive' } }
      ]
    }
  });
  
  console.log(`Found ${parts.length} parts:\n`);
  parts.forEach(p => {
    console.log(`- ${p.designation} (Ref: ${p.reference})`);
  });
  
  await prisma.$disconnect();
}

testSupportMoteur().catch(console.error);
