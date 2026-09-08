-- Preserve the precision present in the authoritative CPP article export.
ALTER TABLE "parts"
  ALTER COLUMN "prix_ht" TYPE DECIMAL(20, 14)
    USING "prix_ht"::DECIMAL(20, 14),
  ALTER COLUMN "prix_ttc" TYPE DECIMAL(20, 5)
    USING "prix_ttc"::DECIMAL(20, 5);

ALTER TABLE "stock"
  ALTER COLUMN "total_quantity" TYPE DECIMAL(20, 5)
    USING "total_quantity"::DECIMAL(20, 5),
  ALTER COLUMN "stock_disponible" TYPE DECIMAL(20, 5)
    USING "stock_disponible"::DECIMAL(20, 5),
  ALTER COLUMN "stock_consolide" TYPE DECIMAL(20, 5)
    USING "stock_consolide"::DECIMAL(20, 5);