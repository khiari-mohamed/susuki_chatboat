// Single source of truth for what the generic <EntityPage> renders for
// each of the 8 catalog tables. Field `key`s match the backend DTOs
// exactly (camelCase) — see suzuki-backend/src/admin/entities/**/dto/*.
//
// Column flags:
//   editable    — shown as an editable cell in the grid, sent on PUT
//   createOnly  — only settable when creating a new row (FK/identity
//                 fields the backend deliberately makes immutable —
//                 see each UpdateXxxDto's comments for why)
//   required    — required in the "Add" modal form
//   type        — 'text' | 'number' | 'select'
//   options     — for type: 'select'

export const ENTITIES = {
  parts: {
    key: 'parts',
    apiPath: '/parts',
    socketTable: 'parts',
    label: 'Pièces',
    subtitle: 'Catalogue produit — parts',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'reference', name: 'Référence', type: 'text', width: 150, createOnly: true, required: true },
      { key: 'designation', name: 'Désignation (EN)', type: 'text', width: 240, editable: true, required: true },
      { key: 'designation2', name: 'Désignation FR ★', type: 'text', width: 240, editable: true },
      { key: 'searchDescription', name: 'Description recherche', type: 'text', width: 220, editable: true },
      { key: 'prixHt', name: 'Prix HT', type: 'number', width: 110, editable: true },
      { key: 'prixTtc', name: 'Prix TTC', type: 'number', width: 110, editable: true },
      { key: 'unite', name: 'Unité', type: 'text', width: 90, editable: true },
      { key: 'categorie', name: 'Catégorie', type: 'text', width: 140, editable: true },
      { key: 'fabricant', name: 'Fabricant', type: 'text', width: 140, editable: true },
      { key: 'fournisseurCode', name: 'Code fournisseur', type: 'text', width: 140, editable: true },
      {
        key: 'source',
        name: 'Source',
        type: 'select',
        width: 130,
        editable: true,
        required: true,
        options: ['01_PROD', '02_CARPRO'],
      },
      {
        key: 'stock',
        name: 'Stock consolidé',
        type: 'text',
        width: 120,
        format: (row) => row.stock?.stockConsolide ?? '—',
      },
    ],
  },

  stock: {
    key: 'stock',
    apiPath: '/stock',
    socketTable: 'stock',
    label: 'Stock',
    subtitle: 'Quantités disponibles par référence',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'reference', name: 'Référence pièce', type: 'text', width: 160, createOnly: true, required: true },
      { key: 'totalQuantity', name: 'Quantité totale', type: 'number', width: 130, editable: true },
      { key: 'stockDisponible', name: 'Stock disponible', type: 'number', width: 130, editable: true },
      { key: 'stockConsolide', name: 'Stock consolidé', type: 'number', width: 130, editable: true },
      { key: 'statut', name: 'Statut', type: 'text', width: 130, editable: true },
    ],
  },

  fitments: {
    key: 'fitments',
    apiPath: '/fitments',
    socketTable: 'fitments',
    label: 'Compatibilités',
    subtitle: 'Pièce ↔ véhicule (fitment)',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'partReference', name: 'Référence pièce', type: 'text', width: 160, createOnly: true, required: true },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 150, createOnly: true, required: true },
      { key: 'modelName', name: 'Nom modèle', type: 'text', width: 200, editable: true, required: true },
    ],
  },

  vehicles: {
    key: 'vehicles',
    apiPath: '/vehicles',
    socketTable: 'vehicles',
    label: 'Véhicules',
    subtitle: 'Parc véhicules (VIN, immatriculation, modèle)',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'vehicleNo', name: 'N° véhicule', type: 'text', width: 130, createOnly: true, required: true },
      { key: 'vin', name: 'VIN', type: 'text', width: 190, editable: true },
      { key: 'marque', name: 'Marque', type: 'text', width: 110, editable: true },
      { key: 'modele', name: 'Modèle', type: 'text', width: 130, editable: true },
      { key: 'modeleDescription', name: 'Description modèle', type: 'text', width: 220, editable: true },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 140, editable: true },
      { key: 'immatriculation', name: 'Immatriculation', type: 'text', width: 150, editable: true },
    ],
  },

  'vehicle-model-map': {
    key: 'vehicle-model-map',
    apiPath: '/vehicle-model-map',
    socketTable: 'vehicleModelMap',
    label: 'Modèle ↔ Type code',
    subtitle: 'Table pont : nom convivial → type_code technique',
    noUpdate: true, // pure bridge table — see backend comment, delete + recreate to "edit"
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'modele', name: 'Modèle (nom convivial)', type: 'text', width: 220, createOnly: true, required: true },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 160, createOnly: true, required: true },
    ],
  },

  'vehicle-types': {
    key: 'vehicle-types',
    apiPath: '/vehicle-types',
    socketTable: 'vehicleTypeMaster',
    label: 'Types véhicules',
    subtitle: 'Table maître — un type_code par configuration réelle',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 160, createOnly: true, required: true },
      { key: 'modelName', name: 'Nom modèle', type: 'text', width: 220, editable: true, required: true },
    ],
  },

  'item-references': {
    key: 'item-references',
    apiPath: '/item-references',
    socketTable: 'itemReferences',
    label: 'Références croisées',
    subtitle: 'Références alternatives / équivalences par pièce',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'partReference', name: 'Référence pièce', type: 'text', width: 160, createOnly: true, required: true },
      { key: 'referenceNo', name: 'N° référence', type: 'text', width: 160, createOnly: true, required: true },
      { key: 'referenceType', name: 'Type', type: 'text', width: 130, editable: true },
    ],
  },

    synonyms: {
    key: 'synonyms',
    apiPath: '/synonyms',
    socketTable: 'synonyms',
    label: 'Synonymes',
    subtitle: 'Index NLP du chatbot — se recharge en temps réel',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'mot', name: 'Mot', type: 'text', width: 180, createOnly: true, required: true },
      { key: 'canonical', name: 'Canonique', type: 'text', width: 180, editable: true, required: true },
      {
        key: 'langue',
        name: 'Langue',
        type: 'select',
        width: 110,
        createOnly: true,
        required: true,
        options: ['fr', 'tn', 'stop', 'typo'],
      },
    ],
  },
};

export const ENTITY_NAV_ORDER = [
  'parts',
  'stock',
  'fitments',
  'vehicles',
  'vehicle-model-map',
  'vehicle-types',
  'item-references',
  'synonyms',
];
