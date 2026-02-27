const { Client } = require('pg');
require('dotenv').config();

async function checkRearBrakes() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  console.log('\n🔍 Rear brake parts (AR) in database:\n');
  
  const queries = [
    { name: 'Disque AR', query: "designation ILIKE '%disque%' AND designation ILIKE '%ar%'" },
    { name: 'Plaquette AR', query: "designation ILIKE '%plaquette%' AND designation ILIKE '%ar%'" },
    { name: 'Tambour AR', query: "designation ILIKE '%tambour%'" },
    { name: 'All AR brake parts', query: "(designation ILIKE '%frein%' OR designation ILIKE '%brake%') AND (designation ILIKE '%ar%' OR designation ILIKE '%arriere%')" }
  ];
  
  for (const q of queries) {
    const result = await client.query(`
      SELECT designation, reference 
      FROM pieces_rechange 
      WHERE version_modele ILIKE '%SPRESSO%' 
      AND ${q.query}
      ORDER BY designation
      LIMIT 10
    `);
    
    console.log(`\n${q.name}: ${result.rows.length} parts`);
    result.rows.forEach(row => {
      console.log(`  - ${row.designation}`);
    });
  }
  
  await client.end();
}

checkRearBrakes().catch(console.error);
