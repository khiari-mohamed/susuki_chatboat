# Rate Limiting Changes - Carte Grise Only

## Summary of Changes

**Date:** $(date)
**Change:** Removed IP-based rate limiting, keeping only carte grise (immatriculation) based rate limiting

---

## What Was Changed

### ✅ Removed IP-Based Rate Limit

**Before:**
- Users were limited to 3 uploads per IP address per month
- IP limit was checked BEFORE OCR processing
- Blocked users could bypass by changing IP/using VPN

**After:**
- IP-based rate limiting completely removed
- Users can upload unlimited times from the same IP
- IP is still tracked for analytics purposes only

---

### ✅ Kept Carte Grise Rate Limit

**Active Rate Limit:**
- **Limit:** 3 uploads per unique carte grise (immatriculation) per month
- **Reset:** Automatically on the 1st of each month
- **Check:** Performed AFTER OCR extraction
- **Scope:** Per vehicle registration number, not per user

---

## Technical Changes

### File: `verification.service.ts`

**Removed:**
1. ❌ IP upload count check before OCR
2. ❌ `getMonthlyUploadCount(userIp)` method
3. ❌ IP limit error message
4. ❌ `uploadCount` in success response

**Kept:**
1. ✅ `getMonthlyCarteGriseUploadCount(immatriculation)` method
2. ✅ Carte grise limit check after OCR
3. ✅ `trackUpload()` for analytics (still stores IP)
4. ✅ `upload_tracking` table structure unchanged

---

## User Experience Changes

### Before:
```
User uploads from IP 192.168.1.1
├─ Upload #1: ✅ Success
├─ Upload #2: ✅ Success
├─ Upload #3: ✅ Success
└─ Upload #4: ❌ "Limite mensuelle atteinte. Vous avez déjà téléchargé 3 cartes grises ce mois-ci."
```

### After:
```
User uploads carte grise "123 ABC 456"
├─ Upload #1: ✅ Success
├─ Upload #2: ✅ Success
├─ Upload #3: ✅ Success
└─ Upload #4: ❌ "Cette carte grise (123 ABC 456) a déjà été téléchargée 3 fois ce mois-ci."

Same user uploads different carte grise "789 XYZ 012"
├─ Upload #1: ✅ Success (not blocked, different vehicle)
```

---

## Why This Change?

### Problems with IP-Based Limiting:
1. **False Positives:** Multiple users behind same NAT/proxy share one IP
2. **Easy Bypass:** Users can change IP with VPN
3. **Poor User Experience:** Legitimate users get blocked unnecessarily
4. **Not Vehicle-Specific:** Doesn't prevent abuse of same vehicle

### Benefits of Carte Grise Only:
1. **Vehicle-Specific:** Limits abuse per actual vehicle
2. **Can't Bypass:** Changing IP doesn't help
3. **Fair Usage:** Users can upload multiple vehicles
4. **Prevents Duplicate Processing:** Same carte grise won't be OCR'd repeatedly

---

## Database Impact

### `upload_tracking` Table

**Structure (Unchanged):**
```sql
CREATE TABLE "upload_tracking" (
    "id" TEXT PRIMARY KEY,
    "user_ip" VARCHAR(45) NOT NULL,      -- ✅ Still tracked for analytics
    "uploaded_at" TIMESTAMP(3) NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "vehicle_info" JSONB                  -- ✅ Used for carte grise limit
);
```

**Indexes (Unchanged):**
- ✅ `upload_tracking_user_ip_uploaded_at_idx` - still useful for analytics
- ✅ `upload_tracking_uploaded_at_idx` - used for time-based queries

**Note:** Consider adding GIN index for better JSONB query performance:
```sql
CREATE INDEX upload_tracking_immat_idx ON upload_tracking USING gin (vehicle_info);
```

---

## API Response Changes

### Success Response

**Before:**
```json
{
  "success": true,
  "vehicleInfo": { ... },
  "uploadCount": 2,           // ❌ Removed (was IP upload count)
  "debug": { ... }
}
```

**After:**
```json
{
  "success": true,
  "vehicleInfo": { ... },
  "debug": { ... }
}
```

### Error Response (Carte Grise Limit)

**Unchanged:**
```json
{
  "success": false,
  "message": "Cette carte grise (123 ABC 456) a déjà été téléchargée 3 fois ce mois-ci.",
  "uploadCount": 3,
  "limitReached": true,
  "limitType": "carte_grise"
}
```

---

## Frontend Impact

### `ChatWidget.jsx`

**No Changes Required:**
- Frontend already handles `limitReached: true` generically
- Error message comes from backend (already correct)
- Upload count display was unused (reading from sessionStorage but never shown)

**UI Text (Still Accurate):**
```jsx
<p>Limite: 3 téléchargements par mois</p>
```
- This is now per carte grise, not per user
- Text is still technically correct

---

## Migration Path

### No Database Migration Needed ✅

**Existing Data:**
- All existing `upload_tracking` records remain valid
- IP data is still stored for analytics
- Carte grise limit queries work unchanged

### Deployment:
1. Update backend code (`verification.service.ts`)
2. Restart backend service
3. No downtime required
4. No frontend changes needed

---

## Testing Checklist

After deployment, test:

- [ ] Upload same carte grise 3 times → should succeed
- [ ] Upload same carte grise 4th time → should fail with limite message
- [ ] Upload different carte grise after hitting limit → should succeed
- [ ] Check database: `upload_tracking` still recording both IP and vehicle info
- [ ] Error message shows correct immatriculation number
- [ ] Wait until next month → carte grise limit resets automatically

---

## Monitoring

### Metrics to Track:

1. **Upload Success Rate**
   - Should increase (no false positives from IP limits)

2. **Carte Grise Limit Hits**
   ```sql
   SELECT COUNT(*) 
   FROM upload_tracking 
   WHERE uploaded_at >= date_trunc('month', CURRENT_DATE)
   GROUP BY vehicle_info->>'immatriculation'
   HAVING COUNT(*) >= 3;
   ```

3. **Unique IPs per Carte Grise**
   - Detect if multiple IPs uploading same carte grise (potential abuse)

---

## Rollback Plan

If needed, restore IP-based limiting by reverting `verification.service.ts`:

```bash
git checkout HEAD~1 suzuki-backend/src/verification/verification.service.ts
```

Or manually re-add the removed code sections.

---

## Future Considerations

### Potential Enhancements:
1. **Admin Dashboard:** View which carte grises hit limit
2. **Whitelist:** Allow specific immatriculations unlimited uploads
3. **Configurable Limit:** Move `>= 3` to environment variable
4. **Email Notifications:** Alert when carte grise approaches limit
5. **Grace Period:** Allow 1 extra upload with warning

---

## Related Files

- `suzuki-backend/src/verification/verification.service.ts` - Main logic
- `suzuki-backend/src/verification/verification.controller.ts` - Still passes userIp (for tracking)
- `suzuki-backend/prisma/schema.prisma` - Database schema (unchanged)
- `chatboat/src/components/ChatWidget.jsx` - Frontend (no changes needed)

---

**Status:** ✅ Complete - IP-based rate limiting removed, carte grise limiting active
