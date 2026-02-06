const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:8000/chat/message';

class ProductionReadinessTester {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      details: [],
      startTime: new Date(),
      sessionId: null
    };
  }

  async sendMessage(message, vehicle = { marque: 'SUZUKI', modele: 'S-PRESSO', annee: 2024, immatriculation: '2434698' }) {
    try {
      const startTime = Date.now();
      const response = await axios.post(API_URL, {
        message,
        vehicle,
        sessionId: this.results.sessionId
      });
      
      if (!this.results.sessionId) {
        this.results.sessionId = response.data.sessionId;
      }
      
      return {
        success: true,
        response: response.data.response,
        products: response.data.products || [],
        confidence: response.data.confidence,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        response: error.response?.data?.message || 'Error'
      };
    }
  }

  async runTest(testCase) {
    const { name, message, expectedKeywords, shouldNotContain } = testCase;
    
    console.log(`\n🧪 ${name}`);
    console.log(`   📝 "${message}"`);
    
    const result = await this.sendMessage(message);
    
    if (!result.success) {
      this.recordFailure(testCase, result.error);
      return;
    }
    
    console.log(`   🤖 "${result.response}"`);
    console.log(`   ⏱️  ${result.duration}ms | 🎯 ${result.confidence || 'N/A'} | 📦 ${result.products.length} products`);
    
    // Validate response
    const lowerResponse = result.response.toLowerCase();
    let passed = true;
    const failedChecks = [];
    
    // Check expected keywords
    if (expectedKeywords) {
      for (const keyword of expectedKeywords) {
        if (!lowerResponse.includes(keyword.toLowerCase())) {
          passed = false;
          failedChecks.push(`Missing: "${keyword}"`);
        }
      }
    }
    
    // Check should not contain
    if (shouldNotContain) {
      for (const keyword of shouldNotContain) {
        if (lowerResponse.includes(keyword.toLowerCase())) {
          passed = false;
          failedChecks.push(`Should NOT contain: "${keyword}"`);
        }
      }
    }
    
    if (passed) {
      console.log(`   ✅ PASS`);
      this.recordSuccess(testCase, result);
    } else {
      console.log(`   ❌ FAIL`);
      failedChecks.forEach(check => console.log(`      ⚠️  ${check}`));
      this.recordFailure(testCase, failedChecks.join(', '), result);
    }
    
    await this.sleep(500);
  }

  recordSuccess(testCase, result) {
    this.results.passed++;
    this.results.total++;
    this.results.details.push({ ...testCase, passed: true, botResponse: result.response });
  }

  recordFailure(testCase, error, result = null) {
    this.results.failed++;
    this.results.total++;
    this.results.details.push({ ...testCase, passed: false, error, botResponse: result?.response || '' });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runAllTests() {
    console.log('🚀 PRODUCTION READINESS TEST SUITE');
    console.log('═'.repeat(80));
    
    // Test 1: Basic Part Search (Tunisian)
    console.log('\n1️⃣  BASIC PART SEARCH');
    await this.runTest({
      name: 'Test 1: Tunisian air filter search',
      message: 'famma filtre air pour celerio',
      expectedKeywords: ['filtre', 'air', 'produits', 'tnd']
    });
    
    // Test 2: Clarification Flow (CRITICAL FIX)
    console.log('\n2️⃣  CLARIFICATION FLOW (CRITICAL FIX)');
    await this.runTest({
      name: 'Test 2a: Ask for shock absorber',
      message: 'famma amortisseur ?',
      expectedKeywords: ['position', 'avant', 'arrière'],
      shouldNotContain: ['joint de porte'] // Should NOT return door seal yet
    });
    
    await this.runTest({
      name: 'Test 2b: Answer clarification',
      message: 'arriere gauche',
      expectedKeywords: ['produits disponibles', 'tnd'],
      shouldNotContain: ['merci de préciser', 'position'] // Should NOT repeat clarification
    });
    
    // Test 3: Vehicle Context Preservation
    console.log('\n3️⃣  CONTEXT PRESERVATION (CRITICAL FIX)');
    await this.runTest({
      name: 'Test 3a: Brake pads',
      message: 'plaquettes frein',
      expectedKeywords: ['plaquettes', 'frein', 'position']
    });
    
    await this.runTest({
      name: 'Test 3b: Rear brake pads',
      message: 'et pour l\'arrière aussi?',
      expectedKeywords: ['plaquettes', 'frein', 'arrière'],
      shouldNotContain: ['amortisseur'] // Should NOT switch to shock absorbers
    });
    
    // Test 4: Reference Search
    console.log('\n4️⃣  REFERENCE SEARCH');
    await this.runTest({
      name: 'Test 4: Exact reference',
      message: 'référence 13780M62S00',
      expectedKeywords: ['référence', 'filtre', 'air', 'tnd']
    });
    
    // Test 5: Price Inquiry (CRITICAL FIX)
    console.log('\n5️⃣  PRICE CALCULATION (CRITICAL FIX)');
    await this.runTest({
      name: 'Test 5: Brake pad pricing',
      message: 'combien pour les plaquettes frein ?',
      expectedKeywords: ['prix', 'plaquettes', 'tnd'],
      shouldNotContain: ['disque de frein av'] // Should NOT mix brake disks with pads
    });
    
    // Test 6: Gibberish Input
    console.log('\n6️⃣  EDGE CASES');
    await this.runTest({
      name: 'Test 6: Gibberish',
      message: 'asdfghjkl',
      expectedKeywords: ['ne parviens pas', 'comprendre']
    });
    
    // Test 7: Vague Query
    await this.runTest({
      name: 'Test 7: Vague query',
      message: 'quelque chose pour la voiture',
      expectedKeywords: ['préciser', 'pièce']
    });
    
    // Test 8: Greeting
    console.log('\n7️⃣  NON-SEARCH INTENTS');
    await this.runTest({
      name: 'Test 8: Greeting',
      message: 'bonjour j\'aurais besoin d\'aide',
      expectedKeywords: ['bonjour', 'aider']
    });
    
    // Test 9: Service Question
    await this.runTest({
      name: 'Test 9: Service question',
      message: 'vous ouvrez à quelle heure ?',
      expectedKeywords: ['carpro', '70 603 500']
    });
    
    // Test 10: Stock Check
    console.log('\n8️⃣  STOCK & AVAILABILITY');
    await this.runTest({
      name: 'Test 10: Stock check',
      message: 'stok filtre air celerio ?',
      expectedKeywords: ['filtre', 'air', 'disponible']
    });
    
    // Test 11: Direct position query
    console.log('\n9️⃣  DIRECT QUERIES (NO CLARIFICATION)');
    await this.runTest({
      name: 'Test 11: Direct position',
      message: 'amortisseur arriere gauche',
      expectedKeywords: ['produits', 'tnd'],
      shouldNotContain: ['préciser la position'] // Should NOT ask for clarification
    });
    
    // Test 12: Mixed Tunisian-French
    console.log('\n🔟  TUNISIAN DIALECT');
    await this.runTest({
      name: 'Test 12: Mixed language',
      message: 'n7eb filtre air mte3 celerio, ch7al prix w ken famma stok ?',
      expectedKeywords: ['filtre', 'air', 'prix', 'tnd']
    });
    
    this.printSummary();
    this.saveResults();
  }

  printSummary() {
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    console.log('\n' + '═'.repeat(80));
    console.log('📊 PRODUCTION READINESS - SUMMARY');
    console.log('═'.repeat(80));
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.results.failed > 0) {
      console.log('\n🔴 FAILED TESTS:');
      this.results.details.filter(d => !d.passed).forEach(d => {
        console.log(`   ❌ ${d.name}: ${d.error}`);
      });
    }
    
    console.log('\n🎯 PRODUCTION STATUS:');
    if (successRate >= 95) {
      console.log('   🟢 READY FOR PRODUCTION');
    } else if (successRate >= 80) {
      console.log('   🟡 READY FOR STAGING');
    } else {
      console.log('   🔴 NOT READY - CRITICAL ISSUES');
    }
    
    console.log('═'.repeat(80));
  }

  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const txtFile = `test-results-production-${timestamp}.txt`;
    const jsonFile = `test-results-production-${timestamp}.json`;
    
    // Save detailed text output
    let txtOutput = '🚀 PRODUCTION READINESS TEST RESULTS\n';
    txtOutput += '═'.repeat(80) + '\n\n';
    
    this.results.details.forEach((test, i) => {
      txtOutput += `${i + 1}. ${test.name}\n`;
      txtOutput += `   Message: "${test.message}"\n`;
      txtOutput += `   Status: ${test.passed ? '✅ PASS' : '❌ FAIL'}\n`;
      if (!test.passed) {
        txtOutput += `   Error: ${test.error}\n`;
      }
      txtOutput += `   Bot Response: "${test.botResponse}"\n\n`;
    });
    
    txtOutput += '\n' + '═'.repeat(80) + '\n';
    txtOutput += `Total: ${this.results.total} | Passed: ${this.results.passed} | Failed: ${this.results.failed}\n`;
    txtOutput += `Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%\n`;
    
    fs.writeFileSync(txtFile, txtOutput);
    fs.writeFileSync(jsonFile, JSON.stringify(this.results, null, 2));
    
    console.log(`\n📄 Results saved to:`);
    console.log(`   - ${txtFile}`);
    console.log(`   - ${jsonFile}`);
  }
}

const tester = new ProductionReadinessTester();
tester.runAllTests().catch(console.error);
