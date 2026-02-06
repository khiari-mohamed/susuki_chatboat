const axios = require('axios');

const API_URL = 'http://localhost:8001/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

// ALL 12 REQUIREMENTS TEST CASES
const ALL_TESTS = [
  {
    category: '1️⃣ GREETINGS (AI-Powered)',
    tests: [
      { input: 'salem', expected: 'Greeting response' },
      { input: 'ahla', expected: 'Greeting response' },
      { input: 'bonjour', expected: 'Greeting response' },
      { input: 'hello', expected: 'Greeting response' }
    ]
  },
  {
    category: '2️⃣ TYPO CORRECTION (AI-Powered)',
    tests: [
      { input: 'amortiseeur avant', expected: 'Understands as "amortisseur avant"' },
      { input: 'plakette frain', expected: 'Understands as "plaquette frein"' },
      { input: 'bateri', expected: 'Understands as "batterie"' },
      { input: 'filtere air', expected: 'Understands as "filtre air"' }
    ]
  },
  {
    category: '3️⃣ TUNISIAN DIALECT (AI-Powered)',
    tests: [
      { input: 'bghit filtre', expected: 'Understands "je veux filtre"' },
      { input: 'n7eb amortisseur avant', expected: 'Understands "je veux amortisseur avant"' },
      { input: 'famma plaquette frein', expected: 'Understands "disponible plaquette frein"' },
      { input: 'ch7al prix filtre air', expected: 'Understands "combien coûte filtre air"' }
    ]
  },
  {
    category: '4️⃣ BASIC PARTS SEARCH',
    tests: [
      { input: 'amortisseur avant', expected: 'Asks for side (gauche/droite)' },
      { input: 'plaquette frein', expected: 'Shows brake pads' },
      { input: 'filtre air', expected: 'Shows air filter' },
      { input: 'batterie', expected: 'Shows battery or unavailable' }
    ]
  },
  {
    category: '5️⃣ CLARIFICATION FLOW',
    tests: [
      { input: 'amortisseur', expected: 'Asks position (avant/arrière)' },
      { input: 'avant', expected: 'Asks side (gauche/droite)' },
      { input: 'gauche', expected: 'Shows AMORTISSEUR AV G' }
    ]
  },
  {
    category: '6️⃣ FOLLOW-UP QUESTIONS',
    tests: [
      { input: 'amortisseur avant gauche', expected: 'Shows AMORTISSEUR AV G' },
      { input: 'et pour arrière', expected: 'Asks side for rear' },
      { input: 'droite', expected: 'Shows AMORTISSEUR AR D' }
    ]
  },
  {
    category: '7️⃣ PRICE INQUIRY',
    tests: [
      { input: 'combien pour filtre air', expected: 'Shows price' },
      { input: 'prix amortisseur avant', expected: 'Asks for clarification then shows price' }
    ]
  },
  {
    category: '8️⃣ STOCK CHECK',
    tests: [
      { input: 'famma batterie', expected: 'Shows availability (no stock count)' },
      { input: 'disponible filtre huile', expected: 'Shows availability' }
    ]
  },
  {
    category: '9️⃣ REFERENCE SEARCH',
    tests: [
      { input: '41602M62S00', expected: 'Shows part by reference' }
    ]
  },
  {
    category: '🔟 THANKS',
    tests: [
      { input: 'merci', expected: 'Thank you response' },
      { input: 'barcha merci', expected: 'Thank you response' }
    ]
  },
  {
    category: '1️⃣1️⃣ COMPLAINTS (Redirect)',
    tests: [
      { input: 'pas content du service', expected: 'Redirects to contact' }
    ]
  },
  {
    category: '1️⃣2️⃣ SERVICE QUESTIONS (Redirect)',
    tests: [
      { input: 'quels sont vos horaires', expected: 'Redirects to contact' }
    ]
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

function checkRequirement(response, expected) {
  const checks = {
    noStockCount: !response.response.match(/\d+\s+(en stock|disponible|pièces?)/i),
    formalFrench: !response.response.match(/\b(ok|yeah|yep|cool)\b/i),
    hasPrice: response.response.includes('TND') || response.response.includes('Prix'),
    hasContact: response.response.includes('70 603 500'),
    isGreeting: response.intent === 'GREETING',
    isThanks: response.intent === 'THANKS',
    isClarification: response.intent === 'CLARIFICATION_NEEDED',
    isSearch: response.intent === 'SEARCH' || response.intent === 'PARTS_SEARCH',
    hasProducts: response.products && response.products.length > 0
  };
  return checks;
}

async function runAllTests() {
  console.log('\n🚀 COMPREHENSIVE TEST - ALL 12 REQUIREMENTS');
  console.log('='.repeat(80));
  console.log(`📍 API: ${API_URL}`);
  console.log(`🚗 Vehicle: ${VEHICLE.marque} ${VEHICLE.modele} ${VEHICLE.annee}\n`);
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  for (const category of ALL_TESTS) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${category.category}`);
    console.log('='.repeat(80));
    
    let sessionId = null;
    
    for (const test of category.tests) {
      totalTests++;
      console.log(`\n📤 "${test.input}"`);
      console.log(`   Expected: ${test.expected}`);
      
      const response = await sendMessage(test.input, sessionId);
      
      if (response.error) {
        console.log(`   ❌ ERROR: ${response.error}`);
        failedTests++;
        continue;
      }
      
      sessionId = response.sessionId;
      
      const checks = checkRequirement(response, test.expected);
      
      console.log(`   📥 ${response.response.substring(0, 100)}${response.response.length > 100 ? '...' : ''}`);
      console.log(`   Intent: ${response.intent} | Confidence: ${response.confidence}`);
      
      // Validation checks
      const validations = [];
      if (!checks.noStockCount) validations.push('❌ Shows stock count');
      if (!checks.formalFrench) validations.push('❌ Informal language');
      if (!checks.hasContact) validations.push('⚠️ Missing contact info');
      
      if (validations.length > 0) {
        console.log(`   ${validations.join(', ')}`);
        failedTests++;
      } else {
        console.log(`   ✅ PASS`);
        passedTests++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 FINAL RESULTS');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
  console.log('='.repeat(80));
}

runAllTests().catch(console.error);
