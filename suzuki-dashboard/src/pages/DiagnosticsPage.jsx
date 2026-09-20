import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import client from '../api/client';

const SEVERITY_META = {
  error: { label: 'Erreur', color: '#dc2626', bg: '#fef2f2', icon: '🔴' },
  warning: { label: 'Attention', color: '#d97706', bg: '#fffbeb', icon: '🟡' },
  info: { label: 'OK', color: '#16a34a', bg: '#f0fdf4', icon: '🟢' },
};

function IntegrityCard({ check }) {
  const [open, setOpen] = useState(false);
  const meta = SEVERITY_META[check.severity];

  return (
    <div className="integrity-card" style={{ borderLeftColor: meta.color }}>
      <div className="integrity-card-header" onClick={() => setOpen((o) => !o)}>
        <div>
          <span className="integrity-icon">{meta.icon}</span>
          <span className="integrity-title">{check.title}</span>
        </div>
        <div className="integrity-count" style={{ color: meta.color }}>
          {check.count.toLocaleString('fr-FR')}
        </div>
      </div>
      <p className="integrity-description">{check.description}</p>
      {check.samples?.length > 0 && (
        <>
          <button className="integrity-toggle" onClick={() => setOpen((o) => !o)}>
            {open ? '▲ Masquer les exemples' : `▼ Voir ${check.samples.length} exemple(s)`}
          </button>
          {open && (
            <pre className="integrity-samples">
              {JSON.stringify(check.samples, null, 2)}
            </pre>
          )}
        </>
      )}
    </div>
  );
}

