// READ-ONLY: compare relay price fields with the price currently stored locally.
// Usage (from suzuki-backend): node scripts/price-check.mjs
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

const num = (value) => (value == null ? null : Number(value));
const near = (a, b) => a != null && b != null && Math.abs(a - b) <= Math.max(0.05, 0.005 * Math.abs(b));

const prisma = new PrismaClient();
try {
  const relay = new Map((await all('/api/chatbot/parts')).map((part) => [String(part.reference ?? '').trim(), part]));
  const local = await prisma.part.findMany({
    where: { source: '01_PROD' },
    select: { reference: true, prixHt: true, prixTtc: true },
  });
  const rows = local
    .map((part) => ({
      ref: part.reference,
      oldHt: num(part.prixHt),
      oldTtc: num(part.prixTtc),
      relay: relay.get(part.reference),
    }))
    .filter((row) => row.relay && row.oldTtc > 0);

  console.log('\n01_PROD parts compared (old prix_ttc > 0 and present in relay):', rows.length);
  console.log('\nrelay field (times a factor) equals the old local value (tolerance 0.5% or 0.05):');
  const targets = [['old prix_ttc', 'oldTtc'], ['old prix_ht', 'oldHt']];
  const factors = [['x1', 1], ['x1.19', 1.19], ['/1.19', 1 / 1.19]];
  for (const field of ['prixHt', 'prixTtc', 'prixPublic']) {
    for (const [targetName, targetKey] of targets) {
      for (const [factorName, factor] of factors) {
        const hits = rows.filter((row) => {
          const value = num(row.relay[field]);
          return value != null && near(value * factor, row[targetKey]);
        }).length;
        if (hits > 0) console.log(`  relay ${field} ${factorName} == ${targetName}: ${hits}`);
      }
    }
  }

  console.log('\nsample (reference | old prix_ht | old prix_ttc | relay prixHt | relay prixTtc | relay prixPublic):');
  const step = Math.max(1, Math.floor(rows.length / 10));
  for (const row of rows.filter((_, index) => index % step === 0).slice(0, 10)) {
    console.log(`  ${row.ref} | ${row.oldHt} | ${row.oldTtc} | ${row.relay.prixHt} | ${row.relay.prixTtc} | ${row.relay.prixPublic}`);
  }
} finally {
  await prisma.$disconnect();
}
