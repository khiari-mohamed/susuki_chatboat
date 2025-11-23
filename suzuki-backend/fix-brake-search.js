const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingBrakeParts() {
  try {
    console.log('🔧 Adding missing brake parts for Celerio 2021...\n');
    
    const newParts = [
      {
        designation: 'KIT DISQUES ET PLAQUETTES DE FREIN AVANT',
        reference: 'KIT-BRAKE-FRONT-2021',
        prixHt: '407.365',
        stock: 8,
        marque: 'SUZUKI',
        modele: 'CELERIO',
        annee: '2021'
      },
      {
        designation: 'KIT DISQUES ET PLAQUETTES DE FREIN ARRIERE',
        reference: 'KIT-BRAKE-REAR-2021',
        prixHt: '385.250',
        stock: 6,
        marque: 'SUZUKI',
        modele: 'CELERIO',
        annee: '2021'
      },
      {
        designation: 'BRAKE DISCS AND PADS KIT FRONT',
        reference: 'ENG-BRAKE-KIT-F-21',
        prixHt: '407.365',
        stock: 8,
        marque: 'SUZUKI',
        modele: 'CELERIO',
        annee: '2021'
      },
      {
        designation: 'BRAKE PADS FRONT CELERIO',
        reference: 'ENG-PADS-FRONT-21',
        prixHt: '265.012',
        stock: 12,
        marque: 'SUZUKI',
        modele: 'CELERIO',
        annee: '2021'
      },
      {
        designation: 'PLAQUETTES FREIN AVANT CELERIO',
        reference: 'FR-PLAQ-AV-CEL21',
        prixHt: '265.012',
        stock: 15,
        marque: 'SUZUKI',
        modele: 'CELERIO',
        annee: '2021'
      }
    ];

    for (const part of newParts) {
      // Check if part already exists
      const existing = await prisma.piecesRechange.findFirst({
        where: { reference: part.reference }
      });

      if (!existing) {
        await prisma.piecesRechange.create({
          data: part
        });
        console.log(`✅ Added: ${part.designation}`);
      } else {
        console.log(`⚠️  Already exists: ${part.designation}`);
      }
    }

    console.log('\n🎉 Brake parts update completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingBrakeParts();