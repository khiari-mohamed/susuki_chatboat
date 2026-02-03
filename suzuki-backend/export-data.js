const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public'
    }
  }
});

async function exportData() {
  try {
    console.log('📤 Exporting data from local database...\n');

    const pieces = await prisma.piecesRechange.findMany();
    
    console.log(`Found ${pieces.length} parts to export`);

    let sql = '-- Suzuki Parts Data Export\n\n';
    
    pieces.forEach(piece => {
      const values = [
        piece.reference ? `'${piece.reference.replace(/'/g, "''")}'` : 'NULL',
        piece.nomPiece ? `'${piece.nomPiece.replace(/'/g, "''")}'` : 'NULL',
        piece.designation ? `'${piece.designation.replace(/'/g, "''")}'` : 'NULL',
        piece.quantiteStock || 0,
        piece.prixUnitaire || 'NULL',
        piece.fournisseur ? `'${piece.fournisseur.replace(/'/g, "''")}'` : 'NULL',
        piece.versionModele ? `'${piece.versionModele.replace(/'/g, "''")}'` : 'NULL',
        piece.typeVehicule ? `'${piece.typeVehicule.replace(/'/g, "''")}'` : 'NULL',
        piece.prixHt || 0,
        piece.stock || 0
      ];
      
      sql += `INSERT INTO "pieces_rechange" (reference, nom_piece, designation, quantite_stock, prix_unitaire, fournisseur, version_modele, type_vehicule, prix_ht, stock) VALUES (${values.join(', ')});\n`;
    });

    fs.writeFileSync('data_export.sql', sql);
    
    console.log('\n✅ Export complete! File: data_export.sql');
    console.log(`📊 Exported ${pieces.length} parts`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
