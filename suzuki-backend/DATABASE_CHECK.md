# 🔍 DATABASE COMPATIBILITY CHECK

## 📋 Current Setup (Development)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Tables**: 12 tables (vehicles, parts, chat, etc.)

## 🎯 Suzuki Production Setup
- **Database**: SQL Server (CARPRO-VPS-04\CARPRO_INST_PROD)
- **Login**: Carpro.Chatbot
- **Password**: CarCha2026++

---

## 🚀 STEP 1: Install SQL Server Package

```bash
npm install mssql
npm install --save-dev @types/mssql
```

---

## 🚀 STEP 2: Run Database Check

```bash
npm run db:check-prod
```

This will:
1. ✅ Connect to Suzuki's production SQL Server
2. ✅ List all existing tables
3. ✅ Check if our required tables exist
4. ✅ Show `pieces_rechange` table structure
5. ✅ Display sample data
6. ✅ Compare column mappings

---

## 📊 WHAT TO CHECK:

### ✅ Table Names Match?
Our Prisma schema expects:
- `pieces_rechange` (parts catalog) ← **CRITICAL**
- `vehicules` (vehicles)
- `clients` (customers)
- `employes` (employees)
- `ventes` (sales)
- `reparations` (repairs)
- `documents` (documents)
- `chat_sessions` (chatbot sessions)
- `chat_messages` (chatbot messages)
- `chat_prompts` (AI prompts)
- `chat_feedback` (user feedback)
- `upload_tracking` (carte grise uploads)

### ✅ Column Names Match?
For `pieces_rechange` table, we need:
- `id_piece` (primary key)
- `reference` (part reference number)
- `designation` (part name/description)
- `quantite_stock` OR `stock` (stock quantity)
- `prix_ht` (price excluding tax)
- `version_modele` (vehicle model)
- `type_vehicule` (vehicle type)

---

## 🔧 POSSIBLE SCENARIOS:

### ✅ Scenario 1: Tables Exist, Columns Match
**Action**: Update Prisma datasource to SQL Server
```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

### ⚠️ Scenario 2: Tables Exist, Column Names Different
**Action**: Update Prisma @map() annotations
```prisma
model PiecesRechange {
  id         Int    @id @map("their_column_name")
  reference  String @map("their_ref_column")
  // ...
}
```

### ❌ Scenario 3: Chat Tables Don't Exist
**Action**: Create migration to add chat tables
```bash
npx prisma migrate dev --name add_chat_tables
```

### ❌ Scenario 4: Completely Different Structure
**Action**: Create adapter layer to map their schema to ours

---

## 📝 NEXT STEPS AFTER CHECK:

1. **Run the check script**
2. **Document differences** in a file
3. **Decide on migration strategy**:
   - Option A: Modify our code to match their schema
   - Option B: Create database migration to add our tables
   - Option C: Create adapter/mapper layer
4. **Test connection** with real data
5. **Update Prisma schema** accordingly

---

## 🆘 TROUBLESHOOTING:

### Error: "Login failed"
- Verify credentials are correct
- Check if user has proper permissions

### Error: "Cannot connect to server"
- Check VPN/network access
- Verify server name is correct
- Check firewall rules

### Error: "Database does not exist"
- Ask Suzuki for correct database name
- They might have multiple databases

---

## 📞 CONTACT:

If tables don't match, email Suzuki:
```
Subject: Structure de la base de données - Chatbot IA

Bonjour,

J'ai besoin de vérifier la structure de la base de données pour l'intégration du chatbot.

Questions:
1. Quel est le nom exact de la base de données à utiliser?
2. La table "pieces_rechange" existe-t-elle?
3. Pouvez-vous partager le schéma de la table "pieces_rechange"?
4. Dois-je créer les tables pour le chatbot (chat_sessions, chat_messages, etc.)?

Merci,
[Your name]
```
