const fs = require('fs');

const report = JSON.parse(fs.readFileSync('brutal-test-report-1770915180221.json', 'utf8'));

const categories = {
  typoNotCorrected: [],
  pluralMismatch: [],
  wrongPartReturned: [],
  noResults: [],
  missingFirstLetter: [],
  concatenatedWords: [],
  variantMismatch: [],
  positionConfusion: []
};

report.failures.forEach(failure => {
  const { query, expected, got } = failure;
  
  // No results
  if (!got) {
    categories.noResults.push(failure);
    return;
  }
  
  // Missing first letter (iale → aile, alai → balai)
  if (query.length > 0 && expected.length > 0) {
    const firstWord = query.split(' ')[0];
    const expectedFirst = expected.split(' ')[0];
    if (firstWord.length > 2 && expectedFirst.startsWith(firstWord.slice(1))) {
      categories.missingFirstLetter.push(failure);
      return;
    }
  }
  
  // Typo not corrected (garafe → agrafe, garaffe → agraffe)
  if (query.includes('garafe') || query.includes('garaffe') || query.includes('graffe')) {
    categories.typoNotCorrected.push(failure);
    return;
  }
  
  // Plural mismatch (agraffe → agrafe, agraffes → agrafe)
  if (expected.includes('AGRAFFE') && got.includes('AGRAFE') && !got.includes('AGRAFFE')) {
    categories.pluralMismatch.push(failure);
    return;
  }
  
  // Concatenated words (baguesynchroboitevitesse)
  if (query.length > 15 && !query.includes(' ')) {
    categories.concatenatedWords.push(failure);
    return;
  }
  
  // Variant mismatch (AGRAPHE vs AGRAFE vs AGRAFFE)
  if ((expected.includes('AGRAPHE') || expected.includes('AGRAFFE')) && 
      (got.includes('AGRAFE') || got.includes('AGRAFFE'))) {
    categories.variantMismatch.push(failure);
    return;
  }
  
  // Position confusion (ar d → ar g, av d → av g)
  const queryPos = query.match(/\b(av|ar|avant|arriere)\s+(d|g|droite|gauche)\b/i);
  const expectedPos = expected.match(/\b(AV|AR)\s+(D|G)\b/);
  const gotPos = got.match(/\b(AV|AR)\s+(D|G)\b/);
  if (queryPos && expectedPos && gotPos && expectedPos[2] !== gotPos[2]) {
    categories.positionConfusion.push(failure);
    return;
  }
  
  // Wrong part returned (completely different)
  categories.wrongPartReturned.push(failure);
});

// Generate report
console.log('📊 FAILURE ANALYSIS REPORT\n');
console.log('='.repeat(80));
console.log(`Total Failures: ${report.failures.length}\n`);

const sortedCategories = Object.entries(categories)
  .sort((a, b) => b[1].length - a[1].length);

sortedCategories.forEach(([category, failures]) => {
  const percentage = ((failures.length / report.failures.length) * 100).toFixed(1);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📌 ${category.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}`);
  console.log(`   Count: ${failures.length} (${percentage}%)`);
  console.log(`${'='.repeat(80)}`);
  
  failures.slice(0, 10).forEach((f, i) => {
    console.log(`\n${i + 1}. Query: "${f.query}"`);
    console.log(`   Expected: ${f.expected}`);
    console.log(`   Got: ${f.got || 'Nothing'}`);
  });
  
  if (failures.length > 10) {
    console.log(`\n   ... and ${failures.length - 10} more`);
  }
});

// Summary with recommendations
console.log('\n\n' + '='.repeat(80));
console.log('🎯 RECOMMENDATIONS\n');

const recommendations = {
  noResults: '❌ Add missing parts to synonym map or improve fuzzy matching',
  typoNotCorrected: '❌ Enhance typo correction rules (garafe→agrafe, garaffe→agraffe)',
  pluralMismatch: '❌ Fix plural/variant matching (agraffe vs agrafe)',
  missingFirstLetter: '❌ Improve fuzzy matching for missing first letter',
  concatenatedWords: '❌ Better word segmentation for concatenated queries',
  wrongPartReturned: '❌ Improve scoring to prioritize correct parts',
  variantMismatch: '❌ Add all variants to synonym map (agraphe/agrafe/agraffe)',
  positionConfusion: '❌ Strengthen position validation in scoring'
};

sortedCategories.forEach(([category, failures]) => {
  if (failures.length > 0) {
    const percentage = ((failures.length / report.failures.length) * 100).toFixed(1);
    console.log(`${percentage.padStart(5)}% - ${recommendations[category]}`);
  }
});

console.log('\n' + '='.repeat(80));

// Save detailed report
const detailedReport = {
  timestamp: new Date().toISOString(),
  totalFailures: report.failures.length,
  categories: Object.fromEntries(
    Object.entries(categories).map(([key, failures]) => [
      key,
      {
        count: failures.length,
        percentage: ((failures.length / report.failures.length) * 100).toFixed(1),
        examples: failures.slice(0, 20)
      }
    ])
  )
};

fs.writeFileSync('failure-analysis.json', JSON.stringify(detailedReport, null, 2));
console.log('\n💾 Detailed analysis saved to: failure-analysis.json\n');
