-- ============================================
-- CLEANUP SCRIPT - Remove old incorrect stop-words
-- ============================================

-- 1. DELETE all stop-words with empty canonical
DELETE FROM synonyms WHERE langue = 'stop' AND canonical = '';

-- 2. DELETE all stop-words with self-referencing canonical
DELETE FROM synonyms WHERE langue = 'stop' AND mot = canonical;

-- 3. Show current stop-words (should be empty after cleanup)
SELECT mot, canonical, langue 
FROM synonyms 
WHERE langue = 'stop'
ORDER BY mot;

-- Now run fix_synonyms.sql to add the correct stop-words with canonical = 'STOPWORD'
