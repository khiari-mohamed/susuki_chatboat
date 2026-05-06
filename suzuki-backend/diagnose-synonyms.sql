-- ============================================================================
-- DIAGNOSTIC QUERIES - Run BEFORE applying fixes to see current issues
-- ============================================================================

-- 1. Find all mappings for key car parts
SELECT 
  mot as original_word,
  canonical as mapped_to,
  langue as language
FROM synonyms
WHERE mot IN (
  'barre', 'bobine', 'clignotant', 'suspension', 'cardan', 'tambour', 
  'etrier', 'distribution', 'ressort', 'tendeur', 'maitre', 'cylindre', 'sol'
)
ORDER BY mot;

-- 2. Find mappings where the canonical is different from the original
SELECT 
  mot,
  canonical,
  langue,
  CASE 
    WHEN mot = canonical THEN '✓ Correct (self-mapping)'
    ELSE '✗ Redirects to: ' || canonical
  END as status
FROM synonyms
WHERE mot IN (
  'barre', 'bobine', 'clignotant', 'suspension', 'cardan', 'tambour', 
  'etrier', 'distribution', 'ressort', 'tendeur', 'sol'
)
ORDER BY 
  CASE WHEN mot = canonical THEN 1 ELSE 0 END,
  mot;

-- 3. Find all words that map to potentially wrong categories
SELECT 
  mot,
  canonical,
  COUNT(*) as mapping_count
FROM synonyms
WHERE canonical IN ('pare', 'bougie', 'amortisseur', 'stop', 'feu')
  AND mot != canonical
GROUP BY mot, canonical
ORDER BY canonical, mot;

-- 4. Check for duplicate or conflicting mappings
SELECT 
  mot,
  COUNT(DISTINCT canonical) as different_mappings,
  STRING_AGG(DISTINCT canonical, ', ') as maps_to
FROM synonyms
WHERE mot IN (
  'barre', 'bobine', 'clignotant', 'suspension', 'cardan', 'tambour', 
  'etrier', 'distribution', 'ressort', 'tendeur', 'sol'
)
GROUP BY mot
HAVING COUNT(DISTINCT canonical) > 1;

-- 5. List all French car part words and their current mappings
SELECT 
  mot,
  canonical,
  langue,
  CASE 
    WHEN mot = canonical THEN '✓'
    ELSE '→ ' || canonical
  END as mapping_status
FROM synonyms
WHERE langue = 'fr'
  AND mot IN (
    'amortisseur', 'plaquette', 'disque', 'filtre', 'phare', 'batterie', 
    'courroie', 'bougie', 'retroviseur', 'feu', 'clignotant', 'aile', 
    'radiateur', 'durite', 'alternateur', 'demarreur', 'capteur', 
    'embrayage', 'rotule', 'triangle', 'bras', 'tambour', 'etrier', 
    'maitre', 'cylindre', 'pompe', 'injecteur', 'tapis', 'barre',
    'ressort', 'tendeur', 'cardan', 'suspension', 'distribution', 'bobine'
  )
ORDER BY mot;
