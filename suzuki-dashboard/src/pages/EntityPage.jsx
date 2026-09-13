import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import client from '../api/client';
import { getSocket } from '../api/socket';
import { useAuth } from '../context/AuthContext';
import AddRecordModal from '../components/AddRecordModal';

const PAGE_SIZES = [25, 50, 100, 250];

function SelectEditor({ row, column, onRowChange, options }) {
  return (
    <select
      autoFocus
      className="grid-select-editor"
      value={row[column.key] ?? ''}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value }, true)}
      onBlur={() => onRowChange(row, true)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export default function EntityPage({ entity }) {
  const { user } = useAuth();
  const canDelete = user?.role === 'ADMIN';

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortColumns, setSortColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [savingCell, setSavingCell] = useState(false);

  // Reset paging/search state whenever the user switches tables.
  useEffect(() => {
    setPage(1);
    setSearch('');
    setSearchInput('');
    setSortColumns([]);
  }, [entity.key]);

  // Debounce the search box → search param (300ms).
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const sort = sortColumns[0];
      const { data } = await client.get(entity.apiPath, {
        params: {
          page,
          pageSize,
          search: search || undefined,
          sortBy: sort?.columnKey,
          sortDir: sort ? (sort.direction === 'ASC' ? 'asc' : 'desc') : undefined,
        },
      });
      setRows(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [entity.apiPath, page, pageSize, search, sortColumns]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Realtime: any change to this table from another admin session
  // triggers a silent refetch of the current page/filters. Simpler and
  // more robust than trying to patch pagination-aware local state cell
  // by cell, and still lands well under a second.
  const refetchTimer = useRef(null);
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    function handleChange(payload) {
      if (payload.table !== entity.socketTable) return;
      clearTimeout(refetchTimer.current);
      refetchTimer.current = setTimeout(fetchPage, 250);
    }

    socket.on('record:changed', handleChange);
    return () => {
      socket.off('record:changed', handleChange);
      clearTimeout(refetchTimer.current);
    };
  }, [entity.socketTable, fetchPage]);

  const handleRowsChange = useCallback(
    async (newRows, { indexes }) => {
      const idx = indexes[0];
      const newRow = newRows[idx];
      const oldRow = rows[idx];
      if (!newRow || !oldRow) return;

      const editableKeys = entity.columns.filter((c) => c.editable).map((c) => c.key);
      const changes = {};
      for (const key of editableKeys) {
        if (newRow[key] !== oldRow[key]) {
          const col = entity.columns.find((c) => c.key === key);
          changes[key] = col.type === 'number' && newRow[key] !== '' ? Number(newRow[key]) : newRow[key];
        }
      }
      if (Object.keys(changes).length === 0) return;

      setRows(newRows); // optimistic
      setSavingCell(true);
      try {
        await client.put(`${entity.apiPath}/${newRow.id}`, changes);
      } catch (err) {
        setRows(rows); // revert on failure
        setError(err.response?.data?.message || 'Échec de la sauvegarde — modification annulée');
      } finally {
        setSavingCell(false);
      }
    },
    [rows, entity],
  );

  async function handleAdd(payload) {
    await client.post(entity.apiPath, payload);
    setShowAdd(false);
    setPage(1);
    fetchPage();
  }

  async function handleDelete(row) {
    if (!window.confirm(`Supprimer définitivement cette ligne (#${row.id}) ?`)) return;
    try {
      await client.delete(`${entity.apiPath}/${row.id}`);
      fetchPage();
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la suppression');
    }
  }

  const columns = useMemo(() => {
    const cols = entity.columns.map((c) => {
      const base = {
        key: c.key,
        name: c.name,
        width: c.width,
        resizable: true,
        sortable: true,
      };

      if (c.format) {
        return { ...base, renderCell: ({ row }) => c.format(row) };
      }

      if (c.editable && !entity.noUpdate) {
        if (c.type === 'select') {
          return {
            ...base,
            editable: true,
            renderEditCell: (props) => <SelectEditor {...props} options={c.options} />,
          };
        }
        return { ...base, editable: true };
      }

      return base;
    });

    if (canDelete) {
      cols.push({
        key: '__actions',
        name: '',
        width: 60,
        renderCell: ({ row }) => (
          <button className="grid-delete-btn" title="Supprimer" onClick={() => handleDelete(row)}>
            🗑
          </button>
        ),
      });
    }

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, canDelete]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="entity-page">
      <div className="entity-header">
        <div>
          <h1>{entity.label}</h1>
          <p className="entity-subtitle">{entity.subtitle}</p>
        </div>
        <div className="entity-toolbar">
          <input
            className="search-box"
            placeholder="Rechercher…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Ajouter
          </button>
        </div>
      </div>

      {error && <div className="page-error">{error}</div>}
      {entity.noUpdate && (
        <div className="page-hint">
          Table de correspondance simple : pour corriger une ligne, supprimez-la et ré-ajoutez-la.
        </div>
      )}

      <div className="grid-wrapper">
        <DataGrid
          columns={columns}
          rows={rows}
          rowKeyGetter={(row) => row.id}
          onRowsChange={handleRowsChange}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          className="rdg-light"
          style={{ height: '100%' }}
        />
        {(loading || savingCell) && (
          <div className="grid-loading-overlay">{loading ? 'Chargement…' : 'Sauvegarde…'}</div>
        )}
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

      {showAdd && <AddRecordModal entity={entity} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
    </div>
  );
}
