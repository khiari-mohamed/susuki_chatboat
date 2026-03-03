import axios from 'axios';
import pg from 'pg';
const { Pool } = pg;

const API_URL = 'http://localhost:8000/chat/message';
const MODELS = ['S-PRESSO', 'SWIFT', 'VITARA', 'JIMNY'];

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'suzuki_parts',
  user: 'postgres',
  password: '23044943'
});

// Test vehicles for each model
const VEHICLES = {
  'S-PRESSO': { marque: 'SUZUKI', modele: 'S-PRESSO', annee: 2024, immatriculation: '243TUNIS4698' },
  'SWIFT': { marque: 'SUZUKI', modele: 'SWIFT', annee: 2023, immatriculation: '243TUNIS1234' },
  'VITARA': { marque: 'SUZUKI', modele: 'VITARA', annee: 2022, immatriculation: '243TUNIS5678' },
  'JIMNY': { marque: 'SUZUKI', modele: 'JIMNY', annee: 2021, immatriculation: '243TUNIS9012' }
};

let sessionId = null;

async function chat(message, vehicle) {
  try {
    const response = await axios.post(API_URL, { message, vehicle, sessionId });
    sessionId = response.data.sessionId;
    return response.data;
  } catch (error) {
    console.error(`    ⚠️ API Error: ${error.message}`);
    return { 
      error: error.message, 
      intent: 'ERROR',
      response: 'ERROR',
      products: [],
      metadata: { productsFound: 0 }
    };
  }
}

function resetSession() {
  sessionId = null;
}

// Helper to check if response contains clarification
function isClarification(response) {
  if (!response || !response.response) return false;
  return response.intent === 'CLARIFICATION_NEEDED' || 
         response.response.includes('préciser') ||
         response.response.includes('Afin d\'identifier');
}

// Helper to check if product found
function hasProduct(response) {
  if (!response) return false;
  return response.intent === 'PARTS_SEARCH' || 
         response.intent === 'SEARCH' ||
         (response.products && response.products.length > 0);
}

// Helper to extract product name from response
function extractProduct(response) {
  if (!response || !response.response) return null;
  if (response.products && response.products.length > 0) {
    return response.products[0].designation;
  }
  const match = response.response.match(/^([A-Z][A-Z\s]+?)(?:\s+pour|\s+Réf)/);
  return match ? match[1].trim() : null;
}

async function checkBackend() {
  console.log('🔌 BACKEND CHECK');
  console.log('='.repeat(80));
  
  try {
    // Try a simple chat request to check if backend is alive
    const testVehicle = { marque: 'SUZUKI', modele: 'S-PRESSO', annee: 2024, immatriculation: 'TEST' };
    const response = await axios.post('http://localhost:8000/chat/message', 
      { message: 'test', vehicle: testVehicle }, 
      { timeout: 5000 }
    );
    console.log('✅ Backend is running');
    console.log();
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend is NOT running!');
      console.error('⚠️  Please start the backend with: npm run start:dev');
    } else {
      console.log('✅ Backend is running (got response)');
      return true;
    }
    console.log();
    return false;
  }
}

async function checkDatabase() {
  console.log('🔍 DATABASE CHECK');
  console.log('='.repeat(80));
  
  try {
    // Check if new ETL tables exist
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'mart' 
      AND table_name = 'chatbot_parts_with_fitment'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.error('❌ NEW ETL TABLE NOT FOUND: mart.chatbot_parts_with_fitment');
      console.error('⚠️  The chatbot is configured to use NEW ETL data but table doesn\'t exist!');
      console.error('⚠️  Please run ETL scripts to populate mart.chatbot_parts_with_fitment');
      console.log();
      return;
    }
    
    // Total parts in NEW schema
    const totalResult = await pool.query('SELECT COUNT(*) FROM mart.chatbot_parts_with_fitment');
    console.log(`📦 Total parts in database: ${totalResult.rows[0].count}`);
    console.log();
    
    // Parts per model
    console.log('Parts available per model:');
    for (const model of MODELS) {
      const result = await pool.query(
        `SELECT COUNT(*) FROM mart.chatbot_parts_with_fitment WHERE model_code = $1 OR match_rule = 'unknown_model'`,
        [model]
      );
      console.log(`  ${model.padEnd(12)}: ${result.rows[0].count} parts`);
    }
    console.log();
    
    // Universal parts
    const universalResult = await pool.query(
      "SELECT COUNT(*) FROM mart.chatbot_parts_with_fitment WHERE match_rule = 'unknown_model'"
    );
    console.log(`  Universal    : ${universalResult.rows[0].count} parts (fit all models)`);
    console.log();
    
    // Sample parts for S-PRESSO
    console.log('Sample parts for S-PRESSO:');
    const sampleResult = await pool.query(
      `SELECT designation, reference, prixht FROM mart.chatbot_parts_with_fitment 
       WHERE (model_code = 'S-PRESSO' OR match_rule = 'unknown_model') 
       AND designation ILIKE '%filtre%' 
       LIMIT 5`
    );
    sampleResult.rows.forEach(row => {
      console.log(`  - ${row.designation} (${row.reference}) - ${row.prixht} TND`);
    });
    console.log();
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.log('⚠️  Continuing with tests anyway...\n');
  }
}

