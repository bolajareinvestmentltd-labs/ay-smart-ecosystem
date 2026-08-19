'use client';

type SocialAuthButtonsProps = {
  onUnavailable?: (provider: string) => void;
};

const providers = [
  { key: 'Google', label: 'Continue with Google', mark: 'G' },
  { key: 'Apple', label: 'Continue with Apple', mark: 'A' },
  { key: 'Facebook', label: 'Continue with Facebook', mark: 'f' },
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
        {providers.map(({ key, label, mark }) => (
          <button
            key={key}
            type="button"
            onClick={() => onUnavailable?.(key)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--brand-surface-3)]"
          >
            <span className="w-4 text-center text-base font-black">{mark}</span>
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
