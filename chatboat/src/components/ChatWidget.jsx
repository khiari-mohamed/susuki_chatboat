import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiSend, FiMoon, FiSun, FiUpload, FiCheckCircle, FiXCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { IoShieldCheckmark } from 'react-icons/io5';
import { MdOutlineSearch, MdOutlineBuild, MdOutlineCalendarMonth, MdOutlineContactSupport, MdDirectionsCar, MdBusiness, MdCarRepair, MdCalendarToday, MdSettings, MdFingerprint } from 'react-icons/md';
import config from '../config';
import './ChatWidget.css';

// ─────────────────────────────────────────────────────────────────
// FIX-1: Helper — resolves French display name from any product object.
// Mirrors getDisplayName() used throughout the backend.
// Priority: displayName → designation2 → designation → reference
// ─────────────────────────────────────────────────────────────────
const resolveDisplayName = (p) => {
  if (!p) return '';
  if (p.displayName && p.displayName.trim()) return p.displayName.trim();
  const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
  const english = (p.designation ?? '').trim();
  return french || english || p.reference || '';
};

// FIX-1: Source label
const resolveSourceLabel = (p) => {
  if (!p) return null;
  if (p.sourceLabel) return p.sourceLabel;
  if (p.source === '02_CARPRO') return 'CarPro Parts';
  if (p.source === '01_PROD')   return 'Suzuki OEM';
  return null;
};

// Agentic robot-bubble icon — unchanged
const RobotBubbleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="bubble-icon">
    <defs>
      <mask id="rb-mask">
        <rect width="32" height="32" fill="white" />
        <circle cx="12" cy="13" r="2.3" fill="black" />
        <circle cx="20" cy="13" r="2.3" fill="black" />
      </mask>
    </defs>
    <rect x="1"    y="11.5" width="3.5" height="6" rx="1.75" fill="white" />
    <rect x="27.5" y="11.5" width="3.5" height="6" rx="1.75" fill="white" />
    <g mask="url(#rb-mask)">
      <circle cx="16" cy="13" r="10" fill="white" />
      <path d="M13 22.5 L16 27.5 L19 22.5 Z" fill="white" />
    </g>
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// FIX-2: ProductDetailCard — shown below bot messages when
// productsDetail[] is present. Collapsed by default for clean UX,
// expandable for testing. Preserves all existing message styling.
// ─────────────────────────────────────────────────────────────────
const ProductDetailCard = ({ product, index }) => {
  const [expanded, setExpanded] = useState(false);
  if (!product) return null;

  const displayName  = resolveDisplayName(product);
  const sourceLabel  = resolveSourceLabel(product);
  const isAvailable  = product.stock?.statut === 'Disponible';
  const price        = product.prixHt ? `${parseFloat(product.prixHt).toFixed(3)} TND` : null;
  const qty          = product.stock?.totalQuantity ?? 0;
  const stockDisponible = product.stock?.stockDisponible ?? 0;
  const stockConsolide  = product.stock?.stockConsolide ?? qty;
  const alternateRefs   = product.itemReferences?.map((r) => r.referenceNo).filter(Boolean).join(', ');
  const idSource        = product.identificationSource;

  return (
    <div style={{
      marginTop:    '8px',
      border:       `1px solid ${isAvailable ? '#10b98140' : '#ef444440'}`,
      borderRadius: '10px',
      overflow:     'hidden',
      fontSize:     '12px',
      background:   'var(--bg-secondary, #f8fafc)',
    }}>
      {/* ── Always-visible summary row ── */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '8px 10px',
          cursor:         'pointer',
          gap:            '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{
            width:       '8px', height: '8px',
            borderRadius: '50%',
            background:  isAvailable ? '#10b981' : '#ef4444',
            flexShrink:  0,
          }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary, #1e293b)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName || product.reference}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {price && isAvailable && (
            <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{price}</span>
          )}
          {expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div style={{ padding: '0 10px 10px', borderTop: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
            <tbody>
              {[
                ['Nom (FR)',       displayName                                                    ],
                ['Nom (OEM)',      product.designation                                            ],
                ['Référence',      product.reference                                              ],
                ['Prix HT',        product.prixHt  ? `${parseFloat(product.prixHt ).toFixed(3)} TND` : '—'],
                ['Prix TTC',       product.prixTtc ? `${parseFloat(product.prixTtc).toFixed(3)} TND` : '—'],
                ['Unité',          product.unite                                                  ],
                ['Catégorie',      product.categorie                                              ],
                ['Fabricant',      product.fabricant                                              ],
                ['Source',         sourceLabel || product.source                                  ],
                ['Stock disponible', stockDisponible                                             ],
                ['Stock consolide',  stockConsolide                                              ],
                ['Regle disponibilite', stockConsolide > 2 ? 'stock_consolide > 2' : 'stock_consolide <= 2'],
                ['Refs alternatives', alternateRefs                                              ],
                ['VIN utilise',       idSource?.vin                                               ],
                ['No vehicule',       idSource?.vehicleNo                                         ],
                ['Modele identifie',  idSource?.modelDescription || idSource?.model               ],
                ['Codes type filtres', idSource?.typeCodes?.join(', ')                            ],
                ['Stock',          product.stock?.statut ?? '—'                                   ],
                ['Quantité',       qty > 0 ? `${qty} en stock` : '0'                             ],
                ['Score',          product.score != null ? product.score : '—'                   ],
              ]
                .filter(([, v]) => v != null && v !== '' && v !== '—' || v === '—')
                .map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '3px 6px 3px 0', color: '#64748b', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                      {label}
                    </td>
                    <td style={{ padding: '3px 0', fontWeight: 500, color: 'var(--text-primary, #1e293b)', wordBreak: 'break-word' }}>
                      {String(value ?? '—')}
                    </td>
                  </tr>
                ))}
              {/* Fitments */}
              {product.fitments?.length > 0 && (
                <tr>
                  <td style={{ padding: '3px 6px 3px 0', color: '#64748b', verticalAlign: 'top' }}>Compatibilité</td>
                  <td style={{ padding: '3px 0', wordBreak: 'break-word' }}>
                    {product.fitments.slice(0, 5).map((f, i) => (
                      <span key={i} style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', padding: '1px 5px', marginRight: '3px', marginBottom: '3px', fontSize: '11px' }}>
                        {f.modelName || f.typeCode}
                      </span>
                    ))}
                    {product.fitments.length > 5 && (
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>+{product.fitments.length - 5} autres</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FIX-3: DebugPanel — shown in dev mode only (NODE_ENV !== production)
//
//   - Rendered through a React Portal directly into document.body
//     (fix for the modal hovering/growing/disappearing bug — see
//     previous notes: a transform on any ancestor breaks position:fixed).
//   - Wider, sectioned, plain-language layout.
//   - Shows every known field from EnrichedProductField, even empty ones.
//   - NEW: "Pipeline de recherche" section — reads rawResponse.searchDebug
//     (tokens, expanded terms, DB row counts, source/stock breakdown,
//     which DB fields/tables were used for THIS specific query).
//   - NEW: "Tables & champs utilisés" — a static reference card
//     explaining, in plain language, what the search engine queries:
//     VIN/model scoping, parts text/context fields, stock, fitment,
//     item references, and what 01_PROD / 02_CARPRO mean.
//   - A "Voir toutes les données brutes" toggle still reveals the
//     complete flattened JSON for anything not covered above.
// ═══════════════════════════════════════════════════════════════════

// Flattens a nested object/array into [ [path, value], ... ] rows,
// like an Excel export of a JSON blob. Used for the "raw / complete" view.
const flattenForTable = (obj, prefix = '', rows = []) => {
  if (obj === null || obj === undefined) {
    rows.push([prefix || 'value', '—']);
    return rows;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      rows.push([prefix || 'value', '[]']);
      return rows;
    }
    obj.forEach((item, i) => {
      const path = prefix ? `${prefix}[${i}]` : `[${i}]`;
      if (item !== null && typeof item === 'object') {
        flattenForTable(item, path, rows);
      } else {
        rows.push([path, String(item)]);
      }
    });
    return rows;
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      rows.push([prefix || 'value', '{}']);
      return rows;
    }
    keys.forEach((key) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const val = obj[key];
      if (val !== null && typeof val === 'object') {
        flattenForTable(val, path, rows);
      } else {
        rows.push([path, val === undefined ? '—' : String(val)]);
      }
    });
    return rows;
  }
  rows.push([prefix || 'value', String(obj)]);
  return rows;
};

// Renders a value for the human-readable tables: blanks/nulls always
// show as a clearly-marked "— (vide)" instead of just vanishing.
const renderFieldValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>— (vide)</span>;
  }
  if (Array.isArray(value)) {
    return value.length === 0
      ? <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>— (vide)</span>
      : value.map((v, i) => (
          <span key={i} style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', padding: '1px 6px', marginRight: '4px', marginBottom: '3px', fontSize: '12px' }}>
            {String(v)}
          </span>
        ));
  }
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  return String(value);
};

