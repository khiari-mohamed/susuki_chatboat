const axios = require('axios');

const API_URL = 'http://localhost:8001/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Amortisseur (bilateral + position)',
    messages: ['amortisseur', 'avant', 'gauche']
  },
  {
    name: 'Plaquette frein (position)',
    messages: ['plaquette frein', 'avant']
  },
  {
    name: 'Disque frein (position)',
    messages: ['disque frein', 'avant']
  },
  {
    name: 'Rétroviseur (bilateral)',
    messages: ['rétroviseur avant', 'gauche']
  },
  {
    name: 'Porte (bilateral)',
    messages: ['porte avant', 'droite']
  },
  {
    name: 'Filtre air (direct)',
    messages: ['filtre air']
  },
  {
    name: 'Filtre huile (direct)',
    messages: ['filtre huile']
  },
  {
    name: 'Batterie (direct)',
    messages: ['batterie']
  },
  {
    name: 'Follow-up test',
    messages: ['amortisseur avant', 'gauche', 'et pour arrière', 'droite']
  },
  {
    name: 'Direct specific query',
    messages: ['amortisseur avant gauche']
  }
];

async function sendMessage(message, sessionId) {
  try {
    const response = await axios.post(API_URL, {
      message,
      vehicle: VEHICLE,
      sessionId
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

async function runTest(scenario) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 TEST: ${scenario.name}`);
  console.log('='.repeat(80));
  
  let sessionId = null;
  
  for (let i = 0; i < scenario.messages.length; i++) {
    const message = scenario.messages[i];
    console.log(`\n📤 User: "${message}"`);
    
    const response = await sendMessage(message, sessionId);
    
    if (response.error) {
      console.log(`❌ Error: ${response.error}`);
      return;
    }
    
    sessionId = response.sessionId;
    
    console.log(`📥 Bot: ${response.response.substring(0, 150)}${response.response.length > 150 ? '...' : ''}`);
    console.log(`   Intent: ${response.intent}`);
    console.log(`   Confidence: ${response.confidence}`);
    console.log(`   Products: ${response.products?.length || 0}`);
    
    if (response.products?.length > 0) {
      console.log(`   ✅ Found: ${response.products[0].designation}`);
    }
    
    // Small delay between messages
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n✅ Test "${scenario.name}" completed`);
}

async function runAllTests() {
  console.log('\n🚀 STARTING AUTOMATED CHAT TESTS');
  console.log(`📍 API: ${API_URL}`);
  console.log(`🚗 Vehicle: ${VEHICLE.marque} ${VEHICLE.modele} ${VEHICLE.annee}\n`);
  
  for (const scenario of TEST_SCENARIOS) {
    await runTest(scenario);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between tests
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ ALL TESTS COMPLETED');
  console.log('='.repeat(80));
}

// Run tests
runAllTests().catch(console.error);
