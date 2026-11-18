// READ-ONLY dry run: compares the Car Pro relay with the local database and predicts what a sync would do.
// Writes nothing anywhere: relay GET requests and Prisma find* reads only.
// Usage (from suzuki-backend): node scripts/relay-compare.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const BASE = process.env.ERP_RELAY_URL;
const KEY = process.env.ERP_RELAY_API_KEY;
if (!BASE || !KEY) {
  console.error('Set ERP_RELAY_URL and ERP_RELAY_API_KEY in .env');
  process.exit(1);
}

async function all(path, pageSize = 1000) {
  const rows = [];
  for (let page = 1; ; page++) {
    const url = new URL(path, BASE);
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);
    const res = await fetch(url, { headers: { 'X-Api-Key': KEY, Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
    const body = await res.json();
    const data = body.data ?? [];
    rows.push(...data);
    process.stdout.write(`\r${path} ${rows.length}/${body.totalRecords}   `);
    if (rows.length >= body.totalRecords || data.length === 0) break;
  }
  process.stdout.write('\n');
  return rows;
}

const clean = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const code = (v) => clean(v)?.replace(/\s+/g, '-') ?? null; // same normalization as the sync
const num = (v) => (v == null ? null : Number(v));
const tally = (items, key) => {
  const out = {};
  for (const item of items) out[key(item)] = (out[key(item)] ?? 0) + 1;
  return out;
};
const top = (obj, n = 8) => Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n));
const sample = (items, n = 5) => items.slice(0, n).join(', ') || '-';
const section = (title) => console.log(`\n--- ${title} ---`);

