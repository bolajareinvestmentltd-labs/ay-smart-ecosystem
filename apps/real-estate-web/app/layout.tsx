import './globals.css';
import type { Metadata } from 'next';
import Footer from './components/Footer';
import DockNavbar from './components/DockNavbar';
import PageTransition from './components/PageTransition';

export const metadata: Metadata = {
  title: "AY'SMART ECO | Real Estate & Construction",
  description: "Luxury properties, duplexes, and construction services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-brand-dark text-white antialiased selection:bg-brand-purple selection:text-white">
        <PageTransition>{children}</PageTransition>
        <DockNavbar />
        <Footer />
      </body>
    </html>
  );
}
