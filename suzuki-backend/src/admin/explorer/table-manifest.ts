// Hand-written manifest mirroring prisma/schema.prisma. Kept explicit (rather than
// introspected) so this list is a deliberate, reviewable decision, in particular so
// AdminUser.passwordHash can never end up exposed through a generic column browser.
// AdminUser itself is left out; it has its own dedicated, safe page (/users).
//
// `prismaModel` is the Prisma Client delegate name (prisma.part, ...).
// `key` is the URL-safe slug used in the API path and the frontend route.
// `origin`: 'erp' tables are fed one-way from the ERP and are read-only in the
//           chatbot; 'chatbot' tables are produced or maintained by the chatbot itself.
// `defaultSort`: column used for the default ordering (UUID tables have no useful id order).

export type ExplorerColumnType = 'string' | 'number' | 'boolean' | 'datetime' | 'json';

export interface ExplorerColumn {
  key: string;
  type: ExplorerColumnType;
}

export interface ExplorerTable {
  key: string;
  prismaModel: string;
  label: string;
  origin: 'erp' | 'chatbot';
  defaultSort?: string;
  columns: ExplorerColumn[];
}

export const EXPLORER_TABLES: ExplorerTable[] = [
  {
    key: 'parts',
    prismaModel: 'part',
    label: 'parts',
    origin: 'erp',
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
    origin: 'erp',
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
    origin: 'erp',
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
    origin: 'erp',
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
    origin: 'erp',
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
    origin: 'erp',
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
    origin: 'erp',
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
    origin: 'chatbot',
    columns: [
      { key: 'id', type: 'number' },
      { key: 'mot', type: 'string' },
      { key: 'canonical', type: 'string' },
      { key: 'langue', type: 'string' },
    ],
  },
  {
    // CarPro email 2026-09-25: history of searches, retrievable by VIN.
    key: 'search_logs',
    prismaModel: 'searchLog',
    label: 'search_logs',
    origin: 'chatbot',
    defaultSort: 'createdAt',
    columns: [
      { key: 'id', type: 'string' },
      { key: 'createdAt', type: 'datetime' },
      { key: 'vin', type: 'string' },
      { key: 'vehicleNo', type: 'string' },
      { key: 'modelCode', type: 'string' },
      { key: 'customerMessage', type: 'string' },
      { key: 'identifiedPart', type: 'string' },
      { key: 'proposedReferences', type: 'json' },
      { key: 'compatibilityResult', type: 'string' },
      { key: 'availabilityCommunicated', type: 'string' },
      { key: 'redirectMessage', type: 'string' },
      { key: 'redirectReason', type: 'string' },
      { key: 'intent', type: 'string' },
      { key: 'sessionId', type: 'string' },
    ],
  },
  {
    key: 'chat_sessions',
    prismaModel: 'chatSession',
    label: 'chat_sessions',
    origin: 'chatbot',
    defaultSort: 'startedAt',
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
    origin: 'chatbot',
    defaultSort: 'timestamp',
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
    origin: 'chatbot',
    defaultSort: 'createdAt',
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
    origin: 'chatbot',
    defaultSort: 'createdAt',
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
    origin: 'chatbot',
    defaultSort: 'uploadedAt',
    columns: [
      { key: 'id', type: 'string' },
      { key: 'userIp', type: 'string' },
      { key: 'uploadedAt', type: 'datetime' },
      { key: 'success', type: 'boolean' },
      { key: 'vehicleInfo', type: 'json' },
    ],
  },
];