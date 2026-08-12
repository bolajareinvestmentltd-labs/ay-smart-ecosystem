'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithPassword, getCurrentUser } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    const result = await loginWithPassword(identifier, password);
    if (!result.ok) {
      setError(result.payload?.detail || 'Login failed');
      return;
    }

    setMessage('Login successful. Loading profile...');

    // Poll for current user to ensure profile is available before redirect.
    const maxAttempts = 6;
    const delayMs = 500;
    let user = null;
    for (let i = 0; i < maxAttempts; i++) {
      // eslint-disable-next-line no-await-in-loop
      user = await getCurrentUser();
      if (user) break;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, delayMs));
    }

    const nextParam = searchParams.get('next') || '/';
    if (user) {
      setMessage('Profile loaded. Redirecting...');
      router.replace(nextParam);
    } else {
      // If we couldn't load profile, redirect to home but warn user
      setError('Logged in but profile not available yet. Redirecting to home.');
      router.replace('/');
    }
  }

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/10 bg-[#09090B]/70 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Sign in</p>
          <h1 className="mt-2 text-3xl font-black">Access your AY&apos;SMART account</h1>
          <p className="mt-3 text-sm text-zinc-400">Sign in with your email or username and password.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Email or username" />
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Password" />
            <button className="w-full rounded-2xl bg-brand-purple px-4 py-3 font-semibold text-white transition hover:bg-brand-magenta">Sign in</button>
          </form>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/auth/forgot-password" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Forgot password?</Link>
            <Link href="/register" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Create account</Link>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#09090B]/70 p-4">
            <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-brand-accent hover:text-brand-accent">Continue with Google</button>
          </div>

          {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
          {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
        </div>
      </div>
    </main>
  );
}
