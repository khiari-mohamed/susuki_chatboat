import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import client from '../api/client';

const COMPAT_LABELS = { CONFIRMEE: 'Confirmée', NON_CONFORME: 'Non conforme', NON_VERIFIEE: 'Non vérifiée' };
const AVAILABILITY_LABELS = { DISPONIBLE: 'Disponible', INDISPONIBLE: 'Indisponible', NON_COMMUNIQUEE: 'Non communiquée' };
const REASON_LABELS = {
  NO_VEHICLE: 'Véhicule non renseigné',
  MODEL_CODE_MISSING: 'Code modèle absent',
  VEHICLE_NOT_VERIFIED: 'Compatibilité non vérifiée',
  NO_FITMENT: 'Aucune compatibilité en base',
  VEHICLE_INCOMPATIBLE: 'Véhicule incompatible',
  STOCK_UNKNOWN: 'Stock inconnu',
  IDENTITY_UNVERIFIED: 'Pièce non confirmée',
  IDENTITY_MISMATCH: 'Pièce différente',
  POSITION_UNVERIFIED: 'Position non confirmée',
  POSITION_MISMATCH: 'Position différente',
  QUALIFIER_UNVERIFIED: 'Variante non confirmée',
  QUALIFIER_MISMATCH: 'Variante différente',
  STOCK_PRICE_MISMATCH: 'Prix / stock incohérent',
  LOW_UNDERSTANDING: 'Demande mal comprise',
  JUDGE_UNAVAILABLE: 'Contrôle IA indisponible',
  AI_FLAG: 'Incohérence détectée',
  CLARIFICATION_UNRESOLVED: 'Précision manquante',
  NO_CANDIDATE: 'Aucune référence validée',
  NO_RESULTS: 'Aucun résultat',
  SYSTEM_ERROR: 'Erreur technique',
  UNSPECIFIED: 'Non précisé',
};

export default function SearchLogsPage() {
  const [vin, setVin] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client
      .get('/search-logs/redirect-stats', { params: { days: 30 } })
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  async function search(e) {
    e.preventDefault();
    if (!vin.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/search-logs', { params: { vin: vin.trim(), limit: 200 } });
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="entity-page">
      <div className="entity-header">
        <div>
          <h1>Historique des recherches</h1>
          <p className="entity-subtitle">Retrouver la discussion d'un client à partir de son VIN</p>
        </div>
        <form className="entity-toolbar" onSubmit={search}>
          <input
            className="search-box"
            placeholder="VIN (numéro de châssis)"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
          />
          <button className="btn-primary" type="submit" disabled={loading}>
            <Search size={14} /> {loading ? 'Recherche…' : 'Rechercher'}
          </button>
        </form>
      </div>

      {error && <div className="page-error">{error}</div>}

      {result && (
        <>
          <div className="pagination-info">
            VIN {result.vin} — {result.count} message(s), du plus récent au plus ancien
          </div>
          <div className="import-preview-table-wrap">
            <table className="import-preview-table">
              <thead>
                <tr>
                  <th>Date / heure</th>
                  <th>Demande du client</th>
                  <th>Pièce identifiée</th>
                  <th>Code modèle</th>
                  <th>Références proposées</th>
                  <th>Compatibilité</th>
                  <th>Disponibilité</th>
                  <th>Redirection Comptoir PR</th>
                </tr>
              </thead>
              <tbody>
                {result.entries.length === 0 && (
                  <tr><td colSpan={8}>Aucune recherche trouvée pour ce VIN.</td></tr>
                )}
                {result.entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.createdAt).toLocaleString('fr-FR')}</td>
                    <td>{entry.customerMessage}</td>
                    <td>{entry.identifiedPart || '—'}</td>
                    <td>{entry.modelCode || '—'}</td>
                    <td>
                      {(entry.proposedReferences || []).length === 0
                        ? '—'
                        : entry.proposedReferences.map((reference) => (
                            <div key={reference.reference}>{reference.reference} — {reference.designation}</div>
                          ))}
                    </td>
                    <td>{COMPAT_LABELS[entry.compatibilityResult] || '—'}</td>
                    <td>{AVAILABILITY_LABELS[entry.availabilityCommunicated] || '—'}</td>
                    <td title={entry.redirectMessage || ''}>
                      {entry.redirectMessage ? `Oui — ${REASON_LABELS[entry.redirectReason] || entry.redirectReason}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {stats && (
        <div className="quality-card" style={{ marginTop: 24 }}>
          <div className="quality-title">Redirections vers le Comptoir PR — 30 derniers jours</div>
          <div className="quality-caption">
            {stats.redirected} sur {stats.totalAnswers} réponses
          </div>
          {stats.byReason.map((item) => (
            <div key={item.reason} className="quality-caption">
              {REASON_LABELS[item.reason] || item.reason} : {item.count}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}