import './globals.css';
import type { Metadata } from 'next';
import Footer from './components/Footer';
import DockNavbar from './components/DockNavbar';
import PageTransition from './components/PageTransition';
import Link from 'next/link';
import AuthHeader from './components/AuthHeader';

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
      <body className="bg-[#09090B] text-[#F9FAFB] min-h-screen antialiased selection:bg-[#581C87] selection:text-white">
        <header className="fixed left-4 top-4 z-50 hidden items-center gap-3 rounded-lg bg-black/40 p-2 backdrop-blur-md md:flex">
          <Link href="/">
            <img src="/assets/brand-logo.svg" alt="AY'SMART ECO" className="h-10 w-auto" />
          </Link>
          <AuthHeader />
        </header>
        <PageTransition>{children}</PageTransition>
        <DockNavbar />
        <Footer />
      </body>
    </html>
  );
}
