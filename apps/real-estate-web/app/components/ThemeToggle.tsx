'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const subscribeToTheme = (onStoreChange: () => void) => {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  return () => observer.disconnect();
};

const getThemeSnapshot = () => document.documentElement.dataset.theme === 'dark';
const getServerThemeSnapshot = () => false;

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  function toggleTheme() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.body.dataset.theme = next;
    window.localStorage.setItem('aysmart-theme', next);
  }

  return (
    <button type="button" onClick={toggleTheme} aria-label={dark ? 'Use light theme' : 'Use dark theme'} className={`rounded-full p-2 text-[var(--text-primary)] hover:bg-[var(--brand-surface-3)] ${className}`}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
