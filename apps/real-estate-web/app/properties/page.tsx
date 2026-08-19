'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, BookmarkPlus, Heart, EyeOff } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import { authFetch } from '../lib/auth';
import { buildApiUrl } from '../lib/api';

type PropertyCard = {
  id: number;
  title: string;
  location_address?: string;
  location?: string;
  price?: string | number;
  property_type?: string;
  property_type_display?: string;
  is_for_lease?: boolean;
  virtual_tour_url?: string;
  main_image_url?: string;
  images?: Array<{ url?: string; image?: string }>;
};

const sampleListings: PropertyCard[] = [
  {
    id: 1,
    title: '5-Bedroom Luxury Smart Duplex',
    location: 'Lekki Phase 1, Lagos',
    price: '₦450,000,000',
    property_type: 'RESIDENTIAL',
    property_type_display: 'For Sale',
    main_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Executive Corporate Office Suite',
    location: 'Victoria Island, Lagos',
    price: '₦15,000,000 / yr',
    property_type: 'COMMERCIAL',
    property_type_display: 'Rent/Lease',
    main_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Fully Serviced Student Hostel Block',
    location: 'Akoka, Lagos',
    price: '₦350,000 / semester',
    property_type: 'RESIDENTIAL',
    property_type_display: 'Rent',
    main_image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PropertiesPage() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<PropertyCard[]>(sampleListings);
  const [savingSearch, setSavingSearch] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadProperties() {
      try {
        const res = await fetch(buildApiUrl('/api/properties/'));
        if (!res.ok) return;
        const payload = await res.json();
        if (mounted && Array.isArray(payload) && payload.length) {
          setProperties(payload.map((item: any) => ({
            ...item,
            location: item.location_address || item.location,
            property_type_display: item.property_type_display || item.property_type,
            main_image_url: item.main_image_url || item.images?.[0]?.url || item.images?.[0]?.image,
          })));
        }
      } catch {
        // Keep the premium sample data as a graceful fallback.
      }
    }
    loadProperties();
    return () => { mounted = false; };
  }, []);

  const visibleProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return properties.filter((prop) => {
      const typeLabel = (prop.property_type_display || prop.property_type || 'For Sale').toLowerCase();
      const matchesFilter =
        filter === 'All' ||
        (filter === 'For Sale' && typeLabel.includes('sale')) ||
        (filter === 'Rent/Lease' && (typeLabel.includes('rent') || typeLabel.includes('lease')) ) ||
        (filter === 'Build from Scratch' && typeLabel.includes('build'));
      const matchesQuery = !query || `${prop.title} ${prop.location || prop.location_address || ''}`.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [filter, properties, searchQuery]);

  async function handleSaveSearch(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: saveName || `${searchQuery || 'Property'} search`,
      location: searchQuery || '',
      property_type: filter === 'All' ? '' : filter,
      min_price: '0',
      max_price: '9999999999',
    };
    setSavingSearch(true);
    setSaveMessage('');

    const res = await authFetch('/api/saved-searches/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      setSaveMessage(error?.detail || 'Unable to save this search right now.');
      setSavingSearch(false);
      return;
    }

    setSaveName('');
    setSaveMessage('Search saved. View it in the saved workspace.');
    setSavingSearch(false);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--text-primary)] pb-28 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-[var(--brand-surface-2)]/95 backdrop-blur-xl px-4 py-4">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          <form onSubmit={handleSaveSearch} className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#09090B]/80 p-3 sm:flex-row sm:items-center">
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Save this search as..."
              className="w-full rounded-xl border border-white/10 bg-[#111114] px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand-purple"
            />
            <button
              type="submit"
              disabled={savingSearch}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-purple px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-magenta disabled:opacity-70"
            >
              <BookmarkPlus size={14} />
              {savingSearch ? 'Saving...' : 'Save search'}
            </button>
          </form>
          {saveMessage && <p className="mt-2 text-xs text-zinc-300">{saveMessage}</p>}
        </div>
      </section>

      <section className="px-4 mt-4 space-y-4">
        <AdSlot title="Google AdSense placeholder - leaderboard slot" size="728x90" />
        {visibleProperties.map((prop) => {
          const imageUrl = prop.main_image_url || prop.images?.[0]?.url || prop.images?.[0]?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
          const label = prop.property_type_display || prop.property_type || 'For Sale';
          return (
            <div
              key={prop.id}
              className="group mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl backdrop-blur-xl transition-all hover:border-brand-accent/40"
            >
              <div className="relative h-48 w-full">
                <Image src={imageUrl} alt={prop.title} fill className="object-cover transition duration-300 group-hover:scale-[1.02]" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070D]/70 via-transparent to-transparent" />
                <div className="absolute right-3 top-3 flex gap-2">
                  <button type="button" title="Save property" className="rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-brand-purple/80">
                    <Heart size={14} />
                  </button>
                  <button type="button" title="Hide property" className="rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-red-500/80">
                    <EyeOff size={14} />
                  </button>
                </div>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-[#09090B]/80 backdrop-blur-md text-white text-xs font-bold">
                  {label}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-xs font-extrabold text-white">{prop.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                  <MapPin size={12} className="text-brand-purple" /> {prop.location || prop.location_address || 'Location pending'}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-sm font-black text-brand-purple">{typeof prop.price === 'number' ? `₦${Number(prop.price).toLocaleString()}` : prop.price}</span>
                  <Link
                    href={`/properties/${prop.id}`}
                    className="rounded-xl bg-brand-purple px-3.5 py-1.5 text-xs font-bold text-white shadow transition group-hover:bg-brand-magenta"
                  >
                    Book Inspection
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        {!visibleProperties.length && (
          <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-zinc-400">
            No homes match this filter yet. Try another neighborhood or a broader search.
          </div>
        )}
      </section>
    </main>
  );
}
