'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Home, ShieldCheck, ArrowRight, MapPin, Sparkles, Star, Tag } from 'lucide-react';
import DockNavbar from './components/DockNavbar';

const AUTOMOTIVE_APP_URL = process.env.NEXT_PUBLIC_AUTOMOTIVE_APP_URL ?? 'http://localhost:3001';

// Admin-managed carousel items (synced with Django backend later)
const carouselImages = [
  {
    title: "Luxury Duplexes & Homes",
    subtitle: "Built from scratch to absolute perfection",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    badge: "Sponsored & Featured"
  },
  {
    title: "Commercial & Corporate Offices",
    subtitle: "Prime business locations for high-flying enterprises",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    badge: "Verified Listing"
  },
  {
    title: "Student Hostels & Apartments",
    subtitle: "Modern, secure, and fully serviced living spaces",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    badge: "Hot Deal"
  }
];

export default function RealEstateHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-zinc-900 dark:text-zinc-100 pb-28 transition-colors duration-300">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md border-b border-brand-purple/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center text-white font-black shadow-lg border border-brand-accent/40">
            AS
          </div>
          <div>
            <h1 className="text-xs font-extrabold tracking-tight text-brand-purple dark:text-brand-magenta">AY'SMART ECO</h1>
            <p className="text-[10px] text-zinc-500 font-medium">Real Estate Hub</p>
          </div>
        </div>
        <Link href="/auth/login" className="text-xs font-bold px-4 py-2 rounded-full bg-brand-purple text-white shadow-md hover:bg-brand-magenta transition-all">
          Sign In
        </Link>
      </header>

      {/* Auto-Scrolling Hero Carousel with Admin Labels */}
      <section className="relative h-[380px] w-full overflow-hidden">
        {carouselImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent z-10" />
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            
            {/* Admin-Controlled Post Label / Toggle Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-purple text-white text-[10px] font-bold tracking-wider shadow-lg border border-brand-accent/50">
                <Tag size={12} className="text-brand-accent" /> {slide.badge}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
              <h2 className="text-2xl font-black drop-shadow-md text-white">{slide.title}</h2>
              <p className="text-xs text-zinc-200 mt-1">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Categories Section */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black tracking-widest uppercase text-brand-purple dark:text-brand-magenta">Explore Categories</h3>
          <Link href="/properties" className="text-xs text-brand-purple dark:text-brand-magenta font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Houses & Duplexes", count: "12 Listings", icon: Home, href: "/properties" },
            { title: "Commercial Offices", count: "8 Listings", icon: Building2, href: "/properties" },
            { title: "Student Hostels", count: "15 Listings", icon: MapPin, href: "/hostel" },
            { title: "From-Scratch Build", count: "Custom Service", icon: ShieldCheck, href: "/plans" },
          ].map((cat, idx) => (
            <Link key={idx} href={cat.href} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-brand-purple/15 shadow-sm hover:border-brand-accent transition-all cursor-pointer group">
              <cat.icon className="text-brand-purple dark:text-brand-magenta mb-2 group-hover:scale-110 transition-transform" size={24} />
              <h4 className="text-xs font-bold">{cat.title}</h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 mt-6">
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/register" className="rounded-2xl border border-brand-purple/20 bg-white p-4 text-sm font-semibold text-brand-purple dark:bg-zinc-900 dark:text-brand-magenta">Register & start</Link>
          <Link href="/kyc" className="rounded-2xl border border-brand-purple/20 bg-white p-4 text-sm font-semibold text-brand-purple dark:bg-zinc-900 dark:text-brand-magenta">Complete KYC</Link>
          <Link href="/dashboard" className="rounded-2xl border border-brand-purple/20 bg-white p-4 text-sm font-semibold text-brand-purple dark:bg-zinc-900 dark:text-brand-magenta">Create listing</Link>
        </div>
      </section>

      {/* Cross-Platform Navigation Banner */}
      <section className="px-4 mt-8">
        <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white shadow-xl relative overflow-hidden border border-brand-accent/30">
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-wider text-brand-accent">Looking for Vehicles?</h3>
            <p className="text-xs text-zinc-100 mt-1">Explore cars for sale, lease, hire, or trade-in on our Automotive app.</p>
            <a href={AUTOMOTIVE_APP_URL} className="inline-block mt-3 px-4 py-2 rounded-xl bg-white text-brand-purple text-xs font-bold shadow-md hover:bg-brand-accent hover:text-brand-dark transition-all">
              Switch to Automotive Hub
            </a>
          </div>
        </div>
      </section>

      {/* Floating DockMobile Bottom Navigation */}
      <DockNavbar />
    </main>
  );
}
