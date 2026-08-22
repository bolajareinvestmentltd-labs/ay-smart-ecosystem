"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Bell, CalendarDays, ChevronRight, Heart, MapPin, Search, SlidersHorizontal, Star, UserRound } from "lucide-react";
import { getPublishedListings, listingImage, type BackendListing } from "./lib/backend";
import ThemeToggle from "./components/ThemeToggle";
import { getStoredProfile } from "./lib/app-state";

const getStableStoredProfile = (() => {
  let snapshot: ReturnType<typeof getStoredProfile> | undefined;
  return () => {
    snapshot ??= getStoredProfile();
    return snapshot;
  };
})();

export default function RealEstateHome() {
  const [activeCategory, setActiveCategory] = useState<"real-estate" | "hostels">("real-estate");
  const [listings, setListings] = useState<BackendListing[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const storedProfile = useSyncExternalStore(() => () => {}, getStableStoredProfile, getStableStoredProfile);
  const firstName = (storedProfile.name || storedProfile.username || '').trim().split(/\s+/)[0] || 'there';
  const localHour = new Date().getHours();
  const greeting = localHour < 12 ? 'Good morning' : localHour < 17 ? 'Good afternoon' : 'Good evening';

  const carouselCategories = [
    { label: "Hostels", href: "/hostel", match: (listing: BackendListing) => listing.category === "Hostel" },
    { label: "Rented apartments", href: "/properties", match: (listing: BackendListing) => /rent|apartment/i.test(`${listing.category} ${listing.title} ${listing.description || ""}`) },
    { label: "Landed properties", href: "/properties", match: (listing: BackendListing) => /land/i.test(`${listing.category} ${listing.title} ${listing.description || ""}`) },
    { label: "Build from scratch", href: "/about", match: (listing: BackendListing) => /build|construction/i.test(`${listing.category} ${listing.title} ${listing.description || ""}`) },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setCarouselIndex((current) => (current + 1) % carouselCategories.length), 5000);
    return () => window.clearInterval(timer);
  }, [carouselCategories.length]);

  useEffect(() => {
    let mounted = true;
    getPublishedListings().then((payload) => {
      if (mounted && Array.isArray(payload)) setListings(payload);
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] pb-28 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <header className="-mx-4 flex items-center justify-between bg-[var(--brand-purple-deep)] px-4 py-4 text-white sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-white/95 p-1">
              <img src="/assets/ay-smart-logo.png" alt="AY'SMART logo" className="h-full w-full object-contain" />
            </span>
            <span className="text-sm font-black tracking-[-0.03em] text-white">AY-Smart</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button type="button" aria-label="Notifications" className="rounded-full p-2 text-white hover:bg-white/10"><Bell size={18} /></button>
            <Link href="/dashboard" aria-label="Profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-purple-deep)]"><UserRound size={16} /></Link>
          </div>
        </header>

        <section className="pt-5">
          <p className="text-sm font-medium text-[var(--text-muted)]">{greeting}, {firstName}</p>
          <h1 className="mt-1 max-w-md text-3xl font-black leading-tight tracking-[-0.06em] text-[var(--text-primary)] sm:text-4xl">A place you&apos;ll love to come home to.</h1>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-3 shadow-[0_8px_24px_rgba(78,35,95,0.06)]">
            <Search size={18} className="shrink-0 text-[var(--text-muted)]" />
            <input aria-label="Search properties" placeholder="Find properties or hostels worldwide..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]" />
            <button type="button" aria-label="Filter listings" className="rounded-xl bg-[var(--brand-surface-3)] p-2 text-[var(--brand-purple)]"><SlidersHorizontal size={16} /></button>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-[1.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface-2)] shadow-[0_16px_40px_rgba(78,35,95,0.1)]">
          {carouselCategories.map((category, index) => {
            const listing = listings.find(category.match);
            const image = listing ? listingImage(listing) || "/assets/ay-smart-logo.png" : "/assets/ay-smart-logo.png";
            return (
              <Link key={category.label} href={category.href} className={`relative block h-40 transition-opacity duration-500 sm:h-44 ${index === carouselIndex ? "opacity-100" : "hidden opacity-0"}`}>
                <img src={image} alt={listing?.title || category.label} loading={index === carouselIndex ? 'eager' : 'lazy'} decoding="async" fetchPriority={index === carouselIndex ? 'high' : 'low'} className="h-full w-full object-cover opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand-accent)]">Explore AY&apos;SMART</p><h2 className="mt-1 text-xl font-black">{category.label}</h2><p className="mt-1 text-xs text-white/75">{listing?.title || "Approved listings will appear here"}</p></div>
              </Link>
            );
          })}
          <div className="flex justify-center gap-1.5 p-3">{carouselCategories.map((category, index) => <button key={category.label} type="button" aria-label={`Show ${category.label}`} onClick={() => setCarouselIndex(index)} className={`h-1.5 rounded-full transition-all ${index === carouselIndex ? "w-6 bg-[var(--brand-purple)]" : "w-1.5 bg-[var(--brand-border)]"}`} />)}</div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[var(--brand-surface-3)] p-1">
          <button type="button" onClick={() => setActiveCategory("real-estate")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeCategory === "real-estate" ? "bg-[var(--brand-purple)] text-white shadow-md" : "text-[var(--text-muted)]"}`}>Real Estate</button>
          <button type="button" onClick={() => setActiveCategory("hostels")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeCategory === "hostels" ? "bg-[var(--brand-accent)] text-[var(--brand-purple-deep)] shadow-md" : "text-[var(--text-muted)]"}`}>Hostels</button>
        </div>

        <section className="mt-6">
          <div className="flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em]">Featured listings</h2><Link href={activeCategory === "hostels" ? "/hostel" : "/properties"} className="flex items-center gap-1 text-xs font-bold text-[#4e235f]">See all <ChevronRight size={14} /></Link></div>
          <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {listings.filter((listing) => activeCategory === "hostels" ? listing.category === "Hostel" : listing.category !== "Hostel").slice(0, 4).map((listing) => {
              const image = listingImage(listing) || "/assets/ay-smart-logo.png";
              const href = listing.category === "Hostel" ? `/hostel/${listing.id}` : `/properties/${listing.id}`;
              return <Link key={listing.id} href={href} className="min-w-[235px] snap-start overflow-hidden rounded-2xl border border-[#eaded9] bg-white shadow-[0_10px_26px_rgba(78,35,95,0.08)]"><div className="relative h-32"><img src={image} alt={listing.title} loading="lazy" decoding="async" className="h-full w-full object-cover" /><span className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-[#4e235f]"><Heart size={14} /></span></div><div className="p-3"><div className="flex items-start justify-between gap-2"><h3 className="truncate text-sm font-black">{listing.title}</h3><span className="flex items-center gap-1 text-[11px] font-bold"><Star size={12} fill="#f1a990" className="text-[#e28c72]" />Live</span></div><p className="mt-1 flex items-center gap-1 text-[11px] text-[#817681]"><MapPin size={12} />{listing.location}</p><p className="mt-2 text-sm font-black text-[#4e235f]">₦{Number(listing.price || 0).toLocaleString()}</p></div></Link>;
            })}
          </div>
          {!listings.some((listing) => activeCategory === "hostels" ? listing.category === "Hostel" : listing.category !== "Hostel") && <p className="rounded-2xl border border-dashed border-[#d7c6cf] p-6 text-center text-sm text-[#817681]">No approved {activeCategory === "hostels" ? "hostel" : "real estate"} listings are live yet.</p>}
          <div className="flex justify-center gap-1.5"><span className="h-1.5 w-5 rounded-full bg-[#4e235f]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d7c6cf]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d7c6cf]" /></div>
        </section>

        <section className="mt-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em]">Live locations</h2><Link href="/properties" className="text-xs font-bold text-[#4e235f]">View all</Link></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{Array.from(new Set(listings.map((listing) => listing.location))).slice(0, 4).map((location) => <Link href={`/properties?search=${encodeURIComponent(location)}`} key={location} className="rounded-xl border border-[#eaded9] bg-white p-4 text-center text-xs font-semibold text-[#5f5260]">{location}</Link>)}</div></section>

        <section className="mt-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em]">Popular rentals</h2><Link href="/hostel" className="text-xs font-bold text-[#4e235f]">See all</Link></div><div className="mt-3 space-y-2">{listings.filter((listing) => listing.category === "Hostel").slice(0, 2).map((listing) => <Link href={`/hostel/${listing.id}`} key={listing.id} className="flex items-center gap-3 rounded-2xl border border-[#eaded9] bg-white p-2 shadow-[0_6px_18px_rgba(78,35,95,0.05)]"><img src={listingImage(listing) || "/assets/ay-smart-logo.png"} alt={listing.title} className="h-16 w-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{listing.title}</p><p className="mt-1 text-[11px] text-[#817681]">{listing.location} · <Star size={10} fill="#f1a990" className="inline text-[#e28c72]" /> Live</p></div><p className="text-xs font-black text-[#4e235f]">₦{Number(listing.price || 0).toLocaleString()}</p></Link>)}</div></section>

        <Link href="/properties" className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#4e235f] py-3 text-sm font-bold text-white shadow-lg shadow-[#4e235f]/20"><CalendarDays size={16} /> Book a viewing</Link>
      </div>
    </main>
  );
}