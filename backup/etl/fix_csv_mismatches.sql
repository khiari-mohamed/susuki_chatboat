-- ═══════════════════════════════════════════════════════════════════
-- fix_csv_mismatches.sql
-- Fixes ALL mismatches found between the CSV and the database.
-- Safe to re-run: uses ON CONFLICT for inserts, explicit WHERE for updates.
-- Run in a transaction so you can ROLLBACK if anything looks wrong.
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────────────────────────
-- 1. FIX PRICES (3 parts have wrong prix_ht / prix_ttc in DB)
-- ─────────────────────────────────────────────────────────────────

-- 57300M75T00 — CAPOT (All New Swift): DB has 821.470/977.549, CSV says 790.176/940.309
UPDATE parts SET prix_ht = 790.176, prix_ttc = 940.309
WHERE reference = '57300M75T00';

-- 68001M55R02 — PORTE AV D (New Swift): DB has 1446.816/1721.711, CSV says 1722.205/2049.423
UPDATE parts SET prix_ht = 1722.205, prix_ttc = 2049.423
WHERE reference = '68001M55R02';

-- 71741M75T10-W9K — CALANDRE (All New Swift): DB has 726.036/863.983, CSV says 698.709/831.464
UPDATE parts SET prix_ht = 698.709, prix_ttc = 831.464
WHERE reference = '71741M75T10-W9K';

-- 71811M75T00-799 — PARE CHOC AR (All New Swift): DB has 741.838/882.787, CSV says 713.577/849.157
UPDATE parts SET prix_ht = 713.577, prix_ttc = 849.157
WHERE reference = '71811M75T00-799';

-- ─────────────────────────────────────────────────────────────────
-- 2. FIX MISSING designation_2 (3 parts have empty designation_2)
-- ─────────────────────────────────────────────────────────────────

UPDATE parts SET designation_2 = 'CAPOT'       WHERE reference = '57300M75T00'     AND (designation_2 IS NULL OR TRIM(designation_2) = '');
UPDATE parts SET designation_2 = 'CALANDRE'    WHERE reference = '71741M75T10-W9K' AND (designation_2 IS NULL OR TRIM(designation_2) = '');
UPDATE parts SET designation_2 = 'PARE CHOC AR' WHERE reference = '71811M75T00-799' AND (designation_2 IS NULL OR TRIM(designation_2) = '');

-- ─────────────────────────────────────────────────────────────────
-- 3. FIX STOCK VALUES (existing rows with wrong numbers)
-- ─────────────────────────────────────────────────────────────────

UPDATE stock SET stock_disponible = 13,  stock_consolide = 53,  statut = 'Disponible'   WHERE reference = '17700M68P00';
UPDATE stock SET stock_disponible = 3,   stock_consolide = 41,  statut = 'Disponible'   WHERE reference = '17700M81R00';
UPDATE stock SET stock_disponible = 2,   stock_consolide = 31,  statut = 'Disponible'   WHERE reference = '35121M81R30';
UPDATE stock SET stock_disponible = 39,  stock_consolide = 39,  statut = 'Disponible'   WHERE reference = '35321M81R30';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 29,  statut = 'Disponible'   WHERE reference = '57300M75T00';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 8,   statut = 'Disponible'   WHERE reference = '57300M81R00';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 60,  statut = 'Disponible'   WHERE reference = '57611M55R10';
UPDATE stock SET stock_disponible = 7,   stock_consolide = 26,  statut = 'Disponible'   WHERE reference = '57611M81R00';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 17,  statut = 'Disponible'   WHERE reference = '57711M55R10';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 12,  statut = 'Disponible'   WHERE reference = '57711M81R00';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 4,   statut = 'Disponible'   WHERE reference = '68001M55R02';
UPDATE stock SET stock_disponible = 2,   stock_consolide = 2,   statut = 'Indisponible' WHERE reference = '68001M81R20';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 5,   statut = 'Disponible'   WHERE reference = '68002M81R20';
UPDATE stock SET stock_disponible = 2,   stock_consolide = 3,   statut = 'Disponible'   WHERE reference = '68003M81R00';
UPDATE stock SET stock_disponible = 4,   stock_consolide = 8,   statut = 'Disponible'   WHERE reference = '68004M81R00';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 19,  statut = 'Disponible'   WHERE reference = '71711M55R00-799';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 3,   statut = 'Disponible'   WHERE reference = '71711M75T00-799';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 17,  statut = 'Disponible'   WHERE reference = '71711M81R00-799';
UPDATE stock SET stock_disponible = 10,  stock_consolide = 27,  statut = 'Disponible'   WHERE reference = '71740M55R00-C48';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 22,  statut = 'Disponible'   WHERE reference = '71741M75T10-W9K';
UPDATE stock SET stock_disponible = 0,   stock_consolide = 7,   statut = 'Disponible'   WHERE reference = '71811M75T00-799';

