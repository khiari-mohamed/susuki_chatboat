import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import * as ExcelJS from 'exceljs';
import { Plus, Upload, Trash2, Pencil, X, Check, ChevronLeft, ChevronRight, FileDown, AlertTriangle } from 'lucide-react';
import client from '../api/client';
import { getSocket } from '../api/socket';
import { useAuth } from '../context/AuthContext';
import AddRecordModal from '../components/AddRecordModal';

const PAGE_SIZES = [25, 50, 100, 250];

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon"><AlertTriangle size={22} /></div>
        <div className="confirm-message">{message}</div>
        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn-danger-solid" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

function TextEditor({ row, column, onRowChange, onClose, colType }) {
  return (
    <input
      autoFocus
      className="rdg-text-editor"
      type={colType === 'number' ? 'number' : 'text'}
      value={row[column.key] ?? ''}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
      onBlur={() => onClose(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClose(true);
        if (e.key === 'Escape') onClose(false);
      }}
    />
  );
}

function SelectEditor({ row, column, onRowChange, onClose, options }) {
  return (
    <select
      autoFocus
      className="grid-select-editor"
      value={row[column.key] ?? ''}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value }, true)}
      onBlur={() => onClose(true)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function EditModal({ entity, row, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    const f = {};
    entity.columns.filter((c) => c.editable).forEach((c) => { f[c.key] = row[c.key] ?? ''; });
    return f;
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const payload = {};
      entity.columns.filter((c) => c.editable).forEach((c) => {
        payload[c.key] = c.type === 'number' && form[c.key] !== '' ? Number(form[c.key]) : form[c.key];
      });
      await onSave(row.id, payload);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier #{row.id}</h2>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        {err && <div className="page-error">{err}</div>}
        <form onSubmit={submit} className="modal-form">
          {entity.columns.filter((c) => c.editable).map((c) => (
            <div key={c.key} className="modal-field">
              <label>{c.name}</label>
              {c.type === 'select' ? (
                <select value={form[c.key]} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}>
                  {c.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={c.type === 'number' ? 'number' : 'text'}
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Sauvegarde…' : 'Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImportModal({ entity, onClose, onDone }) {
  const [preview, setPreview] = useState(null); // { headers, rows }
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setErr('');
    try {
      let headers, rows;
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split('\n').filter(Boolean);
        headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
        rows = lines.slice(1).map((line) => {
          const vals = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());
          return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
        });
      } else {
        const buf = await file.arrayBuffer();
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buf);
        const ws = wb.worksheets[0];
        headers = ws.getRow(1).values.slice(1);
        rows = [];
        ws.eachRow((row, i) => {
          if (i === 1) return;
          rows.push(Object.fromEntries(headers.map((h, j) => [h, row.values[j + 1] ?? ''])));
        });
      }
      setPreview({ headers, rows: rows.slice(0, 5), total: rows.length, allRows: rows });
    } catch (e) {
      setErr('Erreur lecture fichier : ' + e.message);
    }
  }

  async function doImport() {
    setImporting(true);
    setErr('');
    try {
      const uniqueKey = entity.columns.find((c) => c.createOnly && c.required)?.key || 'id';
      const { data } = await client.post(`${entity.apiPath}/bulk-upsert`, {
        rows: preview.allRows,
        uniqueKey,
      });
      setResult(data);
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Import CSV / Excel — {entity.label}</h2>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        {err && <div className="page-error">{err}</div>}
        {result ? (
          <div className="import-result">
            <div className="import-result-ok"><Check size={16} /> Import terminé — {result.created} créés, {result.updated} mis à jour</div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => { onDone(); onClose(); }}>Fermer</button>
            </div>
          </div>
        ) : (
          <>
            <div className="import-hint">
              Le fichier doit avoir les colonnes en première ligne. Les lignes existantes (même clé unique) seront mises à jour, les nouvelles créées.
            </div>
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} className="import-file-input" />
            {preview && (
              <>
                <div className="import-preview-info">{preview.total} lignes détectées — aperçu des 5 premières :</div>
                <div className="import-preview-table-wrap">
                  <table className="import-preview-table">
                    <thead><tr>{preview.headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{preview.rows.map((r, i) => (
                      <tr key={i}>{preview.headers.map((h) => <td key={h}>{String(r[h] ?? '')}</td>)}</tr>
                    ))}</tbody>
                  </table>
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={onClose}>Annuler</button>
                  <button className="btn-primary" onClick={doImport} disabled={importing}>
                    {importing ? 'Import en cours…' : `Importer ${preview.total} lignes`}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
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
  const [showImport, setShowImport] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [savingCell, setSavingCell] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  useEffect(() => {
    setPage(1); setSearch(''); setSearchInput(''); setSortColumns([]); setSelectedIds(new Set());
  }, [entity.key]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setSearch(searchInput); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const sort = sortColumns[0];
      const { data } = await client.get(entity.apiPath, {
        params: {
          page, pageSize,
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

  useEffect(() => { fetchPage(); }, [fetchPage]);

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
    return () => { socket.off('record:changed', handleChange); clearTimeout(refetchTimer.current); };
  }, [entity.socketTable, fetchPage]);

  const handleRowsChange = useCallback(async (newRows, { indexes }) => {
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
    setRows(newRows);
    setSavingCell(true);
    try {
      await client.put(`${entity.apiPath}/${newRow.id}`, changes);
    } catch (err) {
      setRows(rows);
      setError(err.response?.data?.message || 'Échec de la sauvegarde');
    } finally {
      setSavingCell(false);
    }
  }, [rows, entity]);

  async function handleAdd(payload) {
    await client.post(entity.apiPath, payload);
    setShowAdd(false);
    setPage(1);
    fetchPage();
  }

  async function handleDelete(row) {
    setConfirm({
      message: `Supprimer définitivement la ligne #${row.id} ?`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await client.delete(`${entity.apiPath}/${row.id}`);
          fetchPage();
        } catch (err) {
          setError(err.response?.data?.message || 'Échec de la suppression');
        }
      },
    });
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds];
    setConfirm({
      message: `Supprimer définitivement ${ids.length} ligne(s) sélectionnée(s) ?`,
      onConfirm: async () => {
        setConfirm(null);
        setBulkDeleting(true);
        try {
          await client.delete(entity.apiPath, { data: { ids } });
          setSelectedIds(new Set());
          fetchPage();
        } catch (err) {
          setError(err.response?.data?.message || 'Échec de la suppression groupée');
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  }

  async function handleEditSave(id, payload) {
    await client.put(`${entity.apiPath}/${id}`, payload);
    fetchPage();
  }

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(rows.map((r) => r.id)));
  }

  function toggleRow(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const columns = useMemo(() => {
    const checkCol = {
      key: '__check',
      name: () => <input type="checkbox" checked={allSelected} onChange={toggleAll} />,
      width: 40,
      renderHeaderCell: () => <input type="checkbox" checked={allSelected} onChange={toggleAll} />,
      renderCell: ({ row }) => (
        <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)} />
      ),
    };

    const dataCols = entity.columns.map((c) => {
      const base = { key: c.key, name: c.name, width: c.width, resizable: true, sortable: true };
      if (c.format) return { ...base, renderCell: ({ row }) => c.format(row) };
      if (c.editable && !entity.noUpdate) {
        if (c.type === 'select') return { ...base, editable: true, renderEditCell: (props) => <SelectEditor {...props} options={c.options} /> };
        return { ...base, editable: true, renderEditCell: (props) => <TextEditor {...props} colType={c.type} /> };
      }
      return base;
    });

    const actionCol = {
      key: '__actions',
      name: '',
      width: canDelete ? 80 : 44,
      renderCell: ({ row }) => (
        <div className="grid-action-btns">
          <button className="grid-edit-btn" title="Modifier" onClick={() => setEditRow(row)}><Pencil size={13} /></button>
          {canDelete && (
            <button className="grid-delete-btn" title="Supprimer" onClick={() => handleDelete(row)}><Trash2 size={13} /></button>
          )}
        </div>
      ),
    };

    return [checkCol, ...dataCols, actionCol];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, canDelete, selectedIds, allSelected, rows]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="entity-page">
      <div className="entity-header">
        <div>
          <h1>{entity.label}</h1>
          <p className="entity-subtitle">{entity.subtitle}</p>
        </div>
        <div className="entity-toolbar">
          <input className="search-box" placeholder="Rechercher…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          {selectedIds.size > 0 && canDelete && (
            <button className="btn-danger" onClick={handleBulkDelete} disabled={bulkDeleting}>
              <Trash2 size={14} /> Supprimer ({selectedIds.size})
            </button>
          )}
          <button className="btn-secondary" onClick={() => setShowImport(true)}><Upload size={14} /> Importer</button>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Ajouter</button>
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
          {selectedIds.size > 0 && <span className="selection-badge"> · {selectedIds.size} sélectionnée(s)</span>}
        </div>
        <div className="pagination-controls">
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={14} /> Précédent</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Suivant <ChevronRight size={14} /></button>
        </div>
      </div>

      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {showAdd && <AddRecordModal entity={entity} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      {showImport && <ImportModal entity={entity} onClose={() => setShowImport(false)} onDone={fetchPage} />}
      {editRow && <EditModal entity={entity} row={editRow} onClose={() => setEditRow(null)} onSave={handleEditSave} />}
    </div>
  );
}
