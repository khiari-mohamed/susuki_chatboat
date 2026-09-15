import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import ExcelJS from 'exceljs';
import client from '../api/client';

const PAGE_SIZES = [25, 50, 100, 250];

function formatCell(value, type) {
  if (value === null || value === undefined || value === '') return '—';
  switch (type) {
    case 'datetime':
      return new Date(value).toLocaleString('fr-FR');
    case 'boolean':
      return value ? '✓' : '✗';
    case 'json':
      return typeof value === 'string' ? value : JSON.stringify(value);
    default:
      return String(value);
  }
}

export default function DbExplorerPage() {
  const [tables, setTables] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [columns, setColumns] = useState([]);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortColumns, setSortColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the list of tables (+ their raw column manifest) once.
  useEffect(() => {
    client
      .get('/explorer/tables')
      .then(({ data }) => {
        setTables(data);
        if (data.length > 0) setActiveKey('all');
      })
      .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement des tables'));
  }, []);

  // Reset paging/search/sort whenever the selected table changes.
  useEffect(() => {
    setPage(1);
    setSearch('');
    setSearchInput('');
    setSortColumns([]);
  }, [activeKey]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchPage = useCallback(async () => {
    if (!activeKey) return;
    setLoading(true);
    setError('');
    try {
      const sort = sortColumns[0];
      const { data } = await client.get(`/explorer/${activeKey}`, {
        params: {
          page,
          pageSize,
          search: search || undefined,
          sortBy: sort?.columnKey,
          sortDir: sort ? (sort.direction === 'ASC' ? 'asc' : 'desc') : undefined,
        },
      });
      setColumns(data.table.columns);
      setRows(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [activeKey, page, pageSize, search, sortColumns]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const gridColumns = useMemo(
    () =>
      columns.map((c) => ({
        key: c.key,
        name: c.key,
        width: c.type === 'string' ? 220 : c.type === 'json' ? 260 : 140,
        resizable: true,
        sortable: true,
        renderCell: ({ row }) => {
          const text = formatCell(row[c.key], c.type);
          return <span title={text}>{text}</span>;
        },
      })),
    [columns],
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeTable = tables.find((t) => t.key === activeKey);

  const [exporting, setExporting] = useState(null);
  const [exportModal, setExportModal] = useState(false);
  const [exportLimit, setExportLimit] = useState('all');
  const [exportCustom, setExportCustom] = useState('');

  const EXPORT_PRESETS = [20, 50, 100, 200, 500];

  const resolvedLimit = exportLimit === 'all' ? null : exportLimit === 'custom' ? (parseInt(exportCustom) || null) : Number(exportLimit);

  const streamExport = useCallback(async (format) => {
    setExportModal(false);
    const limit = resolvedLimit;
    const token = localStorage.getItem('token');
    const start = Date.now();
    setExporting({ phase: 'download', elapsed: 0, label: format.toUpperCase(), received: 0 });

    let cols, allRows;

    if (limit) {
      const sort = sortColumns[0];
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('pageSize', String(limit));
      if (search) params.set('search', search);
      if (sort) { params.set('sortBy', sort.columnKey); params.set('sortDir', sort.direction === 'ASC' ? 'asc' : 'desc'); }
      setExporting((prev) => prev && { ...prev, phase: 'build' });
      const resp = await fetch(`/api/admin/explorer/${activeKey}?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!resp.ok) { setExporting(null); return; }
      const json = await resp.json();
      cols = json.table?.columns ?? json.columns;
      allRows = json.data;
    } else {
      // Full export — stream
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const resp = await fetch(`/api/admin/explorer/export/${activeKey}?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!resp.ok) { setExporting(null); return; }
      const reader = resp.body.getReader();
      const chunks = [];
      let received = 0;
      const tick = setInterval(() => {
        setExporting((prev) => prev && { ...prev, elapsed: ((Date.now() - start) / 1000).toFixed(1) });
      }, 200);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        setExporting((prev) => prev && { ...prev, received });
      }
      clearInterval(tick);
      setExporting((prev) => prev && { ...prev, phase: 'build' });
      const text = new TextDecoder().decode(await new Blob(chunks).arrayBuffer());
      const json = JSON.parse(text);
      cols = json.columns;
      allRows = json.data;
    }

    const keys = cols.map((c) => c.key);
    const suffix = limit ? `_${limit}` : '';

    if (format === 'csv') {
      const lines = [
        keys.join(','),
        ...allRows.map((row) =>
          keys.map((k) => {
            const v = formatCell(row[k], cols.find((c) => c.key === k)?.type);
            return `"${String(v).replace(/"/g, '""')}"`;
          }).join(',')
        ),
      ];
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${activeKey}${suffix}.csv` });
      a.click(); URL.revokeObjectURL(a.href);
    } else {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet(activeKey);
      ws.columns = cols.map((c) => ({ header: c.key, key: c.key, width: 20 }));
      allRows.forEach((row) => ws.addRow(Object.fromEntries(cols.map((c) => [c.key, formatCell(row[c.key], c.type)]))));
      ws.getRow(1).font = { bold: true };
      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${activeKey}${suffix}.xlsx` });
      a.click(); URL.revokeObjectURL(a.href);
    }
    setExporting(null);
  }, [activeKey, search, sortColumns, resolvedLimit]);

  return (
    <div className="entity-page">
      <div className="entity-header">
        <div>
          <h1>🗄 Explorateur base de données</h1>
          <p className="entity-subtitle">
            Vue brute, lecture seule — chaque colonne exactement comme en base de données
          </p>
        </div>
        <div className="entity-toolbar">
          <input
            className="search-box"
            placeholder="Rechercher…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="btn-secondary" onClick={() => setExportModal(true)} disabled={!activeKey || loading || !!exporting}>⬇ Exporter</button>
        </div>
      </div>

      {exportModal && (
        <div className="export-overlay" onClick={() => setExportModal(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="export-modal-title">⬇ Exporter — {activeKey}</div>
            <div className="export-modal-sub">{total.toLocaleString('fr-FR')} lignes disponibles</div>

            <div className="export-section-label">Nombre de lignes</div>
            <div className="export-chips">
              {EXPORT_PRESETS.map((p) => (
                <button key={p} className={`export-chip${exportLimit === String(p) ? ' active' : ''}`} onClick={() => setExportLimit(String(p))}>
                  {p.toLocaleString()}
                </button>
              ))}
              <button className={`export-chip${exportLimit === 'custom' ? ' active' : ''}`} onClick={() => setExportLimit('custom')}>Personnalisé</button>
              <button className={`export-chip${exportLimit === 'all' ? ' active' : ''}`} onClick={() => setExportLimit('all')}>Tout ({total.toLocaleString('fr-FR')})</button>
            </div>

            {exportLimit === 'custom' && (
              <input
                className="export-custom-input"
                type="number"
                min={1}
                max={total}
                placeholder={`1 – ${total.toLocaleString('fr-FR')}`}
                value={exportCustom}
                onChange={(e) => setExportCustom(e.target.value)}
                autoFocus
              />
            )}

            <div className="export-modal-actions">
              <button className="btn-secondary" onClick={() => setExportModal(false)}>Annuler</button>
              <button className="btn-primary" onClick={() => streamExport('csv')}>⬇ CSV</button>
              <button className="btn-primary" onClick={() => streamExport('excel')}>⬇ Excel</button>
            </div>
          </div>
        </div>
      )}

      {exporting && (
        <div className="export-overlay">
          <div className="export-modal">
            <div className="export-modal-title">
              {exporting.phase === 'download'
                ? `⬇ Téléchargement ${exporting.label}…`
                : `⚙ Génération du fichier ${exporting.label}…`}
            </div>
            <div className="export-progress-bar">
              <div className={`export-progress-fill${exporting.phase === 'build' ? ' indeterminate' : ''}`} />
            </div>
            <div className="export-modal-info">
              {exporting.phase === 'download'
                ? `${(exporting.received / 1024).toFixed(0)} KB reçus — ${exporting.elapsed}s`
                : `${exporting.elapsed}s`}
            </div>
          </div>
        </div>
      )}

      <div className="explorer-tabs">
        {tables.map((t) => (
          <button
            key={t.key}
            className={t.key === activeKey ? 'explorer-tab active' : 'explorer-tab'}
            onClick={() => setActiveKey(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="page-error">{error}</div>}
      <div className="page-hint">
        Lecture seule — pour modifier les données, utilise les pages du menu "Catalogue".
      </div>

      <div className="grid-wrapper">
        {activeTable && (
          <DataGrid
            columns={gridColumns}
            rows={rows}
            rowKeyGetter={(row) => row._rowKey || row.id}
            sortColumns={sortColumns}
            onSortColumnsChange={setSortColumns}
            className="rdg-light"
            style={{ height: '100%' }}
          />
        )}
        {loading && <div className="grid-loading-overlay">Chargement…</div>}
      </div>

      <div className="pagination-bar">
        <div className="pagination-info">
          {total.toLocaleString('fr-FR')} lignes — page {page} / {totalPages}
        </div>
        <div className="pagination-controls">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Précédent
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}