import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMART ASSETZ Consumer',
  description: 'Consumer marketplace and checkout experience for SMART ASSETZ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
