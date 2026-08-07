'use client';

export default function AdSlot({ title, size }: { title: string; size: string }) {
  return (
    <section className="mx-auto my-6 w-full max-w-5xl rounded-[1.75rem] border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]/80 p-4 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">Sponsored</p>
        <span className="rounded-full border border-[color:var(--brand-border)] bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">{size}</span>
      </div>
      <div className="mt-4 flex min-h-24 items-center justify-center rounded-[1.25rem] border border-dashed border-[color:var(--brand-border)] bg-gradient-to-r from-orange-100 via-white to-purple-100 text-center text-sm font-semibold text-[color:var(--text-primary)]">
        {title}
      </div>
    </section>
  );
}
