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
  local?: { [key: string]: TableInfo };
  production?: { [key: string]: TableInfo };
  timestamp: string;
}

interface ComparisonResult {
  onlyInLocal: string[];
  onlyInProduction: string[];
  different: {
    tableName: string;
    differences: string[];
  }[];
  identical: string[];
}

function compareColumns(localCols: TableColumn[], prodCols: TableColumn[]): string[] {
  const differences: string[] = [];
  const localColMap = new Map(localCols.map(col => [col.name, col]));
  const prodColMap = new Map(prodCols.map(col => [col.name, col]));

  // Check columns only in local
  for (const [colName, col] of localColMap) {
    if (!prodColMap.has(colName)) {
      differences.push(`Column '${colName}' exists only in LOCAL`);
    }
  }

  // Check columns only in production
  for (const [colName, col] of prodColMap) {
    if (!localColMap.has(colName)) {
      differences.push(`Column '${colName}' exists only in PRODUCTION`);
    }
  }

  // Check differences in common columns
  for (const [colName, localCol] of localColMap) {
    const prodCol = prodColMap.get(colName);
    if (prodCol) {
      if (localCol.type !== prodCol.type) {
        differences.push(`Column '${colName}' type: LOCAL(${localCol.type}) vs PROD(${prodCol.type})`);
      }
      if (localCol.nullable !== prodCol.nullable) {
        differences.push(`Column '${colName}' nullable: LOCAL(${localCol.nullable}) vs PROD(${prodCol.nullable})`);
      }
      if (localCol.isPrimaryKey !== prodCol.isPrimaryKey) {
        differences.push(`Column '${colName}' primary key: LOCAL(${localCol.isPrimaryKey}) vs PROD(${prodCol.isPrimaryKey})`);
      }
    }
  }

  return differences;
}

function compareDatabases(): void {
  console.log('🔍 DATABASE COMPARISON STARTING...');
  
  // Look for inspection files
  const localFiles = fs.readdirSync('.').filter(f => f.startsWith('local-db-inspection-') && f.endsWith('.json'));
  const prodFiles = fs.readdirSync('.').filter(f => f.startsWith('prod-db-inspection-') && f.endsWith('.json'));

  if (localFiles.length === 0) {
    console.log('❌ No local database inspection file found. Run local-db-inspector.ts first.');
    return;
  }

  if (prodFiles.length === 0) {
    console.log('⚠️  No production database inspection file found.');
    console.log('📝 To get production data, you need to:');
    console.log('   1. Connect to the production network/VPN');
    console.log('   2. Run: npx ts-node prod-db-inspector.ts');
    console.log('   3. Then run this comparison again');
    console.log('\n📊 For now, showing LOCAL database structure only:');
    
    const localData: DatabaseInspection = JSON.parse(fs.readFileSync(localFiles[0], 'utf8'));
    if (localData.local) {
      console.log(`\n📋 LOCAL DATABASE (${Object.keys(localData.local).length} tables):`);
      Object.keys(localData.local).forEach(tableName => {
        const table = localData.local![tableName];
        console.log(`\n  📋 ${tableName} (${table.columns.length} columns)`);
        table.columns.forEach(col => {
          const pkIndicator = col.isPrimaryKey ? ' [PK]' : '';
          const nullIndicator = col.nullable ? ' (nullable)' : ' (required)';
          console.log(`    • ${col.name}: ${col.type}${pkIndicator}${nullIndicator}`);
        });
      });
    }
    return;
  }

  // Load both files
  const localData: DatabaseInspection = JSON.parse(fs.readFileSync(localFiles[0], 'utf8'));
  const prodData: DatabaseInspection = JSON.parse(fs.readFileSync(prodFiles[0], 'utf8'));

  if (!localData.local || !prodData.production) {
    console.log('❌ Invalid inspection data format');
    return;
  }

  const comparison: ComparisonResult = {
    onlyInLocal: [],
    onlyInProduction: [],
    different: [],
    identical: []
  };

  const localTables = new Set(Object.keys(localData.local));
  const prodTables = new Set(Object.keys(prodData.production));

  // Find tables only in local
  for (const table of localTables) {
    if (!prodTables.has(table)) {
      comparison.onlyInLocal.push(table);
    }
  }

  // Find tables only in production
  for (const table of prodTables) {
    if (!localTables.has(table)) {
      comparison.onlyInProduction.push(table);
    }
  }

  // Compare common tables
  for (const table of localTables) {
    if (prodTables.has(table)) {
      const localTable = localData.local[table];
      const prodTable = prodData.production[table];
      const differences = compareColumns(localTable.columns, prodTable.columns);
      
      if (differences.length > 0) {
        comparison.different.push({
          tableName: table,
          differences
        });
      } else {
        comparison.identical.push(table);
      }
    }
  }

  // Display results
  console.log('\n🔍 DATABASE COMPARISON RESULTS:');
  console.log('='.repeat(60));

  console.log(`\n📊 SUMMARY:`);
  console.log(`   • Tables only in LOCAL: ${comparison.onlyInLocal.length}`);
  console.log(`   • Tables only in PRODUCTION: ${comparison.onlyInProduction.length}`);
  console.log(`   • Tables with differences: ${comparison.different.length}`);
  console.log(`   • Identical tables: ${comparison.identical.length}`);

  if (comparison.onlyInLocal.length > 0) {
    console.log(`\n🏠 TABLES ONLY IN LOCAL (${comparison.onlyInLocal.length}):`);
    comparison.onlyInLocal.forEach(table => console.log(`   • ${table}`));
  }

  if (comparison.onlyInProduction.length > 0) {
    console.log(`\n🏭 TABLES ONLY IN PRODUCTION (${comparison.onlyInProduction.length}):`);
    comparison.onlyInProduction.forEach(table => console.log(`   • ${table}`));
  }

  if (comparison.different.length > 0) {
    console.log(`\n⚠️  TABLES WITH DIFFERENCES (${comparison.different.length}):`);
    comparison.different.forEach(diff => {
      console.log(`\n   📋 ${diff.tableName}:`);
      diff.differences.forEach(d => console.log(`      • ${d}`));
    });
  }

  if (comparison.identical.length > 0) {
    console.log(`\n✅ IDENTICAL TABLES (${comparison.identical.length}):`);
    comparison.identical.forEach(table => console.log(`   • ${table}`));
  }

  // Save comparison results
  const outputFile = `db-comparison-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(comparison, null, 2));
  console.log(`\n💾 Comparison saved to: ${outputFile}`);
  console.log('\n✅ DATABASE COMPARISON COMPLETED!');
}

// Run the comparison
compareDatabases();