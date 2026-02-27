const axios = require('axios');

const API_URL = 'http://localhost:8000/chat/message';
const vehicle = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

async function testChatbot(message, sessionId) {
  try {
    const response = await axios.post(API_URL, {
      message,
      vehicle,
      sessionId
    });
    return {
      success: true,
      response: response.data.response,
      intent: response.data.intent,
      productsFound: response.data.metadata?.productsFound || 0,
      sessionId: response.data.sessionId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      response: '',
      intent: 'ERROR',
      productsFound: 0
    };
  }
}

async function runTests() {
  console.log('🔍 TESTING THE 3 FAILURES\n');
  console.log('='.repeat(80));
  
  // Test 1: retroviseur
  console.log('\n❌ FAILURE 1: "retroviseur"');
  console.log('Expected: Should ask clarification (left/right?)');
  console.log('-'.repeat(80));
  const test1 = await testChatbot('retroviseur');
  console.log('Intent:', test1.intent);
  console.log('Products Found:', test1.productsFound);
  console.log('\nFull Response:');
  console.log(test1.response);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 2: filtre
  console.log('\n' + '='.repeat(80));
  console.log('\n❌ FAILURE 2: "filtre"');
  console.log('Expected: Should ask clarification (which type?)');
  console.log('-'.repeat(80));
  const test2 = await testChatbot('filtre');
  console.log('Intent:', test2.intent);
  console.log('Products Found:', test2.productsFound);
  console.log('\nFull Response:');
  console.log(test2.response);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 3: retroviseur (context test - Turn 1)
  console.log('\n' + '='.repeat(80));
  console.log('\n❌ FAILURE 3: Context Test - "retroviseur" Turn 1');
  console.log('Expected: Should ask clarification on Turn 1');
  console.log('-'.repeat(80));
  const sessionId = 'test-session-' + Date.now();
  const test3Turn1 = await testChatbot('retroviseur', sessionId);
  console.log('Turn 1 Intent:', test3Turn1.intent);
  console.log('Turn 1 Products Found:', test3Turn1.productsFound);
  console.log('\nTurn 1 Full Response:');
  console.log(test3Turn1.response);
  
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('\n' + '-'.repeat(80));
  console.log('Turn 2: "gauche"');
  const test3Turn2 = await testChatbot('gauche', sessionId);
  console.log('Turn 2 Intent:', test3Turn2.intent);
  console.log('Turn 2 Products Found:', test3Turn2.productsFound);
  console.log('\nTurn 2 Full Response:');
  console.log(test3Turn2.response);
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ DONE!');
}

runTests().catch(console.error);
