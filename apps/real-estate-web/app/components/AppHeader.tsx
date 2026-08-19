'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const showBack = pathname !== '/' && pathname !== '/splash';

  if (pathname === '/') return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07070D]/95 backdrop-blur-xl px-4 py-3 shadow-sm shadow-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 rounded-3xl bg-white/5 px-3 py-2 transition hover:bg-white/10">
          <div className="relative h-11 w-11 overflow-hidden rounded-3xl bg-brand-purple/10 ring-1 ring-white/10">
            <Image
              src="/assets/ay-smart-logo.png"
              alt="AY'SMART logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white">AY'SMART</p>
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-accent">Property & Automotive</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <>
              <Link
                href="/properties"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore
              </Link>
              <Link
                href="/saved"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Saved
              </Link>
              <Link
                href="/inbox"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Inbox
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
