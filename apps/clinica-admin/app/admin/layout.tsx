import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from './logout-button';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!hasAdminAccess(user)) {
    redirect('/login');
  }

  return (
    <div className="page-shell">
      <aside className="sidebar">
        <span className="sidebar__brand">Clinica Admin</span>
        <ul className="nav-list">
          <li><Link href="/admin">Inicio</Link></li>
          <li><Link href="/admin/leads">Leads</Link></li>
          <li><Link href="/admin/profissionais">Profissionais</Link></li>
          <li><Link href="/admin/turmas">Turmas</Link></li>
        </ul>
      </aside>

      <section className="content">
        <div className="header-row" style={{ marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0 }}>Area Administrativa</h2>
            <p style={{ margin: '6px 0 0', color: '#374151' }}>
              {user.name} ({user.email})
            </p>
          </div>
          <LogoutButton />
        </div>

        {children}
      </section>
    </div>
  );
}
