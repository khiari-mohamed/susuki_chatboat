-- ═══════════════════════════════════════════════════════════════════
-- CLEANUP: junk placeholder values ("NAN", "N/A", "NULL", ...)
-- ═══════════════════════════════════════════════════════════════════
-- Root cause (confirmed 2026-09-13 by comparing the latest CarPro CSV
-- exports against the live DB — see scripts/lib/data-hygiene.js):
--   1. Some earlier import wrote the literal text "NAN" into
--      vehicles.marque instead of leaving it NULL (286 rows found).
--   2. The old sync-vehicles-csv.js could never fix this afterwards:
--      its fallback logic was `row.marque || existing.marque`, so a
--      blank CSV cell always preserved whatever bad value was already
--      there. Fixed going forward in sync-vehicles-csv.js (see
--      cleanOrNull() in lib/data-hygiene.js) — but existing bad rows
--      need this one-time, explicit cleanup.
--
-- This file is intentionally NOT run by any script. Review the SELECT
-- counts first, then uncomment and run the UPDATE statements yourself
-- when ready — ideally take a DB snapshot/backup right before.
-- ═══════════════════════════════════════════════════════════════════

-- ── STEP 1: Preview — run this first, change nothing yet ───────────

SELECT 'vehicles.marque' AS field, marque AS junk_value, COUNT(*) AS row_count
FROM vehicles
WHERE UPPER(TRIM(marque)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!')
GROUP BY marque

UNION ALL

SELECT 'vehicles.modele', modele, COUNT(*)
FROM vehicles
WHERE UPPER(TRIM(modele)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!')
GROUP BY modele

UNION ALL

SELECT 'vehicles.modele_description', modele_description, COUNT(*)
FROM vehicles
WHERE UPPER(TRIM(modele_description)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!')
GROUP BY modele_description

UNION ALL

SELECT 'vehicles.vin', vin, COUNT(*)
FROM vehicles
WHERE UPPER(TRIM(vin)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!')
GROUP BY vin

UNION ALL

SELECT 'parts.designation_2', designation_2, COUNT(*)
FROM parts
WHERE UPPER(TRIM(designation_2)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!')
GROUP BY designation_2

UNION ALL

SELECT 'parts.fabricant', fabricant, COUNT(*)
FROM parts
WHERE UPPER(TRIM(fabricant)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!')
GROUP BY fabricant;

-- ── STEP 2: Duplicate VIN preview (source-data issue, see analysis) ─
-- These came in duplicated straight from CarPro's own export (109
-- groups found in Base_vehicule_080926.csv) — not something a simple
-- UPDATE can safely resolve on our side (would need CarPro to say
-- which vehicle_no is the "real" one per VIN). Listed here for
-- visibility only; deliberately no fix attempted.
SELECT vin, COUNT(*) AS occurrences, ARRAY_AGG(vehicle_no) AS vehicle_numbers
FROM vehicles
WHERE vin IS NOT NULL
GROUP BY vin
HAVING COUNT(*) > 1
ORDER BY occurrences DESC;

-- ── STEP 3: The actual fix — UNCOMMENT AND RUN MANUALLY ─────────────
-- Sets the field to NULL wherever it currently holds one of the junk
-- placeholder strings. Wrapped in a transaction so it's all-or-nothing.

-- BEGIN;
--
-- UPDATE vehicles
-- SET marque = NULL
-- WHERE UPPER(TRIM(marque)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!');
--
-- UPDATE vehicles
-- SET modele = NULL
-- WHERE UPPER(TRIM(modele)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!');
--
-- UPDATE vehicles
-- SET modele_description = NULL
-- WHERE UPPER(TRIM(modele_description)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!');
--
-- UPDATE vehicles
-- SET vin = NULL
-- WHERE UPPER(TRIM(vin)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!');
--
-- UPDATE parts
-- SET designation_2 = NULL
-- WHERE UPPER(TRIM(designation_2)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!');
--
-- UPDATE parts
-- SET fabricant = NULL
-- WHERE UPPER(TRIM(fabricant)) IN ('NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!');
--
-- COMMIT;

-- ── STEP 4: legacy type_code space-format cleanup (7 rows found) ───
-- CAUTION: vehicle_model_map's CREATE TABLE is NOT present in any
-- tracked prisma/migrations/*/migration.sql — it exists live in the
-- database (confirmed 2026-09-13) but was apparently created outside
-- the tracked migration history (e.g. via `prisma db push` or a manual
-- psql run). That means its foreign-key ON UPDATE behavior can't be
-- confirmed from the repo alone, so this fix does NOT rely on
-- cascading — it updates all three tables explicitly, in one
-- transaction, which is correct whether or not a cascade also fires.
-- (Separately: this missing migration is itself worth fixing — see
-- the note in the chat response.)

-- Preview first:
SELECT type_code, REPLACE(type_code, ' ', '-') AS normalized
FROM vehicle_type_master
WHERE type_code LIKE '% %';

-- BEGIN;
--
-- UPDATE fitment
-- SET type_code = REPLACE(type_code, ' ', '-')
-- WHERE type_code IN (SELECT type_code FROM vehicle_type_master WHERE type_code LIKE '% %');
--
-- UPDATE vehicle_model_map
-- SET type_code = REPLACE(type_code, ' ', '-')
-- WHERE type_code IN (SELECT type_code FROM vehicle_type_master WHERE type_code LIKE '% %');
--
-- UPDATE vehicle_type_master
-- SET type_code = REPLACE(type_code, ' ', '-')
-- WHERE type_code LIKE '% %';
--
-- COMMIT;