import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

type PrismaColumnInfo = {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
};

type PrismaPKInfo = {
  column_name: string;
};

type PrismaFKInfo = {
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
  constraint_name: string;
};

interface SchemaField {
  fieldName: string;
  columnName: string;
  type: string;
  isOptional: boolean;
  isRelation: boolean;
  relationFields?: string[];
  references?: string[];
  rawLine: string;
}

interface SchemaModel {
  modelName: string;
  tableName: string;
  fields: SchemaField[];
}

interface TableAuditColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  defaultValue: string | null;
  nullCount: number;
  emptyRate: string;
}

interface TableAudit {
  tableName: string;
  rowCount: number;
  columns: TableAuditColumn[];
  sampleRows: Array<Record<string, unknown>>;
  issues: string[];
  schemaModel?: SchemaModel;
  warnings: string[];
}

interface PartCategoryCount {
  categorie: string | null;
  count: number;
}

interface PartRelationSummary {
  sourceModel: string;
  relationField: string;
  sourceColumn: string;
  targetModel: string;
  targetColumn: string;
}

interface PartDomainAnalysis {
  totalParts: number;
  partsWithStock: number;
  partsWithFitments: number;
  partsWithItemReferences: number;
  distinctPartCategories: number;
  categoryCounts: PartCategoryCount[];
  topManufacturers: Array<{ fabricant: string | null; count: number }>;
  vehicleModelFitmentCounts: Array<{ typeCode: string; modelName: string; fitmentCount: number }>;
  vehicleModelCounts: Array<{ modele: string | null; count: number }>;
  totalVehicleTypes: number;
  totalVehicles: number;
  partRelationSummaries: PartRelationSummary[];
}

interface AuditResult {
  timestamp: string;
  env: {
    envPath: string;
    databaseUrl: string;
    parsedDatabaseUrl: {
      protocol: string;
      host: string;
      port: string;
      database: string;
      schema: string;
      user: string;
    } | null;
    warnings: string[];
  };
  tables: TableAudit[];
  foreignKeys: PrismaFKInfo[];
  schemaIssues: string[];
  summary: {
    tables: number;
    totalRows: number;
    totalColumns: number;
    totalIssues: number;
    emptyTables: number;
    missingSchemaModels: number;
    missingDatabaseTables: number;
    missingColumns: number;
    foreignKeys: number;
    scope: string;
  };
  partAnalysis: PartDomainAnalysis;
}

const SCRIPT_ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(SCRIPT_ROOT, 'prisma', 'schema.prisma');
const PART_DOMAIN_TABLES = new Set([
  'parts',
  'stock',
  'fitment',
  'item_references',
  'synonyms',
  'vehicle_type_master',
  'vehicles'
]);
const EXCLUDED_TABLE_PATTERNS: RegExp[] = [/^chat_/i];
const DEFAULT_SCOPE = 'parts';

function sanitizeIdentifier(value: string): string {
  return value.replace(/"/g, '""');
}

function isValidIdentifier(value: string): boolean {
  return /^[A-Za-z0-9_]+$/.test(value);
}

function parseDatabaseUrl(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);
    const protocol = url.protocol.replace(':', '');
    const schema = url.searchParams.get('schema') || 'public';
    return {
      protocol,
      host: url.hostname,
      port: url.port || '5432',
      database: url.pathname.replace(/^\//, ''),
      schema,
      user: url.username,
    };
  } catch (error) {
    return null;
  }
}

