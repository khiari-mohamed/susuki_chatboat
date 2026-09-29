import {
  buildIdentityKeys,
  getCatalogPositions,
  getCoreTokens,
  hasAnyPosition,
  matchesHead,
  normalizeForMatch,
  positionsSatisfy,
  tokenizeName,
} from './part-constraints';
import type { PositionRequest } from './part-constraints';

export type CheckStatus = 'confirmed' | 'failed' | 'unverifiable' | 'not-applicable';

export interface VerifierInterpretation {
  catalogPart: string | null;
  catalogAliases?: string[];
  positions: PositionRequest;
  qualifiers: string[];
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

function pad(text: string): string {
  return ` ${text} `;
}

function containsPhrase(text: string, phrase: string): boolean {
  if (pad(text).includes(pad(phrase))) return true;
  const compactText = text.replace(/[\s/-]+/g, '');
  const compactPhrase = phrase.replace(/[\s/-]+/g, '');
  return compactPhrase.length >= 4 && compactText.includes(compactPhrase);
}

function customerDesignation(product: any): string {
  const french = (product?.designation2 ?? product?.designation_2 ?? '').toString().trim();
  return french || (product?.designation ?? '').toString().trim();
}

function checkIdentity(
  product: any,
  interpretation: VerifierInterpretation,
  issues: string[],
): CheckStatus {
  if (!interpretation.catalogPart) return 'not-applicable';

  const phrases = [...new Set([interpretation.catalogPart, ...(interpretation.catalogAliases ?? [])]
    .map((phrase) => normalizeForMatch(phrase))
    .filter(Boolean))];
  const designation = normalizeForMatch(customerDesignation(product));
  if (!phrases.some((phrase) => containsPhrase(designation, phrase))) {
    issues.push(`identity: catalog designation does not contain "${interpretation.catalogPart}"`);
    return 'failed';
  }

  const core = getCoreTokens(product);
  if (core?.length) {
    const identityKeys = buildIdentityKeys(phrases.map((phrase) => tokenizeName(phrase)));
    if (!matchesHead(core, identityKeys)) return 'unverifiable';
  }
  return 'confirmed';
}

function checkPosition(
  product: any,
  interpretation: VerifierInterpretation,
  issues: string[],
): CheckStatus {
  if (!hasAnyPosition(interpretation.positions)) return 'not-applicable';
  const actual = getCatalogPositions(product);
  if (!hasAnyPosition(actual)) return 'unverifiable';
  if (positionsSatisfy(interpretation.positions, actual)) return 'confirmed';
  issues.push(`position: requested ${JSON.stringify(interpretation.positions)} but catalog row differs`);
  return 'failed';
}

function checkQualifiers(product: any, interpretation: VerifierInterpretation): CheckStatus {
  const qualifiers = (interpretation.qualifiers ?? []).map(normalizeForMatch).filter(Boolean);
  if (qualifiers.length === 0) return 'not-applicable';

  const fitments = (product?.fitments ?? []).flatMap((fitment: any) => [fitment?.modelName, fitment?.typeCode]);
  const evidence = normalizeForMatch([
    customerDesignation(product),
    product?.designation2,
    product?.designation_2,
    product?.designation,
    product?.searchDescription,
    product?.search_description,
    ...fitments,
  ].filter(Boolean).join(' '));
  return qualifiers.every((qualifier) => containsPhrase(evidence, qualifier))
    ? 'confirmed'
    : 'unverifiable';
}

function checkVehicle(
  product: any,
  scope: VehicleScopeInput,
  issues: string[],
): CheckStatus {
  if (!scope.scoped) return 'not-applicable';
  if (scope.compatibleTypeCodes.length === 0) {
    issues.push('vehicle: no compatible type code was resolved from the database');
    return 'failed';
  }

  const fitmentCodes: string[] = (product?.fitments ?? [])
    .map((fitment: any) => fitment?.typeCode)
    .filter(Boolean);
  if (fitmentCodes.length === 0 || fitmentCodes.some((code) => scope.compatibleTypeCodes.includes(code))) {
    return 'confirmed';
  }
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
    verified: identity !== 'failed' && position !== 'failed' && vehicle !== 'failed',
    issues,
  };
}

