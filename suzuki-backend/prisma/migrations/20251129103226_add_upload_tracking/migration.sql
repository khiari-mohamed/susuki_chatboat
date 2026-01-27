-- CreateTable
CREATE TABLE "upload_tracking" (
    "id" TEXT NOT NULL,
    "user_ip" VARCHAR(45) NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "vehicle_info" JSONB,

    CONSTRAINT "upload_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "upload_tracking_user_ip_uploaded_at_idx" ON "upload_tracking"("user_ip", "uploaded_at");

-- CreateIndex
CREATE INDEX "upload_tracking_uploaded_at_idx" ON "upload_tracking"("uploaded_at");
