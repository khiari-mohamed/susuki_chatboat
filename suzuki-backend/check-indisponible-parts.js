const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkParts() {
  console.log('🔍 Checking "Indisponible" parts from test...\n');

  const partsToCheck = [
    { ref: '2547847', name: 'AMORTISSEUR AV G' },
    { ref: '96_777_523', name: 'RETROVISEUR G' },
    { ref: '506704', name: 'POMPE A EAU 206' },
  ];

  for (const part of partsToCheck) {
    console.log(`\n📦 Checking: ${part.name} (Ref: ${part.ref})`);
    console.log('─'.repeat(60));

    // Check in parts table
    const piece = await prisma.part.findFirst({
      where: { reference: part.ref },
      select: {
        reference: true,
        designation: true,
        prixTtc: true,
      },
    });

    if (piece) {
      console.log('✅ Found in PARTS table:');
      console.log(`   Designation: ${piece.designation}`);
      console.log(`   Prix: ${piece.prixTtc} TND`);
    } else {
      console.log('❌ NOT found in PARTS table');
    }

    // Check in stock table
    const stock = await prisma.stock.findUnique({
      where: { reference: part.ref },
      select: {
        reference: true,
        statut: true,
      },
    });

    if (stock) {
      console.log(`✅ Found in STOCK table: ${stock.statut}`);
    } else {
      console.log('❌ NOT found in STOCK table (defaults to Indisponible)');
    }
  }

  console.log('\n\n🔍 Searching for similar parts in database...\n');

  // Search for amortisseur avant
  const amortisseurs = await prisma.part.findMany({
    where: {
      designation: {
        contains: 'AMORTISSEUR',
        mode: 'insensitive',
      },
    },
    select: {
      reference: true,
      designation: true,
      prixTtc: true,
    },
    take: 10,
  });

  console.log(`\n📋 Found ${amortisseurs.length} AMORTISSEUR parts in DB:`);
  amortisseurs.forEach((p) => {
    console.log(`   ${p.designation} | Ref: ${p.reference} | ${p.prixTtc} TND`);
  });

  // Search for retroviseur
  const retroviseurs = await prisma.part.findMany({
    where: {
      designation: {
        contains: 'RETROVISEUR',
        mode: 'insensitive',
      },
    },
    select: {
      reference: true,
      designation: true,
      prixTtc: true,
    },
    take: 10,
  });

  console.log(`\n📋 Found ${retroviseurs.length} RETROVISEUR parts in DB:`);
  retroviseurs.forEach((p) => {
    console.log(`   ${p.designation} | Ref: ${p.reference} | ${p.prixTtc} TND`);
  });

  // Search for pompe a eau
  const pompes = await prisma.part.findMany({
    where: {
      designation: {
        contains: 'POMPE',
        mode: 'insensitive',
      },
    },
    select: {
      reference: true,
      designation: true,
      prixTtc: true,
    },
    take: 10,
  });

  console.log(`\n📋 Found ${pompes.length} POMPE parts in DB:`);
  pompes.forEach((p) => {
    console.log(`   ${p.designation} | Ref: ${p.reference} | ${p.prixTtc} TND`);
  });

  await prisma.$disconnect();
}

checkParts().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
