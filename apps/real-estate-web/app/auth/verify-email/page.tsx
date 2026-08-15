'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { buildApiUrl } from '../../lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

      try {
        const response = await fetch(buildApiUrl('/auth/verify-email/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, token }),
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          setStatus('failed');
          setMessage(payload.detail || 'Email verification failed.');
          return;
        }

        setStatus('success');
        setMessage('Your email has been verified successfully. Redirecting to login...');
        // Auto-redirect to login after 2 seconds
        setTimeout(() => router.push('/auth/login'), 2000);
      } catch {
        setStatus('failed');
        setMessage('Network error while verifying your email. Please try again.');
      }
    }

    verify();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-[#09090B]/80 p-10 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-accent">Email verification</p>
        <h1 className="mt-4 text-3xl font-black">{status === 'success' ? 'Verified!' : status === 'failed' ? 'Verification failed' : 'Verifying...'}</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400">{message}</p>
        {status === 'success' ? (
          <button onClick={() => router.push('/auth/login')} className="mt-8 rounded-full bg-brand-purple px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-magenta">
            Go to login
          </button>
        ) : status === 'failed' ? (
          <button onClick={() => router.push('/register')} className="mt-8 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-accent hover:text-brand-accent">
            Return to register
          </button>
        ) : null}
      </div>
    </main>
  );
}
