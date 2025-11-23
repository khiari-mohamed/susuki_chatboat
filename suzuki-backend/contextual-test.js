const axios = require('axios');

const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'CELERIO',
  annee: '2021',
  immatriculation: 'TU-123-456'
};

async function testContextualConversation() {
  console.log('🧪 TESTING CONTEXTUAL CONVERSATION...\n');
  
  let sessionId = null;
  
  // Request 1: Front brake pads
  console.log('📝 Request 1: "Plaquettes de frein avant pour Celerio 2020"');
  try {
    const response1 = await axios.post(API_URL, {
      message: 'Plaquettes de frein avant pour Celerio 2020',
      vehicle: VEHICLE
    });
    
    sessionId = response1.data.sessionId;
    console.log(`✅ SessionId: ${sessionId}`);
    console.log(`📊 Products found: ${response1.data.products.length}`);
    console.log(`🎯 Intent: ${response1.data.intent}`);
    console.log('---');
    
    // Request 2: Rear brake pads (contextual)
    console.log('📝 Request 2: "Et pour l\'arrière aussi?" (using same sessionId)');
    const response2 = await axios.post(API_URL, {
      message: 'Et pour l\'arrière aussi?',
      vehicle: VEHICLE,
      sessionId: sessionId
    });
    
    console.log(`✅ SessionId: ${response2.data.sessionId}`);
    console.log(`📊 Products found: ${response2.data.products.length}`);
    console.log(`🎯 Intent: ${response2.data.intent}`);
    console.log(`🔍 Contains 'frein': ${response2.data.response.includes('frein')}`);
    console.log(`🔍 Contains 'plaquette': ${response2.data.response.includes('plaquette')}`);
    console.log('---');
    
    // Request 3: Price calculation (contextual)
    console.log('📝 Request 3: "Combien pour les deux jeux?" (using same sessionId)');
    const response3 = await axios.post(API_URL, {
      message: 'Combien pour les deux jeux?',
      vehicle: VEHICLE,
      sessionId: sessionId
    });
    
    console.log(`✅ SessionId: ${response3.data.sessionId}`);
    console.log(`📊 Products found: ${response3.data.products.length}`);
    console.log(`🎯 Intent: ${response3.data.intent}`);
    console.log(`🔍 Contains 'prix': ${response3.data.response.includes('prix')}`);
    console.log(`🔍 Contains 'total': ${response3.data.response.includes('total')}`);
    
    // Analysis
    console.log('\n🔍 CONTEXTUAL ANALYSIS:');
    console.log(`Session consistency: ${sessionId === response2.data.sessionId && sessionId === response3.data.sessionId ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Context understanding: ${response2.data.response.includes('plaquette') && response2.data.response.includes('frein') ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Price calculation: ${response3.data.intent === 'PRICE_INQUIRY' ? '✅ PASSED' : '❌ FAILED'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testContextualConversation();