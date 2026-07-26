'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Tag } from 'lucide-react';
import DockNavbar from '../components/DockNavbar';

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
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-zinc-900 dark:text-zinc-100 pb-28 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md border-b border-brand-purple/20 px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-black text-brand-purple dark:text-brand-magenta tracking-wider uppercase">Property Catalog</h1>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-medium">Live Inventory</span>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <section className="px-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search location, duplex, office..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-brand-purple/20 text-xs focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {['All', 'For Sale', 'Rent/Lease', 'Build from Scratch'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-brand-purple text-white shadow-md border border-brand-accent/40' 
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Property Cards Grid */}
      <section className="px-4 mt-4 space-y-4">
        {sampleListings.map((prop) => (
          <div key={prop.id} className="rounded-2xl bg-white dark:bg-zinc-900 border border-brand-purple/15 overflow-hidden shadow-sm hover:border-brand-accent transition-all">
            <div className="relative h-48 w-full">
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
              
              {/* Admin-Managed Toggles / Badges */}
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

              <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-brand-dark/80 backdrop-blur-md text-white text-xs font-bold">
                {prop.type}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">{prop.title}</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-brand-purple dark:text-brand-magenta" /> {prop.location}
              </p>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-sm font-black text-brand-purple dark:text-brand-magenta">{prop.price}</span>
                <Link 
                  href={`/properties/${prop.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold shadow hover:bg-brand-magenta transition-all"
                >
                  Book Inspection
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Floating DockMobile Bottom Navigation */}
      <DockNavbar />
    </main>
  );
}
