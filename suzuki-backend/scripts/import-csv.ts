import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import csv from 'csv-parser';
import * as path from 'path';

const prisma = new PrismaClient();

interface CSVRow {
  'Référence': string;
  'Désignation': string;
  'Version modèle': string;
  'Type vehicule': string;
  'Prix HT': string;
  'Stock': string;
}

async function importCSV() {
  const csvPath = 'C:\\Users\\LENOVO\\Downloads\\Base-test-_-02-modèles_.csv';
  
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    process.exit(1);
  }

  console.log('Starting CSV import...');
  
  const results: CSVRow[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data: CSVRow) => results.push(data))
      .on('end', async () => {
        try {
          console.log(`Found ${results.length} records to import`);
          
          // Clear existing data
          await prisma.piecesRechange.deleteMany({});
          console.log('Cleared existing parts data');
          
          // Import new data in batches
          const batchSize = 100;
          let imported = 0;
          
          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            
            const data = batch.map(row => {
              const prix = parseFloat(row['Prix HT'].replace(',', '.'));
              const stock = parseInt(row['Stock']);
              
              return {
                reference: row['Référence'].trim(),
                designation: row['Désignation'].trim(),
                versionModele: row['Version modèle'].trim(),
                typeVehicule: row['Type vehicule'].trim(),
                prixHt: isNaN(prix) ? 0 : prix,
                stock: isNaN(stock) ? 0 : stock
              };
            }).filter(item => item.reference && item.designation);
            
            await prisma.piecesRechange.createMany({
              data,
              skipDuplicates: true
            });
            
            imported += batch.length;
            console.log(`Imported ${imported}/${results.length} records`);
          }
          
          console.log('CSV import completed successfully!');
          
          // Add some sample vehicles for testing
          await addSampleVehicles();
          
          resolve(true);
        } catch (error) {
          console.error('Error importing CSV:', error);
          reject(error);
        }
      })
      .on('error', reject);
  });
}

async function addSampleVehicles() {
  console.log('Adding sample vehicles...');
  
  const vehicles = [
    {
      immatriculation: '243 TUN 4698',
      vin: 'MA3FC41S4K0123456',
      marque: 'SUZUKI',
      modele: 'CELERIO',
      annee: 2024,
      type: 'GA416-TYPE1',
      couleur: 'Blanc',
      proprietaire: 'Ahmed Ben Ali',
      dateAchat: new Date('2024-03-15')
    },
    {
      immatriculation: '156 TUN 7892',
      vin: 'MA3FC41S4K0789012',
      marque: 'SUZUKI',
      modele: 'S-PRESSO',
      annee: 2023,
      type: 'ABU310-TYPE1',
      couleur: 'Rouge',
      proprietaire: 'Fatma Trabelsi',
      dateAchat: new Date('2023-11-20')
    },
    {
      immatriculation: '789 TUN 1234',
      vin: 'MA3FC41S4K0345678',
      marque: 'SUZUKI',
      modele: 'CELERIO',
      annee: 2023,
      type: 'GA416-TYPE1',
      couleur: 'Bleu',
      proprietaire: 'Mohamed Sassi',
      dateAchat: new Date('2023-08-10')
    }
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { immatriculation: vehicle.immatriculation },
      update: {},
      create: vehicle,
    });
  }

  console.log('Sample vehicles added!');
}

async function main() {
  try {
    await importCSV();
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();