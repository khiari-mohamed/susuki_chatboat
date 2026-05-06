/*
  Warnings:

  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pieces_rechange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reparations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ventes` table. If the table is not empty, all the data it contains will be lost.

*/

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_id_client_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_id_vehicule_fkey";

-- DropForeignKey
ALTER TABLE "reparations" DROP CONSTRAINT "reparations_id_client_fkey";

-- DropForeignKey
ALTER TABLE "reparations" DROP CONSTRAINT "reparations_id_vehicule_fkey";

-- DropForeignKey
ALTER TABLE "reparations" DROP CONSTRAINT "reparations_id_vendeur_fkey";

-- DropForeignKey
ALTER TABLE "vehicules" DROP CONSTRAINT "vehicules_id_vendeur_fkey";

-- DropForeignKey
ALTER TABLE "ventes" DROP CONSTRAINT "ventes_id_client_fkey";

-- DropForeignKey
ALTER TABLE "ventes" DROP CONSTRAINT "ventes_id_vehicule_fkey";

-- DropForeignKey
ALTER TABLE "ventes" DROP CONSTRAINT "ventes_id_vendeur_fkey";

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "documents";

-- DropTable
DROP TABLE "employes";

-- DropTable
DROP TABLE "pieces_rechange";

-- DropTable
DROP TABLE "reparations";

-- DropTable
DROP TABLE "vehicules";

-- DropTable
DROP TABLE "ventes";

-- CreateTable
CREATE TABLE "parts" (
    "id" SERIAL NOT NULL,
    "reference" VARCHAR(50) NOT NULL,
    "designation" TEXT NOT NULL,
    "search_description" VARCHAR(100),
    "designation_2" VARCHAR(100),
    "prix_ht" DECIMAL(10,3),
    "prix_ttc" DECIMAL(10,3),
    "unite" VARCHAR(20),
    "categorie" VARCHAR(50),
    "fabricant" VARCHAR(100),
    "fournisseur_code" VARCHAR(50),
    "source" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "reference" VARCHAR(50) NOT NULL,
    "total_quantity" INTEGER NOT NULL DEFAULT 0,
    "statut" VARCHAR(20) NOT NULL DEFAULT 'Indisponible',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_type_master" (
    "id" SERIAL NOT NULL,
    "type_code" VARCHAR(30) NOT NULL,
    "model_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "vehicle_type_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fitment" (
    "id" SERIAL NOT NULL,
    "part_reference" VARCHAR(50) NOT NULL,
    "type_code" VARCHAR(30) NOT NULL,
    "model_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "fitment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "vehicle_no" VARCHAR(20) NOT NULL,
    "vin" VARCHAR(17),
    "marque" VARCHAR(20),
    "modele" VARCHAR(20),
    "modele_description" VARCHAR(100),
    "statut" VARCHAR(20),

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_references" (
    "id" SERIAL NOT NULL,
    "part_reference" VARCHAR(50) NOT NULL,
    "reference_no" VARCHAR(50) NOT NULL,
    "reference_type" VARCHAR(20),

    CONSTRAINT "item_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synonyms" (
    "id" SERIAL NOT NULL,
    "mot" VARCHAR(100) NOT NULL,
    "canonical" VARCHAR(100) NOT NULL,
    "langue" VARCHAR(5) NOT NULL DEFAULT 'fr',

    CONSTRAINT "synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parts_reference_key" ON "parts"("reference");

-- CreateIndex
CREATE INDEX "parts_categorie_idx" ON "parts"("categorie");

-- CreateIndex
CREATE INDEX "parts_fabricant_idx" ON "parts"("fabricant");

-- CreateIndex
CREATE INDEX "parts_fournisseur_code_idx" ON "parts"("fournisseur_code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_reference_key" ON "stock"("reference");

-- CreateIndex
CREATE INDEX "stock_statut_idx" ON "stock"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_type_master_type_code_key" ON "vehicle_type_master"("type_code");

-- CreateIndex
CREATE INDEX "fitment_type_code_idx" ON "fitment"("type_code");

-- CreateIndex
CREATE INDEX "fitment_model_name_idx" ON "fitment"("model_name");

-- CreateIndex
CREATE INDEX "fitment_part_reference_idx" ON "fitment"("part_reference");

-- CreateIndex
CREATE UNIQUE INDEX "fitment_part_reference_type_code_key" ON "fitment"("part_reference", "type_code");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vehicle_no_key" ON "vehicles"("vehicle_no");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vin_key" ON "vehicles"("vin");

-- CreateIndex
CREATE INDEX "vehicles_vin_idx" ON "vehicles"("vin");

-- CreateIndex
CREATE INDEX "vehicles_modele_idx" ON "vehicles"("modele");

-- CreateIndex
CREATE INDEX "item_references_reference_no_idx" ON "item_references"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "item_references_part_reference_reference_no_key" ON "item_references"("part_reference", "reference_no");

-- CreateIndex
CREATE INDEX "synonyms_mot_idx" ON "synonyms"("mot");

-- CreateIndex
CREATE INDEX "synonyms_canonical_idx" ON "synonyms"("canonical");

-- CreateIndex
CREATE UNIQUE INDEX "synonyms_mot_langue_key" ON "synonyms"("mot", "langue");

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_reference_fkey" FOREIGN KEY ("reference") REFERENCES "parts"("reference") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fitment" ADD CONSTRAINT "fitment_part_reference_fkey" FOREIGN KEY ("part_reference") REFERENCES "parts"("reference") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fitment" ADD CONSTRAINT "fitment_type_code_fkey" FOREIGN KEY ("type_code") REFERENCES "vehicle_type_master"("type_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_references" ADD CONSTRAINT "item_references_part_reference_fkey" FOREIGN KEY ("part_reference") REFERENCES "parts"("reference") ON DELETE RESTRICT ON UPDATE CASCADE;