export function stockIsAvailable(product: any): boolean {
  const stock = product?.stock ?? {};
  const quantity = stock.stockConsolide ?? stock.stock_consolide ?? product?.stockConsolide ?? product?.stock_consolide;
  return quantity != null && Number(quantity) >= 2;
}

function publicPrice(product: any): number | null {
  const raw = product?.prixTtc ?? product?.prix_ttc ?? null;
  if (raw == null) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function checkResponseAgainstCatalog(
  response: string,
  shownProducts: any[],
): { status: CheckStatus; issues: string[] } {
  const issues: string[] = [];
  const normalizedResponse = normalizeForMatch(response ?? '');
  const printedPrices = [...(response ?? '').matchAll(/(\d+(?:[.,]\d+)?)\s*(?:TND|DT)\b/gi)]
    .map((match) => Number(match[1].replace(',', '.')));
  const availablePrices = shownProducts
    .filter(stockIsAvailable)
    .map(publicPrice)
    .filter((price): price is number => price !== null);

  for (const price of printedPrices) {
    if (!availablePrices.some((dbPrice) => Math.abs(dbPrice - price) < 0.0005)) {
      issues.push(`stockPrice: printed price ${price} TND is not the public price of an available shown row`);
    }
  }

  const claimsUnavailable = /\bindisponible\w*\b|\bpas\s+(?:actuellement\s+)?disponible\b|\baucun(?:e)?s?\s+(?:resultats?|pieces?)\s+disponibles?\b/.test(normalizedResponse);
  const claimsAvailable = !claimsUnavailable && /\bdisponible\w*\b/.test(normalizedResponse);
  const hasAvailableRow = shownProducts.some(stockIsAvailable);
  if (claimsAvailable && !hasAvailableRow) {
    issues.push('stockPrice: response claims availability but no shown row meets the stock rule');
  }
  if (claimsUnavailable && hasAvailableRow) {
    issues.push('stockPrice: response claims unavailability while a shown row meets the stock rule');
  }

  return { status: issues.length ? 'failed' : 'confirmed', issues };
}

export type AiFlagType = 'PART_IDENTITY' | 'POSITION' | 'QUALIFIER' | 'VEHICLE' | 'PRICE_STOCK' | 'OTHER';

export interface AiFlag {
  type: AiFlagType;
  reference?: string | null;
  detail?: string;
}

export interface FlagDecision {
  accept: boolean;
  effective: AiFlag[];
  ignored: AiFlag[];
}

type VerificationCheck = 'identity' | 'position' | 'qualifiers' | 'vehicle' | 'stockPrice';
const FLAG_TO_CHECK: Record<Exclude<AiFlagType, 'OTHER'>, VerificationCheck> = {
  PART_IDENTITY: 'identity',
  POSITION: 'position',
  QUALIFIER: 'qualifiers',
  VEHICLE: 'vehicle',
  PRICE_STOCK: 'stockPrice',
};
const SEMANTIC_FLAGS = new Set<AiFlagType>(['PART_IDENTITY', 'POSITION', 'QUALIFIER']);

export function decideAfterAiFlags(
  verifications: ProductVerification[],
  flags: AiFlag[],
): FlagDecision {
  const effective: AiFlag[] = [];
  const ignored: AiFlag[] = [];
  const shownReferences = new Set(verifications.map((verification) => (verification.reference ?? '').trim().toUpperCase()));

  for (const flag of flags) {
    if (flag.type === 'OTHER' || !(flag.type in FLAG_TO_CHECK)) {
      ignored.push(flag);
      continue;
    }
    if (flag.reference && !shownReferences.has(flag.reference.trim().toUpperCase())) {
      ignored.push(flag);
      continue;
    }

    const check = FLAG_TO_CHECK[flag.type as Exclude<AiFlagType, 'OTHER'>];
    const targets = flag.reference
      ? verifications.filter((verification) => verification.reference?.trim().toUpperCase() === flag.reference!.trim().toUpperCase())
      : verifications;
    const settled = targets.length > 0 && targets.every((verification) => {
      const status = verification[check];
      if (status === 'unverifiable') return false;
      if (status === 'not-applicable' && SEMANTIC_FLAGS.has(flag.type)) return false;
      return true;
    });
    (settled ? ignored : effective).push(flag);
  }

  return { accept: effective.length === 0, effective, ignored };
}