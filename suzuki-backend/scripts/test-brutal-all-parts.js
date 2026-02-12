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

// Generate query variations for each part
function generateQueryVariations(designation) {
  const base = designation.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const variations = [
    base,                                    // Original
    base.replace(/\s+/g, ''),               // No spaces
    base.split(' ').reverse().join(' '),    // Reversed
    base.replace(/e/g, 'é'),                // Add accents
    base.replace(/a/g, 'à'),                // More accents
  ];
  
  // Add typo variations
  const words = base.split(' ');
  if (words.length > 0) {
    // Remove first letter of first word
    const typo1 = words[0].slice(1) + ' ' + words.slice(1).join(' ');
    variations.push(typo1.trim());
    
    // Swap two letters in first word
    if (words[0].length > 2) {
      const typo2 = words[0][1] + words[0][0] + words[0].slice(2) + ' ' + words.slice(1).join(' ');
      variations.push(typo2.trim());
    }
  }
  
  return [...new Set(variations)].filter(v => v.length > 2);
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
    
    // Check if the expected part is in top 3 results
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

async function runBrutalTest() {
  console.log('💀 BRUTAL STRESS TEST - ALL PARTS\n');
  console.log('=' .repeat(80));
  
  // Load passed tests to skip them
  let passedTests = [];
  const passedFile = './passed-tests.json';
  if (fs.existsSync(passedFile)) {
    passedTests = JSON.parse(fs.readFileSync(passedFile, 'utf8'));
    console.log(`✅ Loaded ${passedTests.length} previously passed tests (will skip)\n`);
  }
  
  // Get all parts from database
  const allParts = await prisma.piecesRechange.findMany({
    select: {
      designation: true,
      reference: true
    },
    orderBy: { designation: 'asc' }
  });
  
  // Create a Set of existing designations for fast lookup
  const existingParts = new Set(allParts.map(p => p.designation.toUpperCase()));
  
  console.log(`📦 Found ${allParts.length} parts in database\n`);
  console.log('🔥 Generating query variations for each part...\n');
  
  const testCases = [];
  const skippedNonExistent = [];
  
  allParts.forEach(part => {
    const variations = generateQueryVariations(part.designation);
    variations.forEach(query => {
      // Skip if already passed
      const testKey = `${query}::${part.designation}`;
      if (!passedTests.includes(testKey)) {
        testCases.push({
          query,
          expectedPart: part.designation,
          reference: part.reference,
          testKey
        });
      }
    });
  });
  
  console.log(`🎯 Generated ${testCases.length} test queries (${passedTests.length} skipped)\n`);
  console.log('⚠️  WARNING: This will take a while...\n');
  console.log('=' .repeat(80));
  
  const results = [];
  const newlyPassed = [];
  const failures = [];
  const errors = [];
  let passed = 0;
  let failed = 0;
  let errorCount = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    process.stdout.write(`\r[${i + 1}/${testCases.length}] Testing: "${testCase.query.substring(0, 40)}..."`);
    
    const result = await testQuery(testCase.query, testCase.expectedPart);
    results.push(result);
    
    if (result.error) {
      errorCount++;
      errors.push(result);
    } else if (result.isCorrect) {
      passed++;
      newlyPassed.push(testCase.testKey);
    } else {
      // Check if expected part exists in DB before marking as failure
      const expectedUpper = testCase.expectedPart.toUpperCase();
      if (!existingParts.has(expectedUpper)) {
        skippedNonExistent.push({ query: testCase.query, expected: testCase.expectedPart });
      } else {
        failed++;
        failures.push(result);
      }
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Save newly passed tests
  const allPassedTests = [...passedTests, ...newlyPassed];
  fs.writeFileSync(passedFile, JSON.stringify(allPassedTests, null, 2));
  
  // Save failures to separate file
  fs.writeFileSync('./failed-tests.json', JSON.stringify(failures, null, 2));
  
  // Save errors to separate file
  fs.writeFileSync('./error-tests.json', JSON.stringify(errors, null, 2));
  
  const totalTests = testCases.length + passedTests.length - skippedNonExistent.length;
  const totalPassed = passed + passedTests.length;
  const successRate = ((totalPassed / totalTests) * 100).toFixed(2);
  const failureRate = ((failed / totalTests) * 100).toFixed(2);
  const errorRate = ((errorCount / totalTests) * 100).toFixed(2);
  
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 BRUTAL TEST RESULTS\n');
  console.log(`Total Tests:    ${totalTests}`);
  console.log(`✅ Passed:      ${totalPassed} (${successRate}%) [${passed} new + ${passedTests.length} previous]`);
  console.log(`❌ Failed:      ${failed} (${failureRate}%)`);
  console.log(`⚠️  Errors:      ${errorCount} (${errorRate}%)`);
  if (skippedNonExistent.length > 0) {
    console.log(`⏭️  Skipped:     ${skippedNonExistent.length} (parts don't exist in DB)`);
  }
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  console.log(`💥 Failure Rate: ${failureRate}%`);
  
  // Show top 20 failures
  if (failures.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('❌ TOP 20 FAILURES:\n');
    failures.slice(0, 20).forEach((f, i) => {
      console.log(`${i + 1}. Query: "${f.query}"`);
      console.log(`   Expected: ${f.expected}`);
      console.log(`   Got: ${f.topResult || 'Nothing'}`);
      console.log('');
    });
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalTests,
    passed: totalPassed,
    newlyPassed: passed,
    previouslyPassed: passedTests.length,
    failed,
    errors: errorCount,
    successRate: parseFloat(successRate),
    failureRate: parseFloat(failureRate),
    errorRate: parseFloat(errorRate)
  };
  
  const reportPath = `brutal-test-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  console.log(`💾 Failed tests saved to: ./failed-tests.json`);
  console.log(`💾 Error tests saved to: ./error-tests.json`);
  console.log(`💾 Passed tests saved to: ./passed-tests.json`);
  
  console.log('\n' + '='.repeat(80));
  
  if (successRate >= 90) {
    console.log('\n🎉 EXCELLENT! System passed brutal stress test!');
    console.log(`   Success: ${successRate}% | Failure: ${failureRate}%`);
  } else if (successRate >= 75) {
    console.log('\n👍 GOOD! Some improvements needed.');
    console.log(`   Success: ${successRate}% | Failure: ${failureRate}%`);
  } else if (successRate >= 60) {
    console.log('\n⚠️  FAIR! Significant improvements needed.');
    console.log(`   Success: ${successRate}% | Failure: ${failureRate}%`);
  } else {
    console.log('\n❌ POOR! Major fixes required.');
    console.log(`   Success: ${successRate}% | Failure: ${failureRate}%`);
  }
}

// Run the brutal test
runBrutalTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
