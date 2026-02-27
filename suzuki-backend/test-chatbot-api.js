const axios = require('axios');

const API = 'http://localhost:8000/chat/message';
const VEHICLE = { marque: 'SUZUKI', modele: 'S-PRESSO' };

const TESTS = [
  // Greetings
  { cat: 'Greeting', q: 'bonjour', expectProducts: false },
  { cat: 'Greeting', q: 'merci', expectProducts: false },
  
  // Basic Search
  { cat: 'Search', q: 'filtre air', expectProducts: true, expectIn: 'FILTRE' },
  { cat: 'Search', q: 'batterie', expectProducts: false, note: 'Only accessories exist (filtered)' },
  { cat: 'Search', q: 'plaquette frein', expectClarification: true, note: 'Needs position' },
  { cat: 'Search', q: 'disque frein', expectProducts: true, expectIn: 'DISQUE' },
  { cat: 'Search', q: 'amortisseur', expectClarification: true, note: 'Needs position' },
  
  // Typos
  { cat: 'Typo', q: 'batrie', expectProducts: false, note: 'Only accessories exist' },
  { cat: 'Typo', q: 'filtere', expectProducts: true, expectIn: 'FILTRE' },
  { cat: 'Typo', q: 'plakete', expectProducts: false, note: 'Needs clarification' },
  
  // Tunisian
  { cat: 'Tunisian', q: 'n7eb batterie', expectProducts: false, note: 'Only accessories' },
  { cat: 'Tunisian', q: 'choufli filtre air', expectProducts: true, expectIn: 'FILTRE' },
  
  // Positions
  { cat: 'Position', q: 'amortisseur avant', expectClarification: true, note: 'Needs side (G/D)' },
  { cat: 'Position', q: 'amortisseur ar', expectProducts: true, expectIn: 'AMORTISSEUR AR' },
  { cat: 'Position', q: 'disque frein avant', expectProducts: true, expectIn: 'DISQUE' },
  { cat: 'Position', q: 'disque frein ar', expectProducts: false, note: 'No rear disc' },
  
  // Price/Stock
  { cat: 'Price', q: 'prix batterie', expectProducts: false, note: 'Only accessories' },
  { cat: 'Stock', q: 'disponible filtre air', expectProducts: true, expectIn: 'FILTRE' },
  
  // References
  { cat: 'Reference', q: '13780M62S00', expectProducts: true, expectIn: 'FILTRE' },
  { cat: 'Reference', q: '41800M62S00', expectProducts: true, expectIn: 'AMORTISSEUR' },
];

async function runTest(test, idx) {
  try {
    console.log(`[${idx + 1}/${TESTS.length}] ${test.q} (${test.cat})`);
    
    const res = await axios.post(API, {
      message: test.q,
      vehicle: VEHICLE
    }, { timeout: 10000 });
    
    const { response, products, intent } = res.data;
    const hasProducts = products && products.length > 0;
    
    let pass = true;
    let reason = '';
    
    if (test.expectClarification) {
      const isClarification = response.includes('préciser') || response.includes('Afin d');
      if (!isClarification) {
        pass = false;
        reason = `Expected clarification, got: ${response.substring(0, 100)}`;
      }
    } else if (test.expectProducts && !hasProducts) {
      pass = false;
      reason = `Expected products, got none. Response: ${response.substring(0, 100)}`;
    } else if (!test.expectProducts && hasProducts) {
      pass = false;
      reason = `Expected no products, got ${products.length}`;
    } else if (test.expectProducts && hasProducts && test.expectIn) {
      const found = response.toUpperCase().includes(test.expectIn.toUpperCase());
      if (!found) {
        pass = false;
        reason = `Expected "${test.expectIn}" in response, got: ${response.substring(0, 100)}`;
      }
    }
    
    if (pass) {
      console.log(`  ✅ ${hasProducts ? products[0].designation : 'OK'}`);
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
  console.log('🚀 CHATBOT API TEST\n');
  console.log('Testing against: ' + API);
  console.log('Vehicle: SUZUKI S-PRESSO\n');
  console.log('='.repeat(60));
  
  const results = [];
  for (let i = 0; i < TESTS.length; i++) {
    const res = await runTest(TESTS[i], i);
    results.push(res);
    await new Promise(r => setTimeout(r, 200));
  }
  
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  const score = ((passed / TESTS.length) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS\n');
  console.log(`✅ Passed: ${passed}/${TESTS.length}`);
  console.log(`❌ Failed: ${failed}/${TESTS.length}`);
  console.log(`📈 Score: ${score}%`);
  
  const cats = [...new Set(TESTS.map(t => t.cat))];
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
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
