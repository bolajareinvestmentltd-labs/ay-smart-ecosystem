'use client';
import { useState, useEffect } from 'react';
import { Home, Search, Heart, Calendar, User, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Explore', icon: Search },
  { href: '/plans', label: 'Plans', icon: Calendar },
  { href: '/dashboard', label: 'Profile', icon: User },
];

export default function DockNavbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[min(96vw,720px)] -translate-x-1/2 rounded-full border border-white/10 bg-[#0a0a10]/95 p-2 shadow-2xl backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] uppercase tracking-[0.22em] transition-all ${
                active ? 'bg-brand-purple text-white shadow-sm shadow-brand-purple/20' : 'text-zinc-300 hover:bg-white/10 hover:text-white'
              }`}
              aria-label={label}
            >
              <Icon size={18} />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:border-brand-accent hover:text-white"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}
