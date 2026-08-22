'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { buildApiUrl } from '../../lib/api';

export default function VerificationSentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const next = searchParams.get('next') || '';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [message, setMessage] = useState('A verification email has been sent to your address.');
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    if (!email) {
      setMessage('No email provided.');
      setStatus('failed');
    }
    if (email) {
      const key = `resendCooldown:${email}`;
      const ts = Number(localStorage.getItem(key) || '0');
      const remaining = Math.max(0, Math.round((ts - Date.now()) / 1000));
      if (remaining > 0) setCooldown(remaining);
    }
  }, [email]);

  async function resend() {
    if (!email) return;
    setStatus('sending');
    setMessage('Sending verification email...');
    try {
      const res = await fetch(buildApiUrl('/auth/resend-verification/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('failed');
        setMessage(payload.detail || 'Failed to send verification email.');
        return;
      }
      setStatus('sent');
      setMessage('Verification email sent. Check your inbox.');

      // start cooldown for 60s and persist to localStorage per email
      const cooldownSeconds = 60;
      const key = `resendCooldown:${email}`;
      const until = Date.now() + cooldownSeconds * 1000;
      try { localStorage.setItem(key, String(until)); } catch (e) {}
      setCooldown(cooldownSeconds);
      const interval = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch {
      setStatus('failed');
      setMessage('Network error while resending verification.');
    }
  }

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-[#09090B]/80 p-10 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-accent">Email verification</p>
        <h1 className="mt-4 text-3xl font-black">Verification required</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400">{message}</p>

        <div className="mt-6 flex gap-3">
          <button onClick={resend} disabled={status === 'sending' || cooldown > 0 || !email} className="rounded-full bg-brand-purple px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {cooldown > 0 ? `Resend available in ${cooldown}s` : status === 'sending' ? 'Sending...' : 'Resend verification email'}
          </button>
          <button onClick={() => router.push(`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ''}`)} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white">
            Go to login
          </button>
        </div>
      </div>
    </main>
  );
}
