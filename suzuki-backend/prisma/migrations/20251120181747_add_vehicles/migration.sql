-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "immatriculation" VARCHAR(20) NOT NULL,
    "vin" VARCHAR(17),
    "marque" VARCHAR(50) NOT NULL,
    "modele" VARCHAR(50) NOT NULL,
    "annee" INTEGER NOT NULL,
    "type" VARCHAR(50),
    "couleur" VARCHAR(30),
    "proprietaire" VARCHAR(100),
    "date_achat" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces_rechange" (
    "id" SERIAL NOT NULL,
    "reference" VARCHAR(50) NOT NULL,
    "designation" TEXT NOT NULL,
    "version_modele" VARCHAR(50) NOT NULL,
    "type_vehicule" VARCHAR(50) NOT NULL,
    "prix_ht" DECIMAL(10,3) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pieces_rechange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "vehicle_info" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_prompts" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "prompt_text" TEXT NOT NULL,
    "response_text" TEXT NOT NULL,
    "model" TEXT,
    "tokens" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_feedback" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_immatriculation_key" ON "vehicles"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vin_key" ON "vehicles"("vin");

-- CreateIndex
CREATE INDEX "vehicles_marque_modele_idx" ON "vehicles"("marque", "modele");

-- CreateIndex
CREATE INDEX "vehicles_immatriculation_idx" ON "vehicles"("immatriculation");

-- CreateIndex
CREATE INDEX "vehicles_vin_idx" ON "vehicles"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_rechange_reference_key" ON "pieces_rechange"("reference");

-- CreateIndex
CREATE INDEX "pieces_rechange_version_modele_idx" ON "pieces_rechange"("version_modele");

-- CreateIndex
CREATE INDEX "pieces_rechange_stock_idx" ON "pieces_rechange"("stock");

-- CreateIndex
CREATE INDEX "chat_sessions_started_at_idx" ON "chat_sessions"("started_at");

-- CreateIndex
CREATE INDEX "chat_messages_session_id_idx" ON "chat_messages"("session_id");

-- CreateIndex
CREATE INDEX "chat_messages_timestamp_idx" ON "chat_messages"("timestamp");

-- CreateIndex
CREATE INDEX "chat_prompts_session_id_idx" ON "chat_prompts"("session_id");

-- CreateIndex
CREATE INDEX "chat_prompts_created_at_idx" ON "chat_prompts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "chat_feedback_message_id_key" ON "chat_feedback"("message_id");

-- CreateIndex
CREATE INDEX "chat_feedback_rating_idx" ON "chat_feedback"("rating");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_prompts" ADD CONSTRAINT "chat_prompts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_feedback" ADD CONSTRAINT "chat_feedback_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
