import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container" style={{ padding: '40px 20px' }}>
      <div className="card">
        <div className="header-row">
          <div>
            <p style={{ margin: 0, color: '#4f46e5', fontWeight: 700 }}>Clínica Admin</p>
            <h1 style={{ margin: '6px 0 0' }}>Dashboard inicial</h1>
          </div>
          <Link href="/login" className="btn btn--primary">Entrar</Link>
        </div>

        <div className="grid grid--3">
          <div className="card" style={{ padding: 20 }}>
            <h3>Leads</h3>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>0</p>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3>Pacientes</h3>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>0</p>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3>Turmas</h3>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>0</p>
          </div>
        </div>
      </div>
    </main>
  );
}
