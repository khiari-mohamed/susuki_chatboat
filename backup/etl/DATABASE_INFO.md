# 📊 CARPRO SUZUKI DATABASE - COMPLETE INFO

**Date:** Today  
**Database:** CARPRO_PROD_BC (Microsoft SQL Server - Business Central)  
**Total Suzuki Parts:** 4,229 parts

---

## 🎯 FINAL DATABASE MAPPING

| Our Code | Business Central Column | Data Type | Example |
|----------|------------------------|-----------|---------|
| `reference` | `No_` | nvarchar(20) | `00007136HE` |
| `designation` | `Description` | nvarchar(100) | `PARE A BOUE AV GAUCHE` |
| `prixHt` | `Unit Price` | decimal | `163.30` |
| `versionModele` | `Model Code` | nvarchar(20) | `NEW CIAZ` |
| `stock` | `Stock Consolidé` | tinyint | `1` |

---

## 📦 TABLE INFORMATION

**Table Name:** `CARPRO PROD$Item`  
**Total Columns:** 175 columns  
**Suzuki Parts:** 4,229 rows  
**Models Found:**
- NEW CIAZ
- NEW CELERIO POP 6AB
- NEW BALENO 6AB
- NEW SWIFT
- (Many parts have empty model field)

---

## 🔌 CONNECTION STRING FORMAT

```env
DATABASE_URL="sqlserver://HOST:1433;database=CARPRO_PROD_BC;user=USERNAME;password=PASSWORD;encrypt=true;trustServerCertificate=true"
```

**You need to get from them:**
- HOST (server name or IP)
- USERNAME (database user)
- PASSWORD (database password)

---

## 📝 PRISMA SCHEMA CHANGES

### 1. Change Provider
```prisma
datasource db {
  provider = "sqlserver"  // Changed from "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Update PiecesRechange Model
```prisma
model PiecesRechange {
  reference       String   @id @map("No_")
  designation     String   @map("Description")
  prixHt          Decimal  @map("Unit Price")
  versionModele   String   @map("Model Code")
  stock           Int      @map("Stock Consolidé")
  
  @@map("CARPRO PROD$Item")
}
```

---

## 🔍 SAMPLE QUERY

```sql
-- Get all Suzuki parts
SELECT 
    [No_] as reference,
    [Description] as designation,
    [Unit Price] as prix,
    [Model Code] as modele,
    [Stock Consolidé] as stock
FROM [CARPRO PROD$Item]
WHERE [Make Code] = 'SUZUKI'
  AND [Description] IS NOT NULL
  AND [Description] != ''
ORDER BY [No_];
```

---

## 📊 SAMPLE DATA

```
No_              | Description              | Unit Price | Model Code           | Stock
-----------------|--------------------------|------------|----------------------|------
00007136HE       | PARE A BOUE AV GAUCHE   | 163.30     | NEW CIAZ            | 1
01550-0830A-000  | BOLT RS413 4WD          | 17.18      | NEW CIAZ            | 0
01550-0855A-000  | BOLT GSX-R600/K6-       | 17.18      | NEW CIAZ            | 0
```

---

## ✅ WHAT'S WORKING

- ✅ Database identified: CARPRO_PROD_BC
- ✅ Table identified: CARPRO PROD$Item
- ✅ Column mapping: Complete
- ✅ Sample data: Exported (4,229 parts)
- ✅ Stock field: EXISTS and has data!
- ✅ Models: Multiple Suzuki models found

---

## ⚠️ WHAT'S NEEDED

1. ❌ **Database connection credentials**
   - Server host/IP
   - Port (usually 1433)
   - Username
   - Password

2. ❌ **Network access**
   - Must work on-site (no remote access)
   - Need to connect from their network

3. ❌ **Permissions**
   - READ access to `CARPRO PROD$Item` table
   - SELECT permission on database

---

## 🔧 CODE CHANGES SUMMARY

### Files to Modify:

1. **`prisma/schema.prisma`**
   - Change provider to `sqlserver`
   - Update table name to `CARPRO PROD$Item`
   - Update column mappings

2. **`.env`**
   - Update DATABASE_URL to SQL Server format

3. **`package.json`** (if needed)
   - May need to add `@prisma/client` for SQL Server

4. **No changes needed to:**
   - Search logic (works the same)
   - AI logic (works the same)
   - Frontend (works the same)

---

## ⏱️ ESTIMATED WORK

**Best Case:** 2-3 hours
- Just update connection string
- Update Prisma schema
- Test queries
- Done!

**Realistic:** 4-6 hours
- Update connection
- Update schema
- Test with real data
- Fix any SQL Server specific issues
- Deploy

**Worst Case:** 1 day
- Connection issues
- Permission issues
- SQL Server compatibility fixes

---

## 📋 NEXT STEPS (Tomorrow On-Site)

### Step 1: Get Connection Info (30 min)
Ask them for:
- Server name/IP
- Database username
- Database password
- Test connection in SSMS

### Step 2: Update Code (1-2 hours)
- Update `schema.prisma`
- Update `.env`
- Run `npx prisma generate`
- Test connection

### Step 3: Test Queries (1 hour)
- Test search for "filtre air"
- Test search for "disque frein"
- Test reference search
- Verify results match database

### Step 4: Deploy (1-2 hours)
- Build frontend
- Deploy backend
- Test on their network
- Go live!

---

## 🎯 SUCCESS CRITERIA

✅ Backend connects to CARPRO_PROD_BC  
✅ Queries return Suzuki parts  
✅ Search works (filtre air, disque frein, etc.)  
✅ Stock shows correctly  
✅ Prices show correctly  
✅ Models filter correctly  

---

## 📞 QUESTIONS TO ASK TOMORROW

1. **Database Access:**
   - "What's the SQL Server hostname/IP?"
   - "What username/password should I use?"
   - "Can you test the connection with me?"

2. **Deployment:**
   - "Where should I deploy the backend?" (Their server or cloud?)
   - "Do you have Node.js installed?"
   - "What's the WordPress URL?"

3. **Testing:**
   - "Can we test with a few queries together?"
   - "Who will be the main user for testing?"

---

## 🚀 READY TO GO!

Everything is documented. Tomorrow you just need:
1. Connection credentials
2. 2-4 hours of work
3. Testing
4. Done!

**Good luck! 💪**
