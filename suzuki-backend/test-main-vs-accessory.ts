import axios from 'axios';

const API_URL = 'http://localhost:8000/chat/message';

interface ChatResponse {
  response: string;
  sessionId: string;
  products: any[];
  confidence: string;
  intent: string;
}

console.log('🔍 Testing Main Part vs Accessory Filtering\n');
console.log('══════════════════════════════════════════════════════════════════════\n');

const vehicle = {
  marque: 'SUZUKI',
  modele: 'SPRESSO',
  annee: '2024',
  immatriculation: '4698 TUNIS 243'
};

async function sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
  try {
    const response = await axios.post(API_URL, {
      message,
      vehicle,
      sessionId
    });
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
}

interface TestCase {
  query: string;
  expectedType: 'main' | 'accessory';
  shouldReject: string[];  // Part names that should NOT appear
  shouldInclude: string[];  // Part names that SHOULD appear
}

const tests: TestCase[] = [
  {
    query: 'radiateur',
    expectedType: 'main',
    shouldReject: ['DURITE', 'TUYAU', 'FLEXIBLE', 'SUPPORT'],
    shouldInclude: ['RADIATEUR']
  },
  {
    query: 'durite de radiateur',
    expectedType: 'accessory',
    shouldReject: [],
    shouldInclude: ['DURITE', 'RADIATEUR']
  },
  {
    query: 'support de radiateur',
    expectedType: 'accessory',
    shouldReject: [],
    shouldInclude: ['SUPPORT', 'RADIATEUR']
  },
  {
    query: 'batterie',
    expectedType: 'main',
    shouldReject: ['CABLE', 'SUPPORT', 'KIT'],
    shouldInclude: ['BATTERIE']
  },
  {
    query: 'cable de batterie',
    expectedType: 'accessory',
    shouldReject: [],
    shouldInclude: ['CABLE', 'BATTERIE']
  },
  {
    query: 'phare',
    expectedType: 'main',
    shouldReject: ['SUPPORT', 'CACHE', 'JOINT'],
    shouldInclude: ['PHARE']
  },
  {
    query: 'support de phare',
    expectedType: 'accessory',
    shouldReject: [],
    shouldInclude: ['SUPPORT', 'PHARE']
  },
  {
    query: 'alternateur',
    expectedType: 'main',
    shouldReject: ['POULIE', 'SUPPORT', 'KIT'],
    shouldInclude: ['ALTERNATEUR']
  },
  {
    query: 'kit alternateur',
    expectedType: 'accessory',
    shouldReject: [],
    shouldInclude: ['KIT', 'ALTERNATEUR']
  },
];

async function runTests() {
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    totalTests++;
    console.log(`\n📋 Test ${totalTests}: "${test.query}" (Expected: ${test.expectedType})`);
    console.log('─'.repeat(70));

    try {
      const response = await sendMessage(test.query);
      
      if (response.products.length === 0) {
        console.log('  ⚠️  No products returned');
        failedTests++;
        continue;
      }

      console.log(`  Found ${response.products.length} products:`);
      
      let testPassed = true;
      const foundParts: string[] = [];

      // Check each product
      for (const product of response.products.slice(0, 5)) {
        const designation = product.designation.toUpperCase();
        foundParts.push(designation);
        
        // Check if rejected words appear
        for (const reject of test.shouldReject) {
          if (designation.includes(reject)) {
            console.log(`  ❌ FAIL - Found rejected word "${reject}" in: ${designation}`);
            testPassed = false;
          }
        }
      }

      // Check if required words appear in at least one result
      for (const include of test.shouldInclude) {
        const found = foundParts.some(p => p.includes(include));
        if (!found) {
          console.log(`  ❌ FAIL - Required word "${include}" not found in any result`);
          testPassed = false;
        }
      }

      if (testPassed) {
        console.log(`  ✅ PASS - Correct filtering`);
        console.log(`     Sample: ${foundParts[0]}`);
        passedTests++;
      } else {
        console.log(`  ❌ FAIL - Incorrect filtering`);
        console.log(`     Found: ${foundParts.slice(0, 3).join(', ')}`);
        failedTests++;
      }

    } catch (error: any) {
      console.log(`  ❌ ERROR - ${error.message}`);
      failedTests++;
    }
  }

  console.log('\n\n══════════════════════════════════════════════════════════════════════');
  console.log('\n🎯 FINAL RESULTS\n');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Main/Accessory filtering is working perfectly! 🚀\n');
  } else {
    console.log('\n⚠️  Some tests failed. Review the output above.\n');
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

async function checkBackend() {
  try {
    await axios.get('http://localhost:8000/health');
    console.log('✅ Backend is running\n');
    return true;
  } catch (error) {
    console.error('❌ Backend is not running! Start it with: npm run start:dev\n');
    process.exit(1);
  }
}

async function main() {
  await checkBackend();
  await runTests();
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
