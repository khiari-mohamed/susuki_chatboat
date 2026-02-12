const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

const SAMPLE_SIZE = 100; // Test 100 random parts

function generateQueryVariations(designation) {
  const base = designation.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const variations = [
    base,                                    // Original
    base.replace(/e/g, 'é').replace(/a/g, 'à'), // With accents
  ];
  
  // Add one typo variation
  const words = base.split(' ');
  if (words.length > 0 && words[0].length > 3) {
    const typo = words[0][1] + words[0][0] + words[0].slice(2) + ' ' + words.slice(1).join(' ');
    variations.push(typo.trim());
  }
  
  return variations.filter(v => v.length > 2);
}

async function testQuery(query, expectedPart) {
  try {
    const response = await axios.post(API_URL, {
      message: query,
      vehicle: VEHICLE
    }, { timeout: 10000 });
    
    const { products } = response.data;
    const found = products && products.length > 0;
    const topResult = found ? products[0].designation : null;
    
    // Check if expected part is in top 3
    const isCorrect = found && products.slice(0, 3).some(p => 
      p.designation.toLowerCase().includes(expectedPart.toLowerCase()) ||
      expectedPart.toLowerCase().includes(p.designation.toLowerCase())
    );
    
    return {
      query,
      expected: expectedPart,
      found,
      topResult,
      isCorrect,
      productsCount: products?.length || 0
    };
  } catch (error) {
    return {
      query,
      expected: expectedPart,
      found: false,
      topResult: null,
      isCorrect: false,
      error: error.message,
      productsCount: 0
    };
  }
}

async function runSampleTest() {
  console.log('🎲 SAMPLE STRESS TEST - 100 RANDOM PARTS\n');
  console.log('=' .repeat(80));
  
  // Get all parts
  const allParts = await prisma.piecesRechange.findMany({
    select: {
      designation: true,
      reference: true
    }
  });
  
  console.log(`📦 Total parts in database: ${allParts.length}`);
  
  // Randomly sample parts
  const shuffled = allParts.sort(() => 0.5 - Math.random());
  const sampledParts = shuffled.slice(0, SAMPLE_SIZE);
  
  console.log(`🎯 Testing ${sampledParts.length} random parts with variations\n`);
  
  const testCases = [];
  sampledParts.forEach(part => {
    const variations = generateQueryVariations(part.designation);
    variations.forEach(query => {
      testCases.push({
        query,
        expectedPart: part.designation,
        reference: part.reference
      });
    });
  });
  
  console.log(`📝 Generated ${testCases.length} test queries\n`);
  console.log('=' .repeat(80));
  
  const results = [];
  let passed = 0;
  let failed = 0;
  let errors = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    process.stdout.write(`\r[${i + 1}/${testCases.length}] Testing: "${testCase.query.substring(0, 50)}..."`);
    
    const result = await testQuery(testCase.query, testCase.expectedPart);
    results.push(result);
    
    if (result.error) {
      errors++;
    } else if (result.isCorrect) {
      passed++;
    } else {
      failed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SAMPLE TEST RESULTS\n');
  
  const successRate = ((passed / testCases.length) * 100).toFixed(2);
  
  console.log(`Total Tests:    ${testCases.length}`);
  console.log(`✅ Passed:      ${passed} (${successRate}%)`);
  console.log(`❌ Failed:      ${failed}`);
  console.log(`⚠️  Errors:      ${errors}`);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  
  // Show failures
  const failures = results.filter(r => !r.isCorrect && !r.error);
  if (failures.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log(`❌ FAILURES (${failures.length}):\n`);
    failures.forEach((f, i) => {
      console.log(`${i + 1}. Query: "${f.query}"`);
      console.log(`   Expected: ${f.expected}`);
      console.log(`   Got: ${f.topResult || 'Nothing'}`);
      console.log('');
    });
  }
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    sampleSize: SAMPLE_SIZE,
    totalTests: testCases.length,
    passed,
    failed,
    errors,
    successRate: parseFloat(successRate),
    failures: failures.map(f => ({
      query: f.query,
      expected: f.expected,
      got: f.topResult
    }))
  };
  
  const reportPath = `sample-test-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Report saved to: ${reportPath}`);
  
  console.log('\n' + '='.repeat(80));
  
  if (successRate >= 90) {
    console.log('\n🎉 EXCELLENT! Ready for production!');
  } else if (successRate >= 75) {
    console.log('\n👍 GOOD! Minor improvements needed.');
  } else if (successRate >= 60) {
    console.log('\n⚠️  FAIR! Needs work.');
  } else {
    console.log('\n❌ POOR! Major fixes required.');
  }
}

runSampleTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
