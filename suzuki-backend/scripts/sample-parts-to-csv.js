require('dotenv').config();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sampling 10 random parts from the database...');

  const parts = await prisma.$queryRaw`
    SELECT reference,
           designation,
           designation_2 AS "designation2",
           search_description AS "searchDescription",
           categorie,
           fabricant,
           prix_ht AS "prixHt"
    FROM parts
    ORDER BY random()
    LIMIT 10;
  `;

  const csvLines = [
    'reference,designation,designation2,searchDescription,categorie,fabricant,prixHt',
    ...parts.map((part) => [
      part.reference ?? '',
      `"${String(part.designation ?? '').replace(/"/g, '""')}"`,
      `"${String(part.designation2 ?? '').replace(/"/g, '""')}"`,
      `"${String(part.searchDescription ?? '').replace(/"/g, '""')}"`,
      `"${String(part.categorie ?? '').replace(/"/g, '""')}"`,
      `"${String(part.fabricant ?? '').replace(/"/g, '""')}"`,
      part.prixHt != null ? String(part.prixHt) : '',
    ].join(',')),
  ];

  const outputPath = 'sample-parts.csv';
  fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
  console.log(`Saved 10 sample parts to ${outputPath}`);
}

main()
  .catch((error) => {
    console.error('Error sampling parts:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
