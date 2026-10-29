// Pure helpers for finding a vehicle row from a VIN. Shared by the verification
// flows so the widget and the search resolve the same row.

export interface VehicleRowLike {
  id?: number | null;
  modele?: string | null;
  typeCode?: string | null;
}

/** Uppercase letters and digits only ("vf3 abc-123" → "VF3ABC123"). */
export function normalizeVinText(raw: unknown): string {
  return String(raw ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * A standard VIN never contains I, O or Q, and OCR confuses them with 1, 0, 0.
 * Returns the VIN as read plus its corrected spelling, so the lookup finds the
 * row whichever way it was typed.
 */
export function vinLookupVariants(vin: string): string[] {
  const corrected = vin.replace(/[OQ]/g, '0').replace(/I/g, '1');
  return corrected === vin ? [vin] : [vin, corrected];
}

/**
 * Several vehicle rows can share one VIN (109 known cases). Prefer the row that
 * carries the model code, then one with a model name, then the newest.
 */
export function pickBestVehicleRow<T extends VehicleRowLike>(rows: readonly T[]): T | null {
  let best: T | null = null;
  let bestScore = -1;
  for (const row of rows) {
    const score = (row.typeCode?.trim() ? 4 : 0) + (row.modele?.trim() ? 2 : 0);
    if (!best || score > bestScore || (score === bestScore && (row.id ?? 0) > (best.id ?? 0))) {
      best = row;
      bestScore = score;
    }
  }
  return best;
}