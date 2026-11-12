// Read-only probe of the ERP relay. Writes nothing and needs no database.
// Usage: ERP_RELAY_URL=... ERP_RELAY_API_KEY=... node scripts/relay-probe.mjs
const BASE = process.env.ERP_RELAY_URL;
const KEY = process.env.ERP_RELAY_API_KEY;
if (!BASE || !KEY) {
  console.error('Set ERP_RELAY_URL and ERP_RELAY_API_KEY');
  process.exit(1);
}

async function all(path, pageSize = 500) {
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
    process.stdout.write(`\r${path} ${rows.length}/${body.totalRecords}`);
    if (rows.length >= body.totalRecords || data.length === 0) break;
  }
  process.stdout.write('\n');
  return rows;
}

const tally = (items, key) => {
  const map = new Map();
  for (const item of items) map.set(key(item), (map.get(key(item)) ?? 0) + 1);
  return Object.fromEntries(map);
};

const parts = await all('/api/chatbot/parts');
console.log('--- PARTS ---');
console.log('rows:', parts.length);
console.log('source values:', tally(parts, (p) => p.source ?? 'null'));
console.log('prixPublic missing or 0:', parts.filter((p) => !(p.prixPublic > 0)).length);
console.log('designation2 missing:', parts.filter((p) => !p.designation2?.trim()).length);
console.log('duplicate references:', parts.length - new Set(parts.map((p) => p.reference)).size);

const stock = await all('/api/chatbot/stock');
console.log('--- STOCK ---');
console.log('rows:', stock.length);
const byRef = new Map();
for (const s of stock) byRef.set(s.reference, [...(byRef.get(s.reference) ?? []), s]);
const several = [...byRef.values()].filter((rows) => rows.length > 1);
console.log('references with several rows:', several.length);
console.log('  ...with different stockConsolide:', several.filter((rows) => new Set(rows.map((s) => s.stockConsolide)).size > 1).length);
console.log('warehouse codes:', tally(stock, (s) => s.warehouseCode ?? 'null'));
console.log('stockConsolide missing:', stock.filter((s) => s.stockConsolide == null).length);
console.log('deleted rows:', stock.filter((s) => s.deleted).length);
const partRefs = new Set(parts.map((p) => p.reference));
console.log('stock rows whose reference is not in /parts:', stock.filter((s) => !partRefs.has(s.reference)).length);

const refs = await all('/api/chatbot/item-references');
console.log('--- ITEM REFERENCES ---');
console.log('referenceType values:', tally(refs, (r) => r.referenceType ?? 'null'));
