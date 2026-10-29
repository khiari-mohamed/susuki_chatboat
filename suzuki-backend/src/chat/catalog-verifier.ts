import {
  isQuantityAvailable,
  MIN_AVAILABLE_STOCK,
  PUBLIC_PRICE_SOURCE,
} from '../constants/business-rules.constants';
import {
  buildIdentityKeys,
  buildRequestedPartTokens,
  compactKey,
  contentTokens,
  getCatalogPositions,
  getCoreTokens,
  hasAnyPosition,
  isColorToken,
  isFillerToken,
  keysMatch,
  levenshtein,
  matchesHead,
  normalizeForMatch,
  normalizeTypeCode,
  positionsSatisfy,
} from './part-constraints';
import type { ConstraintOutcome, PositionRequest } from './part-constraints';

export type CheckStatus = 'confirmed' | 'failed' | 'unverifiable' | 'not-applicable';

export type AiFlagType = 'PART_IDENTITY' | 'POSITION' | 'QUALIFIER' | 'VEHICLE' | 'PRICE_STOCK' | 'OTHER';

export interface AiFlag {
  type: AiFlagType;
  reference?: string | null;
  detail?: string;
}

export interface VerifierInterpretation {
  catalogPart: string | null;
  catalogAliases?: string[];
  positions: PositionRequest;
  qualifiers: string[];
  /**
   * Pass `constraintOutcome.identityMode` from the search. When it is
   * 'strict-head' a standalone part of the requested kind exists in the
   * catalog, so a row whose head noun is something else (grille, joint,
   * support…) FAILS identity instead of staying unverifiable.
   */
  identityMode?: ConstraintOutcome['identityMode'];
}

export interface VehicleScopeInput {
  scoped: boolean;
  compatibleTypeCodes: string[];
}

export interface ProductVerification {
  reference: string | null;
  identity: CheckStatus;
  position: CheckStatus;
  qualifiers: CheckStatus;
  vehicle: CheckStatus;
  stockPrice: CheckStatus;
  verified: boolean;
  issues: string[];
}

// Re-exported so existing imports from this file keep working.
export { MIN_AVAILABLE_STOCK };

/** Half a cent: a price printed with 2 decimals may differ from the DB value by this much. */
const PRICE_TOLERANCE = 0.005 + 1e-9;

/** Longest run of adjacent catalog tokens compared with a requested phrase ("pare choc" ≈ "parechoc"). */
const MAX_PHRASE_RUN = 6;

// ─────────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────────

/**
 * Token-based phrase test (function words ignored, plural- and
 * spacing-insensitive, typo-tolerant on long keys). Works on whole tokens
 * only, so "vitre" is never found inside another word.
 */
function containsTokens(textTokens: string[], phraseTokens: string[]): boolean {
  if (phraseTokens.length === 0) return false;
  const phraseKey = compactKey(phraseTokens);
  for (let start = 0; start < textTokens.length; start++) {
    const maxLength = Math.min(MAX_PHRASE_RUN, textTokens.length - start);
    for (let length = 1; length <= maxLength; length++) {
      if (keysMatch(compactKey(textTokens.slice(start, start + length)), phraseKey)) return true;
    }
  }
  return false;
}

function frenchDesignation(product: any): string {
  return (product?.designation2 ?? product?.designation_2 ?? '').toString().trim();
}

/** What the customer sees: French name, English OEM name only as a last resort. */
function customerDesignation(product: any): string {
  return frenchDesignation(product) || (product?.designation ?? '').toString().trim();
}

// ─────────────────────────────────────────────────────────────────
// Per-product checks
// ─────────────────────────────────────────────────────────────────

