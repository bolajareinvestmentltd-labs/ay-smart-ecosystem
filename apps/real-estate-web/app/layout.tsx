import './globals.css';
import type { Metadata } from 'next';
import Footer from './components/Footer';
import DockNavbar from './components/DockNavbar';
import PageTransition from './components/PageTransition';
import ThemeProvider from './components/ThemeProvider';
import NewsletterSlideUp from './components/NewsletterSlideUp';

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
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <PageTransition>{children}</PageTransition>
          <DockNavbar />
          <Footer />
          <NewsletterSlideUp />
        </ThemeProvider>
      </body>
    </html>
  );
}