function loadPrismaSchema(): Record<string, SchemaModel> {
  if (!fs.existsSync(SCHEMA_PATH)) {
    throw new Error(`schema.prisma not found at ${SCHEMA_PATH}`);
  }

  const schemaText = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const modelRegex = /model\s+([A-Za-z0-9_]+)\s*{([\s\S]*?)^}/gm;
  const schemaModels: Record<string, SchemaModel> = {};
  let modelMatch: RegExpExecArray | null;

  while ((modelMatch = modelRegex.exec(schemaText)) !== null) {
    const modelName = modelMatch[1];
    const modelBody = modelMatch[2];

    const mapMatch = modelBody.match(/@@map\("([^"]+)"\)/);
    const tableName = mapMatch ? mapMatch[1] : modelName;
    const fields: SchemaField[] = [];

    modelBody.split('\n').forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line || line.startsWith('//') || line.startsWith('@@')) {
        return;
      }

      const fieldTokens = line.split(/\s+/);
      if (fieldTokens.length < 2) {
        return;
      }

      const fieldName = fieldTokens[0];
      const fieldType = fieldTokens[1];
      const isOptional = fieldType.endsWith('?');
      const mapAttr = line.match(/@map\("([^"]+)"\)/);
      const columnName = mapAttr ? mapAttr[1] : fieldName;
      const relationAttr = line.match(/@relation\(([^)]*)\)/);
      let relationFields: string[] | undefined;
      let references: string[] | undefined;

      if (relationAttr) {
        const relationArgs = relationAttr[1];
        const fieldsMatch = relationArgs.match(/fields:\s*\[([^\]]+)\]/);
        const referencesMatch = relationArgs.match(/references:\s*\[([^\]]+)\]/);
        if (fieldsMatch) {
          relationFields = fieldsMatch[1].split(',').map((value) => value.trim().replace(/"/g, ''));
        }
        if (referencesMatch) {
          references = referencesMatch[1].split(',').map((value) => value.trim().replace(/"/g, ''));
        }
      }

      fields.push({
        fieldName,
        columnName,
        type: fieldType,
        isOptional,
        isRelation: Boolean(relationAttr),
        relationFields,
        references,
        rawLine: line,
      });
    });

    schemaModels[tableName] = {
      modelName,
      tableName,
      fields,
    };
  }

  return schemaModels;
}

