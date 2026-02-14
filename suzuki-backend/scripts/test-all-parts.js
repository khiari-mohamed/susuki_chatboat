const axios = require('axios');

const API_URL = 'http://localhost:8000';

// Extract main part name from designation (remove positions, numbers, etc.)
function extractPartName(designation) {
  let name = designation
    .toLowerCase()
    .replace(/\s+(av|ar|avant|arriere|arrière|g|d|gauche|droite|droit|sup|inf|superieur|inferieur|h|b|int|ext)\b/gi, '')
    .replace(/\s+\([^)]+\)/g, '') // Remove (T:3.20) etc
    .replace(/\s+\d+[,.]?\d*/g, '') // Remove numbers
    .replace(/\s+[a-z]$/i, '') // Remove single letter at end
    .trim();
  
  return name;
}

// Get all unique part names from database
async function getAllPartNames() {
  try {
    const response = await axios.post(`${API_URL}/chat/search`, {
      query: '',
      vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' }
    });
    
    // This will return all parts, extract unique names
    const allParts = new Set();
    
    // Get a sample of parts by searching common terms
    const commonSearches = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'v'];
    
    for (const letter of commonSearches) {
      try {
        const res = await axios.post(`${API_URL}/chat/search`, {
          query: letter,
          vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' }
        });
        
        if (res.data.products) {
          res.data.products.forEach(p => {
            const partName = extractPartName(p.designation);
            if (partName.length >= 4) { // Only meaningful names
              allParts.add(partName);
            }
          });
        }
      } catch (err) {
        // Continue on error
      }
    }
    
    return Array.from(allParts).sort();
  } catch (error) {
    console.error('Error fetching parts:', error.message);
    return [];
  }
}

// Test a single part name
async function testPartName(partName) {
  try {
    const response = await axios.post(`${API_URL}/chat/search`, {
      query: partName,
      vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' }
    });
    
    const products = response.data.products || [];
    
    // Check if any result contains the part name
    const found = products.some(p => {
      const designation = p.designation.toLowerCase();
      const searchName = partName.toLowerCase();
      return designation.includes(searchName);
    });
    
    return {
      success: found,
      resultCount: products.length,
      results: products.slice(0, 3).map(p => p.designation)
    };
  } catch (error) {
    return {
      success: false,
      resultCount: 0,
      results: [],
      error: error.message
    };
  }
}

// Main test function
async function runTest() {
  console.log('🔍 COMPREHENSIVE PARTS TEST\n');
  console.log('================================================================================');
  console.log('Extracting all unique part names from database...\n');
  
  const allParts = await getAllPartNames();
  
  if (allParts.length === 0) {
    console.log('❌ Could not extract part names from database');
    return;
  }
  
  console.log(`✅ Found ${allParts.length} unique part names\n`);
  console.log('================================================================================');
  console.log('Testing each part name...\n');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    failures: []
  };
  
  // Test up to 200 parts
  const partsToTest = allParts.slice(0, 200);
  
  for (let i = 0; i < partsToTest.length; i++) {
    const partName = partsToTest[i];
    results.total++;
    
    const testResult = await testPartName(partName);
    
    if (testResult.success) {
      results.passed++;
      process.stdout.write(`✅ [${i + 1}/${partsToTest.length}] ${partName}\r`);
    } else {
      results.failed++;
      results.failures.push({
        partName,
        resultCount: testResult.resultCount,
        results: testResult.results,
        error: testResult.error
      });
      console.log(`\n❌ [${i + 1}/${partsToTest.length}] ${partName}`);
      if (testResult.resultCount > 0) {
        console.log(`   Got: ${testResult.results.join(', ')}`);
      } else {
        console.log(`   Got: No results`);
      }
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
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
      if (failure.resultCount > 0) {
        console.log(`   Results: ${failure.results.join(', ')}`);
      } else {
        console.log(`   No results found`);
      }
      if (failure.error) {
        console.log(`   Error: ${failure.error}`);
      }
    });
  }
  
  console.log('\n================================================================================');
  
  if (results.failed === 0) {
    console.log('🎉 PERFECT! All parts found correctly!');
  } else if (results.passed / results.total >= 0.95) {
    console.log('✅ EXCELLENT! 95%+ success rate');
  } else if (results.passed / results.total >= 0.90) {
    console.log('👍 GOOD! 90%+ success rate');
  } else if (results.passed / results.total >= 0.80) {
    console.log('⚠️  ACCEPTABLE! 80%+ success rate');
  } else {
    console.log('❌ NEEDS IMPROVEMENT! Below 80% success rate');
  }
}

// Run the test
runTest().catch(console.error);
