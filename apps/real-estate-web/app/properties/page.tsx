'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, BookmarkPlus, Heart, EyeOff } from 'lucide-react';
import { authFetch } from '../lib/auth';
import { getPublishedListings, listingImage, type BackendListing } from '../lib/backend';

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

function listingToProperty(listing: BackendListing): PropertyCard {
  return {
    id: listing.id,
    title: listing.title,
    location: listing.location,
    price: listing.price,
    property_type: listing.category,
    property_type_display: listing.category,
    main_image_url: listingImage(listing),
    images: listing.images,
  };
}

export default function PropertiesPage() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [savingSearch, setSavingSearch] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadProperties() {
      try {
        const payload = await getPublishedListings();
        if (mounted) setProperties(Array.isArray(payload) ? payload.map(listingToProperty) : []);
      } catch {
        setProperties([]);
      }
    }
    loadProperties();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    Promise.all([authFetch('/api/favorites/'), authFetch('/api/hidden-listings/')]).then(async ([favorites, hidden]) => {
      if (favorites.ok) setFavoriteIds((await favorites.json()).map((item: { listing: number }) => item.listing));
      if (hidden.ok) setHiddenIds((await hidden.json()).map((item: { listing: number }) => item.listing));
    }).catch(() => undefined);
  }, []);

  async function toggleFavorite(event: React.MouseEvent, id: number) {
    event.preventDefault();
    event.stopPropagation();
    if (favoriteIds.includes(id)) {
      const response = await authFetch('/api/favorites/');
      if (response.ok) {
        const item = (await response.json()).find((favorite: { id: number; listing: number }) => favorite.listing === id);
        if (item && (await authFetch(`/api/favorites/${item.id}/`, { method: 'DELETE' })).ok) setFavoriteIds((current) => current.filter((value) => value !== id));
      }
      return;
    }
    if ((await authFetch('/api/favorites/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listing: id }) })).ok) setFavoriteIds((current) => [...current, id]);
  }

  async function toggleHidden(event: React.MouseEvent, id: number) {
    event.preventDefault();
    event.stopPropagation();
    if ((await authFetch('/api/hidden-listings/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listing: id }) })).ok) {
      setHiddenIds((current) => [...current, id]);
      setProperties((current) => current.filter((property) => property.id !== id));
    }
  }

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
        {visibleProperties.map((prop) => {
          const imageUrl = prop.main_image_url || prop.images?.[0]?.url || prop.images?.[0]?.image || '/assets/ay-smart-logo.png';
          const label = prop.property_type_display || prop.property_type || 'For Sale';
          return (
            <Link
              href={`/properties/${prop.id}`}
              key={prop.id}
              className="group mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl backdrop-blur-xl transition-all hover:border-brand-accent/40"
            >
              <div className="relative h-48 w-full">
                <Image src={imageUrl} alt={prop.title} fill className="object-cover transition duration-300 group-hover:scale-[1.02]" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070D]/70 via-transparent to-transparent" />
                <div className="absolute right-3 top-3 flex gap-2">
                  <button type="button" title="Save property" onClick={(event) => void toggleFavorite(event, prop.id)} className={`rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-brand-purple/80 ${favoriteIds.includes(prop.id) ? 'bg-brand-purple/80' : ''}`}>
                    <Heart size={14} />
                  </button>
                  <button type="button" title="Hide property" onClick={(event) => void toggleHidden(event, prop.id)} className={`rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-red-500/80 ${hiddenIds.includes(prop.id) ? 'bg-red-500/80' : ''}`}>
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
                  <span
                    className="rounded-xl bg-brand-purple px-3.5 py-1.5 text-xs font-bold text-white shadow transition group-hover:bg-brand-magenta"
                  >
                    Book Inspection
                  </span>
                </div>
              </div>
            </Link>
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
