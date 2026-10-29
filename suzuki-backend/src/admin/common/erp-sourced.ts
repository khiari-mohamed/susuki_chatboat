// Tables whose content comes from the ERP (CarPro email 2026-09-18: ERP → Chatbot,
// one way, chatbot database read-only for this data). Keys are Prisma delegate names.
export const ERP_SOURCED_MODELS: ReadonlySet<string> = new Set([
  'part',
  'stock',
  'fitment',
  'vehicleTypeMaster',
  'vehicleModelMap',
  'vehicle',
  'itemReference',
]);

/** ERP data is never writable through the chatbot's admin API. */
export function isErpReadOnly(): boolean {
  return true;
}

export const ERP_READ_ONLY_MESSAGE =
  "Cette table est alimentée par l'ERP : elle est en lecture seule dans le chatbot. " +
  "Effectuez la modification dans l'ERP, puis lancez la synchronisation.";