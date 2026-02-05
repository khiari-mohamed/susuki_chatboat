const axios = require('axios');
require('dotenv').config();

class ChatbotTester {
  constructor() {
    this.baseURL = process.env.CHATBOT_URL || 'http://localhost:8000';
    this.sessionId = null;
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    
    // Test vehicle (Suzuki Celerio 2021)
    this.vehicle = {
      marque: 'SUZUKI',
      modele: 'CELERIO',
      annee: 2021,
      immatriculation: '223TU3730'
    };
  }

  async initialize() {
    try {
      const response = await axios.post(`${this.baseURL}/chat/start`, {
        vehicle: this.vehicle
      });
      this.sessionId = response.data.sessionId;
      console.log(`✅ Session initialized: ${this.sessionId}`);
    } catch (error) {
      console.error('❌ Failed to initialize session:', error.message);
      process.exit(1);
    }
  }

  async sendMessage(message, category) {
    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${this.baseURL}/chat/process`, {
        message,
        sessionId: this.sessionId,
        vehicle: this.vehicle
      });
      
      const duration = Date.now() - startTime;
      const botResponse = response.data.response;
      
      return {
        success: true,
        message,
        botResponse,
        duration,
        category,
        data: response.data
      };
    } catch (error) {
      console.error(`❌ Error sending message: ${message}`, error.message);
      return {
        success: false,
        message,
        error: error.message,
        category
      };
    }
  }

  validateResponse(result, category, testName) {
    const { message, botResponse, data } = result;
    let passed = false;
    let validationMessage = '';

    // Category-specific validations
    switch(category) {
      case 'tunisian_dialect':
        passed = !botResponse.toLowerCase().includes('je ne comprends pas');
        validationMessage = passed ? 'Understood Tunisian dialect' : 'Failed to understand Tunisian';
        break;

      case 'clarification_needed':
        const hasPositionQuestion = botResponse.includes('position') || 
                                   botResponse.includes('avant') || 
                                   botResponse.includes('arrière');
        const hasSideQuestion = botResponse.includes('côté') || 
                              botResponse.includes('gauche') || 
                              botResponse.includes('droite');
        passed = hasPositionQuestion || hasSideQuestion;
        validationMessage = passed ? 'Correctly asked for clarification' : 'Missing clarification question';
        break;

      case 'clarification_not_needed':
        const hasNoQuestion = !botResponse.includes('?') && 
                             !botResponse.includes('préciser') &&
                             !botResponse.includes('position') &&
                             !botResponse.includes('côté');
        passed = hasNoQuestion;
        validationMessage = passed ? 'Correctly showed product directly' : 'Unnecessary clarification';
        break;

      case 'reference_search':
        const hasReference = botResponse.includes('41800') || 
                            botResponse.includes('13780') || 
                            botResponse.includes('Réf:');
        passed = hasReference;
        validationMessage = passed ? 'Correctly handled reference' : 'Failed reference search';
        break;

      case 'price_display_available':
        const hasPrice = botResponse.includes('TND') || botResponse.includes('DT');
        const hasProduct = botResponse.includes('PRODUITS') || 
                          botResponse.includes('disponible');
        passed = hasPrice && hasProduct;
        validationMessage = passed ? 'Correctly showed price for available product' : 'Missing price for available product';
        break;

      case 'price_display_unavailable':
        const noPrice = !botResponse.includes('TND') && !botResponse.includes('DT');
        const showsUnavailable = botResponse.includes('non disponible') || 
                                botResponse.includes('pas disponible') ||
                                botResponse.includes('indisponible');
        passed = noPrice && showsUnavailable;
        validationMessage = passed ? 'Correctly hid price for unavailable product' : 'Should not show price for unavailable';
        break;

      case 'diagnostic_redirect':
        const hasCarPro = botResponse.includes('CarPro') || 
                         botResponse.includes('70 603 500');
        passed = hasCarPro;
        validationMessage = passed ? 'Correctly redirected to CarPro' : 'Missing CarPro redirect';
        break;

      case 'formal_french':
        const isFormal = botResponse.includes('Bonjour') && 
                        !botResponse.includes('ahla') &&
                        !botResponse.includes('ya khoya') &&
                        !botResponse.includes('barcha');
        passed = isFormal;
        validationMessage = passed ? 'Formal French maintained' : 'Informal language detected';
        break;

      case 'error_handling':
        passed = botResponse && botResponse.length > 0;
        validationMessage = passed ? 'Handled error gracefully' : 'Failed error handling';
        break;

      default:
        passed = botResponse && botResponse.length > 0;
        validationMessage = 'Basic response check';
    }

    // Additional universal checks
    if (passed) {
      // Check for multiple prices without clarification (CRITICAL BUG)
      const priceMatches = (botResponse.match(/TND|DT/g) || []).length;
      if (priceMatches > 1 && category !== 'contextual') {
        const hasClarification = botResponse.includes('préciser') || 
                               botResponse.includes('position') || 
                               botResponse.includes('côté');
        if (!hasClarification) {
          passed = false;
          validationMessage = 'CRITICAL: Multiple prices without clarification';
        }
      }
    }

    return {
      testName,
      category,
      userMessage: message,
      passed,
      validationMessage,
      duration: result.duration,
      confidence: data?.confidence || 'N/A'
    };
  }

  async runTest(testCase) {
    const { category, message, name } = testCase;
    
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`📝 User: "${message}"`);
    
    const result = await this.sendMessage(message, category);
    
    if (!result.success) {
      this.results.failed++;
      this.results.details.push({
        test: name,
        status: 'FAILED',
        error: result.error
      });
      console.log(`❌ Failed: ${result.error}`);
      return;
    }
    
    const validation = this.validateResponse(result, category, name);
    
    if (validation.passed) {
      this.results.passed++;
      console.log(`✅ PASSED: ${validation.validationMessage}`);
      console.log(`   ⏱️  Response time: ${validation.duration}ms`);
      console.log(`   🎯 Confidence: ${validation.confidence}`);
    } else {
      this.results.failed++;
      console.log(`❌ FAILED: ${validation.validationMessage}`);
      console.log(`   🤖 Bot response: ${result.botResponse.substring(0, 200)}...`);
    }
    
    this.results.details.push(validation);
    this.results.total++;
    
    // Small delay between tests to avoid rate limiting
    await this.sleep(500);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n🔍 FAILED TESTS:');
      this.results.details
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`\n❌ ${test.testName}`);
          console.log(`   Category: ${test.category}`);
          console.log(`   Message: "${test.userMessage}"`);
          console.log(`   Reason: ${test.validationMessage}`);
        });
    }
    
    // Critical checks
    console.log('\n🚨 CRITICAL CHECKS:');
    const multiplePriceBug = this.results.details.some(test => 
      test.validationMessage.includes('Multiple prices without clarification')
    );
    const priceForUnavailable = this.results.details.some(test =>
      test.validationMessage.includes('Should not show price for unavailable')
    );
    
    console.log(multiplePriceBug ? '❌ CRITICAL BUG: Multiple prices without clarification' : '✅ No multiple price bug');
    console.log(priceForUnavailable ? '❌ CRITICAL BUG: Price shown for unavailable' : '✅ Price policy enforced');
    
    console.log('\n' + '='.repeat(60));
  }
}

// ==================== TEST SUITE ====================

const testSuite = [
  // Category 1: Tunisian Dialect
  { category: 'tunisian_dialect', name: 'Tunisian: n7eb filter', message: 'n7eb 3la filter air' },
  { category: 'tunisian_dialect', name: 'Tunisian: famma chaqement', message: 'famma chaqement mte3 celerio' },
  { category: 'tunisian_dialect', name: 'Tunisian: choufli prix', message: 'choufli prix plaquette frain' },
  
  // Category 2: Clarification Needed
  { category: 'clarification_needed', name: 'Clarify: amortisseur', message: 'amortisseur' },
  { category: 'clarification_needed', name: 'Clarify: feu', message: 'feu' },
  { category: 'clarification_needed', name: 'Clarify: aile', message: 'aile' },
  
  // Category 3: Clarification NOT Needed (already specified)
  { category: 'clarification_not_needed', name: 'Direct: amortisseur avant', message: 'amortisseur avant' },
  { category: 'clarification_not_needed', name: 'Direct: phare droit', message: 'phare arrière droit' },
  { category: 'clarification_not_needed', name: 'Direct: aile gauche', message: 'aile avant gauche' },
  
  // Category 4: Reference Searches
  { category: 'reference_search', name: 'Ref: 41800M62S00', message: '41800M62S00' },
  { category: 'reference_search', name: 'Ref: 13780M62S00', message: 'référence 13780M62S00' },
  { category: 'reference_search', name: 'Ref: Invalid', message: 'ABCDEFG123' },
  
  // Category 5: Price Display - Available
  { category: 'price_display_available', name: 'Price: filtre air', message: 'filtre à air celerio' },
  { category: 'price_display_available', name: 'Price: plaquettes', message: 'plaquette frein avant' },
  
  // Category 6: Price Display - Unavailable
  { category: 'price_display_unavailable', name: 'No Price: filtre habitacle', message: 'filtre habitacle' },
  
  // Category 7: Diagnostic Redirect
  { category: 'diagnostic_redirect', name: 'Diagnostic: bruit moteur', message: 'moteur t9allek bruit' },
  { category: 'diagnostic_redirect', name: 'Diagnostic: vibration', message: 'vibration dans le volant' },
  
  // Category 8: Formal French Only
  { category: 'formal_french', name: 'Formal: bonjour', message: 'bonjour' },
  { category: 'formal_french', name: 'Formal: merci', message: 'merci' },
  
  // Category 9: Error Handling
  { category: 'error_handling', name: 'Gibberish', message: 'asdfghjkl' },
  { category: 'error_handling', name: 'Empty', message: '' },
  
  // Category 10: Mixed Specification
  { category: 'clarification_needed', name: 'Mixed: amortisseur gauche', message: 'amortisseur gauche' },
  { category: 'clarification_needed', name: 'Mixed: feu avant', message: 'feu avant' },
];

// ==================== RUN TESTS ====================

async function runAllTests() {
  console.log('🚀 STARTING CHATBOT TEST SUITE');
  console.log('='.repeat(60));
  
  const tester = new ChatbotTester();
  
  try {
    // Initialize session
    await tester.initialize();
    
    // Run all tests
    for (const testCase of testSuite) {
      await tester.runTest(testCase);
    }
    
    // Run conversation flow tests
    await testConversationFlow(tester);
    
    // Print final summary
    tester.printSummary();
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Additional: Test conversation flows
async function testConversationFlow(tester) {
  console.log('\n' + '='.repeat(60));
  console.log('💬 TESTING CONVERSATION FLOWS');
  console.log('='.repeat(60));
  
  // Flow 1: Brake system conversation
  console.log('\n🔧 Flow 1: Brake System');
  await tester.runTest({ category: 'contextual', name: 'Flow1: Plaquettes avant', message: 'plaquette frein avant' });
  await tester.runTest({ category: 'contextual', name: 'Flow1: Et arrière', message: 'et pour l\'arrière aussi?' });
  await tester.runTest({ category: 'contextual', name: 'Flow1: Combien', message: 'combien pour les deux jeux?' });
  
  // Flow 2: Filter types
  console.log('\n🔧 Flow 2: Filter Types');
  await tester.runTest({ category: 'contextual', name: 'Flow2: Filtre generic', message: 'filtre' });
  await tester.runTest({ category: 'contextual', name: 'Flow2: Filtre air', message: 'filtre à air' });
  await tester.runTest({ category: 'contextual', name: 'Flow2: Et huile', message: 'et filtre à huile?' });
  
  // Flow 3: Suspension
  console.log('\n🔧 Flow 3: Suspension');
  await tester.runTest({ category: 'contextual', name: 'Flow3: Amortisseur', message: 'amortisseur' });
  await tester.runTest({ category: 'contextual', name: 'Flow3: Avant', message: 'avant' });
  await tester.runTest({ category: 'contextual', name: 'Flow3: Gauche', message: 'gauche' });
}

// Run the test suite
runAllTests().catch(console.error);