-- ============================================
-- FIX WRONG SYNONYMS AND ADD TUNISIAN STOP-WORDS
-- ============================================

-- 1. DELETE WRONG SYNONYM: aile → huile
DELETE FROM synonyms WHERE mot = 'aile' AND canonical = 'huile';

-- 2. ADD CORRECT MAPPING: aile → aile
INSERT INTO synonyms (mot, canonical, langue) 
VALUES ('aile', 'aile', 'fr')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = 'aile';

-- 3. ADD TUNISIAN STOP-WORDS (words that should be ignored in search)
-- Use a single canonical 'STOPWORD' for all stop-words
INSERT INTO synonyms (mot, canonical, langue) VALUES
  ('nhabba', 'STOPWORD', 'stop'),
  ('nabi', 'STOPWORD', 'stop'),
  ('andi', 'STOPWORD', 'stop'),
  ('3andi', 'STOPWORD', 'stop'),
  ('mekser', 'STOPWORD', 'stop'),
  ('mta3i', 'STOPWORD', 'stop'),
  ('kayn', 'STOPWORD', 'stop'),
  ('yezzi', 'STOPWORD', 'stop'),
  ('famma', 'STOPWORD', 'stop'),
  ('chouf', 'STOPWORD', 'stop'),
  ('choufli', 'STOPWORD', 'stop'),
  ('wri', 'STOPWORD', 'stop'),
  ('barcha', 'STOPWORD', 'stop'),
  ('mte3', 'STOPWORD', 'stop'),
  ('bech', 'STOPWORD', 'stop'),
  ('nchri', 'STOPWORD', 'stop'),
  ('n7eb', 'STOPWORD', 'stop'),
  ('w', 'STOPWORD', 'stop'),
  ('fi', 'STOPWORD', 'stop'),
  ('mta', 'STOPWORD', 'stop'),
  ('sol', 'STOPWORD', 'stop'),
  ('cherche', 'STOPWORD', 'stop'),
  ('piece', 'STOPWORD', 'stop'),
  ('stock', 'STOPWORD', 'stop'),
  ('accessoires', 'STOPWORD', 'stop')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = 'STOPWORD';

-- 3b. DELETE wrong sol → stop synonym mapping
DELETE FROM synonyms WHERE mot = 'sol' AND canonical = 'stop' AND langue != 'stop';

-- 4. VERIFY CRITICAL SYNONYMS ARE CORRECT
-- Check feu → feu (not radiateur)
INSERT INTO synonyms (mot, canonical, langue) 
VALUES ('feu', 'feu', 'fr')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = 'feu';

-- Check clignotant → feu (this is correct - clignotant is a type of feu)
INSERT INTO synonyms (mot, canonical, langue) 
VALUES ('clignotant', 'feu', 'fr')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = 'feu';

-- Check tapis → tapis
INSERT INTO synonyms (mot, canonical, langue) 
VALUES ('tapis', 'tapis', 'fr')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = 'tapis';

-- Check liquide → liquide
INSERT INTO synonyms (mot, canonical, langue) 
VALUES ('liquide', 'liquide', 'fr')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = 'liquide';

-- Check refroidissement → radiateur (this is correct - refroidissement relates to radiateur)
INSERT INTO synonyms (mot, canonical, langue) 
VALUES ('refroidissement', 'radiateur', 'fr')
ON CONFLICT (mot, langue) DO UPDATE SET canonical = 'radiateur';

-- 5. VERIFY NO OTHER WRONG MAPPINGS EXIST
-- List all synonyms that might be wrong (for manual review)
SELECT mot, canonical, langue 
FROM synonyms 
WHERE langue = 'fr' 
  AND mot != canonical
  AND (
    (mot LIKE '%aile%' AND canonical LIKE '%huile%') OR
    (mot LIKE '%feu%' AND canonical LIKE '%radiateur%') OR
    (mot LIKE '%batterie%' AND canonical NOT IN ('batterie', 'battery', 'accu'))
  )
ORDER BY mot;

-- 6. SHOW SUMMARY
SELECT 
  langue,
  COUNT(*) as total_synonyms,
  COUNT(DISTINCT canonical) as unique_categories
FROM synonyms
GROUP BY langue
ORDER BY langue;
