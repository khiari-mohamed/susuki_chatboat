const axios = require('axios');

const API_URL = 'http://localhost:8000';

// Only the 5 problematic parts
const PROBLEM_PARTS = [
  { name: 'cremaillere', issue: 'AI MISS - DB has 2 results' },
  { name: 'valve', issue: 'AI MISS - DB has 1 result' },
  { name: 'maitre', issue: 'Pre-correction bug (maitre → mavitre)' },
  { name: 'toit', issue: 'Detected as GREETING' },
  { name: 'etrier', issue: 'Detected as FILTER_NO_CONTEXT' }
];

// Test a single part name with detailed logging
async function testPartName(partName, issue) {
  try {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 Testing: "${partName}"`);
    console.log(`   Issue: ${issue}`);
    console.log('='.repeat(80));
    
    const response = await axios.post(`${API_URL}/chat/message`, {
      message: partName,
      vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' }
    });
    
    const products = response.data.products || [];
    const metadata = response.data.metadata || {};
    const productsFound = metadata.productsFound || 0;
    const intent = response.data.intent || '';
    const responseText = response.data.response || '';
    
    console.log(`\n📊 Response Details:`);
    console.log(`   - Intent: ${intent}`);
    console.log(`   - Products in array: ${products.length}`);
    console.log(`   - Products found (metadata): ${productsFound}`);
    console.log(`   - Response: ${responseText.substring(0, 200)}...`);
    
    if (products.length > 0) {
      console.log(`\n📦 Products returned:`);
      products.slice(0, 3).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.designation}`);
      });
    }
    
    // Check what the search actually looked for
    console.log(`\n🔎 Search Analysis:`);
    console.log(`   - Query sent: "${partName}"`);
    console.log(`   - AI normalized to: Check logs above`);
    
    const success = productsFound > 0 || products.length > 0;
    
    if (success) {
      console.log(`\n✅ Result: FOUND (${productsFound || products.length} products)`);
    } else {
      console.log(`\n❌ Result: NOT FOUND`);
      console.log(`   💡 Suggestion: Check if part exists in DB or if normalization is wrong`);
    }
    
    return { success, partName, productsFound, intent, issue };
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    return { success: false, partName, error: error.message, issue };
  }
}

// Main test function
async function runTest() {
  console.log('🔍 DETAILED INSPECTION OF PROBLEMATIC PARTS\n');
  console.log(`Testing ${PROBLEM_PARTS.length} parts with known issues...\n`);
  
  const results = [];
  
  for (const part of PROBLEM_PARTS) {
    const result = await testPartName(part.name, part.issue);
    results.push(result);
    
    // Longer delay to see logs clearly
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SUMMARY OF ISSUES');
  console.log('='.repeat(80));
  
  results.forEach((r, idx) => {
    console.log(`\n${idx + 1}. "${r.partName}"`);
    console.log(`   Issue: ${r.issue}`);
    console.log(`   Status: ${r.success ? '✅ FOUND' : '❌ NOT FOUND'}`);
    if (r.intent) {
      console.log(`   Intent: ${r.intent}`);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('💡 RECOMMENDATIONS:');
  console.log('='.repeat(80));
  
  console.log(`
1. "cremaillere" - Add to synonym map or fix Tunisian normalization
2. "valve" - Add to synonym map or fix Tunisian normalization  
3. "maitre" - Remove "itre → vitre" pre-correction or make it more specific
4. "toit" - Fix greeting detection to not trigger on car parts
5. "etrier" - Fix filter detection logic
  `);
}

// Run the test
runTest().catch(console.error);
