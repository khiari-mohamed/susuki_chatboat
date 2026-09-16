/**
 * test-celerio-vs-db.js
 *
 * For each test query, checks BOTH:
 *   1. What the DB actually has for this VIN (ground truth)
 *   2. What the chatbot API returns
 *
 * Then compares: did the bot return the right part?
 *
 * VIN: MA3KFC42S00767107 (CELERIO GL-POP, type AVH310-TYPE2)
 */

const { Client } = require('pg');
const axios = require('axios');
require('dotenv').config();

const VIN = 'MA3KFC42S00767107';
const TYPE_CODE = 'AVH310-TYPE2';
const API_URL = 'http://localhost:8000/chat/message';

const DB_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public';

// ─── Test cases ────────────────────────────────────────────────────────────────
// Each test has:
//   query        : what the user types
//   expectedName : substring that MUST appear in the top result's designation_2
//                  (case-insensitive, normalized). null = expect 0 results.
//   note         : human description
const TESTS = [
  { query: 'pare brise',              expectedName: 'pare brise',         note: 'Pare-brise' },
  { query: 'pare choc avant',         expectedName: 'pare choc av',       note: 'Pare-choc avant' },
  { query: 'pare boue arriere',       expectedName: 'pare boue',          note: 'Pare-boue arrière (direct)' },
  { query: 'pare soleil',             expectedName: 'pare soleil',        note: 'Pare-soleil' },
  { query: 'support de pare-choc',    expectedName: 'support pare choc',  note: 'Support pare-choc' },
  { query: 'aileron arriere sport',   expectedName: null,                 note: 'Aileron (inexistant → 0 résultat attendu)' },
  { query: 'capot',                   expectedName: 'capot',              note: 'Capot' },
  { query: 'retroviseur',             expectedName: 'retroviseur',        note: 'Rétroviseur (sans côté)' },
  { query: 'retroviseur d',           expectedName: 'retroviseur d',      note: 'Rétroviseur droit' },
  { query: 'charniere de capot',      expectedName: 'charniere capot',    note: 'Charnière de capot' },
  { query: 'filtre a air',            expectedName: 'filtre a air',       note: 'Filtre à air' },
  { query: 'plakete frain avent dro', expectedName: 'plaquette',          note: 'Plaquettes frein AV D (tunisien)' },
];

// ─── DB helpers ────────────────────────────────────────────────────────────────
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Query the DB directly: find parts compatible with TYPE_CODE whose
 * designation_2 contains ALL of the search tokens.
 */
async function dbSearch(client, tokens) {
  // Build WHERE: each token must appear in designation_2 (case-insensitive)
  const conditions = tokens
    .map((_, i) => `unaccent(lower(p.designation_2)) LIKE unaccent(lower($${i + 1}))`)
    .join(' AND ');

  const values = tokens.map(t => `%${t}%`);

  const sql = `
    SELECT DISTINCT
      p.id,
      p.designation_2,
      p.designation,
      p.reference,
      p.prix_ttc,
      s.stock_consolide
    FROM parts p
    JOIN fitment f ON f.part_reference = p.reference
    LEFT JOIN stock s ON s.reference = p.reference
    WHERE f.type_code = $${tokens.length + 1}
      AND ${conditions}
    ORDER BY p.designation_2
    LIMIT 20
  `;

  try {
    const res = await client.query(sql, [...values, TYPE_CODE]);
    return res.rows;
  } catch (e) {
    // unaccent extension might not be installed — fallback without it
    const conditionsFallback = tokens
      .map((_, i) => `lower(p.designation_2) LIKE lower($${i + 1})`)
      .join(' AND ');
    const sqlFallback = `
      SELECT DISTINCT
        p.id,
        p.designation_2,
        p.designation,
        p.reference,
        p.prix_ttc,
        s.stock_consolide
      FROM parts p
      JOIN fitment f ON f.part_reference = p.reference
      LEFT JOIN stock s ON s.reference = p.reference
      WHERE f.type_code = $${tokens.length + 1}
        AND ${conditionsFallback}
      ORDER BY p.designation_2
      LIMIT 20
    `;
    const res2 = await client.query(sqlFallback, [...values, TYPE_CODE]);
    return res2.rows;
  }
}

// ─── API helper ────────────────────────────────────────────────────────────────
async function apiSearch(query) {
  try {
    const res = await axios.post(API_URL, {
      message: query,
      vehicle: {
        vin: VIN,
        model: 'CELERIO',
        modeleIdentifie: 'CELERIO GL-POP',
        typeCode: TYPE_CODE,
      },
      sessionId: `test-${Date.now()}`,
    }, { timeout: 15000 });

    const body = res.data || {};
    const products = body.productsDetail || body.products || [];
    return { products, response: body.response || '' };
  } catch (e) {
    return { products: [], response: '', error: e.message };
  }
}

