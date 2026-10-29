import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ENTITIES } from '../config/entities';

const CARDS = [
  { key: 'parts', label: 'Pièces' },
  { key: 'stock', label: 'Lignes de stock' },
  { key: 'fitments', label: 'Compatibilités' },
  { key: 'vehicles', label: 'Véhicules' },
  { key: 'vehicleModelMap', label: 'Modèle ↔ Type code', route: 'vehicle-model-map' },
  { key: 'vehicleTypeMaster', label: 'Types véhicules', route: 'vehicle-types' },
  { key: 'itemReferences', label: 'Références croisées', route: 'item-references' },
  { key: 'synonyms', label: 'Synonymes' },
];

const SYNC_LABELS = { SUCCESS: 'Réussie', PARTIAL: 'Partielle (lignes ignorées)', FAILED: 'Échec', RUNNING: 'En cours' };

function SyncCard() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await client.get('/sync/status');
      setStatus(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Statut de synchronisation indisponible');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!status?.running) return undefined;
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [status?.running, load]);

  async function start() {
    setStarting(true);
    setError('');
    try {
      await client.post('/sync');
    } catch (err) {
      setError(err.response?.data?.message || 'Échec du lancement');
    } finally {
      setStarting(false);
      await load();
    }
  }

  const run = status?.lastRun;
  const anomalies = run?.summary
    ? Object.entries(run.summary).filter(([, s]) => s.invalid + s.failed > 0)
    : [];

  return (
    <div className="quality-card" style={{ marginBottom: 24 }}>
      <div className="quality-title">Synchronisation ERP → Chatbot</div>
      {error && <div className="page-error">{error}</div>}
      {status && !status.configured && (
        <div className="quality-caption">Source ERP non configurée : la synchronisation est inactive.</div>
      )}
      {run ? (
        <div className="quality-caption">
          Dernière synchronisation : {SYNC_LABELS[run.status] || run.status} —{' '}
          {new Date(run.startedAt).toLocaleString('fr-FR')} ({run.trigger === 'CRON' ? 'automatique' : 'manuelle'})
        </div>
      ) : (
        <div className="quality-caption">Aucune synchronisation effectuée.</div>
      )}
      {anomalies.map(([entity, s]) => (
        <div key={entity} className="quality-caption">
          {entity} : {s.invalid} ligne(s) invalide(s), {s.failed} en erreur
        </div>
      ))}
      {user?.role === 'ADMIN' && (
        <button
          className="btn-primary"
          style={{ marginTop: 12 }}
          onClick={start}
          disabled={starting || !status?.configured || status?.running}
        >
          {status?.running ? 'Synchronisation en cours…' : 'Synchroniser maintenant'}
        </button>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get('/stats')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement'));
  }, []);

  if (error) return <div className="page-error">{error}</div>;
  if (!stats) return <div className="full-page-loader">Chargement…</div>;

  return (
    <div className="dashboard-home">
      <h1>Tableau de bord</h1>
      <p className="entity-subtitle">Vue d'ensemble de la base de données du chatbot</p>

      <div className="stats-grid">
        {CARDS.map((c) => (
          <Link key={c.key} to={`/data/${c.route || ENTITIES[c.key]?.key || c.key}`} className="stat-card">
            <div className="stat-value">{(stats.counts[c.key] ?? 0).toLocaleString('fr-FR')}</div>
            <div className="stat-label">{c.label}</div>
          </Link>
        ))}
      </div>

      <SyncCard />

      <h2>Qualité des données</h2>
      <p className="entity-subtitle">Écarts identifiés dans le rapport CarPro — à combler progressivement</p>

      <div className="quality-grid">
        <div className="quality-card">
          <div className="quality-title">Désignation FR (designation_2)</div>
          <div className="quality-bar">
            <div className="quality-bar-fill" style={{ width: `${stats.dataQuality.designation2CoveragePct}%` }} />
          </div>
          <div className="quality-caption">
            {stats.dataQuality.designation2CoveragePct}% renseignée — {stats.dataQuality.partsWithoutDesignation2} pièces manquantes
          </div>
        </div>

        <div className="quality-card">
          <div className="quality-title">Description recherche (search_description)</div>
          <div className="quality-bar">
            <div
              className="quality-bar-fill"
              style={{ width: `${stats.dataQuality.searchDescriptionCoveragePct}%` }}
            />
          </div>
          <div className="quality-caption">
            {stats.dataQuality.searchDescriptionCoveragePct}% renseignée — {stats.dataQuality.partsWithoutSearchDescription} pièces manquantes
          </div>
        </div>

        <div className="quality-card">
          <div className="quality-title">Pièces sans ligne de stock</div>
          <div className="quality-caption quality-caption-lg">{stats.dataQuality.partsWithoutStock} pièces</div>
        </div>
      </div>
    </div>
  );
}
