// Single source of truth for customer-facing business constants
// (CarPro email 2026-09-18, "Sécurisation des réponses").

export const COMPTOIR_PR_PHONES = '70 603 518 – 70 603 519';

/** Exact redirect text required by CarPro when an answer cannot be secured. */
export const COMPTOIR_REDIRECT_MESSAGE =
  `Veuillez contacter Car Pro – Comptoir Pièces de Rechange Tél N° ${COMPTOIR_PR_PHONES}`;

/** Business rule (CarPro 2026-09-18): a part is available when consolidated stock is >= 2 units. */
export const MIN_AVAILABLE_STOCK = 2;

/** Single implementation of the stock rule. Accepts numbers, Decimals and numeric strings. */
export function isQuantityAvailable(quantity: unknown): boolean {
  if (quantity == null) return false;
  const value = Number(quantity);
  return Number.isFinite(value) && value >= MIN_AVAILABLE_STOCK;
}

/**
 * True only when a consolidated stock value really exists.
 * No stock row / null stock_consolide = UNKNOWN (must redirect), not 0.
 * Accepts the Prisma stock row or the mapped PartResult.stock.
 */
export function hasKnownStock(stock: unknown): boolean {
  if (stock == null || typeof stock !== 'object') return false;
  const record = stock as Record<string, unknown>;
  const value = record.stockConsolide ?? record.stock_consolide;
  if (value == null || typeof value === 'boolean') return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return Number.isFinite(Number(value));
}

/** Only rows from this source carry the public price (prix_ttc). 02_CARPRO rows are wholesale. */
export const PUBLIC_PRICE_SOURCE = '01_PROD';