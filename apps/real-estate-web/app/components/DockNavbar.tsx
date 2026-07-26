'use client';
import { useState, useEffect } from 'react';
import { Home, Search, Heart, Calendar, User, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function DockNavbar() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md border border-brand-purple/20 shadow-2xl rounded-full px-6 py-3 flex items-center justify-between gap-6 max-w-md w-full transition-all duration-300">
        
        <Link href="/" className="flex flex-col items-center text-brand-purple dark:text-brand-accent hover:scale-110 transition-transform">
          <Home size={20} />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>

        <Link href="/properties" className="flex flex-col items-center text-zinc-600 dark:text-zinc-300 hover:text-brand-purple transition-colors">
          <Search size={20} />
          <span className="text-[10px] font-medium mt-1">Explore</span>
        </Link>

        <Link href="/favorites" className="flex flex-col items-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-100 transition-colors">
          <Heart size={20} />
          <span className="text-[10px] font-medium mt-1">Saved</span>
        </Link>

        <Link href="/bookings" className="flex flex-col items-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-100 transition-colors">
          <Calendar size={20} />
          <span className="text-[10px] font-medium mt-1">Bookings</span>
        </Link>

        <Link href="/dashboard" className="flex flex-col items-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-100 transition-colors">
          <User size={20} />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </Link>

        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-brand-purple/10 dark:bg-brand-accent/20 text-brand-purple dark:text-brand-accent hover:rotate-45 transition-transform"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

      </div>
    </div>
  );
}
