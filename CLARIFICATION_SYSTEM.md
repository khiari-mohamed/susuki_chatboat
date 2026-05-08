# Deterministic Clarification System

## Overview
The system now uses **rule-based deterministic logic** to know exactly which parts need clarification questions and in what order.

## How It Works

### 3 Categories of Parts:

#### 1️⃣ Parts Needing ONLY Position (1 question)
- **Parts**: amortisseur, plaquette, disque, frein, pare-choc, rotule, biellette
- **Question**: "Avant ou Arrière?"
- **Example Flow**:
  ```
  User: "amortisseur"
  Bot: "Avant ou Arrière?"
  User: "avant"
  Bot: Shows AMORTISSEUR AV G ✅
  ```

#### 2️⃣ Parts Needing Position THEN Side (2 questions)
- **Parts**: phare, feu, clignotant, optique
- **Question 1**: "Avant ou Arrière?"
- **Question 2**: "Gauche ou Droite?"
- **Example Flow**:
  ```
  User: "phare"
  Bot: "Avant ou Arrière?"
  User: "avant"
  Bot: "Gauche ou Droite?"
  User: "gauche"
  Bot: Shows PHARE AVANT GAUCHE ✅
  ```

#### 3️⃣ Parts Needing ONLY Side (1 question)
- **Parts**: retroviseur, aile, porte, vitre, poignée
- **Question**: "Gauche ou Droite?"
- **Example Flow**:
  ```
  User: "retroviseur"
  Bot: "Gauche ou Droite?"
  User: "gauche"
  Bot: Shows RETROVISEUR G ✅
  ```

#### 4️⃣ Parts Needing NO Clarification (0 questions)
- **Parts**: batterie, radiateur, alternateur, filtre, pompe, courroie, bougie
- **Example Flow**:
  ```
  User: "batterie"
  Bot: Shows BATTERIE L2 ✅
  ```

## Configuration File

All rules are defined in: `src/constants/part-clarification-rules.ts`

```typescript
export const CLARIFICATION_RULES: ClarificationRule[] = [
  {
    partNames: ['phare', 'feu', 'clignotant'],
    needsPosition: true,
    needsSide: true,
    order: 'position-first', // Ask position first, then side
  },
  {
    partNames: ['amortisseur', 'plaquette', 'disque'],
    needsPosition: true,
    needsSide: false,
    order: 'position-first', // Only ask position
  },
  // ... more rules
];
```

## Benefits

✅ **Deterministic**: Same input always produces same output
✅ **Predictable**: Easy to understand and test
✅ **Maintainable**: Add new parts by updating the config file
✅ **Efficient**: Asks minimum questions needed
✅ **User-friendly**: Logical question order (position before side)

## Testing

Run tests with:
```bash
npx ts-node test-clarification-rules.ts
```

All 11 test cases pass ✅

## Adding New Parts

To add a new part, edit `src/constants/part-clarification-rules.ts`:

```typescript
{
  partNames: ['new-part-name'],
  needsPosition: true,  // Does it need avant/arrière?
  needsSide: true,      // Does it need gauche/droite?
  order: 'position-first', // Which to ask first?
}
```

## Edge Cases Handled

- ✅ User provides both position and side in one message: "phare avant gauche" → No questions
- ✅ User provides position first: "phare avant" → Only asks for side
- ✅ User provides side first: "phare gauche" → Asks for position (if needed)
- ✅ Part doesn't exist in rules → Falls back to data-driven approach
