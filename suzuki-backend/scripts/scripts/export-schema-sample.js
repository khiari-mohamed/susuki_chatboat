/* eslint-disable no-console */
'use strict';

/**
 * Exports the LOCAL database schema + a 10-row sample per table to Excel.
 *
 *   npm i pg exceljs dotenv
 *   node scripts/export-schema-sample.js
 *
 * Output: ./exports/suzuki_schema_sample_YYYY-MM-DD.xlsx
 *   - Sheet "00_ALL_TABLES": every table / every field (type, nullable, PK, FK,
 *                            default, row count, example value, matching ERP endpoint)
 *   - One sheet per table  : up to 10 sample rows (rows with the most filled fields first)
 *
 * Safety: reads DATABASE_URL from .env and REFUSES to run if the host is not local.
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, types } = require('pg');
const ExcelJS = require('exceljs');

// ───────────────────────── Configuration ─────────────────────────
const SAMPLE_SIZE = 10;
const OUTPUT_DIR = path.resolve(process.cwd(), 'exports');
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', '0.0.0.0', 'host.docker.internal']);

// Internal / sensitive tables that DeltaSoft does not need (hashes, chat content, IPs, logs).
const EXCLUDED_TABLES = new Set([
  'admin_users',
  'chat_sessions',
  'chat_messages',
  'chat_prompts',
  'chat_feedback',
  'upload_tracking',
  'search_logs',
  'sync_runs',
  '_prisma_migrations',
  'parts_search_description_backup_20260708',
]);

// Table -> endpoint name used in the "Fiche de spécification API ERP → Chatbot".
const ERP_ENDPOINTS = {
  vehicle_type_master: '/vehicle-types',
  vehicle_model_map: '/vehicle-models',
  vehicles: '/vehicles',
  parts: '/parts',
  stock: '/stock',
  fitment: '/fitments',
  item_references: '/item-references',
  synonyms: '(chatbot only — not synced from ERP)',
};

const EXCEL_MAX_CELL = 32000;

// Return numbers as JS numbers (instead of strings) so Excel treats them as numeric cells.
types.setTypeParser(1700, (v) => (v === null ? null : Number(v))); // numeric / decimal
types.setTypeParser(20, (v) => (v === null ? null : Number(v))); // int8 / bigint

// ───────────────────────── Helpers ─────────────────────────
const ident = (s) => `"${String(s).replace(/"/g, '""')}"`;

function buildConnectionConfig() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('DATABASE_URL is missing in .env');

  const url = new URL(raw);
  const host = url.hostname;

  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(
      `Refusing to run: DATABASE_URL host is "${host}", which is not local.\n` +
        'This script must only be executed against your LOCAL database, never production.',
    );
  }

  return {
    config: {
      host,
      port: url.port ? Number(url.port) : 5432,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.replace(/^\//, '')),
    },
    schema: url.searchParams.get('schema') || 'public',
  };
}

function toCellValue(value) {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return '[binary]';
  if (typeof value === 'object') return truncate(JSON.stringify(value));
  if (typeof value === 'string') return truncate(value);
  return value;
}

function truncate(str) {
  return str.length > EXCEL_MAX_CELL ? `${str.slice(0, EXCEL_MAX_CELL)}…[truncated]` : str;
}

function safeSheetName(name, used) {
  let base = name.replace(/[\\/?*[\]:]/g, '_').slice(0, 31) || 'sheet';
  let candidate = base;
  let i = 2;
  while (used.has(candidate.toLowerCase())) {
    const suffix = `_${i++}`;
    candidate = base.slice(0, 31 - suffix.length) + suffix;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

function styleHeader(row) {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF999999' } } };
  });
  row.height = 22;
}

function autoWidth(sheet, minWidth = 10, maxWidth = 60) {
  sheet.columns.forEach((column) => {
    let max = minWidth;
    column.eachCell({ includeEmpty: false }, (cell) => {
      const v = cell.value === null || cell.value === undefined ? '' : String(cell.value);
      const longestLine = v.split('\n').reduce((m, l) => Math.max(m, l.length), 0);
      if (longestLine + 2 > max) max = longestLine + 2;
    });
    column.width = Math.min(max, maxWidth);
  });
}

// ───────────────────────── Metadata queries ─────────────────────────
async function fetchColumns(client, schema) {
  const { rows } = await client.query(
    `
    SELECT c.relname AS table_name,
           a.attname AS column_name,
           a.attnum  AS position,
           format_type(a.atttypid, a.atttypmod) AS data_type,
           NOT a.attnotnull AS nullable,
           pg_get_expr(d.adbin, d.adrelid) AS default_value
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
    WHERE n.nspname = $1
      AND c.relkind = 'r'
      AND a.attnum > 0
      AND NOT a.attisdropped
    ORDER BY c.relname, a.attnum
    `,
    [schema],
  );
  return rows;
}

async function fetchPrimaryKeys(client, schema) {
  const { rows } = await client.query(
    `
    SELECT c.relname AS table_name, a.attname AS column_name
    FROM pg_index i
    JOIN pg_class c ON c.oid = i.indrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY (i.indkey)
    WHERE i.indisprimary AND n.nspname = $1
    `,
    [schema],
  );
  return new Set(rows.map((r) => `${r.table_name}.${r.column_name}`));
}

async function fetchForeignKeys(client, schema) {
  const { rows } = await client.query(
    `
    SELECT c.relname  AS table_name,
           a.attname  AS column_name,
           rc.relname AS ref_table,
           ra.attname AS ref_column
    FROM pg_constraint con
    JOIN pg_class c  ON c.oid  = con.conrelid
    JOIN pg_class rc ON rc.oid = con.confrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN LATERAL unnest(con.conkey, con.confkey) AS k(attnum, refattnum) ON TRUE
    JOIN pg_attribute a  ON a.attrelid  = con.conrelid  AND a.attnum  = k.attnum
    JOIN pg_attribute ra ON ra.attrelid = con.confrelid AND ra.attnum = k.refattnum
    WHERE con.contype = 'f' AND n.nspname = $1
    `,
    [schema],
  );
  const map = new Map();
  rows.forEach((r) => map.set(`${r.table_name}.${r.column_name}`, `${r.ref_table}.${r.ref_column}`));
  return map;
}

async function fetchSample(client, schema, table, columnNames) {
  // Prefer the rows with the most non-null fields so the sample shows every field populated.
  const score = columnNames.map((c) => `(CASE WHEN ${ident(c)} IS NULL THEN 0 ELSE 1 END)`).join(' + ');
  const { rows } = await client.query(
    `SELECT * FROM ${ident(schema)}.${ident(table)} ORDER BY (${score}) DESC LIMIT ${SAMPLE_SIZE}`,
  );
  return rows;
}

async function fetchRowCount(client, schema, table) {
  const { rows } = await client.query(`SELECT COUNT(*)::bigint AS n FROM ${ident(schema)}.${ident(table)}`);
  return Number(rows[0].n);
}

// ───────────────────────── Main ─────────────────────────
async function main() {
  const { config, schema } = buildConnectionConfig();
  const client = new Client(config);

  console.log(`→ Connecting to LOCAL database "${config.database}" on ${config.host}:${config.port} (schema: ${schema})`);
  await client.connect();

  try {
    const [allColumns, primaryKeys, foreignKeys] = await Promise.all([
      fetchColumns(client, schema),
      fetchPrimaryKeys(client, schema),
      fetchForeignKeys(client, schema),
    ]);

    // Group columns by table, skipping excluded ones.
    const tables = new Map();
    for (const col of allColumns) {
      if (EXCLUDED_TABLES.has(col.table_name)) continue;
      if (!tables.has(col.table_name)) tables.set(col.table_name, []);
      tables.get(col.table_name).push(col);
    }

    if (tables.size === 0) throw new Error(`No tables found in schema "${schema}".`);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Chatbot IA Car Pro';
    workbook.created = new Date();

    const usedNames = new Set();
    const overview = workbook.addWorksheet(safeSheetName('00_ALL_TABLES', usedNames));
    overview.columns = [
      { header: 'Table', key: 'table' },
      { header: 'ERP endpoint (spec)', key: 'endpoint' },
      { header: 'Row count', key: 'rowCount' },
      { header: '#', key: 'position' },
      { header: 'Field', key: 'field' },
      { header: 'Type', key: 'type' },
      { header: 'Nullable', key: 'nullable' },
      { header: 'Primary key', key: 'pk' },
      { header: 'Foreign key →', key: 'fk' },
      { header: 'Default', key: 'default' },
      { header: 'Example value (from sample)', key: 'example' },
    ];
    styleHeader(overview.getRow(1));

    const tableSheets = [];

    for (const [table, columns] of tables) {
      const columnNames = columns.map((c) => c.column_name);
      const [rowCount, sample] = await Promise.all([
        fetchRowCount(client, schema, table),
        fetchSample(client, schema, table, columnNames),
      ]);

      console.log(`  • ${table}: ${rowCount} rows, ${columns.length} fields, ${sample.length} sampled`);

      // Overview rows (one per field)
      columns.forEach((col, idx) => {
        const exampleRow = sample.find((r) => r[col.column_name] !== null && r[col.column_name] !== undefined);
        const key = `${table}.${col.column_name}`;
        const row = overview.addRow({
          table,
          endpoint: ERP_ENDPOINTS[table] || '',
          rowCount: idx === 0 ? rowCount : null,
          position: idx + 1,
          field: col.column_name,
          type: col.data_type,
          nullable: col.nullable ? 'YES' : 'NO',
          pk: primaryKeys.has(key) ? 'YES' : '',
          fk: foreignKeys.get(key) || '',
          default: col.default_value || '',
          example: exampleRow ? toCellValue(exampleRow[col.column_name]) : null,
        });
        if (idx === 0) {
          row.eachCell((cell) => {
            cell.border = { top: { style: 'medium', color: { argb: 'FF1F4E78' } } };
          });
        }
        if (idx === 0) row.getCell('table').font = { bold: true };
      });

      tableSheets.push({ table, columns, sample });
    }

    overview.views = [{ state: 'frozen', ySplit: 1 }];
    overview.autoFilter = { from: 'A1', to: { row: 1, column: overview.columns.length } };
    autoWidth(overview);

    // One sheet per table
    for (const { table, columns, sample } of tableSheets) {
      const sheet = workbook.addWorksheet(safeSheetName(table, usedNames));
      sheet.columns = columns.map((c) => ({ header: c.column_name, key: c.column_name }));
      styleHeader(sheet.getRow(1));

      sample.forEach((record) => {
        const rowValues = {};
        columns.forEach((c) => {
          rowValues[c.column_name] = toCellValue(record[c.column_name]);
        });
        sheet.addRow(rowValues);
      });

      sheet.views = [{ state: 'frozen', ySplit: 1 }];
      autoWidth(sheet);
    }

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    const outputFile = path.join(OUTPUT_DIR, `suzuki_schema_sample_${stamp}.xlsx`);
    await workbook.xlsx.writeFile(outputFile);

    console.log(`\n✔ Done: ${tables.size} tables exported`);
    console.log(`✔ File: ${outputFile}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(`\n✖ Export failed: ${err.message}`);
  process.exit(1);
});