// ── Field groups mirroring EnrichedProductField / Part / Stock / Fitment ──
const PRODUCT_FIELD_GROUPS = [
  {
    title: 'Identification',
    fields: [
      { label: 'Référence',              get: (p) => p.reference },
      { label: 'Nom affiché au client',  get: (p) => p.displayName },
      { label: 'Nom OEM (anglais)',      get: (p) => p.designation },
      { label: 'Nom français (brut)',    get: (p) => p.designation2 },
      { label: 'Description de recherche', get: (p) => p.searchDescription },
    ],
  },
  {
    title: 'Tarification',
    fields: [
      { label: 'Prix HT',  get: (p) => (p.prixHt  != null && p.prixHt  !== '' ? `${p.prixHt} TND`  : null) },
      { label: 'Prix TTC', get: (p) => (p.prixTtc != null && p.prixTtc !== '' ? `${p.prixTtc} TND` : null) },
      { label: 'Unité',    get: (p) => p.unite },
    ],
  },
  {
    title: 'Classification',
    fields: [
      { label: 'Catégorie',        get: (p) => p.categorie },
      { label: 'Fabricant',        get: (p) => p.fabricant },
      { label: 'Code fournisseur', get: (p) => p.fournisseurCode },
    ],
  },
  {
    title: 'Source des données',
    fields: [
      { label: 'Code source (base)', get: (p) => p.source },
      { label: 'Source (libellé)',   get: (p) => p.sourceLabel },
    ],
  },
  {
    title: 'Stock',
    fields: [
      { label: 'Statut du stock',    get: (p) => p.stock?.statut },
      { label: 'Quantité totale',    get: (p) => p.stock?.totalQuantity },
      { label: 'Stock disponible source', get: (p) => p.stock?.stockDisponible },
      { label: 'Stock consolidé',    get: (p) => p.stock?.stockConsolide },
      { label: 'Règle disponibilité', get: (p) => {
        const consolidated = Number(p.stock?.stockConsolide ?? p.stock?.totalQuantity ?? 0);
        return consolidated > 2 ? 'Disponible car stock_consolide > 2' : 'Indisponible car stock_consolide <= 2';
      } },
    ],
  },
  {
    title: 'Références alternatives',
    fields: [
      { label: 'Références/code-barres', get: (p) => p.itemReferences?.map((r) => r.referenceNo) },
      { label: 'Types de référence',     get: (p) => p.itemReferences?.map((r) => r.referenceType).filter(Boolean) },
    ],
  },
  {
    title: 'Source identification véhicule',
    fields: [
      { label: 'VIN',                    get: (p) => p.identificationSource?.vin },
      { label: 'N° véhicule',            get: (p) => p.identificationSource?.vehicleNo },
      { label: 'Modèle',                 get: (p) => p.identificationSource?.model },
      { label: 'Version / description',  get: (p) => p.identificationSource?.modelDescription },
      { label: 'Codes type compatibles', get: (p) => p.identificationSource?.typeCodes },
      { label: 'Article retenu',         get: (p) => p.identificationSource?.articleNumber },
    ],
  },
  {
    title: 'Score interne',
    fields: [
      { label: 'Score de pertinence', get: (p) => p.score },
    ],
  },
];

// ── Top-level fields mirroring EnrichedProcessMessageResponse ──
const RESPONSE_FIELD_GROUPS = [
  {
    title: 'Réponse',
    fields: [
      { label: 'Message affiché au client', get: (d) => d.response ?? d.message },
      { label: 'Intent détecté',            get: (d) => d.intent },
      { label: 'Clarification requise',     get: (d) => (d.intent === 'CLARIFICATION_NEEDED' ? 'Oui' : 'Non') },
      { label: 'Confiance (confidence)',    get: (d) => d.confidence },
      { label: 'Session ID',                get: (d) => d.sessionId },
    ],
  },
  {
    title: 'Produits retournés',
    fields: [
      { label: 'Nb produits (format legacy — products[])',   get: (d) => d.products?.length ?? 0 },
      { label: 'Nb produits enrichis (productsDetail[])',     get: (d) => d.productsDetail?.length ?? 0 },
    ],
  },
];

