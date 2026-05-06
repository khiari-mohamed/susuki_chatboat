-- Check the actual structure of the synonyms table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'synonyms'
ORDER BY ordinal_position;

-- Show sample data
SELECT * FROM synonyms LIMIT 10;
