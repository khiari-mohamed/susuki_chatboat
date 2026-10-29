import { describe, expect, it } from '@jest/globals';
import type { ConstraintOutcome } from './part-constraints';
import {
  AdaptiveDecisionEngine,
  type AdaptiveDecisionInput,
  type DeterministicChecks,
} from './adaptive-decision-engine';

const CONFIRMED: DeterministicChecks = {
  identity: 'confirmed',
  position: 'confirmed',
  qualifiers: 'not-applicable',
  vehicle: 'confirmed',
  stockPrice: 'confirmed',
};

function makeInput(overrides: Partial<AdaptiveDecisionInput> = {}): AdaptiveDecisionInput {
  return {
    query: 'retroviseur droit',
    vehicle: { marque: 'SUZUKI', modele: 'CELERIO', typeCode: 'T1' },
    selectedProduct: { reference: 'REF-1' },
    interpretation: {
      normalized: 'retroviseur droit',
      intent: 'SEARCH',
      catalogPart: 'retroviseur',
      positions: { axes: [], sides: ['D'], levels: [] },
      qualifiers: [],
      confidence: 0.9,
      uncertainty: 0.1,
      isGreeting: false,
      isThanks: false,
      source: 'deterministic',
    },
    vehicleModelResolved: true,
    deterministicChecks: { ...CONFIRMED },
    aiFlags: [],
    constraintOutcome: null,
    unresolvedClarification: false,
    ...overrides,
  };
}

function withChecks(checks: Partial<DeterministicChecks>, overrides: Partial<AdaptiveDecisionInput> = {}) {
  return makeInput({ deterministicChecks: { ...CONFIRMED, ...checks }, ...overrides });
}

const engine = new AdaptiveDecisionEngine();

