const { Client } = require('pg');
require('dotenv').config();

async function checkEchappement() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  console.log('\n🔍 Checking exhaust parts for CELERIO...\n');
  
  const result = await client.query(`
    SELECT designation, reference, prix_ht, stock 
    FROM pieces_rechange 
    WHERE version_modele ILIKE '%CELERIO%'
    AND (
      designation ILIKE '%ECHAPPEMENT%'
      OR designation ILIKE '%SILENCIEUX%'
      OR designation ILIKE '%POT%'
      OR designation ILIKE '%CATALYSEUR%'
      OR designation ILIKE '%TUYAU%'
    )
    ORDER BY designation
  `);
  
  if (result.rows.length === 0) {
    console.log('❌ NO exhaust parts found for CELERIO\n');
  } else {
    result.rows.forEach(p => {
      console.log(`✅ ${p.designation}`);
      console.log(`   Ref: ${p.reference} | Prix: ${p.prix_ht} TND | Stock: ${p.stock}\n`);
    });
  }
  
  console.log(`Total: ${result.rows.length} parts\n`);
  
  await client.end();
}

checkEchappement().catch(console.error);
