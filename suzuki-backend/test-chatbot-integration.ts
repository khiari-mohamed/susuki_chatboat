import axios from 'axios';

const API_URL = 'http://localhost:8000/chat/message';

interface ChatResponse {
  response: string;
  sessionId: string;
  products: any[];
  confidence: string;
  intent: string;
}

console.log('🤖 Testing Chatbot Clarification Behavior\n');
console.log('══════════════════════════════════════════════════════════════════════\n');

// Mock vehicle data
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
  } catch (error : any) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
}

interface TestCase {
  name: string;
  steps: {
    message: string;
    expectedIntent?: string;
    shouldAskClarification: boolean;
    expectedQuestion?: string;
  }[];
}

const tests: TestCase[] = [
  {
    name: '1️⃣ AMORTISSEUR - Should ask position, then side',
    steps: [
      {
        message: 'amortisseur',
        shouldAskClarification: true,
        expectedQuestion: 'position',
        expectedIntent: 'CLARIFICATION_NEEDED'
      },
      {
        message: 'avant',
        shouldAskClarification: true,
        expectedQuestion: 'side',
        expectedIntent: 'CLARIFICATION_NEEDED'
      },
      {
        message: 'gauche',
        shouldAskClarification: false,
        expectedIntent: 'PARTS_SEARCH'
      }
    ]
  },
  {
    name: '2️⃣ PHARE - Should ask side only (DB has only AVANT)',
    steps: [
      {
        message: 'phare',
        shouldAskClarification: true,
        expectedQuestion: 'side',
        expectedIntent: 'CLARIFICATION_NEEDED'
      },
      {
        message: 'gauche',
        shouldAskClarification: false,
        expectedIntent: 'PARTS_SEARCH'
      }
    ]
  },
  {
    name: '3️⃣ RETROVISEUR - Should ask side only',
    steps: [
      {
        message: 'retroviseur',
        shouldAskClarification: true,
        expectedQuestion: 'side',
        expectedIntent: 'CLARIFICATION_NEEDED'
      },
      {
        message: 'droite',
        shouldAskClarification: false,
        expectedIntent: 'PARTS_SEARCH'
      }
    ]
  },
  {
    name: '4️⃣ BATTERIE - No clarification needed',
    steps: [
      {
        message: 'batterie',
        shouldAskClarification: false,
        expectedIntent: 'PARTS_SEARCH'
      }
    ]
  },
  {
    name: '5️⃣ PHARE AVANT GAUCHE - No clarification (all specified)',
    steps: [
      {
        message: 'phare avant gauche',
        shouldAskClarification: false,
        expectedIntent: 'PARTS_SEARCH'
      }
    ]
  },
  {
    name: '6️⃣ FEU - Should ask side only (DB has only ARRIERE)',
    steps: [
      {
        message: 'feu',
        shouldAskClarification: true,
        expectedQuestion: 'side',
        expectedIntent: 'CLARIFICATION_NEEDED'
      },
      {
        message: 'gauche',
        shouldAskClarification: false,
        expectedIntent: 'PARTS_SEARCH'
      }
    ]
  },
];

async function runTests() {
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    console.log(`\n${test.name}`);
    console.log('─'.repeat(70));
    
    let sessionId: string | undefined;
    let testPassed = true;

    for (let i = 0; i < test.steps.length; i++) {
      const step = test.steps[i];
      totalTests++;

      console.log(`\n  Step ${i + 1}: User says "${step.message}"`);
      
      try {
        const response = await sendMessage(step.message, sessionId);
        sessionId = response.sessionId;

        // Check intent
        if (step.expectedIntent && response.intent !== step.expectedIntent) {
          console.log(`  ❌ FAIL - Expected intent: ${step.expectedIntent}, Got: ${response.intent}`);
          testPassed = false;
          failedTests++;
          continue;
        }

        // Check if clarification was asked
        const isClarification = response.intent === 'CLARIFICATION_NEEDED';
        
        if (step.shouldAskClarification && !isClarification) {
          console.log(`  ❌ FAIL - Expected clarification question, but got: ${response.intent}`);
          testPassed = false;
          failedTests++;
          continue;
        }

        if (!step.shouldAskClarification && isClarification) {
          console.log(`  ❌ FAIL - Did NOT expect clarification, but got one`);
          testPassed = false;
          failedTests++;
          continue;
        }

        // Check clarification type
        if (step.expectedQuestion && isClarification) {
          const hasPosition = /avant|arrière/i.test(response.response);
          const hasSide = /gauche|droite/i.test(response.response);
          
          if (step.expectedQuestion === 'position' && !hasPosition) {
            console.log(`  ❌ FAIL - Expected position question, but got: ${response.response.substring(0, 100)}`);
            testPassed = false;
            failedTests++;
            continue;
          }
          
          if (step.expectedQuestion === 'side' && !hasSide) {
            console.log(`  ❌ FAIL - Expected side question, but got: ${response.response.substring(0, 100)}`);
            testPassed = false;
            failedTests++;
            continue;
          }
        }

        // Success
        console.log(`  ✅ PASS - ${isClarification ? 'Asked clarification' : 'Returned results'}`);
        console.log(`     Bot: ${response.response.substring(0, 80)}...`);
        passedTests++;

      } catch (error: any) {
        console.log(`  ❌ ERROR - ${error.message}`);
        testPassed = false;
        failedTests++;
      }
    }

    if (testPassed) {
      console.log(`\n  ✅ Test PASSED`);
    } else {
      console.log(`\n  ❌ Test FAILED`);
    }
  }

  console.log('\n\n══════════════════════════════════════════════════════════════════════');
  console.log('\n🎯 FINAL RESULTS\n');
  console.log(`Total Steps: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Chatbot is working perfectly! 🚀\n');
  } else {
    console.log('\n⚠️  Some tests failed. Review the output above.\n');
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Check if backend is running
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