// ── NEW: search pipeline fields, mirroring SearchDebugInfo from the backend ──
const SEARCH_DEBUG_FIELD_GROUPS = [
  {
    title: 'Requête',
    fields: [
      { label: 'Type de recherche',        get: (d) => (d.searchType === 'reference' ? 'Recherche par référence' : 'Recherche par texte (NLP)') },
      { label: 'Texte saisi par le client', get: (d) => d.originalQuery },
      { label: 'Texte normalisé',          get: (d) => d.normalizedQuery },
      { label: 'Dialecte tunisien détecté', get: (d) => d.hasTunisianDialect },
    ],
  },
  {
    title: 'Analyse linguistique',
    fields: [
      { label: 'Mots-clés bruts (tokens)',        get: (d) => d.rawTokens },
      { label: 'Mots-clés après synonymes',       get: (d) => d.expandedTerms },
      { label: 'Type de pièce principal détecté', get: (d) => d.mainPartType },
      { label: 'Position — avant',    get: (d) => d.positionInfo?.avant },
      { label: 'Position — arrière',  get: (d) => d.positionInfo?.arriere },
      { label: 'Position — gauche',   get: (d) => d.positionInfo?.gauche },
      { label: 'Position — droite',   get: (d) => d.positionInfo?.droite },
    ],
  },
  {
    title: 'Filtrage compatibilité véhicule',
    fields: [
      { label: 'Filtre véhicule actif',      get: (d) => d.vehicleScope?.active },
      { label: 'VIN utilisé',                get: (d) => d.vehicleScope?.vin },
      { label: 'N° véhicule',                get: (d) => d.vehicleScope?.vehicleNo },
      { label: 'Modèle normalisé',           get: (d) => d.vehicleScope?.model },
      { label: 'Version / description',      get: (d) => d.vehicleScope?.modelDescription },
      { label: 'Codes type retenus',         get: (d) => d.vehicleScope?.typeCodes },
    ],
  },
  {
    title: 'Résultats base de données',
    fields: [
      { label: 'Lignes brutes trouvées en base',        get: (d) => d.dbRawCount },
      { label: 'Lignes qualifiées (après filtrage)',     get: (d) => d.qualifiedCount },
      { label: 'Lignes renvoyées au client (max 10)',    get: (d) => d.finalCount },
      { label: 'Dont pièces Suzuki OEM',                 get: (d) => d.sourceBreakdown?.suzukiOem },
      { label: 'Dont pièces CarPro Parts',                get: (d) => d.sourceBreakdown?.carproParts },
      { label: 'Dont en stock (Disponible)',              get: (d) => d.stockBreakdown?.disponible },
      { label: 'Dont hors stock (Indisponible)',          get: (d) => d.stockBreakdown?.indisponible },
    ],
  },
  {
    title: 'Champs & tables interrogés pour CETTE requête',
    fields: [
      { label: 'Champs texte recherchés (par ordre de priorité)', get: (d) => d.fieldsSearched },
      { label: 'Tables de la base interrogées',                    get: (d) => d.tablesQueried },
    ],
  },
];

