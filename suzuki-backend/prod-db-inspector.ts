import { Client } from 'pg';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load local environment variables
dotenv.config();

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
}

interface TableInfo {
  name: string;
  columns: TableColumn[];
  rowCount: number;
}

interface DatabaseInspection {
  production: { [key: string]: TableInfo };
  timestamp: string;
}

// SAFE READ-ONLY LOCAL DATABASE INSPECTOR
async function inspectProductionDatabase(): Promise<void> {
  console.log('🔍 LOCAL DATABASE INSPECTION STARTING...');
  console.log('✅ READ-ONLY | NO MODIFICATIONS | AUDITABLE');
  
  const inspection: DatabaseInspection = {
    production: {},
    timestamp: new Date().toISOString()
  };

  console.log('\n📊 INSPECTING LOCAL DATABASE...');
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();
    
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Get row count
      const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const rowCount = parseInt(countResult.rows[0].count);
      
      // Get columns info
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);

      // Get primary keys
      const primaryKeysResult = await client.query(`
        SELECT a.attname as column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary
      `, [tableName]);

      const primaryKeyColumns = new Set(primaryKeysResult.rows.map(pk => pk.column_name));
      
      inspection.production[tableName] = {
        name: tableName,
        rowCount: rowCount,
        columns: columnsResult.rows.map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          isPrimaryKey: primaryKeyColumns.has(col.column_name)
        }))
      };
    }
    
    await client.end();
    console.log(`✅ Found ${Object.keys(inspection.production).length} tables in local database`);
    
  } catch (error) {
    console.error('❌ Error inspecting production database:', error);
    return;
  }

  // Save inspection results
  const outputFile = `local-db-inspection-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(inspection, null, 2));
  console.log(`\n💾 Inspection saved to: ${outputFile}`);

  // Local database analysis
  console.log('\n🧩 LOCAL DATABASE ANALYSIS:');
  console.log('='.repeat(50));
  
  const totalRows = Object.values(inspection.production).reduce((sum, table) => sum + table.rowCount, 0);
  console.log(`\n📊 Found ${Object.keys(inspection.production).length} tables with ${totalRows} total rows in local database:`);
  Object.keys(inspection.production).forEach(tableName => {
    const table = inspection.production[tableName];
    console.log(`\n📋 ${tableName}: ${table.rowCount} rows`);
    console.log(`  Columns: ${table.columns.length}`);
    table.columns.forEach(col => {
      const pkIndicator = col.isPrimaryKey ? ' [PK]' : '';
      const nullIndicator = col.nullable ? ' (nullable)' : ' (required)';
      console.log(`    • ${col.name}: ${col.type}${pkIndicator}${nullIndicator}`);
    });
  });

  console.log('\n✅ LOCAL INSPECTION COMPLETED!');
  console.log(`📄 Full results saved to: ${outputFile}`);
  console.log('🔒 No credentials exposed | No unsafe queries | Read-only operations');
}

// Run the inspection
inspectProductionDatabase().catch(console.error);