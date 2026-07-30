'use client';
import Link from 'next/link';
import { useState } from 'react';
import { getStoredProfile, saveStoredProfile } from '../../lib/app-state';
import { loginWithPassword } from '../../lib/auth';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    // Call backend token endpoint
    const result = await loginWithPassword(identifier, password);
    if (!result.ok) {
      setError(result.payload?.detail || 'Login failed');
      return;
    }

    // mark profile as logged-in locally
    const profile = getStoredProfile();
    const nextProfile = { ...profile, isLoggedIn: true };
    saveStoredProfile(nextProfile);
    setMessage('Login successful. You can now view your wallet.');
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Sign in</p>
        <h1 className="mt-2 text-3xl font-black">Access your AY&apos;SMART account</h1>
        <p className="mt-3 text-sm text-zinc-400">Sign in with your email or username and password.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Email or username" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Password" />
          <button className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950">Sign in</button>
        </form>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/auth/forgot-password" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Forgot password?</Link>
          <Link href="/register" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Create account</Link>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm">Continue with Google</button>
        </div>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
      </div>
    </main>
  );
}
