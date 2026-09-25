import './globals.css';
import type { Metadata } from 'next';
import { PartnerProvider } from './lib/partner-context';

export const metadata: Metadata = {
  title: 'Smart Assetz | Partner Suite',
  description: 'Dedicated multi-tenant portals for agents, sellers, landlords, investors, tenants, students, and hotel hosts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0610] text-[#f4eff8] antialiased">
        <PartnerProvider>{children}</PartnerProvider>
      </body>
    </html>
  );
}

