'use client';

import React, { useState, useEffect } from 'react';
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

  const filteredListings = FEATURED_LISTINGS.filter((item) => {
    if (activeFilter !== 'all' && item.category !== activeFilter) return false;
    if (searchQuery.trim() === '') return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
      {/* 1. Splash Screen Component on App Entry */}
      <SplashScreen />

      <main className="min-h-screen bg-[#0b0515] text-[#f4eff8] pb-32 font-sans selection:bg-purple-900 selection:text-white">
        {/* Ambient Top Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-900/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
          {/* Top Bar Header (Reference Image 1 & 5 Inspired) */}
          <header className="flex items-center justify-between gap-3 pb-6 border-b border-white/10">
            {/* User Avatar + Rating Badge */}
            <div className="flex items-center gap-3">
              <Link href="/auth/profile" className="relative group">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#621063] via-[#9333ea] to-[#e79e23] p-0.5 shadow-lg group-hover:scale-105 transition">
                  <div className="h-full w-full rounded-2xl bg-[#140824] flex items-center justify-center text-sm font-black text-white">
                    SA
                  </div>
                </div>
              </Link>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                    <Star className="h-3 w-3 fill-emerald-400" /> 4.9 Buyer
                  </span>
                </div>
                <span className="text-xs text-white/50 block font-medium mt-0.5">Welcome, Explorer</span>
              </div>
            </div>

            {/* Center: Location Pill Switcher */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 shadow-sm transition backdrop-blur-md"
            >
              <MapPin className="h-3.5 w-3.5 text-[#e79e23]" />
              <span>{currentCity}</span>
              <ChevronDown className="h-3 w-3 text-white/40" />
            </button>

            {/* Right: Partner Suite Link */}
            <div className="flex items-center gap-2">
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#e79e23] px-3.5 py-1.5 rounded-xl border border-[#e79e23]/30 bg-[#e79e23]/10 hover:bg-[#e79e23]/20 transition"
              >
                <Sparkles className="h-3.5 w-3.5" /> Partner Suite
              </a>
            </div>
          </header>

          {/* Search Input Bar (Reference Image 5 Inspired) */}
          <section className="mt-6">
            <div className="relative rounded-2xl border border-white/15 bg-white/[0.04] p-2 flex items-center gap-3 backdrop-blur-xl shadow-xl">
              <div className="pl-3 text-white/40">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search villas, Lekki apartments, KWASU hostels, syndications..."
                className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none font-medium"
              />
              <button
                type="button"
                className="p-2.5 rounded-xl bg-gradient-to-tr from-[#621063] to-[#e79e23] text-white hover:opacity-90 transition shadow-md"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Fast Category Filter Chips (Reference Image 1 Inspired) */}
          <section className="mt-5 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Assets' },
              { id: 'real-estate', label: 'Real Estate' },
              { id: 'shortlet', label: 'Short-Lets' },
              { id: 'hostel', label: 'Student Hostels' },
              { id: 'syndication', label: 'Syndications' },
            ].map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-[#621063] via-[#9333ea] to-[#a855f7] text-white shadow-lg shadow-purple-950/60 scale-105'
                      : 'border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </section>

          {/* Featured Properties Hero Presentation */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Featured Prime Properties
                </h2>
                <p className="text-xs text-white/50 mt-0.5">Verified title deeds backed by AY’SMART legal covenants</p>
              </div>

              <Link href="/properties" className="text-xs font-bold text-[#e79e23] hover:underline flex items-center gap-1">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Featured Property Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredListings.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedProperty(item)}
                  className={`group rounded-3xl border p-4 sm:p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 shadow-xl cursor-pointer ${
                    selectedProperty.id === item.id
                      ? 'border-[#e79e23] shadow-purple-950/80 ring-1 ring-[#e79e23]/50'
                      : 'border-white/10'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Badge Pill */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                        {item.badge}
                      </span>
                    </div>

                    {/* Top Right Actions (Likes / Share) */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Bottom Info inside image */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-semibold text-[#e79e23] block">{item.categoryLabel}</span>
                        <h3 className="text-base font-black text-white truncate max-w-[240px]">{item.title}</h3>
                        <p className="text-[11px] text-white/70 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#e79e23]" /> {item.location}
                        </p>
                      </div>

                      <div className="text-right bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                        <strong className="text-sm font-black text-emerald-400 block">{item.price}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Specs Row */}
                  <div className="flex items-center justify-between text-xs text-white/60 py-2 border-b border-white/10">
                    <span>{item.beds > 0 ? `${item.beds} Bedrooms` : item.sqft}</span>
                    <span>•</span>
                    <span>{item.baths > 0 ? `${item.baths} Bathrooms` : 'Covenanted'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#e79e23] font-bold">
                      <Star className="h-3.5 w-3.5 fill-[#e79e23]" /> {item.rating}
                    </span>
                  </div>

                  {/* Integrated Cylindrical Action Container on Card */}
                  <div className="mt-4">
                    <CylindricalActionPill
                      label={item.category === 'real-estate' ? 'Pay Now & Escrow' : item.category === 'shortlet' ? 'Reserve Stay' : 'Book Unit'}
                      price={item.price}
                      propertyTitle={item.title}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Nearby & Secondary Deck */}
          <section className="mt-12">
            <h3 className="text-lg font-black text-white mb-4">
              More Verified Opportunities
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredListings.slice(2).concat(filteredListings.slice(0, 2)).map((asset, idx) => (
                <div
                  key={`${asset.id}-${idx}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 hover:bg-white/[0.04] transition group"
                >
                  <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3">
                    <img src={asset.image} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-2 left-2 text-[9px] font-bold bg-black/70 px-2 py-0.5 rounded-md text-emerald-400">
                      {asset.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{asset.title}</h4>
                  <p className="text-[10px] text-white/50 truncate mt-0.5">{asset.location}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <strong className="text-xs font-black text-[#e79e23]">{asset.price}</strong>
                    <span className="text-[10px] text-white/40 flex items-center gap-0.5">
                      <Eye className="h-3 w-3" /> {asset.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Location Selector Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-[#160a28] p-6 shadow-2xl text-white">
              <h4 className="text-base font-bold mb-3">Select Active Region</h4>
              <div className="space-y-2">
                {['Lagos, NG', 'Abuja, FCT', 'Ilorin / Malete, Kwara', 'Port Harcourt, Rivers'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setCurrentCity(city);
                      setShowLocationModal(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
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
