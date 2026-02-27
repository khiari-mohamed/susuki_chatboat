const axios = require('axios');

const PROD_URL = 'http://5.199.136.2/suzuki-api';
const LOCAL_URL = 'http://localhost:8000';

const vehicle = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

const testPrompts = [
  { name: 'Greeting 1', message: 'Salam' },
  { name: 'Greeting 2', message: 'Ahla' },
  { name: 'Who are you', message: 'Chkoun enti?' },
  { name: 'Brake pads FR', message: 'Je cherche des plaquettes de frein' },
  { name: 'Position: Avant', message: 'avant' },
  { name: 'Brake disc TN', message: 'Chkoun prix mte3 disque frein?' },
  { name: 'Position: Avant', message: 'Avant' },
  { name: 'Shock absorber', message: 'amortisseur' },
  { name: 'Position: Avant', message: 'Avant' },
  { name: 'Side: Gauche', message: 'Gauche' },
  { name: 'Battery strap', message: 'sangle batterie' },
  { name: 'Rear brake disc', message: 'disque frein ar' },
  { name: 'Goodbye', message: 'Merci' }
];

async function testEndpoint(url, name) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name}`);
  console.log('='.repeat(60));
  
  const results = [];
  let sessionId = null;

  for (const test of testPrompts) {
    try {
      const response = await axios.post(`${url}/chat/message`, {
        message: test.message,
        vehicle,
        sessionId
      });

      sessionId = response.data.sessionId;
      
      results.push({
        prompt: test.name,
        message: test.message,
        response: response.data.response,
        products: response.data.products?.length || 0,
        confidence: response.data.confidence
      });

      console.log(`\n✅ ${test.name}: "${test.message}"`);
      console.log(`   Response: ${response.data.response.substring(0, 100)}...`);
      console.log(`   Products: ${response.data.products?.length || 0}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message);
      results.push({
        prompt: test.name,
        message: test.message,
        error: error.message
      });
    }
  }

  return results;
}

async function compareResults() {
  console.log('\n🚀 Starting Production vs Local Comparison...\n');

  const [prodResults, localResults] = await Promise.all([
    testEndpoint(PROD_URL, 'PRODUCTION'),
    testEndpoint(LOCAL_URL, 'LOCAL')
  ]);

  console.log('\n\n' + '='.repeat(80));
  console.log('📊 COMPARISON RESULTS');
  console.log('='.repeat(80));

  let matches = 0;
  let differences = 0;

  for (let i = 0; i < testPrompts.length; i++) {
    const prod = prodResults[i];
    const local = localResults[i];

    console.log(`\n${i + 1}. ${testPrompts[i].name}: "${testPrompts[i].message}"`);
    
    if (prod.error || local.error) {
      console.log('   ❌ ERROR in one or both environments');
      differences++;
      continue;
    }

    const prodResp = prod.response.substring(0, 80);
    const localResp = local.response.substring(0, 80);
    
    if (prodResp === localResp) {
      console.log('   ✅ MATCH');
      matches++;
    } else {
      console.log('   ⚠️  DIFFERENT');
      console.log(`   PROD:  ${prodResp}...`);
      console.log(`   LOCAL: ${localResp}...`);
      differences++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`✅ Matches: ${matches}/${testPrompts.length}`);
  console.log(`⚠️  Differences: ${differences}/${testPrompts.length}`);
  console.log(`📈 Success Rate: ${((matches / testPrompts.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));
}

compareResults().catch(console.error);
