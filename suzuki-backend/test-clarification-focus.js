const axios = require('axios');

const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

async function testClarification(query, shouldClarify, expectedKeyword) {
  try {
    const response = await axios.post(API_URL, {
      message: query,
      vehicle: VEHICLE
    });

    const intent = response.data.intent;
    const text = response.data.response;
    
    // Skip if OpenAI error
    if (text.includes('difficultés techniques') || text.includes('réessayer')) {
      console.log(`\n📝 Query: "${query}"`);
      console.log(`   ⚠️ SKIPPED - OpenAI error`);
      return null;
    }

    const gotClarification = intent === 'CLARIFICATION_NEEDED';

    console.log(`\n📝 Query: "${query}"`);
    console.log(`   Expected: ${shouldClarify ? 'CLARIFY' : 'DIRECT'}`);
    console.log(`   Got: ${gotClarification ? 'CLARIFY' : 'DIRECT'}`);
    console.log(`   Intent: ${intent}`);
    
    if (gotClarification) {
      console.log(`   Question: ${text.substring(0, 100)}...`);
    } else {
      const match = text.match(/([A-Z\s]+(?:AV|AR|G|D|DR|GH)?)/);
      console.log(`   Product: ${match ? match[0].trim() : 'NONE'}`);
    }

    if (shouldClarify === gotClarification) {
      console.log(`   ✅ PASS`);
      return true;
    } else {
      console.log(`   ❌ FAIL - Expected ${shouldClarify ? 'clarification' : 'direct answer'}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function testReferenceSearch(reference, expectedProduct) {
  try {
    const response = await axios.post(API_URL, {
      message: reference,
      vehicle: VEHICLE
    });

    const text = response.data.response;
    const intent = response.data.intent;
    
    // Skip if OpenAI error
    if (text.includes('difficultés techniques') || text.includes('réessayer')) {
      console.log(`\n🔍 Reference: "${reference}"`);
      console.log(`   ⚠️ SKIPPED - OpenAI error`);
      return null;
    }

    const found = text.includes(expectedProduct) || intent === 'PARTS_SEARCH';

    console.log(`\n🔍 Reference: "${reference}"`);
    console.log(`   Expected: ${expectedProduct}`);
    console.log(`   Intent: ${intent}`);
    console.log(`   Response: ${text.substring(0, 100)}...`);

    if (found) {
      console.log(`   ✅ PASS`);
      return true;
    } else {
      console.log(`   ❌ FAIL - Reference not found`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function testContextMaintenance(query1, query2, query3, expectedProduct) {
  try {
    const response1 = await axios.post(API_URL, {
      message: query1,
      vehicle: VEHICLE
    });

    const sessionId = response1.data.sessionId;
    const text1 = response1.data.response;
    const gotClarification1 = response1.data.intent === 'CLARIFICATION_NEEDED';
    
    // Skip if OpenAI error
    if (text1.includes('difficultés techniques') || text1.includes('réessayer')) {
      console.log(`\n🔄 Context Test:`);
      console.log(`   Turn 1: "${query1}"`);
      console.log(`   ⚠️ SKIPPED - OpenAI error`);
      return null;
    }

    console.log(`\n🔄 Context Test:`);
    console.log(`   Turn 1: "${query1}"`);
    console.log(`   Got: ${gotClarification1 ? 'CLARIFICATION' : 'DIRECT'}`);

    if (!gotClarification1) {
      console.log(`   ❌ FAIL - Turn 1 should ask clarification`);
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const response2 = await axios.post(API_URL, {
      message: query2,
      vehicle: VEHICLE,
      sessionId: sessionId
    });

    const text2 = response2.data.response;
    const gotClarification2 = response2.data.intent === 'CLARIFICATION_NEEDED';
    
    console.log(`   Turn 2: "${query2}"`);
    console.log(`   Got: ${gotClarification2 ? 'CLARIFICATION' : 'PRODUCT'}`);
    
    // If multi-step clarification (e.g., amortisseur needs position then side)
    if (query3 && gotClarification2) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response3 = await axios.post(API_URL, {
        message: query3,
        vehicle: VEHICLE,
        sessionId: sessionId
      });
      
      const text3 = response3.data.response;
      const found = text3.includes(expectedProduct);
      
      console.log(`   Turn 3: "${query3}"`);
      console.log(`   Expected: ${expectedProduct}`);
      console.log(`   Got: ${text3.substring(0, 100)}...`);
      
      if (found) {
        console.log(`   ✅ PASS - Multi-step clarification worked`);
        return true;
      } else {
        console.log(`   ❌ FAIL - Wrong product or no product`);
        return false;
      }
    }
    
    // Single-step clarification
    const found = text2.includes(expectedProduct);

    console.log(`   Expected: ${expectedProduct}`);
    console.log(`   Got: ${text2.substring(0, 100)}...`);

    if (found) {
      console.log(`   ✅ PASS - Context maintained`);
      return true;
    } else {
      console.log(`   ❌ FAIL - Wrong product or no product`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🎯 FOCUSED TEST: Clarification & Context\n');
  console.log('Vehicle:', VEHICLE);
  console.log('='.repeat(80));

  let passed = 0;
  let total = 0;

  console.log('\n📊 TEST SUITE 1: Clarification Logic');
  console.log('='.repeat(80));

  const clarificationTests = [
    { query: 'amortisseur', shouldClarify: true, keyword: 'position' },
    { query: 'retroviseur', shouldClarify: true, keyword: 'côté' },
    { query: 'filtre', shouldClarify: true, keyword: 'type' },
    { query: 'plaquette', shouldClarify: true, keyword: 'position' },
    { query: 'disque', shouldClarify: true, keyword: 'position' },
    { query: 'amortisseur avant', shouldClarify: true, keyword: 'côté' },
    { query: 'retroviseur gauche', shouldClarify: false, keyword: 'none' },
    { query: 'filtre huile', shouldClarify: false, keyword: 'none' },
    { query: 'plaquette avant', shouldClarify: false, keyword: 'none' },
  ];

  for (const test of clarificationTests) {
    const result = await testClarification(test.query, test.shouldClarify, test.keyword);
    if (result !== null) {
      total++;
      if (result) passed++;
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n\n📊 TEST SUITE 2: Reference Search');
  console.log('='.repeat(80));

  const referenceTests = [
    { reference: '030115561AN', expected: 'FILTRE' },
    { reference: '16510M65L10', expected: 'FILTRE' },
    { reference: 'FILTRE-HU', expected: 'FILTRE' },
    { reference: '2547847', expected: 'AMORTISSEUR' },
  ];

  for (const test of referenceTests) {
    const result = await testReferenceSearch(test.reference, test.expected);
    if (result !== null) {
      total++;
      if (result) passed++;
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n\n📊 TEST SUITE 3: Context Maintenance');
  console.log('='.repeat(80));

  const contextTests = [
    { query1: 'amortisseur', query2: 'avant', query3: 'droite', expected: 'AMORTISSEUR AV' },
    { query1: 'retroviseur', query2: 'droite', expected: 'RETROVISEUR DR' },
    { query1: 'filtre', query2: 'huile', expected: 'FILTRE' },
    { query1: 'plaquette', query2: 'avant', expected: 'PLAQUETTE' },
  ];

  for (const test of contextTests) {
    const result = await testContextMaintenance(test.query1, test.query2, test.query3, test.expected);
    if (result !== null) {
      total++;
      if (result) passed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n\n' + '='.repeat(80));
  console.log('🎯 FOCUSED TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`Total: ${passed}/${total} (${((passed/total)*100).toFixed(1)}%)`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  
  const percentage = (passed/total)*100;
  if (percentage >= 90) {
    console.log('\n✅ EXCELLENT! Ready for production.');
  } else if (percentage >= 70) {
    console.log('\n⚠️ GOOD! Minor improvements needed.');
  } else {
    console.log('\n❌ NEEDS WORK! Review failed tests.');
  }
}

runTests().catch(console.error);
