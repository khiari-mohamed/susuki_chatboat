import { PrismaClient } from '@prisma/client';
import sql from 'mssql';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables from .env.prod
dotenv.config({ path: '.env.prod' });

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
  production: { [key: string]: TableInfo };
  local: { [key: string]: TableInfo };
  timestamp: string;
}

// SAFE READ-ONLY DATABASE INSPECTOR
async function inspectDatabases(): Promise<void> {
  console.log('🔍 SAFE DATABASE INSPECTION STARTING...');
  console.log('✅ READ-ONLY | NO MODIFICATIONS | AUDITABLE');
  
  // Validate environment variables
  const requiredEnvVars = ['PROD_DB_SERVER', 'PROD_DB_USER', 'PROD_DB_PASSWORD', 'PROD_DB_NAME'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.log('\n📝 Create a .env file with:');
    console.log('PROD_DB_SERVER=CARPRO-VPS-04\\CARPRO_INST_PROD');
    console.log('PROD_DB_USER=Carpro.Chatbot');
    console.log('PROD_DB_PASSWORD=your_password_here');
    console.log('PROD_DB_NAME=CARPRO_DB');
    return;
  }

  const inspection: DatabaseInspection = {
    production: {},
    local: {},
    timestamp: new Date().toISOString()
  };

  // 1. INSPECT PRODUCTION DATABASE (SQL Server)
  console.log('\n📊 INSPECTING PRODUCTION DATABASE...');
  
  const sqlConfig = {
    server: process.env.PROD_DB_SERVER!,
    user: process.env.PROD_DB_USER!,
    password: process.env.PROD_DB_PASSWORD!,
    database: process.env.PROD_DB_NAME!,
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  };

  try {
    await sql.connect(sqlConfig);
    console.log('✅ Connected to production SQL Server');

    // Focus on relevant tables only (parts, prices, models, stock)
    const relevantTables = ['T_ARTICLE', 'T_MODELE', 'T_PRIX', 'T_STOCK', 'ARTICLE', 'MODELE', 'PRIX', 'STOCK'];
    const tableFilter = relevantTables.map(t => `'${t}'`).join(',');

    const tablesQuery = `
      SELECT 
        t.TABLE_NAME,
        c.COLUMN_NAME,
        c.DATA_TYPE,
        c.IS_NULLABLE,
        CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END as IS_PRIMARY_KEY
      FROM INFORMATION_SCHEMA.TABLES t
      LEFT JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
      LEFT JOIN (
        SELECT ku.TABLE_NAME, ku.COLUMN_NAME
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
        WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
      ) pk ON c.TABLE_NAME = pk.TABLE_NAME AND c.COLUMN_NAME = pk.COLUMN_NAME
      WHERE t.TABLE_TYPE = 'BASE TABLE'
        AND (t.TABLE_NAME IN (${tableFilter}) OR t.TABLE_NAME LIKE '%ARTICLE%' OR t.TABLE_NAME LIKE '%MODELE%' OR t.TABLE_NAME LIKE '%PRIX%' OR t.TABLE_NAME LIKE '%STOCK%')
      ORDER BY t.TABLE_NAME, c.ORDINAL_POSITION
    `;

    const result = await sql.query(tablesQuery);
    
    result.recordset.forEach((row: any) => {
      if (!inspection.production[row.TABLE_NAME]) {
        inspection.production[row.TABLE_NAME] = {
          name: row.TABLE_NAME,
          columns: []
        };
      }
      
      inspection.production[row.TABLE_NAME].columns.push({
        name: row.COLUMN_NAME,
        type: row.DATA_TYPE,
        nullable: row.IS_NULLABLE === 'YES',
        isPrimaryKey: row.IS_PRIMARY_KEY === 1
      });
    });

    await sql.close();
    console.log(`✅ Found ${Object.keys(inspection.production).length} relevant tables in production`);

  } catch (error) {
    console.error('❌ Error inspecting production database:', error);
    return;
  }

  // 2. INSPECT LOCAL DATABASE (PostgreSQL)
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

  // 3. SAVE INSPECTION RESULTS
  const outputFile = `db-inspection-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(inspection, null, 2));
  console.log(`\n💾 Inspection saved to: ${outputFile}`);

  // 4. CONCEPT MAPPING (not direct table comparison)
  console.log('\n🧩 CONCEPT MAPPING ANALYSIS:');
  console.log('='.repeat(50));
  
  const conceptMap = {
    'Parts/Articles': {
      production: Object.keys(inspection.production).filter(t => 
        t.toLowerCase().includes('article') || t.toLowerCase().includes('part')
      ),
      local: Object.keys(inspection.local).filter(t => 
        t.toLowerCase().includes('part') || t.toLowerCase().includes('article')
      )
    },
    'Models': {
      production: Object.keys(inspection.production).filter(t => 
        t.toLowerCase().includes('modele') || t.toLowerCase().includes('model')
      ),
      local: Object.keys(inspection.local).filter(t => 
        t.toLowerCase().includes('model')
      )
    },
    'Prices': {
      production: Object.keys(inspection.production).filter(t => 
        t.toLowerCase().includes('prix') || t.toLowerCase().includes('price')
      ),
      local: Object.keys(inspection.local).filter(t => 
        t.toLowerCase().includes('price')
      )
    },
    'Stock': {
      production: Object.keys(inspection.production).filter(t => 
        t.toLowerCase().includes('stock')
      ),
      local: Object.keys(inspection.local).filter(t => 
        t.toLowerCase().includes('stock')
      )
    }
  };

  Object.entries(conceptMap).forEach(([concept, tables]) => {
    console.log(`\n📋 ${concept}:`);
    console.log(`  Production: ${tables.production.join(', ') || 'None found'}`);
    console.log(`  Local: ${tables.local.join(', ') || 'None found'}`);
    
    if (tables.production.length > 0 && tables.local.length > 0) {
      console.log(`  ✅ Concept exists in both systems`);
    } else if (tables.production.length > 0) {
      console.log(`  ⚠️  Missing in local system`);
    } else if (tables.local.length > 0) {
      console.log(`  ⚠️  Missing in production system`);
    }
  });

  console.log('\n✅ SAFE INSPECTION COMPLETED!');
  console.log(`📄 Full results saved to: ${outputFile}`);
  console.log('🔒 No credentials exposed | No unsafe queries | Read-only operations');
}

// Run the inspection
inspectDatabases().catch(console.error);