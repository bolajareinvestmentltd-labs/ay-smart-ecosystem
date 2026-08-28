'use client';

type SocialAuthButtonsProps = {
  onUnavailable?: (provider: string) => void;
};

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" role="img"><path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.22-2.23H12v4.22h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.88-1.73 2.99-4.28 2.99-7.52Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.45l-3.22-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.83-1.76-5.62-4.13H3.05v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.38 13.87A6 6 0 0 1 6.38 10V7.41H3.05a10 10 0 0 0 0 9.18l3.33-2.72Z"/><path fill="#EA4335" d="M12 5.74c1.47 0 2.8.51 3.84 1.51l2.88-2.88C16.95 2.73 14.7 2 12 2a10 10 0 0 0-8.95 5.41L6.38 10C7.17 7.63 9.39 5.74 12 5.74Z"/></svg>;
}

function AppleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current" role="img"><path d="M17.05 12.54c-.02-2.36 1.93-3.5 2.02-3.55a4.34 4.34 0 0 0-3.42-1.85c-1.45-.15-2.85.87-3.59.87-.75 0-1.9-.85-3.13-.83a4.6 4.6 0 0 0-3.87 2.36c-1.67 2.9-.42 7.16 1.18 9.5.8 1.14 1.73 2.4 2.96 2.36 1.19-.05 1.64-.76 3.08-.76 1.44 0 1.84.76 3.1.73 1.29-.02 2.1-1.15 2.89-2.3a9.4 9.4 0 0 0 1.32-2.66 4.12 4.12 0 0 1-2.54-3.87ZM14.69 5.6a4.14 4.14 0 0 0 .95-2.95 4.2 4.2 0 0 0-2.73 1.41 3.93 3.93 0 0 0-.98 2.84 3.47 3.47 0 0 0 2.76-1.3Z"/></svg>;
}

const providers = [
  { key: 'Google', label: 'Continue with Google', icon: <GoogleMark /> },
  { key: 'Apple', label: 'Continue with Apple', icon: <AppleMark /> },
];

export default function SocialAuthButtons({ onUnavailable }: SocialAuthButtonsProps) {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="h-px flex-1 bg-[var(--brand-border)]" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-[var(--brand-border)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {providers.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onUnavailable?.(key)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
          >
            {icon}
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onUnavailable?.('X')}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
        >
          <span className="text-base font-black">X</span>
          Continue with X
        </button>
      </div>
    </div>
  );
}
