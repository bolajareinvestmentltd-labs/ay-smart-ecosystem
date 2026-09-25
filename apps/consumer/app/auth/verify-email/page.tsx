'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { buildApiUrl } from '../../lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') || '';
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    async function verify() {
      const uid = searchParams.get('uid');
      const token = searchParams.get('token');
      if (!uid || !token) {
        setStatus('failed');
        setMessage('Verification link is missing required information.');
        return;
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(buildApiUrl('/auth/verify-email/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ uid, token }),
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          setStatus('failed');
          setMessage(payload.detail || 'Email verification failed.');
          return;
        }

        setStatus('success');
        setMessage(payload.detail || 'Your email has been verified successfully. Welcome to AY\'SMART.');
        // Auto-redirect to login after 2 seconds
        setTimeout(() => router.push(`/auth/login?next=${encodeURIComponent(next || '/auth/profile')}`), 2500);
      } catch {
        setStatus('failed');
        setMessage('Verification service did not respond. Please request a fresh verification email and try again.');
      } finally {
        window.clearTimeout(timeout);
      }
    }

    verify();
  }, [next, router, searchParams]);

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-[#09090B]/80 p-10 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-accent">Email verification</p>
        <h1 className="mt-4 text-3xl font-black">{status === 'success' ? 'Verified!' : status === 'failed' ? 'Verification failed' : 'Verifying...'}</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400">{message}</p>
        {status === 'success' ? (
          <div className="mt-8">
            <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 p-4 text-sm text-zinc-300">
              <p className="font-semibold text-brand-accent">Your AY&apos;SMART next steps</p>
              <ul className="mt-2 space-y-1 text-zinc-400">
                <li>Complete your profile</li>
                <li>Finish KYC when required</li>
                <li>Explore verified listings and services</li>
              </ul>
            </div>
            <button onClick={() => router.push(`/auth/login?next=${encodeURIComponent(next || '/auth/profile')}`)} className="mt-4 rounded-full bg-brand-purple px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-magenta">
              Continue to onboarding
            </button>
          </div>
        ) : status === 'failed' ? (
          <button onClick={() => router.push('/register')} className="mt-8 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-accent hover:text-brand-accent">
            Return to register
          </button>
        ) : null}
      </div>
    </main>
  );
}