const prisma = new PrismaClient();
try {
  // ── PARTS ─────────────────────────────────────────────────────
  const relayParts = await all('/api/chatbot/parts');
  const localParts = await prisma.part.findMany({
    select: { reference: true, source: true, designation2: true, prixTtc: true },
  });
  const relayPartBy = new Map(relayParts.map((p) => [clean(p.reference), p]));
  relayPartBy.delete(null);
  const localPartBy = new Map(localParts.map((p) => [p.reference, p]));
  const knownParts = new Set([...relayPartBy.keys(), ...localPartBy.keys()]);
  const notCovered = localParts.filter((p) => !relayPartBy.has(p.reference));

  section('PARTS');
  console.log('relay:', relayParts.length, '| local:', localParts.length);
  console.log('would be created:', [...relayPartBy.keys()].filter((r) => !localPartBy.has(r)).length);
  console.log('local parts the relay does not return, by source:', tally(notCovered, (p) => p.source));
  console.log('  sample:', sample(notCovered.map((p) => p.reference)));
  console.log('rejected (no reference, designation or source):',
    relayParts.filter((p) => !clean(p.reference) || !clean(p.designation) || !clean(p.source)).length);
  const withOldPrice = localParts.filter(
    (p) => p.source === '01_PROD' && num(p.prixTtc) > 0 && relayPartBy.has(p.reference),
  );
  const compared = withOldPrice.filter((p) => relayPartBy.get(p.reference).prixPublic > 0);
  const ratios = compared.map((p) => relayPartBy.get(p.reference).prixPublic / num(p.prixTtc)).sort((a, b) => a - b);
  console.log('prixPublic vs old prix_ttc: compared', ratios.length,
    '| identical (0.01):', compared.filter((p) => Math.abs(relayPartBy.get(p.reference).prixPublic - num(p.prixTtc)) < 0.01).length,
    '| median ratio:', ratios.length ? ratios[Math.floor(ratios.length / 2)].toFixed(3) : 'n/a');
  console.log('relay prixPublic missing or 0:', relayParts.filter((p) => !(p.prixPublic > 0)).length,
    '| of those, with an old local price (legacy fallback keeps showing):',
    withOldPrice.filter((p) => !(relayPartBy.get(p.reference).prixPublic > 0)).length);
  const noFrench = relayParts.filter((p) => !clean(p.designation2));
  console.log('relay without French name:', noFrench.length, '| local already has one (kept):',
    noFrench.filter((p) => clean(localPartBy.get(clean(p.reference))?.designation2)).length);

  // ── STOCK ─────────────────────────────────────────────────────
  const relayStock = await all('/api/chatbot/stock');
  const localStock = await prisma.stock.findMany({ select: { reference: true, stockConsolide: true } });
  const localStockBy = new Map(localStock.map((s) => [s.reference, num(s.stockConsolide)]));
  const stockByRef = new Map();
  for (const s of relayStock) stockByRef.set(clean(s.reference), [...(stockByRef.get(clean(s.reference)) ?? []), s]);
  const severalRows = [...stockByRef.values()].filter((rows) => rows.length > 1);
  let changed = 0, flips = 0, fresh = 0;
  for (const s of relayStock) {
    if (s.stockConsolide == null) continue;
    const before = localStockBy.get(clean(s.reference));
    if (before === undefined) fresh++;
    else {
      if (before !== s.stockConsolide) changed++;
      if ((before >= 2) !== (s.stockConsolide >= 2)) flips++;
    }
  }
  section('STOCK');
  console.log('relay rows:', relayStock.length, '| references with several rows:', severalRows.length,
    '| ...with different stockConsolide:', severalRows.filter((rows) => new Set(rows.map((s) => s.stockConsolide)).size > 1).length);
  console.log('rejected (no stockConsolide):', relayStock.filter((s) => s.stockConsolide == null).length,
    '| flagged deleted:', relayStock.filter((s) => s.deleted).length,
    '| would fail (part unknown):', relayStock.filter((s) => !knownParts.has(clean(s.reference))).length);
  console.log('new stock rows:', fresh, '| values that would change:', changed, '| availability flips (>= 2 rule):', flips);

  // ── VEHICLE TYPES ─────────────────────────────────────────────
  const relayTypes = await all('/api/chatbot/vehicle-types');
  const localTypes = await prisma.vehicleTypeMaster.findMany({ select: { typeCode: true } });
  const localTypeRaw = new Set(localTypes.map((t) => t.typeCode));
  const relayTypeCodes = new Set(relayTypes.map((t) => code(t.typeCode)).filter(Boolean));
  const knownTypes = new Set([...relayTypeCodes, ...localTypeRaw]);
  const twins = [...localTypeRaw].filter((c) => /\s/.test(c) && relayTypeCodes.has(code(c)));
  section('VEHICLE TYPES');
  console.log('relay:', relayTypes.length, '| local:', localTypes.length,
    '| relay codes containing a space (normalized to hyphen):', relayTypes.filter((t) => /\s/.test(t.typeCode ?? '')).length);
  console.log('would be created:', [...relayTypeCodes].filter((c) => !localTypeRaw.has(c)).length,
    '| rejected (no model name):', relayTypes.filter((t) => !clean(t.modelName)).length);
  console.log('legacy spaced codes that would get a hyphenated twin:', twins.length, '| sample:', sample(twins));

  // ── VEHICLE MODELS ────────────────────────────────────────────
  const relayModels = (await all('/api/chatbot/vehicle-models')).map((m) => ({ modele: clean(m.modele), type: code(m.typeCode) }));
  const localModels = await prisma.vehicleModelMap.findMany({ select: { modele: true, typeCode: true } });
  const localModelKeys = new Set(localModels.map((m) => `${m.modele}|${m.typeCode}`));
  const relayModelKeys = new Set(relayModels.filter((m) => m.modele && m.type).map((m) => `${m.modele}|${m.type}`));
  section('VEHICLE MODELS');
  console.log('relay:', relayModels.length, '| local:', localModels.length,
    '| would be created:', [...relayModelKeys].filter((k) => !localModelKeys.has(k)).length,
    '| would fail (type code unknown):', relayModels.filter((m) => m.type && !knownTypes.has(m.type)).length);
  console.log('local aliases the relay does not carry (kept, never deleted):', [...localModelKeys].filter((k) => !relayModelKeys.has(k)).length);

  // ── VEHICLES ──────────────────────────────────────────────────
  const relayVeh = await all('/api/chatbot/vehicles');
  const localVehNos = new Set((await prisma.vehicle.findMany({ select: { vehicleNo: true } })).map((v) => v.vehicleNo));
  const relayVehNos = relayVeh.map((v) => clean(v.vehicleNo));
  const relayVehSet = new Set(relayVehNos);
  section('VEHICLES');
  console.log('relay:', relayVeh.length, '| local:', localVehNos.size);
  console.log('brands in relay:', top(tally(relayVeh, (v) => (clean(v.marque) ?? 'null').toUpperCase())));
  console.log('would be created:', [...relayVehSet].filter((n) => n && !localVehNos.has(n)).length,
    '| local not in relay:', [...localVehNos].filter((n) => !relayVehSet.has(n)).length);
  console.log('duplicate vehicleNo in relay:', relayVeh.length - relayVehSet.size,
    '| missing vehicleNo (rejected):', relayVehNos.filter((n) => !n).length,
    '| flagged deleted:', relayVeh.filter((v) => v.deleted).length,
    '| inactive:', relayVeh.filter((v) => v.isActive === false).length);
  console.log('without VIN:', relayVeh.filter((v) => !clean(v.vin)).length, '| without type code:', relayVeh.filter((v) => !clean(v.typeCode)).length);

  // ── FITMENTS ──────────────────────────────────────────────────
  const relayFit = (await all('/api/chatbot/fitments')).map((f) => ({ part: clean(f.partReference), type: code(f.typeCode) }));
  const localFit = await prisma.fitment.findMany({ select: { partReference: true, typeCode: true } });
  const localFitKeys = new Set(localFit.map((f) => `${f.partReference}|${f.typeCode}`));
  const relayFitKeys = new Set(relayFit.filter((f) => f.part && f.type).map((f) => `${f.part}|${f.type}`));
  section('FITMENTS');
  console.log('relay:', relayFit.length, '| local:', localFit.length,
    '| would be created:', [...relayFitKeys].filter((k) => !localFitKeys.has(k)).length,
    '| local not in relay (pending deletes, not applied):', [...localFitKeys].filter((k) => !relayFitKeys.has(k)).length);
  console.log('would fail (unknown part):', relayFit.filter((f) => f.part && !knownParts.has(f.part)).length,
    '| (unknown type code):', relayFit.filter((f) => f.type && !knownTypes.has(f.type)).length);

  // ── ITEM REFERENCES ───────────────────────────────────────────
  const relayRefsRaw = await all('/api/chatbot/item-references');
  const relayRefs = relayRefsRaw.map((r) => ({ part: clean(r.partReference), no: clean(r.referenceNo) }));
  const localRefs = await prisma.itemReference.findMany({ select: { partReference: true, referenceNo: true } });
  const localRefKeys = new Set(localRefs.map((r) => `${r.partReference}|${r.referenceNo}`));
  const relayRefKeys = new Set(relayRefs.filter((r) => r.part && r.no).map((r) => `${r.part}|${r.no}`));
  section('ITEM REFERENCES');
  console.log('relay:', relayRefs.length, '| local:', localRefs.length, '| types:', tally(relayRefsRaw, (r) => r.referenceType ?? 'null'));
  console.log('would be created:', [...relayRefKeys].filter((k) => !localRefKeys.has(k)).length,
    '| local not in relay:', [...localRefKeys].filter((k) => !relayRefKeys.has(k)).length,
    '| would fail (unknown part):', relayRefs.filter((r) => r.part && !knownParts.has(r.part)).length);
} finally {
  await prisma.$disconnect();
}