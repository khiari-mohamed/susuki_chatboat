# Backend Migration Guide - Use mart.chatbot_parts_with_fitment

## ✅ Completed
- [x] Database: mart.chatbot_parts_with_fitment view created
- [x] Fitment: 10,504 items with model relations
- [x] vehicle-models.ts: Added normalizeModel() and detectModelInText()

---

## 📝 Changes Needed

### **File 1: advanced-search.service.ts** ✅ CRITICAL

#### **Change 1: Add Prisma import at top**
```typescript
import { Prisma } from '@prisma/client';
```

#### **Change 2: Add helper method (add after constructor)**
```typescript
private async queryPartsByTerms(terms: string[], vehicleModel?: string): Promise<any[]> {
  if (!terms.length) return [];
  const likeTerms = terms.map(t => `%${t}%`);
  const model = vehicleModel ? vehicleModel.toUpperCase() : null;

  const termSql = Prisma.join(
    likeTerms.map(t => Prisma.sql`(designation ILIKE ${t} OR reference ILIKE ${t})`),
    Prisma.sql` OR `
  );

  const modelSql = model
    ? Prisma.sql`AND (model_code = ${model} OR match_rule = 'unknown_model')`
    : Prisma.sql``;

  return this.prisma.$queryRaw<any[]>`
    SELECT id, reference, designation, "prixHt", stock, model_code, match_rule, confidence
    FROM mart.chatbot_parts_with_fitment
    WHERE ${termSql}
    ${modelSql}
    LIMIT 500
  `;
}

private getSearchTerms(rawTokens: string[], expandedTerms: string[]): string[] {
  const positionWords = ['avant', 'arriere', 'gauche', 'droite', 'av', 'ar', 'g', 'd', 'sup', 'inf'];
  return expandedTerms.filter(t => t.length >= 3 && !positionWords.includes(t));
}
```

#### **Change 3: Replace searchParts() database query**

**FIND THIS BLOCK (around line 350-380):**
```typescript
const parts = await this.prisma.piecesRechange.findMany({
  where: whereCondition,
  take: 500
});
```

**REPLACE WITH:**
```typescript
const terms = this.getSearchTerms(rawTokens, expandedTerms);
const parts = await this.queryPartsByTerms(terms, vehicle?.modele);
```

**ALSO REMOVE** the `whereCondition` and `searchConditions` building code above it (lines that build `whereCondition` using `buildSearchConditions`).

#### **Change 4: Update searchByReference() method**

**FIND THIS BLOCK (around line 800-820):**
```typescript
let results = await this.prisma.piecesRechange.findMany({
  where: {
    OR: [
      { reference: { equals: originalRef, mode: 'insensitive' } },
      { reference: { equals: cleanRef, mode: 'insensitive' } }
    ]
  },
  take: 5
});
```

**REPLACE WITH:**
```typescript
let results = await this.prisma.$queryRaw<any[]>`
  SELECT id, reference, designation, "prixHt", stock, model_code, match_rule, confidence
  FROM mart.chatbot_parts_with_fitment
  WHERE reference ILIKE ${originalRef} OR reference ILIKE ${cleanRef}
  ${vehicle?.modele ? Prisma.sql`AND (model_code = ${vehicle.modele.toUpperCase()} OR match_rule = 'unknown_model')` : Prisma.sql``}
  LIMIT 5
`;
```

**FIND THIS BLOCK (partial match, around line 830-850):**
```typescript
results = await this.prisma.piecesRechange.findMany({
  where: partialWhere,
  take: 10
});
```

**REPLACE WITH:**
```typescript
const modelFilter = vehicle?.modele 
  ? Prisma.sql`AND (model_code = ${vehicle.modele.toUpperCase()} OR match_rule = 'unknown_model')`
  : Prisma.sql``;

results = await this.prisma.$queryRaw<any[]>`
  SELECT id, reference, designation, "prixHt", stock, model_code, match_rule, confidence
  FROM mart.chatbot_parts_with_fitment
  WHERE reference ILIKE ${'%' + cleanRef + '%'} OR reference ILIKE ${'%' + originalRef + '%'}
  ${modelFilter}
  LIMIT 10
