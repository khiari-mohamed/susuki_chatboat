const fs = require('fs');

const failures = JSON.parse(fs.readFileSync('failed-tests.json', 'utf8'));

// Categorize failures
const categories = {
  notFound: [],           // found: false
  wrongMatch: [],         // found: true but wrong result
  pluralIssues: [],       // Singular/plural mismatch
  typoIssues: [],         // Typo not caught
  wordOrderIssues: [],    // Reversed word order
  accentIssues: []        // Accent variations
};

failures.forEach(f => {
  if (!f.found) {
    categories.notFound.push(f);
  } else if (f.topResult !== f.expected) {
    categories.wrongMatch.push(f);
    
    // Check for plural issues
    if (f.expected.endsWith('S') && f.topResult === f.expected.slice(0, -1)) {
      categories.pluralIssues.push(f);
    } else if (f.topResult.endsWith('S') && f.expected === f.topResult.slice(0, -1)) {
      categories.pluralIssues.push(f);
    }
  }
});

console.log('📊 FAILURE ANALYSIS\n');
console.log(`Total Failures: ${failures.length}`);
console.log(`\n🔍 Categories:`);
console.log(`  ❌ Not Found: ${categories.notFound.length} (${(categories.notFound.length/failures.length*100).toFixed(1)}%)`);
console.log(`  ⚠️  Wrong Match: ${categories.wrongMatch.length} (${(categories.wrongMatch.length/failures.length*100).toFixed(1)}%)`);
console.log(`  📝 Plural Issues: ${categories.pluralIssues.length}`);

// Top patterns
console.log(`\n🔝 TOP FAILURE PATTERNS:\n`);

// Group by expected part
const byPart = {};
failures.forEach(f => {
  if (!byPart[f.expected]) byPart[f.expected] = [];
  byPart[f.expected].push(f);
});

const sorted = Object.entries(byPart).sort((a, b) => b[1].length - a[1].length).slice(0, 20);

sorted.forEach(([part, fails], i) => {
  console.log(`${i+1}. ${part}: ${fails.length} failures`);
  console.log(`   Sample queries: ${fails.slice(0, 3).map(f => `"${f.query}"`).join(', ')}`);
});

// Save detailed analysis
fs.writeFileSync('failure-analysis.json', JSON.stringify({
  summary: {
    total: failures.length,
    notFound: categories.notFound.length,
    wrongMatch: categories.wrongMatch.length,
    pluralIssues: categories.pluralIssues.length
  },
  byPart: Object.fromEntries(
    Object.entries(byPart).map(([k, v]) => [k, v.length])
  ),
  topFailures: sorted.map(([part, fails]) => ({
    part,
    count: fails.length,
    samples: fails.slice(0, 5)
  }))
}, null, 2));

console.log(`\n💾 Detailed analysis saved to failure-analysis.json`);
