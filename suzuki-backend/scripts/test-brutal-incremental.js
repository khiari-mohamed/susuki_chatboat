const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:8000/chat/message';
const PREVIOUS_REPORT = './brutal-test-report-1770811068117.json';
const BATCH_SIZE = 30;
const STATE_FILE = './test-state.json';

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesDesignation(result, expected) {
  if (!result || !expected) return false;
  
  const resultNorm = normalize(result);
  const expectedNorm = normalize(expected);
  
  // Extract words
  const resultWords = resultNorm.split(' ').filter(w => w.length > 0);
  const expectedWords = expectedNorm.split(' ').filter(w => w.length > 0);
  
  // Position synonyms
  const synonyms = {
    'avant': ['avant', 'av'],
    'av': ['avant', 'av'],
    'arriere': ['arriere', 'ar'],
    'ar': ['arriere', 'ar'],
    'gauche': ['gauche', 'g'],
    'g': ['gauche', 'g'],
    'droite': ['droite', 'd', 'droit'],
    'd': ['droite', 'd', 'droit'],
    'droit': ['droite', 'd', 'droit'],
    'superieur': ['superieur', 'sup'],
    'sup': ['superieur', 'sup'],
    'inferieur': ['inferieur', 'inf'],
    'inf': ['inferieur', 'inf']
  };
  
  // Helper to remove plural 's'
  const singularize = (word) => word.endsWith('s') ? word.slice(0, -1) : word;
  
  // Check if all expected words are in result (with synonyms + plural/singular)
  return expectedWords.every(ew => {
    const variants = synonyms[ew] || [ew];
    return variants.some(v => 
      resultWords.some(rw => 
        rw === v || singularize(rw) === singularize(v)
      )
    );
  });
}

async function testSearch(query) {
  try {
    const response = await axios.post(API_URL, { message: query }, { timeout: 10000 });
    if (response.data.products && response.data.products.length > 0) {
      return response.data.products[0].designation;
    }
    return null;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(`\n❌ Backend not running! Start it with: npm run start:dev`);
      process.exit(1);
    }
    return null;
  }
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  }
  const previousReport = JSON.parse(fs.readFileSync(PREVIOUS_REPORT, 'utf8'));
  return {
    currentBatch: 0,
    allFailures: previousReport.failures,
    totalOriginalFailures: previousReport.failures.length,
    totalFixed: 0
  };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function runBatchTest() {
  const state = loadState();
  const startIdx = state.currentBatch * BATCH_SIZE;
  const endIdx = Math.min(startIdx + BATCH_SIZE, state.allFailures.length);
  const batch = state.allFailures.slice(startIdx, endIdx);

  if (batch.length === 0) {
    console.log('\n🎉 ALL BATCHES COMPLETED!\n');
    console.log(`Total Fixed: ${state.totalFixed}/${state.totalOriginalFailures}`);
    console.log(`Success Rate: ${((state.totalFixed / state.totalOriginalFailures) * 100).toFixed(2)}%\n`);
    fs.unlinkSync(STATE_FILE);
    return;
  }

  console.log(`\n🎯 BATCH ${state.currentBatch + 1} - Testing ${batch.length} queries (${startIdx + 1}-${endIdx})\n`);

  const batchFailures = [];
  let batchFixed = 0;

  for (let i = 0; i < batch.length; i++) {
    const test = batch[i];
    const result = await testSearch(test.query);

    if (matchesDesignation(result, test.expected)) {
      batchFixed++;
    } else {
      batchFailures.push({ query: test.query, expected: test.expected, got: result });
    }

    process.stdout.write(`\r[${i + 1}/${batch.length}] Testing...`);
  }

  console.log('\n\n📊 BATCH RESULTS:\n');
  console.log(`✅ Fixed: ${batchFixed}/${batch.length}`);
  console.log(`❌ Still Failing: ${batchFailures.length}\n`);

  if (batchFailures.length > 0) {
    console.log('❌ FAILURES IN THIS BATCH:\n');
    batchFailures.slice(0, 10).forEach(f => {
      console.log(`  "${f.query}" → Expected: ${f.expected} Got: ${f.got || 'null'}`);
    });
    console.log(`\n... and ${Math.max(0, batchFailures.length - 10)} more\n`);
  }

  // Update state
  state.allFailures.splice(startIdx, batch.length, ...batchFailures);
  state.totalFixed += batchFixed;

  if (batchFailures.length === 0) {
    state.currentBatch++;
    console.log('✅ BATCH 100% SUCCESS! Moving to next batch...\n');
  } else {
    console.log('⚠️ BATCH HAS FAILURES! Re-run script after fixes to retry this batch.\n');
  }

  saveState(state);

  console.log('📈 OVERALL PROGRESS:\n');
  console.log(`Total Fixed: ${state.totalFixed}/${state.totalOriginalFailures} (${((state.totalFixed / state.totalOriginalFailures) * 100).toFixed(2)}%)`);
  console.log(`Remaining: ${state.allFailures.length}`);
  console.log(`Current Batch: ${state.currentBatch + 1}\n`);
  console.log('================================================================================\n');
}

runBatchTest();
