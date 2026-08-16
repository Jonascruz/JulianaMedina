'use client';

import { FormEvent, useEffect, useState } from 'react';

type Lead = {
  id: string;
  source: string | null;
  status: string;
  person?: {
    name?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    school?: string | null;
  } | null;
};

type LeadForm = {
  id?: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  school: string;
  source: string;
  status: string;
};

const EMPTY_FORM: LeadForm = {
  name: '',
  phone: '',
  whatsapp: '',
  email: '',
  school: '',
  source: 'manual',
  status: 'LEAD',
};

export default function AdminLeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadItems() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/leads', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        setMessage(payload?.message || 'Erro ao carregar leads.');
        setLoading(false);
        return;
      }

      setItems(payload.data || []);
    } catch {
      setMessage('Erro de conexao ao carregar leads.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function onChange<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(item: Lead) {
    setForm({
      id: item.id,
      name: item.person?.name || '',
      phone: item.person?.phone || '',
      whatsapp: item.person?.whatsapp || '',
      email: item.person?.email || '',
      school: item.person?.school || '',
      source: item.source || 'manual',
      status: item.status || 'LEAD',
    });
  }

  function clearForm() {
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const method = form.id ? 'PUT' : 'POST';
      const payload = {
        ...form,
        id: form.id,
      };

      const response = await fetch('/api/leads', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        setMessage(json?.message || 'Erro ao salvar lead.');
        setSaving(false);
        return;
      }

      setMessage(form.id ? 'Lead atualizado com sucesso.' : 'Lead criado com sucesso.');
      clearForm();
      await loadItems();
    } catch {
      setMessage('Erro de conexao ao salvar lead.');
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    const confirmed = window.confirm('Deseja excluir este lead?');
    if (!confirmed) return;

    setMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const json = await response.json();

      if (!response.ok || !json?.ok) {
        setMessage(json?.message || 'Erro ao excluir lead.');
        return;
      }

      setMessage('Lead excluido com sucesso.');
      await loadItems();
    } catch {
      setMessage('Erro de conexao ao excluir lead.');
    }
  }

  return (
    <main>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="header-row">
          <h3 style={{ margin: 0 }}>Leads</h3>
          <button type="button" className="btn btn--secondary" onClick={clearForm}>Novo</button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome</label>
            <input className="input" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input className="input" value={form.phone} onChange={(e) => onChange('phone', e.target.value)} />
          </div>
          <div className="field">
            <label>WhatsApp</label>
            <input className="input" value={form.whatsapp} onChange={(e) => onChange('whatsapp', e.target.value)} />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input className="input" type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} />
          </div>
          <div className="field">
            <label>Escola</label>
            <input className="input" value={form.school} onChange={(e) => onChange('school', e.target.value)} />
          </div>
          <div className="field">
            <label>Origem</label>
            <input className="input" value={form.source} onChange={(e) => onChange('source', e.target.value)} />
          </div>
          <div className="field">
            <label>Status</label>
            <select className="select" value={form.status} onChange={(e) => onChange('status', e.target.value)}>
              <option value="LEAD">LEAD</option>
              <option value="EM_AVALIACAO">EM_AVALIACAO</option>
              <option value="EM_TRATAMENTO">EM_TRATAMENTO</option>
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
              <th>Telefone</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.person?.name || '-'}</td>
                <td>{item.person?.phone || '-'}</td>
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
