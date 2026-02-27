const { Client } = require('pg');
require('dotenv').config();

async function checkAmortisseurAR() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  const result = await client.query(`
    SELECT designation, reference 
    FROM pieces_rechange 
    WHERE version_modele ILIKE '%SPRESSO%' 
    AND designation ILIKE '%amortisseur%'
    ORDER BY designation
  `);
  
  console.log('\n🔍 All shock absorbers in database:\n');
  result.rows.forEach(row => {
    const hasAR = /\b(ar|arriere|arrière)\b/i.test(row.designation);
    const hasAV = /\b(av|avant)\b/i.test(row.designation);
    const marker = hasAR ? '🔴 AR' : hasAV ? '🟢 AV' : '⚪ NONE';
    console.log(`${marker} ${row.designation}`);
  });
  console.log(`\nTotal: ${result.rows.length} parts\n`);
  
  await client.end();
}

checkAmortisseurAR().catch(console.error);
