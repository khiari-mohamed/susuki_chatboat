# 🎯 DATABASE COMPATIBILITY CHECKLIST

## ⚡ QUICK START:

```bash
# 1. Install SQL Server package
npm install mssql @types/mssql

# 2. Run database check
npm run db:check-prod

# 3. Review output and document differences
```

---

## 📊 OUR CURRENT SCHEMA (PostgreSQL):

### **CRITICAL TABLE: pieces_rechange**
```sql
CREATE TABLE pieces_rechange (
  id_piece          INT PRIMARY KEY,
  reference         VARCHAR(50) UNIQUE,
  designation       TEXT,
  quantite_stock    INT,
  prix_ht           DECIMAL(10,3),
  stock             INT,
  version_modele    VARCHAR(50),
  type_vehicule     VARCHAR(50),
  created_at        TIMESTAMP
);
```

### **CHATBOT TABLES (May need to create):**
- `chat_sessions` - Store conversation sessions
- `chat_messages` - Store user/bot messages
- `chat_prompts` - Track AI prompts
- `chat_feedback` - User ratings
- `upload_tracking` - Carte grise upload limits

---

## ✅ WHAT WE NEED FROM SUZUKI:

1. **Database name** (currently unknown)
2. **Table structure** for `pieces_rechange`
3. **Permission** to create new tables for chatbot
4. **Sample data** to test queries

---

## 🔍 KEY QUESTIONS TO ANSWER:

### Question 1: Does `pieces_rechange` table exist?
- ✅ YES → Check column names match
- ❌ NO → Ask for correct table name

### Question 2: Do column names match?
Our code expects:
- `reference` (part number)
- `designation` (part name)
- `prix_ht` (price)
- `stock` OR `quantite_stock` (quantity)

### Question 3: Can we create chat tables?
- ✅ YES → Run Prisma migration
- ❌ NO → Ask for separate database

### Question 4: Is data structure compatible?
- Check if `designation` contains model names (CELERIO, S-PRESSO, etc.)
- Check if `reference` format matches (e.g., 13780M62S00)
- Check if `prix_ht` is in TND currency

---

## 🚨 POTENTIAL ISSUES:

### Issue 1: Different Column Names
**Example**: They use `nom_piece` instead of `designation`

**Solution**: Update Prisma mapping
```prisma
designation String @map("nom_piece")
```

### Issue 2: Missing Chat Tables
**Solution**: Create migration
```bash
npx prisma migrate deploy
```

### Issue 3: Different Data Types
**Example**: They use `FLOAT` instead of `DECIMAL` for prices

**Solution**: Update Prisma schema
```prisma
prixHt Float @map("prix_ht")
```

### Issue 4: No Permission to Create Tables
**Solution**: Request separate database or schema for chatbot

---

## 📝 AFTER RUNNING CHECK:

Create a file `DATABASE_DIFFERENCES.md` with:

```markdown
# Database Differences Found

## 1. Table Names
- ✅ pieces_rechange EXISTS
- ❌ chat_sessions MISSING
- ❌ chat_messages MISSING

## 2. Column Differences (pieces_rechange)
| Our Schema | Their Schema | Status |
|------------|--------------|--------|
| reference  | ref_piece    | ❌ Different |
| designation| nom_piece    | ❌ Different |
| prix_ht    | prix_ht      | ✅ Match |

## 3. Required Changes
1. Update @map() in Prisma schema
2. Create chat tables migration
3. Test queries with real data
```

---

## 🎯 DECISION TREE:

```
Run db:check-prod
    │
    ├─ Connection Failed?
    │   └─ Contact Suzuki for correct credentials
    │
    ├─ Tables Match?
    │   ├─ YES → Update datasource to sqlserver
    │   └─ NO → Document differences
    │
    ├─ Columns Match?
    │   ├─ YES → Ready to deploy!
    │   └─ NO → Update @map() annotations
    │
    └─ Chat Tables Exist?
        ├─ YES → Test queries
        └─ NO → Create migration or request separate DB
```

---

## 🚀 NEXT ACTIONS:

1. ✅ Install mssql package
2. ✅ Run database check script
3. ⏳ Document all differences
4. ⏳ Update Prisma schema if needed
5. ⏳ Test queries with production data
6. ⏳ Deploy to production

---

**Ready to check? Run:** `npm run db:check-prod`
