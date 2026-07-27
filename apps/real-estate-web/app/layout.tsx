import './globals.css';
import type { Metadata } from 'next';

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
        {children}
      </body>
    </html>
  );
}
