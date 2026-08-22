export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-12 w-40 rounded-2xl bg-[var(--brand-surface-3)]" />
        <div className="h-8 w-2/3 max-w-md rounded-xl bg-[var(--brand-surface-3)]" />
        <div className="h-40 w-full max-w-3xl rounded-[1.5rem] bg-[var(--brand-surface-2)]" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-[var(--brand-surface-2)]" />
          <div className="h-28 rounded-2xl bg-[var(--brand-surface-2)]" />
          <div className="h-28 rounded-2xl bg-[var(--brand-surface-2)]" />
        </div>
      </div>
    </main>
  );
}
