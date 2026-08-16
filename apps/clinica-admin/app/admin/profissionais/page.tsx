'use client';

import { FormEvent, useEffect, useState } from 'react';

type Professional = {
  id: string;
  name: string;
  type: string;
  phone?: string | null;
  email?: string | null;
  status: string;
  defaultPercent?: string | number | null;
  defaultTransferDay?: number | null;
};

type ProfessionalForm = {
  id?: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  status: string;
  defaultPercent: string;
  defaultTransferDay: string;
};

const EMPTY_FORM: ProfessionalForm = {
  name: '',
  type: '',
  phone: '',
  email: '',
  status: 'ATIVO',
  defaultPercent: '',
  defaultTransferDay: '',
};

export default function AdminProfissionaisPage() {
  const [items, setItems] = useState<Professional[]>([]);
  const [form, setForm] = useState<ProfessionalForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadItems() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/professionals', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        setMessage(payload?.message || 'Erro ao carregar profissionais.');
        setLoading(false);
        return;
      }

      setItems(payload.data || []);
    } catch {
      setMessage('Erro de conexao ao carregar profissionais.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function onChange<K extends keyof ProfessionalForm>(key: K, value: ProfessionalForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function clearForm() {
    setForm(EMPTY_FORM);
  }

  function startEdit(item: Professional) {
    setForm({
      id: item.id,
      name: item.name,
      type: item.type,
      phone: item.phone || '',
      email: item.email || '',
      status: item.status,
      defaultPercent: item.defaultPercent != null ? String(item.defaultPercent) : '',
      defaultTransferDay: item.defaultTransferDay != null ? String(item.defaultTransferDay) : '',
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
        type: form.type,
        phone: form.phone,
        email: form.email,
        status: form.status,
        defaultPercent: form.defaultPercent || null,
        defaultTransferDay: form.defaultTransferDay ? Number(form.defaultTransferDay) : null,
      };

      const response = await fetch('/api/professionals', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        setMessage(json?.message || 'Erro ao salvar profissional.');
        setSaving(false);
        return;
      }

      setMessage(form.id ? 'Profissional atualizado com sucesso.' : 'Profissional criado com sucesso.');
      clearForm();
      await loadItems();
    } catch {
      setMessage('Erro de conexao ao salvar profissional.');
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    const confirmed = window.confirm('Deseja excluir este profissional?');
    if (!confirmed) return;

    setMessage('');

    try {
      const response = await fetch('/api/professionals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        setMessage(json?.message || 'Erro ao excluir profissional.');
        return;
      }

      setMessage('Profissional excluido com sucesso.');
      await loadItems();
    } catch {
      setMessage('Erro de conexao ao excluir profissional.');
    }
  }

  return (
    <main>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="header-row">
          <h3 style={{ margin: 0 }}>Profissionais</h3>
          <button type="button" className="btn btn--secondary" onClick={clearForm}>Novo</button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome</label>
            <input className="input" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div className="field">
            <label>Tipo</label>
            <input className="input" value={form.type} onChange={(e) => onChange('type', e.target.value)} required />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input className="input" value={form.phone} onChange={(e) => onChange('phone', e.target.value)} />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input className="input" type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} />
          </div>
          <div className="field">
            <label>Status</label>
            <select className="select" value={form.status} onChange={(e) => onChange('status', e.target.value)}>
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
          </div>
          <div className="field">
            <label>Percentual padrao</label>
            <input className="input" type="number" step="0.01" value={form.defaultPercent} onChange={(e) => onChange('defaultPercent', e.target.value)} />
          </div>
          <div className="field">
            <label>Dia transferencia</label>
            <input className="input" type="number" min={1} max={31} value={form.defaultTransferDay} onChange={(e) => onChange('defaultTransferDay', e.target.value)} />
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
              <th>Tipo</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
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
