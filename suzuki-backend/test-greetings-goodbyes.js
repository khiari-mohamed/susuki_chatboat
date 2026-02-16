const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:8000/chat/message';
const vehicle = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

const tests = [
  { message: 'bonjour', expected: 'GREETING' },
  { message: 'ahla', expected: 'GREETING' },
  { message: 'salut', expected: 'GREETING' },
  { message: 'au revoir', expected: 'GOODBYE' },
  { message: 'bye', expected: 'GOODBYE' },
  { message: 'besslema', expected: 'GOODBYE' },
  { message: 'à bientôt', expected: 'GOODBYE' },
  { message: 'bonne journée', expected: 'GOODBYE' },
  { message: 'merci', expected: 'THANKS' }
];

async function testGreetingsGoodbyes() {
  console.log('🎯 TESTING GREETINGS vs GOODBYES\n');
  console.log('='.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const response = await axios.post(API_URL, {
        message: test.message,
        vehicle
      });
      
      const intent = response.data.intent;
      const isCorrect = 
        (test.expected === 'GREETING' && intent === 'GREETING') ||
        (test.expected === 'GOODBYE' && intent === 'THANKS') ||
        (test.expected === 'THANKS' && intent === 'THANKS');
      
      const status = isCorrect ? '✅ PASS' : '❌ FAIL';
      
      console.log(`\n${status} "${test.message}"`);
      console.log(`   Expected: ${test.expected}`);
      console.log(`   Got Intent: ${intent}`);
      console.log(`   Response: ${response.data.response.substring(0, 100)}...`);
      
      if (isCorrect) {
        passed++;
      } else {
        failed++;
      }
      
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.log(`\n❌ ERROR "${test.message}"`);
      console.log(`   ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 RESULTS: ${passed}/${tests.length} passed (${((passed/tests.length)*100).toFixed(1)}%)`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (passed === tests.length) {
    console.log('\n🎉 PERFECT! Chatbot can distinguish greetings from goodbyes!');
  } else {
    console.log('\n⚠️  Some tests failed. Review the results above.');
  }
}

testGreetingsGoodbyes().catch(console.error);
