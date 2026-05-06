-- Check current bobine mappings
SELECT * FROM synonyms WHERE mot = 'bobine' OR canonical = 'bobine' OR mot = 'bougie' OR canonical = 'bougie';

-- If bobine maps to bougie, delete that bad mapping
DELETE FROM synonyms WHERE mot = 'bobine' AND canonical = 'bougie';

-- Add correct mapping: bobine should map to itself or to 'coil'
INSERT INTO synonyms (mot, canonical, langue) VALUES ('coil', 'bobine', 'fr') ON CONFLICT DO NOTHING;
