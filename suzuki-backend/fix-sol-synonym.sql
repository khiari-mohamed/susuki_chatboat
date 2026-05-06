-- Remove the incorrect sol → stop synonym mapping
-- This causes "tapis de sol" to incorrectly return brake light parts

DELETE FROM synonyms WHERE mot = 'sol' AND canonical = 'stop';