// ─── Token extraction (mirrors what the search service does) ──────────────────
const TN_MAP = {
  plakete: 'plaquette', plakette: 'plaquette',
  frain: 'frein', avent: 'avant', dro: 'droit',
  brise: 'brise',
};

function extractSearchTokens(query) {
  const norm = normalize(query);
  const stopWords = ['je', 'cherche', 'un', 'une', 'des', 'le', 'la', 'les',
    'de', 'du', 'pour', 'ma', 'mon', 'mes', 'veux', 'besoin', 'sport'];
  return norm
    .split(/\s+/)
    .filter(t => t.length >= 3 && !stopWords.includes(t))
    .map(t => TN_MAP[t] || t);
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  console.log('');
  console.log('═'.repeat(90));
  console.log('  CELERIO PARTS TEST — DB ground truth vs Chatbot API');
  console.log(`  VIN: ${VIN}  |  Type: ${TYPE_CODE}`);
  console.log('═'.repeat(90));

  const results = [];

  for (const test of TESTS) {
    const tokens = extractSearchTokens(test.query);

    // 1. DB ground truth
    const dbRows = tokens.length > 0 ? await dbSearch(client, tokens) : [];
    const dbHasExpected = test.expectedName === null
      ? dbRows.length === 0
      : dbRows.some(r => normalize(r.designation_2).includes(normalize(test.expectedName)));

    // 2. API result
    const { products, response, error } = await apiSearch(test.query);
    const topProduct = products[0] || null;
    const topName = normalize(topProduct?.designation2 || topProduct?.designation_2 || topProduct?.designation || '');
    const apiHasExpected = test.expectedName === null
      ? products.length === 0
      : topName.includes(normalize(test.expectedName));

    // 3. Verdict
    const dbStatus  = dbHasExpected  ? '✅ DB OK'  : '❌ DB MISS';
    const apiStatus = apiHasExpected ? '✅ API OK' : '❌ API WRONG';

    // Overall: PASS only if both agree with expectation
    const pass = dbHasExpected && apiHasExpected;

    results.push({ test, tokens, dbRows, topProduct, topName, dbStatus, apiStatus, pass, error });

    // Print row
    console.log('');
    console.log(`┌─ [${pass ? 'PASS' : 'FAIL'}] ${test.note}`);
    console.log(`│  Query   : "${test.query}"  →  tokens: [${tokens.join(', ')}]`);
    console.log(`│  Expected: "${test.expectedName ?? '(aucun résultat)'}"`);
    console.log(`│  DB (${String(dbRows.length).padStart(2)} rows): ${dbStatus}`);
    if (dbRows.length > 0) {
      dbRows.slice(0, 3).forEach(r =>
        console.log(`│    • ${r.designation_2} [${r.reference}] stock=${r.stock_consolide ?? '?'}`)
      );
      if (dbRows.length > 3) console.log(`│    … +${dbRows.length - 3} more`);
    }
    console.log(`│  API (${String(products.length).padStart(2)} parts): ${apiStatus}`);
    if (topProduct) {
      const name = topProduct.designation2 || topProduct.designation_2 || topProduct.designation || '?';
      const ref  = topProduct.reference || '?';
      console.log(`│    Top: ${name} [${ref}]`);
    } else if (error) {
      console.log(`│    Error: ${error}`);
    } else {
      console.log(`│    (aucun résultat)`);
    }
    console.log('└' + '─'.repeat(70));
  }

  await client.end();

  // ─── Summary ────────────────────────────────────────────────────────────────
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;

  console.log('');
  console.log('═'.repeat(90));
  console.log('  SUMMARY');
  console.log('═'.repeat(90));
  console.log(`  Total : ${results.length}`);
  console.log(`  PASS  : ${passed}`);
  console.log(`  FAIL  : ${failed}`);
  console.log('');

  // Breakdown: DB miss vs API wrong
  const dbMisses  = results.filter(r => !r.pass && !r.dbRows.some(row =>
    r.test.expectedName && normalize(row.designation_2).includes(normalize(r.test.expectedName))
  ));
  const apiWrong  = results.filter(r => !r.pass && r.test.expectedName !== null &&
    r.dbRows.some(row => normalize(row.designation_2).includes(normalize(r.test.expectedName)))
  );

  if (dbMisses.length > 0) {
    console.log('  ❌ DB MISSES (données manquantes — fitment absent pour ce véhicule):');
    dbMisses.forEach(r => console.log(`     • "${r.test.query}" → "${r.test.expectedName}"`));
    console.log('');
  }
  if (apiWrong.length > 0) {
    console.log('  ❌ API WRONG (la pièce existe en DB mais le bot retourne autre chose):');
    apiWrong.forEach(r => {
      const got = r.topProduct
        ? (r.topProduct.designation2 || r.topProduct.designation_2 || r.topProduct.designation || '?')
        : '(aucun résultat)';
      console.log(`     • "${r.test.query}" → attendu: "${r.test.expectedName}" | reçu: "${got}"`);
    });
    console.log('');
  }

  console.log('═'.repeat(90));
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
