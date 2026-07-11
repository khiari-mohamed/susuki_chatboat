// src/pages/DebugScanPage.jsx
// ═══════════════════════════════════════════════════════════════════
// Standalone full-database debug/scan page — mounted at /debug.
// Has nothing to do with the chat widget. Pulls live data from:
//   GET  /debug/scan
//   POST /debug/check-references
//
// Sections:
//   1. Total counts (parts, stock, fitments, item references)
//   2. Full column-by-column scan of every table, with usage notes
//      and green/red completeness highlighting
//   3. Claims checklist — verifies specific promises from the email
//      (stock consolidation, CarPro inclusion, designation_2 /
//      search_description backfill) against live numbers
//   4. Reference-level checker — paste the 20 references from the
//      email and get a green/red field-by-field table + summary
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useCallback } from 'react';
import config from '../config';

const cardStyle = {
  background:   '#fff',
  border:       '1px solid #e2e8f0',
  borderRadius: '12px',
  padding:      '18px 20px',
  boxShadow:    '0 1px 3px rgba(0,0,0,0.06)',
};

const sectionTitleStyle = {
  fontSize:   '18px',
  fontWeight: 800,
  color:      '#1e293b',
  margin:     '28px 0 14px',
  display:    'flex',
  alignItems: 'center',
  gap:        '8px',
};

