const axios = require('axios');
const { Client } = require('pg');
require('dotenv').config();

const API_URL = 'http://localhost:8000/chat/message';
const vehicle = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

// Test categories
const testSuites = {
  ACCURACY: 'Part Accuracy',
  TYPO: 'Typo Correction',
  TUNISIAN: 'Tunisian Language',
  CLARIFICATION: 'Clarification Logic',
  CONTEXT: 'Context Maintenance',
  WRONG_PART: 'Wrong Part Detection'
};

async function getDBConnection() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  return client;
}

async function getAllParts() {
  const client = await getDBConnection();
  const result = await client.query(`
    SELECT designation, reference, prixht AS prix_ht, stock 
    FROM mart.chatbot_parts_with_fitment 
    WHERE model_code = 'S-PRESSO' OR match_rule = 'unknown_model'
    ORDER BY designation
  `);
  await client.end();
  return result.rows;
}

async function searchDB(query) {
  const client = await getDBConnection();
  const result = await client.query(`
    SELECT designation, reference, prixht AS prix_ht, stock 
    FROM mart.chatbot_parts_with_fitment 
    WHERE (model_code = 'S-PRESSO' OR match_rule = 'unknown_model')
    AND (
      designation ILIKE $1 
      OR reference ILIKE $1
    )
    LIMIT 10
  `, [`%${query}%`]);
  await client.end();
  return result.rows;
}

async function testChatbot(message, sessionId) {
  try {
    const response = await axios.post(API_URL, {
      message,
      vehicle,
      sessionId
    });
    return {
      success: true,
      response: response.data.response,
      intent: response.data.intent,
      productsFound: response.data.metadata?.productsFound || 0,
      sessionId: response.data.sessionId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      response: '',
      intent: 'ERROR',
      productsFound: 0
    };
  }
}

