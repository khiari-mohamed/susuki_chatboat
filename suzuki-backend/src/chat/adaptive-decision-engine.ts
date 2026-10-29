import type { ConstraintOutcome } from './part-constraints';
import type { AiFlag, AiFlagType, CheckStatus } from './catalog-verifier';

/** Kept as an alias so existing imports keep compiling. */
export type DeterministicCheckStatus = CheckStatus;

export interface DeterministicChecks {
  identity: CheckStatus;
  position: CheckStatus;
  qualifiers: CheckStatus;
  vehicle: CheckStatus;
  stockPrice: CheckStatus;
}

export interface AdaptiveInterpretation {
  normalized: string;
  intent: string;
  catalogPart?: string | null;
  positions?: { axes?: string[]; sides?: string[]; levels?: string[] };
  qualifiers?: string[];
  confidence: number;
  uncertainty: number;
  isGreeting?: boolean;
  isThanks?: boolean;
  source?: 'ai' | 'deterministic';
}

export interface AdaptiveDecisionInput {
  query: string;
  /** Set to false for exact reference lookups (no natural-language understanding involved). */
  requireUnderstanding?: boolean;
  /** Low understanding may proceed to the AI judge instead of being withheld outright. */
  allowLowUnderstandingToJudge?: boolean;
  /** false = the judge was needed but could not run (outage / circuit breaker open). */
  aiJudgeAvailable?: boolean;
  /**
   * Business rule (CarPro 2026-09-18): no availability without a confirmed
   * Article/Vehicle compatibility. When true, a selected product with no
   * vehicle in scope is withheld. Pass true for every part-search flow;
   * leave false only for exact reference lookups.
   */
  requireVehicleScope?: boolean;
  vehicle?: Record<string, any> | null;
  selectedProduct?: { reference?: string | null } | null;
  interpretation?: AdaptiveInterpretation | null;
  /** True when the DB resolved at least one compatible type code for the vehicle. */
  vehicleModelResolved: boolean;
  deterministicChecks: DeterministicChecks;
  aiFlags: AiFlag[];
  constraintOutcome?: ConstraintOutcome | null;
  unresolvedClarification?: boolean;
}

export interface AdaptiveDecisionResult {
  allowed: boolean;
  reasons: string[];
  /** Mirrors `allowed`; kept for existing callers. */
  secure: boolean;
  aiFlags: { effective: AiFlag[]; ignored: AiFlag[] };
}

/**
 * Single owner of the final "may we answer with this product?" decision.
 *
 * Principles
 *  - The database (deterministic checks) is the source of truth. A `failed`
 *    check always blocks; a `confirmed` check can never be overridden by AI.
 *  - The AI judge is advisory and can only make the decision stricter:
 *    `unverifiable` identity/position/qualifiers always block, and judge
 *    flags matter where the database has nothing to check against.
 *  - Missing evidence never becomes a guess: the caller redirects to the
 *    Comptoir Pièces de Rechange.
 */
export class AdaptiveDecisionEngine {
  private readonly minUnderstandingConfidence = 0.6;

  private readonly flagChecks: Readonly<Partial<Record<AiFlagType, keyof DeterministicChecks>>> = {
    PART_IDENTITY: 'identity',
    POSITION: 'position',
    QUALIFIER: 'qualifiers',
    VEHICLE: 'vehicle',
    PRICE_STOCK: 'stockPrice',
  };

  /** Checks about *what the part is*, where the AI judge is the only second opinion. */
  private readonly semanticChecks: ReadonlyArray<keyof DeterministicChecks> = [
    'identity',
    'position',
    'qualifiers',
  ];

  evaluate(input: AdaptiveDecisionInput): AdaptiveDecisionResult {
    const reasons: string[] = [];
    const product = input.selectedProduct ?? null;

    this.evaluateVehicleScope(input, reasons);
    this.evaluateUnderstanding(input, reasons);

    if (input.unresolvedClarification) {
      reasons.push('clarification unresolved');
    }

    if (product && input.constraintOutcome?.applied && input.constraintOutcome.noExactMatch) {
      reasons.push('position or identity not confirmed by deterministic gate');
    }

    for (const [name, status] of Object.entries(input.deterministicChecks)) {
      if (status === 'failed') reasons.push(`deterministic check ${name} failed`);
    }

    // CarPro rule: no guessing. A semantic check the catalog could not confirm
    // blocks the answer, whether or not the AI judge ran or found nothing.
    // The judge can only add blocks, it never rescues an unverified check.
    if (product) {
      for (const name of this.semanticChecks) {
        if (input.deterministicChecks[name] !== 'unverifiable') continue;
        reasons.push(`${name} unverified by the catalog: redirect instead of guessing`);
      }
    }

    const aiFlags = this.classifyAiFlags(input);
    for (const flag of aiFlags.effective) {
      const ref = flag.reference ? ` (${flag.reference})` : '';
      reasons.push(`AI ${flag.type}${ref}: ${flag.detail ?? 'possible inconsistency'}`);
    }

    const allowed = reasons.length === 0;
    return { allowed, secure: allowed, reasons, aiFlags };
  }

