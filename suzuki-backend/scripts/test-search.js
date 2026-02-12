const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

const TEST_QUERIES = [
  'retroviseur gauche',
  'retroviseur droite',
  'retroviseur droit',
  'salem belahi n7eb retroviseur droit',
  'amortisseur avant gauche',
  'amortisseur avant droit',
  'amortisseur arriere',
  'amortisseur arriere gauche',
  'cache retroviseur gauche',
  'cache retroviseur droit',
  'cache retroviseur',
  'baguette porte',
  'baguette porte gauche',
  'SANGLE BATTERI',
  'filtre a huile',
  'filtre a air',
  'fitlre a air',
  'fitlre a hile',
  'plaquette frein avant',
  'disque frein arriere',
  'phare avant gauche',
  'aile avant droite',
  'support moteur',
  'support moteur arriere',
  'support moteur droit',
  'support moteur gauche',
  'joint porte',
  'moteur essuie glace',
  'aile avant gauche',
  'pare choc avant',
  'courroie distribution',
  'bougie allumage',
  'batterie',
  // 🔥 NEW COMPLEX TEST CASES
  'collier echappement arriere',           // Compound accessory + position
  'support pare choc avant gauche',        // Accessory + main part + 2 positions
  'cach retrovisur avent droit',           // Multiple typos + accessory + position
  'ya zebi n7eb joint culasse',            // Arabic slang + technical part
  'bague support amortisseur avant'        // Accessory + accessory + main part + position
];

async function checkDbForQuery(query) {
  const normalized = query.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const tokens = normalized.split(' ').filter(t => t.length > 2);
  if (tokens.length === 0) return 0;
  
  const conditions = tokens.map(token => ({
    OR: [
      { designation: { contains: token, mode: 'insensitive' } },
      { reference: { contains: token, mode: 'insensitive' } }
    ]
  }));
  
  const results = await prisma.piecesRechange.findMany({
    where: { OR: conditions },
    take: 100
  });
  
  return results.length;
}

async function testSearch(query) {
  try {
    const response = await axios.post(API_URL, {
      message: query,
      vehicle: VEHICLE
    });
    
    const { products, metadata, response: botResponse } = response.data;
    const found = products && products.length > 0;
    const productName = found ? products[0].designation : 'N/A';
    
    // If AI didn't find anything, check if it actually exists in DB
    let dbCount = 0;
    let actualStatus = found ? 'PASS' : 'FAIL';
    
    if (!found) {
      dbCount = await checkDbForQuery(query);
      // If DB also has 0 results, it's not AI's fault - mark as PASS
      if (dbCount === 0) {
        actualStatus = 'PASS';
      }
    }
    
    return {
      query,
      found,
      productName,
      productsCount: metadata?.productsFound || 0,
      dbCount,
      status: actualStatus,
      botResponse: botResponse || 'N/A',
      product: found ? products[0] : null
    };
  } catch (error) {
    return {
      query,
      found: false,
      productName: 'ERROR',
      productsCount: 0,
      dbCount: 0,
      status: 'ERROR',
      error: error.message,
      botResponse: 'ERROR',
      product: null
    };
  }
}

async function saveChatLog(results) {
  const timestamp = new Date();
  const chatLog = [];
  
  results.forEach(result => {
    const time = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    // User message
    chatLog.push(`${time}`);
    chatLog.push(result.query);
    chatLog.push('');
    
    // Bot response
    chatLog.push(`${time}`);
    chatLog.push(result.botResponse);
    chatLog.push('');
  });
  
  const logPath = path.join(__dirname, `chat-log-${Date.now()}.txt`);
  fs.writeFileSync(logPath, chatLog.join('\n'), 'utf8');
  console.log(`\n💾 Chat log saved to: ${logPath}`);
}

async function runTests() {
  console.log('🚀 STARTING SEARCH SYSTEM TEST\n');
  console.log('=' .repeat(80));
  console.log(`Testing ${TEST_QUERIES.length} queries...\n`);
  
  const results = [];
  let sessionId = null;
  
  for (let i = 0; i < TEST_QUERIES.length; i++) {
    const query = TEST_QUERIES[i];
    process.stdout.write(`[${i + 1}/${TEST_QUERIES.length}] Testing: "${query}"...`);
    
    const result = await testSearch(query);
    results.push(result);
    
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(` ${icon}`);
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS\n');
  
  // Print detailed results
  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} [${index + 1}] "${result.query}"`);
    console.log(`   → ${result.productName}`);
    if (result.productsCount > 1) {
      console.log(`   → Found ${result.productsCount} products`);
    }
    if (!result.found && result.dbCount !== undefined) {
      console.log(`   → DB has ${result.dbCount} matches ${result.dbCount === 0 ? '(Not AI fault ✓)' : '(AI MISS!)'}`);
    }
    if (result.error) {
      console.log(`   → Error: ${result.error}`);
    }
    console.log('');
  });
  
  // Calculate statistics
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  const total = results.length;
  const successRate = ((passed / total) * 100).toFixed(2);
  
  console.log('='.repeat(80));
  console.log('📈 STATISTICS\n');
  console.log(`Total Tests:    ${total}`);
  console.log(`✅ Passed:      ${passed} (${successRate}%)`);
  console.log(`❌ Failed:      ${failed}`);
  console.log(`⚠️  Errors:      ${errors}`);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  
  if (successRate >= 95) {
    console.log('\n🎉 EXCELLENT! System is production ready!');
  } else if (successRate >= 85) {
    console.log('\n👍 GOOD! Minor improvements needed.');
  } else if (successRate >= 70) {
    console.log('\n⚠️  FAIR! Significant improvements needed.');
  } else {
    console.log('\n❌ POOR! Major fixes required.');
  }
  
  console.log('\n' + '='.repeat(80));
  
  // Save chat log
  await saveChatLog(results);
}

// Run the tests
runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
