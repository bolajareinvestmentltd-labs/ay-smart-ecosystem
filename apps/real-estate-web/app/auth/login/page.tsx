'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithPassword, getCurrentUser } from '../../lib/auth';
import PasswordInput from '../../components/PasswordInput';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    BiometricAuth.checkBiometry().then((result) => setBiometricAvailable(result.isAvailable)).catch(() => setBiometricAvailable(false));
  }, []);

  function handleSocialAuth(provider: string) {
    setError(`${provider} sign-in will be available after its OAuth credentials are configured.`);
  }

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

    const nextParam = searchParams.get('next') || '/auth/profile';
    if (user) {
      setMessage('Profile loaded. Redirecting...');
      router.replace(nextParam);
    } else {
      // If we couldn't load profile, still send the user into the profile setup flow.
      setError('Logged in but profile not available yet. Redirecting to profile setup.');
      router.replace('/auth/profile');
    }
  }

  async function handleBiometricLogin() {
    setError('');
    try {
      await BiometricAuth.authenticate({
        reason: 'Unlock your AY\'SMART account',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Use passcode',
        androidTitle: 'Unlock AY\'SMART',
        androidSubtitle: 'Use your fingerprint or face',
      });
      const user = await getCurrentUser();
      if (!user) {
        setError('Sign in with your password once on this device before using biometric unlock.');
        return;
      }
      router.replace(searchParams.get('next') || '/auth/profile');
    } catch {
      setError('Biometric authentication was cancelled or unavailable.');
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface-2)] shadow-2xl backdrop-blur-xl">
        <div className="border-b border-[var(--brand-border)] bg-[var(--brand-surface-3)] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Sign in</p>
          <h1 className="mt-2 text-3xl font-black">Access your AY&apos;SMART account</h1>
          <p className="mt-3 text-sm text-zinc-400">Sign in with your email or username and password.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-brand-purple" placeholder="Email or username" />
            <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-brand-purple" placeholder="Password" />
            <button className="w-full rounded-2xl bg-brand-purple px-4 py-3 font-semibold text-white transition hover:bg-brand-magenta">Sign in</button>
            {biometricAvailable && <button type="button" onClick={handleBiometricLogin} className="w-full rounded-2xl border border-brand-purple px-4 py-3 font-semibold text-brand-purple transition hover:bg-brand-purple/10">Unlock with Face ID / fingerprint</button>}
          </form>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/auth/forgot-password" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Forgot password?</Link>
            <Link href="/register" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Create account</Link>
          </div>

          <SocialAuthButtons onUnavailable={handleSocialAuth} />

          {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
          {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
        </div>
      </div>
    </main>
  );
}
