'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const showBack = pathname !== '/' && pathname !== '/splash';

  if (pathname === '/') return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-[var(--brand-surface-2)]/95 px-4 py-3 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 rounded-3xl bg-[var(--brand-surface-3)] px-3 py-2 transition hover:opacity-90">
          <div className="relative h-11 w-11 overflow-hidden rounded-3xl bg-[var(--brand-surface)] ring-1 ring-[var(--brand-border)]">
            <Image
              src="/assets/ay-smart-logo.png"
              alt="AY'SMART logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--text-primary)]">AY'SMART</p>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--brand-purple)]">Property & Automotive</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {showBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <>
              <Link
                href="/properties"
                className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
              >
                Explore
              </Link>
              <Link
                href="/saved"
                className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
              >
                Saved
              </Link>
              <Link
                href="/inbox"
                className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
              >
                Inbox
              </Link>
              <Link href="/notifications" className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]">
                Updates
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
