import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clínica Admin',
  description: 'Sistema administrativo da clínica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
