const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const requestedReference = (process.argv[2] || '95862M76M30').trim();

async function main() {
  if (!requestedReference) {
    throw new Error('Provide a part reference, for example: node scripts/find-part.js 95862M76M30');
  }

  const [part, alternateMatches] = await Promise.all([
    prisma.part.findFirst({
      where: { reference: { equals: requestedReference, mode: 'insensitive' } },
      select: {
        reference: true,
        designation: true,
        designation2: true,
        searchDescription: true,
        prixHt: true,
        prixTtc: true,
        unite: true,
        categorie: true,
        fabricant: true,
        source: true,
        stock: {
          select: {
            totalQuantity: true,
            stockDisponible: true,
            stockConsolide: true,
            statut: true,
            updatedAt: true,
          },
        },
        fitments: {
          select: { typeCode: true, modelName: true },
          orderBy: { typeCode: 'asc' },
        },
        itemReferences: {
          select: { referenceNo: true, referenceType: true },
          orderBy: { referenceNo: 'asc' },
        },
      },
    }),
    prisma.itemReference.findMany({
      where: { referenceNo: { equals: requestedReference, mode: 'insensitive' } },
      select: {
        referenceNo: true,
        referenceType: true,
        part: {
          select: {
            reference: true,
            designation: true,
            designation2: true,
            source: true,
          },
        },
      },
    }),
  ]);

  console.log(JSON.stringify({
    requestedReference,
    exactPart: part,
    alternateReferenceMatches: alternateMatches,
  }, null, 2));

  if (!part && alternateMatches.length === 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('Database lookup failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
