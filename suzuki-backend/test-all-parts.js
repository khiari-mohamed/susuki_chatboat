/**
 * ULTIMATE CHATBOT TEST
 * Tests the exact conversation flow for 400+ parts from the database
 * 
 * Flow tested:
 * 1. Request part in Tunisian
 * 2. Clarification (if needed)
 * 3. Follow-up with different position
 * 4. New part request
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const API_URL = 'http://localhost:8000/chat/message';

// Test configuration
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

// Delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Send message to chatbot
async function sendMessage(message, sessionId) {
  try {
    const response = await axios.post(API_URL, {
      message,
      vehicle: VEHICLE,
      sessionId
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error sending message: ${error.message}`);
    return null;
  }
}

// Extract part name from designation
function extractPartName(designation) {
  const lower = designation.toLowerCase();
  
  // Body parts
  if (lower.includes('aile')) return 'aile';
  if (lower.includes('porte')) return 'porte';
  if (lower.includes('capot')) return 'capot';
  if (lower.includes('pare') && lower.includes('choc')) return 'pare-choc';
  if (lower.includes('retroviseur') || lower.includes('rétroviseur')) return 'retroviseur';
  if (lower.includes('hayon')) return 'hayon';
  if (lower.includes('vitre')) return 'vitre';
  if (lower.includes('lunette')) return 'lunette';
  if (lower.includes('malle')) return 'malle';
  if (lower.includes('jupe')) return 'jupe';
  if (lower.includes('longeron')) return 'longeron';
  if (lower.includes('traverse')) return 'traverse';
  
  // Lighting
  if (lower.includes('phare')) return 'phare';
  if (lower.includes('feu')) return 'feu';
  if (lower.includes('clignotant')) return 'clignotant';
  if (lower.includes('optique')) return 'optique';
  if (lower.includes('lampe')) return 'lampe';
  
  // Suspension
  if (lower.includes('amortisseur')) return 'amortisseur';
  if (lower.includes('ressort')) return 'ressort';
  if (lower.includes('rotule')) return 'rotule';
  if (lower.includes('triangle')) return 'triangle';
  if (lower.includes('silent')) return 'silent bloc';
  
  // Brakes
  if (lower.includes('plaquette')) return 'plaquette frein';
  if (lower.includes('disque') && lower.includes('frein')) return 'disque frein';
  if (lower.includes('etrier')) return 'etrier';
  if (lower.includes('tambour')) return 'tambour';
  
  // Filters
  if (lower.includes('filtre') && lower.includes('air')) return 'filtre air';
  if (lower.includes('filtre') && lower.includes('huile')) return 'filtre huile';
  if (lower.includes('filtre')) return 'filtre';
  
  // Engine
  if (lower.includes('courroie')) return 'courroie';
  if (lower.includes('bougie')) return 'bougie';
  if (lower.includes('joint')) return 'joint';
  if (lower.includes('durite')) return 'durite';
  if (lower.includes('radiateur')) return 'radiateur';
  if (lower.includes('pompe')) return 'pompe';
  
  // Electrical
  if (lower.includes('batterie')) return 'batterie';
  if (lower.includes('alternateur')) return 'alternateur';
  if (lower.includes('demarreur') || lower.includes('démarreur')) return 'demarreur';
  if (lower.includes('capteur')) return 'capteur';
  if (lower.includes('relais')) return 'relais';
  
  // Transmission
  if (lower.includes('embrayage')) return 'embrayage';
  if (lower.includes('cardan')) return 'cardan';
  
  // Wheels
  if (lower.includes('jante')) return 'jante';
  if (lower.includes('enjoliveur')) return 'enjoliveur';
  
  return null;
}

// Extract position from designation
function extractPosition(designation) {
  const lower = designation.toLowerCase();
  const hasAvant = /\b(avant|av)\b/i.test(lower);
  const hasArriere = /\b(arriere|arrière|ar)\b/i.test(lower);
  const hasGauche = /\b(gauche|g)\b/i.test(lower);
  const hasDroite = /\b(droite|d|droit)\b/i.test(lower);
  
  return {
    position: hasAvant ? 'avant' : hasArriere ? 'arrière' : null,
    side: hasGauche ? 'gauche' : hasDroite ? 'droite' : null
  };
}

// Test a single part with the full conversation flow
async function testPart(part, index, total) {
  const sessionId = `test-${Date.now()}-${index}`;
  const partName = extractPartName(part.designation);
  
  if (!partName) {
    console.log(`⏭️  [${index}/${total}] Skipping: ${part.designation} (no part name detected)`);
    return { skipped: true };
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 TEST ${index}/${total}: ${part.designation}`);
  console.log(`${'='.repeat(80)}`);
  
  const results = {
    part: part.designation,
    reference: part.reference,
    tests: []
  };
  
  // TEST 1: Request part in Tunisian
  console.log(`\n📝 TEST 1: Request "${partName}" in Tunisian`);
  const tunisianRequest = `n7eb ${partName}`;
  console.log(`📤 USER: "${tunisianRequest}"`);
  
  const response1 = await sendMessage(tunisianRequest, sessionId);
  await delay(1000);
  
  if (!response1) {
    results.tests.push({ test: 'Tunisian request', status: 'FAILED', error: 'No response' });
    return results;
  }
  
  console.log(`🤖 BOT: ${response1.response.substring(0, 100)}...`);
  console.log(`📊 Intent: ${response1.intent}`);
  console.log(`📦 Products: ${response1.metadata.productsFound}`);
  
  results.tests.push({
    test: 'Tunisian request',
    status: response1.intent === 'CLARIFICATION_NEEDED' || response1.metadata.productsFound > 0 ? 'PASSED' : 'FAILED',
    intent: response1.intent,
    productsFound: response1.metadata.productsFound
  });
  
  // TEST 2: Clarification (if needed)
  if (response1.intent === 'CLARIFICATION_NEEDED') {
    console.log(`\n📝 TEST 2: Clarification answer`);
    const position = extractPosition(part.designation);
    const clarificationAnswer = position.position || 'avant';
    console.log(`📤 USER: "${clarificationAnswer}"`);
    
    const response2 = await sendMessage(clarificationAnswer, sessionId);
    await delay(1000);
    
    if (response2) {
      console.log(`🤖 BOT: ${response2.response.substring(0, 100)}...`);
      console.log(`📊 Intent: ${response2.intent}`);
      console.log(`📦 Products: ${response2.metadata.productsFound}`);
      
      results.tests.push({
        test: 'Clarification',
        status: response2.metadata.productsFound > 0 ? 'PASSED' : 'FAILED',
        intent: response2.intent,
        productsFound: response2.metadata.productsFound
      });
    }
  }
  
  // TEST 3: Follow-up with different position (Tunisian)
  console.log(`\n📝 TEST 3: Follow-up with different position`);
  const followUp = 'behi choufli l\'avant';
  console.log(`📤 USER: "${followUp}"`);
  
  const response3 = await sendMessage(followUp, sessionId);
  await delay(1000);
  
  if (response3) {
    console.log(`🤖 BOT: ${response3.response.substring(0, 100)}...`);
    console.log(`📊 Intent: ${response3.intent}`);
    console.log(`📦 Products: ${response3.metadata.productsFound}`);
    
    results.tests.push({
      test: 'Follow-up',
      status: response3.metadata.productsFound > 0 || response3.intent === 'CLARIFICATION_NEEDED' ? 'PASSED' : 'FAILED',
      intent: response3.intent,
      productsFound: response3.metadata.productsFound
    });
  }
  
  // TEST 4: New part request (should NOT use context)
  console.log(`\n📝 TEST 4: New part request (different part)`);
  const newPartRequest = 'ok maintenant je veux un aile droite';
  console.log(`📤 USER: "${newPartRequest}"`);
  
  const response4 = await sendMessage(newPartRequest, sessionId);
  await delay(1000);
  
  if (response4) {
    console.log(`🤖 BOT: ${response4.response.substring(0, 100)}...`);
    console.log(`📊 Intent: ${response4.intent}`);
    console.log(`📦 Products: ${response4.metadata.productsFound}`);
    
    const foundAile = response4.response.toLowerCase().includes('aile');
    results.tests.push({
      test: 'New part request',
      status: foundAile ? 'PASSED' : 'FAILED',
      intent: response4.intent,
      productsFound: response4.metadata.productsFound,
      foundCorrectPart: foundAile
    });
  }
  
  return results;
}

// Main test runner
async function runTests() {
  console.log('🚀 FOCUSED TEST - Skipped & Failed Parts Only\n');
  
  try {
    // Get counts from database
    const totalCount = await prisma.piecesRechange.count();
    const inStockCount = await prisma.piecesRechange.count({ where: { stock: { gt: 0 } } });
    
    console.log(`📦 Total parts in DB: ${totalCount}`);
    console.log(`📦 Parts with stock > 0: ${inStockCount}\n`);
    
    // Get all parts (no stock filter)
    const allParts = await prisma.piecesRechange.findMany({
      orderBy: { designation: 'asc' }
    });
    
    // First pass: identify skipped parts
    const skippedParts = [];
    const testableParts = [];
    
    for (const part of allParts) {
      const partName = extractPartName(part.designation);
      if (!partName) {
        skippedParts.push(part);
      } else {
        testableParts.push(part);
      }
    }
    
    console.log(`✅ Testable: ${testableParts.length}`);
    console.log(`⏭️  Skipped: ${skippedParts.length}\n`);
    
    // Show sample of skipped parts for debugging
    if (skippedParts.length > 0) {
      console.log('🔍 SKIPPED PARTS SAMPLE (first 20):');
      skippedParts.slice(0, 20).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.designation}`);
      });
      console.log('');
    }
    
    const results = [];
    let passed = 0;
    let failed = 0;
    
    // Test only testable parts
    for (let i = 0; i < testableParts.length; i++) {
      const result = await testPart(testableParts[i], i + 1, testableParts.length);
      
      if (result.skipped) continue;
      
      results.push(result);
      
      const allPassed = result.tests.every(t => t.status === 'PASSED');
      if (allPassed) {
        passed++;
      } else {
        failed++;
      }
      
      await delay(1500);
      
      if ((i + 1) % 10 === 0) {
        console.log(`\n⏸️  Completed ${i + 1}/${testableParts.length} - Waiting...\n`);
        await delay(2000);
      }
    }
    
    // Print summary
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 TEST SUMMARY');
    console.log(`${'='.repeat(80)}`);
    console.log(`Total parts in DB: ${allParts.length}`);
    console.log(`Testable parts: ${testableParts.length}`);
    console.log(`Skipped parts: ${skippedParts.length}`);
    console.log(`\nTest Results:`);
    console.log(`✅ Passed: ${passed} (${((passed / results.length) * 100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${failed} (${((failed / results.length) * 100).toFixed(1)}%)`);
    
    // Show failed tests with details
    if (failed > 0) {
      console.log(`\n❌ FAILED TESTS DETAILS:`);
      results.forEach(r => {
        const failedTests = r.tests.filter(t => t.status === 'FAILED');
        if (failedTests.length > 0) {
          console.log(`\n  Part: ${r.part} (${r.reference})`);
          failedTests.forEach(t => {
            console.log(`    - ${t.test}: ${t.error || 'No products found'}`);
            console.log(`      Intent: ${t.intent}, Products: ${t.productsFound}`);
          });
        }
      });
    }
    
    // Analyze skipped parts
    if (skippedParts.length > 0) {
      console.log(`\n⏭️  SKIPPED PARTS ANALYSIS:`);
      const skippedByType = {};
      skippedParts.forEach(p => {
        const words = p.designation.toLowerCase().split(' ');
        const key = words[0] || 'unknown';
        skippedByType[key] = (skippedByType[key] || 0) + 1;
      });
      
      console.log('\nTop skipped part types:');
      Object.entries(skippedByType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([type, count]) => {
          console.log(`  ${type}: ${count}`);
        });
    }
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync(
      'd:\\house_md\\Suzuki\\suzuki-backend\\test-results.json',
      JSON.stringify({ tested: results, skipped: skippedParts.map(p => p.designation) }, null, 2)
    );
    console.log(`\n💾 Results saved to test-results.json`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
runTests();
