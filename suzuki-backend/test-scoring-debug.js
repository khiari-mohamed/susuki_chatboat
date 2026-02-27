const axios = require('axios');

const API = 'http://localhost:8000/chat/message';
const VEHICLE = { marque: 'SUZUKI', modele: 'S-PRESSO' };

const SCORING_ISSUES = [
  { 
    q: 'amortisseur arriere', 
    issue: 'AMORTISSEUR AR scores lower than MALLE variants',
    expected: 'AMORTISSEUR AR should be #1'
  },
  { 
    q: 'chapement', 
    issue: 'Finds 6 échappement parts but all score below 50',
    expected: 'Should find MARMITE/JOINT/SOUPAPE ECHAPPEMENT'
  },
  { 
    q: 'silencieux', 
    issue: 'Synonym expansion works but scoring rejects all',
    expected: 'Should find échappement parts via synonym'
  },
];

async function debugTest(test, idx) {
  console.log('\n' + '█'.repeat(80));
  console.log(`ISSUE ${idx + 1}/3: "${test.q}"`);
  console.log('█'.repeat(80));
  console.log(`\n🔴 PROBLEM: ${test.issue}`);
  console.log(`✅ EXPECTED: ${test.expected}\n`);
  console.log('─'.repeat(80));
  
  try {
    const res = await axios.post(API, { message: test.q, vehicle: VEHICLE }, { timeout: 10000 });
    const { response, products, confidence, metadata } = res.data;
    
    console.log('\n📊 RESULTS:');
    console.log(`   Confidence: ${confidence} ${metadata?.confidenceScore ? `(${metadata.confidenceScore}%)` : ''}`);
    console.log(`   Products: ${products?.length || 0}`);
    
    if (products && products.length > 0) {
      console.log('\n🎯 PRODUCTS FOUND:');
      products.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.designation}`);
        console.log(`      Ref: ${p.reference} | Price: ${p.prixHt} TND`);
      });
    } else {
      console.log('\n❌ NO PRODUCTS FOUND');
    }
    
    console.log('\n💬 BOT RESPONSE:');
    console.log(`   ${response.substring(0, 150)}${response.length > 150 ? '...' : ''}`);
    
    console.log('\n🔍 BACKEND LOGS TO CHECK:');
    console.log('   Look for:');
    console.log('   - [SEARCH] Expanded terms');
    console.log('   - [SEARCH] Database returned X results');
    console.log('   - [SEARCH] Top 3 scores');
    console.log('   - [SEARCH] After scoring/filtering');
    
    return { q: test.q, found: products?.length || 0 };
  } catch (err) {
    console.log('\n❌ ERROR:', err.message);
    return { q: test.q, found: 0, error: err.message };
  }
}

async function main() {
  console.log('🔬 ULTRA-FOCUSED SCORING DEBUG');
  console.log('Testing only the 3 real scoring issues\n');
  console.log('⚠️  WATCH THE BACKEND LOGS for detailed scoring info!\n');
  
  const results = [];
  for (let i = 0; i < SCORING_ISSUES.length; i++) {
    const res = await debugTest(SCORING_ISSUES[i], i);
    results.push(res);
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n' + '█'.repeat(80));
  console.log('📊 SUMMARY');
  console.log('█'.repeat(80));
  
  results.forEach((r, i) => {
    const issue = SCORING_ISSUES[i];
    console.log(`\n${i + 1}. "${r.q}"`);
    console.log(`   Found: ${r.found} products`);
    console.log(`   Issue: ${issue.issue}`);
    console.log(`   Status: ${r.found > 0 ? '✅ WORKING' : '❌ STILL BROKEN'}`);
  });
  
  const fixed = results.filter(r => r.found > 0).length;
  console.log(`\n🎯 FIXED: ${fixed}/3 scoring issues`);
  console.log(`📈 NEW SCORE: ${((46 + fixed) / 53 * 100).toFixed(1)}%`);
  console.log('\n' + '█'.repeat(80));
}

main().catch(console.error);