-- ─────────────────────────────────────────────────────────────────
-- 4. INSERT MISSING STOCK ROWS (4 parts have no stock row at all)
-- ─────────────────────────────────────────────────────────────────

INSERT INTO stock (reference, total_quantity, stock_disponible, stock_consolide, statut, updated_at)
VALUES
  ('68001M55R00',     0,  0,  0, 'Indisponible', NOW()),
  ('68001M55R01',     0,  0,  0, 'Indisponible', NOW()),
  ('71811M81R10-799', 50, 0, 50, 'Disponible',   NOW()),
  ('84570M55R10',     6,  0,  6, 'Disponible',   NOW()),
  ('84701M55R50-ZHJ', 6,  0,  6, 'Disponible',   NOW())
ON CONFLICT (reference) DO UPDATE SET
  stock_disponible = EXCLUDED.stock_disponible,
  stock_consolide  = EXCLUDED.stock_consolide,
  statut           = EXCLUDED.statut,
  updated_at       = NOW();

-- ─────────────────────────────────────────────────────────────────
-- 5. Also update search_description to match designation_2
--    (backfill script may have used old/empty designation_2 for these)
-- ─────────────────────────────────────────────────────────────────

UPDATE parts SET search_description = 'CAPOT'        WHERE reference = '57300M75T00';
UPDATE parts SET search_description = 'CALANDRE'     WHERE reference = '71741M75T10-W9K';
UPDATE parts SET search_description = 'PARE CHOC AR' WHERE reference = '71811M75T00-799';

-- ─────────────────────────────────────────────────────────────────
-- Verify — run this SELECT before COMMIT to confirm all rows are fixed
-- ─────────────────────────────────────────────────────────────────

SELECT
  p.reference,
  p.designation_2,
  CAST(p.prix_ht  AS NUMERIC(10,3)) AS prix_ht,
  CAST(p.prix_ttc AS NUMERIC(10,3)) AS prix_ttc,
  s.stock_disponible,
  s.stock_consolide,
  s.statut
FROM parts p
LEFT JOIN stock s ON s.reference = p.reference
WHERE p.reference IN (
  '17700M68P00','17700M81R00','35121M81R30','35321M81R30',
  '57300M75T00','57300M81R00','57611M55R10','57611M81R00',
  '57711M55R10','57711M81R00','68001M55R00','68001M55R01',
  '68001M55R02','68001M81R20','68002M81R20','68003M81R00',
  '68004M81R00','71711M55R00-799','71711M75T00-799','71711M81R00-799',
  '71740M55R00-C48','71741M75T10-W9K','71811M75T00-799','71811M81R10-799',
  '84501M55R00','84570M55R10','84701M55R50-ZHJ'
)
ORDER BY p.reference;

-- If the SELECT looks correct → COMMIT
-- If anything looks wrong   → ROLLBACK

COMMIT;
