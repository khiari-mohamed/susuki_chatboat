import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const API_URL = 'http://localhost:8000/chat/message';
const prisma = new PrismaClient();

interface ChatResponse {
  response: string;
  sessionId: string;
  products: any[];
  confidence: string;
  intent: string;
}

console.log('🔍 Testing Main Part vs Accessory Filtering (Database-Driven)\n');
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
  description: string;
}

async function generateTestsFromDB(): Promise<TestCase[]> {
  const tests: TestCase[] = [];

  // Find main parts (parts that are NOT accessories)
  const mainParts = await prisma.part.findMany({
    where: {
      designation: {
        contains: 'RADIATEUR',
        mode: 'insensitive'
      },
      NOT: {
        OR: [
          { designation: { contains: 'DURITE', mode: 'insensitive' } },
          { designation: { contains: 'SUPPORT', mode: 'insensitive' } },
          { designation: { contains: 'CACHE', mode: 'insensitive' } },
          { designation: { contains: 'KIT', mode: 'insensitive' } },
        ]
      }
    },
    take: 1
  });

  if (mainParts.length > 0) {
    tests.push({
      query: 'radiateur',
      expectedType: 'main',
      description: `Should return main radiateur parts like "${mainParts[0].designation}"`
    });
  }

  // Find accessory parts
  const accessoryParts = await prisma.part.findMany({
    where: {
      AND: [
        { designation: { contains: 'RADIATEUR', mode: 'insensitive' } },
        {
          OR: [
            { designation: { contains: 'DURITE', mode: 'insensitive' } },
            { designation: { contains: 'SUPPORT', mode: 'insensitive' } },
          ]
        }
      ]
    },
    take: 2
  });

  for (const part of accessoryParts) {
    const accessoryWord = part.designation.match(/\b(DURITE|SUPPORT|CACHE|KIT)\b/i)?.[0]?.toLowerCase();
    if (accessoryWord) {
      tests.push({
        query: `${accessoryWord} de radiateur`,
        expectedType: 'accessory',
        description: `Should return "${part.designation}"`
      });
    }
  }

  // Batterie tests
  const batteries = await prisma.part.findMany({
    where: {
      designation: { contains: 'BATTERIE', mode: 'insensitive' },
      NOT: {
        OR: [
          { designation: { contains: 'CABLE', mode: 'insensitive' } },
          { designation: { contains: 'SUPPORT', mode: 'insensitive' } },
        ]
      }
    },
    take: 1
  });

  if (batteries.length > 0) {
    tests.push({
      query: 'batterie',
      expectedType: 'main',
      description: `Should return main battery parts like "${batteries[0].designation}"`
    });
  }

  // Phare tests
  const phares = await prisma.part.findMany({
    where: {
      designation: { contains: 'PHARE', mode: 'insensitive' },
      NOT: {
        OR: [
          { designation: { contains: 'SUPPORT', mode: 'insensitive' } },
          { designation: { contains: 'CACHE', mode: 'insensitive' } },
          { designation: { contains: 'AGRAFFE', mode: 'insensitive' } },
        ]
      }
    },
    take: 1
  });

  if (phares.length > 0) {
    tests.push({
      query: 'phare',
      expectedType: 'main',
      description: `Should return main phare parts like "${phares[0].designation}"`
    });
  }

  // Alternateur tests
  const alternateurs = await prisma.part.findMany({
    where: {
      designation: { contains: 'ALTERNATEUR', mode: 'insensitive' }
    },
    take: 1
  });

  if (alternateurs.length > 0) {
    tests.push({
      query: 'alternateur',
      expectedType: 'main',
      description: `Should return alternateur parts like "${alternateurs[0].designation}"`
    });
  }

  return tests;
}

async function runTests() {
  const tests = await generateTestsFromDB();
  
  if (tests.length === 0) {
    console.log('⚠️  No test cases generated from database. Check your inventory.\n');
    process.exit(1);
  }

  console.log(`📊 Generated ${tests.length} test cases from database\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    totalTests++;
    console.log(`\n📋 Test ${totalTests}: "${test.query}" (Expected: ${test.expectedType})`);
    console.log(`   ${test.description}`);
    console.log('─'.repeat(70));

    try {
      const response = await sendMessage(test.query);
      
      if (response.products.length === 0) {
        console.log('  ⚠️  No products returned');
        failedTests++;
        continue;
      }

      console.log(`  Found ${response.products.length} products:`);
      
      const topProduct = response.products[0];
      const designation = topProduct.designation.toUpperCase();
      
      // For main parts: top result should NOT be an accessory
      if (test.expectedType === 'main') {
        const isAccessory = /\b(DURITE|TUYAU|FLEXIBLE|SUPPORT|CACHE|KIT|JOINT|AGRAFFE|CERCLE)\b/i.test(designation);
        if (isAccessory) {
          console.log(`  ❌ FAIL - Top result is an accessory: ${designation}`);
          failedTests++;
        } else {
          console.log(`  ✅ PASS - Top result is a main part: ${designation}`);
          passedTests++;
        }
      } 
      // For accessories: top result should contain the accessory word
      else {
        const accessoryWord = test.query.match(/\b(durite|support|cache|kit|cable)\b/i)?.[0];
        if (accessoryWord && designation.includes(accessoryWord.toUpperCase())) {
          console.log(`  ✅ PASS - Top result is correct accessory: ${designation}`);
          passedTests++;
        } else {
          console.log(`  ❌ FAIL - Top result doesn't match: ${designation}`);
          failedTests++;
        }
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

  await prisma.$disconnect();
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