function checkIdentity(product: any, interpretation: VerifierInterpretation, issues: string[]): CheckStatus {
  if (!interpretation.catalogPart) return 'not-applicable';

  const phrases = [...new Set([interpretation.catalogPart, ...(interpretation.catalogAliases ?? [])])]
    .map((phrase) => buildRequestedPartTokens(contentTokens(phrase)))
    .filter((tokens) => tokens.length > 0);
  if (phrases.length === 0) return 'not-applicable';

  // Without a French designation the identity cannot be verified in the
  // language the customer uses; the AI judge is the only second opinion.
  const french = frenchDesignation(product);
  if (!french) {
    issues.push('identity: article has no French designation, identity cannot be verified');
    return 'unverifiable';
  }

  const designationTokens = buildRequestedPartTokens(contentTokens(french));
  if (!phrases.some((phrase) => containsTokens(designationTokens, phrase))) {
    issues.push(`identity: catalog designation does not contain "${interpretation.catalogPart}"`);
    return 'failed';
  }

  const core = getCoreTokens(product);
  const identityCore = core ? buildRequestedPartTokens(core) : null;
  if (identityCore && phrases.some((phrase) => compactKey(phrase) === compactKey(identityCore))) {
    return 'confirmed';
  }
  if (identityCore && matchesHead(identityCore, buildIdentityKeys(phrases))) return 'confirmed';

  const requestStartsWithCatalogHead = identityCore && interpretation.identityMode !== 'strict-head' &&
    phrases.some((phrase) => compactKey(phrase.slice(0, 1)) === compactKey(identityCore.slice(0, 1)));
  if (requestStartsWithCatalogHead) return 'confirmed';

  if (interpretation.identityMode === 'strict-head') {
    issues.push(`identity: "${interpretation.catalogPart}" is only a component/relative in this designation, not the part itself`);
    return 'failed';
  }
  issues.push(`identity: designation contains "${interpretation.catalogPart}" but not as its head noun`);
  return 'unverifiable';
}

function checkPosition(product: any, interpretation: VerifierInterpretation, issues: string[]): CheckStatus {
  if (!hasAnyPosition(interpretation.positions)) return 'not-applicable';
  const actual = getCatalogPositions(product);
  if (!hasAnyPosition(actual)) return 'unverifiable';
  if (positionsSatisfy(interpretation.positions, actual)) return 'confirmed';
  issues.push(`position: requested ${JSON.stringify(interpretation.positions)} but catalog row differs`);
  return 'failed';
}

function checkQualifiers(product: any, interpretation: VerifierInterpretation): CheckStatus {
  const qualifiers = (interpretation.qualifiers ?? [])
    .map((qualifier) => contentTokens(qualifier).filter((token) => !isColorToken(token) && !isFillerToken(token)))
    .filter((tokens) => tokens.length > 0);
  if (qualifiers.length === 0) return 'not-applicable';

  const fitmentEvidence = (product?.fitments ?? []).flatMap((fitment: any) => [
    fitment?.modelName ?? fitment?.model_name,
    fitment?.typeCode ?? fitment?.type_code,
  ]);
  const evidenceTokens = contentTokens(
    [
      customerDesignation(product),
      product?.designation,
      product?.searchDescription ?? product?.search_description,
      ...fitmentEvidence,
    ]
      .filter(Boolean)
      .join(' '),
  );
  // Catalog designations contain typos ("BASSSES"): a qualifier word also counts when every one of
  // its words matches a catalog word exactly, as a plural, or within one edit (words of 5+ letters).
  const tokenCovered = (token: string) =>
    evidenceTokens.some(
      (evidence) =>
        evidence === token ||
        compactKey([evidence]) === compactKey([token]) ||
        (Math.min(evidence.length, token.length) >= 5 && levenshtein(evidence, token) <= 1),
    );
  return qualifiers.every((qualifier) => containsTokens(evidenceTokens, qualifier) || qualifier.every(tokenCovered))
    ? 'confirmed'
    : 'unverifiable';
}

function checkVehicle(product: any, scope: VehicleScopeInput, issues: string[]): CheckStatus {
  if (!scope.scoped) return 'not-applicable';
  if (scope.compatibleTypeCodes.length === 0) {
    issues.push('vehicle: no compatible type code was resolved from the database');
    return 'failed';
  }

  const fitmentCodes: string[] = (Array.isArray(product?.fitments) ? product.fitments : [])
    .map((fitment: any) => normalizeTypeCode(fitment?.typeCode ?? fitment?.type_code))
    .filter(Boolean);

  // No fitment rows = no compatibility evidence. Never assume compatible.
  if (fitmentCodes.length === 0) {
    issues.push('vehicle: no fitment data for this article, compatibility cannot be confirmed');
    return 'unverifiable';
  }

  const compatible = new Set(scope.compatibleTypeCodes.map(normalizeTypeCode));
  if (fitmentCodes.some((code) => compatible.has(code))) return 'confirmed';
  issues.push('vehicle: catalog fitment type codes do not match the resolved vehicle');
  return 'failed';
}

