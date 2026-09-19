import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMART ASSETZ Partner Suite',
  description: 'Multi-tenant partner portal for SMART ASSETZ operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
