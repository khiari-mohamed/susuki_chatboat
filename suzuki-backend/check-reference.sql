-- Check if it exists in core.items
SELECT 'CORE ITEMS' as source, reference, designation, make_code, model_code_norm
FROM core.items
WHERE reference ILIKE '%16510M65L10%' 
   OR reference ILIKE '%16510-M65L-10%'
   OR reference ILIKE '%16510M65L%'
LIMIT 10;

-- Check if it exists in mart view
SELECT 'MART VIEW' as source, reference, designation, model_code, match_rule
FROM mart.chatbot_parts_with_fitment
WHERE reference ILIKE '%16510M65L10%' 
   OR reference ILIKE '%16510-M65L-10%'
   OR reference ILIKE '%16510M65L%'
LIMIT 10;

-- Search for any oil filter references
SELECT 'OIL FILTERS' as source, reference, designation, model_code, match_rule
FROM mart.chatbot_parts_with_fitment
WHERE (designation ILIKE '%oil filter%' OR designation ILIKE '%filtre%huile%')
   AND (model_code = 'S-PRESSO' OR match_rule = 'unknown_model')
LIMIT 5;
