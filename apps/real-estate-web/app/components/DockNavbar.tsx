'use client';
import { useState, useEffect } from 'react';
import { Home, Search, Calendar, User, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Explore', icon: Search },
  { href: '/saved', label: 'Saved', icon: Home },
  { href: '/inbox', label: 'Messages', icon: Calendar },
  { href: '/dashboard', label: 'Profile', icon: User },
];

export default function DockNavbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.localStorage.getItem('aysmart-theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    const nextTheme = darkMode ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    document.body.dataset.theme = nextTheme;
    root.classList.toggle('dark', darkMode);
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem('aysmart-theme', nextTheme);
  }, [darkMode]);

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[min(98vw,480px)] -translate-x-1/2 rounded-[2rem] border border-[#4e235f]/20 bg-white/95 p-2.5 shadow-[0_18px_48px_rgba(46,17,54,0.16)] backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 rounded-[1.2rem] px-2.5 py-2 text-[9px] uppercase tracking-[0.2em] transition-all ${
                active
                  ? 'bg-[#4e235f] text-white shadow-sm shadow-[#4e235f]/20'
                  : 'text-[color:var(--text-muted)] hover:bg-[color:var(--brand-surface)]/10 hover:text-[color:var(--text-primary)]'
              }`}
              aria-label={label}
            >
              <Icon size={20} />
              <span className="leading-tight text-[8px]">{label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-2xl border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]/10 p-2 text-[color:var(--text-muted)] transition hover:border-brand-accent hover:text-[color:var(--text-primary)]"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}