function StatCard({ label, value, sub }) {
  return (
    <div style={{ ...cardStyle, minWidth: '180px', flex: 1 }}>
      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

function ColumnTable({ table, columns }) {
  return (
    <div style={{ ...cardStyle, marginBottom: '18px', padding: 0, overflow: 'hidden' }}>
      <div style={{ background: '#1e293b', color: '#fff', padding: '10px 16px', fontWeight: 700, fontSize: '14px' }}>
        Table <code style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{table}</code>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={thStyle}>Colonne</th>
            <th style={thStyle}>Utilisée dans la recherche ?</th>
            <th style={thStyle}>Rôle / utilité</th>
            <th style={thStyle}>Remplie</th>
            <th style={thStyle}>Vide</th>
            <th style={thStyle}>% complet</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((c) => {
            const isGood = c.percentComplete >= 90;
            const bg = isGood ? '#dcfce7' : c.percentComplete >= 60 ? '#fef3c7' : '#fee2e2';
            const barColor = isGood ? '#16a34a' : c.percentComplete >= 60 ? '#d97706' : '#dc2626';
            return (
              <tr key={c.column} style={{ background: bg }}>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 700 }}>{c.column}</td>
                <td style={tdStyle}>
                  {c.usedInSearch
                    ? <span style={{ color: '#166534', fontWeight: 700 }}>✅ Oui</span>
                    : <span style={{ color: '#64748b' }}>— Non</span>}
                </td>
                <td style={{ ...tdStyle, maxWidth: '360px' }}>{c.note}</td>
                <td style={tdStyle}>{c.filledCount.toLocaleString()} / {c.totalRows.toLocaleString()}</td>
                <td style={tdStyle}>{c.emptyCount.toLocaleString()}</td>
                <td style={{ ...tdStyle, minWidth: '140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.percentComplete}%`, height: '100%', background: barColor }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: barColor, minWidth: '44px' }}>
                      {c.percentComplete}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '8px 12px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid #e2e8f0' };
const tdStyle = { padding: '8px 12px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid rgba(0,0,0,0.04)', verticalAlign: 'top' };

function ClaimCard({ claim }) {
  const config2 = {
    ok:      { icon: '✅', bg: '#dcfce7', border: '#86efac', color: '#166534' },
    warning: { icon: '⚠️', bg: '#fef3c7', border: '#fde68a', color: '#92400e' },
    issue:   { icon: '❌', bg: '#fee2e2', border: '#fecaca', color: '#991b1b' },
  }[claim.status];

  return (
    <div style={{ background: config2.bg, border: `1px solid ${config2.border}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '10px' }}>
      <div style={{ fontWeight: 700, fontSize: '14px', color: config2.color, marginBottom: '4px' }}>
        {config2.icon} {claim.claim}
      </div>
      <div style={{ fontSize: '13px', color: config2.color }}>{claim.detail}</div>
    </div>
  );
}

function ReferenceCheckerTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  const allFieldKeys = Array.from(
    new Set(rows.flatMap((r) => Object.keys(r.fields || {}))),
  );

  const completeCount   = rows.filter((r) => r.found && r.percentComplete === 100).length;
  const incompleteCount = rows.filter((r) => r.found && r.percentComplete < 100).length;
  const notFoundCount   = rows.filter((r) => !r.found).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <StatCard label="Pièces 100% complètes" value={completeCount} />
        <StatCard label="Pièces avec champs manquants" value={incompleteCount} />
        <StatCard label="Références introuvables" value={notFoundCount} />
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={thStyle}>Référence</th>
              {allFieldKeys.map((k) => <th key={k} style={thStyle}>{k}</th>)}
              <th style={thStyle}>% complet</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.reference} style={{ background: !row.found ? '#fee2e2' : row.percentComplete === 100 ? '#dcfce7' : '#fef3c7' }}>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 700 }}>{row.reference}</td>
                {allFieldKeys.map((k) => {
                  const f = row.fields?.[k];
                  if (!row.found) return <td key={k} style={tdStyle}>—</td>;
                  return (
                    <td key={k} style={{ ...tdStyle, color: f?.present ? '#166534' : '#991b1b', fontWeight: f?.present ? 400 : 700 }}>
                      {f?.present ? String(f.value) : '❌ vide'}
                    </td>
                  );
                })}
                <td style={{ ...tdStyle, fontWeight: 700 }}>
                  {row.found ? `${row.percentComplete}%` : 'introuvable'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DebugScanPage() {
  const [scan, setScan]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [refsInput, setRefsInput] = useState('');
  const [refRows, setRefRows]     = useState(null);
  const [checking, setChecking]   = useState(false);

  const loadScan = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${config.apiUrl}/debug/scan`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setScan(data);
    } catch (err) {
      setError(err.message || 'Échec du scan de la base de données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadScan(); }, [loadScan]);

  const handleCheckReferences = async () => {
    const references = refsInput
      .split(/[\n,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);

    if (references.length === 0) return;

    setChecking(true);
    setRefRows(null);
    try {
      const res = await fetch(`${config.apiUrl}/debug/check-references`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ references }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRefRows(data);
    } catch (err) {
      setError(err.message || 'Échec de la vérification des références');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '32px 24px', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            🗄️ Scan complet de la base de données
          </h1>
          <button
            onClick={loadScan}
            disabled={loading}
            style={{ background: '#4c1d95', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
          >
            {loading ? 'Analyse en cours…' : '🔄 Relancer le scan'}
          </button>
        </div>

        {scan && (
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Dernier scan : {new Date(scan.scannedAt).toLocaleString('fr-TN')}
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        {loading && !scan && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            Analyse de la base de données en cours…
          </div>
        )}

        {scan && (
          <>
            {/* ── 1. Total counts ── */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <StatCard label="Total pièces (parts)" value={scan.totals.parts.toLocaleString()} />
              <StatCard label="Lignes de stock" value={scan.totals.stock.toLocaleString()} sub={`${scan.totals.partsWithoutStock} pièce(s) sans stock`} />
              <StatCard label="Lignes de compatibilité (fitment)" value={scan.totals.fitments.toLocaleString()} sub={`${scan.totals.partsWithFitment} pièces avec fitment · ${scan.totals.partsWithoutFitment} sans`} />
              <StatCard label="Références alternatives" value={scan.totals.itemReferences.toLocaleString()} />
              <StatCard label="Pièces Suzuki OEM (01_PROD)" value={scan.totals.partsSuzukiOem.toLocaleString()} />
              <StatCard label="Pièces CarPro Parts (02_CARPRO)" value={scan.totals.partsCarProParts.toLocaleString()} />
              <StatCard label="Véhicules identifiés" value={(scan.totals.vehicles ?? 0).toLocaleString()} />
              <StatCard label="Mapping modèle → type" value={(scan.totals.vehicleModelMap ?? 0).toLocaleString()} />
              <StatCard label="Types véhicules maître" value={(scan.totals.vehicleTypeMaster ?? 0).toLocaleString()} />
            </div>

            {/* ── 3. Claims checklist (email promises) ── */}
            <div style={sectionTitleStyle}>✅ Vérification des points annoncés (stock consolidé, CarPro, etc.)</div>
            {scan.claims.map((c) => <ClaimCard key={c.claim} claim={c} />)}

            {/* ── 2. Full column scan ── */}
            <div style={sectionTitleStyle}>📊 Toutes les colonnes de la base — taux de remplissage</div>
            {['parts', 'stock', 'fitment', 'item_references', 'vehicles', 'vehicle_model_map', 'vehicle_type_master'].map((table) => (
              <ColumnTable
                key={table}
                table={table}
                columns={scan.columns.filter((c) => c.table === table)}
              />
            ))}

            {/* ── 4. Reference-level checker (the 20 pieces from the email) ── */}
            <div style={sectionTitleStyle}>🔎 Vérifier des références précises (ex : les 20 pièces de l'email)</div>
            <div style={{ ...cardStyle, marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                Collez les références à vérifier — une par ligne, ou séparées par des virgules.
              </div>
              <textarea
                value={refsInput}
                onChange={(e) => setRefsInput(e.target.value)}
                placeholder={'00533069\n00533070\n00533071\n...'}
                rows={6}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical' }}
              />
              <button
                onClick={handleCheckReferences}
                disabled={checking || !refsInput.trim()}
                style={{ marginTop: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                {checking ? 'Vérification en cours…' : 'Vérifier ces pièces'}
              </button>
            </div>

            <ReferenceCheckerTable rows={refRows} />
          </>
        )}
      </div>
    </div>
  );
}
