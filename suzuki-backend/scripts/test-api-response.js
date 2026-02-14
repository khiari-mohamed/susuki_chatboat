const axios = require('axios');

const API_URL = 'http://localhost:8000';

async function testAPIResponse() {
  console.log('🔍 Testing API Response Structure\n');
  console.log('================================================================================\n');
  
  try {
    console.log('Sending request: "amortisseur"\n');
    
    const response = await axios.post(`${API_URL}/chat/message`, {
      message: 'amortisseur',
      vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' }
    });
    
    console.log('✅ Response received!\n');
    console.log('Full response structure:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n================================================================================\n');
    console.log('Key fields:');
    console.log('- response:', response.data.response ? 'EXISTS' : 'MISSING');
    console.log('- products:', response.data.products ? `EXISTS (${response.data.products.length} items)` : 'MISSING');
    console.log('- intent:', response.data.intent || 'MISSING');
    console.log('- confidence:', response.data.confidence || 'MISSING');
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('\n📦 First product:');
      console.log(JSON.stringify(response.data.products[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPIResponse();
