-- ═══════════════════════════════════════════════════════════════════
-- backfill_search_description.sql
-- Backfill search_description for all parts where it is NULL/empty.
-- Uses COALESCE(designation_2, designation), truncated to fit VARCHAR(200).
-- Safe to re-run: only touches NULL/empty rows.
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

UPDATE parts
SET search_description = LEFT(
  COALESCE(
    NULLIF(TRIM(designation_2), ''),
    NULLIF(TRIM(designation), '')
  ),
  200
)
WHERE search_description IS NULL
   OR TRIM(search_description) = '';

COMMIT;

-- ── Verify ────────────────────────────────────────────────────────
SELECT
  COUNT(*) AS total_parts,
  COUNT(*) FILTER (WHERE search_description IS NOT NULL AND search_description <> '') AS filled,
  COUNT(*) FILTER (WHERE search_description IS NULL OR search_description = '') AS still_empty,
  ROUND(
    COUNT(*) FILTER (WHERE search_description IS NOT NULL AND search_description <> '')::numeric
    / COUNT(*) * 100, 1
  ) AS pct_filled
FROM parts;