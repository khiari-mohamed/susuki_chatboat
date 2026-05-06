-- Fix the pompe → pompecarburant mapping
-- This should be pompe → pompe for better search results

UPDATE synonyms 
SET canonical = 'pompe' 
WHERE mot = 'pompe' AND canonical = 'pompecarburant';

-- Verify the fix
SELECT mot, canonical, langue FROM synonyms WHERE mot = 'pompe';
