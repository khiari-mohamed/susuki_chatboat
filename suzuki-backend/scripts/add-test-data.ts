import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestData() {
  console.log('Adding test parts data...');
  
  const testParts = [
    {
      reference: 'FA-17220-M68K00',
      designation: 'FILTRE AIR',
      versionModele: 'CELERIO',
      typeVehicule: 'GA416',
      prixHt: 25.500,
      stock: 10
    },
    {
      reference: 'FA-17220-S68K00',
      designation: 'FILTRE AIR',
      versionModele: 'S-PRESSO',
      typeVehicule: 'ABU310',
      prixHt: 28.000,
      stock: 8
    },
    {
      reference: 'PLQ-55810-M68K00',
      designation: 'PLAQUETTES FREIN AVANT',
      versionModele: 'CELERIO',
      typeVehicule: 'GA416',
      prixHt: 45.250,
      stock: 15
    },
    {
      reference: 'PLQ-55810-S68K00',
      designation: 'PLAQUETTES FREIN AVANT',
      versionModele: 'S-PRESSO',
      typeVehicule: 'ABU310',
      prixHt: 48.000,
      stock: 12
    },
    {
      reference: 'DSQ-55311-M68K00',
      designation: 'DISQUES FREIN AVANT',
      versionModele: 'CELERIO',
      typeVehicule: 'GA416',
      prixHt: 125.000,
      stock: 6
    },
    {
      reference: 'AMR-41600-M68K00',
      designation: 'AMORTISSEUR AVANT GAUCHE',
      versionModele: 'CELERIO',
      typeVehicule: 'GA416',
      prixHt: 180.000,
      stock: 4
    },
    {
      reference: 'AMR-41600-S68K00',
      designation: 'AMORTISSEUR AVANT GAUCHE',
      versionModele: 'S-PRESSO',
      typeVehicule: 'ABU310',
      prixHt: 185.000,
      stock: 3
    },
    {
      reference: 'BAT-55D23L',
      designation: 'BATTERIE 12V 60AH',
      versionModele: 'CELERIO',
      typeVehicule: 'GA416',
      prixHt: 220.000,
      stock: 8
    },
    {
      reference: 'CRR-17520-M68K00',
      designation: 'COURROIE DISTRIBUTION',
      versionModele: 'CELERIO',
      typeVehicule: 'GA416',
      prixHt: 85.000,
      stock: 5
    },
    {
      reference: 'FH-15600-M68K00',
      designation: 'FILTRE HUILE',
      versionModele: 'CELERIO',
      typeVehicule: 'GA416',
      prixHt: 18.500,
      stock: 20
    }
  ];

  // Clear existing data
  await prisma.piecesRechange.deleteMany({});
  console.log('Cleared existing parts data');

  // Add test data
  await prisma.piecesRechange.createMany({
    data: testParts,
    skipDuplicates: true
  });

  console.log(`Added ${testParts.length} test parts`);
  
  // Verify data
  const count = await prisma.piecesRechange.count();
  console.log(`Total parts in database: ${count}`);
  
  await prisma.$disconnect();
}

addTestData().catch(console.error);