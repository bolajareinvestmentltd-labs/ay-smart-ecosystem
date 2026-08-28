'use client';
import { Home, Search, Calendar, User, Info } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Explore', icon: Search },
  { href: '/saved', label: 'Saved', icon: Home },
  { href: '/inbox', label: 'Messages', icon: Calendar },
  { href: '/dashboard', label: 'Profile', icon: User },
  { href: '/about', label: 'About', icon: Info },
];

export default function DockNavbar() {
  const pathname = usePathname();
  return (
    <nav style={{ width: 'calc(100% - 1rem)', maxWidth: 480 }} className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 rounded-[2rem] border border-[#4e235f]/20 bg-white/95 p-2.5 shadow-[0_18px_48px_rgba(46,17,54,0.16)] backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1">
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

      </div>
    </nav>
  );
}
