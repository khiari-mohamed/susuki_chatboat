import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
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