export function verifyProductAgainstCatalog(
  product: any,
  interpretation: VerifierInterpretation,
  scope: VehicleScopeInput,
): ProductVerification {
  const issues: string[] = [];
  const identity = checkIdentity(product, interpretation, issues);
  const position = checkPosition(product, interpretation, issues);
  const qualifiers = checkQualifiers(product, interpretation);
  const vehicle = checkVehicle(product, scope, issues);

  return {
    reference: product?.reference ?? null,
    identity,
    position,
    qualifiers,
    vehicle,
    stockPrice: 'not-applicable',
    // Only a hard contradiction removes a candidate; `unverifiable` is
    // arbitrated later by the AdaptiveDecisionEngine.
    verified: identity !== 'failed' && position !== 'failed' && vehicle !== 'failed',
    issues,
  };
}

// ─────────────────────────────────────────────────────────────────
// Stock / price
// ─────────────────────────────────────────────────────────────────

export function stockIsAvailable(product: any): boolean {
  const stock = product?.stock ?? {};
  const quantity = stock.stockConsolide ?? stock.stock_consolide ?? product?.stockConsolide ?? product?.stock_consolide;
  return isQuantityAvailable(quantity);
}

export function publicPrice(product: any): number | null {
  if (product?.source !== PUBLIC_PRICE_SOURCE) return null;
  const raw = product?.prixTtc ?? product?.prix_ttc ?? null;
  if (raw == null) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

// "125,500 TND", "1 250,5 DT", "99.90 TND"
const PRINTED_PRICE = /(?<![\d.,-])((?:\d{1,3}(?:[\s\u00a0\u202f]\d{3})+|\d+)(?:[.,]\d+)?)\s*(?:TND|DT)\b/gi;
const NEGATIVE_AVAILABILITY =
  /\bindisponibles?\b|\bnon\s+disponibles?\b|\bpas\s+(?:actuellement\s+)?disponibles?\b|\baucun(?:e)?s?\s+(?:resultats?|pieces?)\s+disponibles?\b|\brupture\b/g;
const POSITIVE_AVAILABILITY = /\bdisponibles?\b/;

/**
 * Cross-checks the final customer text against the shown catalog rows:
 * every printed price must be the public price of an available row, and
 * availability wording must agree with the stock rule.
 */
export function checkResponseAgainstCatalog(
  response: string,
  shownProducts: any[],
): { status: CheckStatus; issues: string[] } {
  const issues: string[] = [];
  const text = response ?? '';
  const availableRows = shownProducts.filter(stockIsAvailable);
  const availablePrices = availableRows.map(publicPrice).filter((price): price is number => price !== null);

  for (const match of text.matchAll(PRINTED_PRICE)) {
    const price = Number(match[1].replace(/[\s\u00a0\u202f]/g, '').replace(',', '.'));
    if (!availablePrices.some((dbPrice) => Math.abs(dbPrice - price) <= PRICE_TOLERANCE)) {
      issues.push(`stockPrice: printed price ${price} TND is not the public price of an available shown row`);
    }
  }

  const normalized = normalizeForMatch(text);
  const claimsUnavailable = NEGATIVE_AVAILABILITY.test(normalized);
  NEGATIVE_AVAILABILITY.lastIndex = 0;
  const claimsAvailable = POSITIVE_AVAILABILITY.test(normalized.replace(NEGATIVE_AVAILABILITY, ' '));
  NEGATIVE_AVAILABILITY.lastIndex = 0;
  const hasAvailableRow = availableRows.length > 0;

  if (claimsAvailable && !hasAvailableRow) {
    issues.push('stockPrice: response claims availability but no shown row meets the stock rule');
  }
  // A reply that mixes both claims (several rows) cannot be attributed to one row.
  if (claimsUnavailable && !claimsAvailable && hasAvailableRow) {
    issues.push('stockPrice: response claims unavailability while a shown row meets the stock rule');
  }

  return { status: issues.length ? 'failed' : 'confirmed', issues };
}