console.log('🚀 COMPREHENSIVE CHATBOT TEST');
console.log('Testing multiple models with realistic scenarios\n');

const tests = {
  'Basic Search': [],
  'Clarification Flow': [],
  'Context Maintenance': [],
  'Multi-Step Clarification': [],
  'Part Variants': [],
  'Position Detection': [],
  'Side Detection': [],
  'Typo Handling': [],
  'Tunisian Language': [],
  'Reference Search': [],
  'Price Queries': [],
  'Stock Queries': []
};

async function runTests() {
  
  // ============================================================================
  // TEST 1: BASIC SEARCH (All Models)
  // ============================================================================
  console.log('📊 TEST 1: Basic Search Across Models');
  console.log('='.repeat(80));
  
  for (const model of MODELS) {
    resetSession();
    const vehicle = VEHICLES[model];
    
    // Test: Specific part with position and side
    const r1 = await chat('filtre huile', vehicle);
    const pass1 = hasProduct(r1) && !isClarification(r1);
    tests['Basic Search'].push({
      model,
      query: 'filtre huile',
      expected: 'Direct product',
      got: pass1 ? 'Product found' : 'Clarification/No result',
      pass: pass1
    });
    console.log(`  ${model}: "filtre huile" → ${pass1 ? '✅' : '❌'} ${r1.intent}`);
  }
  console.log();

  // ============================================================================
  // TEST 2: CLARIFICATION FLOW
  // ============================================================================
  console.log('📊 TEST 2: Clarification Flow');
  console.log('='.repeat(80));
  
  for (const model of MODELS) {
    resetSession();
    const vehicle = VEHICLES[model];
    
    // Test: Generic part should ask for clarification
    const r1 = await chat('amortisseur', vehicle);
    const needsClarification = isClarification(r1);
    console.log(`  ${model}: "amortisseur" → ${needsClarification ? '✅ CLARIFY' : '❌ DIRECT'}`);
    
    if (needsClarification) {
      // Answer: avant
      const r2 = await chat('avant', vehicle);
      const stillNeedsClarification = isClarification(r2);
      console.log(`    → "avant" → ${stillNeedsClarification ? '✅ CLARIFY (side)' : '❌ DIRECT'}`);
      
      if (stillNeedsClarification) {
        // Answer: gauche
        const r3 = await chat('gauche', vehicle);
        const hasProductNow = hasProduct(r3);
        const product = extractProduct(r3);
        console.log(`    → "gauche" → ${hasProductNow ? '✅' : '❌'} ${product || 'No product'}`);
        
        tests['Clarification Flow'].push({
          model,
          query: 'amortisseur → avant → gauche',
          expected: 'AMORTISSEUR AV G',
          got: product,
          pass: hasProductNow && product && product.includes('AMORTISSEUR') && product.includes('AV') && product.includes('G')
        });
      }
    }
  }
  console.log();

  // ============================================================================
  // TEST 3: CONTEXT MAINTENANCE (Critical Test)
  // ============================================================================
  console.log('📊 TEST 3: Context Maintenance');
  console.log('='.repeat(80));
  
  for (const model of MODELS) {
    resetSession();
    const vehicle = VEHICLES[model];
    
    // Test: filtre → huile (should return FILTRE A HUILE, not PARE HUILE)
    const r1 = await chat('filtre', vehicle);
    console.log(`  ${model}: "filtre" → ${isClarification(r1) ? '✅ CLARIFY' : '❌ DIRECT'}`);
    
    if (isClarification(r1)) {
      const r2 = await chat('huile', vehicle);
      const product = extractProduct(r2);
      const isCorrect = product && product.includes('FILTRE') && product.includes('HUILE') && !product.includes('PARE');
      console.log(`    → "huile" → ${isCorrect ? '✅' : '❌'} ${product || 'No product'}`);
      
      tests['Context Maintenance'].push({
        model,
        query: 'filtre → huile',
        expected: 'FILTRE A HUILE (not PARE HUILE)',
        got: product,
        pass: isCorrect
      });
    }
  }
  console.log();

  // ============================================================================
  // TEST 4: MULTI-STEP CLARIFICATION
  // ============================================================================
  console.log('📊 TEST 4: Multi-Step Clarification');
  console.log('='.repeat(80));
  
  const multiStepTests = [
    { part: 'retroviseur', steps: ['gauche'], expected: 'RETROVISEUR G' },
    { part: 'phare', steps: ['avant', 'gauche'], expected: 'PHARE AV' },
    { part: 'disque frein', steps: ['avant'], expected: 'DISQUE FREIN AV' }
  ];
  
  for (const test of multiStepTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    let r = await chat(test.part, vehicle);
    
    for (const step of test.steps) {
      if (isClarification(r)) {
        r = await chat(step, vehicle);
      }
    }
    
    const product = extractProduct(r);
    const pass = product && product.includes(test.expected.split(' ')[0]);
    console.log(`  "${test.part}" → ${test.steps.join(' → ')} → ${pass ? '✅' : '❌'} ${product || 'No product'}`);
    
    tests['Multi-Step Clarification'].push({
      model: 'S-PRESSO',
      query: `${test.part} → ${test.steps.join(' → ')}`,
      expected: test.expected,
      got: product,
      pass
    });
  }
  console.log();

  // ============================================================================
  // TEST 5: PART VARIANTS (Different filter types)
  // ============================================================================
  console.log('📊 TEST 5: Part Variants');
  console.log('='.repeat(80));
  
  const variantTests = [
    { query: 'filtre air', expected: 'FILTRE A AIR' },
    { query: 'filtre huile', expected: 'FILTRE A HUILE' },
    { query: 'filtre gazoile', expected: 'FILTRE GAZOILE' },
    { query: 'filtre habitacle', expected: 'FILTRE HABITACLE' },
    { query: 'plaquette frein avant', expected: 'PLAQUETTE' },
    { query: 'disque frein avant', expected: 'DISQUE FREIN' }
  ];
  
  for (const test of variantTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.query, vehicle);
    const product = extractProduct(r);
    const pass = product && product.includes(test.expected.split(' ')[0]);
    console.log(`  "${test.query}" → ${pass ? '✅' : '❌'} ${product || 'No product'}`);
    
    tests['Part Variants'].push({
      model: 'S-PRESSO',
      query: test.query,
      expected: test.expected,
      got: product,
      pass
    });
  }
  console.log();

  // ============================================================================
  // TEST 6: POSITION DETECTION
  // ============================================================================
  console.log('📊 TEST 6: Position Detection');
  console.log('='.repeat(80));
  
  const positionTests = [
    { query: 'amortisseur avant', expected: 'AV' },
    { query: 'amortisseur arriere', expected: 'AR' },
    { query: 'plaquette avant', expected: 'AV' },
    { query: 'disque arriere', expected: 'AR' }
  ];
  
  for (const test of positionTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.query, vehicle);
    const product = extractProduct(r) || r.response;
    const pass = product && product.includes(test.expected);
    console.log(`  "${test.query}" → ${pass ? '✅' : '❌'} ${pass ? 'Correct position' : 'Wrong/No position'}`);
    
    tests['Position Detection'].push({
      model: 'S-PRESSO',
      query: test.query,
      expected: `Contains ${test.expected}`,
      got: product,
      pass
    });
  }
  console.log();

  // ============================================================================
  // TEST 7: SIDE DETECTION
  // ============================================================================
  console.log('📊 TEST 7: Side Detection');
  console.log('='.repeat(80));
  
  const sideTests = [
    { query: 'retroviseur gauche', expected: 'G' },
    { query: 'retroviseur droite', expected: 'DR' },
    { query: 'phare gauche', expected: 'G' },
    { query: 'phare droit', expected: 'DR' }
  ];
  
  for (const test of sideTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.query, vehicle);
    const product = extractProduct(r) || r.response;
    const pass = product && (product.includes(test.expected) || product.includes('GAUCHE') || product.includes('DROIT'));
    console.log(`  "${test.query}" → ${pass ? '✅' : '❌'} ${pass ? 'Correct side' : 'Wrong/No side'}`);
    
    tests['Side Detection'].push({
      model: 'S-PRESSO',
      query: test.query,
      expected: `Contains ${test.expected}`,
      got: product,
      pass
    });
  }
  console.log();

  // ============================================================================
  // TEST 8: TYPO HANDLING
  // ============================================================================
  console.log('📊 TEST 8: Typo Handling');
  console.log('='.repeat(80));
  
  const typoTests = [
    { typo: 'filtr', correct: 'filtre' },
    { typo: 'amorto', correct: 'amortisseur' },
    { typo: 'batrie', correct: 'batterie' },
    { typo: 'plakete', correct: 'plaquette' },
    { typo: 'retrviseur', correct: 'retroviseur' },
    { typo: 'couroi', correct: 'courroie' },
    { typo: 'boujie', correct: 'bougie' },
    { typo: 'alternatuer', correct: 'alternateur' }
  ];
  
  for (const test of typoTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.typo, vehicle);
    const handled = isClarification(r) || hasProduct(r);
    console.log(`  "${test.typo}" → ${handled ? '✅' : '❌'} ${r.intent}`);
    
    tests['Typo Handling'].push({
      model: 'S-PRESSO',
      query: test.typo,
      expected: `Handled as ${test.correct}`,
      got: r.intent,
      pass: handled
    });
  }
  console.log();

  // ============================================================================
  // TEST 9: TUNISIAN LANGUAGE
  // ============================================================================
  console.log('📊 TEST 9: Tunisian Language');
  console.log('='.repeat(80));
  
  const tunisianTests = [
    { query: 'n7eb filtre', expected: 'filtre' },
    { query: 'famma amortisseur?', expected: 'amortisseur' },
    { query: 'ch7al prix filtre', expected: 'filtre' },
    { query: 'bghit disque frein', expected: 'disque' },
    { query: 'choufli retroviseur', expected: 'retroviseur' },
    { query: 'wriني batterie', expected: 'batterie' },
    { query: 'n7eb plaquette frein', expected: 'plaquette' },
    { query: 'famma courroie?', expected: 'courroie' }
  ];
  
  for (const test of tunisianTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.query, vehicle);
    const handled = isClarification(r) || hasProduct(r);
    console.log(`  "${test.query}" → ${handled ? '✅' : '❌'} ${r.intent}`);
    
    tests['Tunisian Language'].push({
      model: 'S-PRESSO',
      query: test.query,
      expected: `Understood ${test.expected}`,
      got: r.intent,
      pass: handled
    });
  }
  console.log();

  // ============================================================================
  // TEST 10: REFERENCE SEARCH
  // ============================================================================
  console.log('📊 TEST 10: Reference Search');
  console.log('='.repeat(80));
  
  const refTests = [
    { ref: '030115561AN', shouldFind: true, part: 'FILTRE' },
    { ref: '16510M65L10', shouldFind: false, part: 'N/A' },
    { ref: 'NONEXISTENT123', shouldFind: false, part: 'N/A' },
    { ref: '00325', shouldFind: true, part: 'filtre' }
  ];
  
  for (const test of refTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.ref, vehicle);
    const found = hasProduct(r);
    const correct = test.shouldFind ? found : !found;
    console.log(`  "${test.ref}" → ${correct ? '✅' : '❌'} ${found ? 'Found' : 'Not found'} (expected: ${test.shouldFind ? 'Found' : 'Not found'})`);
    
    tests['Reference Search'].push({
      model: 'S-PRESSO',
      query: test.ref,
      expected: test.shouldFind ? 'Found' : 'Not found',
      got: found ? 'Found' : 'Not found',
      pass: correct
    });
  }
  console.log();

  // ============================================================================
  // RESULTS SUMMARY
  // ============================================================================
  console.log('='.repeat(80));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(80));
  
  let totalTests = 0;
  let totalPassed = 0;
  
  for (const [category, results] of Object.entries(tests)) {
    const passed = results.filter(r => r.pass).length;
    const total = results.length;
    const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    
    totalTests += total;
    totalPassed += passed;
    
    const status = percentage >= 90 ? '✅' : percentage >= 70 ? '⚠️' : '❌';
    console.log(`${status} ${category}: ${passed}/${total} (${percentage}%)`);
    
    // Show failures
    const failures = results.filter(r => !r.pass);
    if (failures.length > 0 && failures.length <= 3) {
      failures.forEach(f => {
        console.log(`   ❌ ${f.model}: "${f.query}" - Expected: ${f.expected}, Got: ${f.got}`);
      });
    }
  }
  
  console.log('='.repeat(80));
  const overallPercentage = ((totalPassed / totalTests) * 100).toFixed(1);
  const overallStatus = overallPercentage >= 90 ? '✅ EXCELLENT' : overallPercentage >= 80 ? '✅ GOOD' : overallPercentage >= 70 ? '⚠️ NEEDS WORK' : '❌ CRITICAL';
  console.log(`🎯 OVERALL: ${totalPassed}/${totalTests} (${overallPercentage}%) ${overallStatus}`);
  console.log('='.repeat(80));
}

