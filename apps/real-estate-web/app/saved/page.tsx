'use client';

import Link from 'next/link';
import { MapPin, Star, Bookmark } from 'lucide-react';
import { useState } from 'react';

const savedListings = [
  {
    id: 1,
    name: 'Cozy London Loft',
    location: 'Grosvenor Square, London',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
  },
];

export default function SavedPage() {
  const [saved, setSaved] = useState(savedListings);

  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-6 text-[var(--text-primary)] pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#4e235f]">My Collection</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Saved Listings</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((listing) => (
            <Link
              key={listing.id}
              href={`/hostel/${listing.id}`}
              className="group overflow-hidden rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 shadow-[0_12px_32px_rgba(46,17,54,0.08)] transition hover:shadow-[0_18px_48px_rgba(46,17,54,0.12)]"
            >
              <div className="relative h-40 overflow-hidden bg-[#f0e6df]">
                <img src={listing.image} alt={listing.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSaved(saved.filter((s) => s.id !== listing.id));
                  }}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1b8a5] text-[#4e235f] transition hover:bg-[#f0a891]"
                >
                  <Bookmark size={18} fill="currentColor" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-black text-[var(--text-primary)]">{listing.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                  <MapPin size={13} /> {listing.location}
                </p>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-lg font-black text-[#4e235f]">₦{(listing.price / 1000000).toFixed(1)}M</p>
                  <div className="flex items-center gap-1 rounded-full bg-[#f9efe9] px-2.5 py-1 text-[10px] font-bold text-[#4e235f]">
                    <Star size={12} fill="#4e235f" /> {listing.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
