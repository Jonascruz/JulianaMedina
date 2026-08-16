'use client';

import { FormEvent, useEffect, useState } from 'react';

type Professional = {
  id: string;
  name: string;
};

type Turma = {
  id: string;
  name: string;
  professionalId: string;
  daysOfWeek: string[];
  schedule?: string | null;
  defaultValue?: string | number | null;
  defaultClinicPercent?: string | number | null;
  defaultProfessionalPercent?: string | number | null;
  status: string;
  professional?: { name: string } | null;
};

type TurmaForm = {
  id?: string;
  name: string;
  professionalId: string;
  daysOfWeek: string;
  schedule: string;
  defaultValue: string;
  defaultClinicPercent: string;
  defaultProfessionalPercent: string;
  status: string;
};

const EMPTY_FORM: TurmaForm = {
  name: '',
  professionalId: '',
  daysOfWeek: '',
  schedule: '',
  defaultValue: '',
  defaultClinicPercent: '',
  defaultProfessionalPercent: '',
  status: 'ATIVO',
};

export default function AdminTurmasPage() {
  const [items, setItems] = useState<Turma[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [form, setForm] = useState<TurmaForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadProfessionals() {
    const response = await fetch('/api/professionals', { cache: 'no-store' });
    const payload = await response.json();
    if (response.ok && payload?.ok) {
      setProfessionals(payload.data || []);
    }
  }

  async function loadItems() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/turmas', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        setMessage(payload?.message || 'Erro ao carregar turmas.');
        setLoading(false);
        return;
      }

      setItems(payload.data || []);
    } catch {
      setMessage('Erro de conexao ao carregar turmas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfessionals();
    loadItems();
  }, []);

  function onChange<K extends keyof TurmaForm>(key: K, value: TurmaForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function clearForm() {
    setForm(EMPTY_FORM);
  }

  function startEdit(item: Turma) {
    setForm({
      id: item.id,
      name: item.name,
      professionalId: item.professionalId,
      daysOfWeek: item.daysOfWeek?.join(', ') || '',
      schedule: item.schedule || '',
      defaultValue: item.defaultValue != null ? String(item.defaultValue) : '',
      defaultClinicPercent: item.defaultClinicPercent != null ? String(item.defaultClinicPercent) : '',
      defaultProfessionalPercent: item.defaultProfessionalPercent != null ? String(item.defaultProfessionalPercent) : '',
      status: item.status,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const method = form.id ? 'PUT' : 'POST';
      const payload = {
        id: form.id,
        name: form.name,
        professionalId: form.professionalId,
        daysOfWeek: form.daysOfWeek
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        schedule: form.schedule || null,
        defaultValue: form.defaultValue || null,
        defaultClinicPercent: form.defaultClinicPercent || null,
        defaultProfessionalPercent: form.defaultProfessionalPercent || null,
        status: form.status,
      };

      const response = await fetch('/api/turmas', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        setMessage(json?.message || 'Erro ao salvar turma.');
        setSaving(false);
        return;
      }

      setMessage(form.id ? 'Turma atualizada com sucesso.' : 'Turma criada com sucesso.');
      clearForm();
      await loadItems();
    } catch {
      setMessage('Erro de conexao ao salvar turma.');
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    const confirmed = window.confirm('Deseja excluir esta turma?');
    if (!confirmed) return;

    setMessage('');

    try {
      const response = await fetch('/api/turmas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        setMessage(json?.message || 'Erro ao excluir turma.');
        return;
      }

      setMessage('Turma excluida com sucesso.');
      await loadItems();
    } catch {
      setMessage('Erro de conexao ao excluir turma.');
    }
  }

  return (
    <main>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="header-row">
          <h3 style={{ margin: 0 }}>Turmas</h3>
          <button type="button" className="btn btn--secondary" onClick={clearForm}>Nova</button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome</label>
            <input className="input" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div className="field">
            <label>Profissional</label>
            <select className="select" value={form.professionalId} onChange={(e) => onChange('professionalId', e.target.value)} required>
              <option value="">Selecione</option>
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>{professional.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Dias da semana (CSV)</label>
            <input className="input" value={form.daysOfWeek} onChange={(e) => onChange('daysOfWeek', e.target.value)} placeholder="SEG, TER, QUA" />
          </div>
          <div className="field">
            <label>Horario</label>
            <input className="input" value={form.schedule} onChange={(e) => onChange('schedule', e.target.value)} />
          </div>
          <div className="field">
            <label>Valor padrao</label>
            <input className="input" type="number" step="0.01" value={form.defaultValue} onChange={(e) => onChange('defaultValue', e.target.value)} />
          </div>
          <div className="field">
            <label>% Clinica</label>
            <input className="input" type="number" step="0.01" value={form.defaultClinicPercent} onChange={(e) => onChange('defaultClinicPercent', e.target.value)} />
          </div>
          <div className="field">
            <label>% Profissional</label>
            <input className="input" type="number" step="0.01" value={form.defaultProfessionalPercent} onChange={(e) => onChange('defaultProfessionalPercent', e.target.value)} />
          </div>
          <div className="field">
            <label>Status</label>
            <select className="select" value={form.status} onChange={(e) => onChange('status', e.target.value)}>
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <button className="btn btn--primary" disabled={saving} type="submit">
              {saving ? 'Salvando...' : form.id ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>

        {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Lista</h3>
        {loading ? <p>Carregando...</p> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Profissional</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.professional?.name || '-'}</td>
                <td>{item.status}</td>
                <td>
                  <button className="btn btn--secondary" type="button" onClick={() => startEdit(item)}>Editar</button>{' '}
                  <button className="btn btn--danger" type="button" onClick={() => removeItem(item.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {!items.length && !loading ? (
              <tr>
                <td colSpan={4}>Sem dados.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
