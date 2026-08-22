import './globals.css';
import type { Metadata } from 'next';
import Footer from './components/Footer';
import DockNavbar from './components/DockNavbar';
import PageTransition from './components/PageTransition';
import ThemeProvider from './components/ThemeProvider';
import NewsletterSlideUp from './components/NewsletterSlideUp';
import AppHeader from './components/AppHeader';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';
import Analytics from './components/Analytics';
import SupportAssistant from './components/SupportAssistant';

export const metadata: Metadata = {
  title: "AY'SMART ECO | Real Estate & Construction",
  description: "Luxury properties, duplexes, and construction services.",
  manifest: '/manifest.webmanifest',
  applicationName: "AY'SMART ECO",
  keywords: ['real estate', 'hostel', 'luxury property', 'automotive', 'marketplace'],
  authors: [{ name: 'AYSMART INVESTMENT LTD' }],
  creator: 'AYSMART INVESTMENT LTD',
  publisher: 'AYSMART INVESTMENT LTD',
  icons: {
    icon: '/assets/ay-smart-logo.png',
    shortcut: '/assets/ay-smart-logo.png',
    apple: '/assets/ay-smart-logo.png',
    other: [{ rel: 'mask-icon', url: '/assets/ay-smart-logo.png' }],
  },
  metadataBase: new URL('https://ay-smart-ecosystem.vercel.app'),
  alternates: {
    canonical: 'https://ay-smart-ecosystem.vercel.app',
  },
  openGraph: {
    title: "AY'SMART ECO",
    description: 'Luxury properties, hostels, and automotive marketplace.',
    url: 'https://ay-smart-ecosystem.vercel.app',
    siteName: "AY'SMART ECO",
    images: [{ url: '/assets/ay-smart-logo.png', alt: "AY'SMART ECO" }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AY'SMART ECO",
    description: 'Luxury properties, hostels, and automotive marketplace.',
    images: ['/assets/ay-smart-logo.png'],
    creator: '@aysmartinvest',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AppHeader />
          <PageTransition>{children}</PageTransition>
          <DockNavbar />
          <Footer />
          <NewsletterSlideUp />
          <ServiceWorkerRegister />
          <Analytics />
          <SupportAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
