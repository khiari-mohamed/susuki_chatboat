// Hand-written manifest mirroring prisma/schema.prisma exactly. Kept
// explicit (rather than introspected from Prisma's DMMF at runtime) so
// this list is a deliberate, reviewable decision — in particular so
// AdminUser.passwordHash can never accidentally end up exposed through
// a generic "show every column" browser. AdminUser itself is left out
// entirely; it already has its own dedicated, safe page (/users).
//
// `prismaModel` is the Prisma Client delegate name (prisma.part, ...).
// `key` is the URL-safe slug used in the API path and the frontend route.

export type ExplorerColumnType = 'string' | 'number' | 'boolean' | 'datetime' | 'json';

export interface ExplorerColumn {
  key: string;
  type: ExplorerColumnType;
}

export interface ExplorerTable {
  key: string;
  prismaModel: string;
  label: string;
  columns: ExplorerColumn[];
}

export const EXPLORER_TABLES: ExplorerTable[] = [
  {
    key: 'parts',
    prismaModel: 'part',
    label: 'parts',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'reference', type: 'string' },
      { key: 'designation', type: 'string' },
      { key: 'designation2', type: 'string' },
      { key: 'searchDescription', type: 'string' },
      { key: 'prixHt', type: 'number' },
      { key: 'prixTtc', type: 'number' },
      { key: 'unite', type: 'string' },
      { key: 'categorie', type: 'string' },
      { key: 'fabricant', type: 'string' },
      { key: 'fournisseurCode', type: 'string' },
      { key: 'source', type: 'string' },
      { key: 'createdAt', type: 'datetime' },
      { key: 'updatedAt', type: 'datetime' },
    ],
  },
  {
    key: 'stock',
    prismaModel: 'stock',
    label: 'stock',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'reference', type: 'string' },
      { key: 'totalQuantity', type: 'number' },
      { key: 'stockDisponible', type: 'number' },
      { key: 'stockConsolide', type: 'number' },
      { key: 'statut', type: 'string' },
      { key: 'updatedAt', type: 'datetime' },
    ],
  },
  {
    key: 'vehicle_type_master',
    prismaModel: 'vehicleTypeMaster',
    label: 'vehicle_type_master',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'typeCode', type: 'string' },
      { key: 'modelName', type: 'string' },
    ],
  },
  {
    key: 'fitment',
    prismaModel: 'fitment',
    label: 'fitment',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'partReference', type: 'string' },
      { key: 'typeCode', type: 'string' },
      { key: 'modelName', type: 'string' },
    ],
  },
  {
    key: 'vehicle_model_map',
    prismaModel: 'vehicleModelMap',
    label: 'vehicle_model_map',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'modele', type: 'string' },
      { key: 'typeCode', type: 'string' },
    ],
  },
  {
    key: 'vehicles',
    prismaModel: 'vehicle',
    label: 'vehicles',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'vehicleNo', type: 'string' },
      { key: 'vin', type: 'string' },
      { key: 'marque', type: 'string' },
      { key: 'modele', type: 'string' },
      { key: 'modeleDescription', type: 'string' },
      { key: 'typeCode', type: 'string' },
      { key: 'immatriculation', type: 'string' },
    ],
  },
  {
    key: 'item_references',
    prismaModel: 'itemReference',
    label: 'item_references',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'partReference', type: 'string' },
      { key: 'referenceNo', type: 'string' },
      { key: 'referenceType', type: 'string' },
    ],
  },
  {
    key: 'synonyms',
    prismaModel: 'synonym',
    label: 'synonyms',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'mot', type: 'string' },
      { key: 'canonical', type: 'string' },
      { key: 'langue', type: 'string' },
    ],
  },
  {
    key: 'chat_sessions',
    prismaModel: 'chatSession',
    label: 'chat_sessions',
    columns: [
      { key: 'id', type: 'string' },
      { key: 'vehicleInfo', type: 'json' },
      { key: 'startedAt', type: 'datetime' },
      { key: 'endedAt', type: 'datetime' },
      { key: 'metadata', type: 'json' },
    ],
  },
  {
    key: 'chat_messages',
    prismaModel: 'chatMessage',
    label: 'chat_messages',
    columns: [
      { key: 'id', type: 'string' },
      { key: 'sessionId', type: 'string' },
      { key: 'sender', type: 'string' },
      { key: 'message', type: 'string' },
      { key: 'timestamp', type: 'datetime' },
      { key: 'metadata', type: 'json' },
    ],
  },
  {
    key: 'chat_prompts',
    prismaModel: 'chatPrompt',
    label: 'chat_prompts',
    columns: [
      { key: 'id', type: 'string' },
      { key: 'sessionId', type: 'string' },
      { key: 'promptText', type: 'string' },
      { key: 'responseText', type: 'string' },
      { key: 'model', type: 'string' },
      { key: 'tokens', type: 'number' },
      { key: 'createdAt', type: 'datetime' },
    ],
  },
  {
    key: 'chat_feedback',
    prismaModel: 'chatFeedback',
    label: 'chat_feedback',
    columns: [
      { key: 'id', type: 'string' },
      { key: 'messageId', type: 'string' },
      { key: 'rating', type: 'number' },
      { key: 'comment', type: 'string' },
      { key: 'createdAt', type: 'datetime' },
    ],
  },
  {
    key: 'upload_tracking',
    prismaModel: 'uploadTracking',
    label: 'upload_tracking',
    columns: [
      { key: 'id', type: 'string' },
      { key: 'userIp', type: 'string' },
      { key: 'uploadedAt', type: 'datetime' },
      { key: 'success', type: 'boolean' },
      { key: 'vehicleInfo', type: 'json' },
    ],
  },
];