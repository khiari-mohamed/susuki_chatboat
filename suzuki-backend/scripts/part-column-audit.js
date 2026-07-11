require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/part-column-audit.js <query1> [query2] ...');
  console.log('Example: node scripts/part-column-audit.js capot optrique optics parachoc');
  process.exit(1);
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsInsensitive(value, query) {
  return typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase());
}

function formatValue(value) {
  if (value === null || value === undefined) return '-';
  return String(value).replace(/\s+/g, ' ').trim();
}

function getMatchColumns(part, query) {
  const columns = [];
  if (containsInsensitive(part.designation, query)) columns.push('designation');
  if (containsInsensitive(part.designation2, query)) columns.push('designation2');
  if (containsInsensitive(part.searchDescription, query)) columns.push('searchDescription');
  if (containsInsensitive(part.reference, query)) columns.push('reference');
  if (part.itemReferences?.some((ir) => containsInsensitive(ir.referenceNo, query))) {
    columns.push('itemReferences.referenceNo');
  }
  return columns;
}

async function auditQuery(query) {
  const normalized = normalize(query);
  console.log('\n===============================================================');
  console.log(`QUERY: "${query}"`);
  console.log(`NORMALIZED: "${normalized}"`);

  const rawParts = await prisma.part.findMany({
    where: {
      OR: [
        { designation: { contains: query, mode: 'insensitive' } },
        { designation2: { contains: query, mode: 'insensitive' } },
        { searchDescription: { contains: query, mode: 'insensitive' } },
        { reference: { contains: query, mode: 'insensitive' } },
        {
          itemReferences: {
            some: { referenceNo: { contains: query, mode: 'insensitive' } },
          },
        },
      ],
    },
    include: {
      stock: true,
      itemReferences: true,
      fitments: true,
    },
    take: 200,
  });

  const summary = {
    designation: 0,
    designation2: 0,
    searchDescription: 0,
    reference: 0,
    itemReferences: 0,
    totalParts: rawParts.length,
  };

  const parts = rawParts.map((part) => {
    const matchColumns = getMatchColumns(part, query);
    if (matchColumns.includes('designation')) summary.designation += 1;
    if (matchColumns.includes('designation2')) summary.designation2 += 1;
    if (matchColumns.includes('searchDescription')) summary.searchDescription += 1;
    if (matchColumns.includes('reference')) summary.reference += 1;
    if (matchColumns.includes('itemReferences.referenceNo')) summary.itemReferences += 1;
    return {
      reference: part.reference,
      designation: formatValue(part.designation),
      designation2: formatValue(part.designation2),
      searchDescription: formatValue(part.searchDescription),
      categorie: formatValue(part.categorie),
      fabricant: formatValue(part.fabricant),
      stockStatut: part.stock?.statut ?? 'Indisponible',
      fitmentCount: part.fitments?.length ?? 0,
      matchColumns,
    };
  });

  console.log('\nSEARCH SUMMARY:');
  console.log(`  Total unique parts matched: ${summary.totalParts}`);
  console.log(`  Matches in designation: ${summary.designation}`);
  console.log(`  Matches in designation2: ${summary.designation2}`);
  console.log(`  Matches in searchDescription: ${summary.searchDescription}`);
  console.log(`  Matches in reference: ${summary.reference}`);
  console.log(`  Matches in itemReferences.referenceNo: ${summary.itemReferences}`);

  if (parts.length === 0) {
    console.log('\nNo matching parts found with raw query text.');
    console.log('NOTE: The chatbot search pipeline may still find results through fuzzy/tokens/synonyms corrections, but raw text is not present in the searchable columns.');
    return;
  }

  const top = parts.slice(0, 30);
  console.log(`\nTOP ${top.length} RESULTS:`);
  top.forEach((part, index) => {
    console.log(`\n${index + 1}. Reference: ${part.reference}`);
    console.log(`   Stock: ${part.stockStatut}`);
    console.log(`   Designation: ${part.designation}`);
    console.log(`   Designation2: ${part.designation2}`);
    console.log(`   searchDescription: ${part.searchDescription}`);
    console.log(`   Categorie: ${part.categorie}`);
    console.log(`   Fabricant: ${part.fabricant}`);
    console.log(`   Fitments: ${part.fitmentCount}`);
    console.log(`   Matched columns: ${part.matchColumns.join(', ')}`);
  });
}

async function main() {
  try {
    for (const query of args) {
      await auditQuery(query);
    }
  } catch (error) {
    console.error('Error during audit:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
