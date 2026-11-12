UPDATE "vehicle_type_master" m
SET "type_code" = REPLACE(m."type_code", ' ', '-')
WHERE m."type_code" LIKE '% %'
  AND NOT EXISTS (
    SELECT 1 FROM "vehicle_type_master" o WHERE o."type_code" = REPLACE(m."type_code", ' ', '-')
  );

UPDATE "vehicles" SET "type_code" = REPLACE("type_code", ' ', '-') WHERE "type_code" LIKE '% %';
