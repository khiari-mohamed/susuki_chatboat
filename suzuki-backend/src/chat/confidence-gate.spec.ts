import { describe, expect, it } from '@jest/globals';
import { evaluateResponseConfidence } from './confidence-gate';

const validInput = {
  vehicle: { vin: 'VIN123', modele: 'SWIFT', typeCode: 'T1' },
  vehicleModelResolved: true,
  selectedProduct: {},
  understandingConfidence: 0.9,
  unresolvedClarification: false,
};

describe('evaluateResponseConfidence', () => {
  it('is secure when all conditions hold', () => {
    expect(evaluateResponseConfidence(validInput)).toEqual({ secure: true, reasons: [] });
  });

  it('flags a VIN with no resolved model or type code', () => {
    const result = evaluateResponseConfidence({
      ...validInput,
      vehicle: { vin: 'VIN123', modele: null, typeCode: null },
    });
    expect(result.reasons).toContain('model-code-missing');
  });

  it('flags an unresolved vehicle model', () => {
    expect(evaluateResponseConfidence({ ...validInput, vehicleModelResolved: false }).reasons)
      .toContain('compatibility-not-verified');
  });

  it('flags low, non-finite, and out-of-range understanding confidence', () => {
    for (const confidence of [0.5, NaN, 1.2]) {
      expect(evaluateResponseConfidence({ ...validInput, understandingConfidence: confidence }).reasons)
        .toContain('understanding-low-confidence');
    }
  });

  it('flags unresolved clarification and a deterministic no-exact-position match', () => {
    const result = evaluateResponseConfidence({
      ...validInput,
      unresolvedClarification: true,
      constraintOutcome: { applied: true, noExactMatch: true } as any,
    });
    expect(result.reasons).toEqual(expect.arrayContaining([
      'clarification-unresolved',
      'position-not-confirmed',
    ]));
  });
});