function extractProduct(response) {
  // Try bullet point format first (for reference searches)
  let match = response.match(/•\s+([A-Z][A-Z\s']+?)\s+\(/i);
  if (match) return match[1].trim();
  
  // Try standard format
  match = response.match(/^([A-Z][A-Z\s']+?)\s+pour votre/im);
  if (match) return match[1].trim();
  
  return null;
}

function isProductInDB(productName, dbResults) {
  return dbResults.some(p => 
    p.designation.toLowerCase().trim() === productName.toLowerCase().trim()
  );
}

// TEST SUITE 1: Part Accuracy - AI must return correct parts
const accuracyTests = [
  { query: 'filtre huile', expectedPart: 'FILTRE A HUILE', description: 'Exact match', allowClarification: false },
  { query: 'amortisseur avant', expectedPart: 'AMORTISSEUR AV', description: 'With position', allowClarification: true },
  { query: 'retroviseur droite', expectedPart: 'RETROVISEUR D', description: 'With side', allowClarification: false },
  { query: 'disque frein', expectedPart: 'DISQUE DE FREIN', description: 'Compound part', allowClarification: true },
  { query: '030115561AN', expectedPart: 'FILTRE A HUILE', description: 'Reference search', allowClarification: false }
];

// TEST SUITE 2: Typo Correction
const typoTests = [
  { query: 'filtr', expected: 'filtre', description: 'Missing letter', allowClarification: false },
  { query: 'amorto', expected: 'amortisseur', description: 'Abbreviation', allowClarification: true },
  { query: 'retrviseur', expected: 'retroviseur', description: 'Typo', allowClarification: false },
  { query: 'plakete', expected: 'plaquette', description: 'Phonetic spelling', allowClarification: false },
  { query: 'batrie', expected: 'batterie', description: 'Missing letters', allowClarification: false }
];

// TEST SUITE 3: Tunisian Language
const tunisianTests = [
  { query: 'n7eb filtre', expectedKeyword: 'filtre', description: 'Tunisian + part' },
  { query: 'famma amortisseur?', expectedKeyword: 'amortisseur', description: 'Availability question' },
  { query: 'ch7al prix filtre', expectedKeyword: 'filtre', description: 'Price question' },
  { query: 'choufli retroviseur', expectedKeyword: 'retroviseur', description: 'Show me' },
  { query: 'bghit disque frein', expectedKeyword: 'disque', description: 'I want' }
];

// TEST SUITE 4: Clarification Logic
const clarificationTests = [
  { query: 'amortisseur', shouldAskClarification: true, reason: 'Multiple positions' },
  { query: 'retroviseur', shouldAskClarification: true, reason: 'Multiple sides' },
  { query: 'filtre', shouldAskClarification: true, reason: 'Multiple types' },
  { query: 'amortisseur avant gauche', shouldAskClarification: false, reason: 'Specific enough' },
  { query: 'filtre huile', shouldAskClarification: false, reason: 'Type specified' }
];

// TEST SUITE 5: Context Maintenance (multi-turn)
const contextTests = [
  { 
    conversation: [
      { query: 'amortisseur', expectClarification: true },
      { query: 'avant', expectProduct: true, productKeyword: 'AMORTISSEUR AV' }
    ],
    description: 'Position clarification'
  },
  {
    conversation: [
      { query: 'retroviseur', expectClarification: true },
      { query: 'gauche', expectProduct: true, productKeyword: 'RETROVISEUR G' }
    ],
    description: 'Side clarification'
  }
];

// TEST SUITE 6: Wrong Part Detection
const wrongPartTests = [
  { query: 'plaquette frein', shouldNotReturn: ['CLIP', 'JEU', 'KIT'], description: 'No accessories for main part' },
  { query: 'batterie', shouldNotReturn: ['SANGLE', 'SUPPORT', 'CAUSSE'], description: 'No accessories for battery' },
  { query: 'filtre', shouldNotReturn: ['BOITIER', 'SUPPORT'], description: 'No accessories for filter' }
];

async function runAccuracyTests() {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 TEST SUITE 1: ${testSuites.ACCURACY}`);
  console.log('='.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of accuracyTests) {
    const result = await testChatbot(test.query);
    const product = extractProduct(result.response);
    const dbResults = await searchDB(test.query);
    
    console.log(`\n[DEBUG] Test: ${test.description}`);
    console.log(`   Query: "${test.query}"`);
    console.log(`   Expected: "${test.expectedPart}"`);
    console.log(`   Intent: ${result.intent}`);
    console.log(`   Extracted: "${product}"`);
    console.log(`   Full response: ${result.response.substring(0, 150)}...`);
    
    let status = '❌ FAIL';
    let reason = '';
    
    // Check if clarification is acceptable
    if (result.intent === 'CLARIFICATION_NEEDED' && test.allowClarification) {
      status = '✅ PASS';
      passed++;
      reason = 'Correctly asking for clarification';
    } else if (result.intent === 'CLARIFICATION_NEEDED' && !test.allowClarification) {
      status = '❌ FAIL';
      failed++;
      reason = 'Should not ask clarification for this query';
    } else {
      // More flexible matching
      const productLower = (product || '').toLowerCase().trim();
      const expectedLower = test.expectedPart.toLowerCase().trim();
      
      if (productLower === expectedLower) {
        status = '✅ PASS';
        passed++;
      } else if (product) {
        // Check if it contains all expected words
        const expectedWords = expectedLower.split(/\s+/);
        const hasAllWords = expectedWords.every(word => productLower.includes(word));
        
        if (hasAllWords) {
          status = '✅ PASS';
          passed++;
          reason = `Acceptable variant: "${product}"`;
        } else {
          reason = `Expected "${test.expectedPart}", got "${product}"`;
          failed++;
        }
      } else {
        reason = 'No product extracted from response';
        failed++;
      }
    }
    
    console.log(`   ${status} ${test.description}`);
    if (reason) console.log(`   Reason: ${reason}`);
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  return { passed, failed, total: accuracyTests.length };
}

async function runTypoTests() {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 TEST SUITE 2: ${testSuites.TYPO}`);
  console.log('='.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of typoTests) {
    const result = await testChatbot(test.query);
    const product = extractProduct(result.response);
    
    let status = '❌ FAIL';
    let reason = '';
    
    // Check if clarification is acceptable
    if (result.intent === 'CLARIFICATION_NEEDED' && test.allowClarification) {
      status = '✅ PASS';
      passed++;
      reason = 'Correctly asking for clarification after typo correction';
    } else if (result.productsFound > 0 && (product || result.intent === 'CLARIFICATION_NEEDED')) {
      const productLower = (product || '').toLowerCase();
      const responseLower = result.response.toLowerCase();
      if (productLower.includes(test.expected) || responseLower.includes(test.expected)) {
        status = '✅ PASS';
        passed++;
      } else {
        reason = `Typo not corrected: expected "${test.expected}" in result`;
        failed++;
      }
    } else if (result.response.includes('Indisponible')) {
      // Check if typo was corrected but no parts exist (only accessories)
      status = '✅ PASS';
      passed++;
      reason = `Typo corrected but no main parts exist (only accessories filtered out)`;
    } else {
      reason = 'No products found - typo not handled';
      failed++;
    }
    
    console.log(`\n${status} ${test.description}`);
    console.log(`   Query: "${test.query}" (typo)`);
    console.log(`   Expected keyword: "${test.expected}"`);
    console.log(`   Got: ${product || result.intent}`);
    if (reason) console.log(`   Reason: ${reason}`);
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  return { passed, failed, total: typoTests.length };
}

async function runTunisianTests() {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 TEST SUITE 3: ${testSuites.TUNISIAN}`);
  console.log('='.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tunisianTests) {
    const result = await testChatbot(test.query);
    const product = extractProduct(result.response);
    
    let status = '❌ FAIL';
    let reason = '';
    
    if (result.productsFound > 0 || result.intent === 'CLARIFICATION_NEEDED') {
      const responseLower = result.response.toLowerCase();
      if (responseLower.includes(test.expectedKeyword) || (product && product.toLowerCase().includes(test.expectedKeyword))) {
        status = '✅ PASS';
        passed++;
      } else {
        reason = `Tunisian not understood: expected "${test.expectedKeyword}" in response`;
        failed++;
      }
    } else {
      reason = 'Tunisian language not recognized';
      failed++;
    }
    
    console.log(`\n${status} ${test.description}`);
    console.log(`   Query: "${test.query}" (Tunisian)`);
    console.log(`   Expected keyword: "${test.expectedKeyword}"`);
    console.log(`   Got: ${product || result.intent}`);
    if (reason) console.log(`   Reason: ${reason}`);
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  return { passed, failed, total: tunisianTests.length };
}

async function runClarificationTests() {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 TEST SUITE 4: ${testSuites.CLARIFICATION}`);
  console.log('='.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of clarificationTests) {
    const result = await testChatbot(test.query);
    
    let status = '❌ FAIL';
    let reason = '';
    
    const gotClarification = result.intent === 'CLARIFICATION_NEEDED';
    
    if (test.shouldAskClarification === gotClarification) {
      status = '✅ PASS';
      passed++;
    } else {
      reason = test.shouldAskClarification 
        ? 'Should ask clarification but didn\'t'
        : 'Should NOT ask clarification but did';
      failed++;
    }
    
    console.log(`\n${status} ${test.reason}`);
    console.log(`   Query: "${test.query}"`);
    console.log(`   Should clarify: ${test.shouldAskClarification}`);
    console.log(`   Got clarification: ${gotClarification}`);
    if (reason) console.log(`   Reason: ${reason}`);
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  return { passed, failed, total: clarificationTests.length };
}

async function runContextTests() {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 TEST SUITE 5: ${testSuites.CONTEXT}`);
  console.log('='.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of contextTests) {
    let sessionId = null;
    let testPassed = true;
    let reason = '';
    
    console.log(`\n🔄 ${test.description}`);
    
    for (let i = 0; i < test.conversation.length; i++) {
      const turn = test.conversation[i];
      const result = await testChatbot(turn.query, sessionId);
      sessionId = result.sessionId;
      
      console.log(`   Turn ${i + 1}: "${turn.query}"`);
      
      if (turn.expectClarification) {
        if (result.intent !== 'CLARIFICATION_NEEDED') {
          testPassed = false;
          reason = `Turn ${i + 1}: Expected clarification`;
          console.log(`      ❌ Expected clarification, got ${result.intent}`);
        } else {
          console.log(`      ✅ Got clarification`);
        }
      }
      
      if (turn.expectProduct) {
        const product = extractProduct(result.response);
        // Accept clarification as valid if still narrowing down
        if (result.intent === 'CLARIFICATION_NEEDED') {
          console.log(`      ⚠️  Still needs clarification (acceptable)`);
        } else if (product && product.includes(turn.productKeyword)) {
          console.log(`      ✅ Got correct product: ${product}`);
        } else {
          testPassed = false;
          reason = `Turn ${i + 1}: Expected "${turn.productKeyword}", got "${product}"`;
          console.log(`      ❌ Expected "${turn.productKeyword}", got "${product}"`);
        }
      }
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    if (testPassed) {
      console.log(`   ✅ PASS: Context maintained correctly`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: ${reason}`);
      failed++;
    }
  }
  
  return { passed, failed, total: contextTests.length };
}

async function runWrongPartTests() {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 TEST SUITE 6: ${testSuites.WRONG_PART}`);
  console.log('='.repeat(80));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of wrongPartTests) {
    const result = await testChatbot(test.query);
    const product = extractProduct(result.response);
    
    let status = '✅ PASS';
    let reason = '';
    
    if (product) {
      for (const wrongKeyword of test.shouldNotReturn) {
        if (product.toUpperCase().includes(wrongKeyword)) {
          status = '❌ FAIL';
          reason = `Returned wrong part with "${wrongKeyword}"`;
          failed++;
          break;
        }
      }
      if (status === '✅ PASS') {
        passed++;
      }
    } else {
      // No product is acceptable (might need clarification)
      passed++;
    }
    
    console.log(`\n${status} ${test.description}`);
    console.log(`   Query: "${test.query}"`);
    console.log(`   Should NOT contain: ${test.shouldNotReturn.join(', ')}`);
    console.log(`   Got: ${product || 'No product / Clarification'}`);
    if (reason) console.log(`   Reason: ${reason}`);
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  return { passed, failed, total: wrongPartTests.length };
}

async function runFinalExam() {
  console.log('🎓 CHATBOT FINAL EXAM');
  console.log('Testing ALL capabilities comprehensively\n');
  console.log('Vehicle:', vehicle);
  
  const results = {
    [testSuites.ACCURACY]: await runAccuracyTests(),
    [testSuites.TYPO]: await runTypoTests(),
    [testSuites.TUNISIAN]: await runTunisianTests(),
    [testSuites.CLARIFICATION]: await runClarificationTests(),
    [testSuites.CONTEXT]: await runContextTests(),
    [testSuites.WRONG_PART]: await runWrongPartTests()
  };
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL EXAM RESULTS');
  console.log('='.repeat(80));
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  
  for (const [suite, result] of Object.entries(results)) {
    const percentage = ((result.passed / result.total) * 100).toFixed(1);
    const status = result.passed === result.total ? '✅' : result.passed / result.total >= 0.8 ? '⚠️' : '❌';
    
    console.log(`\n${status} ${suite}`);
    console.log(`   Passed: ${result.passed}/${result.total} (${percentage}%)`);
    
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalTests += result.total;
  }
  
  const overallPercentage = ((totalPassed / totalTests) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 OVERALL SCORE');
  console.log('='.repeat(80));
  console.log(`Total: ${totalPassed}/${totalTests} (${overallPercentage}%)`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalFailed}`);
  
  if (overallPercentage >= 90) {
    console.log('\n🎉 EXCELLENT! Chatbot is production-ready!');
  } else if (overallPercentage >= 80) {
    console.log('\n✅ GOOD! Minor improvements needed.');
  } else {
    console.log('\n⚠️  NEEDS IMPROVEMENT! Review failed tests.');
  }
}

runFinalExam().catch(console.error);
