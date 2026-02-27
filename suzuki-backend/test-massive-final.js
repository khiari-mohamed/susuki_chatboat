const axios = require('axios');

const API = 'http://localhost:8000/chat/message';
const VEHICLE = { marque: 'SUZUKI', modele: 'S-PRESSO' };

const TESTS = [
  // === MAIN PARTS (should find) ===
  { cat: 'Main Part', q: 'filtre air', expect: 'product', contains: 'FILTRE A AIR' },
  { cat: 'Main Part', q: 'filtre huile', expect: 'product', contains: 'FILTRE' },
  { cat: 'Main Part', q: 'disque frein', expect: 'product', contains: 'DISQUE' },
  { cat: 'Main Part', q: 'amortisseur arriere', expect: 'product', contains: 'AMORTISSEUR AR' },
  { cat: 'Main Part', q: 'retroviseur gauche', expect: 'product', contains: 'RETROVISEUR' },
  { cat: 'Main Part', q: 'phare avant', expect: 'product', contains: 'PHARE' },
  
  // === ACCESSORIES ONLY (should reject) ===
  { cat: 'Accessory Only', q: 'batterie', expect: 'none', note: 'Only CAUSSE/SANGLE/SUPPORT exist' },
  { cat: 'Accessory Only', q: 'sangle batterie', expect: 'product', contains: 'SANGLE' },
  { cat: 'Accessory Only', q: 'support batterie', expect: 'product', contains: 'SUPPORT' },
  { cat: 'Accessory Only', q: 'causse batterie', expect: 'product', contains: 'CAUSSE' },
  
  // === TRICKY: Main part + accessory word ===
  { cat: 'Tricky', q: 'support amortisseur', expect: 'product', contains: 'SUPPORT' },
  { cat: 'Tricky', q: 'cache retroviseur', expect: 'product', contains: 'CACHE' },
  { cat: 'Tricky', q: 'clip plaquette', expect: 'product', contains: 'CLIP' },
  
  // === POSITIONS ===
  { cat: 'Position', q: 'amortisseur av', expect: 'clarification', note: 'Needs G/D' },
  { cat: 'Position', q: 'amortisseur av gauche', expect: 'product', contains: 'AMORTISSEUR AV G' },
  { cat: 'Position', q: 'amortisseur av droite', expect: 'product', contains: 'AMORTISSEUR AV D' },
  { cat: 'Position', q: 'disque frein ar', expect: 'none', note: 'No rear disc' },
  { cat: 'Position', q: 'retroviseur d', expect: 'product', contains: 'RETROVISEUR' },
  { cat: 'Position', q: 'retroviseur int', expect: 'product', contains: 'INT' },
  
  // === TYPOS ===
  { cat: 'Typo', q: 'filtere air', expect: 'product', contains: 'FILTRE' },
  { cat: 'Typo', q: 'amorto', expect: 'clarification', note: 'Multiple variants' },
  { cat: 'Typo', q: 'retrviseur', expect: 'product', contains: 'RETROVISEUR' },
  { cat: 'Typo', q: 'plakete', expect: 'clarification', note: 'Needs position' },
  
  // === TUNISIAN ===
  { cat: 'Tunisian', q: 'n7eb filtre air', expect: 'product', contains: 'FILTRE' },
  { cat: 'Tunisian', q: 'choufli disque frein', expect: 'product', contains: 'DISQUE' },
  { cat: 'Tunisian', q: 'famma amortisseur', expect: 'clarification', note: 'Multiple' },
  { cat: 'Tunisian', q: 'ch7al prix filtre air', expect: 'product', contains: 'FILTRE' },
  
  // === REFERENCES ===
  { cat: 'Reference', q: '13780M62S00', expect: 'product', contains: 'FILTRE A AIR' },
  { cat: 'Reference', q: '41800M62S00', expect: 'product', contains: 'AMORTISSEUR AR' },
  { cat: 'Reference', q: '55311M66R00', expect: 'product', contains: 'DISQUE' },
  
  // === MULTI-WORD PARTS ===
  { cat: 'Multi-word', q: 'jeu plaquette', expect: 'product', contains: 'JEU' },
  { cat: 'Multi-word', q: 'marmite echappement', expect: 'product', contains: 'MARMITE' },
  { cat: 'Multi-word', q: 'joint echappement', expect: 'product', contains: 'JOINT' },
  
  // === EDGE CASES ===
  { cat: 'Edge', q: 'echappement', expect: 'product', contains: 'ECHAPPEMENT' },
  { cat: 'Edge', q: 'chapement', expect: 'product', contains: 'ECHAPPEMENT', note: 'Extreme typo' },
  { cat: 'Edge', q: 'silencieux', expect: 'product', contains: 'ECHAPPEMENT' },
  { cat: 'Edge', q: 'turbo', expect: 'none', note: 'Not available' },
  { cat: 'Edge', q: 'catalyseur', expect: 'none', note: 'Not available' },
  
  // === COMPLEX QUERIES ===
  { cat: 'Complex', q: 'filtre air spresso', expect: 'product', contains: 'FILTRE' },
  { cat: 'Complex', q: 'amortisseur avant gauche spresso', expect: 'product', contains: 'AMORTISSEUR' },
  { cat: 'Complex', q: 'disque de frein avant', expect: 'product', contains: 'DISQUE' },
  
  // === PRICE/STOCK ===
  { cat: 'Price', q: 'prix filtre air', expect: 'product', contains: 'FILTRE' },
  { cat: 'Price', q: 'combien coute disque frein', expect: 'product', contains: 'DISQUE' },
  { cat: 'Stock', q: 'disponible amortisseur ar', expect: 'product', contains: 'AMORTISSEUR' },
  { cat: 'Stock', q: 'stock filtre huile', expect: 'product', contains: 'FILTRE' },
  
  // === GREETINGS (should not search) ===
  { cat: 'Greeting', q: 'bonjour', expect: 'greeting' },
  { cat: 'Greeting', q: 'merci', expect: 'greeting' },
  { cat: 'Greeting', q: 'salut', expect: 'greeting' },
  
  // === MORE PARTS ===
  { cat: 'Part', q: 'adhesif porte', expect: 'product', contains: 'ADHESIF' },
  { cat: 'Part', q: 'agrafe', expect: 'product', contains: 'AGRAFE' },
  { cat: 'Part', q: 'durite', expect: 'product', contains: 'DURIT' },
  { cat: 'Part', q: 'cable frein', expect: 'product', contains: 'CABLE' },
  { cat: 'Part', q: 'toc amortisseur', expect: 'product', contains: 'TOC' },
];

