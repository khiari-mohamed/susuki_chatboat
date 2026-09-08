ALTER TABLE "vehicles"
  ADD COLUMN "type_code" VARCHAR(30);

CREATE INDEX "vehicles_type_code_idx" ON "vehicles"("type_code");