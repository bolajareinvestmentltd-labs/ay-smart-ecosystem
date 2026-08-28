'use client';
import Image from 'next/image';
import { ShieldCheck, Truck, Sparkles, BadgeCheck, Award } from 'lucide-react';
import { SITE } from '../config/site';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
          <div className="flex items-start gap-6">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-white/95 p-2 ring-1 ring-white/10 sm:h-32 sm:w-32">
              <Image src="/assets/brand-logo.svg" alt="AY'SMART logo" fill sizes="128px" className="object-contain p-2" priority />
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
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white/95 p-2 ring-2 ring-amber-400/60">
                <Image src="/assets/brand-logo.svg" alt="AY'SMART leadership placeholder" fill sizes="80px" className="object-contain p-2" />
              </div>
              <div>
                <p className="font-semibold">CEO — AY&apos;SMART Investment Ltd</p>
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
              <div className="mt-3 flex flex-wrap gap-3 p-1">
                <a href="https://www.facebook.com/share/194KKj3wqC/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="AY'SMART on Facebook" className="inline-flex min-h-10 min-w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-[#A855F7] hover:text-white">Facebook</a>
                <a href="#" aria-label="AY'SMART website" className="inline-flex min-h-10 min-w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-[#A855F7] hover:text-white">Web</a>
                <a href="#" aria-label="AY'SMART on Twitter" className="inline-flex min-h-10 min-w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-[#A855F7] hover:text-white">Twitter</a>
                <a href="#" aria-label="AY'SMART on Instagram" className="inline-flex min-h-10 min-w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-[#A855F7] hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-xl font-bold">Investment Assurance</h2>
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

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-xl font-bold">Certifications & Awards</h2>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold">CAC registration</p>
              <p className="mt-1 text-sm text-zinc-400">AY&apos;SMART Investment Ltd operates as a registered business. Certification details can be confirmed through the company records.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
