-- CreateTable
CREATE TABLE "search_logs" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "vin" VARCHAR(25),
    "vehicle_no" VARCHAR(20),
    "model_code" VARCHAR(30),
    "customer_message" TEXT NOT NULL,
    "identified_part" VARCHAR(200),
    "proposed_references" JSONB,
    "compatibility_result" VARCHAR(30),
    "availability_communicated" VARCHAR(30),
    "redirect_message" TEXT,
    "intent" VARCHAR(40),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_logs_vin_idx" ON "search_logs"("vin");

-- CreateIndex
CREATE INDEX "search_logs_session_id_idx" ON "search_logs"("session_id");

-- CreateIndex
CREATE INDEX "search_logs_created_at_idx" ON "search_logs"("created_at");