async function runTest(test, idx) {
  try {
    console.log(`[${idx + 1}/${TESTS.length}] ${test.q}`);
    
    const res = await axios.post(API, { message: test.q, vehicle: VEHICLE }, { timeout: 10000 });
    const { response, products } = res.data;
    const hasProducts = products && products.length > 0;
    const isClarification = response.includes('préciser') || response.includes('Afin d');
    const isGreeting = response.includes('puis-je vous aider') || response.includes('vous en prie');
    
    let pass = true;
    let reason = '';
    
    if (test.expect === 'product') {
      if (!hasProducts && !isClarification) {
        pass = false;
        reason = `Expected product, got: ${response.substring(0, 80)}`;
      } else if (hasProducts && test.contains && !response.toUpperCase().includes(test.contains.toUpperCase())) {
        pass = false;
        reason = `Expected "${test.contains}", got: ${products[0].designation}`;
      }
    } else if (test.expect === 'none') {
      if (hasProducts) {
        pass = false;
        reason = `Expected none, got: ${products[0].designation}`;
      }
    } else if (test.expect === 'clarification') {
      if (!isClarification) {
        pass = false;
        reason = `Expected clarification, got: ${response.substring(0, 80)}`;
      }
    } else if (test.expect === 'greeting') {
      if (!isGreeting) {
        pass = false;
        reason = `Expected greeting, got: ${response.substring(0, 80)}`;
      }
    }
    
    if (pass) {
      const result = hasProducts ? products[0].designation : isClarification ? 'CLARIFICATION' : isGreeting ? 'GREETING' : 'OK';
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
  console.log('🚀 MASSIVE CHATBOT TEST - 50+ SCENARIOS\n');
  console.log('Testing: Main parts, Accessories, Tricky prompts, Edge cases');
  console.log('Vehicle: SUZUKI S-PRESSO\n');
  console.log('='.repeat(70));
  
  const results = [];
  for (let i = 0; i < TESTS.length; i++) {
    const res = await runTest(TESTS[i], i);
    results.push(res);
    await new Promise(r => setTimeout(r, 150));
  }
  
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  const score = ((passed / TESTS.length) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL RESULTS\n');
  console.log(`✅ Passed: ${passed}/${TESTS.length}`);
  console.log(`❌ Failed: ${failed}/${TESTS.length}`);
  console.log(`📈 Score: ${score}%`);
  
  const cats = [...new Set(TESTS.map(t => t.cat))];
  console.log('\n📋 BY CATEGORY:');
  cats.forEach(cat => {
    const catRes = results.filter(r => r.test.cat === cat);
    const catPass = catRes.filter(r => r.pass).length;
    const catScore = ((catPass / catRes.length) * 100).toFixed(0);
    console.log(`  ${cat}: ${catPass}/${catRes.length} (${catScore}%)`);
  });
  
  if (failed > 0) {
    console.log('\n❌ FAILURES:');
    results.filter(r => !r.pass).forEach((r, i) => {
      console.log(`\n${i + 1}. "${r.test.q}" (${r.test.cat})`);
      console.log(`   Expected: ${r.test.expect}`);
      console.log(`   ${r.reason}`);
    });
  }
  
  console.log('\n' + '='.repeat(70));
  if (score >= 95) {
    console.log('🎉 OUTSTANDING! Production ready!');
  } else if (score >= 90) {
    console.log('🎉 EXCELLENT! Ready for deployment!');
  } else if (score >= 85) {
    console.log('✅ VERY GOOD! Minor tweaks needed.');
  } else if (score >= 80) {
    console.log('✅ GOOD! Some improvements needed.');
  } else {
    console.log('⚠️  NEEDS WORK');
  }
  console.log('='.repeat(70));
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
