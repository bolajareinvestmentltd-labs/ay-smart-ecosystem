'use client';

import React, { useState, useEffect } from 'react';
import { getStoredProfile } from './lib/app-state';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Heart,
  Eye,
  Share2,
  Star,
  Building,
  Hotel,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import CylindricalActionPill from './components/CylindricalActionPill';

interface ListingItem {
  id: string;
  title: string;
  category: 'real-estate' | 'shortlet' | 'hostel' | 'syndication';
  categoryLabel: string;
  location: string;
  price: string;
  rawPrice: number;
  badge: string;
  image: string;
  beds: number;
  baths: number;
  sqft: string;
  rating: number;
  views: string;
  likes: string;
  agent: {
    name: string;
    verified: boolean;
    role: string;
  };
}

const FEATURED_LISTINGS: ListingItem[] = [
  {
    id: 'prop-1',
    title: 'Luxury 4-Bedroom Semi-Detached Villa',
    category: 'real-estate',
    categoryLabel: 'Real Estate',
    location: 'Lekki Phase 1, Lagos',
    price: '₦185,000,000',
    rawPrice: 185000000,
    badge: 'C of O Verified',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    beds: 4,
    baths: 5,
    sqft: '3,200 SqFt',
    rating: 4.9,
    views: '12.4k',
    likes: '1.8k',
    agent: {
      name: 'Adeyemi & Co Brokers',
      verified: true,
      role: 'Certified Agent',
    },
  },
  {
    id: 'prop-2',
    title: 'Waterfront Penthouse with Private Jacuzzi',
    category: 'shortlet',
    categoryLabel: 'Short-Let Suite',
    location: 'Victoria Island, Lagos',
    price: '₦85,000 / night',
    rawPrice: 85000,
    badge: 'Superhost Verified',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    beds: 3,
    baths: 3,
    sqft: '2,100 SqFt',
    rating: 4.95,
    views: '8.2k',
    likes: '940',
    agent: {
      name: 'Smart Stays Hospitality',
      verified: true,
      role: 'Host Manager',
    },
  },
  {
    id: 'prop-3',
    title: 'Malete Premium Student Ensuite Hall',
    category: 'hostel',
    categoryLabel: 'Campus Hostel',
    location: 'KWASU Campus Vicinity, Malete',
    price: '₦280,000 / session',
    rawPrice: 280000,
    badge: 'Campus Security Covenanted',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    beds: 1,
    baths: 1,
    sqft: 'Ensuite Room',
    rating: 4.8,
    views: '15.6k',
    likes: '2.1k',
    agent: {
      name: 'Harmony Residence Facility',
      verified: true,
      role: 'Hostel Manager',
    },
  },
  {
    id: 'prop-4',
    title: 'Commercial Plaza Co-Investment Syndication',
    category: 'syndication',
    categoryLabel: 'Syndication',
    location: 'Ikeja GRA, Lagos',
    price: '₦2,500,000 / unit',
    rawPrice: 2500000,
    badge: '22.5% Target IRR',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    beds: 0,
    baths: 0,
    sqft: 'Institutional Asset',
    rating: 5.0,
    views: '24.1k',
    likes: '3.4k',
    agent: {
      name: 'AY’SMART Asset Custodian',
      verified: true,
      role: 'Syndicate Trustee',
    },
  },
];

