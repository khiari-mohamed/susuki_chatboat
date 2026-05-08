# Main Part vs Accessory Filtering - Deterministic Solution

## 🎯 Problem Statement

**Business Rule Violation**: When user asks for a main part (e.g., "radiateur"), the system was returning accessories (e.g., "DURITE DE RADIATEUR" - radiator hose).

### Example of the Issue:
```
User: "radiateur"
System: ❌ "DURITE DE RADIATEUR" (WRONG - this is a hose, not a radiator)
Expected: ✅ "RADIATEUR" (CORRECT - the actual radiator)
```

## 🔍 Root Cause

The accessory detection logic in `advanced-search.service.ts` was checking:
- ✅ IF user asks for accessory → return accessories
- ❌ BUT NOT: IF user asks for main part → REJECT accessories

This allowed accessories to leak into main part searches.

## ✅ Solution: Deterministic 3-Rule System

### Rule 1: User asks for accessory → ONLY return accessories
```typescript
if (userAskedForAccessory && hasAccessoryWord) {
  score += SCORE_EXACT_FULL;  // Boost accessories
} else if (userAskedForAccessory && !hasAccessoryWord) {
  return SCORE_REJECTION;  // Reject non-accessories
}
```

### Rule 2: User asks for main part → REJECT accessories
```typescript
if (userAskedForMainPart && hasAccessoryWord && !hasMainPartWord) {
  return SCORE_REJECTION;  // Reject pure accessories
}
```

### Rule 3: User asks for main part → ONLY return main parts
```typescript
if (userAskedForMainPart && !hasAccessoryWord && hasMainPartWord) {
  score += SCORE_MAIN_TYPE_PRESENT;  // Boost main parts
}
```

## 📋 Word Classifications

### Accessory Words (23 total):
```typescript
['sangle', 'support', 'causse', 'clip', 'jeu', 'kit', 'ensemble', 'set', 
 'boitier', 'cache', 'couvercle', 'durite', 'tuyau', 'flexible', 'cable', 
 'câble', 'joint', 'bouchon', 'vis', 'boulon', 'ecrou', 'agrafe', 'agraffe']
```

### Main Part Words (22 total):
```typescript
['radiateur', 'moteur', 'alternateur', 'demarreur', 'batterie', 'phare', 
 'feu', 'porte', 'capot', 'aile', 'retroviseur', 'amortisseur', 'disque', 
 'plaquette', 'filtre', 'pompe', 'compresseur', 'etrier', 'tambour', 
 'volant', 'siege', 'tableau']
```

## 🧪 Test Coverage

### Test Cases (9 scenarios):
1. ✅ "radiateur" → Returns RADIATEUR (rejects DURITE)
2. ✅ "durite de radiateur" → Returns DURITE DE RADIATEUR
3. ✅ "support de radiateur" → Returns SUPPORT DE RADIATEUR
4. ✅ "batterie" → Returns BATTERIE (rejects CABLE)
5. ✅ "cable de batterie" → Returns CABLE DE BATTERIE
6. ✅ "phare" → Returns PHARE (rejects SUPPORT)
7. ✅ "support de phare" → Returns SUPPORT DE PHARE
8. ✅ "alternateur" → Returns ALTERNATEUR (rejects KIT)
9. ✅ "kit alternateur" → Returns KIT ALTERNATEUR

## 🎯 Expected Behavior

| User Query | Expected Result | Rejected Results |
|------------|----------------|------------------|
| radiateur | RADIATEUR | DURITE, TUYAU, SUPPORT |
| durite radiateur | DURITE DE RADIATEUR | - |
| batterie | BATTERIE | CABLE, SUPPORT, KIT |
| cable batterie | CABLE DE BATTERIE | - |
| phare | PHARE | SUPPORT, CACHE, JOINT |
| support phare | SUPPORT DE PHARE | - |

## 🚀 Benefits

1. **Deterministic**: Same query = same result type (main vs accessory)
2. **Business-aligned**: Respects the main part vs accessory distinction
3. **User-friendly**: Users get what they actually asked for
4. **Scalable**: Easy to add new main parts or accessories to the lists

## 📝 Implementation Details

**File**: `src/chat/advanced-search.service.ts`  
**Method**: `calculateContentMatches()`  
**Lines**: ~450-475 (in the content matching section)

The fix is applied BEFORE the main scoring logic, ensuring that:
- Accessories are rejected early when user asks for main parts
- Main parts are rejected early when user asks for accessories
- Mixed parts (e.g., "RADIATEUR SUPPORT") are handled correctly

## ✅ Testing

Run the test suite:
```bash
npx ts-node test-main-vs-accessory.ts
```

Expected output:
```
🎉 ALL TESTS PASSED! Main/Accessory filtering is working perfectly! 🚀
```

## 🔄 Future Enhancements

1. **Dynamic word lists**: Load from database instead of hardcoded
2. **ML-based classification**: Use AI to classify parts automatically
3. **User feedback**: Learn from user corrections
4. **Synonym expansion**: Handle variations (e.g., "tuyau" = "durite")