describe('AdaptiveDecisionEngine', () => {
  describe('acceptance', () => {
    it('accepts a DB-verified product when confidence and AI flags are clean', () => {
      const decision = engine.evaluate(makeInput());
      expect(decision.allowed).toBe(true);
      expect(decision.secure).toBe(true);
      expect(decision.reasons).toEqual([]);
    });

    it('accepts a VIN-scoped request once the model code is resolved', () => {
      const decision = engine.evaluate(makeInput({ vehicle: { marque: 'SUZUKI', vin: 'VIN-1' } }));
      expect(decision.allowed).toBe(true);
    });
  });

  describe('vehicle scope', () => {
    it('withholds a VIN-scoped request when no model code can be resolved', () => {
      const decision = engine.evaluate(
        makeInput({ vehicle: { marque: 'SUZUKI', vin: 'VIN-1' }, vehicleModelResolved: false }),
      );
      expect(decision.allowed).toBe(false);
      expect(decision.reasons).toContain('model code missing for VIN-scoped request');
    });

    it('withholds a product when the vehicle compatibility was not resolved', () => {
      const decision = engine.evaluate(makeInput({ vehicleModelResolved: false }));
      expect(decision.allowed).toBe(false);
      expect(decision.reasons).toContain('vehicle compatibility not verified');
    });

    it('withholds when the catalog has no fitment evidence for the article', () => {
      const decision = engine.evaluate(withChecks({ vehicle: 'unverifiable' }));
      expect(decision.allowed).toBe(false);
      expect(decision.reasons.some((r) => r.includes('no fitment evidence'))).toBe(true);
    });

    it('requires a vehicle scope only when asked to', () => {
      expect(engine.evaluate(makeInput({ vehicle: null })).allowed).toBe(true);
      const strict = engine.evaluate(makeInput({ vehicle: null, requireVehicleScope: true }));
      expect(strict.allowed).toBe(false);
      expect(strict.reasons.some((r) => r.includes('vehicle scope missing'))).toBe(true);

      const incompleteVehicle = engine.evaluate(
        makeInput({ vehicle: { marque: 'SUZUKI' }, requireVehicleScope: true }),
      );
      expect(incompleteVehicle.allowed).toBe(false);
      expect(incompleteVehicle.reasons.some((r) => r.includes('vehicle scope missing'))).toBe(true);
    });
  });

  describe('understanding', () => {
    const lowConfidence = () =>
      makeInput({
        interpretation: { ...makeInput().interpretation!, confidence: 0.3, uncertainty: 0.7 },
      });

    it('allows low model confidence when the selected catalog row settles the request', () => {
      expect(engine.evaluate(lowConfidence()).allowed).toBe(true);
    });

    it('rejects low confidence when deterministic identity is unresolved', () => {
      const decision = engine.evaluate(withChecks(
        { identity: 'unverifiable' },
        { interpretation: { ...makeInput().interpretation!, confidence: 0.3, uncertainty: 0.7 } },
      ));
      expect(decision.allowed).toBe(false);
      expect(decision.reasons.some((r) => r.includes('understanding'))).toBe(true);
    });

    it('low understanding always redirects regardless of judge availability', () => {
      const unresolved = withChecks(
        { identity: 'unverifiable' },
        { interpretation: { ...makeInput().interpretation!, confidence: 0.3, uncertainty: 0.7 } },
      );
      const judged = engine.evaluate({ ...unresolved, allowLowUnderstandingToJudge: false, aiJudgeAvailable: true });
      expect(judged.allowed).toBe(false);

      const unavailable = engine.evaluate({ ...unresolved, allowLowUnderstandingToJudge: false, aiJudgeAvailable: false });
      expect(unavailable.allowed).toBe(false);
    });

    it('treats a missing interpretation as low understanding', () => {
      expect(engine.evaluate(withChecks({ identity: 'unverifiable' }, { interpretation: null })).allowed).toBe(false);
    });

    it('skips the understanding gate for exact reference lookups', () => {
      const decision = engine.evaluate({ ...lowConfidence(), requireUnderstanding: false });
      expect(decision.allowed).toBe(true);
    });
  });

  describe('deterministic checks', () => {
    it('always blocks on a failed deterministic check', () => {
      const decision = engine.evaluate(withChecks({ position: 'failed' }));
      expect(decision.allowed).toBe(false);
      expect(decision.reasons).toContain('deterministic check position failed');
    });

    it('blocks when the constraint gate found related parts but no exact match', () => {
      const outcome: ConstraintOutcome = {
        applied: true,
        requestedPart: 'pare choc',
        requestedPositions: { axes: ['AV'], sides: [], levels: [] },
        identityMode: 'strict-head',
        candidatesBefore: 3,
        rejectedByIdentity: 1,
        rejectedByPosition: 2,
        kept: 0,
        availablePositions: ['AR'],
        noExactMatch: true,
      };
      const decision = engine.evaluate(makeInput({ constraintOutcome: outcome }));
      expect(decision.allowed).toBe(false);
    });

    it('blocks while a clarification is unresolved', () => {
      expect(engine.evaluate(makeInput({ unresolvedClarification: true })).allowed).toBe(false);
    });
  });

  describe('AI judge flags', () => {
    it('blocks when the judge flags something the database could not verify', () => {
      const decision = engine.evaluate(
        withChecks({ identity: 'unverifiable' }, {
          aiFlags: [{ type: 'PART_IDENTITY', reference: 'REF-1', detail: 'possible mismatch' }],
        }),
      );
      expect(decision.allowed).toBe(false);
      expect(decision.aiFlags.effective).toHaveLength(1);
      expect(decision.reasons.some((r) => r.includes('AI PART_IDENTITY'))).toBe(true);
    });

    it('ignores a flag the database has already confirmed', () => {
      const decision = engine.evaluate(
        makeInput({ aiFlags: [{ type: 'PART_IDENTITY', reference: 'REF-1', detail: 'possible mismatch' }] }),
      );
      expect(decision.allowed).toBe(true);
      expect(decision.aiFlags.ignored).toHaveLength(1);
      expect(decision.aiFlags.effective).toHaveLength(0);
    });

    it('keeps a semantic flag effective when the database has nothing to check against', () => {
      const decision = engine.evaluate(
        withChecks({ identity: 'not-applicable' }, { aiFlags: [{ type: 'PART_IDENTITY', detail: 'wrong family' }] }),
      );
      expect(decision.allowed).toBe(false);
    });

    it('ignores flags about another reference, OTHER flags and settled non-semantic checks', () => {
      const decision = engine.evaluate(
        withChecks({ identity: 'unverifiable', stockPrice: 'not-applicable' }, {
          aiFlags: [
            { type: 'PART_IDENTITY', reference: 'REF-2', detail: 'other product' },
            { type: 'OTHER', detail: 'noise' },
            { type: 'PRICE_STOCK', detail: 'irrelevant here' },
          ],
        }),
      );
      expect(decision.aiFlags.effective).toHaveLength(0);
      expect(decision.aiFlags.ignored).toHaveLength(3);
    });
  });

  describe('unverifiable semantic checks block by default', () => {
    it.each(['identity', 'position', 'qualifiers'] as const)(
      'withholds when %s is unverifiable, whatever the AI judge says',
      (check) => {
        const input = withChecks({ [check]: 'unverifiable' });
        expect(engine.evaluate(input).allowed).toBe(false);
        expect(engine.evaluate({ ...input, aiJudgeAvailable: true }).allowed).toBe(false);
        expect(engine.evaluate({ ...input, aiJudgeAvailable: false }).allowed).toBe(false);
        expect(engine.evaluate(input).reasons.some((r) => r.includes('unverified by the catalog'))).toBe(true);
      },
    );

    it('does not block on an unverifiable stockPrice check alone', () => {
      expect(engine.evaluate(withChecks({ stockPrice: 'unverifiable' })).allowed).toBe(true);
    });
  });
});