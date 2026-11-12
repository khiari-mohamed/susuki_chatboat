// Shared labels for the sync summary (keys = Prisma delegate names used by the backend).
export const SYNC_ENTITY_LABELS = {
  vehicleTypeMaster: 'Types véhicules',
  vehicleModelMap: 'Modèle ↔ Type code',
  vehicle: 'Véhicules',
  part: 'Pièces',
  stock: 'Stock',
  fitment: 'Compatibilités',
  itemReference: 'Références croisées',
};

export const SYNC_STATUS_META = {
  SUCCESS: { label: 'Réussie', color: '#16a34a' },
  PARTIAL: { label: 'Partielle (lignes ignorées)', color: '#d97706' },
  FAILED: { label: 'Échec', color: '#dc2626' },
  RUNNING: { label: 'En cours', color: '#2563eb' },
};