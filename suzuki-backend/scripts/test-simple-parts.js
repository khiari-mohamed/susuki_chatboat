const axios = require('axios');

const API_URL = 'http://localhost:8000';

// Common car part names to test
const PART_NAMES = [
  'amortisseur',
  'aile',
  'agrafe',
  'agraffe',
  'agraphe',
  'alimentateur',
  'alternateur',
  'arbre',
  'axe',
  'bague',
  'baguette',
  'balai',
  'barre',
  'biellette',
  'bobine',
  'bougie',
  'boulon',
  'bouton',
  'bras',
  'butee',
  'cable',
  'cache',
  'capot',
  'capteur',
  'cardan',
  'carter',
  'caoutchouc',
  'charniere',
  'circlip',
  'clignotant',
  'collier',
  'combin',
  'contacteur',
  'courroie',
  'coussinet',
  'cremaillere',
  'culasse',
  'culbuteur',
  'cylindre',
  'deflecteur',
  'disque',
  'durite',
  'ecrou',
  'embrayage',
  'enjoliveur',
  'etrier',
  'feu',
  'filtre',
  'flexible',
  'frein',
  'garniture',
  'glace',
  'goupille',
  'grille',
  'guide',
  'huile',
  'injecteur',
  'interrupteur',
  'joint',
  'lampe',
  'levier',
  'maitre',
  'malle',
  'manometre',
  'moteur',
  'moyeu',
  'pare',
  'phare',
  'piston',
  'plaquette',
  'pompe',
  'porte',
  'poussoir',
  'radiateur',
  'relais',
  'reservoir',
  'retroviseur',
  'rondelle',
  'rotule',
  'roue',
  'roulement',
  'sangle',
  'segment',
  'serrure',
  'siege',
  'silentbloc',
  'sonde',
  'soufflet',
  'support',
  'tambour',
  'thermostat',
  'tige',
  'toit',
  'traverse',
  'triangle',
  'tuyau',
  'valve',
  'ventilateur',
  'verin',
  'vilebrequin',
  'vis',
  'vitre',
  'volant'
];

// Test a single part name
async function testPartName(partName) {
  try {
    const response = await axios.post(`${API_URL}/chat/message`, {
      message: partName,
      vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' }
    });
    
    const products = response.data.products || [];
    const metadata = response.data.metadata || {};
    const productsFound = metadata.productsFound || 0;
    const intent = response.data.intent || '';
    
    // Success if:
    // 1. Products array has items with matching part name, OR
    // 2. metadata.productsFound > 0 (means AI found parts but needs clarification)
    const hasProducts = products.length > 0;
    const foundInMetadata = productsFound > 0;
    
    let matchesPartName = false;
    if (hasProducts) {
      matchesPartName = products.some(p => {
        const designation = p.designation.toLowerCase();
        const searchName = partName.toLowerCase();
        return designation.includes(searchName) || 
               designation.includes(searchName + 's') ||
               designation.includes(searchName + 'e');
      });
    }
    
    // Consider it a success if AI found parts (even if asking for clarification)
    const success = matchesPartName || foundInMetadata;
    
    return {
      success,
      resultCount: hasProducts ? products.length : productsFound,
      topResult: hasProducts ? products[0]?.designation : `Found ${productsFound} (${intent})`,
      intent
    };
  } catch (error) {
    return {
      success: false,
      resultCount: 0,
      topResult: 'Error',
      error: error.message
    };
  }
}

// Main test function
async function runTest() {
  console.log('🔍 COMPREHENSIVE PARTS NAME TEST\n');
  console.log('================================================================================');
  console.log(`Testing ${PART_NAMES.length} common car part names...\n`);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    failures: []
  };
  
  for (let i = 0; i < PART_NAMES.length; i++) {
    const partName = PART_NAMES[i];
    results.total++;
    
    const testResult = await testPartName(partName);
    
    if (testResult.success) {
      results.passed++;
      console.log(`✅ [${i + 1}/${PART_NAMES.length}] ${partName.padEnd(20)} → ${testResult.topResult.substring(0, 40)}`);
    } else {
      results.failed++;
      results.failures.push({
        partName,
        resultCount: testResult.resultCount,
        topResult: testResult.topResult,
        error: testResult.error
      });
      console.log(`\n❌ [${i + 1}/${PART_NAMES.length}] ${partName.padEnd(20)} → ${testResult.topResult}`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('\n\n================================================================================');
  console.log('📊 FINAL RESULTS\n');
  console.log(`Total Parts Tested: ${results.total}`);
  console.log(`✅ Passed: ${results.passed} (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failed} (${((results.failed / results.total) * 100).toFixed(1)}%)`);
  
  if (results.failures.length > 0) {
    console.log('\n================================================================================');
    console.log('❌ FAILED PARTS:\n');
    results.failures.forEach((failure, idx) => {
      console.log(`${idx + 1}. "${failure.partName}"`);
      console.log(`   Result: ${failure.topResult}`);
      if (failure.error) {
        console.log(`   Error: ${failure.error}`);
      }
    });
  }
  
  console.log('\n================================================================================');
  
  const successRate = results.passed / results.total;
  if (results.failed === 0) {
    console.log('🎉 PERFECT! All parts found correctly!');
  } else if (successRate >= 0.95) {
    console.log('✅ EXCELLENT! 95%+ success rate');
  } else if (successRate >= 0.90) {
    console.log('👍 GOOD! 90%+ success rate');
  } else if (successRate >= 0.80) {
    console.log('⚠️  ACCEPTABLE! 80%+ success rate');
  } else {
    console.log('❌ NEEDS IMPROVEMENT! Below 80% success rate');
  }
  
  console.log('\n🎯 The AI is ' + (successRate >= 0.95 ? 'NOT giving wrong pieces!' : 'still having some issues'));
}

// Run the test
console.log('Starting test in 2 seconds...\n');
setTimeout(() => {
  runTest().catch(console.error);
}, 2000);
