'use strict';
/**
 * Samples catalog parts and compatible vehicles into fixtures understood by
 * test-ui-chatbot-20.js. A seed reproduces the same selection and phrasing.
 */
const fs = require('node:fs');
const path = require('node:path');
try { require('dotenv').config(); } catch { /* dotenv optional */ }
const { PrismaClient } = require('@prisma/client');

const arg = (name, def) => {
  const value = process.argv.find((item) => item.startsWith(`--${name}=`));
  return value ? value.slice(name.length + 3) : def;
};
const COUNT = Number(arg('count', '200'));
const SEED = Number(arg('seed', String(Date.now() % 1_000_000_000)));
const OUT = path.resolve(__dirname, arg('out', 'ui-chatbot-generated.md'));
const VARIANTS = arg('variants', 'exact,price,dialect,twoturn,typo,lowercase')
  .split(',').map((value) => value.trim()).filter(Boolean);
const UNAVAILABLE_RATIO = Number(arg('unavailable', '0.4'));
const MIN_WORDS = Number(arg('min-words', '2'));
const MIN_AVAILABLE_STOCK = 2;
const EXCLUDED_MODELS = new Set(['NAN', 'AUTRE', 'X']);
const SUPPORTED_VARIANTS = new Set(['exact', 'price', 'dialect', 'twoturn', 'typo', 'lowercase', 'reference']);