function ColumnProfileRow({ col }) {
  return (
    <div className="col-profile-row">
      <div className="col-profile-name">
        {col.key} <span className="col-profile-type">{col.type}</span>
      </div>

      {col.filledPct !== undefined && (
        <div className="col-profile-fill">
          <div className="quality-bar">
            <div className="quality-bar-fill" style={{ width: `${col.filledPct}%` }} />
          </div>
          <span>{col.filledPct}% rempli</span>
        </div>
      )}

      {col.type === 'string' && (
        <div className="col-profile-detail">
          <span>{col.distinctCount?.toLocaleString('fr-FR')} valeurs distinctes</span>
          {col.topValues?.length > 0 && (
            <div className="top-values">
              {col.topValues.map((v) => (
                <span key={String(v.value)} className="top-value-chip" title={`${v.count} occurrences`}>
                  {String(v.value).slice(0, 24)} · {v.count}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {col.type === 'number' && (
        <div className="col-profile-detail">
          <span>min {col.min ?? '—'} · moy {col.avg !== null && col.avg !== undefined ? Number(col.avg).toFixed(2) : '—'} · max {col.max ?? '—'}</span>
        </div>
      )}

      {col.type === 'datetime' && (
        <div className="col-profile-detail">
          <span>
            {col.min ? new Date(col.min).toLocaleDateString('fr-FR') : '—'} → {col.max ? new Date(col.max).toLocaleDateString('fr-FR') : '—'}
          </span>
        </div>
      )}

      {col.type === 'boolean' && (
        <div className="col-profile-detail">
          <span>✓ {col.trueCount} · ✗ {col.falseCount}</span>
        </div>
      )}
    </div>
  );
}

export default function DiagnosticsPage() {
  const [overview, setOverview] = useState(null);
  const [checks, setChecks] = useState(null);
  const [activeTable, setActiveTable] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get('/diagnostics/overview')
      .then(({ data }) => {
        const tables = Array.isArray(data.tables) ? data.tables : [];
        setOverview({ ...data, tables });
        if (tables.length > 0) setActiveTable('all');
      })
      .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement'));

    client
      .get('/diagnostics/integrity')
      .then(({ data }) => setChecks(data))
      .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement des contrôles'));
  }, []);

  useEffect(() => {
    if (!activeTable) return;
    setLoadingProfile(true);
    client
      .get(`/diagnostics/columns/${activeTable}`)
      .then(({ data }) => setProfile(data))
      .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement du profil'))
      .finally(() => setLoadingProfile(false));
  }, [activeTable]);

  const chartData = useMemo(
    () => (overview ? overview.tables.map((t) => ({ name: t.label, rows: t.rowCount })) : []),
    [overview],
  );

  const sortedChecks = useMemo(() => {
    if (!checks) return [];
    const order = { error: 0, warning: 1, info: 2 };
    return [...checks].sort((a, b) => order[a.severity] - order[b.severity]);
  }, [checks]);

  const severityCounts = useMemo(() => {
    if (!checks) return { error: 0, warning: 0, info: 0 };
    return checks.reduce(
      (acc, c) => ({ ...acc, [c.severity]: acc[c.severity] + 1 }),
      { error: 0, warning: 0, info: 0 },
    );
  }, [checks]);

  return (
    <div className="entity-page">
      <div className="entity-header">
        <div>
          <h1>📈 Diagnostics &amp; qualité des données</h1>
          <p className="entity-subtitle">Statistiques, profil des colonnes et contrôles de cohérence</p>
        </div>
      </div>

      {error && <div className="page-error">{error}</div>}

      {/* ── Overview ─────────────────────────────────────────── */}
      {overview && (
        <>
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card" style={{ cursor: 'default' }}>
              <div className="stat-value">{overview.totals.tableCount}</div>
              <div className="stat-label">Tables</div>
            </div>
            <div className="stat-card" style={{ cursor: 'default' }}>
              <div className="stat-value">{overview.totals.totalRows.toLocaleString('fr-FR')}</div>
              <div className="stat-label">Lignes au total</div>
            </div>
            <div className="stat-card" style={{ cursor: 'default' }}>
              <div className="stat-value">{overview.totals.totalColumns}</div>
              <div className="stat-label">Colonnes au total</div>
            </div>
            {checks && (
              <>
                <div className="stat-card" style={{ cursor: 'default', borderColor: '#fecaca' }}>
                  <div className="stat-value" style={{ color: '#dc2626' }}>
                    {severityCounts.error}
                  </div>
                  <div className="stat-label">Anomalies critiques</div>
                </div>
                <div className="stat-card" style={{ cursor: 'default', borderColor: '#fde68a' }}>
                  <div className="stat-value" style={{ color: '#d97706' }}>
                    {severityCounts.warning}
                  </div>
                  <div className="stat-label">Points d'attention</div>
                </div>
              </>
            )}
          </div>

          <h2>Volume par table</h2>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => v.toLocaleString('fr-FR')} />
                <Bar dataKey="rows" fill="#d32f2f" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── Column profiling ─────────────────────────────────── */}
      <h2 style={{ marginTop: 32 }}>Profil des colonnes</h2>
      <div className="explorer-tabs">
        <button
          className={activeTable === 'all' ? 'explorer-tab active' : 'explorer-tab'}
          onClick={() => setActiveTable('all')}
        >
          toutes les tables
        </button>
        {overview?.tables?.map((t) => (
          <button
            key={t.key}
            className={t.key === activeTable ? 'explorer-tab active' : 'explorer-tab'}
            onClick={() => setActiveTable(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="col-profile-list">
        {loadingProfile && <div className="full-page-loader" style={{ height: 120 }}>Chargement…</div>}
        {!loadingProfile && profile?.columns?.map((col) => <ColumnProfileRow key={col.key} col={col} />)}
      </div>

      {/* ── Integrity checks ─────────────────────────────────── */}
      <h2 style={{ marginTop: 32 }}>Contrôles d'intégrité &amp; anomalies</h2>
      <p className="entity-subtitle" style={{ marginBottom: 16 }}>
        Triés par gravité — erreurs en premier, puis points d'attention, puis contrôles passés (🟢)
      </p>

      {!checks && <div className="full-page-loader" style={{ height: 160 }}>Chargement…</div>}
      <div className="integrity-list">
        {sortedChecks.map((c) => (
          <IntegrityCard key={c.key} check={c} />
        ))}
      </div>
    </div>
  );
}