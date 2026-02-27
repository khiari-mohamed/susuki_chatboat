const { Client } = require('pg');
require('dotenv').config();

async function checkDisqueDB() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  const result = await client.query(`
    SELECT designation, reference 
    FROM pieces_rechange 
    WHERE version_modele ILIKE '%SPRESSO%' 
    AND designation ILIKE '%disque%frein%' 
    ORDER BY designation
  `);
  
  console.log('\n🔍 Disque frein parts in database:\n');
  result.rows.forEach(row => {
    console.log(`${row.designation} - ${row.reference}`);
  });
  console.log(`\nTotal: ${result.rows.length} parts\n`);
  
  await client.end();
}

checkDisqueDB().catch(console.error);
