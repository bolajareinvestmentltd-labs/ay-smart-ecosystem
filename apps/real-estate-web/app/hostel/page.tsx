'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { MapPin, Star, Bookmark } from 'lucide-react';
import { getPublishedListings, listingImage, type BackendListing } from '../lib/backend';
import { authFetch } from '../lib/auth';

export default function HostelPage() {
  const [hostels, setHostels] = useState<BackendListing[]>([]);

  useEffect(() => {
    getPublishedListings().then((listings) => {
      setHostels((listings || []).filter((listing) => listing.category === 'Hostel'));
    }).catch(() => setHostels([]));
  }, []);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('All Hostels');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loadedAt] = useState(() => Date.now());

  useEffect(() => {
    authFetch('/api/favorites/').then(async (response) => {
      if (response.ok) setFavoriteIds((await response.json()).map((item: { listing: number }) => item.listing));
    }).catch(() => undefined);
  }, []);

  const visibleHostels = useMemo(() => hostels.filter((hostel) => {
    const matchesQuery = !query.trim() || `${hostel.title} ${hostel.location}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesTab = tab === 'All Hostels' || (tab === 'New' && new Date(hostel.created_at).getTime() > loadedAt - 30 * 86400000) || (tab === 'Deals' && Number(hostel.cashback) > 0) || tab === 'Popular';
    return matchesQuery && matchesTab;
  }), [hostels, query, tab, loadedAt]);

  async function toggleFavorite(event: React.MouseEvent, id: number) {
    event.preventDefault();
    event.stopPropagation();
    if (favoriteIds.includes(id)) return;
    if ((await authFetch('/api/favorites/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listing: id }) })).ok) setFavoriteIds((current) => [...current, id]);
  }

  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-4 text-[var(--text-primary)] pb-32">
      <div className="mx-auto max-w-6xl">
        {/* Header with Search */}
        <div className="mb-6 rounded-[1.6rem] border border-[#4e235f]/20 bg-gradient-to-br from-[#4e235f] to-[#6b2d82] p-5 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <Image src="/assets/ay-smart-logo.png" alt="AY'SMART logo" width={28} height={28} className="h-7 w-7 rounded-lg object-contain" />
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#f1b8a5]">Hostels & Stays</p>
          </div>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by location or hostel name..."
            className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none backdrop-blur-sm focus:border-[#f1b8a5]"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2">
          {['All Hostels', 'Popular', 'New', 'Deals'].map((tabOption) => (
            <button
              key={tabOption}
              onClick={() => setTab(tabOption)}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] transition ${
                tab === tabOption
                  ? 'bg-[#4e235f] text-white shadow-lg shadow-[#4e235f]/20'
                  : 'border border-[color:var(--brand-border)] bg-white/70 text-[var(--text-primary)] hover:bg-[#f9efe9]'
              }`}
            >{tabOption}</button>
          ))}
        </div>

        {/* Grid of Hostels */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {visibleHostels.map((hostel) => (
            <Link
              key={hostel.id}
              href={`/hostel/${hostel.id}`}
              className="group overflow-hidden rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 shadow-[0_12px_32px_rgba(46,17,54,0.08)] transition hover:shadow-[0_18px_48px_rgba(46,17,54,0.12)] hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-[#f0e6df]">
                <Image src={listingImage(hostel) || '/assets/ay-smart-logo.png'} alt={hostel.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button onClick={(event) => void toggleFavorite(event, hostel.id)} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#4e235f] transition hover:bg-white ${favoriteIds.includes(hostel.id) ? 'bg-[#f1b8a5]' : ''}`}>
                  <Bookmark size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-[var(--text-primary)]">{hostel.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                      <MapPin size={13} /> {hostel.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#f9efe9] px-2.5 py-1 text-[10px] font-bold text-[#4e235f]">
                    <Star size={12} fill="#4e235f" /> Live
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-lg font-black text-[#4e235f]">₦{Number(hostel.price).toLocaleString()}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">per year</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {hostel.facilities?.slice(0, 2).map((amenity) => (
                    <span key={amenity} className="inline-flex rounded-full bg-[#f9efe9] px-2.5 py-1 text-[9px] font-semibold text-[#4e235f]">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
          {!visibleHostels.length && <p className="col-span-full rounded-2xl border border-dashed border-[var(--brand-border)] p-8 text-center text-sm text-[var(--text-muted)]">No approved hostels match this search.</p>}
        </div>
      </div>
    </main>
  );
}
