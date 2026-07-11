-- ═══════════════════════════════════════════════════════════════════
-- suzuki_parts — DATA MIGRATION SCRIPT
-- Generated: 2026-06-25
-- Run order: execute all steps in order, top to bottom.
-- Safe to re-run: each step uses IF NOT EXISTS or WHERE guards.
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- STEP 0: Prerequisites — enable pg_trgm if not already active
-- ─────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─────────────────────────────────────────────────────────────────
-- STEP 1 (FIX-2 DATA): Backfill search_description from designation_2
-- 7,881 rows currently NULL — chatbot cannot find these parts by NLP
-- Priority: designation_2 (French) → designation (English fallback)
-- ─────────────────────────────────────────────────────────────────
UPDATE parts
SET search_description = COALESCE(
    NULLIF(TRIM(designation_2), ''),
    TRIM(designation)
)
WHERE search_description IS NULL
   OR TRIM(search_description) = '';

-- Verify
SELECT COUNT(*) AS still_null_search_description
FROM parts
WHERE search_description IS NULL OR TRIM(search_description) = '';
-- Expected: 0

-- ─────────────────────────────────────────────────────────────────
-- STEP 2 (FIX-2 DATA): Widen search_description column to 200 chars
-- Many designation_2 values exceed the old 100-char limit
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE parts
    ALTER COLUMN search_description TYPE VARCHAR(200);

ALTER TABLE parts
    ALTER COLUMN designation_2 TYPE VARCHAR(200);

