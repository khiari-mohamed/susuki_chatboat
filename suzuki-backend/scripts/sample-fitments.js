const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public'
  });

  await client.connect();

  const query = `
    SELECT
      vmm.modele AS vehicle_model_name,
      vtm.type_code,
      vtm.model_name AS type_model_name,
      f.part_reference,
      p.reference AS part_reference_from_parts,
      p.designation AS part_designation,
      p.designation_2 AS part_designation_fr,
      p.categorie,
      p.fabricant,
      p.source
    FROM vehicle_model_map vmm
    LEFT JOIN vehicle_type_master vtm
      ON vtm.type_code = vmm.type_code
    LEFT JOIN fitment f
      ON f.type_code = vtm.type_code
    LEFT JOIN parts p
      ON p.reference = f.part_reference
    WHERE UPPER(TRIM(vmm.modele)) IN ('SWIFT', 'NEW SWIFT', 'S-WIFT', 'NEW S-WIFT')
      OR UPPER(TRIM(vtm.model_name)) IN ('SWIFT', 'NEW SWIFT', 'S-WIFT', 'NEW S-WIFT')
    ORDER BY vmm.modele, vtm.type_code, f.part_reference
    LIMIT 10;
  `;

  const result = await client.query(query);
  console.log(JSON.stringify(result.rows, null, 2));
  console.log(`\nRows returned: ${result.rows.length}`);
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});