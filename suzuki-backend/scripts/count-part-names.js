require('dotenv').config();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log('Counting unique part names in the database...');

  const rows = await prisma.$queryRaw`
    SELECT designation, designation_2 AS "designation2", search_description AS "searchDescription"
    FROM parts;
  `;

  const nameCounts = new Map();

  for (const row of rows) {
    const values = [row.designation, row.designation2, row.searchDescription];
    for (const value of values) {
      if (!value) continue;
      const normalized = await normalizeText(value);
      if (normalized.length === 0) continue;
      const existing = nameCounts.get(normalized) || 0;
      nameCounts.set(normalized, existing + 1);
    }
  }

  const sorted = Array.from(nameCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `${count},"${name.replace(/"/g, '""')}"`);

  const outputPath = 'part-name-counts.csv';
  fs.writeFileSync(outputPath, 'count,name\n' + sorted.join('\n'), 'utf8');

  console.log(`Saved part name counts to ${outputPath}`);
  console.log(`Unique normalized part names: ${nameCounts.size}`);
}

main()
  .catch((error) => {
    console.error('Error counting part names:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