async function inspectDatabase() {
  const envPath = path.join(SCRIPT_ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error(`No .env file found at ${envPath}. Create one or copy from .env.example.`);
  }

  dotenv.config({ path: envPath });

  const databaseUrl = process.env.DATABASE_URL?.trim() || '';
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in .env. Please verify the backend database link.');
  }

  const parsedDatabaseUrl = parseDatabaseUrl(databaseUrl);
  const envWarnings: string[] = [];
  if (!parsedDatabaseUrl) {
    envWarnings.push('DATABASE_URL could not be parsed. Confirm the connection string format.');
  } else if (!['postgresql', 'postgres'].includes(parsedDatabaseUrl.protocol)) {
    envWarnings.push(`DATABASE_URL protocol is ${parsedDatabaseUrl.protocol}; expected postgresql or postgres.`);
  }

  const schemaModels = loadPrismaSchema();
  const modelTableNames = new Set(Object.keys(schemaModels));
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();

    const tableRows = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE '_prisma_%'
      ORDER BY table_name
    `;

    const scopeArg = process.argv.find((arg) => arg.startsWith('--scope='));
    const scope = scopeArg ? scopeArg.split('=')[1] : DEFAULT_SCOPE;
    const includeChat = process.argv.includes('--include-chat') || scope === 'all';
    const onlyParts = ['parts', 'parts-only', 'part-only', DEFAULT_SCOPE].includes(scope) || process.argv.includes('--parts');

    let includedTableNames = tableRows.map((row) => row.table_name);
    if (!includeChat) {
      includedTableNames = includedTableNames.filter(
        (tableName) => !EXCLUDED_TABLE_PATTERNS.some((pattern) => pattern.test(tableName))
      );
    }
    if (onlyParts) {
      includedTableNames = includedTableNames.filter((tableName) => PART_DOMAIN_TABLES.has(tableName));
    }
    const includedTableSet = new Set(includedTableNames);

    const foreignKeys = await prisma.$queryRaw<Array<PrismaFKInfo>>`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.constraint_schema = kcu.constraint_schema
      JOIN information_schema.referential_constraints AS rc
        ON tc.constraint_name = rc.constraint_name
        AND tc.constraint_schema = rc.constraint_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = rc.unique_constraint_name
        AND ccu.constraint_schema = rc.unique_constraint_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.ordinal_position
    `;

    const filteredForeignKeys = foreignKeys.filter(
      (fk) => includedTableSet.has(fk.table_name) || includedTableSet.has(fk.foreign_table_name)
    );

    const tableAudits: TableAudit[] = [];
    const partAnalysis: PartDomainAnalysis = {
      totalParts: 0,
      partsWithStock: 0,
      partsWithFitments: 0,
      partsWithItemReferences: 0,
      distinctPartCategories: 0,
      categoryCounts: [],
      topManufacturers: [],
      vehicleModelFitmentCounts: [],
      vehicleModelCounts: [],
      totalVehicleTypes: 0,
      totalVehicles: 0,
      partRelationSummaries: [],
    };

    if (onlyParts) {
      const partQuery = async () => {
        const partsRowCount = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
          `SELECT COUNT(*)::int AS count FROM "parts";`
        );
        partAnalysis.totalParts = Number(partsRowCount[0]?.count ?? 0);

        const partsWithStock = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
          `SELECT COUNT(DISTINCT p.reference)::int AS count FROM "parts" p JOIN "stock" s ON p.reference = s.reference;`
        );
        partAnalysis.partsWithStock = Number(partsWithStock[0]?.count ?? 0);

        const partsWithFitments = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
          `SELECT COUNT(DISTINCT part_reference)::int AS count FROM "fitment";`
        );
        partAnalysis.partsWithFitments = Number(partsWithFitments[0]?.count ?? 0);

        const partsWithItemReferences = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
          `SELECT COUNT(DISTINCT part_reference)::int AS count FROM "item_references";`
        );
        partAnalysis.partsWithItemReferences = Number(partsWithItemReferences[0]?.count ?? 0);

        const categoryCounts = await prisma.$queryRawUnsafe<Array<{ categorie: string | null; count: number }>>(
          `SELECT categorie, COUNT(*)::int AS count FROM "parts" GROUP BY categorie ORDER BY count DESC LIMIT 30;`
        );
        partAnalysis.categoryCounts = categoryCounts.map((row) => ({ categorie: row.categorie, count: row.count }));
        partAnalysis.distinctPartCategories = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
          `SELECT COUNT(DISTINCT categorie)::int AS count FROM "parts";`
        ).then((rows) => Number(rows[0]?.count ?? 0));

        const topManufacturers = await prisma.$queryRawUnsafe<Array<{ fabricant: string | null; count: number }>>(
          `SELECT fabricant, COUNT(*)::int AS count FROM "parts" GROUP BY fabricant ORDER BY count DESC LIMIT 20;`
        );
        partAnalysis.topManufacturers = topManufacturers.map((row) => ({ fabricant: row.fabricant, count: row.count }));

        const vehicleModelCounts = await prisma.$queryRawUnsafe<Array<{ modele: string | null; count: number }>>(
          `SELECT modele, COUNT(*)::int AS count FROM "vehicles" GROUP BY modele ORDER BY count DESC LIMIT 30;`
        );
        partAnalysis.vehicleModelCounts = vehicleModelCounts.map((row) => ({ modele: row.modele, count: row.count }));

        const vehicleTypeCount = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
          `SELECT COUNT(*)::int AS count FROM "vehicle_type_master";`
        );
        partAnalysis.totalVehicleTypes = Number(vehicleTypeCount[0]?.count ?? 0);

        const totalVehicleCount = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
          `SELECT COUNT(*)::int AS count FROM "vehicles";`
        );
        partAnalysis.totalVehicles = Number(totalVehicleCount[0]?.count ?? 0);

        const vehicleModelFitmentCounts = await prisma.$queryRawUnsafe<Array<{ type_code: string; model_name: string; fitment_count: number }>>(
          `SELECT type_code, model_name, COUNT(*)::int AS fitment_count FROM "fitment" GROUP BY type_code, model_name ORDER BY fitment_count DESC LIMIT 30;`
        );
        partAnalysis.vehicleModelFitmentCounts = vehicleModelFitmentCounts.map((row) => ({ typeCode: row.type_code, modelName: row.model_name, fitmentCount: row.fitment_count }));
      };
      await partQuery();
    }

    let totalRows = 0;
    let totalColumns = 0;
    let totalIssues = 0;
    let emptyTables = 0;
    let missingColumns = 0;

    const actualTableNames = new Set<string>();

    for (const tableName of includedTableNames) {
      actualTableNames.add(tableName);

      const tableIssues: string[] = [];
      const tableWarnings: string[] = [];
      const schemaModel = schemaModels[tableName];
      if (!schemaModel) {
        tableIssues.push(`No Prisma model found for database table '${tableName}'.`);
      }

      if (!isValidIdentifier(tableName)) {
        tableWarnings.push(`Database table name '${tableName}' contains unsafe characters.`);
      }

      const columnsResult = await prisma.$queryRaw<Array<PrismaColumnInfo>>`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = ${tableName}
        ORDER BY ordinal_position
      `;

      const primaryKeysResult = await prisma.$queryRaw<Array<PrismaPKInfo>>`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.constraint_schema = kcu.constraint_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = ${tableName}
      `;

      const primaryKeySet = new Set(primaryKeysResult.map((item) => item.column_name));
      const rowCountResult = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
        `SELECT COUNT(*)::int AS count FROM "${sanitizeIdentifier(tableName)}";`
      );
      const rowCount = Number(rowCountResult[0]?.count ?? 0);
      totalRows += rowCount;

      const sampleRows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
        `SELECT * FROM "${sanitizeIdentifier(tableName)}" LIMIT 3;`
      );

      if (rowCount === 0) {
        tableIssues.push('Table contains zero rows.');
        emptyTables += 1;
      }

      if (schemaModel) {
        const schemaColumnNames = new Set(schemaModel.fields.map((field) => field.columnName));
        const dbColumnNames = new Set(columnsResult.map((col) => col.column_name));

        for (const field of schemaModel.fields) {
          if (!dbColumnNames.has(field.columnName)) {
            tableIssues.push(
              `Prisma field '${field.fieldName}' maps to column '${field.columnName}', but the column is not present in database table '${tableName}'.`
            );
            missingColumns += 1;
          }
        }

        for (const column of columnsResult) {
          if (!schemaColumnNames.has(column.column_name)) {
            tableIssues.push(
              `Database column '${column.column_name}' exists in table '${tableName}' but is not declared in Prisma model '${schemaModel.modelName}'.`
            );
            missingColumns += 1;
          }
        }
      }

      const columns: TableAuditColumn[] = [];
      for (const column of columnsResult) {
        const columnName = column.column_name;
        if (!isValidIdentifier(columnName)) {
          tableWarnings.push(`Database column '${columnName}' includes characters outside [a-zA-Z0-9_].`);
        }

        const nullCountResult = await prisma.$queryRawUnsafe<Array<{ nullcount: number }>>(
          `SELECT COUNT(*)::int AS nullcount FROM "${sanitizeIdentifier(tableName)}" WHERE "${sanitizeIdentifier(columnName)}" IS NULL;`
        );
        const nullCount = Number(nullCountResult[0]?.nullcount ?? 0);
        const emptyRate = rowCount === 0 ? 'n/a' : `${((nullCount / rowCount) * 100).toFixed(1)}%`;

        if (rowCount > 0 && nullCount === rowCount) {
          tableIssues.push(
            `Column '${columnName}' is fully empty (${nullCount}/${rowCount} rows are NULL).`
          );
        }

        if (column.is_nullable === 'NO' && nullCount > 0) {
          tableIssues.push(
            `NOT NULL column '${columnName}' contains ${nullCount} NULL values.`
          );
        }

        columns.push({
          name: columnName,
          type: column.data_type,
          nullable: column.is_nullable === 'YES',
          isPrimaryKey: primaryKeySet.has(columnName),
          defaultValue: column.column_default,
          nullCount,
          emptyRate,
        });
      }

      totalColumns += columns.length;

      const columnNames = new Set(columns.map((col) => col.name));
      const model = schemaModel;

      if (model) {
        const relationFields = model.fields.filter((field) => field.isRelation && field.relationFields?.length && field.references?.length);
        relationFields.forEach((relationField) => {
          relationField.relationFields?.forEach((localField) => {
            if (!columnNames.has(localField)) {
              tableIssues.push(
                `Prisma relation field '${relationField.fieldName}' references local database column '${localField}', which does not exist in table '${tableName}'.`
              );
            }
          });
        });
      }

      const auditsForTable: TableAudit = {
        tableName,
        rowCount,
        columns,
        sampleRows,
        issues: tableIssues,
        schemaModel,
        warnings: tableWarnings,
      };

      tableAudits.push(auditsForTable);
      totalIssues += tableIssues.length;
    }

    const missingSchemaModels = [...modelTableNames].filter((tableName) => !actualTableNames.has(tableName));
    const missingDatabaseTables = [...actualTableNames].filter((tableName) => !modelTableNames.has(tableName));

    const partRelations: PartRelationSummary[] = [];
    for (const table of tableAudits) {
      if (!table.schemaModel) continue;
      table.schemaModel.fields
        .filter((field) => field.isRelation && field.relationFields?.length && field.references?.length)
        .forEach((field) => {
          partRelations.push({
            sourceModel: table.schemaModel!.modelName,
            relationField: field.fieldName,
            sourceColumn: field.relationFields![0],
            targetModel: field.type.replace(/\s+/g, ''),
            targetColumn: field.references![0],
          });
        });
    }

    partAnalysis.partRelationSummaries = partRelations;

    const result: AuditResult = {
      timestamp: new Date().toISOString(),
      env: {
        envPath,
        databaseUrl,
        parsedDatabaseUrl,
        warnings: envWarnings,
      },
      tables: tableAudits,
      foreignKeys: filteredForeignKeys,
      schemaIssues: missingSchemaModels.map((tableName) => `Prisma model exists for '${tableName}', but no matching database table was found.`),
      summary: {
        tables: tableAudits.length,
        totalRows,
        totalColumns,
        totalIssues: totalIssues + missingSchemaModels.length,
        emptyTables,
        missingSchemaModels: missingSchemaModels.length,
        missingDatabaseTables: missingDatabaseTables.length,
        missingColumns,
        foreignKeys: filteredForeignKeys.length,
        scope,
      },
      partAnalysis,
    };

    return result;
  } finally {
    await prisma.$disconnect();
  }
}

function formatReport(result: AuditResult): string {
  const lines: string[] = [];

  lines.push('DATABASE AUDIT REPORT');
  lines.push('='.repeat(80));
  lines.push(`Generated: ${result.timestamp}`);
  lines.push('');
  lines.push('ENVIRONMENT CHECK');
  lines.push('-'.repeat(80));
  lines.push(`env path: ${result.env.envPath}`);
  lines.push(`DATABASE_URL loaded: ${result.env.databaseUrl}`);
  if (result.env.parsedDatabaseUrl) {
    lines.push(`  protocol: ${result.env.parsedDatabaseUrl.protocol}`);
    lines.push(`  host: ${result.env.parsedDatabaseUrl.host}`);
    lines.push(`  port: ${result.env.parsedDatabaseUrl.port}`);
    lines.push(`  database: ${result.env.parsedDatabaseUrl.database}`);
    lines.push(`  schema: ${result.env.parsedDatabaseUrl.schema}`);
    lines.push(`  user: ${result.env.parsedDatabaseUrl.user}`);
  } else {
    lines.push('  WARNING: DATABASE_URL could not be parsed. Verify the connection string format.');
  }
  if (result.env.warnings.length > 0) {
    lines.push('  ENV WARNINGS:');
    result.env.warnings.forEach((warning) => lines.push(`    - ${warning}`));
  }

  lines.push('');
  lines.push('SUMMARY');
  lines.push('-'.repeat(80));
  lines.push(`Tables inspected: ${result.summary.tables}`);
  lines.push(`Total rows counted: ${result.summary.totalRows}`);
  lines.push(`Total columns inspected: ${result.summary.totalColumns}`);
  lines.push(`Total foreign key relationships: ${result.summary.foreignKeys}`);
  lines.push(`Audit scope: ${result.summary.scope}`);
  lines.push(`Empty tables: ${result.summary.emptyTables}`);
  lines.push(`Missing schema models: ${result.summary.missingSchemaModels}`);
  lines.push(`Database tables missing in schema: ${result.summary.missingDatabaseTables}`);
  lines.push(`Detected issues: ${result.summary.totalIssues}`);
  lines.push('');

  lines.push('PART DOMAIN ANALYSIS');
  lines.push('-'.repeat(80));
  lines.push(`Total parts: ${result.partAnalysis.totalParts}`);
  lines.push(`Parts linked to stock rows: ${result.partAnalysis.partsWithStock}`);
  lines.push(`Parts linked to fitment rows: ${result.partAnalysis.partsWithFitments}`);
  lines.push(`Parts linked to item references: ${result.partAnalysis.partsWithItemReferences}`);
  lines.push(`Distinct categories in parts: ${result.partAnalysis.distinctPartCategories}`);
  lines.push(`Total manufacturers in top list: ${result.partAnalysis.topManufacturers.length}`);
  lines.push(`Total vehicle master rows: ${result.partAnalysis.totalVehicles}`);
  lines.push(`Total vehicle type master rows: ${result.partAnalysis.totalVehicleTypes}`);
  lines.push('');
  if (result.partAnalysis.categoryCounts.length > 0) {
    lines.push('Top part categories:');
    result.partAnalysis.categoryCounts.slice(0, 10).forEach((entry) => {
      lines.push(`  - ${entry.categorie ?? '(null)'}: ${entry.count}`);
    });
    lines.push('');
  }
  if (result.partAnalysis.topManufacturers.length > 0) {
    lines.push('Top manufacturers by part count:');
    result.partAnalysis.topManufacturers.slice(0, 10).forEach((entry) => {
      lines.push(`  - ${entry.fabricant ?? '(null)'}: ${entry.count}`);
    });
    lines.push('');
  }
  if (result.partAnalysis.vehicleModelCounts.length > 0) {
    lines.push('Top vehicle models by registry count:');
    result.partAnalysis.vehicleModelCounts.slice(0, 10).forEach((entry) => {
      lines.push(`  - ${entry.modele ?? '(null)'}: ${entry.count}`);
    });
    lines.push('');
  }
  if (result.partAnalysis.vehicleModelFitmentCounts.length > 0) {
    lines.push('Top fitment type/model combinations:');
    result.partAnalysis.vehicleModelFitmentCounts.slice(0, 10).forEach((entry) => {
      lines.push(`  - ${entry.typeCode}/${entry.modelName}: ${entry.fitmentCount}`);
    });
    lines.push('');
  }
  if (result.partAnalysis.partRelationSummaries.length > 0) {
    lines.push('Prisma relation mapping summary:');
    result.partAnalysis.partRelationSummaries.forEach((relation) => {
      lines.push(
        `  - ${relation.sourceModel}.${relation.relationField} (${relation.sourceColumn}) -> ${relation.targetModel}.${relation.targetColumn}`
      );
    });
    lines.push('');
  }

  lines.push('FOREIGN KEY RELATIONSHIPS');
  lines.push('-'.repeat(80));
  if (result.foreignKeys.length === 0) {
    lines.push('No foreign key relationships were detected in the database schema.');
  } else {
    result.foreignKeys.forEach((fk) => {
      lines.push(
        `• ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name} (${fk.constraint_name})`
      );
    });
  }

  lines.push('');
  lines.push('TABLE DETAILS');
  lines.push('-'.repeat(80));

  for (const table of result.tables) {
    lines.push(`TABLE: ${table.tableName}`);
    lines.push(`  rowCount: ${table.rowCount}`);
    lines.push(`  columns: ${table.columns.length}`);
    if (table.schemaModel) {
      lines.push(`  Prisma model: ${table.schemaModel.modelName}`);
      lines.push(`  Mapped table: ${table.schemaModel.tableName}`);
    } else {
      lines.push('  Prisma model: (missing)');
    }

    if (table.warnings.length > 0) {
      lines.push('  WARNINGS:');
      table.warnings.forEach((warning) => lines.push(`    - ${warning}`));
    }

    if (table.issues.length > 0) {
      lines.push('  ISSUES:');
      table.issues.forEach((issue) => lines.push(`    - ${issue}`));
    } else {
      lines.push('  ISSUES: none detected');
    }

    lines.push('  COLUMNS:');
    table.columns.forEach((column) => {
      const pkFlag = column.isPrimaryKey ? 'PK' : '  ';
      const nullFlag = column.nullable ? 'nullable' : 'required';
      lines.push(
        `    - ${column.name} (${column.type}) ${pkFlag} ${nullFlag} default=${column.defaultValue ?? 'none'} nulls=${column.nullCount} rate=${column.emptyRate}`
      );
    });

    lines.push('  SAMPLE ROWS:');
    if (table.sampleRows.length === 0) {
      lines.push('    - no sample rows available');
    } else {
      table.sampleRows.forEach((row, index) => {
        lines.push(`    - sample row ${index + 1}: ${JSON.stringify(row)}`);
      });
    }

    if (table.schemaModel) {
      lines.push('  SCHEMA FIELD MAPPING:');
      table.schemaModel.fields.forEach((field) => {
        const relationLabel = field.isRelation ? 'relation' : 'field';
        lines.push(
          `    - ${relationLabel} ${field.fieldName} -> column ${field.columnName} type=${field.type} optional=${field.isOptional}`
        );
        if (field.relationFields?.length) {
          lines.push(`      relation fields: ${field.relationFields.join(', ')}`);
        }
        if (field.references?.length) {
          lines.push(`      references: ${field.references.join(', ')}`);
        }
      });
    }

    lines.push(''.repeat(80));
  }

  if (result.schemaIssues.length > 0) {
    lines.push('SCHEMA MISMATCHES');
    lines.push('-'.repeat(80));
    result.schemaIssues.forEach((message) => lines.push(`  - ${message}`));
    lines.push('');
  }

  lines.push('END OF REPORT');
  lines.push('='.repeat(80));
  return lines.join('\n');
}

async function run() {
  try {
    const result = await inspectDatabase();
    const reportText = formatReport(result);
    const reportName = `db-audit-report-${new Date().toISOString().split('T')[0]}.txt`;
    const reportJsonName = `db-audit-report-${new Date().toISOString().split('T')[0]}.json`;
    const reportPath = path.join(SCRIPT_ROOT, reportName);
    const reportJsonPath = path.join(SCRIPT_ROOT, reportJsonName);

    fs.writeFileSync(reportPath, reportText, 'utf8');
    fs.writeFileSync(reportJsonPath, JSON.stringify(result, null, 2), 'utf8');

    console.log(`\n✅ Database audit finished.`);
    console.log(`  TXT report: ${reportPath}`);
    console.log(`  JSON report: ${reportJsonPath}`);
  } catch (error) {
    console.error('❌ Audit failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

run();
