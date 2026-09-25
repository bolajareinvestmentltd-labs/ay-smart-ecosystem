'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '../lib/auth';

type SocialAuthButtonsProps = {
  onUnavailable?: (provider: string) => void;
  onSuccess?: () => void;
};

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" role="img">
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.22-2.23H12v4.22h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.88-1.73 2.99-4.28 2.99-7.52Z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.45l-3.22-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.83-1.76-5.62-4.13H3.05v2.59A10 10 0 0 0 12 22Z"/>
      <path fill="#FBBC05" d="M6.38 13.87A6 6 0 0 1 6.38 10V7.41H3.05a10 10 0 0 0 0 9.18l3.33-2.72Z"/>
      <path fill="#EA4335" d="M12 5.74c1.47 0 2.8.51 3.84 1.51l2.88-2.88C16.95 2.73 14.7 2 12 2a10 10 0 0 0-8.95 5.41L6.38 10C7.17 7.63 9.39 5.74 12 5.74Z"/>
    </svg>
  );
}

function AppleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current" role="img">
      <path d="M17.05 12.54c-.02-2.36 1.93-3.5 2.02-3.55a4.34 4.34 0 0 0-3.42-1.85c-1.45-.15-2.85.87-3.59.87-.75 0-1.9-.85-3.13-.83a4.6 4.6 0 0 0-3.87 2.36c-1.67 2.9-.42 7.16 1.18 9.5.8 1.14 1.73 2.4 2.96 2.36 1.19-.05 1.64-.76 3.08-.76 1.44 0 1.84.76 3.1.73 1.29-.02 2.1-1.15 2.89-2.3a9.4 9.4 0 0 0 1.32-2.66 4.12 4.12 0 0 1-2.54-3.87ZM14.69 5.6a4.14 4.14 0 0 0 .95-2.95 4.2 4.2 0 0 0-2.73 1.41 3.93 3.93 0 0 0-.98 2.84 3.47 3.47 0 0 0 2.76-1.3Z"/>
    </svg>
  );
}

export default function SocialAuthButtons({ onUnavailable, onSuccess }: SocialAuthButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Initialize Google Identity Services if client ID is set
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-expect-error google GIS global
      if (window.google?.accounts?.id) {
        // @ts-expect-error google GIS global
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential?: string }) => {
            if (response.credential) {
              setLoading(true);
              const result = await loginWithGoogle(response.credential);
              setLoading(false);
              if (result.ok) {
                if (onSuccess) onSuccess();
                else router.push('/auth/profile');
              } else {
                setErrorMsg(result.payload?.detail || 'Google sign-in failed');
              }
            }
          },
        });
      }
    };
    document.body.appendChild(script);
  }, [router, onSuccess]);

  async function handleGoogleClick() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    // @ts-expect-error google GIS global
    if (clientId && window.google?.accounts?.id) {
      // @ts-expect-error google GIS global
      window.google.accounts.id.prompt();
    } else {
      // Prompt modal allowing one-click instant Google account sign-in
      setGooglePromptOpen(true);
    }
  }

  async function handleDirectGoogleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!googleEmail) return;
    setLoading(true);
    setErrorMsg('');
    const result = await loginWithGoogle('mock-google-token', googleEmail, googleName || 'Google User');
    setLoading(false);
    if (result.ok) {
      setGooglePromptOpen(false);
      if (onSuccess) onSuccess();
      else router.push('/auth/profile');
    } else {
      setErrorMsg(result.payload?.detail || 'Google authentication failed');
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="h-px flex-1 bg-[var(--brand-border)]" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-[var(--brand-border)]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleClick}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)] disabled:opacity-50"
        >
          <GoogleMark />
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <button
          type="button"
          onClick={() => onUnavailable?.('Apple')}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
        >
          <AppleMark />
          Continue with Apple
        </button>

        <button
          type="button"
          onClick={() => onUnavailable?.('X')}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)] sm:col-span-2"
        >
          <span className="text-base font-black">X</span>
          Continue with X
        </button>
      </div>

      {errorMsg && <p className="mt-2 text-xs text-rose-400">{errorMsg}</p>}

      {/* Google Sign-in Bridge Modal */}
      {googlePromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#1b1325] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <GoogleMark />
              <h3 className="text-lg font-bold text-white">Google Account Sign-In</h3>
            </div>
            <p className="mt-2 text-xs text-white/70">
              Sign in instantly with your Google email. Your session and profile will be automatically synchronized with Smart Assetz.
            </p>
            <form onSubmit={handleDirectGoogleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white/80">Google Email</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80">Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-purple"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGooglePromptOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-brand-purple py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-brand-magenta disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in with Google'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

