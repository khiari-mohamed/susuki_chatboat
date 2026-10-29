'use strict';
/**
 * test-ui-chatbot-20.js
 *
 * Picks 20 cases from ui-chatbot-50-prompts.md, hits POST /chat/message,
 * and scores every response with 100% exact-match accuracy.
 * ANY deviation from the expected DB facts = FAIL (score < 100 = FAIL).
 *
 * Usage:
 *   node test-ui-chatbot-20.js
 *   node test-ui-chatbot-20.js --cases=1,3,7,14
 *   node test-ui-chatbot-20.js --verbose
 */

const fs   = require('node:fs');
const path = require('node:path');
const http = require('node:http');

// ─── Config ──────────────────────────────────────────────────────
const API_BASE   = process.env.CHAT_API_BASE || 'http://localhost:8000';
const CHAT_PATH  = '/chat/message';
const VIN_PATH   = '/verification/vin';
const MD_FILE    = process.env.CASES_FILE ? path.resolve(process.env.CASES_FILE) : path.resolve(__dirname, 'ui-chatbot-50-prompts.md');
const VERBOSE    = process.argv.includes('--verbose');
const TIMEOUT_MS = 30_000;

const DEFAULT_CASE_COUNT = 20;

// Business rule (must match business-rules.constants.ts exactly)
const MIN_AVAILABLE_STOCK = 2;
const PUBLIC_PRICE_SOURCE  = '01_PROD';
const COMPTOIR_PHONE       = '70 603 518 – 70 603 519';
const COMPTOIR_MSG         = `Veuillez contacter Car Pro – Comptoir Pièces de Rechange Tél N° ${COMPTOIR_PHONE}`;

// ─── Colours ─────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', grey: '\x1b[90m', blue: '\x1b[34m', magenta: '\x1b[35m',
};
const g   = s => `${C.green}${s}${C.reset}`;
const r   = s => `${C.red}${s}${C.reset}`;
const y   = s => `${C.yellow}${s}${C.reset}`;
const b   = s => `${C.cyan}${s}${C.reset}`;
const dim = s => `${C.grey}${s}${C.reset}`;
const bld = s => `${C.bold}${s}${C.reset}`;

