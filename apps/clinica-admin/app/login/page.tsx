"use client";

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        setError(payload?.message || 'Nao foi possivel autenticar.');
        setLoading(false);
        return;
      }

      const redirectTo = searchParams.get('redirect') || '/admin';
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError('Erro de conexao ao tentar autenticar.');
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f3f4f6' }}>
      <div className="card" style={{ width: '100%', maxWidth: 440 }}>
        <h1 style={{ marginTop: 0 }}>Acesso ao sistema</h1>
        <form className="form-grid" style={{ gridTemplateColumns: '1fr' }} onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="nome@clinica.com.br"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error ? (
            <p role="alert" style={{ color: '#b91c1c', margin: 0 }}>
              {error}
            </p>
          ) : null}
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
