-- ============================================================================
-- SUZUKI CHATBOT - SYNONYM DATABASE FIXES
-- This script fixes all incorrect synonym mappings that cause search failures
-- ============================================================================

-- 1. Remove the sol → stop mapping (causes "tapis de sol" to return brake lights)
DELETE FROM synonyms WHERE mot = 'sol' AND canonical = 'stop';

-- 2. Fix wrong category mappings that destroy search accuracy
DELETE FROM synonyms WHERE mot = 'barre' AND canonical = 'pare';
DELETE FROM synonyms WHERE mot = 'bobine' AND canonical = 'bougie';
DELETE FROM synonyms WHERE mot = 'suspension' AND canonical = 'amortisseur';

-- 3. Ensure correct canonical mappings exist for key car parts
INSERT INTO synonyms (mot, canonical, langue) VALUES
  ('barre', 'barre', 'fr'),
  ('bobine', 'bobine', 'fr'),
  ('clignotant', 'clignotant', 'fr'),
  ('suspension', 'suspension', 'fr'),
  ('cardan', 'cardan', 'fr'),
  ('tambour', 'tambour', 'fr'),
  ('etrier', 'etrier', 'fr'),
  ('maitre', 'maitre', 'fr'),
  ('cylindre', 'cylindre', 'fr'),
  ('ressort', 'ressort', 'fr'),
  ('tendeur', 'tendeur', 'fr'),
  ('distribution', 'distribution', 'fr')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = EXCLUDED.canonical;

-- 4. Add English equivalents for better matching
INSERT INTO synonyms (mot, canonical, langue) VALUES
  ('drum', 'tambour', 'en'),
  ('caliper', 'etrier', 'en'),
  ('master', 'maitre', 'en'),
  ('cylinder', 'cylindre', 'en'),
  ('spring', 'ressort', 'en'),
  ('tensioner', 'tendeur', 'en'),
  ('timing', 'distribution', 'en'),
  ('coil', 'bobine', 'en'),
  ('indicator', 'clignotant', 'en'),
  ('bar', 'barre', 'en'),
  ('stabilizer', 'stabilisatrice', 'en'),
  ('sway', 'stabilisatrice', 'en')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = EXCLUDED.canonical;

-- 5. Verify the fixes
SELECT 'Verification Results:' as status;
SELECT COUNT(*) as fixed_mappings FROM synonyms 
WHERE mot IN ('barre', 'bobine', 'clignotant', 'suspension', 'cardan', 'tambour', 'etrier', 'distribution')
  AND canonical = mot;

-- Expected result: 8 rows (all parts now map to themselves correctly)
