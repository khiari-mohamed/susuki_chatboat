const axios = require('axios');

// Test configuration
const API_BASE_URL = 'http://localhost:5000'; // Backend runs on port 5000
const TEST_VEHICLE = {
  marque: 'SUZUKI',
  modele: 'CELERIO',
  annee: 2021
};

// Comprehensive test cases covering all features
const TEST_CASES = [
  // 1. BASIC SEARCH FUNCTIONALITY
  {
    id: 'SEARCH_001',
    category: 'Basic Search',
    input: 'Je cherche des plaquettes de frein avant pour ma Celerio 2020',
    expectedFeatures: ['search', 'parts_found', 'french_response'],
    shouldFindParts: true,
    expectedIntent: 'SEARCH',
    description: 'Specific brake pad search'
  },
  {
    id: 'SEARCH_002',
    category: 'Basic Search',
    input: 'Filtre air Celerio',
    expectedFeatures: ['search', 'parts_found'],
    shouldFindParts: true,
    description: 'Air filter search'
  },
  {
    id: 'SEARCH_003',
    category: 'Basic Search',
    input: 'Amortisseur avant gauche',
    expectedFeatures: ['search', 'parts_found', 'position_detection'],
    shouldFindParts: true,
    description: 'Positional part search'
  },

  // 2. MULTILINGUAL UNDERSTANDING
  {
    id: 'LANG_001',
    category: 'Multilingual',
    input: 'Ken famma filtre air lel S-Presso? Choufli prix w stock',
    expectedFeatures: ['tunisian_understanding', 'parts_found', 'french_response'],
    shouldFindParts: true,
    expectedKeywords: ['filtre', 'air', 'prix', 'stock'],
    description: 'Tunisian Darija understanding'
  },
  {
    id: 'LANG_002',
    category: 'Multilingual',
    input: 'Do you have brake discs for Celerio? Show me price and availability',
    expectedFeatures: ['english_understanding', 'french_response'],
    shouldFindParts: true,
    description: 'English input, French response'
  },
  {
    id: 'LANG_003',
    category: 'Multilingual',
    input: 'n7ebk t3aweni',
    expectedFeatures: ['tunisian_understanding', 'french_response'],
    expectedIntent: 'GREETING',
    description: 'Tunisian help request'
  },

  // 3. DIAGNOSTIC CAPABILITIES
  {
    id: 'DIAG_001',
    category: 'Diagnostic',
    input: 'Ma voiture fait un bruit bizarre au freinage et le volant vibre',
    expectedFeatures: ['diagnostic_analysis', 'problem_identification', 'recommendations'],
    expectedKeywords: ['ANALYSE', 'CAUSES', 'RECOMMANDATIONS'],
    expectedIntent: 'DIAGNOSTIC',
    description: 'Brake noise diagnosis'
  },
  {
    id: 'DIAG_002',
    category: 'Diagnostic',
    input: 'Le moteur surchauffe, voyant température rouge',
    expectedFeatures: ['diagnostic_analysis', 'urgency_detection'],
    expectedKeywords: ['surchauffe', 'radiateur'],
    expectedIntent: 'DIAGNOSTIC',
    description: 'Engine overheating diagnosis'
  },
  {
    id: 'DIAG_003',
    category: 'Diagnostic',
    input: 'Voyant moteur allumé, perte de puissance, consommation excessive',
    expectedFeatures: ['diagnostic_analysis', 'multiple_symptoms'],
    expectedKeywords: ['capteur', 'diagnostic'],
    expectedIntent: 'DIAGNOSTIC',
    description: 'Complex engine problem'
  },

  // 4. INTENT DETECTION
  {
    id: 'INTENT_001',
    category: 'Intent Detection',
    input: 'Combien coûte un radiateur pour S-Presso 2021?',
    expectedFeatures: ['price_inquiry'],
    expectedIntent: 'PRICE_INQUIRY',
    description: 'Price inquiry intent'
  },
  {
    id: 'INTENT_002',
    category: 'Intent Detection',
    input: 'Est-ce que vous avez des amortisseurs arrière en stock?',
    expectedFeatures: ['stock_check'],
    expectedIntent: 'STOCK_CHECK',
    description: 'Stock check intent'
  },
  {
    id: 'INTENT_003',
    category: 'Intent Detection',
    input: 'Bonjour, j\'ai besoin d\'aide',
    expectedFeatures: ['greeting'],
    expectedIntent: 'GREETING',
    description: 'Greeting intent'
  },
  {
    id: 'INTENT_004',
    category: 'Intent Detection',
    input: 'Merci beaucoup pour votre aide',
    expectedFeatures: ['thanks'],
    expectedIntent: 'THANKS',
    description: 'Thanks intent'
  },
  {
    id: 'INTENT_005',
    category: 'Intent Detection',
    input: 'Pas content, la pièce était défectueuse',
    expectedFeatures: ['complaint'],
    expectedIntent: 'COMPLAINT',
    description: 'Complaint intent'
  },

  // 5. TYPO HANDLING & FUZZY SEARCH
  {
    id: 'TYPO_001',
    category: 'Typo Handling',
    input: 'filtere air celirio avent',
    expectedFeatures: ['typo_correction', 'parts_found'],
    shouldFindParts: true,
    description: 'Multiple typos correction'
  },
  {
    id: 'TYPO_002',
    category: 'Typo Handling',
    input: 'plakette frain',
    expectedFeatures: ['typo_correction', 'parts_found'],
    shouldFindParts: true,
    description: 'Brake pad typos'
  },

  // 6. REFERENCE SEARCH
  {
    id: 'REF_001',
    category: 'Reference Search',
    input: 'Référence 13780M62S00',
    expectedFeatures: ['reference_search', 'exact_match'],
    shouldFindParts: true,
    expectedConfidence: 'HIGH',
    description: 'Exact reference search'
  },
  {
    id: 'REF_002',
    category: 'Reference Search',
    input: '55810M62S10',
    expectedFeatures: ['reference_search'],
    shouldFindParts: true,
    description: 'Reference without prefix'
  },

  // 7. CONFIDENCE SCORING
  {
    id: 'CONF_001',
    category: 'Confidence Scoring',
    input: 'Quelque chose pour le moteur, je ne sais pas exactement',
    expectedFeatures: ['low_confidence', 'clarification_request'],
    expectedConfidence: 'LOW',
    description: 'Vague query - low confidence'
  },
  {
    id: 'CONF_002',
    category: 'Confidence Scoring',
    input: 'Disque de frein avant droit Celerio 2020 référence 55311M66R00',
    expectedFeatures: ['high_confidence', 'specific_search'],
    expectedConfidence: 'HIGH',
    shouldFindParts: true,
    description: 'Very specific query - high confidence'
  },

  // 8. SMART SUGGESTIONS
  {
    id: 'SUGG_001',
    category: 'Smart Suggestions',
    input: 'Plaquettes de frein',
    expectedFeatures: ['smart_suggestions', 'related_parts'],
    description: 'Brake pad suggestions'
  },
  {
    id: 'SUGG_002',
    category: 'Smart Suggestions',
    input: 'Batterie',
    expectedFeatures: ['smart_suggestions'],
    description: 'Battery related suggestions'
  },

  // 9. MAINTENANCE RECOMMENDATIONS
  {
    id: 'MAINT_001',
    category: 'Maintenance',
    input: 'Ma voiture a 80000 km, que dois-je changer?',
    expectedFeatures: ['maintenance_advice', 'multiple_recommendations'],
    expectedKeywords: ['entretien', 'filtre'],
    description: 'Maintenance at 80k km'
  },

  // 10. EDGE CASES
  {
    id: 'EDGE_001',
    category: 'Edge Cases',
    input: '',
    expectedFeatures: ['empty_input_handling'],
    description: 'Empty input'
  },
  {
    id: 'EDGE_002',
    category: 'Edge Cases',
    input: 'asdfghjkl',
    expectedFeatures: ['gibberish_handling'],
    description: 'Gibberish input'
  }
];

