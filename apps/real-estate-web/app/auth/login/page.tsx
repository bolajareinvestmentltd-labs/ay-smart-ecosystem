'use client';
import Link from 'next/link';
import { useState } from 'react';
import { getStoredProfile, saveStoredProfile } from '../../lib/app-state';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    const profile = getStoredProfile();
    const userMatches = profile.email === identifier || profile.username === identifier;

    if (!userMatches || profile.password !== password) {
      setError('Email/username or password is incorrect.');
      return;
    }

    const nextProfile = { ...profile, isLoggedIn: true, failedLoginAttempts: 0 };
    saveStoredProfile(nextProfile);
    setMessage('Login successful. Redirecting to dashboard...');
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Sign in</p>
        <h1 className="mt-2 text-3xl font-black">Access your AY&apos;SMART account</h1>
        <p className="mt-3 text-sm text-zinc-400">Sign in with your email or username and password. Social login will be available soon.</p>

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
          <button className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm">Continue with Facebook</button>
          <button className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm">Continue with Apple</button>
          <button className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm">Continue with Microsoft</button>
        </div>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
      </div>
    </main>
  );
}