// ─── MD Parser ───────────────────────────────────────────────────
function parseMd(mdText) {
  const cases = [];
  const headers = [...mdText.matchAll(/^## Case (\d+)/gm)];
  const blocks  = mdText.split(/^## Case \d+/m).slice(1);

  blocks.forEach((block, i) => {
    const no = Number(headers[i][1]);
    const field = (regex) => (block.match(regex) || [])[1]?.trim() || null;
    const numberField = (regex) => {
      const value = field(regex);
      return value === null ? null : Number(value);
    };

    const vin = field(/Enter this VIN.*?:\s*([A-HJ-NPR-Z0-9]{17})/i);
    const model = field(/Expected validated vehicle:\s*SUZUKI\s+(.+)$/im);
    const vehicleNo = field(/Vehicle number.*?:\s*(VN\d+)/i);
    const typeCode = field(/DB type code.*?:\s*([A-Z0-9]+-TYPE\d+)/i);
    const promptBlock = (block.split('**UI prompt**')[1] || '').split('**DB facts for comparison')[0];
    const turnMatches = [...promptBlock.matchAll(/^\*\*Turn\s+\d+:\*\*\s*(.+)$/gm)];
    const turns = turnMatches.length
      ? turnMatches.map((match) => match[1].trim())
      : [promptBlock.replace(/\r/g, '').split('\n').map((line) => line.trim()).filter(Boolean).join(' ').trim()].filter(Boolean);

    const fitmentLine = field(/- Fitment rows \(\d+\):\s*([^\n]+)/);
    const fitments = [...(fitmentLine || '').matchAll(/modelName=([^;|]+);\s*typeCode=([^|]+)/g)]
      .map((match) => ({ modelName: match[1].trim(), typeCode: match[2].trim() }));
    const itemReferenceLine = field(/- Alternate\/item reference rows \(\d+\):\s*([^\n]+)/);
    const itemReferences = [...(itemReferenceLine || '').matchAll(/referenceNo=([^;|]+);\s*referenceType=([^|]+)/g)]
      .map((match) => ({ referenceNo: match[1].trim(), referenceType: match[2].trim() }));
    const stockLine = field(/- Stock row:\s*([^\n]+)/);
    const matchedVehicleLine = field(/- Matched vehicle row:\s*([^\n]+)/);

    cases.push({
      no,
      vin,
      model,
      vehicleNo,
      typeCode,
      turns,
      db: {
        id: numberField(/- Part DB id:\s*(\d+)/),
        reference: field(/- Référence DB:\s*(\S+)/),
        designation2: field(/- Désignation française[^:]*:\s*(.+)/),
        designation: field(/- Désignation OEM[^:]*:\s*(.+)/),
        searchDescription: field(/- Search description:\s*(.+)/),
        priceTtc: numberField(/- Public price TTC:\s*([\d.]+)\s*TND/),
        rawPriceTtc: numberField(/- Public price TTC:.*?raw DB=([\d.]+)/),
        priceHt: numberField(/- Wholesale\/pre-tax price HT:\s*([\d.]+)\s*TND/),
        rawPriceHt: numberField(/- Wholesale\/pre-tax price HT:.*?raw DB=([\d.]+)/),
        unit: field(/- Unit:\s*(.+)/),
        category: field(/- Category:\s*(.+)/),
        manufacturer: field(/- Manufacturer:\s*(.+)/),
        supplierCode: field(/- Supplier code:\s*(.+)/),
        source: field(/- Source:\s*(\S+)/),
        stock: {
          id: Number((stockLine?.match(/id=(\d+)/) || [])[1]),
          reference: (stockLine?.match(/reference=([^;]+)/) || [])[1]?.trim() || null,
          totalQuantity: Number((stockLine?.match(/totalQuantity=(\d+)/) || [])[1]),
          stockDisponible: Number((stockLine?.match(/stockDisponible=(\d+)/) || [])[1]),
          stockConsolide: Number((stockLine?.match(/stockConsolide=(\d+)/) || [])[1]),
          statut: (stockLine?.match(/statut=([^;]+)/) || [])[1]?.trim() || null,
        },
        expected: field(/Availability rule:.*?expected=(available|unavailable)/),
        fitments,
        itemReferences,
        matchedVehicle: {
          vehicleNo: (matchedVehicleLine?.match(/vehicleNo=([^;]+)/) || [])[1]?.trim() || null,
          vin: (matchedVehicleLine?.match(/VIN=([^;]+)/) || [])[1]?.trim() || null,
          make: (matchedVehicleLine?.match(/marque=([^;]+)/) || [])[1]?.trim() || null,
          model: (matchedVehicleLine?.match(/modele=([^;]+)/) || [])[1]?.trim() || null,
          typeCode: (matchedVehicleLine?.match(/typeCode=([^;]+)/) || [])[1]?.trim() || null,
        },
      },
    });
  });
  return cases;
}

function chooseCases(cases, count = DEFAULT_CASE_COUNT) {
  if (count <= 1) return cases.length ? [cases[0]] : [];
  if (cases.length <= count) return cases;
  const indexes = new Set();
  for (let i = 0; i < count; i++) {
    indexes.add(Math.round(i * (cases.length - 1) / (count - 1)));
  }
  return [...indexes].sort((a, b) => a - b).map((index) => cases[index]);
}

function validateCaseData(testCase) {
  const missing = [];
  const { db } = testCase;
  for (const [name, value] of Object.entries({
    vin: testCase.vin,
    model: testCase.model,
    vehicleNo: testCase.vehicleNo,
    typeCode: testCase.typeCode,
    prompt: testCase.turns[0],
    partId: db.id,
    reference: db.reference,
    frenchDesignation: db.designation2,
    oemDesignation: db.designation,
    searchDescription: db.searchDescription,
    publicPrice: db.priceTtc,
    wholesalePrice: db.priceHt,
    unit: db.unit,
    category: db.category,
    manufacturer: db.manufacturer,
    supplierCode: db.supplierCode,
    source: db.source,
    consolidatedStock: db.stock.stockConsolide,
    expectedAvailability: db.expected,
    fitments: db.fitments.length,
    matchedVin: db.matchedVehicle.vin,
    matchedVehicleNo: db.matchedVehicle.vehicleNo,
    matchedTypeCode: db.matchedVehicle.typeCode,
  })) {
    if (value === null || value === undefined || value === '' ||
        (typeof value === 'number' && !Number.isFinite(value)) || (name === 'fitments' && value === 0)) {
      missing.push(name);
    }
  }
  if (!Number.isFinite(db.rawPriceTtc)) missing.push('raw public TTC price');
  if (!Number.isFinite(db.rawPriceHt)) missing.push('raw wholesale HT price');
  if (db.reference !== db.stock.reference) missing.push('parts/stock reference mismatch');
  if (db.expected !== (db.stock.stockConsolide >= MIN_AVAILABLE_STOCK ? 'available' : 'unavailable')) {
    missing.push('availability does not match consolidated-stock rule');
  }
  if (!db.fitments.some((fitment) => fitment.typeCode === testCase.typeCode)) {
    missing.push('expected VIN typeCode absent from part fitments');
  }
  if (db.matchedVehicle.vin !== testCase.vin || db.matchedVehicle.vehicleNo !== testCase.vehicleNo ||
      db.matchedVehicle.typeCode !== testCase.typeCode || db.matchedVehicle.model !== testCase.model ||
      db.matchedVehicle.make !== 'SUZUKI') {
    missing.push('matched vehicle facts do not match vehicle setup');
  }
  return [...new Set(missing)];
}

// ─── HTTP ────────────────────────────────────────────────────────
function postJson(urlStr, body) {
  return new Promise((resolve, reject) => {
    const url  = new URL(urlStr);
    const data = JSON.stringify(body);
    console.log(dim(`[HTTP] --> POST ${urlStr}`));
    const req  = http.request({
      hostname: url.hostname, port: url.port || 80, path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, res => {
      console.log(dim(`[HTTP] <-- ${res.statusCode} ${urlStr}`));
      let raw = '';
      res.on('data', c => { raw += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.write(data); req.end();
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postVinWithRateLimitRetry(vin) {
  let result = await postJson(`${API_BASE}${VIN_PATH}`, { vin });
  if (result.body?.limitReached) {
    console.log(y('[RATE LIMIT] VIN validation is throttled; waiting 61 seconds, then retrying once.'));
    await wait(61_000);
    result = await postJson(`${API_BASE}${VIN_PATH}`, { vin });
  }
  return result;
}

function scoreVinValidation(apiResp, testCase) {
  const info = apiResp.body?.vehicleInfo ?? null;
  const checks = [];
  const add = (label, actual, expected) => checks.push({
    id: checks.length + 1,
    label,
    passed: actual === expected,
    expected: String(expected),
    got: String(actual),
  });

  add('VIN endpoint HTTP status', apiResp.status, 201);
  add('VIN validation success', apiResp.body?.success, true);
  add('Validated VIN exact', info?.vin, testCase.vin);
  add('Validated vehicle number exact', info?.vehicleNo, testCase.vehicleNo);
  add('Validated make exact', info?.marque, 'SUZUKI');
  add('Validated model exact', info?.modele, testCase.model);
  add('Validated typeCode exact', info?.typeCode, testCase.typeCode);
  add('VIN marked validated', info?.vinValidated, true);

  const passed = checks.filter((check) => check.passed).length;
  return { checks, total: checks.length, passed, score: Math.round(passed / checks.length * 100), ok: passed === checks.length, vehicleInfo: info };
}

// ─── Accuracy Scoring Engine ─────────────────────────────────────
function sortedFitments(rows = []) {
  return rows.map((row) => `${row.modelName}|${row.typeCode}`).sort();
}

function sortedReferences(rows = []) {
  return rows.map((row) => {
    const value = row.referenceType == null ? '' : String(Number(row.referenceType));
    return `${row.referenceNo}|${Number.isFinite(Number(row.referenceType)) ? value : String(row.referenceType)}`;
  }).sort();
}

function exactNumber(actual, expected) {
  return Number.isFinite(Number(actual)) && Number.isFinite(Number(expected)) &&
    Math.abs(Number(actual) - Number(expected)) < 1e-9;
}

function scoreResponse(apiResp, testCase, turnPrompt, vinValidation) {
  const checks = [];
  const body = typeof apiResp.body === 'object' && apiResp.body ? apiResp.body : {};
  const db = testCase.db;
  const responseText = typeof body.response === 'string' ? body.response : '';
  const products = Array.isArray(body.productsDetail) ? body.productsDetail : [];
  const product = products[0] ?? null;
  const searchDebug = body.searchDebug ?? null;
  const scope = searchDebug?.vehicleScope ?? null;
  const identification = product?.identificationSource ?? null;
  const stock = product?.stock ?? null;
  const expectedStatus = db.expected === 'available' ? 'Disponible' : 'Indisponible';

  const chk = (label, passed, expected, got) => checks.push({
    id: checks.length + 1,
    label,
    passed: Boolean(passed),
    expected: expected === undefined ? '—' : String(expected),
    got: got === undefined ? '—' : String(got),
  });

  chk('HTTP status is 201', apiResp.status === 201, 201, apiResp.status);
  chk('API response is non-empty', responseText.length > 0, 'non-empty', responseText || 'EMPTY');
  chk('HTTP response contains UI text unchanged', body.response === responseText && responseText.length > 0,
    'body.response string rendered verbatim', typeof body.response);
  chk('Intent is not a refusal/error', !['SECURISATION', 'ERROR', 'NO_RESULTS'].includes(body.intent),
    'resolved parts intent', body.intent);
  chk('Exactly one expected product is returned', products.length === 1, 1, products.length);

  chk('VIN validation is successful', vinValidation?.success === true, true, vinValidation?.success);
  chk('VIN endpoint canonical VIN exact', vinValidation?.vehicleInfo?.vin === testCase.vin, testCase.vin, vinValidation?.vehicleInfo?.vin);
  chk('VIN endpoint vehicle number exact', vinValidation?.vehicleInfo?.vehicleNo === testCase.vehicleNo, testCase.vehicleNo, vinValidation?.vehicleInfo?.vehicleNo);
  chk('VIN endpoint model exact', vinValidation?.vehicleInfo?.modele === testCase.model, testCase.model, vinValidation?.vehicleInfo?.modele);
  chk('VIN endpoint typeCode exact', vinValidation?.vehicleInfo?.typeCode === testCase.typeCode, testCase.typeCode, vinValidation?.vehicleInfo?.typeCode);

  chk('Search debug exists', !!searchDebug, 'searchDebug object', searchDebug ? 'present' : 'missing');
  chk('VIN scope active', scope?.active === true, true, scope?.active);
  chk('Search VIN exact', scope?.vin === testCase.vin, testCase.vin, scope?.vin);
  chk('Search vehicle number exact', scope?.vehicleNo === testCase.vehicleNo, testCase.vehicleNo, scope?.vehicleNo);
  chk('Search model exact', scope?.model === testCase.model, testCase.model, scope?.model);
  chk('Search typeCodes exactly match case', JSON.stringify(scope?.typeCodes) === JSON.stringify([testCase.typeCode]),
    [testCase.typeCode], scope?.typeCodes);
  chk('Search primaryTypeCodes exactly match case', JSON.stringify(scope?.primaryTypeCodes) === JSON.stringify([testCase.typeCode]),
    [testCase.typeCode], scope?.primaryTypeCodes);

  chk('Product DB id exact', product?.id === db.id, db.id, product?.id);
  chk('Product reference exact', product?.reference === db.reference, db.reference, product?.reference);
  chk('French designation exact', product?.designation2 === db.designation2, db.designation2, product?.designation2);
  chk('Display name exact French designation', product?.displayName === db.designation2, db.designation2, product?.displayName);
  chk('OEM designation exact', product?.designation === db.designation, db.designation, product?.designation);
  chk('Search description exact', product?.searchDescription === db.searchDescription, db.searchDescription, product?.searchDescription);
  chk('Unit exact', product?.unite === db.unit, db.unit, product?.unite);
  chk('Category exact', product?.categorie === db.category, db.category, product?.categorie);
  chk('Manufacturer exact', product?.fabricant === db.manufacturer, db.manufacturer, product?.fabricant);
  chk('Supplier code exact', product?.fournisseurCode === db.supplierCode, db.supplierCode, product?.fournisseurCode);
  chk('Source exact', product?.source === db.source, db.source, product?.source);

  const expectedTtc = db.source === PUBLIC_PRICE_SOURCE ? db.rawPriceTtc : null;
  const expectedHt = db.rawPriceHt;
  chk('Public TTC exact DB value', expectedTtc === null ? product?.prixTtc === null : exactNumber(product?.prixTtc, expectedTtc),
    expectedTtc, product?.prixTtc);
  chk('Wholesale HT exact DB value', exactNumber(product?.prixHt, expectedHt), expectedHt, product?.prixHt);

  chk('Stock totalQuantity exact', stock?.totalQuantity === db.stock.totalQuantity, db.stock.totalQuantity, stock?.totalQuantity);
  chk('Stock stockDisponible exact', stock?.stockDisponible === db.stock.stockDisponible, db.stock.stockDisponible, stock?.stockDisponible);
  chk('Stock stockConsolide exact', stock?.stockConsolide === db.stock.stockConsolide, db.stock.stockConsolide, stock?.stockConsolide);
  chk('Availability status follows stockConsolide rule', stock?.statut === expectedStatus, expectedStatus, stock?.statut);

  const expectedFitments = sortedFitments(db.fitments);
  const actualFitments = sortedFitments(product?.fitments);
  chk('Complete fitment rows exact', JSON.stringify(actualFitments) === JSON.stringify(expectedFitments),
    expectedFitments, actualFitments);
  const expectedItemRefs = sortedReferences(db.itemReferences);
  const actualItemRefs = sortedReferences(product?.itemReferences);
  chk('Alternate references exact', JSON.stringify(actualItemRefs) === JSON.stringify(expectedItemRefs),
    expectedItemRefs, actualItemRefs);

  chk('Product identification VIN exact', identification?.vin === testCase.vin, testCase.vin, identification?.vin);
  chk('Product identification vehicleNo exact', identification?.vehicleNo === testCase.vehicleNo, testCase.vehicleNo, identification?.vehicleNo);
  chk('Product identification model exact', identification?.model === testCase.model, testCase.model, identification?.model);
  chk('Product identification modelDescription exact', identification?.modelDescription === vinValidation?.vehicleInfo?.modeleDescription,
    vinValidation?.vehicleInfo?.modeleDescription, identification?.modelDescription);
  chk('Product identification typeCodes exact', JSON.stringify(identification?.typeCodes) === JSON.stringify([testCase.typeCode]),
    [testCase.typeCode], identification?.typeCodes);
  chk('Product identification articleNumber exact', identification?.articleNumber === db.reference, db.reference, identification?.articleNumber);

  chk('UI response contains the exact French designation', responseText.includes(db.designation2), db.designation2, responseText.includes(db.designation2));
  chk('UI response is not a false security refusal', !/Je ne peux pas confirmer cette pièce/i.test(responseText),
    'no security refusal for known exact row', responseText);
  if (db.expected === 'available') {
    chk('UI response states available, not unavailable', /disponible/i.test(responseText) && !/indisponible/i.test(responseText),
      'available only', responseText);
    chk('UI response exposes exact TTC to 3 decimals', db.source !== PUBLIC_PRICE_SOURCE || responseText.includes(`${db.priceTtc.toFixed(3)} TND`),
      `${db.priceTtc.toFixed(3)} TND`, responseText);
    chk('UI response does not leak HT price', !responseText.includes(db.priceHt.toFixed(3)), 'HT absent', responseText.includes(db.priceHt.toFixed(3)) ? 'HT found' : 'absent');
  } else {
    chk('UI response states unavailable', /indisponible|pas disponible|n'est pas disponible/i.test(responseText),
      'unavailable', responseText);
    chk('Unavailable UI response contains no public price', !responseText.includes(`${db.priceTtc.toFixed(3)} TND`),
      'public price absent', responseText.includes(`${db.priceTtc.toFixed(3)} TND`) ? 'price found' : 'absent');
    chk('Unavailable UI response includes Comptoir phone', responseText.includes(COMPTOIR_PHONE), COMPTOIR_PHONE, responseText);
  }

  const passed = checks.filter((check) => check.passed).length;
  const total = checks.length;
  const score = total ? Math.round((passed / total) * 100) : 0;
  return { checks, total, passed, score, ok: passed === total && total > 0 };
}

// ─── Debug Printer ───────────────────────────────────────────────
function printDebug(apiResp, caseNo, turnIdx) {
  const body = (typeof apiResp.body === 'object') ? apiResp.body : {};
  const sd   = body.searchDebug ?? null;
  const verif= body.metadata?.verification ?? null;
  const trace= body.metadata?.trace ?? null;
  const p0   = (body.productsDetail ?? body.products ?? [])[0] ?? null;

  console.log(dim(`\n  ┌─ DEBUG Case ${caseNo} Turn ${turnIdx+1} ${'─'.repeat(50)}`));
  console.log(dim(`  │ HTTP status       : ${apiResp.status}`));
  console.log(dim(`  │ intent            : ${body.intent}`));
  console.log(dim(`  │ confidence        : ${body.confidence}`));
  console.log(dim(`  │ sessionId         : ${body.sessionId}`));
  console.log(dim(`  │ productsFound     : ${body.metadata?.productsFound ?? '?'}`));
  console.log(dim(`  │ duration          : ${body.metadata?.duration ?? '?'} ms`));
  console.log(dim(`  │ redirectedToCount : ${body.metadata?.redirectedToCounter ?? false}`));

  if (sd) {
    console.log(dim(`  ├─ SEARCH DEBUG`));
    console.log(dim(`  │ searchType        : ${sd.searchType}`));
    console.log(dim(`  │ originalQuery     : ${sd.originalQuery}`));
    console.log(dim(`  │ normalizedQuery   : ${sd.normalizedQuery}`));
    console.log(dim(`  │ dialectDetected   : ${sd.hasTunisianDialect}`));
    console.log(dim(`  │ rawTokens         : ${(sd.rawTokens||[]).join(', ')}`));
    console.log(dim(`  │ expandedTerms     : ${(sd.expandedTerms||[]).join(', ')}`));
    console.log(dim(`  │ mainPartType      : ${sd.mainPartType}`));
    console.log(dim(`  │ retrievalMode     : ${sd.retrievalMode}`));
    console.log(dim(`  │ truncated         : ${sd.truncated}`));
    console.log(dim(`  │ dbRawCount        : ${sd.dbRawCount}`));
    console.log(dim(`  │ qualifiedCount    : ${sd.qualifiedCount}`));
    console.log(dim(`  │ finalCount        : ${sd.finalCount}`));
    console.log(dim(`  │ stockDisponible   : ${sd.stockBreakdown?.disponible}`));
    console.log(dim(`  │ stockIndisponible : ${sd.stockBreakdown?.indisponible}`));
    const vs = sd.vehicleScope;
    if (vs) {
      console.log(dim(`  ├─ VEHICLE SCOPE`));
      console.log(dim(`  │ active            : ${vs.active}`));
      console.log(dim(`  │ vin               : ${vs.vin}`));
      console.log(dim(`  │ vehicleNo         : ${vs.vehicleNo}`));
      console.log(dim(`  │ model             : ${vs.model}`));
      console.log(dim(`  │ modelDescription  : ${vs.modelDescription}`));
      console.log(dim(`  │ typeCodes         : ${(vs.typeCodes||[]).join(', ')}`));
      console.log(dim(`  │ primaryTypeCodes  : ${(vs.primaryTypeCodes||[]).join(', ')}`));
      console.log(dim(`  │ typeCodeSource    : ${vs.typeCodeSource}`));
    }
    if (sd.constraint?.applied) {
      console.log(dim(`  ├─ CONSTRAINT GATE`));
      console.log(dim(`  │ identityMode      : ${sd.constraint.identityMode}`));
      console.log(dim(`  │ requestedPart     : ${sd.constraint.requestedPart}`));
      console.log(dim(`  │ kept              : ${sd.constraint.kept}`));
      console.log(dim(`  │ rejectedIdentity  : ${sd.constraint.rejectedByIdentity}`));
      console.log(dim(`  │ rejectedPosition  : ${sd.constraint.rejectedByPosition}`));
      console.log(dim(`  │ noExactMatch      : ${sd.constraint.noExactMatch}`));
    }
  }

  if (verif) {
    console.log(dim(`  ├─ CATALOG VERIFICATION`));
    console.log(dim(`  │ compatibility     : ${verif.compatibility}`));
    console.log(dim(`  │ identity          : ${verif.checks?.identity}`));
    console.log(dim(`  │ position          : ${verif.checks?.position}`));
    console.log(dim(`  │ qualifiers        : ${verif.checks?.qualifiers}`));
    console.log(dim(`  │ vehicle           : ${verif.checks?.vehicle}`));
    console.log(dim(`  │ stockPrice        : ${verif.checks?.stockPrice}`));
    console.log(dim(`  │ aiAudit           : ${verif.aiAudit}`));
    if (verif.reasons?.length) {
      verif.reasons.forEach(reason => console.log(dim(`  │ withheld reason   : ${reason}`)));
    }
    if (verif.aiFlags?.effective?.length) {
      verif.aiFlags.effective.forEach(f => console.log(dim(`  │ aiFlag(effective) : [${f.type}] ${f.reference} — ${f.detail}`)));
    }
  }

  if (trace) {
    console.log(dim(`  ├─ ANSWER TRACE`));
    console.log(dim(`  │ identifiedPart    : ${trace.identifiedPart}`));
    console.log(dim(`  │ modelCode         : ${trace.modelCode}`));
    (trace.proposedReferences||[]).forEach(ref =>
      console.log(dim(`  │ proposedRef       : ${ref.reference} — ${ref.designation}`)));
  }

  if (p0) {
    console.log(dim(`  ├─ PRODUCT[0]`));
    console.log(dim(`  │ reference         : ${p0.reference}`));
    console.log(dim(`  │ displayName       : ${p0.displayName}`));
    console.log(dim(`  │ designation2      : ${p0.designation2}`));
    console.log(dim(`  │ source            : ${p0.source}`));
    console.log(dim(`  │ prixTtc           : ${p0.prixTtc}`));
    console.log(dim(`  │ prixHt            : ${p0.prixHt}`));
    console.log(dim(`  │ stock.statut      : ${p0.stock?.statut}`));
    console.log(dim(`  │ stock.consolide   : ${p0.stock?.stockConsolide}`));
    console.log(dim(`  │ stock.disponible  : ${p0.stock?.stockDisponible}`));
    console.log(dim(`  │ stock.total       : ${p0.stock?.totalQuantity}`));
    console.log(dim(`  │ fitments          : ${(p0.fitments||[]).map(f=>`${f.typeCode}`).join(', ')}`));
  }

  if (VERBOSE) {
    console.log(dim(`  ├─ FULL JSON`));
    JSON.stringify(body, null, 2).split('\n').forEach(l => console.log(dim(`  │ ${l}`)));
  }

  console.log(dim(`  └${'─'.repeat(60)}`));
}

// ─── Score Printer ───────────────────────────────────────────────
function printScore(result, caseNo) {
  const bar = result.ok
    ? `${C.green}█████████████████████ 100%${C.reset}`
    : `${C.red}${'█'.repeat(Math.floor(result.score/5))}${'░'.repeat(20-Math.floor(result.score/5))} ${result.score}%${C.reset}`;

  console.log(`\n  ${bld('ACCURACY SCORE')} Case ${caseNo}: ${bar}`);
  console.log(`  Checks: ${result.passed}/${result.total} passed`);

  result.checks.forEach(c => {
    const icon = c.passed ? g('✔') : r('✘');
    const line = `  [${String(c.id).padStart(2,'0')}] ${icon} ${c.label}`;
    if (!c.passed) {
      console.log(line);
      console.log(`       ${r('Expected')}: ${c.expected}`);
      console.log(`       ${r('Got')}     : ${c.got}`);
    } else {
      console.log(line);
    }
  });

  if (result.ok) {
    console.log(`\n  ${g('✔ PASS — 100% exact match')}`);
  } else {
    console.log(`\n  ${r(`✘ FAIL — score ${result.score}% < 100% (${result.total - result.passed} check(s) failed)`)}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  let selectedNos = null;
  const cf = process.argv.find(a => a.startsWith('--cases='));
  if (cf) selectedNos = cf.replace('--cases=','').split(',').map(Number).filter(Boolean);
  const countArg = process.argv.find(a => a.startsWith('--count='));
  const count = countArg ? Number(countArg.slice('--count='.length)) : DEFAULT_CASE_COUNT;
  const dryRun = process.argv.includes('--dry-run');

  const mdText = fs.readFileSync(MD_FILE, 'utf8');
  const allCases = parseMd(mdText);
  const cases = selectedNos
    ? allCases.filter((testCase) => selectedNos.includes(testCase.no))
    : chooseCases(allCases, count);

  console.log(`\n${C.bold}${C.cyan}${'═'.repeat(62)}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  Suzuki Chatbot — Exact UI/API Cross-Reference Suite${C.reset}`);
  console.log(`${C.bold}${C.cyan}${'═'.repeat(62)}${C.reset}`);
  console.log(`  API       : ${b(API_BASE)}`);
  console.log(`  VIN check : ${b(API_BASE + VIN_PATH)}`);
  console.log(`  Chat      : ${b(API_BASE + CHAT_PATH)}`);
  console.log(`  MD        : ${b(MD_FILE)}`);
  console.log(`  Selection : ${cases.map((testCase) => testCase.no).join(', ')}`);
  console.log(`  Rule      : every check must match exactly; any mismatch = FAIL\n`);

  if (!cases.length) {
    console.error(r('No cases selected. Check the Markdown file or --cases values.'));
    process.exit(1);
  }

  const invalidFixtures = cases.flatMap((testCase) =>
    validateCaseData(testCase).map((issue) => `Case ${testCase.no}: ${issue}`),
  );
  if (invalidFixtures.length) {
    console.error(r('Fixture preflight failed; no API cases were run:'));
    invalidFixtures.forEach((issue) => console.error(r(`  - ${issue}`)));
    process.exit(1);
  }

  if (dryRun) {
    console.log(g(`Dry run passed: parsed ${cases.length} complete cases.`));
    cases.forEach((testCase) => console.log(`  Case ${String(testCase.no).padStart(2, '0')} | ${testCase.model} | ${testCase.db.reference} | ${testCase.turns.length} turn(s)`));
    return;
  }

  const summary = [];

  for (const tc of cases) {
    console.log(`\n${C.bold}${C.cyan}${'─'.repeat(62)}${C.reset}`);
    console.log(`${C.bold}  Case ${String(tc.no).padStart(2,'0')} │ SUZUKI ${tc.model} │ ${tc.db.designation2 || tc.db.designation}${C.reset}`);
    console.log(`  VIN      : ${b(tc.vin)}`);
    console.log(`  TypeCode : ${b(tc.typeCode)}`);
    console.log(`  VehicleNo: ${b(tc.vehicleNo)}`);
    console.log(`  DB Ref   : ${b(tc.db.reference)}`);
    console.log(`  Stock    : consolide=${tc.db.stock.stockConsolide} → ${tc.db.expected === 'available' ? g('available') : r('unavailable')}`);
    console.log(`  Price TTC: ${tc.db.priceTtc !== null ? b(tc.db.priceTtc.toFixed(3)+' TND') : dim('N/A')}`);
    console.log(`  Turns    : ${tc.turns.length}`);

    let caseScore = { checks: [], total: 0, passed: 0, score: 0, ok: false };
    let vinInfo = null;
    let vinValidation = null;
    try {
      const vinResponse = await postVinWithRateLimitRetry(tc.vin);
      console.log(`\n  VIN validation response: ${JSON.stringify(vinResponse.body)}`);
      vinValidation = vinResponse.body;
      const vinScore = scoreVinValidation(vinResponse, tc);
      printScore(vinScore, `${tc.no} VIN`);
      caseScore.checks.push(...vinScore.checks);
      caseScore.total += vinScore.total;
      caseScore.passed += vinScore.passed;
      vinInfo = vinScore.vehicleInfo;
      if (!vinScore.ok) {
        caseScore.score = Math.round(caseScore.passed / caseScore.total * 100);
        summary.push({
          no: tc.no, model: tc.model, part: tc.db.designation2.slice(0, 45),
          score: caseScore.score, passed: caseScore.passed, total: caseScore.total, ok: false,
        });
        continue;
      }
    } catch (err) {
      console.log(r(`  VIN API ERROR: ${err.message}`));
      caseScore.checks.push({ id: 1, label: 'VIN API reachable', passed: false, expected: 'HTTP 201 JSON', got: err.message });
      caseScore.total++;
      summary.push({
        no: tc.no, model: tc.model, part: tc.db.designation2.slice(0, 45),
        score: 0, passed: 0, total: caseScore.total, ok: false,
      });
      continue;
    }

    const vehicle = vinInfo;
    let sessionId;

    for (let t = 0; t < tc.turns.length; t++) {
      const prompt = tc.turns[t];
      console.log(`\n  ${C.blue}${C.bold}Turn ${t+1}${C.reset}: "${prompt}"`);

      let apiResp;
      try {
        apiResp = await postJson(`${API_BASE}${CHAT_PATH}`, { message: prompt, vehicle, sessionId });
      } catch (err) {
        console.log(r(`  API ERROR: ${err.message}`));
        caseScore.checks.push({ id: caseScore.total + 1, label: `Turn ${t + 1} API reachable`, passed: false, expected: 'HTTP 201 JSON', got: err.message });
        caseScore.total++;
        break;
      }

      if (apiResp.body?.sessionId) sessionId = apiResp.body.sessionId;

      // Print bot response
      const respText = apiResp.body?.response ?? '';
      console.log(`\n  ${bld('EXACT UI RESPONSE (POST /chat/message response field):')}`);
      console.log(respText);

      // Debug
      printDebug(apiResp, tc.no, t);

      // Score this turn
      const turnScore = scoreResponse(apiResp, tc, prompt, vinValidation);
      printScore(turnScore, `${tc.no} T${t+1}`);

      // Accumulate
      caseScore.checks = caseScore.checks.concat(turnScore.checks);
      caseScore.total  += turnScore.total;
      caseScore.passed += turnScore.passed;
      if (!turnScore.ok) caseScore.ok = false;
    }

    caseScore.score = caseScore.total > 0 ? Math.round((caseScore.passed / caseScore.total) * 100) : 0;
    caseScore.ok = caseScore.total > 0 && caseScore.passed === caseScore.total;

    summary.push({
      no:     tc.no,
      model:  tc.model,
      part:   (tc.db.designation2 || tc.db.designation || '').slice(0, 45),
      score:  caseScore.score,
      passed: caseScore.passed,
      total:  caseScore.total,
      ok:     caseScore.ok,
    });
  }

  // ── Final Summary ─────────────────────────────────────────────
  console.log(`\n${C.bold}${C.cyan}${'═'.repeat(62)}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  FINAL SUMMARY${C.reset}`);
  console.log(`${C.bold}${C.cyan}${'═'.repeat(62)}${C.reset}`);
  console.log(`  ${'Case'.padEnd(6)} ${'Score'.padEnd(7)} ${'Checks'.padEnd(10)} ${'Model'.padEnd(10)} Part`);
  console.log(`  ${'─'.repeat(60)}`);

  let totalPass = 0, totalFail = 0, totalSkip = 0;
  summary.forEach(s => {
    if (s.skipped) {
      console.log(`  ${String(s.no).padStart(2,'0').padEnd(6)} ${y('SKIP'.padEnd(7))} ${'—'.padEnd(10)} —`);
      totalSkip++;
    } else if (s.ok) {
      console.log(`  ${String(s.no).padStart(2,'0').padEnd(6)} ${g('100%'.padEnd(7))} ${`${s.passed}/${s.total}`.padEnd(10)} ${(s.model||'').padEnd(10)} ${s.part}`);
      totalPass++;
    } else {
      console.log(`  ${String(s.no).padStart(2,'0').padEnd(6)} ${r(`${s.score}%`.padEnd(7))} ${`${s.passed}/${s.total}`.padEnd(10)} ${(s.model||'').padEnd(10)} ${s.part}`);
      totalFail++;
    }
  });

  console.log(`  ${'─'.repeat(60)}`);
  console.log(`\n  Cases PASS : ${g(totalPass)}`);
  console.log(`  Cases FAIL : ${totalFail > 0 ? r(totalFail) : g(0)}`);
  if (totalSkip) console.log(`  Cases SKIP : ${y(totalSkip)}`);
  console.log(`\n  ${totalFail === 0 && totalSkip === 0 ? g('ALL CASES PASSED — 100% exact match') : r(`${totalFail} case(s) FAILED — score < 100% = FAIL`)}`);
  console.log('');

  process.exit(totalFail > 0 ? 1 : 0);
}

main().catch(err => { console.error(r(`Fatal: ${err.message}\n${err.stack}`)); process.exit(1); });
