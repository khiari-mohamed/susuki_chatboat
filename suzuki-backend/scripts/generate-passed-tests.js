const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function generateQueryVariations(designation) {
  const base = designation.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const variations = [
    base,
    base.replace(/\s+/g, ''),
    base.split(' ').reverse().join(' '),
    base.replace(/e/g, 'é'),
    base.replace(/a/g, 'à'),
  ];
  
  const words = base.split(' ');
  if (words.length > 0) {
    const typo1 = words[0].slice(1) + ' ' + words.slice(1).join(' ');
    variations.push(typo1.trim());
    
    if (words[0].length > 2) {
      const typo2 = words[0][1] + words[0][0] + words[0].slice(2) + ' ' + words.slice(1).join(' ');
      variations.push(typo2.trim());
    }
  }
  
  return [...new Set(variations)].filter(v => v.length > 2);
}

async function generatePassedTests() {
  const report = JSON.parse(fs.readFileSync('brutal-test-report-1770894400295.json', 'utf8'));
  
  const allParts = await prisma.piecesRechange.findMany({
    select: { designation: true },
    orderBy: { designation: 'asc' }
  });
  
  const allTestKeys = [];
  allParts.forEach(part => {
    const variations = generateQueryVariations(part.designation);
    variations.forEach(query => {
      allTestKeys.push(`${query}::${part.designation}`);
    });
  });
  
  const failedKeys = new Set(report.failures.map(f => `${f.query}::${f.expected}`));
  const passedKeys = allTestKeys.filter(k => !failedKeys.has(k));
  
  fs.writeFileSync('passed-tests.json', JSON.stringify(passedKeys, null, 2));
  console.log(`✅ Created passed-tests.json with ${passedKeys.length} passed tests (will be skipped)`);
  console.log(`🔄 Will re-test ${failedKeys.size} failed/error tests`);
}

generatePassedTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
