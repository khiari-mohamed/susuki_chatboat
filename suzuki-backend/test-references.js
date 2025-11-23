const axios = require('axios');

const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'CELERIO',
  annee: '2021',
  immatriculation: 'TU-123-456'
};

async function testReference(message, expectedToFind = true) {
  console.log(`\n🧪 TESTING: "${message}"`);
  console.log(`Expected to find: ${expectedToFind ? 'YES' : 'NO'}`);
  console.log('─'.repeat(50));
  
  try {
    const response = await axios.post(API_URL, {
      message,
      vehicle: VEHICLE
    });
    
    const data = response.data;
    console.log(`✅ Response received`);
    console.log(`📊 Products found: ${data.products?.length || 0}`);
    console.log(`🎯 Confidence: ${data.confidence}`);
    console.log(`🎭 Intent: ${data.intent}`);
    console.log(`📝 Response preview: ${data.response.substring(0, 100)}...`);
    
    // Check if response contains expected keywords
    const hasProductsFound = data.response.toLowerCase().includes('produits trouvés');
    const hasReference = data.response.includes(message);
    const hasPrice = data.response.toLowerCase().includes('prix');
    const hasStock = data.response.toLowerCase().includes('stock');
    
    console.log(`\n🔍 Analysis:`);
    console.log(`  - Contains "PRODUITS TROUVÉS": ${hasProductsFound ? '✅' : '❌'}`);
    console.log(`  - Contains reference: ${hasReference ? '✅' : '❌'}`);
    console.log(`  - Contains price info: ${hasPrice ? '✅' : '❌'}`);
    console.log(`  - Contains stock info: ${hasStock ? '✅' : '❌'}`);
    
    if (expectedToFind) {
      const success = data.products?.length > 0 && hasProductsFound && hasPrice && hasStock;
      console.log(`\n🎯 TEST RESULT: ${success ? '✅ PASS' : '❌ FAIL'}`);
    } else {
      const success = data.products?.length === 0 && hasProductsFound && data.response.toLowerCase().includes('introuvable');
      console.log(`\n🎯 TEST RESULT: ${success ? '✅ PASS' : '❌ FAIL'}`);
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 STARTING REFERENCE TESTS...\n');
  
  // Test 1: Valid reference that exists
  await testReference('13780M62S00', true);
  
  // Test 2: Invalid reference that doesn't exist
  await testReference('FA-17220-M68K00-INVALID', false);
  
  console.log('\n🏁 TESTS COMPLETED');
}

runTests();