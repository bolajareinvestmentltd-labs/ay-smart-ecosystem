'use client';
import Link from 'next/link';
import { useState } from 'react';
import { buildApiUrl } from '../../lib/api';
import { API } from '../../config/site';
import PasswordInput from '../../components/PasswordInput';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(buildApiUrl('/auth/password-reset/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload?.detail || 'Unable to reset password right now.');
        return;
      }

      setMessage('Password reset request submitted. Check your email for confirmation.');
    } catch {
      setError('Network error while resetting password.');
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Reset password</p>
        <h1 className="mt-2 text-3xl font-black">Forgot your password?</h1>
        <p className="mt-3 text-sm text-zinc-400">Enter your registered email and choose a new password for your account.</p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Registered email address" />
          <PasswordInput required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="New password" />
          <PasswordInput required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Confirm new password" />
          <button className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950">Reset password</button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/auth/login" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Back to login</Link>
        </div>
      </div>
    </main>
  );
}
