'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, Sparkles, BadgeCheck, Star } from 'lucide-react';
import { SITE } from '../config/site';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
          <div className="flex items-start gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-brand-purple/10 ring-1 ring-white/10">
              <Image src="/assets/ay-smart-logo.png" alt="AY'SMART logo" fill className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">About</p>
              <h1 className="mt-2 text-3xl font-black">{SITE.name} — Luxury property & automotive ecosystem</h1>
              <p className="mt-3 text-sm text-zinc-400">We provide a curated marketplace for premium properties, student hostels, and automotive fleet services—built on trust, transparency and verified listings.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
            <h2 className="text-xl font-bold">Leadership</h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-white/5" />
              <div>
                <p className="font-semibold">CEO — AY'SMART Investment Ltd</p>
                <p className="text-sm text-zinc-400">Founder & Chief Executive. Passionate about building reliable marketplaces and trusted verification systems.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
            <h2 className="text-xl font-bold">Contact</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-300">
              <p>Phone: <a className="text-white" href={`tel:${SITE.phone.replace(/\s+/g, '')}`}>{SITE.phone}</a></p>
              <p>WhatsApp: <a className="text-white" href={`https://wa.me/${SITE.whatsapp.replace(/\s+/g, '').replace('+', '')}`}>{SITE.whatsapp}</a></p>
              <p>Email: <a className="text-white" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
              <p>Address: {SITE.address}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Follow Us</h3>
              <div className="mt-3 flex gap-3">
                <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-[#A855F7] hover:text-white">Web</a>
                <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-[#A855F7] hover:text-white">Twitter</a>
                <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-[#A855F7] hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-xl font-bold">Trust & Assurance</h2>
          <p className="mt-3 text-sm text-zinc-400">We verify sellers and agents, and review every high-value listing for accuracy. Our verification workflows include automated checks and manual review when needed.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="h-5 w-5 text-[#A855F7]" />
              <div>
                <p className="text-sm text-zinc-300">Secure Payments</p>
                <p className="text-xs text-zinc-400">Trusted providers and secure settlement.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <Truck className="h-5 w-5 text-[#A855F7]" />
              <div>
                <p className="text-sm text-zinc-300">Nationwide Delivery</p>
                <p className="text-xs text-zinc-400">Vendor-managed fulfillment options.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <Sparkles className="h-5 w-5 text-[#A855F7]" />
              <div>
                <p className="text-sm text-zinc-300">Original Products</p>
                <p className="text-xs text-zinc-400">We verify authenticity for premium items.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <BadgeCheck className="h-5 w-5 text-[#A855F7]" />
              <div>
                <p className="text-sm text-zinc-300">Warranty Available</p>
                <p className="text-xs text-zinc-400">Selected listings include warranty options.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
