'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const media = [
  { kind: 'image', src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', label: 'Verified properties' },
  { kind: 'image', src: 'https://images.unsplash.com/photo-1560185127-6a8c5f7f8f6b?auto=format&fit=crop&w=1200&q=85', label: 'Student hostels' },
  { kind: 'image', src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85', label: 'Automotive services' },
  { kind: 'video', src: 'https://cdn.coverr.co/videos/coverr-a-modern-house-1574/1080p.mp4', poster: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85', label: 'Spaces that move with you' },
] as const;

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % media.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-6 text-[var(--text-primary)] sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface-2)] shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative min-h-[370px] overflow-hidden bg-[var(--brand-purple-deep)] text-white lg:min-h-full">
          {media.map((item, index) => (
            <div key={item.label} className={`absolute inset-0 transition-opacity duration-1000 ${index === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              {item.kind === 'video' ? (
                <video autoPlay muted loop playsInline poster={item.poster} className="h-full w-full object-cover" aria-label={item.label}>
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <Image src={item.src} alt={item.label} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" priority={index === 0} unoptimized />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d1024] via-[#2a1536]/35 to-transparent" />
            </div>
          ))}
          <div className="relative z-10 flex min-h-[370px] flex-col justify-between p-6 sm:p-8 lg:min-h-full lg:p-10">
            <div className="flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-white p-2"><Image src="/assets/brand-logo.svg" alt="AY'SMART" fill className="object-contain" /></span>
              <span className="text-sm font-black tracking-[0.2em]">AY&apos;SMART ECO</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-accent)]">{media[active].label}</p>
              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight sm:text-4xl">Find your next place, stay, or drive.</h2>
              <div className="mt-6 flex gap-2" aria-label="Choose showcase media">
                {media.map((item, index) => <button key={item.label} type="button" aria-label={`Show ${item.label}`} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${index === active ? 'w-8 bg-[var(--brand-accent)]' : 'w-2 bg-white/50'}`} />)}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10">
          <div className="w-full">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-purple)]">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--text-muted)]">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