export default function SmartAssetzHomePage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<ListingItem>(FEATURED_LISTINGS[0]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentCity, setCurrentCity] = useState('Lagos, NG');
  const [profile, setProfile] = useState({ name: '', username: '', isLoggedIn: false });
  const partnerSuiteUrl = process.env.NEXT_PUBLIC_PARTNER_URL || '/partner';

  useEffect(() => {
    const storedProfile = getStoredProfile();
    setProfile({
      name: storedProfile.name || '',
      username: storedProfile.username || '',
      isLoggedIn: Boolean(storedProfile.isLoggedIn || storedProfile.name || storedProfile.email),
    });
  }, []);

  useEffect(() => {
    if (FEATURED_LISTINGS.length <= 1) return;
    const interval = window.setInterval(() => {
      setSelectedProperty((current) => {
        const currentIndex = FEATURED_LISTINGS.findIndex((item) => item.id === current.id);
        const nextIndex = (currentIndex + 1) % FEATURED_LISTINGS.length;
        return FEATURED_LISTINGS[nextIndex];
      });
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  const filteredListings = FEATURED_LISTINGS.filter((item) => {
    if (activeFilter !== 'all' && item.category !== activeFilter) return false;
    if (searchQuery.trim() === '') return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const displayName = profile.name || profile.username || 'Guest explorer';
  const welcomeLabel = profile.isLoggedIn ? `Welcome back, ${displayName}` : 'Create your account to save homes';

  return (
    <>
      <SplashScreen />

      <main className="min-h-screen bg-[#0b0614] text-[#f4eff8] pb-28 font-sans selection:bg-purple-900 selection:text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.28),transparent_48%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(17,6,26,0.35)]">
            <div className="flex items-center gap-3">
              <Link href="/auth/profile" className="group relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#621063] via-[#a855f7] to-[#e79e23] p-[1px] shadow-lg shadow-purple-950/40 transition-transform duration-300 group-hover:scale-105">
                  <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#140824] text-xs font-black text-white">
                    SA
                  </div>
                </div>
              </Link>

              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d3a9ff]">SmartAssetz</p>
                <p className="text-[11px] text-white/60">Global property access</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-[11px] font-semibold text-white/70 md:flex">
              <Link href="/" className="transition hover:text-white">Explore</Link>
              <Link href="/properties" className="transition hover:text-white">Browse</Link>
              <Link href="/tenant-dashboard" className="transition hover:text-white">Student Living</Link>
              <Link href="/hostels" className="transition hover:text-white">Hostels</Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-[#120d1a]/60 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition hover:bg-white/10"
              >
                <MapPin className="h-3.5 w-3.5 text-[#e79e23]" />
                <span>{currentCity}</span>
                <ChevronDown className="h-3 w-3 text-white/40" />
              </button>

              <a
                href={partnerSuiteUrl}
                target={partnerSuiteUrl.startsWith('http') ? '_blank' : undefined}
                rel={partnerSuiteUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hidden items-center gap-1.5 rounded-full border border-[#e79e23]/30 bg-[#e79e23]/10 px-3 py-1.5 text-[11px] font-bold text-[#f9d099] transition hover:bg-[#e79e23]/20 sm:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Partner Suite
              </a>
            </div>
          </header>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(18,9,29,0.3)] backdrop-blur-xl sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified across 4 key markets
              </div>

              <h1 className="mt-5 max-w-xl text-3xl font-black leading-[1.05] tracking-[-0.06em] text-white sm:text-5xl">
                Find premium homes, student living, and scalable property opportunities.
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
                Discover verified estates, high-yield rental assets, hostel communities, and investment syndications designed for buyers, landlords, students, and global investors.
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-[#130d1b]/70 p-3 shadow-[0_16px_40px_rgba(24,10,35,0.28)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3d6b8] via-[#d7a0ff] to-[#6d2e8f] text-base font-black text-[#190d22] shadow-lg shadow-purple-950/40">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d0b0f3]">Status</p>
                  <p className="truncate text-sm font-bold text-white">{welcomeLabel}</p>
                </div>
                <Link
                  href={profile.isLoggedIn ? '/auth/profile' : '/auth/login?next=/properties'}
                  className="inline-flex items-center gap-1 rounded-full border border-[#e79e23]/25 bg-[#e79e23]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f7d789] transition hover:bg-[#e79e23]/15"
                >
                  {profile.isLoggedIn ? 'Profile' : 'Sign in'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#621063] via-[#9333ea] to-[#d68a3f] px-5 py-3 text-sm font-bold text-white shadow-[0_20px_45px_rgba(147,51,234,0.4)] transition hover:brightness-110"
                >
                  Browse listings
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={partnerSuiteUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10"
                  target={partnerSuiteUrl.startsWith('http') ? '_blank' : undefined}
                  rel={partnerSuiteUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <Sparkles className="h-4 w-4 text-[#e79e23]" />
                  Partner dashboard
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { value: '12.8K+', label: 'Monthly views' },
                  { value: '98.4%', label: 'Verified listings' },
                  { value: '4.9/5', label: 'Buyer satisfaction' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#120d1a]/70 p-3.5">
                    <div className="text-xl font-black text-white">{stat.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#200d2d] via-[#171127] to-[#090910] p-3 shadow-[0_20px_60px_rgba(8,4,16,0.5)]">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-[1.5rem]">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0614] via-[#0a0614]/35 to-transparent" />

                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                      {selectedProperty.badge}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#f7d789]">
                      <Star className="h-3.5 w-3.5 fill-[#f7d789]" />
                      {selectedProperty.rating}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-black text-white">{selectedProperty.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-white/70">
                    <MapPin className="h-3.5 w-3.5 text-[#e79e23]" />
                    {selectedProperty.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">Starting from</div>
                      <div className="text-lg font-black text-[#f5d08d]">{selectedProperty.price}</div>
                    </div>
                    <Link
                      href="/properties"
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-white/15"
                    >
                      View details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="relative rounded-[1.6rem] border border-white/15 bg-white/[0.04] p-2.5 shadow-[0_14px_40px_rgba(20,10,30,0.32)] backdrop-blur-xl">
              <div className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-[#111019]/80 px-3 py-3">
                <div className="text-white/40">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search villas, apartments, hostels and syndications"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#621063] to-[#e79e23] text-white transition hover:brightness-110"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-5 flex items-center gap-2.5 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All assets' },
              { id: 'real-estate', label: 'Real estate' },
              { id: 'shortlet', label: 'Short-let' },
              { id: 'hostel', label: 'Student hostels' },
              { id: 'syndication', label: 'Syndications' },
            ].map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`rounded-full px-4 py-2 text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-[#621063] via-[#8f4bd8] to-[#d68a3f] text-white shadow-lg shadow-purple-950/60'
                      : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d3a9ff]">Featured</p>
                <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Prime property picks</h2>
              </div>

              <Link href="/properties" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#f7d789] transition hover:text-[#f8dfab]">
                See all listings
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {filteredListings.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedProperty(item)}
                  className={`group cursor-pointer overflow-hidden rounded-[1.8rem] border bg-white/[0.02] p-3.5 transition-all duration-300 shadow-[0_18px_50px_rgba(10,5,18,0.25)] ${
                    selectedProperty.id === item.id
                      ? 'border-[#f7d789] ring-1 ring-[#f7d789]/60 shadow-[0_26px_70px_rgba(147,51,234,0.25)]'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="relative h-60 overflow-hidden rounded-[1.35rem]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]/80 via-[#07070d]/10 to-transparent" />

                    <div className="absolute left-3 top-3">
                      <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                        {item.badge}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3 flex gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/55">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/55">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                      <div className="max-w-[70%]">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#f7d789]">{item.categoryLabel}</p>
                        <h3 className="mt-1 truncate text-base font-black text-white">{item.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-white/70">
                          <MapPin className="h-3 w-3 text-[#e79e23]" />
                          {item.location}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 text-right backdrop-blur-md">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">Price</div>
                        <div className="text-sm font-black text-emerald-300">{item.price}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3 text-[11px] text-white/60">
                    <span>{item.beds > 0 ? `${item.beds} Beds` : item.sqft}</span>
                    <span>•</span>
                    <span>{item.baths > 0 ? `${item.baths} Baths` : 'Covenanted'}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#f7d789]">
                      <Star className="h-3.5 w-3.5 fill-[#f7d789]" />
                      {item.rating}
                    </span>
                  </div>

                  <div className="mt-4">
                    <CylindricalActionPill
                      label={item.category === 'real-estate' ? 'Pay now & escrow' : item.category === 'shortlet' ? 'Reserve stay' : 'Book unit'}
                      price={item.price}
                      propertyTitle={item.title}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 pb-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-white">More verified opportunities</h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Curated</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredListings.slice(2).concat(filteredListings.slice(0, 2)).map((asset, idx) => (
                <div
                  key={`${asset.id}-${idx}`}
                  className="group rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-3 transition duration-300 hover:bg-white/[0.04]"
                >
                  <div className="relative h-36 overflow-hidden rounded-[1.1rem]">
                    <img src={asset.image} alt={asset.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                      {asset.badge}
                    </span>
                  </div>

                  <h4 className="mt-3 truncate text-xs font-black text-white">{asset.title}</h4>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-white/50">
                    <MapPin className="h-3 w-3 text-[#e79e23]" />
                    {asset.location}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
                    <strong className="text-xs font-black text-[#f7d789]">{asset.price}</strong>
                    <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
                      <Eye className="h-3 w-3" />
                      {asset.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-[1.75rem] border border-white/15 bg-[#160a28] p-6 shadow-2xl">
              <h4 className="text-base font-bold text-white">Select active region</h4>
              <div className="mt-4 space-y-2">
                {['Lagos, NG', 'Abuja, FCT', 'Ilorin / Malete, Kwara', 'Port Harcourt, Rivers'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setCurrentCity(city);
                      setShowLocationModal(false);
                    }}
                    className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      currentCity === city ? 'bg-[#621063] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
