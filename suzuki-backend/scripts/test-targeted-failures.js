const axios = require('axios');

const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

// Targeted test cases from failure analysis
const TEST_CASES = {
  'TYPO_NOT_CORRECTED': [
    { query: 'garafe de siege ar', expected: 'AGRAFE DE SIEGE AR' },
    { query: 'garafe feu ar', expected: 'AGRAFE FEU AR' },
    { query: 'agraffe', expected: 'AGRAFFE' },
    { query: 'graffe', expected: 'AGRAFFE' },
    { query: 'garaffe', expected: 'AGRAFFE' },
    { query: 'agraffes feu ar', expected: 'AGRAFFES FEU AR' },
    { query: 'agraffesfeuar', expected: 'AGRAFFES FEU AR' },
    { query: 'ar feu agraffes', expected: 'AGRAFFES FEU AR' },
    { query: 'graffes feu ar', expected: 'AGRAFFES FEU AR' },
    { query: 'garaffes feu ar', expected: 'AGRAFFES FEU AR' }
  ],
  'PLURAL_MISMATCH': [
    { query: 'agraffé', expected: 'AGRAFFE' },
    { query: 'àgràffe', expected: 'AGRAFFE' },
    { query: 'agraffés féu ar', expected: 'AGRAFFES FEU AR' },
    { query: 'àgràffes feu àr', expected: 'AGRAFFES FEU AR' }
  ],
  'WRONG_PART_RETURNED': [
    { query: 'iale ar d', expected: 'AILE AR D' },
    { query: 'iale ar g', expected: 'AILE AR G' },
    { query: 'iale av d', expected: 'AILE AV D' },
    { query: 'iale av g', expected: 'AILE AV G' },
    { query: 'àlimentàteur toit', expected: 'ALIMENTATEUR TOIT' },
    { query: 'ppareil monte glace ar d', expected: 'APPAREIL MONTE GLACE AR D' },
    { query: 'g ar glace monte appareil', expected: 'APPAREIL MONTE GLACE AR G' },
    { query: 'ppareil monte glace av g', expected: 'APPAREIL MONTE GLACE AV G' },
    { query: 'uclbuteur t 3 66', expected: 'CULBUTEUR (T:3.24)' }, // Should return NOTHING
    { query: 'uclbuteur t 3 24', expected: 'CULBUTEUR (T:3.24)' }
  ],
  'NO_RESULTS': [
    { query: 'garafes', expected: 'AGRAFES' },
    { query: 'agraphe para soleil', expected: 'AGRAPHE PARA SOLEIL' },
    { query: 'agrapheparasoleil', expected: 'AGRAPHE PARA SOLEIL' },
    { query: 'soleil para agraphe', expected: 'AGRAPHE PARA SOLEIL' },
    { query: 'agraphé para soléil', expected: 'AGRAPHE PARA SOLEIL' },
    { query: 'àgràphe pàrà soleil', expected: 'AGRAPHE PARA SOLEIL' },
    { query: 'graphe para soleil', expected: 'AGRAPHE PARA SOLEIL' },
    { query: 'garaphe para soleil', expected: 'AGRAPHE PARA SOLEIL' },
    { query: 'iale ar sup int', expected: 'AILE AR SUP INT' },
    { query: 'amortisseur malle d', expected: 'AMORTISSEUR MALLE D' }
  ],
  'CONCATENATED_WORDS': [
    { query: 'amortisseurmalled', expected: 'AMORTISSEUR MALLE D' },
    { query: 'baguettejointdevitreg', expected: 'BAGUETTE JOINT DE VITRE G' },
    { query: 'boutonfeudedetresse', expected: 'BOUTON FEU DE DETRESSE' },
    { query: 'capteurpressiondair', expected: 'CAPTEUR PRESSION D\'AIR' },
    { query: 'charnieredeporteavgh', expected: 'CHARNIERE DE PORTE AV G H' },
    { query: 'charnireporteavd', expected: 'CHARNIERE PORTE AV D' },
    { query: 'circliparbredecontre5mevitesset235', expected: 'CIRCLIP ARBRE DE CONTRE 5ÈME VITESSE T2.35' },
    { query: 'circliparbredecontre5mevitesset240', expected: 'CIRCLIP ARBRE DE CONTRE 5ÈME VITESSE T2.40' },
    { query: 'combindinstrument', expected: 'COMBINÉ D\'INSTRUMENT' },
    { query: 'duritederadiateur', expected: 'DURITE DE RADIATEUR' }
  ]
};

