"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays, ChevronRight, Heart, MapPin, Search, SlidersHorizontal, Star, UserRound } from "lucide-react";
import { buildApiUrl } from "./lib/api";
import BrandSplashScreen from "./components/BrandSplashScreen";

type Property = {
  id: number;
  title: string;
  price?: string | number;
  location_address?: string;
  main_image_url?: string;
  images?: Array<{ url?: string }>;
  is_for_lease?: boolean;
};

const hostelListings = [
  { id: 1, title: "Cozy London Loft", location: "London, UK", price: "£1,800/mo", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80", rating: "4.8" },
  { id: 2, title: "Global Backpacker Hub", location: "Berlin, Germany", price: "€35/night", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80", rating: "4.6" },
  { id: 3, title: "Lisbon Coastal Stay", location: "Lisbon, Portugal", price: "€42/night", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80", rating: "4.9" },
];

const destinations = [
  { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=240&q=80" },
  { name: "Berlin", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=240&q=80" },
  { name: "Lisbon", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=240&q=80" },
  { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=240&q=80" },
];

export default function RealEstateHome() {
  const [activeCategory, setActiveCategory] = useState<"real-estate" | "hostels">("real-estate");
  const [properties, setProperties] = useState<Property[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Only run splash logic on the client; avoid duplicate render during
    // SSR and ensure single splash instance per user via localStorage.
    const run = async () => {
      const hasSeenSplash = window.localStorage.getItem("aysmart-splash-seen");
      if (hasSeenSplash === "true") {
        setShowSplash(false);
        return;
      }

      // Give the splash a graceful duration and a short transition.
      const splashTimer = window.setTimeout(() => {
        setIsTransitioning(true);
        window.setTimeout(() => {
          window.localStorage.setItem("aysmart-splash-seen", "true");
          setShowSplash(false);
        }, 300);
      }, 2200);

      return () => window.clearTimeout(splashTimer);
    };

    if (typeof window !== 'undefined') run();
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch(buildApiUrl('/api/properties/'))
      .then((response) => response.ok ? response.json() : [])
      .then((payload) => {
        if (mounted && Array.isArray(payload)) setProperties(payload);
      })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  if (showSplash) {
    return (
      <div className={`transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <BrandSplashScreen />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf8f6] pb-28 text-[#241c2d]">
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4e235f] text-sm font-black text-white">A</span>
            <span className="text-sm font-black tracking-[-0.03em] text-[#4e235f]">AY-Smart</span>
          </Link>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Notifications" className="rounded-full p-2 text-[#4e235f] hover:bg-[#f4e7e2]"><Bell size={18} /></button>
            <Link href="/dashboard" aria-label="Profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1b8a5] text-[#4e235f]"><UserRound size={16} /></Link>
          </div>
        </header>

        <section className="pt-5">
          <p className="text-sm font-medium text-[#7e7080]">Good morning, discover</p>
          <h1 className="mt-1 max-w-md text-3xl font-black leading-tight tracking-[-0.06em] text-[#241c2d] sm:text-4xl">A place you&apos;ll love to come home to.</h1>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#eaded9] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(78,35,95,0.06)]">
            <Search size={18} className="shrink-0 text-[#7e7080]" />
            <input aria-label="Search properties" placeholder="Find properties or hostels worldwide..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a398a0]" />
            <button type="button" aria-label="Filter listings" className="rounded-xl bg-[#f9efe9] p-2 text-[#4e235f]"><SlidersHorizontal size={16} /></button>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#f1e7e3] p-1">
          <button type="button" onClick={() => setActiveCategory("real-estate")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeCategory === "real-estate" ? "bg-[#4e235f] text-white shadow-md" : "text-[#6d5c6b]"}`}>Real Estate</button>
          <button type="button" onClick={() => setActiveCategory("hostels")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeCategory === "hostels" ? "bg-[#f1a990] text-[#4e235f] shadow-md" : "text-[#6d5c6b]"}`}>Hostels</button>
        </div>

        <section className="mt-6">
          <div className="flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em]">Featured listings</h2><Link href={activeCategory === "hostels" ? "/hostel" : "/properties"} className="flex items-center gap-1 text-xs font-bold text-[#4e235f]">See all <ChevronRight size={14} /></Link></div>
          <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activeCategory === "hostels" ? hostelListings.map((listing) => (
              <Link key={listing.id} href={`/hostel/${listing.id}`} className="min-w-[235px] snap-start overflow-hidden rounded-2xl border border-[#eaded9] bg-white shadow-[0_10px_26px_rgba(78,35,95,0.08)]">
                <div className="relative h-32"><img src={listing.image} alt={listing.title} className="h-full w-full object-cover" /><span className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-[#4e235f]"><Heart size={14} /></span></div>
                <div className="p-3"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-black">{listing.title}</h3><span className="flex items-center gap-1 text-[11px] font-bold"><Star size={12} fill="#f1a990" className="text-[#e28c72]" />{listing.rating}</span></div><p className="mt-1 text-[11px] text-[#817681]">{listing.location}</p><p className="mt-2 text-sm font-black text-[#4e235f]">{listing.price}</p></div>
              </Link>
            )) : (properties.length ? properties.slice(0, 4) : [
              { id: 1, title: "Luxury Smart Duplex", location_address: "Lekki Phase 1, Lagos", price: "850000000", main_image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80" },
              { id: 2, title: "Executive Mini Duplex", location_address: "Ikeja GRA, Lagos", price: "350000000", main_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
            ]).map((property) => {
              const image = property.main_image_url || property.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
              return <Link key={property.id} href={`/properties/${property.id}`} className="min-w-[235px] snap-start overflow-hidden rounded-2xl border border-[#eaded9] bg-white shadow-[0_10px_26px_rgba(78,35,95,0.08)]"><div className="relative h-32"><img src={image} alt={property.title} className="h-full w-full object-cover" /><span className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-[#4e235f]"><Heart size={14} /></span></div><div className="p-3"><h3 className="truncate text-sm font-black">{property.title}</h3><p className="mt-1 flex items-center gap-1 text-[11px] text-[#817681]"><MapPin size={12} />{property.location_address || "Location pending"}</p><p className="mt-2 text-sm font-black text-[#4e235f]">₦{Number(property.price || 0).toLocaleString()}</p></div></Link>;
            })}
          </div>
          <div className="flex justify-center gap-1.5"><span className="h-1.5 w-5 rounded-full bg-[#4e235f]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d7c6cf]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d7c6cf]" /></div>
        </section>

        <section className="mt-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em]">Featured destinations</h2><button type="button" className="text-xs font-bold text-[#4e235f]">View map</button></div><div className="mt-3 grid grid-cols-4 gap-2">{destinations.map((destination) => <Link href="/properties" key={destination.name} className="text-center"><img src={destination.image} alt={destination.name} className="aspect-square w-full rounded-xl object-cover" /><span className="mt-1 block text-[11px] font-semibold text-[#5f5260]">{destination.name}</span></Link>)}</div></section>

        <section className="mt-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em]">Popular rentals</h2><Link href="/properties" className="text-xs font-bold text-[#4e235f]">See all</Link></div><div className="mt-3 space-y-2">{hostelListings.slice(0, 2).map((listing) => <Link href={`/hostel/${listing.id}`} key={listing.id} className="flex items-center gap-3 rounded-2xl border border-[#eaded9] bg-white p-2 shadow-[0_6px_18px_rgba(78,35,95,0.05)]"><img src={listing.image} alt={listing.title} className="h-16 w-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{listing.title}</p><p className="mt-1 text-[11px] text-[#817681]">{listing.location} · <Star size={10} fill="#f1a990" className="inline text-[#e28c72]" /> {listing.rating}</p></div><p className="text-xs font-black text-[#4e235f]">{listing.price}</p></Link>)}</div></section>

        <Link href="/properties" className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#4e235f] py-3 text-sm font-bold text-white shadow-lg shadow-[#4e235f]/20"><CalendarDays size={16} /> Book a viewing</Link>
      </div>
    </main>
  );
}