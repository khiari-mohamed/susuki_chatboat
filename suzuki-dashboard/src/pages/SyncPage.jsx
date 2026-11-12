import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import useSyncStatus from '../hooks/useSyncStatus';
import { SYNC_ENTITY_LABELS, SYNC_STATUS_META } from '../config/sync';

const fmtDate = (d) => (d ? new Date(d).toLocaleString('fr-FR') : '—');
const fmtNum = (n) => Number(n ?? 0).toLocaleString('fr-FR');

function fmtDuration(run) {
  if (!run?.finishedAt) return run?.status === 'RUNNING' ? 'en cours…' : '—';
  const seconds = Math.max(0, Math.round((new Date(run.finishedAt) - new Date(run.startedAt)) / 1000));
  return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)} min ${seconds % 60} s`;
}

function StatusBadge({ status }) {
  const meta = SYNC_STATUS_META[status] || { label: status, color: '#6b7280' };
  return <span style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>;
}

export default function SyncPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { status, error: statusError, reload } = useSyncStatus();
  const [runs, setRuns] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(false);
  const [starting, setStarting] = useState(false);
  const [actionError, setActionError] = useState('');

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const { data } = await client.get('/sync/health');
      setHealth(data);
    } catch (err) {
      setHealth({ reachable: false, detail: err.response?.data?.message || 'Test impossible' });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { checkHealth(); }, [checkHealth]);

  const runKey = `${status?.lastRun?.id}:${status?.lastRun?.status}:${status?.running}`;
  useEffect(() => {
    client
      .get('/sync/runs', { params: { limit: 20 } })
      .then(({ data }) => setRuns(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [runKey]);

  async function start(full) {
    if (full && !window.confirm("Relire toutes les données de l'ERP ? Cela peut durer plusieurs minutes.")) return;
    setStarting(true);
    setActionError('');
    try {
      await client.post('/sync', { full });
    } catch (err) {
      setActionError(err.response?.data?.message || 'Échec du lancement');
    } finally {
      setStarting(false);
      await reload();
    }
  }

  const selectedRun = runs.find((r) => r.id === selectedId) ?? runs[0] ?? null;
  const summary = selectedRun?.summary || {};
  const entityKeys = Object.keys(SYNC_ENTITY_LABELS).filter((key) => summary[key]);
  const pending = Object.values(summary).reduce((sum, s) => sum + (s.pendingDeletes || 0), 0);
  const blocked = Object.values(summary).reduce((sum, s) => sum + (s.pruneBlocked || 0), 0);
  const busy = starting || status?.running;
  const canStart = isAdmin && status?.configured && !busy;

  return (
    <div className="entity-page">
      <div className="entity-header">
        <div>
          <h1>Synchronisation ERP → Chatbot</h1>
          <p className="entity-subtitle">
            Sens unique : l'ERP reste la référence, la base du chatbot est en lecture seule. Synchronisation automatique chaque soir (22h00).
          </p>
        </div>
        {isAdmin && (
          <div className="entity-toolbar">
            <button className="btn-secondary" onClick={() => start(true)} disabled={!canStart}>
              Synchronisation complète
            </button>
            <button className="btn-primary" onClick={() => start(false)} disabled={!canStart}>
              <RefreshCw size={14} /> {busy ? 'Synchronisation en cours…' : 'Synchroniser maintenant'}
            </button>
          </div>
        )}
      </div>

      {(statusError || actionError) && <div className="page-error">{actionError || statusError}</div>}

      <div className="quality-grid" style={{ marginBottom: 24 }}>
        <div className="quality-card">
          <div className="quality-title">Source ERP</div>
          <div className="quality-caption">
            {status ? `${status.source} — ${status.configured ? 'configurée' : 'non configurée (synchronisation inactive)'}` : '…'}
          </div>
        </div>
        <div className="quality-card">
          <div className="quality-title">Relais ERP</div>
          <div className="quality-caption" style={{ color: health?.reachable ? '#16a34a' : '#dc2626' }}>
            {health ? (health.reachable ? 'Joignable' : `Injoignable${health.detail ? ` — ${health.detail}` : ''}`) : '…'}
          </div>
          <button className="btn-secondary" style={{ marginTop: 8 }} onClick={checkHealth} disabled={checking}>
            {checking ? 'Test…' : 'Tester'}
          </button>
        </div>
        <div className="quality-card">
          <div className="quality-title">Dernière synchronisation</div>
          <div className="quality-caption">
            {status?.lastRun ? (
              <>
                <StatusBadge status={status.lastRun.status} /> — {fmtDate(status.lastRun.startedAt)}
              </>
            ) : (
              'Aucune synchronisation effectuée.'
            )}
          </div>
        </div>
        <div className="quality-card">
          <div className="quality-title">Suppressions ERP</div>
          <div className="quality-caption">
            {status?.applyDeletes ? 'Appliquées au chatbot' : 'Non appliquées (mode vérification)'}
          </div>
        </div>
      </div>

      {pending > 0 && !status?.applyDeletes && (
        <div className="page-hint">
          <AlertTriangle size={14} /> {fmtNum(pending)} ligne(s) supprimée(s) ou absente(s) dans l'ERP sont encore présentes dans le chatbot
          (suppressions désactivées). À valider avec l'équipe IT avant activation.
        </div>
      )}
      {blocked > 0 && (
        <div className="page-error">
          {fmtNum(blocked)} suppression(s) bloquée(s) : volume anormal par rapport à la table. Vérifier le relais / l'ERP avant de relancer.
        </div>
      )}

      <h2>Détail {selectedRun ? `— ${fmtDate(selectedRun.startedAt)}` : ''}</h2>
      {selectedRun?.error && <div className="page-error">{selectedRun.error}</div>}
      {selectedRun?.status === 'PARTIAL' && (
        <div className="page-hint">
          Certaines lignes ont été ignorées (clé manquante, stock consolidé absent, ou référence inconnue). Les détails sont dans les logs du serveur.
        </div>
      )}
      <div className="import-preview-table-wrap">
        <table className="import-preview-table">
          <thead>
            <tr>
              <th>Table</th>
              <th>Reçues</th>
              <th>Enregistrées</th>
              <th>Invalides</th>
              <th>En erreur</th>
              <th>Supprimées</th>
              <th>Suppressions en attente</th>
            </tr>
          </thead>
          <tbody>
            {entityKeys.length === 0 && (
              <tr>
                <td colSpan={7}>Aucun détail disponible.</td>
              </tr>
            )}
            {entityKeys.map((key) => {
              const s = summary[key];
              const bad = (s.invalid || 0) + (s.failed || 0) > 0;
              return (
                <tr key={key}>
                  <td>{SYNC_ENTITY_LABELS[key]}</td>
                  <td>{fmtNum(s.received)}</td>
                  <td>{fmtNum(s.upserted)}</td>
                  <td style={bad && s.invalid ? { color: '#dc2626', fontWeight: 600 } : undefined}>{fmtNum(s.invalid)}</td>
                  <td style={bad && s.failed ? { color: '#dc2626', fontWeight: 600 } : undefined}>{fmtNum(s.failed)}</td>
                  <td>{fmtNum(s.deleted)}</td>
                  <td>{fmtNum(s.pendingDeletes)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 32 }}>Historique</h2>
      <div className="import-preview-table-wrap">
        <table className="import-preview-table">
          <thead>
            <tr>
              <th>Début</th>
              <th>Déclenchement</th>
              <th>Statut</th>
              <th>Durée</th>
              <th>Erreur</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 && (
              <tr>
                <td colSpan={5}>Aucune synchronisation.</td>
              </tr>
            )}
            {runs.map((run) => (
              <tr
                key={run.id}
                onClick={() => setSelectedId(run.id)}
                style={{ cursor: 'pointer', background: run.id === selectedRun?.id ? '#f3f4f6' : undefined }}
              >
                <td>{fmtDate(run.startedAt)}</td>
                <td>{run.trigger === 'CRON' ? 'Automatique' : 'Manuelle'}</td>
                <td><StatusBadge status={run.status} /></td>
                <td>{fmtDuration(run)}</td>
                <td>{run.error ? String(run.error).slice(0, 120) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}