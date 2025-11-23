const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'CELERIO',
  annee: '2021',
  immatriculation: 'TU-123-456'
};

// Test cases - ONLY FAILED TESTS for focused debugging
const TEST_CASES = [
  // ===== FAILED: Radiator clarification =====
  {
    name: 'Formal French - Radiator',
    message: 'Combien coûte un radiateur pour S-Presso 2021?',
    expectedKeywords: ['radiateur'],
    expectedLanguage: 'french',
    shouldFindParts: true,
    shouldAskClarification: true // Should ask: cooling or heating radiator?
  },
  
  // ===== FAILED: Cabin filter (not in DB but returns parts) =====
  {
    name: 'Formal French - Cabin filter',
    message: 'Filtre habitacle',
    expectedKeywords: ['filtre', 'habitacle'],
    expectedLanguage: 'french',
    shouldFindParts: false // Not in database - should say not available
  },

  // ===== FAILED: English brake discs (returns wrong parts) =====
  {
    name: 'English - Brake discs',
    message: 'Do you have brake discs for Celerio? Show me price and availability',
    expectedKeywords: ['disque', 'frein'],
    expectedLanguage: 'french',
    shouldFindParts: true,
    shouldUnderstandEnglish: true
  },

  // ===== FAILED: Invalid reference =====
  {
    name: 'Reference search - Invalid',
    message: 'Référence FA-17220-M68K00',
    expectedKeywords: [],  // Changed: no keywords expected when part not found
    expectedLanguage: 'french',
    shouldFindParts: false
  },

  // ===== FAILED: Contextual follow-up (returns door joints instead of rear brakes) =====
  {
    name: 'Contextual - Follow-up rear',
    message: 'Et pour l\'arrière aussi?',
    expectedKeywords: ['frein', 'arrière'],  // Should maintain brake context
    expectedLanguage: 'french',
    shouldFindParts: true,
    requiresContext: true,
    previousMessage: 'Plaquettes de frein avant'
  },

  // ===== FAILED: Diagnostic queries (no diagnostic provided) =====
  {
    name: 'Diagnostic - Brake noise',
    message: 'Ma voiture fait un bruit bizarre au freinage et le volant vibre',
    expectedKeywords: ['analyse', 'causes', 'recommandations'],  // Should provide diagnostic
    expectedLanguage: 'french',
    shouldFindParts: true,
    shouldProvideDiagnostic: true
  },
  {
    name: 'Diagnostic - Engine warning light',
    message: 'Voyant moteur allumé, perte de puissance, consommation excessive',
    expectedKeywords: ['analyse', 'diagnostic'],
    expectedLanguage: 'french',
    shouldFindParts: true,
    shouldProvideDiagnostic: true
  },
  {
    name: 'Diagnostic - Maintenance',
    message: 'Ma voiture a 80000 km, que dois-je changer?',
    expectedKeywords: ['vidange', 'filtre', 'entretien'],  // Should recommend maintenance items
    expectedLanguage: 'french',
    shouldFindParts: true,
    shouldProvideDiagnostic: true
  },

  // ===== FAILED: Vague query (should ask for clarification) =====
  {
    name: 'Vague - Something for engine',
    message: 'Quelque chose pour le moteur, je ne sais pas exactement',
    expectedKeywords: [],  // No specific keywords expected
    expectedLanguage: 'french',
    shouldFindParts: false,
    shouldAskClarification: true  // Should ask what specifically they need
  },

  // ===== FAILED: Greetings (should not return parts) =====
  {
    name: 'Greeting',
    message: 'Bonjour, j\'ai besoin d\'aide',
    expectedKeywords: [],
    expectedLanguage: 'french',
    shouldFindParts: false,
    isGreeting: true
  },
  {
    name: 'Thanks',
    message: 'Merci beaucoup pour votre aide',
    expectedKeywords: [],
    expectedLanguage: 'french',
    shouldFindParts: false,
    isThanks: true
  },

  {
    name: 'Complaint',
    message: 'Pas content, la pièce était défectueuse',
    expectedKeywords: [],
    expectedLanguage: 'french',
    shouldFindParts: false,
    isComplaint: true
  }
];

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Helper functions
function isResponseInFrench(response) {
  if (!response || typeof response !== 'string') return false;
  
  // Enhanced French detection with more indicators
  const frenchIndicators = [
    'voici', 'référence', 'désignation', 'prix', 'stock', 'disponible', 'bonjour', 'merci', 'désolé',
    'pour', 'votre', 'suzuki', 'trouvé', 'pièce', 'pièces', 'contactez', 'service', 'client',
    'malheureusement', 'invite', 'contacter', 'carpro', 'préciser', 'pouvez', 'vous',
    'radiateur', 'refroidissement', 'chauffage', 'habitacle', 'moteur', 'bien', 'sûr',
    'filtre', 'air', 'carburant', 'huile', 'cabine', 'pollen', 'climatisation',
    'frein', 'plaquettes', 'disques', 'avant', 'arrière', 'étriers', 'tambours',
    'amortisseur', 'suspension', 'ressort', 'triangle', 'rotule', 'biellette',
    'optique', 'phare', 'feu', 'ampoule', 'éclairage', 'clignotant',
    'batterie', 'alternateur', 'démarreur', 'capteur', 'faisceau',
    'courroie', 'distribution', 'pompe', 'eau', 'thermostat', 'radiateur',
    'embrayage', 'volant', 'butée', 'joint', 'soupape', 'piston',
    'échappement', 'silencieux', 'catalyseur', 'pot', 'ligne',
    'injection', 'injecteur', 'carburateur', 'papillon', 'admission',
    'réservoir', 'bouchon', 'pompe', 'essence', 'gasoil', 'diesel',
    'vitre', 'lève', 'porte', 'portière', 'rétroviseur', 'miroir',
    'direction', 'crémaillère', 'cardan', 'transmission', 'roulement',
    'chez', 'dans', 'avec', 'sans', 'mais', 'donc', 'ainsi', 'alors',
    'cependant', 'néanmoins', 'toutefois', 'enfin', 'ensuite', 'puis',
    'également', 'aussi', 'encore', 'déjà', 'toujours', 'jamais',
    'peut', 'être', 'avoir', 'faire', 'aller', 'venir', 'voir', 'savoir',
    'vouloir', 'pouvoir', 'devoir', 'falloir', 'prendre', 'donner',
    'mettre', 'dire', 'partir', 'passer', 'rester', 'devenir',
    'tenir', 'porter', 'suivre', 'vivre', 'mourir', 'naître',
    'comprendre', 'apprendre', 'connaître', 'reconnaître', 'paraître',
    'apparaître', 'disparaître', 'reparaître', 'comparaître',
    'cette', 'celui', 'celle', 'ceux', 'celles', 'lequel', 'laquelle',
    'lesquels', 'lesquelles', 'dont', 'où', 'que', 'qui', 'quoi',
    'comment', 'pourquoi', 'quand', 'combien', 'quel', 'quelle',
    'quels', 'quelles', 'chaque', 'tout', 'tous', 'toute', 'toutes',
    'autre', 'autres', 'même', 'mêmes', 'tel', 'telle', 'tels', 'telles'
  ];
  
  // English indicators that should NOT be present in French responses
  const englishIndicators = [
    'brake', 'disc', 'pad', 'filter', 'air', 'oil', 'fuel', 'cabin',
    'engine', 'motor', 'transmission', 'suspension', 'shock', 'absorber',
    'light', 'headlight', 'bulb', 'battery', 'alternator', 'starter',
    'belt', 'pump', 'water', 'thermostat', 'radiator', 'clutch',
    'flywheel', 'bearing', 'gasket', 'valve', 'piston', 'exhaust',
    'muffler', 'catalytic', 'injection', 'injector', 'carburetor',
    'throttle', 'intake', 'tank', 'fuel', 'gasoline', 'diesel',
    'window', 'door', 'mirror', 'steering', 'rack', 'driveshaft',
    'the', 'and', 'or', 'but', 'so', 'then', 'now', 'here', 'there',
    'this', 'that', 'these', 'those', 'what', 'when', 'where', 'why',
    'how', 'which', 'who', 'whom', 'whose', 'each', 'every', 'all',
    'some', 'any', 'many', 'much', 'few', 'little', 'more', 'most',
    'less', 'least', 'other', 'another', 'same', 'different', 'such',
    'can', 'could', 'may', 'might', 'will', 'would', 'shall', 'should',
    'must', 'ought', 'need', 'dare', 'used', 'have', 'has', 'had',
    'do', 'does', 'did', 'be', 'am', 'is', 'are', 'was', 'were',
    'been', 'being', 'get', 'got', 'gotten', 'go', 'goes', 'went',
    'gone', 'going', 'come', 'comes', 'came', 'coming', 'see', 'sees',
    'saw', 'seen', 'seeing', 'know', 'knows', 'knew', 'known', 'knowing'
  ];
  
  const responseLower = response.toLowerCase();
  
  // Count French indicators
  const frenchCount = frenchIndicators.filter(indicator => 
    responseLower.includes(indicator)
  ).length;
  
  // Count English indicators (should be minimal)
  const englishCount = englishIndicators.filter(indicator => 
    responseLower.includes(indicator)
  ).length;
  
  // Response is French if:
  // 1. Has at least 2 French indicators AND English count is less than French count
  // 2. OR has at least 5 French indicators regardless of English count
  return (frenchCount >= 2 && englishCount < frenchCount) || frenchCount >= 5;
}