// Feature evaluation functions
const FEATURE_CHECKS = {
  search: (response) => response.products && response.products.length > 0,
  parts_found: (response) => response.products && response.products.length > 0,
  french_response: (response) => /voici|référence|prix|stock|disponible/i.test(response.response),
  tunisian_understanding: (input, response) => /ken|famma|choufli|n7eb|t3aweni/i.test(input) && response.response.length > 0,
  english_understanding: (input) => /do you have|show me|price|availability/i.test(input),
  diagnostic_analysis: (response) => /ANALYSE|🔍/i.test(response.response),
  problem_identification: (response) => /CAUSES PROBABLES/i.test(response.response),
  recommendations: (response) => /RECOMMANDATIONS/i.test(response.response),
  price_inquiry: (response) => response.intent === 'PRICE_INQUIRY',
  stock_check: (response) => response.intent === 'STOCK_CHECK',
  greeting: (response) => response.intent === 'GREETING',
  thanks: (response) => response.intent === 'THANKS',
  complaint: (response) => response.intent === 'COMPLAINT',
  typo_correction: (response) => response.products && response.products.length > 0,
  reference_search: (input, response) => /[A-Z0-9]{5,}/i.test(input) && response.products && response.products.length > 0,
  position_detection: (input, response) => /avant|arrière|gauche|droite/i.test(input) && response.products && response.products.length > 0,
  low_confidence: (response) => response.confidence === 'LOW',
  high_confidence: (response) => response.confidence === 'HIGH',
  smart_suggestions: (response) => response.suggestions && response.suggestions.length > 0,
  maintenance_advice: (response) => /entretien|maintenance/i.test(response.response),
  multiple_recommendations: (response) => (response.response.match(/🔹/g) || []).length > 3,
  empty_input_handling: (response) => response.response.length > 0,
  gibberish_handling: (response) => /comprendre|préciser/i.test(response.response),
  urgency_detection: (response) => /URGENT/i.test(response.response),
  multiple_symptoms: (response) => /plusieurs/i.test(response.response),
  exact_match: (response) => response.confidence === 'HIGH',
  related_parts: (response) => response.suggestions && response.suggestions.length > 0,
  clarification_request: (response) => response.response.includes('?'),
  specific_search: (response) => response.products && response.products.length > 0
};

