'use client';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = window.localStorage.getItem('aysmart-theme');
    const initialTheme = stored || 'light';

    root.dataset.theme = initialTheme;
    root.classList.toggle('dark', initialTheme === 'dark');
    document.body.dataset.theme = initialTheme;
    window.localStorage.setItem('aysmart-theme', initialTheme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return <>{children}</>;
}
