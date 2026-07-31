'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Tag } from 'lucide-react';

const sampleListings = [
  {
    id: 1,
    title: "5-Bedroom Luxury Smart Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦450,000,000",
    type: "For Sale",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    isSponsored: true,
    isFeatured: true,
  },
  {
    id: 2,
    title: "Executive Corporate Office Suite",
    location: "Victoria Island, Lagos",
    price: "₦15,000,000 / yr",
    type: "Rent/Lease",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    isSponsored: false,
    isFeatured: true,
  },
  {
    id: 3,
    title: "Fully Serviced Student Hostel Block",
    location: "Akoka, Lagos",
    price: "₦350,000 / semester",
    type: "Rent",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    isSponsored: false,
    isFeatured: false,
  },
];

export default function PropertiesPage() {
  const [filter, setFilter] = useState('All');

  return (
    <main className="min-h-screen bg-[#07070D] text-white pb-28 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07070D]/95 backdrop-blur-xl px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">Property Catalog</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Browse premium listings</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-zinc-300">Live inventory</div>
        </div>
      </header>

      <section className="px-4 mt-4 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-2xl backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search location, duplex, office..."
              className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-10 py-3 text-sm text-white outline-none transition focus:border-brand-purple"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {['All', 'For Sale', 'Rent/Lease', 'Build from Scratch'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-brand-purple text-white shadow-md border border-brand-accent/40'
                    : 'bg-white/5 text-zinc-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 mt-4 space-y-4">
        {sampleListings.map((prop) => (
          <div key={prop.id} className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl backdrop-blur-xl transition-all hover:border-brand-accent/40">
            <div className="relative h-48 w-full">
              <Image src={prop.image} alt={prop.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070D]/70 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                {prop.isSponsored && (
                  <span className="px-2.5 py-1 rounded-md bg-brand-accent text-brand-dark text-[10px] font-black uppercase shadow">
                    Sponsored
                  </span>
                )}
                {prop.isFeatured && (
                  <span className="px-2.5 py-1 rounded-md bg-brand-purple text-white text-[10px] font-bold uppercase shadow border border-brand-accent/40">
                    Featured
                  </span>
                )}
              </div>

              <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-[#09090B]/80 backdrop-blur-md text-white text-xs font-bold">
                {prop.type}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-extrabold text-white">{prop.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                <MapPin size={12} className="text-brand-purple" /> {prop.location}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm font-black text-brand-purple">{prop.price}</span>
                <Link 
                  href={`/properties/${prop.id}`}
                  className="rounded-xl bg-brand-purple px-3.5 py-1.5 text-xs font-bold text-white shadow transition hover:bg-brand-magenta"
                >
                  Book Inspection
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