// Main testing function
async function testChatbot() {
  console.log('🤖 COMPREHENSIVE CHATBOT TEST SUITE');
  console.log('=' .repeat(60));
  console.log(`Testing ${TEST_CASES.length} features...\n`);

  const results = [];
  let sessionId = null;
  let testNumber = 1;

  for (const testCase of TEST_CASES) {
    console.log(`[${testNumber}/${TEST_CASES.length}] Testing: ${testCase.description}`);
    
    const startTime = Date.now();
    
    try {
      // Make API call to chatbot
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message: testCase.input,
        vehicle: TEST_VEHICLE,
        sessionId: sessionId
      }, {
        timeout: 30000 // 30 second timeout
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (!sessionId) sessionId = response.data.sessionId;
      
      // Evaluate the response
      const evaluation = evaluateResponse(testCase, response.data, responseTime);
      results.push(evaluation);
      
      console.log(`   ${evaluation.passed ? '✅ PASSED' : '❌ FAILED'} - Score: ${evaluation.score}%`);
      if (evaluation.issues.length > 0) {
        console.log(`   Issues: ${evaluation.issues.join(', ')}`);
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.log(`   ❌ ERROR: ${errorMsg}`);
      results.push({
        testId: testCase.id,
        category: testCase.category,
        input: testCase.input,
        passed: false,
        score: 0,
        responseTime: 0,
        issues: [`API Error: ${errorMsg}`]
      });
    }
    
    testNumber++;
    
    // CRITICAL: Add delay between tests to avoid Gemini API rate limits (429 errors)
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
    console.log('');
  }

  // Generate and display report
  displayReport(results);
}

function evaluateResponse(testCase, response, responseTime) {
  const issues = [];
  let score = 0;
  const maxScore = 100;

  // Check expected features
  testCase.expectedFeatures.forEach(feature => {
    const checker = FEATURE_CHECKS[feature];
    if (checker && checker(testCase.input, response)) {
      score += Math.floor(maxScore / testCase.expectedFeatures.length);
    } else {
      issues.push(`Missing feature: ${feature}`);
    }
  });

  // Check intent if specified
  if (testCase.expectedIntent && response.intent !== testCase.expectedIntent) {
    issues.push(`Expected intent: ${testCase.expectedIntent}, got: ${response.intent}`);
    score -= 10;
  }

  // Check confidence if specified
  if (testCase.expectedConfidence && response.confidence !== testCase.expectedConfidence) {
    issues.push(`Expected confidence: ${testCase.expectedConfidence}, got: ${response.confidence}`);
    score -= 10;
  }

  // Check if parts should be found
  if (testCase.shouldFindParts && (!response.products || response.products.length === 0)) {
    issues.push('Expected to find parts but none found');
    score -= 20;
  }

  // Check for expected keywords
  if (testCase.expectedKeywords) {
    const missingKeywords = testCase.expectedKeywords.filter(keyword => 
      !response.response.toLowerCase().includes(keyword.toLowerCase())
    );
    if (missingKeywords.length > 0) {
      issues.push(`Missing keywords: ${missingKeywords.join(', ')}`);
      score -= missingKeywords.length * 5;
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    testId: testCase.id,
    category: testCase.category,
    input: testCase.input,
    response: response.response,
    passed: score >= 70 && issues.length === 0,
    score,
    responseTime,
    foundParts: response.products ? response.products.length : 0,
    intent: response.intent || 'UNKNOWN',
    confidence: response.confidence || 'UNKNOWN',
    suggestions: response.suggestions ? response.suggestions.length : 0,
    issues
  };
}

function displayReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(80));

  // Overall summary
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const overallAccuracy = Math.round((passedTests / totalTests) * 100);
  const avgResponseTime = Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests);
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalTests);

  console.log('\n🎯 OVERALL SUMMARY:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed Tests: ${passedTests}`);
  console.log(`Overall Accuracy: ${overallAccuracy}%`);
  console.log(`Average Score: ${avgScore}%`);
  console.log(`Average Response Time: ${avgResponseTime}ms`);

  // Category breakdown
  const categories = [...new Set(results.map(r => r.category))];
  console.log('\n📈 CATEGORY RESULTS:');
  categories.forEach(category => {
    const categoryTests = results.filter(r => r.category === category);
    const categoryPassed = categoryTests.filter(r => r.passed).length;
    const categoryAccuracy = Math.round((categoryPassed / categoryTests.length) * 100);
    const categoryAvgScore = Math.round(categoryTests.reduce((sum, r) => sum + r.score, 0) / categoryTests.length);
    
    console.log(`${category}: ${categoryAccuracy}% (${categoryPassed}/${categoryTests.length}) - Avg Score: ${categoryAvgScore}%`);
  });

  // Feature accuracy
  const allFeatures = [...new Set(TEST_CASES.flatMap(tc => tc.expectedFeatures))];
  console.log('\n🎯 FEATURE ACCURACY:');
  allFeatures.forEach(feature => {
    const featureTests = results.filter(r => 
      TEST_CASES.find(tc => tc.id === r.testId)?.expectedFeatures.includes(feature)
    );
    const featurePassed = featureTests.filter(r => r.passed).length;
    const featureAccuracy = Math.round((featurePassed / featureTests.length) * 100);
    console.log(`${feature}: ${featureAccuracy}%`);
  });

  // Failed tests details
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failedTests.forEach(test => {
      console.log(`\n${test.testId} (${test.category}) - Score: ${test.score}%`);
      console.log(`Input: "${test.input}"`);
      console.log(`Issues: ${test.issues.join(', ')}`);
    });
  }

  // Performance metrics
  console.log('\n⚡ PERFORMANCE METRICS:');
  console.log(`Parts Found: ${results.reduce((sum, r) => sum + r.foundParts, 0)} total`);
  console.log(`Suggestions Generated: ${results.reduce((sum, r) => sum + r.suggestions, 0)} total`);
  console.log(`Intent Detection: ${results.filter(r => r.intent !== 'UNKNOWN').length}/${totalTests} successful`);

  console.log('\n' + '='.repeat(80));
  console.log(`🎉 Testing Complete! Overall Grade: ${getGrade(overallAccuracy)}`);
}

function getGrade(accuracy) {
  if (accuracy >= 95) return 'A+ (Excellent)';
  if (accuracy >= 90) return 'A (Very Good)';
  if (accuracy >= 80) return 'B (Good)';
  if (accuracy >= 70) return 'C (Acceptable)';
  if (accuracy >= 60) return 'D (Needs Improvement)';
  return 'F (Poor)';
}

// Run the tests
console.log('🚀 Starting Chatbot Test Suite...\n');
console.log('Make sure your Suzuki backend server is running on http://localhost:3000\n');

testChatbot().catch(error => {
  console.error('❌ Test suite failed:', error.message);
  console.log('\n💡 Make sure:');
  console.log('1. Your backend server is running');
  console.log('2. The API endpoint is accessible');
  console.log('3. Database is connected');
  process.exit(1);
});