function hasPartsInResponse(responseData) {
  return responseData && responseData.products && Array.isArray(responseData.products) && responseData.products.length > 0;
}

function asksClarification(response) {
  if (!response || typeof response !== 'string') return false;
  const clarificationIndicators = ['?', 'quel', 'quelle', 'avez-vous besoin', 'préciser', 'clarifier'];
  const responseLower = response.toLowerCase();
  return clarificationIndicators.some(indicator => responseLower.includes(indicator));
}

function providesDiagnostic(response) {
  if (!response || typeof response !== 'string') return false;
  const diagnosticIndicators = ['analyse', 'causes probables', 'recommandations', 'urgent', 'important', 'préventif', 'diagnostic'];
  const responseLower = response.toLowerCase();
  return diagnosticIndicators.some(indicator => responseLower.includes(indicator));
}

function hasKeywords(response, keywords) {
  if (!response || typeof response !== 'string' || !Array.isArray(keywords)) return false;
  if (keywords.length === 0) return true;
  const responseLower = response.toLowerCase();
  return keywords.some(keyword => responseLower.includes(keyword.toLowerCase()));
}

// Run a single test
async function runTest(testCase, sessionId = null) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Message: "${testCase.message}"`);
  
  try {
    const payload = {
      message: testCase.message,
      vehicle: VEHICLE
    };
    
    if (sessionId) {
      payload.sessionId = sessionId;
    }
    
    const response = await axios.post(API_URL, payload);
    const data = response.data;
    
    // Validation checks
    const checks = {
      responseInFrench: isResponseInFrench(data.response),
      hasExpectedKeywords: hasKeywords(data.response, testCase.expectedKeywords || []),
      hasPartsWhenExpected: testCase.shouldFindParts ? hasPartsInResponse(data) : true,
      noPartsWhenNotExpected: !testCase.shouldFindParts ? !hasPartsInResponse(data) : true,
      asksClarificationWhenNeeded: testCase.shouldAskClarification ? asksClarification(data.response) : true,
      providesDiagnosticWhenNeeded: testCase.shouldProvideDiagnostic ? providesDiagnostic(data.response) : true
    };
    
    const allChecksPassed = Object.values(checks).every(check => check === true);
    
    // Log results
    if (allChecksPassed) {
      console.log('✅ PASSED');
      results.passed++;
    } else {
      console.log('❌ FAILED');
      results.failed++;
      console.log('Failed checks:', Object.entries(checks).filter(([k, v]) => !v).map(([k]) => k));
    }
    
    // Log response details
    console.log(`📊 Response Language: ${checks.responseInFrench ? 'French ✓' : 'Not French ✗'}`);
    console.log(`📦 Parts Found: ${data.products?.length || 0}`);
    console.log(`🎯 Intent: ${data.intent || 'N/A'}`);
    console.log(`📈 Confidence: ${data.confidence || 'N/A'}`);
    console.log(`💬 Response Preview: ${data.response?.substring(0, 150)}...`);
    
    results.details.push({
      name: testCase.name,
      passed: allChecksPassed,
      checks,
      response: data.response,
      productsFound: data.products?.length || 0,
      intent: data.intent,
      confidence: data.confidence
    });
    
    results.total++;
    return data.sessionId;
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    results.failed++;
    results.total++;
    results.details.push({
      name: testCase.name,
      passed: false,
      error: error.message
    });
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 STARTING CHATBOT COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(80));
  
  let currentSessionId = null;
  
  for (const testCase of TEST_CASES) {
    // Use previous session for contextual queries
    if (testCase.requiresContext && testCase.previousMessage) {
      // First send the previous message to establish context
      console.log(`\n📌 Establishing context with: "${testCase.previousMessage}"`);
      currentSessionId = await runTest({ 
        name: 'Context Setup', 
        message: testCase.previousMessage,
        expectedKeywords: [],
        shouldFindParts: true
      }, currentSessionId);
      
      // Small delay to ensure context is saved
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Run the actual test
    currentSessionId = await runTest(testCase, testCase.requiresContext ? currentSessionId : null);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed} (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failed} (${((results.failed / results.total) * 100).toFixed(1)}%)`);
  
  // Group results by category
  console.log('\n📋 RESULTS BY CATEGORY:');
  
  const categories = {
    'Formal French': TEST_CASES.filter(t => t.name.startsWith('Formal French')),
    'Tunisian Darija': TEST_CASES.filter(t => t.name.startsWith('Tunisian Darija')),
    'English': TEST_CASES.filter(t => t.name.startsWith('English')),
    'Typos': TEST_CASES.filter(t => t.name.startsWith('Typo')),
    'Reference Search': TEST_CASES.filter(t => t.name.startsWith('Reference')),
    'Contextual': TEST_CASES.filter(t => t.name.startsWith('Contextual')),
    'Diagnostic': TEST_CASES.filter(t => t.name.startsWith('Diagnostic')),
    'Vague Queries': TEST_CASES.filter(t => t.name.startsWith('Vague')),
    'Greetings/Politeness': TEST_CASES.filter(t => t.isGreeting || t.isThanks),
    'Complaints': TEST_CASES.filter(t => t.isComplaint),
    'Stock Check': TEST_CASES.filter(t => t.name.startsWith('Stock check'))
  };
  
  for (const [category, tests] of Object.entries(categories)) {
    if (tests.length === 0) continue;
    const categoryResults = results.details.filter(r => tests.some(t => t.name === r.name));
    const passed = categoryResults.filter(r => r.passed).length;
    const total = categoryResults.length;
    const percentage = ((passed / total) * 100).toFixed(1);
    console.log(`  ${category}: ${passed}/${total} (${percentage}%)`);
  }
  
  // List failed tests
  const failedTests = results.details.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failedTests.forEach(test => {
      console.log(`  • ${test.name}`);
      if (test.error) {
        console.log(`    Error: ${test.error}`);
      } else if (test.checks) {
        const failedChecks = Object.entries(test.checks).filter(([k, v]) => !v).map(([k]) => k);
        console.log(`    Failed: ${failedChecks.join(', ')}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ TEST SUITE COMPLETED');
  console.log('='.repeat(80) + '\n');
}

// Main execution
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('\n💥 Fatal error running tests:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, runTest, TEST_CASES };
