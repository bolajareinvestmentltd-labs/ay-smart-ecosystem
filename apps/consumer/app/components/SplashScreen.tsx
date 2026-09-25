'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('sa-splash-seen')) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('sa-splash-seen', '1');
        }
      }, 600);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b0610] transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(98,16,99,0.25)_0%,transparent_60%)] animate-pulse" />

      {/* Brand emblem */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-[#621063] to-[#e79e23] flex items-center justify-center shadow-2xl shadow-purple-900/60 animate-bounce">
          <span className="text-4xl font-black text-white tracking-tight">SA</span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white">
          Smart Assetz
        </h1>

        <p className="text-xs text-white/50 tracking-widest uppercase">
          Premium Property Ecosystem
        </p>

        {/* Loading bar */}
        <div className="mt-6 h-1 w-48 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#621063] via-[#e79e23] to-[#621063] animate-[splashload_2s_ease-in-out_infinite] w-full origin-left" />
        </div>
      </div>
    </div>
  );
}

