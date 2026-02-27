const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectDatabase() {
  console.log('🔍 INSPECTING DATABASE...\n');
  
  const total = await prisma.piecesRechange.count();
  const spresso = await prisma.piecesRechange.count({ where: { versionModele: 'SPRESSO' } });
  
  console.log(`📦 Total parts: ${total}`);
  console.log(`🚗 SPRESSO parts: ${spresso}\n`);
  
  const categories = {
    'FILTRE': await prisma.piecesRechange.findMany({ where: { designation: { contains: 'FILTRE', mode: 'insensitive' }, versionModele: 'SPRESSO' }, take: 3 }),
    'BATTERIE': await prisma.piecesRechange.findMany({ where: { designation: { contains: 'BATTERIE', mode: 'insensitive' }, versionModele: 'SPRESSO' }, take: 3 }),
    'PLAQUETTE': await prisma.piecesRechange.findMany({ where: { designation: { contains: 'PLAQUETTE', mode: 'insensitive' }, versionModele: 'SPRESSO' }, take: 3 }),
    'DISQUE': await prisma.piecesRechange.findMany({ where: { designation: { contains: 'DISQUE', mode: 'insensitive' }, versionModele: 'SPRESSO' }, take: 3 }),
    'AMORTISSEUR': await prisma.piecesRechange.findMany({ where: { designation: { contains: 'AMORTISSEUR', mode: 'insensitive' }, versionModele: 'SPRESSO' }, take: 3 }),
    'RETROVISEUR': await prisma.piecesRechange.findMany({ where: { designation: { contains: 'RETROVISEUR', mode: 'insensitive' }, versionModele: 'SPRESSO' }, take: 3 }),
    'ECHAPPEMENT': await prisma.piecesRechange.findMany({ where: { designation: { contains: 'ECHAPPEMENT', mode: 'insensitive' }, versionModele: 'SPRESSO' }, take: 3 }),
  };
  
  console.log('📋 AVAILABLE PARTS BY CATEGORY:\n');
  for (const [cat, parts] of Object.entries(categories)) {
    console.log(`${cat}: ${parts.length} found`);
    parts.forEach(p => console.log(`  • ${p.designation} (${p.reference})`));
  }
  
  return categories;
}

async function buildDynamicTests(dbParts) {
  const tests = [];
  
  // Greetings (always test)
  tests.push({ cat: 'Greeting', q: 'bonjour', expect: 'greeting', shouldFind: false });
  tests.push({ cat: 'Greeting', q: 'merci', expect: 'thanks', shouldFind: false });
  
  // Dynamic tests based on DB
  if (dbParts.FILTRE.length > 0) {
    const ref = dbParts.FILTRE[0].reference;
    tests.push({ cat: 'Search', q: 'filtre air', expect: 'FILTRE', shouldFind: true });
    tests.push({ cat: 'Typo', q: 'filtere', expect: 'FILTRE', shouldFind: true });
    tests.push({ cat: 'Reference', q: ref, expect: 'FILTRE', shouldFind: true });
  }
  
  if (dbParts.BATTERIE.length > 0) {
    tests.push({ cat: 'Search', q: 'batterie', expect: 'BATTERIE', shouldFind: true });
    tests.push({ cat: 'Typo', q: 'batrie', expect: 'BATTERIE', shouldFind: true });
    tests.push({ cat: 'Tunisian', q: 'n7eb batterie', expect: 'BATTERIE', shouldFind: true });
    tests.push({ cat: 'Price', q: 'prix batterie', expect: 'BATTERIE', shouldFind: true });
  }
  
  if (dbParts.PLAQUETTE.length > 0) {
    tests.push({ cat: 'Search', q: 'plaquette frein', expect: 'PLAQUETTE', shouldFind: true });
    tests.push({ cat: 'Typo', q: 'plakete', expect: 'PLAQUETTE', shouldFind: true });
    tests.push({ cat: 'Position', q: 'plaquette frein avant', expect: 'PLAQUETTE', shouldFind: true });
  }
  
  if (dbParts.DISQUE.length > 0) {
    const hasAvant = dbParts.DISQUE.some(p => /AVANT|AV/i.test(p.designation));
    const hasArriere = dbParts.DISQUE.some(p => /ARRIERE|AR/i.test(p.designation));
    
    tests.push({ cat: 'Search', q: 'disque frein', expect: 'DISQUE', shouldFind: true });
    if (hasAvant) tests.push({ cat: 'Position', q: 'disque frein avant', expect: 'DISQUE', shouldFind: true });
    if (!hasArriere) tests.push({ cat: 'Edge', q: 'disque frein ar', expect: 'NO_RESULTS', shouldFind: false, note: 'No rear disc' });
  }
  
  if (dbParts.AMORTISSEUR.length > 0) {
    const hasAvant = dbParts.AMORTISSEUR.some(p => /AVANT|AV/i.test(p.designation));
    const hasArriere = dbParts.AMORTISSEUR.some(p => /ARRIERE|AR/i.test(p.designation));
    
    tests.push({ cat: 'Search', q: 'amortisseur', expect: 'AMORTISSEUR', shouldFind: true });
    if (hasAvant) tests.push({ cat: 'Position', q: 'amortisseur av', expect: 'AMORTISSEUR', shouldFind: true });
    if (hasArriere) tests.push({ cat: 'Position', q: 'amortisseur ar', expect: 'AMORTISSEUR', shouldFind: true });
  }
  
  if (dbParts.RETROVISEUR.length > 0) {
    const hasGauche = dbParts.RETROVISEUR.some(p => /GAUCHE|G/i.test(p.designation));
    const hasDroite = dbParts.RETROVISEUR.some(p => /DROITE|D/i.test(p.designation));
    
    tests.push({ cat: 'Search', q: 'retroviseur', expect: 'RETROVISEUR', shouldFind: true });
    if (hasGauche) tests.push({ cat: 'Position', q: 'retroviseur gauche', expect: 'RETROVISEUR', shouldFind: true });
    if (hasDroite) tests.push({ cat: 'Position', q: 'retroviseur d', expect: 'RETROVISEUR', shouldFind: true });
  }
  
  if (dbParts.ECHAPPEMENT.length === 0) {
    tests.push({ cat: 'Edge', q: 'echappement', expect: 'NO_RESULTS', shouldFind: false, note: 'Not available for CELERIO' });
  }
  
  return tests;
}