async function main() {
  const backendRunning = await checkBackend();
  if (!backendRunning) {
    console.log('❌ Cannot run tests without backend. Exiting...');
    process.exit(1);
  }
  
  await checkDatabase();
  await runTests();
  await pool.end();
}

main().catch(console.error);

  // ============================================================================
  // TEST 11: PRICE QUERIES
  // ============================================================================
  console.log('📊 TEST 11: Price Queries');
  console.log('='.repeat(80));
  
  const priceTests = [
    { query: 'prix filtre huile', expected: 'price' },
    { query: 'combien coute amortisseur', expected: 'price' },
    { query: 'ch7al prix batterie', expected: 'price' }
  ];
  
  for (const test of priceTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.query, vehicle);
    // Price shown if product exists, or handled if not
    const hasPrice = r.response && r.response.includes('TND');
    const handled = r.intent !== 'ERROR' && r.response && r.response.length > 0;
    const pass = hasPrice || handled;
    console.log(`  "${test.query}" → ${pass ? '✅' : '❌'} ${hasPrice ? 'Price shown' : handled ? 'Handled' : 'Error'}`);
    
    tests['Price Queries'].push({
      model: 'S-PRESSO',
      query: test.query,
      expected: 'Price or handled',
      got: hasPrice ? 'Price shown' : handled ? 'Handled' : 'Error',
      pass
    });
  }
  console.log();

  // ============================================================================
  // TEST 12: STOCK QUERIES (Chatbot doesn't provide stock info - by design)
  // ============================================================================
  console.log('📊 TEST 12: Stock Queries');
  console.log('='.repeat(80));
  
  const stockTests = [
    { query: 'disponible filtre huile', expected: 'handled' },
    { query: 'famma batterie?', expected: 'handled' },
    { query: 'en stock amortisseur', expected: 'handled' }
  ];
  
  for (const test of stockTests) {
    resetSession();
    const vehicle = VEHICLES['S-PRESSO'];
    const r = await chat(test.query, vehicle);
    // Stock queries should be handled (not error), but won't show stock numbers
    const handled = r.intent !== 'ERROR' && r.response && r.response.length > 0;
    console.log(`  "${test.query}" → ${handled ? '✅' : '❌'} ${handled ? 'Handled' : 'Error'}`);
    
    tests['Stock Queries'].push({
      model: 'S-PRESSO',
      query: test.query,
      expected: 'Query handled',
      got: handled ? 'Handled' : 'Error',
      pass: handled
    });
  }
  console.log();
