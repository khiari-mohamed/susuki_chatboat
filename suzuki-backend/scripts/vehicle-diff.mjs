// READ-ONLY: compare relay vehicle fields with local values. VINs and plates are not printed.
// Usage (from suzuki-backend): node scripts/vehicle-diff.mjs
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

const clean = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);
const code = (value) => clean(value)?.replace(/\s+/g, '-') ?? null;
const vehicleCode = (value) => code(value)?.replace(/-TYPE-(\d)/i, '-TYPE$1') ?? null;
const squash = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const prisma = new PrismaClient();
try {
  const relay = await all('/api/chatbot/vehicles');
  const local = await prisma.vehicle.findMany({
    select: {
      vehicleNo: true,
      vin: true,
      marque: true,
      modele: true,
      modeleDescription: true,
      typeCode: true,
      immatriculation: true,
    },
  });
  const relayBy = new Map(relay.map((vehicle) => [clean(vehicle.vehicleNo), vehicle]));
  const matched = local.filter((vehicle) => relayBy.has(vehicle.vehicleNo));
  const fields = [
    ['vin', (vehicle) => clean(vehicle.vin)],
    ['typeCode', (vehicle) => vehicleCode(vehicle.typeCode)],
    ['marque', (vehicle) => clean(vehicle.marque)],
    ['modele', (vehicle) => clean(vehicle.modele)],
    ['modeleDescription', (vehicle) => clean(vehicle.modeleDescription)],
    ['immatriculation', (vehicle) => clean(vehicle.immatriculation)],
  ];
  const show = new Set(['typeCode', 'marque', 'modele', 'modeleDescription']);

  console.log('\nvehicles present on both sides:', matched.length);
  console.log(
    'local without type code:',
    local.filter((vehicle) => !clean(vehicle.typeCode)).length,
    '| relay without type code:',
    relay.filter((vehicle) => !clean(vehicle.typeCode)).length,
  );
  console.log('\nper field: same / changed (formatOnly = same text ignoring case, spaces, punctuation) / blanked / filled');
  for (const [name, read] of fields) {
    const stats = { same: 0, changed: 0, formatOnly: 0, blanked: 0, filled: 0 };
    const changedSamples = [];
    const blankedSamples = [];
    for (const vehicle of matched) {
      const before = clean(vehicle[name]);
      const after = read(relayBy.get(vehicle.vehicleNo));
      if (before === after) {
        stats.same++;
      } else if (before && !after) {
        stats.blanked++;
        if (show.has(name) && blankedSamples.length < 4) blankedSamples.push(before);
      } else if (!before && after) {
        stats.filled++;
      } else {
        stats.changed++;
        if (squash(before) === squash(after)) stats.formatOnly++;
        if (show.has(name) && changedSamples.length < 6) changedSamples.push(`${before} -> ${after}`);
      }
    }
    console.log(' ', name.padEnd(18), JSON.stringify(stats));
    if (changedSamples.length) console.log('     changed samples:', changedSamples.join(' | '));
    if (blankedSamples.length) console.log('     blanked (local values the relay lacks):', blankedSamples.join(' | '));
  }
} finally {
  await prisma.$disconnect();
}