async function runTest(test, idx, total) {
  try {
    console.log(`[${idx + 1}/${total}] ${test.q} (${test.cat})`);
    
    const parts = await prisma.piecesRechange.findMany({
      where: {
        OR: [
          { designation: { contains: test.q, mode: 'insensitive' } },
          { reference: { contains: test.q, mode: 'insensitive' } }
        ],
        versionModele: 'SPRESSO'
      },
      take: 5
    });
    
    const found = parts.length > 0;
    const result = parts[0]?.designation || 'NO_RESULTS';
    
    let pass = true;
    let reason = '';
    
    if (test.shouldFind && !found) {
      pass = false;
      reason = `Expected ${test.expect}, got NO_RESULTS`;
    } else if (!test.shouldFind && found) {
      pass = false;
      reason = `Expected NO_RESULTS, got ${result}`;
    } else if (test.shouldFind && found && !result.toUpperCase().includes(test.expect.toUpperCase())) {
      pass = false;
      reason = `Expected ${test.expect}, got ${result}`;
    }
    
    if (pass) {
      console.log(`  ✅ ${result}`);
    } else {
      console.log(`  ❌ ${reason}`);
      if (test.note) console.log(`     Note: ${test.note}`);
    }
    
    return { pass, test, reason };
  } catch (err) {
    console.log(`  ❌ ERROR: ${err.message}`);
    return { pass: false, test, reason: err.message };
  }
}

async function main() {
  console.log('🚀 COMPREHENSIVE CHATBOT TEST\n');
  console.log('='.repeat(60));
  
  const dbParts = await inspectDatabase();
  
  console.log('\n' + '='.repeat(60));
  console.log('🧪 BUILDING DYNAMIC TESTS...\n');
  
  const tests = await buildDynamicTests(dbParts);
  console.log(`Generated ${tests.length} tests based on DB content\n`);
  
  console.log('='.repeat(60));
  console.log('🏃 RUNNING TESTS...\n');
  
  const results = [];
  for (let i = 0; i < tests.length; i++) {
    const res = await runTest(tests[i], i, tests.length);
    results.push(res);
    await new Promise(r => setTimeout(r, 50));
  }
  
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  const score = ((passed / tests.length) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS\n');
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  console.log(`📈 Score: ${score}%`);
  
  const cats = [...new Set(tests.map(t => t.cat))];
  console.log('\n📋 BY CATEGORY:');
  cats.forEach(cat => {
    const catRes = results.filter(r => r.test.cat === cat);
    const catPass = catRes.filter(r => r.pass).length;
    console.log(`  ${cat}: ${catPass}/${catRes.length}`);
  });
  
  if (failed > 0) {
    console.log('\n❌ FAILURES:');
    results.filter(r => !r.pass).forEach((r, i) => {
      console.log(`\n${i + 1}. "${r.test.q}" (${r.test.cat})`);
      console.log(`   ${r.reason}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(score >= 90 ? '🎉 EXCELLENT!' : score >= 80 ? '✅ GOOD!' : score >= 70 ? '⚠️  OK' : '❌ NEEDS WORK');
  console.log('='.repeat(60));
  
  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
