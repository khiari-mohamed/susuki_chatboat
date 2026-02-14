const axios = require('axios');

const API_URL = 'http://localhost:8000';

// Only the failed parts from the previous test
const FAILED_PARTS = [
  'axe',
  'barre',
  'biellette',
  'cremaillere',
  'etrier',
  'interrupteur',
  'levier',
  'maitre',
  'manometre',
  'phare',
  'poussoir',
  'silentbloc',
  'toit',
  'valve',
  'verin'
];

// Test a single part name
async function testPartName(partName) {
  try {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Testing: "${partName}"`);
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
    
    console.log(`\nResponse:`);
    console.log(`- Intent: ${intent}`);
    console.log(`- Products in array: ${products.length}`);
    console.log(`- Products found (metadata): ${productsFound}`);
    console.log(`- Response text: ${responseText.substring(0, 150)}...`);
    
    if (products.length > 0) {
      console.log(`\nFirst product: ${products[0].designation}`);
    }
    
    const success = productsFound > 0 || products.length > 0;
    console.log(`\n✅ Result: ${success ? 'FOUND' : 'NOT FOUND'}`);
    
    return { success, partName, productsFound, intent };
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    return { success: false, partName, error: error.message };
  }
}

// Main test function
async function runTest() {
  console.log('🔍 TESTING FAILED PARTS ONLY\n');
  console.log(`Testing ${FAILED_PARTS.length} parts that failed in the previous test...\n`);
  
  const results = [];
  
  for (const partName of FAILED_PARTS) {
    const result = await testPartName(partName);
    results.push(result);
    
    // Delay to avoid overwhelming server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\nTotal: ${results.length}`);
  console.log(`✅ Found: ${passed}`);
  console.log(`❌ Not Found: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Parts NOT found in database:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.partName} (${r.intent || 'No intent'})`);
    });
  }
}

// Run the test
runTest().catch(console.error);
