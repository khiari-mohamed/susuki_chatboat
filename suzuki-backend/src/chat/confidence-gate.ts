// src/chat/confidence-gate.ts
// ═══════════════════════════════════════════════════════════════════
// BUSINESS RULE (email CarPro 2026-09-25, formalizing "sécurisation
// des réponses" first stated 2026-09-18): the bot must NOT present an
// availability/reference answer unless ALL of the following are true
// at once:
//
//   1. Article/Vehicle compatibility is confirmed.
//   2. The model code linked to the VIN is present (when a VIN was
//      used to scope the search at all).
//   3. The client's request was correctly understood and the part
//      correctly identified.
//   4. The identified need, the vehicle, and the proposed reference
//      are all consistent with each other.
//
// If ANY condition fails: no guessing, no auto-completion, no
// approximate reference — redirect to the Comptoir Pièces de Rechange
// instead (ResponseService.SECURISATION_MESSAGE, unchanged).
//
// Before this module, "sécurisation" existed only as wording applied
// on already-empty-result paths (response.service.ts FIX-6, 2026-09-20).
// That covers "no product found" but NOT "a wrong/unconfirmed product
// was about to be shown confidently" — which is exactly what the email
// is describing (compatibility not confirmed, model code missing,
// request misunderstood). This module is the single decision point
// for that broader rule, independent of whether products were found.
//
// Deliberately framework-free (no Nest, no Prisma) — same design as
// part-constraints.ts — so it stays a pure, unit-testable decision
// function that chat-orchestrator.service.ts calls before it commits
// to a confident answer.
// ═══════════════════════════════════════════════════════════════════

import type { ConstraintOutcome } from './part-constraints';

export interface ConfidenceVehicle {
  vin?: string | null;
  modele?: string | null;
  typeCode?: string | null;
}

// Product compatibility is enforced upstream by type code; this gate
// only needs to know whether a product was selected.
export type ConfidenceProduct = object;

export interface ConfidenceInput {
  /** The vehicle context passed with the request, if any (VIN scan or manual entry). */
  vehicle?: ConfidenceVehicle | null;
  /** Did the orchestrator actually have a normalized model to filter fitments by? */
  vehicleModelResolved: boolean;
  /** The product about to be shown to the customer as the answer, if any. */
  selectedProduct?: ConfidenceProduct | null;
  /** AI query-normalizer confidence (0..1) for this turn's understanding of the message. */
  understandingConfidence: number;
  /** A clarification was genuinely needed but the flow proceeded without one being resolved. */
  unresolvedClarification: boolean;
  /** Outcome of the deterministic identity/position gate for this search, if it ran. */
  constraintOutcome?: ConstraintOutcome | null;
}

export type ConfidenceReason =
  | 'model-code-missing'
  | 'compatibility-not-verified'
  | 'understanding-low-confidence'
  | 'clarification-unresolved'
  | 'position-not-confirmed';

export interface ConfidenceResult {
  secure: boolean;
  reasons: ConfidenceReason[];
}

// Below this, the AI normalizer itself is signalling it fell back to a
// non-AI-verified correction (see ai-query-normalizer.service.ts — the
// 0.5-confidence fallback/parse-failure path vs. the normal 0.7-0.9
// range). This is exactly the "bonne compréhension de la demande...
// par l'IA" condition from the email — not a made-up threshold.
export const MIN_UNDERSTANDING_CONFIDENCE = 0.6;

/**
 * The single decision point for "can we confidently answer, or must we
 * redirect to the Comptoir Pièces de Rechange?" — evaluates all 4
 * conditions from the email and returns every reason that failed (for
 * logging/debugging), not just the first one that matched.
 */
export function evaluateResponseConfidence(input: ConfidenceInput): ConfidenceResult {
  const reasons: ConfidenceReason[] = [];

  // ── Condition 2: model code present when a VIN was used at all ────
  // A vehicle with a VIN but no resolved model/type code means the
  // VIN → model link failed for this vehicle — exactly the case named
  // in the email ("la présence du code modèle associé au VIN").
  if (input.vehicle?.vin && !input.vehicle?.modele && !input.vehicle?.typeCode) {
    reasons.push('model-code-missing');
  }

  // ── Condition 1: compatibility confirmed ───────────────────────────
  // NOTE (fixed 2026-09-27 — production incident): this used to also
  // re-check `product.fitments[].modelName` against `vehicle.modele`
  // as a "consistency" check. That was WRONG: real compatibility in
  // this codebase is enforced by typeCode at the search/DB layer
  // (AdvancedSearchService scopes the query by the vehicle's typeCodes
  // BEFORE any product reaches here — see "[SEARCH] Vehicle
  // compatibility scope: typeCodes=[...]" in the logs). `modelName` on
  // Fitment is a redundant free-text field (see schema.prisma header)
  // that does not reliably equal `vehicle.modele` — comparing them
  // flagged every already-correct result as a false "mismatch" and
  // broke every confident answer in production. Do not resurrect a
  // fitments/modelName text comparison here; if compatibility needs
  // re-verification at this layer, it must be done by typeCode, with
  // the vehicle's real typeCodes passed in explicitly — not guessed
  // from a display-name string.
  if (input.vehicle?.modele && input.selectedProduct && !input.vehicleModelResolved) {
    // A vehicle was supplied but the orchestrator never had a
    // normalized model to scope the search by — compatibility was
    // never actually checked, so it cannot be claimed confirmed.
    reasons.push('compatibility-not-verified');
  }

  // ── Condition 3: request correctly understood, part correctly identified ─
  if (
    !Number.isFinite(input.understandingConfidence) ||
    input.understandingConfidence < MIN_UNDERSTANDING_CONFIDENCE ||
    input.understandingConfidence > 1
  ) {
    reasons.push('understanding-low-confidence');
  }
  if (input.unresolvedClarification) {
    reasons.push('clarification-unresolved');
  }
  if (
    input.constraintOutcome?.applied &&
    input.constraintOutcome.noExactMatch &&
    input.selectedProduct
  ) {
    // The deterministic identity/position gate itself could not confirm
    // an exact match. The caller should normally already be routing to
    // buildNoExactMatchResponse() in this case — this is a hard backstop
    // for if a product is being proposed anyway.
    reasons.push('position-not-confirmed');
  }

  return { secure: reasons.length === 0, reasons };
}