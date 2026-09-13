import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
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
        </div>
      </div>

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