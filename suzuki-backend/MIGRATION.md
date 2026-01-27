# Database Migration Guide

## Schema Updated ✅

The database schema has been updated to match Navision Dynamics 365 format:

### New Tables Added:
- ✅ **clients** - Customer management
- ✅ **employes** - Employee management  
- ✅ **ventes** - Sales transactions
- ✅ **reparations** - Repairs/maintenance
- ✅ **documents** - Document management

### Updated Tables:
- ✅ **vehicules** - Added: kilometrage, prix, statut, id_vendeur
- ✅ **pieces_rechange** - Added: nom_piece, quantite_stock, prix_unitaire, fournisseur

## Migration Steps:

### 1. Generate Migration
```bash
npx prisma migrate dev --name add_navision_tables
```

### 2. Apply Migration
```bash
npx prisma migrate deploy
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Verify Database
```bash
npx prisma studio
```

## Backend Services Created:
- ✅ ClientsService (clients/)
- ✅ EmployesService (employes/)
- ✅ VentesService (ventes/)
- ✅ ReparationsService (reparations/)
- ✅ DocumentsService (documents/)

## Relations Implemented:
- CLIENT (1,1) ---- (0,N) VENTE
- CLIENT (1,1) ---- (0,N) REPARATION
- VEHICULE (1,1) ---- (0,N) VENTE
- VEHICULE (1,1) ---- (0,N) REPARATION
- EMPLOYE (1,1) ---- (0,N) VENTE
- EMPLOYE (1,1) ---- (0,N) REPARATION
- CLIENT (1,1) ---- (0,N) DOCUMENT
- VEHICULE (1,1) ---- (0,N) DOCUMENT

## Next Steps:
1. Run migration commands above
2. Test API endpoints
3. Update frontend if needed
