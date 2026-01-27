/*
  Warnings:

  - The primary key for the `pieces_rechange` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `pieces_rechange` table. All the data in the column will be lost.
  - You are about to drop the `vehicles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "pieces_rechange_stock_idx";

-- AlterTable
ALTER TABLE "pieces_rechange" DROP CONSTRAINT "pieces_rechange_pkey",
DROP COLUMN "id",
ADD COLUMN     "date_ajout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fournisseur" VARCHAR(100),
ADD COLUMN     "id_piece" SERIAL NOT NULL,
ADD COLUMN     "nom_piece" TEXT,
ADD COLUMN     "prix_unitaire" DECIMAL(10,3),
ADD COLUMN     "quantite_stock" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "pieces_rechange_pkey" PRIMARY KEY ("id_piece");

-- DropTable
DROP TABLE "vehicles";

-- CreateTable
CREATE TABLE "vehicules" (
    "id_vehicule" SERIAL NOT NULL,
    "immatriculation" VARCHAR(20) NOT NULL,
    "vin" VARCHAR(17),
    "marque" VARCHAR(50) NOT NULL,
    "modele" VARCHAR(50) NOT NULL,
    "annee" INTEGER NOT NULL,
    "kilometrage" INTEGER,
    "prix" DECIMAL(10,3),
    "date_ajout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" VARCHAR(50) NOT NULL DEFAULT 'disponible',
    "id_vendeur" INTEGER,
    "type" VARCHAR(50),
    "couleur" VARCHAR(30),
    "proprietaire" VARCHAR(100),
    "date_achat" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicules_pkey" PRIMARY KEY ("id_vehicule")
);

-- CreateTable
CREATE TABLE "clients" (
    "id_client" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150),
    "telephone" VARCHAR(20),
    "adresse" TEXT,
    "type_client" VARCHAR(50) NOT NULL DEFAULT 'particulier',
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "employes" (
    "id_employe" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "poste" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150),
    "telephone" VARCHAR(20),

    CONSTRAINT "employes_pkey" PRIMARY KEY ("id_employe")
);

-- CreateTable
CREATE TABLE "ventes" (
    "id_vente" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "id_vehicule" INTEGER NOT NULL,
    "prix_achat" DECIMAL(10,3) NOT NULL,
    "date_vente" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode_paiement" VARCHAR(50) NOT NULL,
    "id_vendeur" INTEGER NOT NULL,

    CONSTRAINT "ventes_pkey" PRIMARY KEY ("id_vente")
);

-- CreateTable
CREATE TABLE "reparations" (
    "id_entretien" SERIAL NOT NULL,
    "id_vehicule" INTEGER NOT NULL,
    "id_client" INTEGER NOT NULL,
    "date_entretien" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type_entretien" VARCHAR(100) NOT NULL,
    "cout" DECIMAL(10,3) NOT NULL,
    "id_vendeur" INTEGER,

    CONSTRAINT "reparations_pkey" PRIMARY KEY ("id_entretien")
);

-- CreateTable
CREATE TABLE "documents" (
    "id_document" SERIAL NOT NULL,
    "type_document" VARCHAR(100) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lien_document" TEXT,
    "id_client" INTEGER,
    "id_vehicule" INTEGER,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id_document")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicules_immatriculation_key" ON "vehicules"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "vehicules_vin_key" ON "vehicules"("vin");

-- CreateIndex
CREATE INDEX "vehicules_marque_modele_idx" ON "vehicules"("marque", "modele");

-- CreateIndex
CREATE INDEX "vehicules_statut_idx" ON "vehicules"("statut");

-- CreateIndex
CREATE INDEX "vehicules_id_vendeur_idx" ON "vehicules"("id_vendeur");

-- CreateIndex
CREATE INDEX "clients_email_idx" ON "clients"("email");

-- CreateIndex
CREATE INDEX "clients_telephone_idx" ON "clients"("telephone");

-- CreateIndex
CREATE INDEX "employes_poste_idx" ON "employes"("poste");

-- CreateIndex
CREATE INDEX "ventes_id_client_idx" ON "ventes"("id_client");

-- CreateIndex
CREATE INDEX "ventes_id_vehicule_idx" ON "ventes"("id_vehicule");

-- CreateIndex
CREATE INDEX "ventes_id_vendeur_idx" ON "ventes"("id_vendeur");

-- CreateIndex
CREATE INDEX "ventes_date_vente_idx" ON "ventes"("date_vente");

-- CreateIndex
CREATE INDEX "reparations_id_vehicule_idx" ON "reparations"("id_vehicule");

-- CreateIndex
CREATE INDEX "reparations_id_client_idx" ON "reparations"("id_client");

-- CreateIndex
CREATE INDEX "reparations_date_entretien_idx" ON "reparations"("date_entretien");

-- CreateIndex
CREATE INDEX "documents_id_client_idx" ON "documents"("id_client");

-- CreateIndex
CREATE INDEX "documents_id_vehicule_idx" ON "documents"("id_vehicule");

-- CreateIndex
CREATE INDEX "documents_type_document_idx" ON "documents"("type_document");

-- CreateIndex
CREATE INDEX "pieces_rechange_quantite_stock_idx" ON "pieces_rechange"("quantite_stock");

-- CreateIndex
CREATE INDEX "pieces_rechange_fournisseur_idx" ON "pieces_rechange"("fournisseur");

-- AddForeignKey
ALTER TABLE "vehicules" ADD CONSTRAINT "vehicules_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "employes"("id_employe") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventes" ADD CONSTRAINT "ventes_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventes" ADD CONSTRAINT "ventes_id_vehicule_fkey" FOREIGN KEY ("id_vehicule") REFERENCES "vehicules"("id_vehicule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventes" ADD CONSTRAINT "ventes_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "employes"("id_employe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reparations" ADD CONSTRAINT "reparations_id_vehicule_fkey" FOREIGN KEY ("id_vehicule") REFERENCES "vehicules"("id_vehicule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reparations" ADD CONSTRAINT "reparations_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reparations" ADD CONSTRAINT "reparations_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "employes"("id_employe") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_id_vehicule_fkey" FOREIGN KEY ("id_vehicule") REFERENCES "vehicules"("id_vehicule") ON DELETE SET NULL ON UPDATE CASCADE;
