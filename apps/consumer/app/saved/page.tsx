'use client';

import Link from 'next/link';
import { MapPin, Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/auth';
import { apiImage, type BackendListing } from '../lib/backend';

type Favorite = { id: number; listing: number; listing_details?: BackendListing };

export default function SavedPage() {
  const [saved, setSaved] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/favorites/')
      .then((response) => response.ok ? response.json() : [])
      .then((favorites) => setSaved(Array.isArray(favorites) ? favorites : []))
      .finally(() => setLoading(false));
  }, []);

  async function removeFavorite(favorite: Favorite) {
    const response = await authFetch(`/api/favorites/${favorite.id}/`, { method: 'DELETE' });
    if (response.ok) setSaved((current) => current.filter((item) => item.id !== favorite.id));
  }

  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-6 text-[var(--text-primary)] pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#4e235f]">My Collection</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Saved Listings</h1>
        </div>

        {loading && <p className="text-sm text-[var(--text-muted)]">Loading saved listings...</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading && saved.map((favorite) => {
            const listing = favorite.listing_details;
            if (!listing) return null;
            const image = apiImage(listing.images?.find((item) => item.url)?.url) || '/assets/ay-smart-logo.png';
            const href = listing.category === 'Hostel' ? `/hostel/${listing.id}` : `/properties/${listing.id}`;
            return (
            <Link
              key={favorite.id}
              href={href}
              className="group overflow-hidden rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 shadow-[0_12px_32px_rgba(46,17,54,0.08)] transition hover:shadow-[0_18px_48px_rgba(46,17,54,0.12)]"
            >
              <div className="relative h-40 overflow-hidden bg-[#f0e6df]">
                <img src={image} alt={listing.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    void removeFavorite(favorite);
                  }}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1b8a5] text-[#4e235f] transition hover:bg-[#f0a891]"
                >
                  <Bookmark size={18} fill="currentColor" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-black text-[var(--text-primary)]">{listing.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                  <MapPin size={13} /> {listing.location}
                </p>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-lg font-black text-[#4e235f]">₦{Number(listing.price).toLocaleString()}</p>
                </div>
              </div>
            </Link>
          );
          })}
        </div>

        {saved.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-2xl font-black text-[var(--text-primary)]">No saved listings yet</p>
            <Link href="/" className="mt-4 inline-block rounded-full bg-[#4e235f] px-6 py-3 font-bold text-white transition hover:bg-[#6b2d82]">
              Explore Listings
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