`;
```

---

### **File 2: chat-orchestrator.service.ts** ✅ CRITICAL

#### **Change 1: Add imports at top**
```typescript
import { normalizeModel, detectModelInText } from '../constants/vehicle-models';
```

#### **Change 2: Add model mismatch detection in processMessage()**

**FIND THIS BLOCK (after normalization, before search, around line 150-200):**
```typescript
// After: const processedMessage = ...
// Before: const searchResults = await this.advancedSearchService.searchParts(...)
```

**ADD THIS CODE:**
```typescript
// Check for model mismatch (user's carte grise vs requested model)
const vehicleModel = normalizeModel(vehicle?.modele);
const requestedModel = detectModelInText(processedMessage);

if (vehicleModel && requestedModel && vehicleModel !== requestedModel) {
  const response = this.responseService.buildModelMismatchResponse(vehicleModel, requestedModel);
  await this.sessionService.saveBotResponse(session.id, response, { intent: 'MODEL_MISMATCH' });
  return {
    response,
    sessionId: session.id,
    products: [],
    confidence: 'HIGH',
    intent: 'MODEL_MISMATCH',
    metadata: { 
      productsFound: 0, 
      conversationLength: conversationHistory.length, 
      queryClarity: 0, 
      userMessageId 
    }
  };
}
```

---

### **File 3: response.service.ts** ✅ REQUIRED

#### **Add method (anywhere in the class):**
```typescript
buildModelMismatchResponse(vehicleModel: string, requestedModel: string): string {
  return `Votre carte grise indique ${vehicleModel}. Vous demandez des pièces pour ${requestedModel}.\n\nJe peux vous aider avec ${vehicleModel}. Voulez-vous changer de modèle ?`;
}
```

---

## 🧪 Testing After Changes

### **Test 1: Basic search**
```
User: "filtre à huile"
Expected: Returns filters (universal parts)
```

### **Test 2: Model-specific search**
```
User uploads CIAZ carte grise
User: "filtre à huile"
Expected: Returns CIAZ filters + universal filters
```

### **Test 3: Cross-model blocking**
```
User uploads CELERIO carte grise
User: "pièces pour CIAZ"
Expected: "Votre carte grise indique CELERIO. Vous demandez des pièces pour CIAZ..."
```

### **Test 4: Reference search**
```
User: "00325"
Expected: Returns exact part
```

---

## ⚠️ Important Notes

1. **prixHt field**: Use double quotes `"prixHt"` in SQL to preserve case
2. **Model filtering**: `match_rule = 'unknown_model'` allows universal parts
3. **Confidence**: Available in results but not used yet (future enhancement)
4. **SUZUKI filter**: Currently not applied (all makes returned). Add if needed:
   ```sql
   AND (make_code = 'SUZUKI' OR make_code IS NULL)
   ```

---

## 🚀 Deployment Checklist

- [ ] Apply all 3 file changes
- [ ] Run `npm run build` to check TypeScript errors
- [ ] Test basic search
- [ ] Test model-specific search
- [ ] Test cross-model blocking
- [ ] Test reference search
- [ ] Monitor logs for errors
- [ ] Check response times (should be similar or faster)

---

## 🔄 Rollback Plan

If issues occur:
1. Revert the 3 files to previous version
2. Chatbot will use old `piecesRechange` table
3. New data pipeline stays intact (no data loss)
4. Fix issues and re-deploy

---

## 📊 Expected Improvements

- ✅ Model-based filtering (CIAZ parts for CIAZ vehicles)
- ✅ Cross-model query blocking (prevents confusion)
- ✅ Better stock accuracy (effective_stock logic)
- ✅ Cleaner data (normalized from BC exports)
- ✅ Scalable (easy to add more models/aliases)