-- ─────────────────────────────────────────────────────────────────
-- STEP 3 (FIX-2 DATA): Add GIN trigram index on designation_2
-- Needed for fast French-name NLP search
-- ─────────────────────────────────────────────────────────────────
CREATE INDEX CONCURRENTLY IF NOT EXISTS parts_designation2_gin_idx
    ON parts USING gin (designation_2 gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS parts_search_description_gin_idx
    ON parts USING gin (search_description gin_trgm_ops);

-- ─────────────────────────────────────────────────────────────────
-- STEP 4 (FIX-3 DATA): Insert Indisponible stock rows for parts
-- that have no stock entry at all (5,567 parts currently uncovered)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO stock (reference, total_quantity, statut, updated_at)
SELECT
    p.reference,
    0,
    'Indisponible',
    NOW()
FROM parts p
LEFT JOIN stock s ON p.reference = s.reference
WHERE s.reference IS NULL;

-- Verify
SELECT COUNT(*) AS parts_without_stock
FROM parts p
LEFT JOIN stock s ON p.reference = s.reference
WHERE s.reference IS NULL;
-- Expected: 0

-- ─────────────────────────────────────────────────────────────────
-- STEP 5 (C-04 FIX): Create vehicle_model_map bridge table
-- Links vehicles.modele (friendly names) to vehicle_type_master.type_code
-- Run prisma migrate first to create the table, then seed data below.
-- ─────────────────────────────────────────────────────────────────
-- NOTE: Table is created by Prisma migration (schema.prisma has the model).
-- Seed the known model → type_code mappings:

INSERT INTO vehicle_model_map (modele, type_code)
VALUES
    -- S-PRESSO / SPRESSO (normalize both spellings)
    ('SPRESSO',      'ABU310-TYPE1'),
    ('S-PRESSO',     'ABU310-TYPE1'),
    -- BALENO
    ('BALENO',       'AVB415-TYPE2'),
    ('BALENO',       'AVB415-TYPE3'),
    ('BALENO',       'AVB414-TYPE1'),
    -- SWIFT variants
    ('SWIFT',        'AVH310-TYPE1'),
    ('SWIFT',        'AVH310-TYPE2'),
    ('NEW SWIFT',    'AVH310-TYPE2'),
    ('SWIFT IV',     'AVH310-TYPE1'),
    -- CELERIO variants
    ('CELERIO',      'ARL415-TYPE1'),
    ('NEW CELERIO',  'ARL415-TYPE2'),
    -- DZIRE
    ('DZIRE',        'AON312-TYPE1'),
    -- CIAZ
    ('CIAZ',         'AZI412-TYPE3'),
    -- FRONX
    ('FRONX',        'APK416-TYPE1'),
    -- VITARA (if present)
    ('VITARA',       'A1K414-TYPE1')
ON CONFLICT (modele, type_code) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- STEP 6 (W-05 FIX): Normalize type_code format in vehicle_type_master
-- Some codes use spaces ("A1K414 TYPE 1"), others use hyphens ("APK416-TYPE1")
-- Standardize everything to hyphen format
-- ─────────────────────────────────────────────────────────────────
UPDATE vehicle_type_master
SET type_code = REPLACE(REPLACE(type_code, ' TYPE ', '-TYPE'), ' ', '-')
WHERE type_code LIKE '% %';

-- Verify
SELECT type_code FROM vehicle_type_master ORDER BY type_code;

-- ─────────────────────────────────────────────────────────────────
-- STEP 7 (W-02 FIX): Standardize SPRESSO → S-PRESSO in all tables
-- ─────────────────────────────────────────────────────────────────

-- In vehicles table
UPDATE vehicles
SET modele = 'S-PRESSO'
WHERE UPPER(modele) IN ('SPRESSO', 'S PRESSO', 'SPRESSO ');

-- In upload_tracking.vehicle_info JSONB
UPDATE upload_tracking
SET vehicle_info = jsonb_set(
    vehicle_info,
    '{modele}',
    '"S-PRESSO"'
)
WHERE vehicle_info->>'modele' IN ('SPRESSO', 'S PRESSO');

-- In chat_sessions.vehicle_info JSONB
UPDATE chat_sessions
SET vehicle_info = jsonb_set(
    vehicle_info,
    '{modele}',
    '"S-PRESSO"'
)
WHERE vehicle_info->>'modele' IN ('SPRESSO', 'S PRESSO');

-- ─────────────────────────────────────────────────────────────────
-- STEP 8 (C-01 FIX): Add FK constraints for parts domain
-- These enforce referential integrity that Prisma currently only
-- handles at the application layer.
--
-- IMPORTANT: Run these ONLY after verifying no orphan rows exist.
-- Check first:
--   SELECT COUNT(*) FROM fitment f
--   WHERE NOT EXISTS (SELECT 1 FROM parts p WHERE p.reference = f.part_reference);
--   -- Must be 0 before adding FK
-- ─────────────────────────────────────────────────────────────────

-- Check for orphans before adding constraints
DO $$
DECLARE
    orphan_fitment       INT;
    orphan_stock         INT;
    orphan_item_refs     INT;
    orphan_fitment_type  INT;
BEGIN
    SELECT COUNT(*) INTO orphan_fitment
    FROM fitment f
    WHERE NOT EXISTS (SELECT 1 FROM parts p WHERE p.reference = f.part_reference);

    SELECT COUNT(*) INTO orphan_stock
    FROM stock s
    WHERE NOT EXISTS (SELECT 1 FROM parts p WHERE p.reference = s.reference);

    SELECT COUNT(*) INTO orphan_item_refs
    FROM item_references ir
    WHERE NOT EXISTS (SELECT 1 FROM parts p WHERE p.reference = ir.part_reference);

    SELECT COUNT(*) INTO orphan_fitment_type
    FROM fitment f
    WHERE NOT EXISTS (SELECT 1 FROM vehicle_type_master v WHERE v.type_code = f.type_code);

    RAISE NOTICE 'Orphan fitment rows: %', orphan_fitment;
    RAISE NOTICE 'Orphan stock rows: %', orphan_stock;
    RAISE NOTICE 'Orphan item_references rows: %', orphan_item_refs;
    RAISE NOTICE 'Orphan fitment→vehicle_type rows: %', orphan_fitment_type;

    IF orphan_fitment > 0 OR orphan_stock > 0 OR orphan_item_refs > 0 OR orphan_fitment_type > 0 THEN
        RAISE EXCEPTION 'Orphan rows exist — fix data before adding FK constraints';
    END IF;
END $$;

-- Add FK constraints (run only after orphan check passes)
ALTER TABLE fitment
    ADD CONSTRAINT IF NOT EXISTS fk_fitment_part
    FOREIGN KEY (part_reference) REFERENCES parts(reference)
    ON DELETE CASCADE;

ALTER TABLE fitment
    ADD CONSTRAINT IF NOT EXISTS fk_fitment_vehicle_type
    FOREIGN KEY (type_code) REFERENCES vehicle_type_master(type_code)
    ON DELETE RESTRICT;

ALTER TABLE stock
    ADD CONSTRAINT IF NOT EXISTS fk_stock_part
    FOREIGN KEY (reference) REFERENCES parts(reference)
    ON DELETE CASCADE;

ALTER TABLE item_references
    ADD CONSTRAINT IF NOT EXISTS fk_item_references_part
    FOREIGN KEY (part_reference) REFERENCES parts(reference)
    ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────────
-- STEP 9 (W-01 FIX): Document vehicles.statut = license plate
-- We cannot rename the column without a Prisma migration, but we
-- add a comment so it's clear to all developers.
-- ─────────────────────────────────────────────────────────────────
COMMENT ON COLUMN vehicles.statut IS
    'Contains Tunisian license plate numbers (format: NNNN TU NNN). '
    'Column name is misleading — should be renamed to immatriculation.';

-- ─────────────────────────────────────────────────────────────────
-- STEP 10 (W-06 FIX): Flag unpriced parts for UI display
-- No data change needed — UI should show "Prix sur demande"
-- This query identifies them for reporting:
-- ─────────────────────────────────────────────────────────────────
SELECT
    reference,
    designation,
    designation_2,
    categorie
FROM parts
WHERE prix_ht IS NULL OR prix_ttc IS NULL
ORDER BY categorie, designation_2
LIMIT 50;

-- ─────────────────────────────────────────────────────────────────
-- STEP 11: Verification queries — run after all steps complete
-- ─────────────────────────────────────────────────────────────────

-- A) search_description coverage
SELECT
    COUNT(*)                                                      AS total_parts,
    COUNT(search_description)                                     AS has_search_desc,
    ROUND(COUNT(search_description) * 100.0 / COUNT(*), 1)       AS coverage_pct,
    COUNT(designation_2)                                          AS has_french_name,
    ROUND(COUNT(designation_2) * 100.0 / COUNT(*), 1)            AS french_coverage_pct
FROM parts;

-- B) Stock coverage
SELECT
    COUNT(DISTINCT p.reference)                                   AS total_parts,
    COUNT(DISTINCT s.reference)                                   AS parts_with_stock,
    ROUND(COUNT(DISTINCT s.reference) * 100.0 / COUNT(DISTINCT p.reference), 1) AS stock_coverage_pct
FROM parts p
LEFT JOIN stock s ON p.reference = s.reference;

-- C) Source distribution (both sources should be present)
SELECT source, COUNT(*) AS part_count
FROM parts
GROUP BY source
ORDER BY part_count DESC;

-- D) Stock by source (CarPro Parts should have stock rows too)
SELECT p.source, s.statut, COUNT(*) AS count
FROM parts p
LEFT JOIN stock s ON p.reference = s.reference
GROUP BY p.source, s.statut
ORDER BY p.source, s.statut;

-- E) Sample: French names correctly backfilled
SELECT reference, designation, designation_2, search_description
FROM parts
WHERE designation_2 IS NOT NULL
LIMIT 10;
