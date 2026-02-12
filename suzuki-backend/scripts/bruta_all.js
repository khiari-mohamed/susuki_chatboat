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
  
  // Get all parts from database
  const allParts = await prisma.piecesRechange.findMany({
    select: {
      designation: true,
      reference: true
    },
    orderBy: { designation: 'asc' }
  });
  
  console.log(`📦 Found ${allParts.length} parts in database\n`);
  console.log('🔥 Generating query variations for each part...\n');
  
  const testCases = [];
  allParts.forEach(part => {
    const variations = generateQueryVariations(part.designation);
    variations.forEach(query => {
      testCases.push({
        query,
        expectedPart: part.designation,
        reference: part.reference
      });
    });
  });
  
  console.log(`🎯 Generated ${testCases.length} test queries\n`);
  console.log('⚠️  WARNING: This will take a while...\n');
  console.log('=' .repeat(80));
  
  const results = [];
  let passed = 0;
  let failed = 0;
  let errors = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    process.stdout.write(`\r[${i + 1}/${testCases.length}] Testing: "${testCase.query.substring(0, 40)}..."`);
    
    const result = await testQuery(testCase.query, testCase.expectedPart);
    results.push(result);
    
    if (result.error) {
      errors++;
    } else if (result.isCorrect) {
      passed++;
    } else {
      failed++;
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 BRUTAL TEST RESULTS\n');
  
  const successRate = ((passed / testCases.length) * 100).toFixed(2);
  const failureRate = ((failed / testCases.length) * 100).toFixed(2);
  const errorRate = ((errors / testCases.length) * 100).toFixed(2);
  
  console.log(`Total Tests:    ${testCases.length}`);
  console.log(`✅ Passed:      ${passed} (${successRate}%)`);
  console.log(`❌ Failed:      ${failed} (${failureRate}%)`);
  console.log(`⚠️  Errors:      ${errors} (${errorRate}%)`);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  console.log(`💥 Failure Rate: ${failureRate}%`);
  
  // Show top 20 failures
  const failures = results.filter(r => !r.isCorrect && !r.error);
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
    totalTests: testCases.length,
    passed,
    failed,
    errors,
    successRate: parseFloat(successRate),
    failureRate: parseFloat(failureRate),
    errorRate: parseFloat(errorRate),
    failures: failures.map(f => ({
      query: f.query,
      expected: f.expected,
      got: f.topResult
    }))
  };
  
  const reportPath = `brutal-test-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  
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
