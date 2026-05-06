#!/usr/bin/env node

/**
 * AUTOMATED TEST SUITE FOR SUZUKI CHATBOT
 * Tests all critical queries that previously returned wrong parts
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'SPRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const tests = [
  {
    id: 1,
    query: 'ahla',
    expectedIntent: 'GREETING',
    expectedProducts: 0,
    description: 'Greeting in Tunisian dialect'
  },
  {
    id: 2,
    query: 'salem',
    expectedIntent: 'GREETING',
    expectedProducts: 0,
    description: 'Greeting in Arabic'
  },
  {
    id: 3,
    query: 'fama filtre à huile',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['FILTRE', 'HUILE'],
    mustNotContain: ['FREIN', 'BRAKE', 'PLAQUETTE'],
    description: 'Oil filter with Tunisian "fama"'
  },
  {
    id: 4,
    query: 'plaquettes de frein',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Brake pads - product not in DB'
  },
  {
    id: 5,
    query: 'disque de frein avant',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['DISQUE', 'FREIN'],
    mustNotContain: ['GOLD'],
    description: 'Front brake disc - should have position'
  },
  {
    id: 6,
    query: 'amortisseur',
    expectedIntent: 'CLARIFICATION_NEEDED',
    skipProductCount: true,
    description: 'Shock absorber - needs clarification'
  },
  {
    id: 7,
    query: 'bougie d\'allumage',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['BOUGIE', 'ALLUMAGE'],
    description: 'Spark plug'
  },
  {
    id: 8,
    query: 'batrie',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['BATTERIE'],
    description: 'Battery with typo - should correct'
  },
  {
    id: 9,
    query: 'radiatuer',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['RADIATEUR'],
    description: 'Radiator with typo - should correct'
  },
  {
    id: 10,
    query: 'nhabba disk frein',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['DISQUE', 'FREIN'],
    description: 'Brake disc with Tunisian stop-word "nhabba"'
  },
  {
    id: 11,
    query: 'andi radiateur mekser',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['RADIATEUR'],
    description: 'Radiator with Tunisian stop-words "andi" and "mekser"'
  },
  {
    id: 12,
    query: 'feu arrière',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['FEU', 'AR'],
    mustNotContain: ['RADIATEUR', 'DURITE'],
    description: 'Rear light - should NOT return radiator'
  },
  {
    id: 13,
    query: 'aile',
    expectedIntent: 'CLARIFICATION_NEEDED',
    skipProductCount: true,
    description: 'Fender - needs position clarification'
  },
  {
    id: 14,
    query: 'rétroviseur',
    expectedIntent: 'CLARIFICATION_NEEDED',
    skipProductCount: true,
    description: 'Mirror - needs side clarification'
  },
  {
    id: 15,
    query: 'clignotant',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Turn signal - product not in DB'
  },
  {
    id: 16,
    query: 'en stock amortisseur avant?',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['AMORTISSEUR', 'AV'],
    description: 'Front shock in stock - "stock" should be ignored'
  },
  {
    id: 17,
    query: 'je cherche la pièce 030115561AN',
    expectedIntent: ['SEARCH', 'PARTS_SEARCH'],
    expectedProducts: 1,
    mustContain: ['FILTRE', 'HUILE'],
    description: 'Reference search - "cherche" should be ignored'
  },
  {
    id: 18,
    query: 'tapis de sol',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['TAPIS'],
    mustNotContain: ['STOP', 'LAMP', 'CONTROLLER'],
    description: 'Floor mat - "sol" should not expand to "stop"'
  },
  {
    id: 19,
    query: 'courroie d\'accessoires',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['COURROIE'],
    description: 'Accessory belt - "accessoires" should be ignored'
  },
  {
    id: 20,
    query: 'liquide de refroidissement',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['LIQUIDE', 'REFROIDISSEMENT'],
    description: 'Coolant'
  },
  {
    id: 21,
    query: 'ma voiture ne démarre pas',
    expectedIntent: 'DIAGNOSTIC_REDIRECT',
    expectedProducts: 0,
    description: 'Diagnostic query - should redirect to CarPro'
  },
  {
    id: 22,
    query: 'merci beaucoup',
    expectedIntent: 'THANKS',
    expectedProducts: 0,
    description: 'Thanks message'
  },
  {
    id: 23,
    query: 'quels sont vos horaires?',
    expectedIntent: 'SERVICE_QUESTION',
    expectedProducts: 0,
    description: 'Service question - should redirect'
  },
  {
    id: 24,
    query: 'pare-brise',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['PARE', 'BRISE'],
    description: 'Windshield'
  },
  {
    id: 25,
    query: 'essuie-glace avant',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['ESSUIE', 'GLACE'],
    description: 'Front wiper blades'
  },
  {
    id: 26,
    query: 'phare avant gauche',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['PHARE', 'AV', 'G'],
    mustNotContainWord: ['ARRIERE', 'DROIT'],
    description: 'Front left headlight - position and side'
  },
  {
    id: 27,
    query: 'rotule de direction',
    expectedIntent: ['SEARCH', 'CLARIFICATION_NEEDED'],
    expectedProducts: 1,
    mustContain: ['ROTULE'],
    description: 'Steering ball joint'
  },
  {
    id: 28,
    query: 'kit embrayage',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['EMBRAYAGE', 'KIT'],
    description: 'Clutch kit'
  },
  {
    id: 29,
    query: 'filtre habitacle',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['FILTRE', 'HABITACLE'],
    mustNotContain: ['HUILE', 'GAZOIL'],
    description: 'Cabin air filter - not oil filter'
  },
  {
    id: 30,
    query: 'courroie de distribution',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Timing belt - product not in DB'
  },
  {
    id: 31,
    query: 'capteur ABS',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['CAPTEUR', 'ABS'],
    description: 'ABS sensor'
  },
  {
    id: 32,
    query: 'joint de culasse',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['JOINT', 'CULASSE'],
    description: 'Cylinder head gasket'
  },
  {
    id: 33,
    query: 'pompe à eau',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['POMPE', 'EAU'],
    mustNotContain: ['FREIN', 'EMBRAYAGE'],
    description: 'Water pump - not brake pump'
  },
  {
    id: 34,
    query: 'demarreur',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['DEMARREUR'],
    mustNotContain: ['ALTERNATEUR'],
    description: 'Starter motor'
  },
  {
    id: 35,
    query: 'alternateur',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['ALTERNATEUR'],
    mustNotContain: ['DEMARREUR'],
    description: 'Alternator'
  },
  {
    id: 36,
    query: 'silencieux échappement',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    description: 'Exhaust muffler - product not in DB'
  },
  {
    id: 37,
    query: 'catalyseur',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['CATALYSEUR'],
    description: 'Catalytic converter'
  },
  {
    id: 38,
    query: 'triangle de suspension avant droit',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['SUSPENSION'],
    mustNotContain: ['GAUCHE'],
    description: 'Front right control arm - accepts ARM as synonym'
  },
  {
    id: 39,
    query: 'bras de suspension arrière',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['SUSPENSION'],
    description: 'Rear suspension arm - accepts ARM as synonym'
  },
  {
    id: 40,
    query: 'roulement de roue avant',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['ROULEMENT', 'ROUE', 'AV'],
    description: 'Front wheel bearing'
  },
  {
    id: 41,
    query: 'cardan gauche',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Left CV axle - product not in DB'
  },
  {
    id: 42,
    query: 'maitre cylindre de frein',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Brake master cylinder - product not in DB'
  },
  {
    id: 43,
    query: 'etrier de frein avant',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Front brake caliper - product not in DB'
  },
  {
    id: 44,
    query: 'tambour de frein arrière',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    description: 'Rear brake drum - product not in DB'
  },
  {
    id: 45,
    query: 'barre stabilisatrice',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['BARRE', 'STAB'],
    description: 'Sway bar - accepts STAB abbreviation'
  },
  {
    id: 46,
    query: 'ressort de suspension',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Suspension spring - product not in DB'
  },
  {
    id: 47,
    query: 'tendeur de courroie',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Belt tensioner - product not in DB'
  },
  {
    id: 48,
    query: 'injecteur',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['INJECTEUR'],
    description: 'Fuel injector'
  },
  {
    id: 49,
    query: 'bobine d\'allumage',
    expectedIntent: 'SEARCH',
    expectedProducts: 0,
    description: 'Ignition coil - product not in DB'
  },
  {
    id: 50,
    query: 'thermostat',
    expectedIntent: 'SEARCH',
    expectedProducts: 1,
    mustContain: ['THERMOSTAT'],
    description: 'Engine thermostat'
  }
];

async function runTest(test) {
  try {
    const response = await axios.post(`${BASE_URL}/chat/message`, {
      message: test.query,
      vehicle: VEHICLE
    }, {
      timeout: 10000
    });

    const { intent, products, metadata, message } = response.data;
    const productsFound = metadata?.productsFound || 0;
    
    let passed = true;
    let errors = [];

    // Check intent
    if (test.expectedIntent) {
      const expectedIntents = Array.isArray(test.expectedIntent) ? test.expectedIntent : [test.expectedIntent];
      if (!expectedIntents.includes(intent)) {
        passed = false;
        errors.push(`Intent mismatch: expected ${expectedIntents.join(' or ')}, got ${intent}`);
      }
    }

    // Check product count (skip if test has skipProductCount flag)
    if (!test.skipProductCount) {
      if (test.expectedProducts === 0 && productsFound > 0) {
        passed = false;
        errors.push(`Expected 0 products, got ${productsFound}`);
      } else if (test.expectedProducts > 0 && productsFound === 0) {
        passed = false;
        errors.push(`Expected products, got 0`);
      }
    }

    // Check mustContain
    if (test.mustContain && products && products.length > 0) {
      const designation = products[0].designation.toUpperCase();
      for (const keyword of test.mustContain) {
        if (!designation.includes(keyword.toUpperCase())) {
          passed = false;
          errors.push(`Missing keyword "${keyword}" in "${designation}"`);
        }
      }
    }

    // Check mustNotContain (word boundary check)
    if (test.mustNotContainWord && products && products.length > 0) {
      const designation = products[0].designation.toUpperCase();
      for (const keyword of test.mustNotContainWord) {
        const regex = new RegExp(`\\b${keyword.toUpperCase()}\\b`);
        if (regex.test(designation)) {
          passed = false;
          errors.push(`Should NOT contain word "${keyword}" in "${designation}"`);
        }
      }
    }

    // Check mustNotContain (substring check)
    if (test.mustNotContain && products && products.length > 0) {
      const designation = products[0].designation.toUpperCase();
      for (const keyword of test.mustNotContain) {
        if (designation.includes(keyword.toUpperCase())) {
          passed = false;
          errors.push(`Should NOT contain "${keyword}" in "${designation}"`);
        }
      }
    }

    return {
      passed,
      errors,
      intent,
      productsFound,
      firstProduct: products && products.length > 0 ? products[0].designation : null,
      aiResponse: message,
      allProducts: products ? products.slice(0, 3).map(p => p.designation) : []
    };

  } catch (error) {
    return {
      passed: false,
      errors: [`Request failed: ${error.message}`],
      intent: null,
      productsFound: 0,
      firstProduct: null,
      aiResponse: null,
      allProducts: []
    };
  }
}

async function runAllTests() {
  console.log(`${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BLUE}║     SUZUKI CHATBOT - AUTOMATED TEST SUITE                     ║${RESET}`);
  console.log(`${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}\n`);

  let passed = 0;
  let failed = 0;
  const failedTests = [];
  const passedTests = [];
  
  // Track failure reasons
  const failureStats = {
    intentMismatch: 0,
    productCountMismatch: 0,
    missingKeyword: 0,
    unwantedKeyword: 0,
    requestFailed: 0
  };

  for (const test of tests) {
    process.stdout.write(`Test ${test.id.toString().padStart(2, '0')}: ${test.description.padEnd(55, ' ')} `);
    
    const result = await runTest(test);
    
       if (result.passed) {
      console.log(`${GREEN}✓ PASS${RESET}`);
      // Show the first product and price snippet, or the clarification message
      if (result.firstProduct) {
        const priceSnip = result.aiResponse?.match(/Prix?:?\s*[\d.,]+\s*TND/) || [];
        console.log(`     ${BLUE}→ ${result.firstProduct}${priceSnip.length ? ' — ' + priceSnip[0] : ''}${RESET}`);
      } else if (result.aiResponse) {
        const short = result.aiResponse.replace(/\n/g, ' ').substring(0, 120);
        console.log(`     ${BLUE}→ ${short}...${RESET}`);
      }
      passed++;
      passedTests.push({ test, result });
    } else {
      console.log(`${RED}✗ FAIL${RESET}`);
      // existing failure handling...
      failedTests.push({ test, result });
      
      // Categorize failure reasons
      result.errors.forEach(err => {
        if (err.includes('Intent mismatch')) failureStats.intentMismatch++;
        else if (err.includes('Expected') && err.includes('products')) failureStats.productCountMismatch++;
        else if (err.includes('Missing keyword')) failureStats.missingKeyword++;
        else if (err.includes('Should NOT contain')) failureStats.unwantedKeyword++;
        else if (err.includes('Request failed')) failureStats.requestFailed++;
      });
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const passRate = ((passed / tests.length) * 100).toFixed(1);
  const failRate = ((failed / tests.length) * 100).toFixed(1);

  console.log(`\n${BLUE}═══════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${GREEN}Passed: ${passed} (${passRate}%)${RESET} | ${RED}Failed: ${failed} (${failRate}%)${RESET} | Total: ${tests.length}`);
  console.log(`${BLUE}═══════════════════════════════════════════════════════════════${RESET}\n`);

  // Failure diagnostics
  if (failed > 0) {
    console.log(`${YELLOW}📊 FAILURE DIAGNOSTICS:${RESET}\n`);
    console.log(`  ${RED}Intent Mismatch:${RESET}          ${failureStats.intentMismatch} failures`);
    console.log(`  ${RED}Product Count Wrong:${RESET}      ${failureStats.productCountMismatch} failures`);
    console.log(`  ${RED}Missing Keywords:${RESET}         ${failureStats.missingKeyword} failures`);
    console.log(`  ${RED}Unwanted Keywords:${RESET}        ${failureStats.unwantedKeyword} failures`);
    console.log(`  ${RED}Request Failures:${RESET}         ${failureStats.requestFailed} failures`);
    console.log(``);

    // Feature breakdown
    const featureBreakdown = {
      'Greeting/Conversation': { passed: 0, failed: 0 },
      'Basic Parts Search': { passed: 0, failed: 0 },
      'Typo Correction': { passed: 0, failed: 0 },
      'Tunisian Dialect': { passed: 0, failed: 0 },
      'Position/Side Detection': { passed: 0, failed: 0 },
      'Clarification Needed': { passed: 0, failed: 0 },
      'Reference Search': { passed: 0, failed: 0 },
      'Stop-word Filtering': { passed: 0, failed: 0 },
      'Category Distinction': { passed: 0, failed: 0 },
      'Service/Diagnostic': { passed: 0, failed: 0 }
    };

    const categorizeTest = (test) => {
      if ([1, 2, 22, 23].includes(test.id)) return 'Greeting/Conversation';
      if ([3, 7, 12, 19, 20, 24, 25, 27, 28, 31, 32, 33, 34, 35, 36, 37, 45, 46, 47, 48, 49, 50].includes(test.id)) return 'Basic Parts Search';
      if ([8, 9].includes(test.id)) return 'Typo Correction';
      if ([3, 10, 11].includes(test.id)) return 'Tunisian Dialect';
      if ([5, 16, 26, 38, 39, 40, 41, 43, 44].includes(test.id)) return 'Position/Side Detection';
      if ([6, 13, 14].includes(test.id)) return 'Clarification Needed';
      if ([17].includes(test.id)) return 'Reference Search';
      if ([16, 18].includes(test.id)) return 'Stop-word Filtering';
      if ([4, 9, 15, 29, 30, 33, 42, 44].includes(test.id)) return 'Category Distinction';
      if ([21, 23].includes(test.id)) return 'Service/Diagnostic';
      return 'Basic Parts Search';
    };

    [...passedTests, ...failedTests].forEach(({ test, result }) => {
      const category = categorizeTest(test);
      if (result.passed) {
        featureBreakdown[category].passed++;
      } else {
        featureBreakdown[category].failed++;
      }
    });

    console.log(`${YELLOW}🔍 FEATURE BREAKDOWN:${RESET}\n`);
    Object.entries(featureBreakdown).forEach(([feature, stats]) => {
      const total = stats.passed + stats.failed;
      if (total > 0) {
        const rate = ((stats.passed / total) * 100).toFixed(0);
        const status = stats.failed === 0 ? GREEN : (stats.passed > stats.failed ? YELLOW : RED);
        console.log(`  ${status}${feature.padEnd(25)}${RESET} ${GREEN}${stats.passed}${RESET}/${total} (${rate}%)`);
      }
    });
    console.log(``);
  }

  if (failedTests.length > 0) {
    console.log(`${RED}❌ FAILED TESTS DETAILS:${RESET}\n`);
    for (const { test, result } of failedTests) {
      console.log(`${RED}✗ Test ${test.id}: ${test.query}${RESET}`);
      console.log(`  Description: ${test.description}`);
      console.log(`  Intent: ${result.intent || 'N/A'}`);
      console.log(`  Products: ${result.productsFound}`);
      if (result.firstProduct) {
        console.log(`  First product: ${result.firstProduct}`);
      }
      if (result.allProducts.length > 0) {
        console.log(`  Top 3 products: ${result.allProducts.join(', ')}`);
      }
      if (result.aiResponse) {
        console.log(`  ${YELLOW}AI Response:${RESET}`);
        console.log(`    ${result.aiResponse}`);
      }
      console.log(`  Errors:`);
      result.errors.forEach(err => console.log(`    - ${err}`));
      console.log('');
    }
  }

  if (passed === tests.length) {
    console.log(`${GREEN}🎉 ALL TESTS PASSED! The chatbot is working perfectly!${RESET}\n`);
  } else {
    console.log(`${YELLOW}⚠️  ${failed} test(s) need attention. Review the diagnostics above.${RESET}\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error(`${RED}Fatal error: ${error.message}${RESET}`);
  process.exit(1);
});
