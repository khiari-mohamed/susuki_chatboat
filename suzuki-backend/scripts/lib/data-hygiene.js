// Shared data-cleaning helpers used by every CSV sync script
// (sync-csv-to-db.js, sync-vehicles-csv.js, sync-fitments-csv.js).
//
// Centralizing this means a fix here — e.g. adding a new junk value to
// the blocklist — automatically applies to every sync script instead
// of needing to be copy-pasted and kept in sync by hand.

// Placeholder/artifact strings that sometimes leak out of Excel/CSV
// exports where a cell is logically empty. Confirmed root cause of the
// "NAN" pollution found in vehicles.marque (2026-09-13 data audit):
// this text was never present in a *current* CarPro export, but got
// written to the DB by some earlier import and then perpetuated by
// sync-vehicles-csv.js's old fallback-to-existing logic, which had no
// way to tell "genuinely blank" apart from "garbage text masquerading
// as a value". Rejecting these at the source stops it from ever being
// written again, on any field, by any sync script.
const JUNK_VALUES = new Set(['NAN', 'N/A', 'NA', 'NULL', 'NONE', '-', '--', '#N/A', 'UNDEFINED', '#REF!', '#VALUE!']);

function clean(value) {
  return value === undefined || value === null ? '' : String(value).replace(/^\uFEFF/, '').trim();
}

/**
 * Cleans a raw CSV cell AND rejects known placeholder junk text so it
 * never gets written to the database as if it were real data.
 * Returns null for anything blank or junk — never an empty string.
 */
function cleanOrNull(value) {
  const v = clean(value);
  if (!v) return null;
  return JUNK_VALUES.has(v.toUpperCase()) ? null : v;
}

/** Uppercases + collapses internal whitespace — for fields that should
 * be case-canonical (categorie, fabricant, unite) to stop new
 * "Filtre" / "filtre" / "FILTRE" duplicates from being introduced by
 * future imports (see the "Variantes de casse" diagnostics checks). */
function canonicalize(value) {
  const v = cleanOrNull(value);
  return v ? v.toUpperCase().replace(/\s+/g, ' ') : null;
}

function normalizeTypeCode(value) {
  const code = cleanOrNull(value);
  if (!code) return null;
  return code.toUpperCase().replace(/\s+/g, '-').replace(/-TYPE-/g, '-TYPE');
}

/**
 * Preserves the existing DB value when the new CSV value is blank,
 * instead of silently erasing previously-known-good data. Every
 * mutable vehicle field (vin, marque, modele, modeleDescription,
 * typeCode, immatriculation) must use this uniformly — a past version
 * of sync-vehicles-csv.js only applied this to 3 of the 6 fields,
 * which meant a CSV export with a blank "Vehicle Type" or
 * "N° Immatriculation" cell would erase a previously-known-good value
 * on the next sync. Fixed 2026-09-13.
 */
function preferNewOrExisting(newValue, existingValue) {
  return newValue ?? existingValue ?? null;
}

function numberOrNull(value, field, context) {
  const cleaned = clean(value).replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid ${field} for ${context}: ${value}`);
  return parsed;
}

module.exports = { JUNK_VALUES, clean, cleanOrNull, canonicalize, normalizeTypeCode, preferNewOrExisting, numberOrNull };