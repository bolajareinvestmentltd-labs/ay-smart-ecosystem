'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';
import AuthShell from '../components/AuthShell';

export default function AuthEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) router.replace(next);
    });
  }, [next, router]);

  return (
    <AuthShell eyebrow="Welcome to AY&apos;SMART" title="Your trusted ecosystem starts here." description="Explore verified properties, comfortable hostels, and dependable automotive services in one place.">
      <div className="grid gap-3">
        <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="flex min-h-12 items-center justify-center rounded-2xl bg-[var(--brand-purple)] px-5 py-3 text-center font-bold text-white transition hover:bg-[var(--brand-magenta)]">Continue with email</Link>
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="flex min-h-12 items-center justify-center rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-5 py-3 text-center font-bold text-[var(--text-primary)] transition hover:border-[var(--brand-purple)]">Create a new account</Link>
      </div>
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">Already registered? <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="font-bold text-[var(--brand-purple)] underline-offset-4 hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}
