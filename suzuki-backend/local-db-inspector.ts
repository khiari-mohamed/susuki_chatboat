import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
}

interface TableInfo {
  name: string;
  columns: TableColumn[];
}

interface DatabaseInspection {
  local: { [key: string]: TableInfo };
  timestamp: string;
}

// SAFE READ-ONLY LOCAL DATABASE INSPECTOR
async function inspectLocalDatabase(): Promise<void> {
  console.log('🔍 LOCAL DATABASE INSPECTION STARTING...');
  console.log('✅ READ-ONLY | NO MODIFICATIONS | AUDITABLE');
  
  const inspection: DatabaseInspection = {
    local: {},
    timestamp: new Date().toISOString()
  };

  console.log('\n📊 INSPECTING LOCAL DATABASE...');
  
  try {
    const prisma = new PrismaClient();
    
    // Use PostgreSQL system catalogs (SAFE queries)
    const tablesResult = await prisma.$queryRaw<Array<{table_name: string}>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE '_prisma_%'
    `;
    
    for (const table of tablesResult) {
      const columnsResult = await prisma.$queryRaw<Array<{
        column_name: string;
        data_type: string;
        is_nullable: string;
        column_default: string | null;
      }>>`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = ${table.table_name}
        ORDER BY ordinal_position
      `;

      const primaryKeysResult = await prisma.$queryRaw<Array<{column_name: string}>>`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = ${table.table_name}
          AND tc.constraint_type = 'PRIMARY KEY'
      `;

      const primaryKeyColumns = new Set(primaryKeysResult.map(pk => pk.column_name));
      
      inspection.local[table.table_name] = {
        name: table.table_name,
        columns: columnsResult.map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          isPrimaryKey: primaryKeyColumns.has(col.column_name)
        }))
      };
    }
    
    await prisma.$disconnect();
    console.log(`✅ Found ${Object.keys(inspection.local).length} tables in local database`);
    
  } catch (error) {
    console.error('❌ Error inspecting local database:', error);
    return;
  }

  // Save inspection results
  const outputFile = `local-db-inspection-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(inspection, null, 2));
  console.log(`\n💾 Inspection saved to: ${outputFile}`);

  // Local database analysis
  console.log('\n🧩 LOCAL DATABASE ANALYSIS:');
  console.log('='.repeat(50));
  
  console.log(`\n📊 Found ${Object.keys(inspection.local).length} tables in local database:`);
  Object.keys(inspection.local).forEach(tableName => {
    const table = inspection.local[tableName];
    console.log(`\n📋 ${tableName}:`);
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
inspectLocalDatabase().catch(console.error);