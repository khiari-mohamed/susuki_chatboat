const axios = require('axios');

const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

const QUERIES = [
  'support moteur',
  'support moteur arriere',
  'support moteur droit',
  'support moteur gauche'
];

async function testQuery(query) {
  try {
    console.log(`\n🔍 Testing: "${query}"`);
    const response = await axios.post(API_URL, {
      message: query,
      vehicle: VEHICLE
    });
    
    const { products } = response.data;
    if (products && products.length > 0) {
      console.log(`✅ Found: ${products[0].designation}`);
      console.log(`   Ref: ${products[0].reference}`);
    } else {
      console.log(`❌ No results`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function run() {
  console.log('🚀 Testing SUPPORT MOTEUR queries\n');
  console.log('Expected results:');
  console.log('  - SUPPORT MOTEUR AR');
  console.log('  - SUPPORT MOTEUR D');
  console.log('  - SUPPORT MOTEUR G');
  console.log('  - SUPPORT MOTEUR INFERIEUR');
  
  for (const query of QUERIES) {
    await testQuery(query);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ Test complete!');
}

run().catch(console.error);
