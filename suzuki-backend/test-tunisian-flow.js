const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

// Test data
const vehicle = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: '2024',
  immatriculation: '243TUNIS4698'
};

let sessionId = null;

async function sendMessage(message) {
  try {
    console.log(`\n📤 USER: "${message}"`);
    
    const response = await axios.post(`${BASE_URL}/chat/message`, {
      message,
      vehicle,
      sessionId
    });

    if (!sessionId) {
      sessionId = response.data.sessionId;
      console.log(`🔑 Session ID: ${sessionId}`);
    }

    console.log(`🤖 BOT: ${response.data.response}`);
    console.log(`📊 Intent: ${response.data.intent}`);
    console.log(`🎯 Confidence: ${response.data.confidence}`);
    console.log(`📦 Products found: ${response.data.metadata.productsFound}`);
    
    if (response.data.products && response.data.products.length > 0) {
      console.log(`✅ Product: ${response.data.products[0].designation}`);
    }

    return response.data;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error(`Response: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

async function runTest() {
  console.log('🚀 Starting Tunisian Flow Test...\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: "n7eb 3la amortisseur" - Tunisian request
    console.log('\n📝 TEST 1: Tunisian request for amortisseur');
    console.log('-'.repeat(60));
    await sendMessage('n7eb 3la amortisseur');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: "arrière" - Clarification answer
    console.log('\n📝 TEST 2: Clarification answer - arrière');
    console.log('-'.repeat(60));
    await sendMessage('arrière');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: "behi choufli l'avant" - Tunisian follow-up
    console.log('\n📝 TEST 3: Tunisian follow-up - behi choufli l\'avant');
    console.log('-'.repeat(60));
    await sendMessage("behi choufli l'avant");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 4: "ok maintenant je veux un aile droite" - New part request
    console.log('\n📝 TEST 4: New part request - ok maintenant je veux un aile droite');
    console.log('-'.repeat(60));
    await sendMessage('ok maintenant je veux un aile droite');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.error('❌ Test failed!');
    console.log('='.repeat(60));
    process.exit(1);
  }
}

// Run the test
runTest();