async function testQuery(query, expectedPart) {
  try {
    const response = await axios.post(API_URL, {
      message: query,
      vehicle: VEHICLE
    }, { timeout: 10000 });
    
    const { products } = response.data;
    const found = products && products.length > 0;
    const topResult = found ? products[0].designation : null;
    
    // Special case: dimension mismatch should return NOTHING
    if (query.includes('t 3 66') && expectedPart.includes('T:3.24')) {
      return {
        query,
        expected: 'NOTHING (dimension mismatch)',
        topResult,
        passed: !found,
        reason: found ? 'Should reject dimension mismatch' : 'Correctly rejected'
      };
    }
    
    // Check if expected part is in top 3 results
    const isCorrect = found && products.slice(0, 3).some(p => {
      const pDesig = p.designation.toLowerCase().replace(/[^a-z0-9]/g, '');
      const expected = expectedPart.toLowerCase().replace(/[^a-z0-9]/g, '');
      return pDesig.includes(expected) || expected.includes(pDesig);
    });
    
    return {
      query,
      expected: expectedPart,
      topResult,
      passed: isCorrect,
      reason: isCorrect ? 'Match found' : (found ? 'Wrong part' : 'No results')
    };
  } catch (error) {
    return {
      query,
      expected: expectedPart,
      topResult: null,
      passed: false,
      reason: `Error: ${error.message}`
    };
  }
}

async function runTargetedTest() {
  console.log('🎯 TARGETED FAILURE TEST\n');
  console.log('='.repeat(80));
  console.log('Testing 30 critical failure cases\n');
  
  const results = {};
  let totalTests = 0;
  let totalPassed = 0;
  
  for (const [category, tests] of Object.entries(TEST_CASES)) {
    console.log(`\n📌 ${category.replace(/_/g, ' ')}`);
    console.log('-'.repeat(80));
    
    const categoryResults = [];
    let categoryPassed = 0;
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      process.stdout.write(`  [${i + 1}/${tests.length}] Testing: "${test.query.substring(0, 40)}..."`);
      
      const result = await testQuery(test.query, test.expected);
      categoryResults.push(result);
      
      if (result.passed) {
        categoryPassed++;
        totalPassed++;
        process.stdout.write(` ✅\n`);
      } else {
        process.stdout.write(` ❌\n`);
        console.log(`      Expected: ${result.expected}`);
        console.log(`      Got: ${result.topResult || 'Nothing'}`);
        console.log(`      Reason: ${result.reason}`);
      }
      
      totalTests++;
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const categoryRate = ((categoryPassed / tests.length) * 100).toFixed(1);
    console.log(`  Result: ${categoryPassed}/${tests.length} passed (${categoryRate}%)`);
    
    results[category] = {
      total: tests.length,
      passed: categoryPassed,
      failed: tests.length - categoryPassed,
      rate: parseFloat(categoryRate),
      details: categoryResults
    };
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 OVERALL RESULTS\n');
  
  const overallRate = ((totalPassed / totalTests) * 100).toFixed(1);
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${totalPassed} (${overallRate}%)`);
  console.log(`❌ Failed: ${totalTests - totalPassed} (${(100 - overallRate).toFixed(1)}%)`);
  
  console.log('\n📈 BY CATEGORY:\n');
  for (const [category, data] of Object.entries(results)) {
    const status = data.rate >= 80 ? '✅' : data.rate >= 50 ? '⚠️' : '❌';
    console.log(`${status} ${category.replace(/_/g, ' ')}: ${data.passed}/${data.total} (${data.rate}%)`);
  }
  
  console.log('\n' + '='.repeat(80));
  
  if (overallRate >= 90) {
    console.log('\n🎉 EXCELLENT! All critical issues fixed!');
  } else if (overallRate >= 70) {
    console.log('\n👍 GOOD! Most critical issues resolved.');
  } else if (overallRate >= 50) {
    console.log('\n⚠️ FAIR! Still needs work on critical issues.');
  } else {
    console.log('\n❌ POOR! Critical issues remain.');
  }
  
  console.log(`\nOverall: ${overallRate}% success rate\n`);
}

runTargetedTest().catch(console.error);
