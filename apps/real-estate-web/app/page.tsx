"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

const AUTOMOTIVE_APP_URL = process.env.NEXT_PUBLIC_AUTOMOTIVE_APP_URL ?? "http://localhost:3001";

const carouselImages = [
  {
    title: "Luxury Duplexes & Homes",
    subtitle: "Built from scratch to absolute perfection",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    badge: "Featured",
  },
  {
    title: "Commercial & Corporate Offices",
    subtitle: "Prime business locations for high-flying enterprises",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    badge: "Verified Listing",
  },
  {
    title: "Student Hostels & Apartments",
    subtitle: "Modern, secure, and fully serviced living spaces",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    badge: "Hot Deal",
  },
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
    <main className="min-h-screen bg-brand-dark text-white pb-28 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07070D]/95 backdrop-blur-xl px-4 py-4 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-brand-purple text-white shadow-lg shadow-brand-purple/20 ring-1 ring-white/10">
              AS
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">AY&apos;SMART ECO</p>
              <p className="text-[11px] text-zinc-400">Real estate, construction, and vehicle services.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/properties" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-brand-accent hover:text-brand-accent">
              Explore
            </Link>
            <Link href="/auth/login" className="rounded-full bg-brand-purple px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-brand-magenta">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pt-8 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-accent">Premium property marketplace</p>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Modern real estate and automotive services in one fast mobile app.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              Discover duplexes, offices, hostels, and vehicles with a clean, responsive experience that feels quick and polished on every screen.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/properties" className="rounded-full bg-brand-purple px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-purple/20 transition hover:bg-brand-magenta">
                View listings
              </Link>
              <Link href="/plans" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-accent hover:text-brand-accent">
                Pricing plans
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Student hostels', value: '15 Listings' },
                { label: 'Commercial offices', value: '8 Listings' },
                { label: 'Verified agents', value: '24+ Professionals' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-400">{item.label}</p>
                  <p className="mt-2 text-lg font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/30 via-transparent to-transparent" />
            <div className="relative h-[320px] sm:h-[420px]">
              {carouselImages.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                >
                  <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/10 to-slate-950/90" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-black/60 p-4 text-white backdrop-blur-sm">
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
                      <Tag size={12} /> {slide.badge}
                    </span>
                    <h2 className="mt-3 text-xl font-black">{slide.title}</h2>
                    <p className="mt-2 text-sm text-zinc-200">{slide.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Cross-platform access</p>
              <h2 className="mt-2 text-xl font-black text-white">Switch between property and automotive services instantly.</h2>
            </div>
            <Link href={AUTOMOTIVE_APP_URL} className="inline-flex items-center justify-center rounded-full bg-brand-accent px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-accent/20 transition hover:bg-yellow-400">
              Open Automotive Hub
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4 lg:px-8 pb-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Houses & Duplexes', subtitle: '12 Listings', href: '/properties' },
            { title: 'Commercial Offices', subtitle: '8 Listings', href: '/properties' },
            { title: 'Student Hostels', subtitle: '15 Listings', href: '/hostel' },
            { title: 'From-Scratch Build', subtitle: 'Custom service', href: '/plans' },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[1.65rem] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-brand-accent/30"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-purple group-hover:text-brand-magenta">{item.title}</p>
              <p className="mt-3 text-sm text-zinc-400">{item.subtitle}</p>
              <p className="mt-4 text-sm font-semibold text-white">Explore</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}