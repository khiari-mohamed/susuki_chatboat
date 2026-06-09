# Carte Grise Upload & Reading Analysis

## 🔍 Issue Identified

**Problem**: JSON response is being truncated when extracting vehicle info from carte grise
```json
{"immatriculation": "243 تونس 4698", "marque": "SUZUKI", "modele": "S-
```

This indicates the Gemini API response is incomplete.

---

## 📁 Files Involved in Carte Grise Processing

### Backend Files:
1. **`suzuki-backend/src/verification/verification.controller.ts`** - Handles file upload endpoint
2. **`suzuki-backend/src/verification/verification.service.ts`** - Main OCR verification logic
3. **`suzuki-backend/src/chat/gemini.service.ts`** - Gemini AI OCR extraction
4. **`suzuki-backend/src/chat/prompt-templates.ts`** - OCR prompt for Gemini

### Frontend Files:
1. **`chatboat/src/components/ChatWidget.jsx`** - File upload UI and handling
2. **`chatboat/src/config.js`** - API endpoint configuration

---

## 🐛 Issues Found & Fixes Needed

### Issue 1: Incomplete JSON from Gemini (CRITICAL)
**Location**: `gemini.service.ts` - Line 93-125

**Problem**: 
- Gemini response is being truncated
- Current `maxOutputTokens: 1024` might be too low
- JSON parsing tries to fix incomplete JSON but fails for your case

**Fix**:
```typescript
generationConfig: {
  temperature: 0.1,
  topK: 1,
  topP: 0.8,
  maxOutputTokens: 2048  // ← INCREASE from 1024
}
```

### Issue 2: OCR Prompt Issues
**Location**: `prompt-templates.ts` - OCR_SYSTEM_PROMPT

**Problems**:
1. Prompt doesn't explicitly tell Gemini to handle Arabic/Tunisian registration plates
2. No instruction to complete the JSON fully
3. Immatriculation cleaning rules may reject valid Tunisian formats

**Current Prompt Issues**:
```typescript
"IMMATRICULATION: lis le champ officiel. Nettoie: majuscules, retirer séparateurs exotiques. 
EXCLUS: ne JAMAIS renvoyer un VIN (17 caractères alphanum sans I/O/Q). 
Si un VIN est détecté, laisse le champ vide ou null."
```

**Problem**: "retirer séparateurs exotiques" might remove Arabic text or Tunisian format

**Fixed Prompt** (see below for full implementation)

### Issue 3: Insufficient Error Handling
**Location**: `gemini.service.ts` - extractVehicleInfo method

**Problem**: When JSON is incomplete, error messages are vague

**Current**:
```typescript
throw new Error('OCR_FAILED');
```

**Should Be**:
```typescript
this.logger.error(`❌ OCR extraction failed. Gemini response: ${text}`);
throw new Error('OCR_FAILED: ' + (parsed?.error || 'Incomplete response'));
```

### Issue 4: Frontend File Type Validation
**Location**: `ChatWidget.jsx` - Line 95-99

**Issue**: Supports DOC/DOCX but backend verification.controller.ts doesn't
```javascript
'application/msword',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
```

**Backend** only accepts:
```typescript
'image/*', 'application/pdf'
```

**Inconsistency**: Users can select DOC files but backend rejects them

---

## ✅ Fixes to Implement

### Fix 1: Update Gemini maxOutputTokens
**File**: `suzuki-backend/src/chat/gemini.service.ts`

Change Line 76:
```typescript
maxOutputTokens: 2048  // Increased from 1024
```

### Fix 2: Improve OCR Prompt for Tunisian Carte Grise
**File**: `suzuki-backend/src/chat/prompt-templates.ts`

Replace `OCR_SYSTEM_PROMPT` with:

```typescript
export const OCR_SYSTEM_PROMPT = `Tu es un expert en extraction de données de cartes grises tunisiennes et françaises.
Analyse L'IMAGE fournie et retourne UN JSON COMPLET ET VALIDE (sans texte autour) avec les champs suivants:
{
  "immatriculation": "numéro d'immatriculation EXACT avec espaces et caractères arabes préservés",
  "marque": "marque du véhicule (SUZUKI UNIQUEMENT)",
  "modele": "modèle exact et COMPLET (Swift, Vitara, Celerio, S-Presso, Jimny, Baleno, Ignis, etc.)",
  "typeMoteur": "type de moteur (si visible)",
  "annee": "année de fabrication (4 chiffres)"
}

RÈGLES STRICTES:
- MARQUE: doit contenir "SUZUKI". Si autre marque détectée, retourne {"error":"invalid_brand"}.
- MODÈLE: TOUJOURS retourner le nom COMPLET du modèle. NE JAMAIS tronquer. Exemples valides:
  * S-Presso (PAS "S-")
  * Swift Sport (PAS "Swift S")
  * Vitara GLX (retourne "Vitara GLX" complet)
- IMMATRICULATION: 
  * Accepte les formats tunisiens (ex: "243 تونس 4698")
  * Accepte les formats français (ex: "AA-123-BB")
  * PRÉSERVE les espaces et caractères arabes/latins
  * NE JAMAIS retourner un VIN (17 caractères). Si détecté, laisse null.
- ANNÉE: extrais 4 chiffres plausibles (2000..2026). Si illisible, laisse null.
- JSON: Assure-toi que le JSON est COMPLET avec toutes les accolades fermées.
- Réponds STRICTEMENT avec le JSON complet, sans commentaire, sans markdown, sans texte en plus.`;
```