if (!Number.isInteger(COUNT) || COUNT < 1) throw new Error('--count must be a positive integer.');
if (!Number.isSafeInteger(SEED) || SEED < 0) throw new Error('--seed must be a non-negative safe integer.');
if (!Number.isFinite(UNAVAILABLE_RATIO) || UNAVAILABLE_RATIO < 0 || UNAVAILABLE_RATIO > 1) {
  throw new Error('--unavailable must be between 0 and 1.');
}
if (!Number.isInteger(MIN_WORDS) || MIN_WORDS < 1) throw new Error('--min-words must be a positive integer.');
if (VARIANTS.length === 0 || VARIANTS.some((variant) => !SUPPORTED_VARIANTS.has(variant))) {
  throw new Error(`--variants must be a comma-separated list of: ${[...SUPPORTED_VARIANTS].join(',')}`);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(SEED);
const pick = (list) => list[Math.floor(rnd() * list.length)];
const shuffle = (list) => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
const norm = (value) => String(value).toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
const FN_WORDS = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'un', 'une', 'a', 'au', 'aux', 'et', 'en', 'sur', 'sous', 'pour', 'avec', 'sans']);
const GLUED = { avg: ['av', 'g'], avd: ['av', 'd'], arg: ['ar', 'g'], ard: ['ar', 'd'] };
/** Tokens that identify a designation the way a customer reads it. */
function sigTokens(name) {
  return norm(name).replace(/\b[dl]['’`´]\s*/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean)
    .flatMap((word) => GLUED[word] ?? [word])
    .filter((word) => !FN_WORDS.has(word) && !/^\d+$/.test(word) && (word.length > 1 || word === 'g' || word === 'd'));
}
const rawSafe = (value) => typeof value === 'string' && value.length > 0 &&
  value === value.trim() && !/[|\n\r]/.test(value);
const textSafe = (value) => typeof value === 'string' &&
  value.trim().length > 0 && !/[|\n\r]/.test(value);

const SKIP_TYPO_WORDS = new Set([
  'rouge', 'violet', 'marron', 'noir', 'vert', 'rose', 'blanc', 'jaune',
  'bleu', 'gris', 'avant', 'arriere', 'gauche', 'droite', 'superieur', 'inferieur',
]);

function makeTypo(name) {
  const words = [...name.matchAll(/[A-Za-zÀ-ÿ]{7,}/g)]
    .filter((match) => !SKIP_TYPO_WORDS.has(norm(match[0])));
  if (words.length === 0) return null;
  const match = pick(words);
  const word = match[0];
  const index = 2 + Math.floor(rnd() * (word.length - 4));
  const operations = [
    () => word.slice(0, index) + word[index + 1] + word[index] + word.slice(index + 2),
    () => word.slice(0, index) + word.slice(index + 1),
    () => word.slice(0, index) + word[index] + word.slice(index),
  ];
  const typo = pick(operations)();
  if (typo === word) return null;
  return {
    text: name.slice(0, match.index) + typo + name.slice(match.index + word.length),
    from: word,
    to: typo,
  };
}

function buildPrompt(variant, name, model, part) {
  switch (variant) {
    case 'exact':
      return { label: 'exact', turns: [`Je cherche ${name} pour ma ${model}. C'est disponible ?`] };
    case 'price':
      return { label: 'price', turns: [`Quel est le prix de ${name} pour une ${model}, s'il vous plaît ?`] };
    case 'dialect':
      return { label: 'dialect', turns: [`Salem, n7eb ${name} lel ${model}. Mawjoud ? W ch7al ?`] };
    case 'twoturn':
      return {
        label: 'twoturn',
        turns: [
          `Vous avez ${name} pour une ${model} ?`,
          pick(["D'accord. Et le prix, s'il vous plaît ?", "Vous l'avez en stock ? Et c'est combien ?"]),
        ],
      };
    case 'typo': {
      const typo = makeTypo(name);
      if (!typo) {
        return { label: 'exact (no typo possible)', turns: [`Je cherche ${name} pour ma ${model}. C'est disponible ?`] };
      }
      return {
        label: `typo (${typo.from} -> ${typo.to})`,
        turns: [`Bonjour, vous avez ${typo.text} pour ma ${model} ?`],
      };
    }
    case 'lowercase':
      return { label: 'lowercase', turns: [norm(`vous avez ${name} pour ${model} ? prix ?`).replace(/[?]/g, ' ?').replace(/\s+/g, ' ')] };
    case 'reference':
      return { label: 'reference', turns: [`Prix et disponibilité de la référence ${part.reference} pour une ${model} ?`] };
    default:
      return { label: 'exact', turns: [`Je cherche ${name} pour ma ${model}. C'est disponible ?`] };
  }
}

async function main() {
  const prisma = new PrismaClient();
  let parts;
  let vehicles;
  const sigCount = new Map();
  try {
    console.log(`Seed ${SEED} | count ${COUNT} | variants ${VARIANTS.join(',')} | unavailable target ${UNAVAILABLE_RATIO}`);
    const allDesignations = await prisma.part.findMany({ select: { designation2: true } });
    for (const part of allDesignations) {
      if (!part.designation2) continue;
      const key = sigTokens(part.designation2).sort().join(' ');
      sigCount.set(key, (sigCount.get(key) ?? 0) + 1);
    }
    parts = await prisma.part.findMany({
      where: { source: '01_PROD' },
      include: { stock: true, fitments: true, itemReferences: true },
    });
    vehicles = await prisma.vehicle.findMany({
      where: { vin: { not: null }, typeCode: { not: null }, modele: { not: null } },
      select: { vin: true, vehicleNo: true, marque: true, modele: true, typeCode: true },
    });
  } finally {
    await prisma.$disconnect();
  }

  const vinFrequency = new Map();
  for (const vehicle of vehicles) {
    const key = String(vehicle.vin).toUpperCase();
    vinFrequency.set(key, (vinFrequency.get(key) ?? 0) + 1);
  }
  const vehiclesByType = new Map();
  for (const vehicle of vehicles) {
    const vin = String(vehicle.vin).toUpperCase();
    if (vinFrequency.get(vin) !== 1 || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) continue;
    if (String(vehicle.marque).toUpperCase() !== 'SUZUKI') continue;
    if (EXCLUDED_MODELS.has(String(vehicle.modele).toUpperCase())) continue;
    if (!/^VN\d+$/.test(vehicle.vehicleNo) || !/^[A-Z0-9]+-TYPE\d+$/.test(vehicle.typeCode)) continue;
    if (!rawSafe(vehicle.modele)) continue;
    if (!vehiclesByType.has(vehicle.typeCode)) vehiclesByType.set(vehicle.typeCode, []);
    vehiclesByType.get(vehicle.typeCode).push({ ...vehicle, vin });
  }

  const skipped = {};
  const bump = (reason) => { skipped[reason] = (skipped[reason] ?? 0) + 1; };
  const eligible = [];
  for (const part of parts) {
    const designation2 = (part.designation2 ?? '').trim();
    const designation = (part.designation ?? '').trim();
    const ttc = part.prixTtc == null ? NaN : Number(part.prixTtc);
    const ht = part.prixHt == null ? NaN : Number(part.prixHt);
    if (!textSafe(designation2) || !textSafe(designation)) { bump('missing/unsafe designation'); continue; }
    if (designation2.split(/\s+/).length < MIN_WORDS) { bump('too generic (few words)'); continue; }
    const toks = sigTokens(designation2);
    if (new Set(toks).size !== toks.length) { bump('repeated word'); continue; }
    if (/[a-zà-ÿ]{3,}\d/i.test(designation2)) { bump('letters glued to digits'); continue; }
    if ((sigCount.get([...toks].sort().join(' ')) ?? 0) !== 1) { bump('near-duplicate designation'); continue; }
    if (![part.searchDescription, part.unite, part.categorie, part.fabricant, part.fournisseurCode].every(rawSafe)) {
      bump('missing/untrimmed text field'); continue;
    }
    if (!(ttc > 0) || !(ht > 0)) { bump('no usable price'); continue; }
    if (!/^[\w.-]+$/.test(part.reference)) { bump('odd reference'); continue; }
    const stock = part.stock;
    if (!stock) { bump('no stock row'); continue; }
    const totalQuantity = Number(stock.totalQuantity);
    const stockDisponible = Number(stock.stockDisponible);
    const stockConsolide = Number(stock.stockConsolide);
    if (![totalQuantity, stockDisponible, stockConsolide].every((quantity) => Number.isInteger(quantity) && quantity >= 0)) {
      bump('non-integer stock'); continue;
    }
    if (part.fitments.length === 0) { bump('no fitment'); continue; }
    if (!part.fitments.every((fitment) =>
      rawSafe(fitment.modelName) && rawSafe(fitment.typeCode) && !/;/.test(fitment.modelName))) {
      bump('unsafe fitment text'); continue;
    }
    if (!part.itemReferences.every((reference) =>
      rawSafe(reference.referenceNo) && !/;/.test(reference.referenceNo) &&
      rawSafe(reference.referenceType) && Number.isFinite(Number(reference.referenceType)))) {
      bump('unsafe item reference'); continue;
    }
    const paddedDesignation = ` ${norm(designation2)} `;
    const options = [...new Set(part.fitments.map((fitment) => fitment.typeCode))]
      .flatMap((typeCode) => vehiclesByType.get(typeCode) ?? [])
      .filter((vehicle) => !paddedDesignation.includes(` ${norm(vehicle.modele)} `));
    if (options.length === 0) { bump('no matching vehicle'); continue; }
    eligible.push({
      part, designation2, designation, ttc, ht, totalQuantity, stockDisponible, stockConsolide,
      options, available: stockConsolide >= MIN_AVAILABLE_STOCK,
    });
  }
  console.log(`Eligible parts: ${eligible.length} / ${parts.length}`);
  console.log('Skipped:', skipped);
  if (eligible.length === 0) throw new Error('No eligible parts: check the filters above.');

  const pools = new Map();
  for (const entry of shuffle(eligible)) {
    const category = entry.part.categorie;
    if (!pools.has(category)) pools.set(category, { available: [], unavailable: [] });
    pools.get(category)[entry.available ? 'available' : 'unavailable'].push(entry);
  }
  const categories = shuffle([...pools.keys()]);
  const chosen = [];
  const modelUse = new Map();
  const vinUse = new Map();
  let cursor = 0;
  let stalls = 0;
  const variantBag = [];
  const nextVariant = () => {
    if (variantBag.length === 0) variantBag.push(...shuffle(VARIANTS));
    return variantBag.pop();
  };

  while (chosen.length < COUNT && stalls < categories.length * 2) {
    const pool = pools.get(categories[cursor++ % categories.length]);
    const preferUnavailable = rnd() < UNAVAILABLE_RATIO;
    const first = preferUnavailable ? pool.unavailable : pool.available;
    const second = preferUnavailable ? pool.available : pool.unavailable;
    const entry = first.pop() ?? second.pop();
    if (!entry) { stalls++; continue; }
    stalls = 0;

    const optionsByModel = new Map();
    for (const vehicle of entry.options) {
      if (!optionsByModel.has(vehicle.modele)) optionsByModel.set(vehicle.modele, []);
      optionsByModel.get(vehicle.modele).push(vehicle);
    }
    const leastUsed = Math.min(...[...optionsByModel.keys()].map((model) => modelUse.get(model) ?? 0));
    const model = pick([...optionsByModel.keys()].filter((name) => (modelUse.get(name) ?? 0) === leastUsed));
    const modelVehicles = optionsByModel.get(model);
    const unusedVehicles = modelVehicles.filter((vehicle) => !vinUse.get(vehicle.vin));
    const vehicle = pick((unusedVehicles.length ? unusedVehicles : modelVehicles).slice(0, 50));
    modelUse.set(model, (modelUse.get(model) ?? 0) + 1);
    vinUse.set(vehicle.vin, (vinUse.get(vehicle.vin) ?? 0) + 1);
    chosen.push({ ...entry, vehicle, prompt: buildPrompt(nextVariant(), entry.designation2, vehicle.modele, entry.part) });
  }

  const lines = [
    '# Generated chatbot UI test prompts',
    '',
    `Generated: ${new Date().toISOString()}  |  seed: ${SEED}  |  cases: ${chosen.length}`,
    '',
    `Run with: $env:CASES_FILE="${path.basename(OUT)}"; node test-ui-chatbot-20.js --count=100000`,
    '',
  ];
  chosen.forEach((entry, index) => {
    const { part, vehicle } = entry;
    const ttcRaw = part.prixTtc.toString();
    const htRaw = part.prixHt.toString();
    const fitments = part.fitments.map((fitment) =>
      `id=${fitment.id}; modelName=${fitment.modelName}; typeCode=${fitment.typeCode}`).join(' | ');
    const references = part.itemReferences.length
      ? part.itemReferences.map((reference) =>
        `id=${reference.id}; referenceNo=${reference.referenceNo}; referenceType=${reference.referenceType}`).join(' | ')
      : 'none';
    const promptLines = entry.prompt.turns.length === 1
      ? [entry.prompt.turns[0]]
      : entry.prompt.turns.flatMap((turn, turnIndex) => [`**Turn ${turnIndex + 1}:** ${turn}`, '']).slice(0, -1);
    lines.push(
      `## Case ${String(index + 1).padStart(3, '0')}`, '',
      '**Vehicle setup (UI only; do not paste into chat)**', '',
      `Enter this VIN in the direct VIN field: ${vehicle.vin}`,
      `Expected validated vehicle: SUZUKI ${vehicle.modele}`,
      `DB type code used for this part’s fitment: ${vehicle.typeCode}`,
      `Vehicle number (DB cross-check only): ${vehicle.vehicleNo}`,
      `Variant: ${entry.prompt.label}`,
      `Generated category: ${part.categorie}`, '',
      '**UI prompt**', '',
      ...promptLines, '',
      '**DB facts for comparison (do not paste)**', '',
      `- Part DB id: ${part.id}`,
      `- Référence DB: ${part.reference}`,
      `- Désignation française (designation2): ${entry.designation2}`,
      `- Désignation OEM (designation): ${entry.designation}`,
      `- Search description: ${part.searchDescription}`,
      `- Public price TTC: ${entry.ttc.toFixed(3)} TND (raw DB=${ttcRaw})`,
      `- Wholesale/pre-tax price HT: ${entry.ht.toFixed(3)} TND (raw DB=${htRaw}; do not present as customer price)`,
      `- Unit: ${part.unite}`,
      `- Category: ${part.categorie}`,
      `- Manufacturer: ${part.fabricant}`,
      `- Supplier code: ${part.fournisseurCode}`,
      `- Source: ${part.source} (Suzuki OEM)`,
      `- Stock row: id=${part.stock.id}; reference=${part.stock.reference}; totalQuantity=${entry.totalQuantity}; stockDisponible=${entry.stockDisponible}; stockConsolide=${entry.stockConsolide}; statut=${part.stock.statut}; updatedAt=${part.stock.updatedAt.toISOString()}`,
      `- Availability rule: stockConsolide >= ${MIN_AVAILABLE_STOCK}; actual quantity=${entry.stockConsolide}; expected=${entry.available ? 'available' : 'unavailable'}`,
      `- Fitment rows (${part.fitments.length}): ${fitments}`,
      `- Alternate/item reference rows (${part.itemReferences.length}): ${references}`,
      `- Matched vehicle row: vehicleNo=${vehicle.vehicleNo}; VIN=${vehicle.vin}; marque=SUZUKI; modele=${vehicle.modele}; typeCode=${vehicle.typeCode}`,
      '',
    );
  });
  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');

  const tally = (selector) => chosen.reduce((counts, entry) => {
    const key = selector(entry);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
  console.log(`\nWrote ${chosen.length} cases to ${OUT}`);
  console.log('By variant     :', tally((entry) => entry.prompt.label.split(' ')[0]));
  console.log('By category    :', tally((entry) => entry.part.categorie));
  console.log('By model       :', tally((entry) => entry.vehicle.modele));
  console.log('By availability:', tally((entry) => (entry.available ? 'available' : 'unavailable')));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
