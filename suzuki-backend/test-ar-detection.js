const axios = require('axios');

const API_URL = 'http://localhost:8000/chat/message';
const vehicle = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

async function testArDetection() {
  console.log('\n🧪 Testing AR/ARRIÈRE Detection\n');
  console.log('='.repeat(60));

  const tests = [
    { query: 'disque frein ar', expected: 'ARRIÈRE', description: 'ar = arrière' },
    { query: 'disque frein arrière', expected: 'ARRIÈRE', description: 'Full word arrière' },
    { query: 'disque frein avant', expected: 'AVANT', description: 'avant (control)' },
    { query: 'amortisseur ar', expected: 'ARRIÈRE', description: 'ar with amortisseur' },
    { query: 'plaquette ar', expected: 'ARRIÈRE', description: 'ar with plaquette' }
  ];

  for (const test of tests) {
    try {
      const response = await axios.post(API_URL, {
        message: test.query,
        vehicle
      });

      const result = response.data.response;
      const hasArriere = result.includes('AR ') || result.includes('ARRIÈRE') || result.includes('arrière');
      const hasAvant = result.includes('AV ') || result.includes('AVANT') || result.includes('avant');

      console.log(`\n📝 ${test.description}`);
      console.log(`   Query: "${test.query}"`);
      console.log(`   Expected: ${test.expected}`);
      
      if (test.expected === 'ARRIÈRE') {
        if (hasArriere && !hasAvant) {
          console.log(`   ✅ PASS - Found ARRIÈRE part`);
        } else if (hasAvant) {
          console.log(`   ❌ FAIL - Found AVANT instead of ARRIÈRE`);
          console.log(`   Response: ${result.substring(0, 100)}...`);
        } else {
          console.log(`   ⚠️  No parts found`);
        }
      } else {
        if (hasAvant) {
          console.log(`   ✅ PASS - Found AVANT part`);
        } else {
          console.log(`   ❌ FAIL - Expected AVANT`);
        }
      }

      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
}

testArDetection().catch(console.error);
