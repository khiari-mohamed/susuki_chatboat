const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyD16OBCwc0gFkpbODpoK1RU5hBncbnGU6A';

async function testGeminiAPI() {
  try {
    console.log('🔍 Testing Gemini API...\n');

    // List available models
    const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    
    console.log('📋 Fetching available models...');
    const response = await axios.get(modelsUrl);
    
    console.log('\n✅ API Key is valid!\n');
    console.log('📊 Available Models:');
    console.log('===================');
    
    response.data.models.forEach(model => {
      console.log(`\n🤖 ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      if (model.supportedGenerationMethods) {
        console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
    });

    // Test a simple generation
    console.log('\n\n🧪 Testing text generation...');
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const testResponse = await axios.post(testUrl, {
      contents: [{
        parts: [{
          text: 'Say "Hello from Gemini!" in one sentence.'
        }]
      }]
    });

    console.log('✅ Generation test successful!');
    console.log('Response:', testResponse.data.candidates[0].content.parts[0].text);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testGeminiAPI();
