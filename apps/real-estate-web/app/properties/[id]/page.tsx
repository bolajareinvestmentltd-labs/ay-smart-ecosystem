'use client';
import Link from 'next/link';

export default function PropertyDetailPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Inspection booking</p>
        <h1 className="mt-2 text-3xl font-black">Book a private viewing for this property</h1>
        <p className="mt-3 text-sm text-zinc-400">The booking experience is ready for live backend integration and currently collects the information needed for the inspection request.</p>
        <div className="mt-6 space-y-3">
          <input className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Full name" />
          <input className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Phone number" />
          <input className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Preferred date" />
          <textarea className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" rows={4} placeholder="Message for the agent" />
          <button className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950">Request inspection</button>
        </div>
        <div className="mt-6">
          <Link href="/properties" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Back to catalog</Link>
        </div>
      </div>
    </main>
  );
}
