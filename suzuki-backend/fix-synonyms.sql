-- Add stop-words to prevent "stock" from triggering clarification
INSERT INTO "synonyms" ("mot", "canonical", "langue") VALUES
('stock', '', 'stop'),
('disponible', '', 'stop')
ON CONFLICT DO NOTHING;

-- Add critical synonyms for test fixes
INSERT INTO "synonyms" ("mot", "canonical", "langue") VALUES
('drum', 'tambour', 'fr'),
('brake', 'frein', 'fr')
ON CONFLICT DO NOTHING;
