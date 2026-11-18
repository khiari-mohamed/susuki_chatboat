// Single source of truth for what the generic <EntityPage> renders for each catalog table.
// Field `key`s match the backend (camelCase).
//
// `erpSourced: true` = fed one way from the ERP (CarPro email 21/09): read-only in the dashboard,
//   so these entities carry no editable / createOnly / required flags. The real guard is the
//   backend (no write route on these tables); the page also asks GET <apiPath>/meta.
//
// Column flags (only meaningful on non-ERP entities such as synonyms):
//   editable    — editable cell in the grid, sent on PUT
//   createOnly  — only settable when creating a row
//   required    — required in the "Add" modal form
//   type        — 'text' | 'number' | 'select'
//   options     — for type: 'select'

export const ENTITIES = {
  parts: {
    key: 'parts',
    apiPath: '/parts',
    socketTable: 'parts',
    erpSourced: true,
    label: 'Pièces',
    subtitle: 'Catalogue produit — alimenté par l\'ERP',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'reference', name: 'Référence', type: 'text', width: 150 },
      { key: 'designation', name: 'Désignation (EN)', type: 'text', width: 240 },
      { key: 'designation2', name: 'Désignation FR ★', type: 'text', width: 240 },
      { key: 'searchDescription', name: 'Description recherche', type: 'text', width: 220 },
      { key: 'prixHt', name: 'Prix HT', type: 'number', width: 110 },
      { key: 'prixTtc', name: 'Prix TTC', type: 'number', width: 110 },
      { key: 'prixPublic', name: 'Prix public (HT)', type: 'number', width: 130 },
      { key: 'unite', name: 'Unité', type: 'text', width: 90 },
      { key: 'categorie', name: 'Catégorie', type: 'text', width: 140 },
      { key: 'fabricant', name: 'Fabricant', type: 'text', width: 140 },
      { key: 'fournisseurCode', name: 'Code fournisseur', type: 'text', width: 140 },
      { key: 'source', name: 'Source', type: 'text', width: 130 },
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
    erpSourced: true,
    label: 'Stock',
    subtitle: 'Quantités par référence — alimenté par l\'ERP (disponible si stock consolidé ≥ 2)',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'reference', name: 'Référence pièce', type: 'text', width: 160 },
      { key: 'totalQuantity', name: 'Quantité totale', type: 'number', width: 130 },
      { key: 'stockDisponible', name: 'Stock disponible', type: 'number', width: 130 },
      { key: 'stockConsolide', name: 'Stock consolidé', type: 'number', width: 130 },
      { key: 'statut', name: 'Statut', type: 'text', width: 130 },
    ],
  },

  fitments: {
    key: 'fitments',
    apiPath: '/fitments',
    socketTable: 'fitments',
    erpSourced: true,
    label: 'Compatibilités',
    subtitle: 'Pièce ↔ véhicule (fitment) — alimenté par l\'ERP',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'partReference', name: 'Référence pièce', type: 'text', width: 160 },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 150 },
      { key: 'modelName', name: 'Nom modèle', type: 'text', width: 200 },
    ],
  },

  vehicles: {
    key: 'vehicles',
    apiPath: '/vehicles',
    socketTable: 'vehicles',
    erpSourced: true,
    label: 'Véhicules',
    subtitle: 'Parc véhicules (VIN, immatriculation, modèle) — alimenté par l\'ERP',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'vehicleNo', name: 'N° véhicule', type: 'text', width: 130 },
      { key: 'vin', name: 'VIN', type: 'text', width: 190 },
      { key: 'marque', name: 'Marque', type: 'text', width: 110 },
      { key: 'modele', name: 'Modèle', type: 'text', width: 130 },
      { key: 'modeleDescription', name: 'Description modèle', type: 'text', width: 220 },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 140 },
      { key: 'immatriculation', name: 'Immatriculation', type: 'text', width: 150 },
    ],
  },

  'vehicle-model-map': {
    key: 'vehicle-model-map',
    apiPath: '/vehicle-model-map',
    socketTable: 'vehicleModelMap',
    erpSourced: true,
    label: 'Modèle ↔ Type code',
    subtitle: 'Table pont : nom convivial → type_code technique — alimenté par l\'ERP',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'modele', name: 'Modèle (nom convivial)', type: 'text', width: 220 },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 160 },
    ],
  },

  'vehicle-types': {
    key: 'vehicle-types',
    apiPath: '/vehicle-types',
    socketTable: 'vehicleTypeMaster',
    erpSourced: true,
    label: 'Types véhicules',
    subtitle: 'Table maître — un type_code par configuration réelle — alimenté par l\'ERP',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'typeCode', name: 'Type code', type: 'text', width: 160 },
      { key: 'modelName', name: 'Nom modèle', type: 'text', width: 220 },
    ],
  },

  'item-references': {
    key: 'item-references',
    apiPath: '/item-references',
    socketTable: 'itemReferences',
    erpSourced: true,
    label: 'Références croisées',
    subtitle: 'Références alternatives / équivalences par pièce — alimenté par l\'ERP',
    columns: [
      { key: 'id', name: 'ID', type: 'number', width: 70 },
      { key: 'partReference', name: 'Référence pièce', type: 'text', width: 160 },
      { key: 'referenceNo', name: 'N° référence', type: 'text', width: 160 },
      { key: 'referenceType', name: 'Type', type: 'text', width: 130 },
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