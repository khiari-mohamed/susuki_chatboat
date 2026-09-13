import React, { useState } from 'react';

// Renders one form field per column flagged `createOnly` or `editable`
// (i.e. every column that isn't purely computed/read-only, like `id`
// or the joined `stock` summary column on Parts).
export default function AddRecordModal({ entity, onClose, onSubmit }) {
  const fields = entity.columns.filter((c) => c.createOnly || c.editable);
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.type === 'select' ? f.options?.[0] ?? '' : ''])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const missing = fields.filter((f) => f.required && !String(values[f.key] ?? '').trim());
    if (missing.length > 0) {
      setError(`Champ requis manquant : ${missing.map((f) => f.name).join(', ')}`);
      return;
    }

    const payload = {};
    for (const f of fields) {
      const raw = values[f.key];
      if (raw === '' || raw === undefined) continue;
      payload[f.key] = f.type === 'number' ? Number(raw) : raw;
    }

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Ajouter — {entity.label}</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-fields">
            {fields.map((f) => (
              <label key={f.key} className="modal-field">
                <span>
                  {f.name}
                  {f.required && <span className="required-star"> *</span>}
                </span>
                {f.type === 'select' ? (
                  <select value={values[f.key]} onChange={(e) => setField(f.key, e.target.value)}>
                    {(f.options || []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    step={f.type === 'number' ? 'any' : undefined}
                    value={values[f.key]}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Ajout…' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
