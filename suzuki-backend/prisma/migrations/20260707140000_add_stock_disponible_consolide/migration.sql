-- Add client-confirmed stock fields.
-- Availability rule: a part is sellable only when stock_consolide > 2.

ALTER TABLE "stock"
ADD COLUMN "stock_disponible" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "stock_consolide" INTEGER NOT NULL DEFAULT 0;

-- Preserve current stock semantics until the importer maps the two source
-- fields separately. After the CarPro import is updated, these values should
-- come directly from "Stock disponible" and "Stock consolidé".
UPDATE "stock"
SET
  "stock_disponible" = COALESCE("total_quantity", 0),
  "stock_consolide" = COALESCE("total_quantity", 0);

CREATE INDEX "stock_stock_consolide_idx" ON "stock"("stock_consolide");
