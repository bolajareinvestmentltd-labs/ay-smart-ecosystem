'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { authFetch } from '../lib/auth';

export default function SavedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await authFetch('/api/saved-searches/');
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const payload = await res.json().catch(() => []);
      setItems(Array.isArray(payload) ? payload : []);
      setLoading(false);
    }
    load();
  }, []);

  async function removeSaved(id: number) {
    const res = await authFetch(`/api/saved-searches/${id}/`, { method: 'DELETE' });
    if (res.ok) setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">Saved</p>
            <h1 className="mt-2 text-3xl font-black">Saved searches</h1>
          </div>
          <Link href="/properties" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            Explore homes
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-300">Loading saved searches...</div>
        ) : items.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-zinc-400">
            <Bookmark className="mx-auto mb-3 text-brand-accent" />
            <p>No saved searches yet. Save a search from the property catalog to revisit it later.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                      {item.location && <span className="rounded-full border border-white/10 px-2 py-1">{item.location}</span>}
                      {item.property_type && <span className="rounded-full border border-white/10 px-2 py-1">{item.property_type}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSaved(item.id)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:border-red-500/40 hover:text-red-300"
                    aria-label="Remove saved search"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
