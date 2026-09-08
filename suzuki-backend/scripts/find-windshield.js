const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const typeCode = (process.argv[2] || 'AVH310-TYPE2').trim().toUpperCase();

async function main() {
  const parts = await prisma.part.findMany({
    where: {
      fitments: { some: { typeCode } },
      OR: [
        { designation2: { contains: 'BRISE', mode: 'insensitive' } },
        { searchDescription: { contains: 'BRISE', mode: 'insensitive' } },
        { designation: { contains: 'WINDSHIELD', mode: 'insensitive' } },
        { designation: { contains: 'WINDSCREEN', mode: 'insensitive' } },
        { designation2: { contains: 'PARE-BRISE', mode: 'insensitive' } },
      ],
    },
    select: {
      reference: true,
      designation: true,
      designation2: true,
      searchDescription: true,
      prixHt: true,
      prixTtc: true,
      source: true,
      stock: {
        select: {
          stockDisponible: true,
          stockConsolide: true,
          statut: true,
        },
      },
      fitments: {
        where: { typeCode },
        select: { typeCode: true, modelName: true },
      },
    },
    orderBy: { reference: 'asc' },
  });

  const accessoryTerms = ['moustache', 'garnish', 'garniture', 'joint', 'molding', 'moulure', 'trim', 'wiper', 'essuie', 'motor', 'moteur'];
  const results = parts.map((part) => {
    const text = [part.designation, part.designation2, part.searchDescription]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const accessory = accessoryTerms.some((term) => text.includes(term));
    return {
      ...part,
      classification: accessory ? 'ACCESSORY_OR_MOLDING' : 'POSSIBLE_GLASS',
    };
  });

  console.log(JSON.stringify({
    typeCode,
    totalMatches: results.length,
    possibleGlass: results.filter((part) => part.classification === 'POSSIBLE_GLASS'),
    accessoriesOrMoldings: results.filter((part) => part.classification === 'ACCESSORY_OR_MOLDING'),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error('Windshield lookup failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
