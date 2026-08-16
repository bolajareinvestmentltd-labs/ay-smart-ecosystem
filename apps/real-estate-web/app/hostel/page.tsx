'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Star, Bookmark } from 'lucide-react';

const hostels = [
  {
    id: 1,
    name: 'Cozy London Loft',
    location: 'Grosvenor Square, London',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    capacity: '40 occupants',
    amenities: ['WiFi', 'Gym', 'Library'],
  },
  {
    id: 2,
    name: 'Global Backpacker Hub',
    location: 'Berlin, Germany',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    capacity: '60 occupants',
    amenities: ['WiFi', 'Kitchen', 'Lounge'],
  },
  {
    id: 3,
    name: 'Lisbon Coastal Stay',
    location: 'Cascais, Lisbon',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    capacity: '35 occupants',
    amenities: ['Beach access', 'WiFi', 'Kitchen'],
  },
  {
    id: 4,
    name: 'Tokyo Urban Living',
    location: 'Shibuya, Tokyo',
    price: 2900000,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    capacity: '50 occupants',
    amenities: ['WiFi', 'Studio', 'Rooftop'],
  },
];

export default function HostelPage() {
  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-4 text-[var(--text-primary)] pb-32">
      <div className="mx-auto max-w-6xl">
        {/* Header with Search */}
        <div className="mb-6 rounded-[1.6rem] border border-[#4e235f]/20 bg-gradient-to-br from-[#4e235f] to-[#6b2d82] p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏠</span>
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#f1b8a5]">Hostels & Stays</p>
          </div>
          <input
            type="text"
            placeholder="Search by location or hostel name..."
            className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none backdrop-blur-sm focus:border-[#f1b8a5]"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2">
          {['All Hostels', 'Popular', 'New', 'Deals'].map((tab) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] transition ${
                tab === 'All Hostels'
                  ? 'bg-[#4e235f] text-white shadow-lg shadow-[#4e235f]/20'
                  : 'border border-[color:var(--brand-border)] bg-white/70 text-[var(--text-primary)] hover:bg-[#f9efe9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid of Hostels */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {hostels.map((hostel) => (
            <Link
              key={hostel.id}
              href={`/hostel/${hostel.id}`}
              className="group overflow-hidden rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 shadow-[0_12px_32px_rgba(46,17,54,0.08)] transition hover:shadow-[0_18px_48px_rgba(46,17,54,0.12)] hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-[#f0e6df]">
                <img src={hostel.image} alt={hostel.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#4e235f] transition hover:bg-white">
                  <Bookmark size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-[var(--text-primary)]">{hostel.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                      <MapPin size={13} /> {hostel.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#f9efe9] px-2.5 py-1 text-[10px] font-bold text-[#4e235f]">
                    <Star size={12} fill="#4e235f" /> {hostel.rating}
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-lg font-black text-[#4e235f]">₦{(hostel.price / 1000000).toFixed(1)}M</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{hostel.capacity}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {hostel.amenities?.slice(0, 2).map((amenity) => (
                    <span key={amenity} className="inline-flex rounded-full bg-[#f9efe9] px-2.5 py-1 text-[9px] font-semibold text-[#4e235f]">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
