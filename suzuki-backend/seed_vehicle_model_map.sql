-- ═══════════════════════════════════════════════════════════════════
-- seed_vehicle_model_map.sql
-- Seed vehicle_model_map with confirmed mappings.
--
-- Source of truth:
--   - fitment table  → only 11 real type codes exist
--   - vehicles table → exact modele string values used
--   - Confirmed by DB queries on 2026-08-07
--
-- Safe to re-run: ON CONFLICT DO NOTHING
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

INSERT INTO vehicle_model_map (modele, type_code)
VALUES
  -- ── CELERIO old gen (ARL415) ──────────────────────────────────
  -- vehicles.modele = 'CELERIO'      → 4,147 vehicles (GL-POP, GL)
  -- vehicles.modele = 'CELERIO BVA'  → 366 vehicles (AMT)
  ('CELERIO',          'ARL415-TYPE1'),
  ('CELERIO',          'ARL415-TYPE2'),
  ('CELERIO BVA',      'ARL415-TYPE1'),
  ('CELERIO BVA',      'ARL415-TYPE2'),

  -- ── NEW CELERIO new gen (AXM310) ──────────────────────────────
  -- vehicles.modele = 'NEW CELERIO'  → 6,558 vehicles (POP GL MT, POP 6AB, GL AT)
  ('NEW CELERIO',      'AXM310-TYPE1'),
  ('NEW CELERIO',      'AXM310-TYPE2'),

  -- ── SWIFT / NEW SWIFT / SWIFT IV (AVH310) ─────────────────────
  -- vehicles.modele = 'SWIFT'        → 1,081 vehicles
  -- vehicles.modele = 'NEW SWIFT'    → 4,846 vehicles
  -- vehicles.modele = 'SWIFT IV'     → 1,877 vehicles
  ('SWIFT',            'AVH310-TYPE1'),
  ('SWIFT',            'AVH310-TYPE2'),
  ('NEW SWIFT',        'AVH310-TYPE1'),
  ('NEW SWIFT',        'AVH310-TYPE2'),
  ('SWIFT IV',         'AVH310-TYPE1'),
  ('SWIFT IV',         'AVH310-TYPE2'),

  -- ── DZIRE / DZIRE IV (AON312) ─────────────────────────────────
  -- vehicles.modele = 'DZIRE'        → 3,304 vehicles
  -- vehicles.modele = 'DZIRE IV'     → 420 vehicles
  ('DZIRE',            'AON312-TYPE1'),
  ('DZIRE IV',         'AON312-TYPE1'),

  -- ── BALENO old gen (AVB414) ───────────────────────────────────
  -- vehicles.modele = 'BALENO'       → 589 vehicles
  ('BALENO',           'AVB414-TYPE1'),

  -- ── NEW BALENO / BALENO new gen (AVB415) ──────────────────────
  -- vehicles.modele = 'NEW BALENO'   → 335 vehicles
  -- BALENO also gets AVB415 as it may span both gens
  ('BALENO',           'AVB415-TYPE2'),
  ('BALENO',           'AVB415-TYPE3'),
  ('NEW BALENO',       'AVB415-TYPE2'),
  ('NEW BALENO',       'AVB415-TYPE3'),

  -- ── CIAZ / NEW CIAZ (AZI412) ──────────────────────────────────
  -- vehicles.modele = 'CIAZ'         → 1,521 vehicles
  -- vehicles.modele = 'NEW CIAZ'     → 5 vehicles
  ('CIAZ',             'AZI412-TYPE3'),
  ('NEW CIAZ',         'AZI412-TYPE3'),

  -- ── SPRESSO (ABU310) ──────────────────────────────────────────
  -- vehicles.modele = 'SPRESSO'      → 863 vehicles (SPRESSO, SPRESSO FL, SPRESSO FL AGS)
  -- S CROSS excluded: only 5 vehicles, no fitment data, not a real model here
  ('SPRESSO',          'ABU310-TYPE1'),

  -- ── FRONX (APK416) ────────────────────────────────────────────
  -- vehicles.modele = 'FRONX'        → 542 vehicles
  ('FRONX',            'APK416-TYPE1'),

  -- ── VITARA / NEW VITARA / GRAND VITARA / G VITARA ─────────────
  -- APK414-TYPE3 → confirmed in fitment (575 parts)
  -- APQ415-TYPE2 → confirmed in fitment (462 parts)
  -- vehicles.modele = 'VITARA'       → 526 vehicles
  -- vehicles.modele = 'NEW VITARA'   → 78 vehicles
  -- vehicles.modele = 'GRAND VITARA' → 100 vehicles
  -- vehicles.modele = 'G VITARA'     → 6 vehicles
  ('VITARA',           'APK414-TYPE3'),
  ('VITARA',           'APQ415-TYPE2'),
  ('NEW VITARA',       'APK414-TYPE3'),
  ('NEW VITARA',       'APQ415-TYPE2'),
  ('GRAND VITARA',     'APK414-TYPE3'),
  ('GRAND VITARA',     'APQ415-TYPE2'),
  ('G VITARA',         'APK414-TYPE3'),
  ('G VITARA',         'APQ415-TYPE2')

ON CONFLICT (modele, type_code) DO NOTHING;

COMMIT;

-- ── Verify ────────────────────────────────────────────────────────
SELECT
  modele,
  ARRAY_AGG(type_code ORDER BY type_code) AS type_codes,
  COUNT(*) AS mapping_count
FROM vehicle_model_map
GROUP BY modele
ORDER BY modele;