### Fix 3: Better Error Messages in Gemini Service
**File**: `suzuki-backend/src/chat/gemini.service.ts`

Update error handling (Lines 93-136):

```typescript
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  this.logger.error('❌ No JSON found in Gemini response');
  this.logger.error(`Full response: ${text.substring(0, 500)}`);
  throw new Error('OCR_FAILED');
}

let parsed;
try {
  parsed = JSON.parse(jsonMatch[0]);
} catch (parseError) {
  this.logger.warn('⚠️ Incomplete JSON detected, attempting to fix...');
  let fixedJson = jsonMatch[0];
  
  // Count open/close braces
  const openBraces = (fixedJson.match(/\{/g) || []).length;
  const closeBraces = (fixedJson.match(/\}/g) || []).length;
  
  if (openBraces > closeBraces) {
    fixedJson = fixedJson + '}'.repeat(openBraces - closeBraces);
  }
  
  // Remove incomplete last field
  fixedJson = fixedJson.replace(/,\s*"[^"]*":\s*"[^"]*$/g, '');
  fixedJson = fixedJson.replace(/\}*$/, '}');
  
  this.logger.log(`🔧 Attempting to fix: ${fixedJson}`);
  
  try {
    parsed = JSON.parse(fixedJson);
    this.logger.log('✅ Successfully parsed fixed JSON');
  } catch (finalError) {
    this.logger.error('❌ Cannot parse JSON after fix attempt');
    this.logger.error(`Original: ${jsonMatch[0]}`);
    this.logger.error(`Fixed attempt: ${fixedJson}`);
    throw new Error('OCR_FAILED');
  }
}
```

### Fix 4: Align Frontend/Backend File Types
**File**: `chatboat/src/components/ChatWidget.jsx`

Remove DOC/DOCX support (Lines 95-99):

```javascript
const validTypes = [
  'image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif',
  'image/bmp', 'image/tiff', 'image/svg+xml',
  'application/pdf'
  // REMOVED: DOC/DOCX (not supported by backend OCR)
];
```

Update error message (Line 101):
```javascript
setVerificationError('Format non supporté. Utilisez PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG ou PDF.');
```

### Fix 5: Add Better Logging for Debugging
**File**: `suzuki-backend/src/chat/gemini.service.ts`

Add after Line 84 (before API call):

```typescript
this.logger.log(`📷 Processing OCR for ${detectedMimeType}`);
this.logger.log(`📦 Image size: ${(base64Data.length / 1024).toFixed(2)}KB`);
```

Add after Line 91 (after API response):

```typescript
this.logger.log(`🤖 Gemini raw response: ${text}`);
this.logger.log(`📏 Response length: ${text.length} characters`);
```

---

## 🧪 Testing Checklist

After implementing fixes, test with:

1. **Tunisian Carte Grise** (with Arabic text)
   - Upload: `243 تونس 4698`
   - Expected: Full immatriculation preserved
   
2. **All Suzuki Models** - Ensure complete model names:
   - S-Presso (NOT "S-")
   - Swift Sport (NOT "Swift S")
   - Vitara GLX (complete name)
   
3. **Edge Cases**:
   - Very small images (< 10KB)
   - Large images (> 15MB)
   - Blurry/poor quality scans
   - Non-Suzuki brands (should reject)
   
4. **API Response**:
   ```bash
   # Test backend directly
   curl -X POST http://localhost:8000/verification/upload \
     -F "file=@carte_grise.jpg"
   ```

---

## 📊 Current Flow

```
User uploads carte grise (Frontend)
   ↓
ChatWidget.jsx validates file type/size
   ↓
POST /verification/upload (verification.controller.ts)
   ↓
verification.service.ts processes upload
   ↓
gemini.service.ts extracts vehicle info via Gemini 2.5-flash
   ↓ 
Uses OCR_SYSTEM_PROMPT from prompt-templates.ts
   ↓
Returns JSON with vehicle data
   ↓
Frontend displays vehicle info card
```

---

## 🚨 Root Cause Summary

1. **Gemini `maxOutputTokens: 1024`** - Too low, causes truncation
2. **OCR Prompt** - Doesn't emphasize completing full model names
3. **Arabic/Tunisian handling** - Not explicitly mentioned in prompt
4. **Inconsistent file type validation** - Frontend accepts DOC/DOCX, backend doesn't

---

## ⚡ Quick Implementation Priority

1. **HIGH**: Increase `maxOutputTokens` to 2048 (gemini.service.ts)
2. **HIGH**: Update OCR_SYSTEM_PROMPT to emphasize complete JSON (prompt-templates.ts)
3. **MEDIUM**: Remove DOC/DOCX from frontend validation (ChatWidget.jsx)
4. **LOW**: Improve error logging (gemini.service.ts)

---

## 📝 Additional Recommendations

1. **Add retry logic**: If first OCR attempt fails, retry with higher temperature
2. **Fallback to OpenAI**: If Gemini fails, use OpenAI Vision API (already in code but not wired)
3. **Add validation**: Check if `modele` is in known Suzuki models list after extraction
4. **Monitor uploads**: Track incomplete JSON responses in database for analysis

---

## 🔗 Related Files Reference

- Backend verification: `suzuki-backend/src/verification/`
- Gemini service: `suzuki-backend/src/chat/gemini.service.ts`
- Prompts: `suzuki-backend/src/chat/prompt-templates.ts`
- Frontend upload: `chatboat/src/components/ChatWidget.jsx`
- Vehicle models: `suzuki-backend/src/constants/vehicle-models.ts`

---

**Last Updated**: $(date)
**Status**: Issues identified, fixes ready to implement
