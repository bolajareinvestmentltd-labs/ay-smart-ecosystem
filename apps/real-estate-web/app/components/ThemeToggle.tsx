'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);

  function toggleTheme() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.body.dataset.theme = next;
    window.localStorage.setItem('aysmart-theme', next);
    setDark(next === 'dark');
  }

  return (
    <button type="button" onClick={toggleTheme} aria-label={dark ? 'Use light theme' : 'Use dark theme'} className="rounded-full p-2 text-[var(--text-primary)] hover:bg-[var(--brand-surface-3)]">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
