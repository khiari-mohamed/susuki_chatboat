const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PROMPT_COUNT = 50;
const vehicleUsage = new Map();

function clean(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|').trim();
}

function displayName(part) {
  return clean(part.designation2 || part.designation || '');
}

function stockQuantity(part) {
  return Number(part.stock?.stockConsolide ?? 0);
}

function dbDecimal(value) {
  if (value == null) return 'NULL';
  return String(value);
}

function priceForDisplay(value) {
  if (value == null) return 'not recorded';
  const numeric = Number(value);
  return Number.isFinite(numeric) ? `${numeric.toFixed(3)} TND` : `${String(value)} (unparseable DB value)`;
}

function normalizeDesignation(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function designationComplexity(part) {
  const tokens = normalizeDesignation(displayName(part)).split(' ')
    .filter((token) => token.length >= 3 && !/^\d/.test(token));
  const distinct = new Set(tokens).size;
  return distinct * 10 + Math.min(displayName(part).length, 80) / 80;
}

function normalizeTypeCode(value) {
  return String(value ?? '').trim().toUpperCase().replace(/\s+/g, '-').replace(/-TYPE-/g, '-TYPE');
}

function attachVehicleOptions(parts, vehicles) {
  const vehiclesByTypeCode = new Map();
  const rowsByVin = new Map();
  for (const vehicle of vehicles) {
    if (!vehicle.vin) continue;
    const vinKey = clean(vehicle.vin).toUpperCase();
    if (!rowsByVin.has(vinKey)) rowsByVin.set(vinKey, []);
    rowsByVin.get(vinKey).push(vehicle);
  }

  for (const rows of rowsByVin.values()) {
    // Both the UI VIN verifier and the search resolver must agree on the
    // vehicle type; otherwise this VIN is ambiguous for a fitment test.
    const searchRow = rows.find((row) => row.typeCode) ?? rows[0];
    const uiRow = rows.find((row) => row.modele) ?? rows[0];
    const typeCode = normalizeTypeCode(searchRow?.typeCode);
    if (!typeCode || !uiRow?.modele || normalizeTypeCode(uiRow.typeCode) !== typeCode) continue;

    const resolvedVehicle = {
      vin: clean(uiRow.vin),
      vehicleNo: clean(uiRow.vehicleNo),
      marque: clean(uiRow.marque || 'SUZUKI'),
      model: clean(uiRow.modele),
      typeCode: clean(searchRow.typeCode),
    };
    if (!vehiclesByTypeCode.has(typeCode)) vehiclesByTypeCode.set(typeCode, []);
    vehiclesByTypeCode.get(typeCode).push(resolvedVehicle);
  }

  for (const part of parts) {
    const codes = [...new Set((part.fitments ?? []).map((fitment) => normalizeTypeCode(fitment.typeCode)).filter(Boolean))];
    part.vehicleOptions = codes.flatMap((code) => vehiclesByTypeCode.get(code) ?? []);
  }
}

function chooseDiverseParts(parts) {
  const allValid = parts.filter((part) =>
    part.reference && displayName(part) && part.fitments?.length > 0 && part.vehicleOptions?.length > 0,
  );
  const designationCounts = new Map();
  for (const part of allValid) {
    const key = normalizeDesignation(displayName(part));
    designationCounts.set(key, (designationCounts.get(key) ?? 0) + 1);
  }
  const valid = allValid
    .filter((part) => designationCounts.get(normalizeDesignation(displayName(part))) === 1)
    .filter((part) => designationComplexity(part) >= 20)
    .sort((a, b) => designationComplexity(b) - designationComplexity(a));
  const pools = [
    valid.filter((part) => stockQuantity(part) >= 2),
    valid.filter((part) => stockQuantity(part) < 2),
    valid.filter((part) => part.prixTtc != null),
    valid.filter((part) => part.prixTtc == null),
    valid.filter((part) => part.fitments?.length > 0),
    valid,
  ];
  const selected = [];
  const usedReferences = new Set();

  while (selected.length < PROMPT_COUNT) {
    let addedInRound = false;
    for (const pool of pools) {
      const next = pool.find((part) => !usedReferences.has(String(part.reference).trim().toUpperCase()));
      if (!next) continue;
      usedReferences.add(String(next.reference).trim().toUpperCase());
      selected.push(next);
      addedInRound = true;
      if (selected.length === PROMPT_COUNT) break;
    }
    if (!addedInRound) break;
  }

  return selected;
}

function assignVehicleContexts(parts) {
  for (const part of parts) {
    const options = [...part.vehicleOptions].sort((left, right) => {
      const leftUsage = vehicleUsage.get(left.vin) ?? 0;
      const rightUsage = vehicleUsage.get(right.vin) ?? 0;
      return leftUsage - rightUsage || left.model.localeCompare(right.model);
    });
    part.testVehicle = options[0];
    vehicleUsage.set(part.testVehicle.vin, (vehicleUsage.get(part.testVehicle.vin) ?? 0) + 1);
  }
}

function buildUiPrompt(part, index) {
  const name = displayName(part);
  const model = part.testVehicle?.model || 'Suzuki';
  const normalizedName = normalizeDesignation(name);
  const position = ['avant gauche', 'avant droite', 'arriere gauche', 'arriere droite', 'avant', 'arriere', 'gauche', 'droite']
    .find((candidate) => (` ${normalizedName} `).includes(` ${candidate} `));
  const style = index % 8;
  if (style === 0) {
    return {
      turns: [`Bonjour, vous avez ${name} pour ma ${model} ?`],
    };
  }
  if (style === 1) {
    return {
      turns: [`Je cherche ${name} pour une ${model}. C'est disponible ?`],
    };
  }
  if (style === 2) {
    return {
      turns: [`Salem, n7eb ${name} lel ${model}. Mawjoud ? W ch7al ?`],
    };
  }
  if (style === 3) {
    return {
      turns: [
        `Je cherche ${name} pour ma ${model}.`,
        `Vous l'avez en stock ? Et c'est combien ?`,
      ],
    };
  }
  if (style === 4) {
    return {
      turns: [`Quel est le prix de ${name} pour une ${model}, s'il vous plaît ?`],
    };
  }
  if (style === 5) {
    return {
      turns: [position
        ? `Je cherche ${name}, version ${position}, pour ma ${model}. Vous l'avez ?`
        : `Il me faut ${name} pour ma ${model}. Vous avez ça ?`],
    };
  }
  if (style === 6) {
    return {
      turns: [`Prix et disponibilité pour ${name}, compatible avec une ${model} ?`],
    };
  }
  return {
    turns: [
      `Vous avez ${name} pour une ${model} ?`,
      `D'accord. Et le prix, s'il vous plaît ?`,
    ],
  };
}

function formatExpectedFacts(part) {
  const quantity = stockQuantity(part);
  const fitments = (part.fitments ?? []).map((fitment) => {
    return `id=${fitment.id}; modelName=${clean(fitment.modelName) || 'NULL'}; typeCode=${clean(fitment.typeCode) || 'NULL'}`;
  });
  const alternateReferences = (part.itemReferences ?? []).map((itemReference) =>
    `id=${itemReference.id}; referenceNo=${clean(itemReference.referenceNo)}; referenceType=${clean(itemReference.referenceType) || 'NULL'}`,
  );
  const stock = part.stock;
  const vehicle = part.testVehicle;

  return [
    `- Part DB id: ${part.id}`,
    `- Référence DB: ${clean(part.reference)}`,
    `- Désignation française (designation2): ${clean(part.designation2) || 'NULL; response fallback is designation'}`,
    `- Désignation OEM (designation): ${clean(part.designation) || 'NULL'}`,
    `- Search description: ${clean(part.searchDescription) || 'NULL'}`,
    `- Public price TTC: ${priceForDisplay(part.prixTtc)} (raw DB=${dbDecimal(part.prixTtc)})`,
    `- Wholesale/pre-tax price HT: ${priceForDisplay(part.prixHt)} (raw DB=${dbDecimal(part.prixHt)}; do not present as customer price)`,
    `- Unit: ${clean(part.unite) || 'NULL'}`,
    `- Category: ${clean(part.categorie) || 'NULL'}`,
    `- Manufacturer: ${clean(part.fabricant) || 'NULL'}`,
    `- Supplier code: ${clean(part.fournisseurCode) || 'NULL'}`,
    `- Source: ${clean(part.source) || 'NULL'} (${part.source === '01_PROD' ? 'Suzuki OEM' : part.source === '02_CARPRO' ? 'CarPro Parts' : 'unmapped source'})`,
    `- Stock row: ${stock ? `id=${stock.id}; reference=${clean(stock.reference)}; totalQuantity=${dbDecimal(stock.totalQuantity)}; stockDisponible=${dbDecimal(stock.stockDisponible)}; stockConsolide=${dbDecimal(stock.stockConsolide)}; statut=${clean(stock.statut)}; updatedAt=${stock.updatedAt?.toISOString?.() ?? clean(stock.updatedAt)}` : 'NO STOCK ROW (application fallback behaves as zero stock)'}`,
    `- Availability rule: stockConsolide >= 2; actual quantity=${quantity}; expected=${quantity >= 2 ? 'available' : 'unavailable'}`,
    `- Fitment rows (${fitments.length}): ${fitments.length ? fitments.join(' | ') : 'none'}`,
    `- Alternate/item reference rows (${alternateReferences.length}): ${alternateReferences.length ? alternateReferences.join(' | ') : 'none'}`,
    `- Matched vehicle row: ${vehicle ? `vehicleNo=${vehicle.vehicleNo}; VIN=${vehicle.vin}; marque=${vehicle.marque}; modele=${vehicle.model}; typeCode=${vehicle.typeCode}` : 'none'}`,
  ].join('\n');
}

function formatVehicleSetup(vehicle) {
  return [
    '**Vehicle setup (UI only; do not paste into chat)**',
    '',
    `Enter this VIN in the direct VIN field: ${vehicle.vin}`,
    `Expected validated vehicle: ${vehicle.marque} ${vehicle.model}`,
    `DB type code used for this part’s fitment: ${vehicle.typeCode}`,
    `Vehicle number (DB cross-check only): ${vehicle.vehicleNo}`,
  ].join('\n');
}

function renderPromptPack(parts) {
  const lines = [
    '# 50 chatbot UI test prompts',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'Start a fresh chat for each case. For cases with Turn 1 and Turn 2, send both messages in the same chat. Paste only the text under “UI prompt”; use the DB facts below it as the manual checking guide.',
    '',
    'For each case, enter the listed VIN in the UI vehicle section using “Saisissez directement votre VIN”, validate it, confirm the displayed model matches the expected vehicle, then send only the UI prompt. The VIN and expected model are test setup, not chat text.',
    '',
  ];

  parts.forEach((part, index) => {
    const prompt = buildUiPrompt(part, index);
    lines.push(`## Case ${String(index + 1).padStart(2, '0')}`);
    lines.push('');
    lines.push(formatVehicleSetup(part.testVehicle));
    lines.push('');
    lines.push('**UI prompt**');
    lines.push('');
    prompt.turns.forEach((turn, turnIndex) => {
      lines.push(prompt.turns.length > 1 ? `**Turn ${turnIndex + 1}:** ${turn}` : turn);
      lines.push('');
    });
    lines.push('**DB facts for comparison (do not paste)**');
    lines.push('');
    lines.push(formatExpectedFacts(part));
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}

function getOutputPath() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--out');
  if (outputIndex >= 0 && args[outputIndex + 1]) return path.resolve(process.cwd(), args[outputIndex + 1]);
  return path.resolve(__dirname, '../ui-chatbot-50-prompts.md');
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log('Usage: npm run generate:ui-prompts -- [--out path] [--stdout]');
    console.log('Reads the catalog only and writes 50 UI-ready test prompts with DB facts.');
    return;
  }

  const parts = await prisma.part.findMany({
    where: { designation2: { not: null } },
    include: { stock: true, fitments: true, itemReferences: true },
    orderBy: { id: 'asc' },
  });
  const vehicles = await prisma.vehicle.findMany({
    where: { vin: { not: null } },
    select: { id: true, vin: true, vehicleNo: true, marque: true, modele: true, modeleDescription: true, typeCode: true },
    orderBy: { id: 'desc' },
  });
  attachVehicleOptions(parts, vehicles);
  const selected = chooseDiverseParts(parts);
  if (selected.length < PROMPT_COUNT) {
    throw new Error(`Need at least ${PROMPT_COUNT} unique, descriptive parts with a matching registered VIN/model; found ${selected.length}.`);
  }
  assignVehicleContexts(selected);

  const promptPack = renderPromptPack(selected);
  const outputPath = getOutputPath();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, promptPack, 'utf8');

  console.log(`Generated ${selected.length} UI test cases from ${parts.length} DB parts and ${vehicles.length} registered vehicles.`);
  console.log(`Prompt pack: ${outputPath}`);
  if (process.argv.includes('--stdout')) console.log(promptPack);
}

main()
  .catch((error) => {
    console.error(`Could not generate UI prompt pack: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());