  private evaluateVehicleScope(input: AdaptiveDecisionInput, reasons: string[]): void {
    const { vehicle } = input;
    const product = input.selectedProduct ?? null;
    const hasVin = !!(
      vehicle?.vin || vehicle?.VIN || vehicle?.numeroChassis || vehicle?.numChassis || vehicle?.chassis
    );
    const hasVehicleIdentifier = !!(
      hasVin || vehicle?.vehicleNo || vehicle?.vehicle_no || vehicle?.numeroVehicule ||
      vehicle?.modele || vehicle?.model || vehicle?.typeCode || vehicle?.type_code || vehicle?.type
    );

    if (!vehicle) {
      if (input.requireVehicleScope && product) {
        reasons.push('vehicle scope missing: compatibility cannot be confirmed');
      }
      return;
    }

    if (input.requireVehicleScope && product && !hasVehicleIdentifier) {
      reasons.push('vehicle scope missing: compatibility cannot be confirmed');
      return;
    }

    if (!input.vehicleModelResolved) {
      const hasTypeCode = !!(vehicle.typeCode || vehicle.type_code || vehicle.type);
      if (hasVin && !hasTypeCode) {
        reasons.push('model code missing for VIN-scoped request');
      } else if (product) {
        reasons.push('vehicle compatibility not verified');
      }
      return;
    }

    // Vehicle is resolved, but the catalog holds no fitment evidence for this article.
    if (product && input.deterministicChecks.vehicle === 'unverifiable') {
      reasons.push('vehicle compatibility unverifiable: no fitment evidence for this article');
    }
  }

  private evaluateUnderstanding(input: AdaptiveDecisionInput, reasons: string[]): void {
    if (!(input.requireUnderstanding ?? true)) return;

    const confidence = input.interpretation?.confidence;
    const isLow = !Number.isFinite(confidence ?? Number.NaN) || (confidence ?? 0) < this.minUnderstandingConfidence;
    if (!isLow) return;

    const checks = input.deterministicChecks;
    const settled = (status: CheckStatus) => status === 'confirmed' || status === 'not-applicable';
    const databaseResolvedRequest = !!input.selectedProduct &&
      checks.identity === 'confirmed' &&
      settled(checks.position) &&
      settled(checks.qualifiers) &&
      (input.requireVehicleScope
        ? checks.vehicle === 'confirmed'
        : settled(checks.vehicle));
    if (databaseResolvedRequest) return;

    const judgeCanTakeOver = !!input.allowLowUnderstandingToJudge && input.aiJudgeAvailable !== false;
    if (!judgeCanTakeOver) {
      reasons.push(`understanding confidence below ${this.minUnderstandingConfidence}`);
    }
  }

  private classifyAiFlags(input: AdaptiveDecisionInput): { effective: AiFlag[]; ignored: AiFlag[] } {
    const effective: AiFlag[] = [];
    const ignored: AiFlag[] = [];
    const shownReference = input.selectedProduct?.reference?.trim().toUpperCase();

    for (const flag of input.aiFlags ?? []) {
      const checkName = this.flagChecks[flag.type];
      const targetsShownProduct = !flag.reference || flag.reference.trim().toUpperCase() === shownReference;
      if (!checkName || !targetsShownProduct) {
        ignored.push(flag);
        continue;
      }

      const status = input.deterministicChecks[checkName];
      const isSemantic = this.semanticChecks.includes(checkName);
      // A flag matters only where the database could not settle the question.
      const open = status === 'unverifiable' || (status === 'not-applicable' && isSemantic);
      (open ? effective : ignored).push(flag);
    }
    return { effective, ignored };
  }
}