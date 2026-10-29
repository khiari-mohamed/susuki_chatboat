ALTER TABLE "search_logs" ADD COLUMN IF NOT EXISTS "redirect_reason" VARCHAR(60);

DROP INDEX IF EXISTS "search_logs_vin_idx";
CREATE INDEX IF NOT EXISTS "search_logs_vin_created_at_idx" ON "search_logs"("vin", "created_at");
CREATE INDEX IF NOT EXISTS "search_logs_redirect_reason_idx" ON "search_logs"("redirect_reason");
