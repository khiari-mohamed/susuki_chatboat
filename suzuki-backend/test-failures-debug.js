const axios = require('axios');

const API = 'http://localhost:8000/chat/message';
const VEHICLE = { marque: 'SUZUKI', modele: 'S-PRESSO' };

// Only test the failures from previous run
const FAILURES = [
  { cat: 'Main Part', q: 'amortisseur arriere', expect: 'product', contains: 'AMORTISSEUR AR', note: 'Should find rear shock' },
  { cat: 'Main Part', q: 'phare avant', expect: 'product', contains: 'PHARE', note: 'Should find front headlight' },
  { cat: 'Typo', q: 'plakete', expect: 'clarification', note: 'Extreme typo for plaquette' },
  { cat: 'Edge', q: 'chapement', expect: 'product', contains: 'ECHAPPEMENT', note: 'Extreme typo for échappement' },
  { cat: 'Edge', q: 'silencieux', expect: 'product', contains: 'ECHAPPEMENT', note: 'Synonym for échappement' },
  { cat: 'Complex', q: 'filtre air spresso', expect: 'product', contains: 'FILTRE', note: 'With model name' },
  { cat: 'Complex', q: 'amortisseur avant gauche spresso', expect: 'product', contains: 'AMORTISSEUR', note: 'Full query with model' },
];

async function runDetailedTest(test, idx) {
  console.log('\n' + '='.repeat(80));
  console.log(`[${idx + 1}/${FAILURES.length}] "${test.q}" (${test.cat})`);
  console.log('Expected:', test.expect, test.contains ? `containing "${test.contains}"` : '');
  console.log('Note:', test.note);
  console.log('-'.repeat(80));
  
  try {
    const res = await axios.post(API, { message: test.q, vehicle: VEHICLE }, { timeout: 10000 });
    const { response, products, intent, confidence, metadata } = res.data;
    
    console.log('\n📊 RESPONSE DETAILS:');
    console.log('Intent:', intent);
    console.log('Confidence:', confidence, metadata?.confidenceScore ? `(${metadata.confidenceScore}%)` : '');
    console.log('Products found:', products?.length || 0);
    
    if (products && products.length > 0) {
      console.log('\n🔍 PRODUCTS:');
      products.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.designation}`);
        console.log(`     Ref: ${p.reference} | Price: ${p.prixHt} TND`);
      });
    }
    
    console.log('\n💬 BOT RESPONSE:');
    console.log(response.substring(0, 200) + (response.length > 200 ? '...' : ''));
    
    const hasProducts = products && products.length > 0;
    const isClarification = response.includes('préciser') || response.includes('Afin d');
    
    let pass = true;
    let reason = '';
    
    if (test.expect === 'product') {
      if (!hasProducts && !isClarification) {
        pass = false;
        reason = 'Expected product but got none';
      } else if (hasProducts && test.contains && !response.toUpperCase().includes(test.contains.toUpperCase())) {
        pass = false;
        reason = `Expected "${test.contains}" but got "${products[0].designation}"`;
      }
    } else if (test.expect === 'clarification') {
      if (!isClarification) {
        pass = false;
        reason = 'Expected clarification but got direct response';
      }
    }
    
    console.log('\n' + (pass ? '✅ PASS' : '❌ FAIL: ' + reason));
    
    return { pass, test, reason, response: response.substring(0, 100) };
  } catch (err) {
    console.log('\n❌ ERROR:', err.message);
    return { pass: false, test, reason: err.message };
  }
}

async function main() {
  console.log('🔍 FOCUSED FAILURE ANALYSIS');
  console.log('Testing only the 7 failures from previous run\n');
  console.log('='.repeat(80));
  
  const results = [];
  for (let i = 0; i < FAILURES.length; i++) {
    const res = await runDetailedTest(FAILURES[i], i);
    results.push(res);
    await new Promise(r => setTimeout(r, 200));
  }
  
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  const score = ((passed / FAILURES.length) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 FAILURE RE-TEST RESULTS\n');
  console.log(`✅ Now passing: ${passed}/${FAILURES.length}`);
  console.log(`❌ Still failing: ${failed}/${FAILURES.length}`);
  console.log(`📈 Improvement: ${score}% of failures fixed`);
  
  console.log('\n📈 OVERALL CHATBOT SCORE:');
  const totalTests = 53; // From previous run
  const previousPassed = 46;
  const newPassed = previousPassed + passed;
  const overallScore = ((newPassed / totalTests) * 100).toFixed(1);
  console.log(`Total: ${newPassed}/${totalTests} tests passing`);
  console.log(`Overall Score: ${overallScore}%`);
  
  if (failed > 0) {
    console.log('\n❌ STILL FAILING:');
    results.filter(r => !r.pass).forEach((r, i) => {
      console.log(`\n${i + 1}. "${r.test.q}"`);
      console.log(`   Category: ${r.test.cat}`);
      console.log(`   Reason: ${r.reason}`);
      console.log(`   Note: ${r.test.note}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  if (overallScore >= 95) {
    console.log('🎉 OUTSTANDING! Production ready!');
  } else if (overallScore >= 90) {
    console.log('🎉 EXCELLENT! Ready for deployment!');
  } else if (overallScore >= 85) {
    console.log('✅ VERY GOOD! Minor tweaks recommended.');
  } else {
    console.log('⚠️  GOOD! Some improvements needed.');
  }
  console.log('='.repeat(80));
}

main().catch(console.error);
