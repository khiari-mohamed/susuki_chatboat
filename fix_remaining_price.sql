-- Fix remaining mismatch: 71811M81R10-799 has NULL prix_ht / prix_ttc
UPDATE parts
SET prix_ht = 852.154, prix_ttc = 1014.063
WHERE reference = '71811M81R10-799';

-- Verify
SELECT reference, designation_2, prix_ht, prix_ttc FROM parts WHERE reference = '71811M81R10-799';