// Small table used for the response-level, per-product, and search-debug groups.
const FieldGroupTable = ({ groups, source }) => (
  <>
    {groups.map((group) => (
      <div key={group.title} style={{ marginBottom: '14px' }}>
        <div style={{
          fontSize:      '12px',
          fontWeight:    700,
          color:         '#4c1d95',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          borderLeft:    '3px solid #7c3aed',
          padding:       '2px 0 2px 8px',
          marginBottom:  '6px',
        }}>
          {group.title}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <tbody>
            {group.fields.map((f, i) => (
              <tr key={f.label} style={{ background: i % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                <td style={{
                  padding:      '8px 12px',
                  width:        '46%',
                  color:        '#475569',
                  fontWeight:   600,
                  fontSize:     '13px',
                  borderBottom: '1px solid #eef2f7',
                  verticalAlign: 'top',
                }}>
                  {f.label}
                </td>
                <td style={{
                  padding:      '8px 12px',
                  color:        '#0f172a',
                  fontSize:     '13px',
                  borderBottom: '1px solid #eef2f7',
                  wordBreak:    'break-word',
                  verticalAlign: 'top',
                }}>
                  {renderFieldValue(f.get(source))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </>
);

// Full per-product breakdown, always showing every field (fitments too).
const ProductDebugBlock = ({ product, index }) => {
  const fitments = product.fitments ?? [];
  return (
    <div style={{
      marginBottom:  '18px',
      padding:       '14px 16px',
      background:    '#f1f5f9',
      borderRadius:  '10px',
      border:        '1px solid #e2e8f0',
    }}>
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   '10px',
      }}>
        <span style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b' }}>
          Produit #{index + 1} — {resolveDisplayName(product) || product.reference || 'Sans nom'}
        </span>
        <span style={{
          fontSize:     '11px',
          fontWeight:   700,
          padding:      '3px 8px',
          borderRadius: '999px',
          color:        product.stock?.statut === 'Disponible' ? '#065f46' : '#991b1b',
          background:   product.stock?.statut === 'Disponible' ? '#d1fae5' : '#fee2e2',
        }}>
          {product.stock?.statut === 'Disponible' ? 'Disponible' : 'Indisponible'}
        </span>
      </div>

      <FieldGroupTable groups={PRODUCT_FIELD_GROUPS} source={product} />

      {/* Fitments — always shown, even when empty */}
      <div style={{ marginBottom: '2px' }}>
        <div style={{
          fontSize:      '12px',
          fontWeight:    700,
          color:         '#4c1d95',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          borderLeft:    '3px solid #7c3aed',
          padding:       '2px 0 2px 8px',
          marginBottom:  '6px',
        }}>
          Compatibilité véhicules (fitments)
        </div>
        {fitments.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '4px 12px' }}>
            — (vide) — aucune compatibilité enregistrée pour ce produit
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px 12px', fontSize: '11px', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Modèle</th>
                <th style={{ textAlign: 'left', padding: '6px 12px', fontSize: '11px', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Code type</th>
              </tr>
            </thead>
            <tbody>
              {fitments.map((f, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  <td style={{ padding: '6px 12px', fontSize: '13px', borderBottom: '1px solid #eef2f7' }}>{renderFieldValue(f.modelName)}</td>
                  <td style={{ padding: '6px 12px', fontSize: '13px', borderBottom: '1px solid #eef2f7' }}>{renderFieldValue(f.typeCode)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── NEW: static reference card — always the same, explains the DB
// schema/pipeline in plain language regardless of the current query ──
const SearchArchitectureReference = () => (
  <div style={{
    marginTop:    '14px',
    padding:      '14px 16px',
    background:   '#eef2ff',
    border:       '1px solid #c7d2fe',
    borderRadius: '10px',
  }}>
    <div style={{ fontWeight: 800, fontSize: '13px', color: '#3730a3', marginBottom: '10px' }}>
      📚 Comment fonctionne la recherche (toujours vrai, quelle que soit la question posée)
    </div>

    <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.6 }}>
      <p style={{ margin: '0 0 8px' }}>
        <strong>Identification véhicule</strong> — si une carte grise est fournie, le VIN est utilisé en premier
        pour retrouver le véhicule, puis le modèle/version est converti en <code>type_code</code>. La recherche
        NLP est ensuite limitée aux articles compatibles via la table <code>fitment</code>.
      </p>

      <p style={{ margin: '0 0 8px' }}>
        <strong>Table « parts » (catalogue de pièces)</strong> — après le filtre compatibilité, le texte est
        recherché dans ces champs :
      </p>
      <ol style={{ margin: '0 0 10px', paddingLeft: '20px' }}>
        <li><code>designation_2</code> — le nom <strong>français</strong> (affiché en premier au client)</li>
        <li><code>search_description</code> — contexte NLP fourni par CarPro quand il est disponible</li>
        <li><code>designation</code> — le nom <strong>anglais OEM</strong> d'origine (utilisé si le français est vide)</li>
        <li><code>reference</code> — la référence exacte ou partielle de la pièce</li>
        <li><code>categorie</code>, <code>fabricant</code>, <code>fournisseur_code</code> — contexte catalogue secondaire</li>
        <li><code>item_references.reference_no</code> — références alternatives / codes-barres</li>
      </ol>

      <p style={{ margin: '0 0 8px' }}>
        <strong>Table « stock »</strong> — la disponibilité client est recalculée avec
        <code>stock_consolide &gt; 2</code>. <code>stock_disponible</code> et <code>total_quantity</code>
        restent visibles pour debug, mais ne suffisent pas seuls pour déclarer une pièce disponible.
      </p>

      <p style={{ margin: '0 0 8px' }}>
        <strong>Table « fitment »</strong> — indique les véhicules compatibles avec chaque pièce
        (modèle + code type interne). C'est le filtre principal après identification véhicule.
      </p>

      <p style={{ margin: '0' }}>
        <strong>Deux sources de pièces sont toujours incluses ensemble :</strong>{' '}
        <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>01_PROD</span>{' '}
        = catalogue Suzuki d'origine (OEM), et{' '}
        <span style={{ background: '#dcfce7', color: '#166534', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>02_CARPRO</span>{' '}
        = stock de gros CarPro Parts. Aucune recherche n'exclut l'une ou l'autre.
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// NEW: Full database schema mapping — every field from the Prisma
// schema that CAN reach a chat response, cross-checked against the
// actual product data returned for this request.
//   🟢 Green  = column has a real value in this response
//   🔴 Red    = column is empty, null, or not exposed by the API at all
// Tables that exist in the DB but are only used as support tables
// (vehicles, synonyms, chat_sessions, etc.) are listed separately so
// nothing in the schema is left unaccounted for.
// ═══════════════════════════════════════════════════════════════════
const DB_SCHEMA = [
  {
    table: 'parts',
    description: 'Catalogue de pièces — table principale (01_PROD + 02_CARPRO fusionnées)',
    fields: [
      { column: 'id',                 type: 'Int',            get: (p) => p?.id ?? null },
      { column: 'reference',          type: 'VarChar(50)',    get: (p) => p?.reference },
      { column: 'designation',        type: 'Text',           get: (p) => p?.designation },
      { column: 'designation_2',      type: 'VarChar(200)',   get: (p) => p?.designation2 },
      { column: 'search_description', type: 'VarChar(200)',  get: (p) => p?.searchDescription },
      { column: 'prix_ht',            type: 'Decimal(10,3)',  get: (p) => p?.prixHt },
      { column: 'prix_ttc',           type: 'Decimal(10,3)',  get: (p) => p?.prixTtc },
      { column: 'unite',              type: 'VarChar(20)',    get: (p) => p?.unite },
      { column: 'categorie',          type: 'VarChar(50)',    get: (p) => p?.categorie },
      { column: 'fabricant',          type: 'VarChar(100)',   get: (p) => p?.fabricant },
      { column: 'fournisseur_code',   type: 'VarChar(50)',    get: (p) => p?.fournisseurCode },
      { column: 'source',             type: 'VarChar(20)',    get: (p) => p?.source },
      { column: 'created_at',         type: 'DateTime',       get: () => undefined,
        note: 'Métadonnée technique — jamais renvoyée dans la réponse API' },
      { column: 'updated_at',         type: 'DateTime',       get: () => undefined,
        note: 'Métadonnée technique — jamais renvoyée dans la réponse API' },
    ],
  },
  {
    table: 'stock',
    description: 'Stock agrégé par référence (fusion stock 01_PROD + 02_CARPRO)',
    fields: [
      { column: 'reference',      type: 'VarChar(50)', get: (p) => p?.reference },
      { column: 'total_quantity', type: 'Int',         get: (p) => p?.stock?.totalQuantity },
      { column: 'stock_disponible', type: 'Int',       get: (p) => p?.stock?.stockDisponible },
      { column: 'stock_consolide',  type: 'Int',       get: (p) => p?.stock?.stockConsolide,
        note: 'Règle client: disponible seulement si stock_consolide > 2' },
      { column: 'statut',         type: 'VarChar(20)', get: (p) => p?.stock?.statut },
      { column: 'updated_at',     type: 'DateTime',    get: () => undefined,
        note: 'Métadonnée technique — jamais renvoyée dans la réponse API' },
    ],
  },
  {
    table: 'fitment',
    description: 'Compatibilité pièce ↔ type de véhicule',
    fields: [
      { column: 'part_reference', type: 'VarChar(50)',  get: (p) => p?.reference },
      { column: 'type_code',      type: 'VarChar(30)',  get: (p) => p?.fitments?.[0]?.typeCode },
      { column: 'model_name',     type: 'VarChar(100)', get: (p) => p?.fitments?.[0]?.modelName,
        note: 'Redondant — contient parfois un code type interne plutôt qu\'un nom convivial' },
    ],
  },
  {
    table: 'item_references',
    description: 'Références / codes-barres alternatifs (secours de la recherche par référence)',
    fields: [
      { column: 'part_reference', type: 'VarChar(50)', get: (p) => p?.reference },
      { column: 'reference_no',   type: 'VarChar(50)', get: (p) => p?.itemReferences?.[0]?.referenceNo },
      { column: 'reference_type', type: 'VarChar(20)', get: (p) => p?.itemReferences?.[0]?.referenceType },
    ],
  },
  {
    table: 'identification_source',
    description: 'Preuve renvoyée avec chaque résultat quand un véhicule a été identifié',
    fields: [
      { column: 'vin',               type: 'VarChar(17)',  get: (p) => p?.identificationSource?.vin },
      { column: 'vehicle_no',        type: 'VarChar(50)',  get: (p) => p?.identificationSource?.vehicleNo },
      { column: 'modele',            type: 'VarChar(100)', get: (p) => p?.identificationSource?.model },
      { column: 'modele_description', type: 'Text',        get: (p) => p?.identificationSource?.modelDescription },
      { column: 'type_codes',        type: 'String[]',     get: (p) => p?.identificationSource?.typeCodes },
      { column: 'article_number',    type: 'VarChar(50)',  get: (p) => p?.identificationSource?.articleNumber },
    ],
  },
];

// Tables that support the pipeline but are not displayed as product rows.
const DB_SCHEMA_NOT_USED_IN_CHAT = [
  { table: 'vehicles',            description: 'Utilisée pour retrouver le véhicule par VIN / N° véhicule avant la recherche pièces' },
  { table: 'vehicle_model_map',   description: 'Utilisée pour convertir le modèle identifié en code type compatible' },
  { table: 'vehicle_type_master', description: 'Utilisée en secours pour retrouver les codes types internes (ex : ABU310-TYPE1)' },
  { table: 'synonyms',            description: 'Synonymes / dialecte tunisien utilisés par le moteur de recherche' },
  { table: 'chat_sessions',       description: 'Sessions de conversation' },
  { table: 'chat_messages',       description: 'Messages individuels de chaque session' },
  { table: 'chat_prompts',        description: 'Historique prompt / réponse IA' },
  { table: 'chat_feedback',       description: 'Notes et retours utilisateurs sur les réponses' },
  { table: 'upload_tracking',     description: 'Suivi des téléchargements de carte grise' },
];

// Renders one table's field list, color-coded green/red against a sample product.
const SchemaTableBlock = ({ table, description, fields, sampleProduct }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{
      fontSize:      '12px',
      fontWeight:    700,
      color:         '#1e293b',
      background:    '#e2e8f0',
      padding:       '6px 10px',
      borderRadius:  '6px 6px 0 0',
    }}>
      Table <code>{table}</code> — {description}
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '11px', color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Colonne</th>
          <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '11px', color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Type</th>
          <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '11px', color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Valeur (produit #1)</th>
          <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '11px', color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Statut</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((f) => {
          const rawValue = sampleProduct ? f.get(sampleProduct) : undefined;
          const isPresent = rawValue !== undefined && rawValue !== null && rawValue !== '' && (!Array.isArray(rawValue) || rawValue.length > 0);
          return (
            <tr key={f.column} style={{ background: isPresent ? '#dcfce7' : '#fee2e2' }}>
              <td style={{ padding: '6px 10px', fontSize: '12px', fontFamily: 'monospace', color: '#0f172a', borderBottom: '1px solid #fff' }}>
                {f.column}
              </td>
              <td style={{ padding: '6px 10px', fontSize: '12px', color: '#475569', borderBottom: '1px solid #fff' }}>
                {f.type}
              </td>
              <td style={{ padding: '6px 10px', fontSize: '12px', color: '#0f172a', wordBreak: 'break-word', borderBottom: '1px solid #fff' }}>
                {isPresent ? String(rawValue) : (f.note || '— (vide)')}
              </td>
              <td style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, color: isPresent ? '#166534' : '#991b1b', borderBottom: '1px solid #fff' }}>
                {isPresent ? '✅ Utilisé' : '❌ Vide / non utilisé'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const DbSchemaMappingSection = ({ productsDetail }) => {
  const sampleProduct = productsDetail && productsDetail.length > 0 ? productsDetail[0] : null;

  return (
    <div style={{ marginTop: '4px' }}>
      {!sampleProduct && (
        <div style={{
          fontSize: '12px', color: '#92400e', background: '#fef3c7',
          border: '1px solid #fde68a', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px',
        }}>
          ⚠️ Aucun produit renvoyé pour cette réponse — toutes les colonnes ci-dessous
          s'affichent donc comme « vide », ce qui est normal ici (pas une erreur).
        </div>
      )}
      {productsDetail && productsDetail.length > 1 && (
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', fontStyle: 'italic' }}>
          {productsDetail.length} produits renvoyés — le tableau ci-dessous montre le produit #1 comme échantillon.
        </div>
      )}

      {DB_SCHEMA.map((tbl) => (
        <SchemaTableBlock
          key={tbl.table}
          table={tbl.table}
          description={tbl.description}
          fields={tbl.fields}
          sampleProduct={sampleProduct}
        />
      ))}

      <div style={{
        marginTop:    '10px',
        padding:      '12px 14px',
        background:   '#fee2e2',
        border:       '1px solid #fecaca',
        borderRadius: '8px',
      }}>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#991b1b', marginBottom: '6px' }}>
          🔴 Tables de support — utilisées par la recherche, non affichées comme produits
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {DB_SCHEMA_NOT_USED_IN_CHAT.map((t, i) => (
              <tr key={t.table} style={{ background: i % 2 === 0 ? '#fef2f2' : 'transparent' }}>
                <td style={{ padding: '4px 8px', fontSize: '12px', fontFamily: 'monospace', color: '#7f1d1d', whiteSpace: 'nowrap' }}>
                  {t.table}
                </td>
                <td style={{ padding: '4px 8px', fontSize: '12px', color: '#7f1d1d' }}>
                  {t.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// DebugPanel — updated to include the new DB schema mapping section
// (everything else identical to the previous version)
// ═══════════════════════════════════════════════════════════════════
const DebugPanel = ({ rawResponse }) => {
  const [open, setOpen]       = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  if (!rawResponse || process.env.NODE_ENV === 'production') return null;

  const productsDetail = rawResponse.productsDetail || [];
  const searchDebug     = rawResponse.searchDebug || null;
  const rawRows = showRaw ? flattenForTable(rawResponse) : [];

  const modal = (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999999, padding: '24px', boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: '14px', width: 'min(1080px, 94vw)',
          maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 70px rgba(0,0,0,0.45)', fontFamily: "'Segoe UI', Arial, sans-serif",
          boxSizing: 'border-box', overflow: 'hidden',
        }}
      >
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#4c1d95',
        }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>
              🔍 Panneau de débogage — réponse complète de l'API
            </div>
            <div style={{ color: '#ddd6fe', fontSize: '12px', marginTop: '2px' }}>
              Réponse, produits, moteur de recherche et correspondance base de données
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto', minHeight: 0, flex: 1, padding: '18px 20px' }}>

          <FieldGroupTable groups={RESPONSE_FIELD_GROUPS} source={rawResponse} />

          <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', margin: '18px 0 10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            🗄️ Moteur de recherche & base de données (pour cette question)
          </div>

          {!searchDebug ? (
            <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '8px 4px' }}>
              — (vide) — cette réponse n'est pas passée par le moteur de recherche
            </div>
          ) : (
            <FieldGroupTable groups={SEARCH_DEBUG_FIELD_GROUPS} source={searchDebug} />
          )}

          <SearchArchitectureReference />

          {/* ── NEW: full DB schema mapping, green = used, red = empty ── */}
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', margin: '18px 0 10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            🗂️ Correspondance avec les tables de la base de données
          </div>
          <DbSchemaMappingSection productsDetail={productsDetail} />

          <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', margin: '18px 0 10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            📦 Produits enrichis ({productsDetail.length})
          </div>

          {productsDetail.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '8px 4px' }}>
              — (vide) — aucun produit dans productsDetail[] pour cette réponse
            </div>
          ) : (
            productsDetail.map((p, i) => (
              <ProductDebugBlock key={p.reference || i} product={p} index={i} />
            ))
          )}

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setShowRaw(!showRaw)}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
            >
              {showRaw ? '▲ Masquer les données brutes' : '▼ Voir toutes les données brutes (JSON complet)'}
            </button>

            {showRaw && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontFamily: 'monospace', fontSize: '11px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>Champ</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {rawRows.map(([field, value], i) => (
                    <tr key={`${field}-${i}`} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                      <td style={{ padding: '5px 8px', color: '#1e293b', whiteSpace: 'nowrap', borderBottom: '1px solid #eef2f7', verticalAlign: 'top' }}>{field}</td>
                      <td style={{ padding: '5px 8px', color: '#334155', wordBreak: 'break-all', borderBottom: '1px solid #eef2f7', verticalAlign: 'top' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ flexShrink: 0, padding: '10px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
          Panneau visible uniquement hors production
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: '6px' }}>
      <button
        onClick={() => setOpen(true)}
        style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace' }}
      >
        ▼ Debug response
      </button>
      {open && ReactDOM.createPortal(modal, document.body)}
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen,             setIsOpen]             = useState(false);
  const [messages,           setMessages]           = useState([{
    id: 1, text: "Bonjour! Je suis votre assistant AI de Suzuki Tunisie. Quelles pièces de rechange vous cherchez aujourd'hui?",
    sender: 'bot', timestamp: new Date(),
  }]);
  const [inputValue,         setInputValue]         = useState('');
  const [isTyping,           setIsTyping]           = useState(false);
  const [isDark,             setIsDark]             = useState(false);
  const [isVerified,         setIsVerified]         = useState(false);
  const [uploadedFile,       setUploadedFile]       = useState(null);
  const [isVerifying,        setIsVerifying]        = useState(false);
  const [verificationError,  setVerificationError]  = useState('');
  const [isDragging,         setIsDragging]         = useState(false);
  const [vehicleInfo,        setVehicleInfo]        = useState(null);
  const [showVehicleCard,    setShowVehicleCard]    = useState(false);
  const [sessionId,          setSessionId]          = useState(null);
  const [uploadProgress,     setUploadProgress]     = useState(0);
  const [imagePreview,       setImagePreview]       = useState(null);
  const messagesEndRef    = useRef(null);
  const fileInputRef      = useRef(null);
  const verifyTimeoutRef  = useRef(null);

  const logoUrl = (typeof window !== 'undefined' && window.suzukiChatbotConfig?.logoUrl) || '/suzuli_logo.png';
  const quickActions = [];

  useEffect(() => {
    console.log('🔧 Suzuki Chatbot Config:', { apiUrl: config.apiUrl, environment: process.env.NODE_ENV, timestamp: new Date().toISOString() });
    const originalError = console.error;
    console.error = (...args) => { if (args[0]?.includes?.('message channel closed')) return; originalError.apply(console, args); };
    return () => { console.error = originalError; };
  }, []);

  useEffect(() => {
    scrollToBottom();
    const theme = localStorage.getItem('suzuki-theme');
    if (theme === 'dark') setIsDark(true);
    sessionStorage.clear();
    return () => { if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current); };
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { localStorage.setItem('suzuki-theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = '';

    const validTypes = ['image/png','image/jpg','image/jpeg','image/webp','image/gif','image/bmp','image/tiff','image/heic','image/heif','application/pdf'];
    if (!validTypes.includes(file.type)) { setVerificationError('Format non supporté. Utilisez PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, HEIC, ou PDF.'); return; }
    if (file.size > 15 * 1024 * 1024)   { setVerificationError('Fichier trop volumineux. Maximum 15MB.'); return; }
    if (file.size === 0)                  { setVerificationError('Le fichier est vide.'); return; }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    setUploadedFile(file);
    setVerificationError('');
    setUploadProgress(0);
    verifyDocument(file);
  };

  const verifyDocument = async (file) => {
    setIsVerifying(true);
    setVerificationError('');
    console.log('🔍 Verifying file:', { name: file.name, size: file.size, type: file.type });
    let progressInterval = null;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadUrl = `${config.apiUrl}/verification/upload`;
      console.log('📤 Uploading to:', uploadUrl);

      progressInterval = setInterval(() => {
        setUploadProgress((prev) => { if (prev >= 90) { clearInterval(progressInterval); return 90; } return prev + 10; });
      }, 300);

      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      clearInterval(progressInterval); progressInterval = null;
      setUploadProgress(95);
      console.log('📤 Upload response status:', response.status);

      if (!response.ok && response.status !== 400 && response.status !== 201) {
        if (response.status === 413) throw new Error('Fichier trop volumineux pour le serveur. Maximum 15MB.');
        throw new Error(`Erreur serveur (${response.status}). Veuillez réessayer.`);
      }

      const data = await response.json().catch(() => { throw new Error('Réponse serveur invalide. Veuillez réessayer.'); });
      console.log('📊 Upload response data:', data);
      setUploadProgress(100);

      if (data.success) {
        setVehicleInfo(data.vehicleInfo);
        const tid = setTimeout(() => {
          setIsVerified(true);
          setMessages((prev) => [...prev, { id: Date.now(), text: 'VEHICLE_INFO', vehicleData: data.vehicleInfo, sender: 'bot', timestamp: new Date() }]);
        }, 500);
        verifyTimeoutRef.current = tid;
      } else {
        setVerificationError(data.message || 'Seules les cartes grises Suzuki sont acceptées.');
        setUploadedFile(null); setImagePreview(null); setUploadProgress(0);
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setVerificationError(error.message || 'Erreur de connexion. Veuillez réessayer.');
      setUploadedFile(null); setImagePreview(null); setUploadProgress(0);
    } finally {
      if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
      setIsVerifying(false);
    }
  };

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop      = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); };
  const scrollToBottom  = ()  => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: handleSend — now reads productsDetail[] from the enriched
  // API response and stores it on the bot message object.
  // Backward-compat: still reads data.products for the summary badge.
  // ─────────────────────────────────────────────────────────────────
  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || inputValue.trim();
    if (!textToSend) return;

    const userMessage = { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) setInputValue('');
    setIsTyping(true);

    try {
      const chatUrl = `${config.apiUrl}/chat/message`;
      console.log('💬 Sending to:', chatUrl, { message: textToSend, sessionId });

      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, vehicle: vehicleInfo, sessionId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Chat response:', data);

      if (data.sessionId && !sessionId) setSessionId(data.sessionId);

      // FIX-4: Read productsDetail[] (enriched) alongside legacy products[]
      const productsDetail = data.productsDetail || [];
      const legacyProducts = data.products       || [];

      // Log all fields for testing
      if (productsDetail.length > 0) {
        console.log('🔍 [TESTING] productsDetail fields:', productsDetail.map((p) => ({
          displayName:     p.displayName,
          designation:     p.designation,
          designation2:    p.designation2,
          reference:       p.reference,
          prixHt:          p.prixHt,
          prixTtc:         p.prixTtc,
          unite:           p.unite,
          categorie:       p.categorie,
          fabricant:       p.fabricant,
          source:          p.source,
          sourceLabel:     p.sourceLabel,
          statut:          p.stock?.statut,
          totalQuantity:   p.stock?.totalQuantity,
          stockDisponible: p.stock?.stockDisponible,
          stockConsolide:  p.stock?.stockConsolide,
          itemReferences:  p.itemReferences,
          identificationSource: p.identificationSource,
          fitmentCount:    p.fitments?.length,
          score:           p.score,
        })));
      }

      const botMessage = {
        id:              Date.now() + 1,
        text:            data.response || data.message || 'Réponse reçue',
        sender:          'bot',
        timestamp:       new Date(),
        isClarification: data.intent === 'CLARIFICATION_NEEDED',
        // FIX-4: store both shapes
        products:        legacyProducts,
        productsDetail,              // ← enriched array with all fields
        intent:          data.intent,
        confidence:      data.confidence,
        // FIX-3: store raw response for debug panel
        _rawResponse:    process.env.NODE_ENV !== 'production' ? data : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: `Désolé, erreur de connexion : ${error.message}. Veuillez réessayer.`,
        sender: 'bot', timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClarificationClick = (variant) => handleSend(variant.replace(/^[•\-\s]+/, '').trim());

  const parseClarificationVariants = (text) => {
    if (!text) return null;
    const variants = text.split('\n').filter((l) => /^[•\-]\s/.test(l.trim())).map((l) => l.replace(/^[•\-\s]+/, '').trim()).filter(Boolean);
    return variants.length >= 2 ? variants : null;
  };

  const formatBotText = (text) => {
    if (!text) return '';
    const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
    let formatted = escaped.replace(/(\d+[.,]\d{3})\s*TND/g, '<span class="price-tag">$1 TND</span>');
    formatted = formatted.replace(/\b(Disponible)\b/g,   '<span class="status-disponible">$1</span>');
    formatted = formatted.replace(/\b(Indisponible)\b/g, '<span class="status-indisponible">$1</span>');
    // FIX-1: Highlight CarPro Parts source label
    formatted = formatted.replace(/\[CarPro\]/g, '<span class="source-carpro">[CarPro]</span>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  const handleQuickAction = (action) => {
    const actionMessages = { search: 'Je cherche une pièce de rechange', maintenance: "Quel est l'entretien recommandé ?", appointment: 'Je voudrais prendre un rendez-vous', contact: 'Comment puis-je vous contacter ?' };
    const text = actionMessages[action];
    if (text) handleSend(text);
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' });

  // ─────────── Vehicle card screen (unchanged design) ───────────
  if (showVehicleCard && vehicleInfo) {
    return (
      <div className={`verification-modal ${isDark ? 'dark' : ''}`}>
        <div className="vehicle-card">
          <div className="vehicle-header">
            <div style={{ width:'80px',height:'80px',background:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px',boxShadow:'0 8px 24px rgba(0,0,0,0.15)',padding:'12px' }}>
              <img src={logoUrl} alt="Suzuki" style={{ width:'100%',height:'100%',objectFit:'contain' }} />
            </div>
            <FiCheckCircle className="success-icon" style={{ width:'48px',height:'48px' }} />
            <h2>Véhicule identifié</h2>
          </div>
          <div className="vehicle-info">
            <div className="vehicle-brand">
              <IoShieldCheckmark className="brand-icon" />
              <div>
                <h3>SUZUKI {vehicleInfo.modele} {vehicleInfo.annee}</h3>
                <p className="vehicle-model">{vehicleInfo.modele}</p>
              </div>
            </div>
            <div className="vehicle-details">
              <div className="vehicle-table">
                {[
                  [<MdDirectionsCar className="table-icon"/>, 'Immatriculation', vehicleInfo.immatriculation],
                  [<MdBusiness      className="table-icon"/>, 'Marque',          vehicleInfo.marque],
                  [<MdCarRepair     className="table-icon"/>, 'Modèle',          vehicleInfo.modele],
                  [<MdCalendarToday className="table-icon"/>, 'Année',           vehicleInfo.annee],
                  ...(vehicleInfo.type ? [[<MdSettings    className="table-icon"/>, 'Type', vehicleInfo.type]]   : []),
                  ...(vehicleInfo.vin  ? [[<MdFingerprint className="table-icon"/>, 'VIN',  vehicleInfo.vin]]    : []),
                ].map(([icon, label, value]) => (
                  <div key={label} className="table-row">
                    <div className="table-cell">{icon}<span className="table-label">{label}</span></div>
                    <div className="table-cell"><span className={`table-value${label==='VIN'?' vin-code':''}`}>{value}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="vehicle-footer">
            <p>Merci !</p>
            <p className="footer-subtitle">Demandez vos pièces de rechange en toute simplicité.</p>
            <button className="continue-btn" onClick={() => {
              setShowVehicleCard(false); setIsVerified(true);
              setMessages((prev) => [...prev, { id: Date.now(), text: `Parfait ! Votre ${vehicleInfo.marque} ${vehicleInfo.modele} (${vehicleInfo.immatriculation}) est maintenant enregistré. Demandez-moi vos pièces de rechange !`, sender: 'bot', timestamp: new Date() }]);
            }}>
              Continuer vers le chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────── Verification / upload screen (unchanged design) ──
  if (!isVerified) {
    return (
      <>
        <div className={`chat-bubble ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
          <RobotBubbleIcon /><div className="bubble-badge">1</div><div className="bubble-pulse"></div>
        </div>
        <div className={`chat-container ${isOpen ? 'open' : ''} ${isDark ? 'dark' : ''}`}>
          <div className="chat-header">
            <div className="header-content">
              <div className="header-logo">
                <div className="logo-circle">
                  <img src={logoUrl} alt="Suzuki" style={{ width:'48px',height:'48px',objectFit:'contain' }} />
                </div>
                <div className="header-text">
                  <h3>Suzuki AI Assistant</h3>
                  <span className="status"><span className="status-dot"></span>Vérification requise</span>
                </div>
              </div>
              <div style={{ display:'flex',gap:'8px' }}>
                <button className="theme-btn" onClick={() => setIsDark(!isDark)}>{isDark ? <FiSun /> : <FiMoon />}</button>
                <button className="close-btn" onClick={() => setIsOpen(false)}><FiX /></button>
              </div>
            </div>
          </div>
          <div className="verification-content-inline">
            <div className="verification-header-inline">
              <h3 style={{ color:'var(--suzuki-blue)' }}>Votre expert intelligent en pièces de rechanges</h3>
              <p>Bonjour merci de télécharger votre carte grise Suzuki</p>
            </div>
            <div
              className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'uploaded' : ''}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => !isVerifying && fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*,.png,.jpg,.jpeg,.webp,.pdf"
                onChange={(e) => handleFileSelect(e.target.files[0])} style={{ display:'none' }} />
              {isVerifying ? (
                <div className="upload-status">
                  {imagePreview && (
                    <div className="upload-preview" style={{ opacity: uploadProgress >= 95 ? 0 : 1, transition:'opacity 0.4s ease', pointerEvents:'none' }}>
                      <img src={imagePreview} alt="Aperçu carte grise" />
                    </div>
                  )}
                  <div className="progress-container">
                    <div className="progress-bar"><div className="progress-fill" style={{ width:`${uploadProgress}%` }}></div></div>
                    <p className="progress-text">{uploadProgress}%</p>
                  </div>
                  <p style={{ fontSize:'13px',color:'#64748b',marginTop:'8px' }}>
                    {uploadProgress < 30 ? 'Téléchargement...' : uploadProgress < 95 ? 'Analyse en cours...' : 'Extraction des informations...'}
                  </p>
                </div>
              ) : uploadedFile ? (
                <div className="upload-status"><FiCheckCircle className="status-icon success" /><p>{uploadedFile.name}</p></div>
              ) : (
                <>
                  <FiUpload className="upload-icon" />
                  <p className="upload-title">téléchargez votre carte grise</p>
                  <p className="upload-subtitle">PNG, JPG, JPEG, WEBP, PDF • Glissez-déposez ou cliquez</p>
                </>
              )}
            </div>
            {verificationError && (
              <div className="error-message"><FiXCircle /><span>{verificationError}</span></div>
            )}
          </div>
          <div className="chat-footer"><span>Powered by Suzuki AI</span></div>
        </div>
      </>
    );
  }

  // ─────────── Main chat screen ──────────────────────────────────
  return (
    <>
      <div className={`chat-bubble ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <RobotBubbleIcon /><div className="bubble-badge">1</div><div className="bubble-pulse"></div>
      </div>

      <div className={`chat-container ${isOpen ? 'open' : ''} ${isDark ? 'dark' : ''}`}>
        <div className="chat-header">
          <div className="header-content">
            <div className="header-logo">
              <div className="logo-circle">
                <img src={logoUrl} alt="Suzuki" style={{ width:'40px',height:'40px',objectFit:'contain' }} />
              </div>
              <div className="header-text">
                <h3>Suzuki AI Assistant</h3>
                <span className="status"><span className="status-dot"></span>En ligne</span>
              </div>
            </div>
            <div style={{ display:'flex',gap:'8px' }}>
              <button className="theme-btn" onClick={() => setIsDark(!isDark)}>{isDark ? <FiSun /> : <FiMoon />}</button>
              <button className="close-btn" onClick={() => setIsOpen(false)}><FiX /></button>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="bot-avatar"><img src={logoUrl} alt="Suzuki" /></div>
              )}

              {/* ── VEHICLE_INFO card (unchanged) ── */}
              {msg.text === 'VEHICLE_INFO' ? (
                <div className="message-content vehicle-info-card">
                  <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px' }}>
                    <FiCheckCircle style={{ color:'#10b981',fontSize:'20px' }} />
                    <strong>Véhicule identifié!</strong>
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',gap:'8px',marginBottom:'12px' }}>
                    {[
                      [<MdBusiness    style={{color:'#3b82f6',fontSize:'18px'}}/>, 'Marque',          msg.vehicleData.marque],
                      [<MdCarRepair   style={{color:'#3b82f6',fontSize:'18px'}}/>, 'Modèle',          msg.vehicleData.modele],
                      [<MdCalendarToday style={{color:'#3b82f6',fontSize:'18px'}}/>, 'Année',         msg.vehicleData.annee],
                      [<MdDirectionsCar style={{color:'#3b82f6',fontSize:'18px'}}/>, 'Immatriculation', msg.vehicleData.immatriculation],
                    ].map(([icon, label, value]) => (
                      <div key={label} style={{ display:'flex',alignItems:'center',gap:'8px' }}>
                        {icon}<span><strong>{label}:</strong> {value}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ marginTop:'12px',color:'#64748b' }}>Parfait ! Demandez-moi vos pièces de rechange !</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>

              ) : msg.sender === 'user' ? (
                /* ── User messages — plain text, no dangerouslySetInnerHTML ── */
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>

              ) : (
                /* ── Bot messages ── */
                <div className={`message-content ${msg.isClarification ? 'clarification-message' : ''}`}>
                  {/* Formatted response text (XSS-safe via formatBotText) */}
                  <p dangerouslySetInnerHTML={{ __html: formatBotText(msg.text) }} />

                  {/* Clarification buttons — unchanged behaviour */}
                  {(() => {
                    const variants = msg.isClarification ? parseClarificationVariants(msg.text) : null;
                    return variants ? (
                      <div className="clarification-buttons">
                        {variants.map((v, i) => (
                          <button key={i} className="clarification-btn" onClick={() => handleClarificationClick(v)}>{v}</button>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {/* FIX-2: Product detail cards — one per product in productsDetail[] */}
                  {msg.productsDetail?.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      {msg.productsDetail.map((p, i) => (
                        <ProductDetailCard key={p.reference || i} product={p} index={i} />
                      ))}
                    </div>
                  )}

                  {/* FIX-3: Debug panel — dev only, hidden in production */}
                  <DebugPanel rawResponse={msg._rawResponse} />

                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button key={idx} className="quick-action-btn" onClick={() => handleQuickAction(action.action)}>
                <Icon className="action-icon" /><span className="action-text">{action.text}</span>
              </button>
            );
          })}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Écrivez votre message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={!inputValue.trim()}>
            <FiSend />
          </button>
        </div>

        <div className="chat-footer"><span>Powered by Suzuki AI</span></div>
      </div>
    </>
  );
};

export default ChatWidget;
