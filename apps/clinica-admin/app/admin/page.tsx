import Link from 'next/link';

export default function AdminPage() {
  return (
    <main>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Fase 1 - Modulos Administrativos</h3>
        <p style={{ color: '#374151' }}>
          Utilize os atalhos abaixo para gerir os cadastros basicos da clinica.
        </p>

        <div className="grid grid--3">
          <Link href="/admin/leads" className="card" style={{ padding: 20 }}>
            <h3>Leads</h3>
            <p style={{ marginBottom: 0, color: '#374151' }}>CRUD completo de leads.</p>
          </Link>

          <Link href="/admin/profissionais" className="card" style={{ padding: 20 }}>
            <h3>Profissionais</h3>
            <p style={{ marginBottom: 0, color: '#374151' }}>CRUD completo de profissionais.</p>
          </Link>

          <Link href="/admin/turmas" className="card" style={{ padding: 20 }}>
            <h3>Turmas</h3>
            <p style={{ marginBottom: 0, color: '#374151' }}>CRUD completo de turmas.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
