import axios from 'axios';

const API_URL = 'http://localhost:8000/chat/message';
const VEHICLE = { marque: 'SUZUKI', modele: 'S-PRESSO', annee: 2024, immatriculation: '243TUNIS4698' };

let sessionId = null;

async function chat(message, vehicle = VEHICLE) {
  const response = await axios.post(API_URL, { message, vehicle, sessionId });
  sessionId = response.data.sessionId;
  return response.data;
}

function resetSession() {
  sessionId = null;
}

function extractProduct(response) {
  if (!response || !response.response) return null;
  if (response.products && response.products.length > 0) {
    return response.products[0].designation;
  }
  const match = response.response.match(/^([A-Z][A-Z\s]+?)(?:\s+pour|\s+Réf)/);
  return match ? match[1].trim() : null;
}

console.log('🔥 FAILURE-FOCUSED TEST\n');

// ============================================================================
// BUG 1: Context Maintenance - filtre → huile
// ============================================================================
console.log('🐛 BUG 1: Context Maintenance (filtre → huile)');
console.log('='.repeat(80));
resetSession();
const r1 = await chat('filtre');
console.log(`Step 1: "filtre" → ${r1.intent}`);
console.log(`Response: ${r1.response.substring(0, 100)}...`);

const r2 = await chat('huile');
const product = extractProduct(r2);
console.log(`Step 2: "huile" → ${r2.intent}`);
console.log(`Product: ${product || 'NO PRODUCT'}`);
console.log(`Expected: FILTRE A HUILE`);
console.log(`Status: ${product && product.includes('FILTRE') && product.includes('HUILE') ? '✅ FIXED' : '❌ STILL BROKEN'}\n`);

// ============================================================================
// BUG 2: filtre air returns wrong products
// ============================================================================
console.log('🐛 BUG 2: "filtre air" returns wrong products');
console.log('='.repeat(80));
resetSession();
const r3 = await chat('filtre air');
const product2 = extractProduct(r3);
console.log(`Query: "filtre air" → ${r3.intent}`);
console.log(`Product: ${product2 || 'NO PRODUCT'}`);
console.log(`Expected: FILTRE A AIR`);
console.log(`Status: ${product2 && product2.includes('FILTRE') && product2.includes('AIR') && !product2.includes('HUILE') ? '✅ FIXED' : '❌ STILL BROKEN'}\n`);

// ============================================================================
// BUG 3: boujie returns P/BOUE instead of spark plugs
// ============================================================================
console.log('🐛 BUG 3: "boujie" (bougie typo) returns mud flaps');
console.log('='.repeat(80));
resetSession();
const r4 = await chat('boujie');
const product3 = extractProduct(r4);
console.log(`Query: "boujie" → ${r4.intent}`);
console.log(`Product: ${product3 || 'NO PRODUCT'}`);
console.log(`Expected: BOUGIE (spark plug)`);
console.log(`Status: ${product3 && product3.includes('BOUGIE') ? '✅ FIXED' : '❌ STILL BROKEN (returns P/BOUE)'}\n`);

// ============================================================================
// BUG 4: amortisseur avant asks for side (should return products)
// ============================================================================
console.log('🐛 BUG 4: "amortisseur avant" asks for side clarification');
console.log('='.repeat(80));
resetSession();
const r5 = await chat('amortisseur avant');
const product4 = extractProduct(r5);
const needsClarification = r5.intent === 'CLARIFICATION_NEEDED';
console.log(`Query: "amortisseur avant" → ${r5.intent}`);
console.log(`Product: ${product4 || 'CLARIFICATION ASKED'}`);
console.log(`Expected: Should return products with AV (or ask for side is acceptable)`);
console.log(`Status: ${needsClarification ? '⚠️ ASKS FOR SIDE (acceptable)' : product4 ? '✅ RETURNS PRODUCTS' : '❌ BROKEN'}\n`);

// ============================================================================
// BUG 5: Reference 00325 not found (exists in DB)
// ============================================================================
console.log('🐛 BUG 5: Reference "00325" not found');
console.log('='.repeat(80));
resetSession();
const r6 = await chat('00325');
const product5 = extractProduct(r6);
console.log(`Query: "00325" → ${r6.intent}`);
console.log(`Product: ${product5 || 'NO PRODUCT'}`);
console.log(`Expected: filtre (reference exists in DB)`);
console.log(`Status: ${product5 ? '✅ FIXED' : '❌ STILL BROKEN'}\n`);

console.log('='.repeat(80));
console.log('🎯 SUMMARY: Focus on fixing these 5 critical bugs');
console.log('='.repeat(80));
