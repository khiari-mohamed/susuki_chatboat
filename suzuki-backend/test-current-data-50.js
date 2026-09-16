const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const API_URL = process.env.CHAT_API_URL || 'http://localhost:8000/chat/message';
const prisma = new PrismaClient();
const MAIN_WORDS = ['pare choc', 'pare brise', 'amortisseur', 'disque', 'filtre', 'phare', 'radiateur', 'retroviseur', 'capot', 'porte', 'aile'];
const ACCESSORY_WORDS = [
  'support', 'renfort', 'moulure', 'baguette', 'sabot', 'elargisseur', 'moustache',
  'spoiler', 'joint', 'agrafe', 'clip', 'cable', 'durite', 'cache', 'charniere',
];

function text(part) {
  return String(part.designation2 || part.designation || '').trim();
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stockValue(part) {
  return Number(part.stock?.stockConsolide ?? 0);
}

function isAccessory(part) {
  const value = normalize(text(part));
  return String(part.categorie || '').trim().toUpperCase() === 'ACCESSOIRES' ||
    ACCESSORY_WORDS.some((word) => (` ${value} `).includes(` ${normalize(word)} `));
}

function queryFromDesignation(part, maxWords = 4) {
  const words = normalize(text(part)).split(' ').filter((word) => word.length >= 3);
  return words.slice(0, maxWords).join(' ');
}

function addCase(cases, item) {
  if (item?.query && !cases.some((test) => test.query === item.query && test.kind === item.kind)) cases.push(item);
}

async function loadParts() {
  return prisma.part.findMany({
    where: { designation2: { not: null } },
    include: { stock: true, fitments: true },
    orderBy: { id: 'asc' },
  });
}

function buildCases(parts) {
  const cases = [];
  const usable = parts.filter((part) => text(part).length >= 5 && part.fitments.length > 0);
  const withStock = usable.filter((part) => stockValue(part) >= 2);
  const withoutStock = usable.filter((part) => stockValue(part) < 2);

  addCase(cases, { kind: 'greeting', query: 'bonjour' });
  addCase(cases, { kind: 'greeting', query: 'merci' });

  for (const part of usable.slice(0, 10)) {
    addCase(cases, { kind: 'reference', query: part.reference, reference: part.reference });
  }

  for (const part of withStock.slice(0, 10)) {
    const query = queryFromDesignation(part);
    const matchingParts = withStock.filter((candidate) => normalize(text(candidate)).includes(normalize(query)));
    if (matchingParts.length === 1) {
      addCase(cases, { kind: 'designation', query, reference: part.reference, phrase: normalize(text(part)).split(' ').slice(0, 2).join(' ') });
    }
  }

  for (const part of usable) {
    const value = normalize(text(part));
    const mainWord = MAIN_WORDS.find((word) => value.includes(normalize(word)));
    const accessoryWord = ACCESSORY_WORDS.find((word) => value.includes(normalize(word)));
    if (mainWord && accessoryWord) {
      addCase(cases, {
        kind: 'main-vs-accessory',
        query: mainWord,
        forbiddenAccessory: true,
        sourceReference: part.reference,
      });
    }
    if (cases.filter((test) => test.kind === 'main-vs-accessory').length >= 8) break;
  }

  for (const part of usable) {
    const value = normalize(text(part));
    const accessoryWord = ACCESSORY_WORDS.find((word) => value.includes(normalize(word)));
    const mainWord = MAIN_WORDS.find((word) => value.includes(normalize(word)));
    if (accessoryWord && mainWord) {
      addCase(cases, {
        kind: 'explicit-accessory',
        query: `${accessoryWord}, ${mainWord.replace(' ', '-')}`,
        expectedAccessory: true,
      });
    }
    if (cases.filter((test) => test.kind === 'explicit-accessory').length >= 6) break;
  }

  for (const part of withoutStock.slice(0, 6)) {
    addCase(cases, { kind: 'stock-boundary', query: queryFromDesignation(part), maxStock: stockValue(part) });
  }

  for (const part of withStock.filter((item) => item.prixTtc != null && item.prixHt != null).slice(0, 6)) {
    addCase(cases, {
      kind: 'public-price',
      query: `prix ${queryFromDesignation(part, 3)}`,
      publicPrice: Number(part.prixTtc),
      wholesalePrice: Number(part.prixHt),
    });
  }

  for (const part of usable) {
    const value = normalize(text(part));
    const position = value.match(/\b(av|avant|ar|arriere|g|d|gauche|droite)\b/);
    if (position && MAIN_WORDS.some((word) => value.includes(normalize(word)))) {
      addCase(cases, { kind: 'position', query: queryFromDesignation(part, 5), phrase: position[1] });
    }
    if (cases.filter((test) => test.kind === 'position').length >= 6) break;
  }

  // Fill the remainder with current catalog-backed reference cases so the
  // suite always contains exactly 50 tests, even when a database snapshot
  // has fewer accessory or positional variants than expected.
  const usedReferences = new Set(cases.map((test) => test.reference).filter(Boolean));
  for (const part of usable) {
    if (cases.length >= 50) break;
    if (usedReferences.has(part.reference)) continue;
    usedReferences.add(part.reference);
    addCase(cases, {
      kind: 'catalog-reference',
      query: part.reference,
      reference: part.reference,
    });
  }

  return cases.slice(0, 50);
}

function responseText(result) {
  return String(result?.response || '').toLowerCase();
}

function validateResult(test, result) {
  const response = responseText(result);
  const products = Array.isArray(result.products) ? result.products : [];
  const errors = [];

  if (result.error) errors.push(result.error);
  if (test.kind === 'greeting') {
    if (products.length > 0 || !(/bonjour|aider|en prie/.test(response))) errors.push('greeting was treated as a parts result');
    return errors;
  }

  if (/undefined|null nan|prixht|prix_ht/.test(response)) errors.push('internal price field leaked into response');
  if (/disponible/.test(response) && !/indisponible/.test(response)) {
    for (const product of products) {
      const stock = Number(product.stock?.stockConsolide ?? product.stock?.stock_consolide ?? 0);
      if (stock < 2) errors.push(`available response contains stockConsolide=${stock}`);
    }
  }

  if (test.reference) {
    if (products.length === 0) {
      errors.push(`reference ${test.reference} returned no product`);
    } else if (!products.some((product) => product.reference === test.reference)) {
      errors.push(`reference ${test.reference} was not returned`);
    }
  }
  if (test.phrase && products.length > 0 && !normalize(response).includes(normalize(test.phrase))) {
    errors.push(`expected phrase "${test.phrase}" not visible in response`);
  }
  if (test.forbiddenAccessory && products.some(isAccessory)) errors.push('main-part query returned an accessory result');
  if (test.expectedAccessory && products.length > 0 && products.every((product) => !isAccessory(product))) {
    errors.push('explicit accessory query returned no accessory result');
  }
  if (test.publicPrice != null && test.publicPrice !== test.wholesalePrice) {
    const publicText = test.publicPrice.toFixed(3);
    const wholesaleText = test.wholesalePrice.toFixed(3);
    if (response.includes(wholesaleText) && !response.includes(publicText)) errors.push('wholesale price was displayed');
  }

  return errors;
}

async function callApi(test, index) {
  try {
    const { data } = await axios.post(API_URL, {
      message: test.query,
      vehicle: { marque: 'SUZUKI', modele: 'S-PRESSO' },
    }, { timeout: 15000 });
    return { index, test, data, errors: validateResult(test, data) };
  } catch (error) {
    return { index, test, data: null, errors: [error.response?.data?.message || error.message] };
  }
}

async function main() {
  const parts = await loadParts();
  const tests = buildCases(parts);
  if (tests.length !== 50) throw new Error(`Expected exactly 50 generated tests, got ${tests.length}`);

  console.log(`Running ${tests.length} current-data regression cases against ${API_URL}`);
  console.log(`Catalog basis: ${parts.length} parts with current designations, stock and fitments`);

  const results = [];
  for (let index = 0; index < tests.length; index += 1) {
    const result = await callApi(tests[index], index + 1);
    results.push(result);
    const status = result.errors.length === 0 ? 'PASS' : 'FAIL';
    console.log(`[${result.index}/50] ${status} ${result.test.kind}: ${result.test.query}${result.errors.length ? ` — ${result.errors.join('; ')}` : ''}`);
  }

  const failed = results.filter((result) => result.errors.length > 0);
  console.log(`\nResult: ${results.length - failed.length}/50 passed, ${failed.length} failed`);
  if (failed.length > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(`Current-data suite failed to initialize: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
