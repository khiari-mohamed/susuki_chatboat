const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_URL = 'http://localhost:8000/chat/message';

async function sendMessage(message, sessionId) {
  try {
    const response = await axios.post(API_URL, {
      message,
      sessionId,
      vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.message);
    return null;
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Only test the specific failing scenarios
const FAILING_TESTS = [
  // Clarification failures - answer "arrière" returns 0 products
  { ref: '83925M62S00-0CB', part: 'adhesif', position: 'arrière' },
  { ref: '83926M62S00-0CB', part: 'adhesif', position: 'arrière' },
  { ref: '41800M62S00', part: 'amortisseur', position: 'arrière' },
  { ref: '69430M66R00', part: 'charniere', position: 'arrière' },
  { ref: '69410M66R00', part: 'charniere', position: 'arrière' },
  { ref: '69420M66R00', part: 'charniere', position: 'arrière' },
  { ref: '69440M66R00', part: 'charniere', position: 'arrière' },
  { ref: '76295M62S00-5PK', part: 'joint', position: 'arrière' },
  { ref: '84661M62S00', part: 'joint', position: 'arrière' },
  { ref: '83970M62S00', part: 'joint', position: 'arrière' },
  { ref: '83980M62S00', part: 'joint', position: 'arrière' },
  { ref: '84671M62S00', part: 'joint', position: 'arrière' },
  { ref: '68003M62S00', part: 'porte', position: 'arrière' },
  { ref: '68003M62S01', part: 'porte', position: 'arrière' },
  { ref: '68004M62S00', part: 'porte', position: 'arrière' },
  { ref: '82301M62S20', part: 'serrure', position: 'arrière' },
  { ref: '82302M62S20', part: 'serrure', position: 'arrière' },
  
  // Direct search failures - not found
  { ref: '43250M62S00-27N', part: 'enjoliveur', position: null },
  { ref: '55101M62S10', part: 'etrier', position: null },
  { ref: '55102M62S10', part: 'etrier', position: null },
  { ref: '71721M62S00-799', part: 'grille', position: null },
  { ref: '71089M62S10-5PK', part: 'moulure', position: null },
  { ref: '71821M62S00-799', part: 'pare-choc', position: null },
  { ref: '71822M62S00-799', part: 'pare-choc', position: null },
  { ref: '48810M62S00', part: 'rotule', position: null },
  { ref: '71831M62S00', part: 'support', position: null },
  { ref: '71832M62S00', part: 'support', position: null },
  { ref: '71731M62S00', part: 'support', position: null },
  { ref: '71732M62S00', part: 'support', position: null }
];

async function testClarificationFailure(test, index) {
  const sessionId = `test-clarif-${Date.now()}-${index}`;
  console.log(`\n[${ index}/17] Testing: ${test.ref} - ${test.part} ${test.position}`);
  
  // Step 1: Request part
  const req1 = `n7eb ${test.part}`;
  console.log(`  📤 "${req1}"`);
  const res1 = await sendMessage(req1, sessionId);
  await delay(800);
  
  if (!res1 || res1.intent !== 'CLARIFICATION_NEEDED') {
    console.log(`  ❌ No clarification asked`);
    return false;
  }
  console.log(`  ✓ Clarification asked`);
  
  // Step 2: Answer with position
  console.log(`  📤 "${test.position}"`);
  const res2 = await sendMessage(test.position, sessionId);
  await delay(800);
  
  if (!res2) {
    console.log(`  ❌ No response`);
    return false;
  }
  
  const found = res2.metadata.productsFound > 0 || (
    res2.intent === 'CLARIFICATION_NEEDED' &&
    res2.response &&
    res2.response.toLowerCase().includes((test.position || '').toLowerCase())
  );
  console.log(`  ${found ? '✅' : '❌'} Products: ${res2.metadata.productsFound}`);
  return found;
}

async function testDirectSearchFailure(test, index) {
  const sessionId = `test-direct-${Date.now()}-${index}`;
  console.log(`\n[${index}/13] Testing: ${test.ref} - ${test.part}`);
  
  const req = `n7eb ${test.part}`;
  console.log(`  📤 "${req}"`);
  const res = await sendMessage(req, sessionId);
  await delay(800);
  
  if (!res) {
    console.log(`  ❌ No response`);
    return false;
  }
  
  const found = res.metadata.productsFound > 0 || (
    res.intent === 'CLARIFICATION_NEEDED' &&
    res.response &&
    res.response.toLowerCase().includes((test.part || '').toLowerCase())
  );
  console.log(`  ${found ? '✅' : '❌'} Products: ${res.metadata.productsFound}, Intent: ${res.intent}`);
  return found;
}

async function runTests() {
  console.log('🎯 FOCUSED TEST - Only Failing Scenarios\n');
  
  const clarificationTests = FAILING_TESTS.filter(t => t.position);
  const directTests = FAILING_TESTS.filter(t => !t.position);
  
  console.log('═'.repeat(80));
  console.log('PART 1: CLARIFICATION FAILURES (17 tests)');
  console.log('Testing: User answers "arrière" → Should find products');
  console.log('═'.repeat(80));
  
  let clarificationPassed = 0;
  for (let i = 0; i < clarificationTests.length; i++) {
    const passed = await testClarificationFailure(clarificationTests[i], i + 1);
    if (passed) clarificationPassed++;
    await delay(500);
  }
  
  console.log(`\n📊 Clarification: ${clarificationPassed}/${clarificationTests.length} passed\n`);
  
  console.log('═'.repeat(80));
  console.log('PART 2: DIRECT SEARCH FAILURES (13 tests)');
  console.log('Testing: Parts not found in database');
  console.log('═'.repeat(80));
  
  let directPassed = 0;
  for (let i = 0; i < directTests.length; i++) {
    const passed = await testDirectSearchFailure(directTests[i], i + 1);
    if (passed) directPassed++;
    await delay(500);
  }
  
  console.log(`\n📊 Direct Search: ${directPassed}/${directTests.length} passed\n`);
  
  console.log('═'.repeat(80));
  console.log('FINAL RESULTS');
  console.log('═'.repeat(80));
  console.log(`Clarification: ${clarificationPassed}/${clarificationTests.length} (${((clarificationPassed/clarificationTests.length)*100).toFixed(1)}%)`);
  console.log(`Direct Search: ${directPassed}/${directTests.length} (${((directPassed/directTests.length)*100).toFixed(1)}%)`);
  console.log(`TOTAL: ${clarificationPassed + directPassed}/${FAILING_TESTS.length} (${(((clarificationPassed + directPassed)/FAILING_TESTS.length)*100).toFixed(1)}%)`);
  
  await prisma.$disconnect();
}

runTests();
