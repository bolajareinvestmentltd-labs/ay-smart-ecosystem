'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Heart, MessageSquare, User, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Explore', icon: Compass },
  { href: '/saved', label: 'Saved', icon: Heart },
  { href: '/onboarding', label: 'Showcase', icon: Sparkles },
  { href: '/inbox', label: 'Messages', icon: MessageSquare },
  { href: '/auth/profile', label: 'Profile', icon: User },
];

export default function DockNavbar() {
  const pathname = usePathname();

  // Hide dock on onboarding page to let full-screen auth breathe
  if (pathname === '/onboarding') return null;

  return (
    <nav
      style={{ width: 'min(28rem, calc(100% - 2rem))' }}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/15 bg-[#120a1f]/90 px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-full transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-[#621063] to-[#9333ea] text-white shadow-md shadow-purple-950/60 scale-105'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              aria-label={label}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-[9px] font-bold tracking-wider uppercase leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
