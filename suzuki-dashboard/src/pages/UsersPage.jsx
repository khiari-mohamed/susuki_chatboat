import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptyForm = { email: '', name: '', password: '', role: 'EDITOR' };

export default function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await client.get('/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await client.post('/users', form);
      setForm(emptyForm);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(u) {
    try {
      await client.put(`/users/${u.id}`, { isActive: !u.isActive });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  }

  async function changeRole(u, role) {
    try {
      await client.put(`/users/${u.id}`, { role });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(`Supprimer le compte de ${u.email} ?`)) return;
    try {
      await client.delete(`/users/${u.id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  }

  return (
    <div className="entity-page">
      <div className="entity-header">
        <div>
          <h1>Utilisateurs</h1>
          <p className="entity-subtitle">Comptes ayant accès au portail admin</p>
        </div>
        <div className="entity-toolbar">
          <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
            + Nouveau compte
          </button>
        </div>
      </div>

      {error && <div className="page-error">{error}</div>}

      {showForm && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Nom complet"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Mot de passe (8+ caractères)"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="EDITOR">EDITOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Création…' : 'Créer'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="full-page-loader">Chargement…</div>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} disabled={u.id === me.id}>
                    <option value="EDITOR">EDITOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button className="btn-secondary" onClick={() => toggleActive(u)} disabled={u.id === me.id}>
                    {u.isActive ? '✅ Actif' : '⛔ Désactivé'}
                  </button>
                </td>
                <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('fr-FR') : '—'}</td>
                <td>
                  {u.id !== me.id && (
                    <button className="grid-delete-btn" onClick={() => handleDelete(u)}>
                      🗑
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
