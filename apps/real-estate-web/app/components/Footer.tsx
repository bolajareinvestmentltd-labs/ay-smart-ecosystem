'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  BadgeCheck,
  Star,
  ChevronUp,
  Globe,
  Share2,
  Send,
  MessageCircle,
  CreditCard,
  Landmark,
  Smartphone,
  Building2,
} from 'lucide-react';

const companyLinks = ['About Us', 'Our Services', 'Shop', 'Brands', 'Blog', 'Careers'];
const supportLinks = [
  { label: 'Support Center', href: '/support' },
  { label: 'Contact Us', href: '/support' },
  { label: 'Complaints', href: '/support' },
  { label: 'Service Requests', href: '/support' },
];
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy', 'Disclaimer'];
const resourceLinks = ['Buying Guide', 'Properties Care Tips', 'Promotions', 'Affiliate Program'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="bg-[#09090B] border-t border-white/10 text-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-10 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">AY&#39;SMART ECO</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Luxury property & automotive ecosystem.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
                AY&apos;SMART ECO delivers premium real estate housing, student hostel support, and automotive fleet services with a unified, trustworthy marketplace experience.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Trusted Business</p>
                <p className="mt-2 text-lg font-semibold text-white">Premium service built on integrity.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Safety-first transactions</p>
                <p className="mt-2 text-lg font-semibold text-white">Secure agent verification and quality listings.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1 xl:gap-6">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Company</h3>
              <ul className="mt-5 space-y-3 text-sm text-zinc-400">
                {companyLinks.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Customer Support</h3>
              <ul className="mt-5 space-y-3 text-sm text-zinc-400">
                {supportLinks.map((item) => (
                  <li key={item.label} className="transition-colors hover:text-white">
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1 xl:gap-6">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Contact Information</h3>
              <div className="mt-5 space-y-3 text-sm text-zinc-400">
                <p>Phone: <span className="text-white">+234 700 000 0000</span></p>
                <p>WhatsApp: <span className="text-white">+234 800 000 0000</span></p>
                <p>Email: <span className="text-white">support@aysmartinvestmentltd.com</span></p>
                <p>Address: <span className="text-white">Lagos, Nigeria</span></p>
                <p>Hours: <span className="text-white">Mon–Sat 8:00am–6:00pm</span></p>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Legal</h3>
              <ul className="mt-5 space-y-3 text-sm text-zinc-400">
                {legalLinks.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Resources</h3>
              <ul className="mt-5 grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
                {resourceLinks.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Stay Updated</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Subscribe to receive exclusive offers, product launches, discounts, and technology updates.</p>
              <form onSubmit={handleSubscribe} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#A855F7] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/20"
                />
                <button type="submit" className="rounded-2xl bg-[#A855F7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9333ea]">Subscribe</button>
              </form>
              {subscribed && <p className="mt-3 text-sm text-emerald-400">Thank you! You are now subscribed.</p>}
            </section>
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/10 pt-10 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Trust Badges</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <ShieldCheck className="h-5 w-5 text-[#A855F7]" />
                <span className="text-sm text-zinc-300">Secure Payments</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <Truck className="h-5 w-5 text-[#A855F7]" />
                <span className="text-sm text-zinc-300">Nationwide Delivery</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <Sparkles className="h-5 w-5 text-[#A855F7]" />
                <span className="text-sm text-zinc-300">Original Products</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <BadgeCheck className="h-5 w-5 text-[#A855F7]" />
                <span className="text-sm text-zinc-300">Warranty Available</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <Star className="h-5 w-5 text-[#A855F7]" />
                <span className="text-sm text-zinc-300">Customer Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Accepted Payment Methods</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { name: 'Visa', icon: CreditCard },
                { name: 'Mastercard', icon: CreditCard },
                { name: 'Verve', icon: Landmark },
                { name: 'Bank Transfer', icon: Landmark },
                { name: 'Opay', icon: Smartphone },
                { name: 'Moniepoint', icon: Building2 },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.name} className="flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-4 text-center text-sm text-zinc-300">
                    <Icon className="h-4 w-4 text-[#A855F7]" />
                    <span>{method.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Follow Us</p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-[#A855F7] hover:text-white" aria-label="Website"><Globe size={18} /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-[#A855F7] hover:text-white" aria-label="Share"><Share2 size={18} /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-[#A855F7] hover:text-white" aria-label="Messages"><MessageCircle size={18} /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-[#A855F7] hover:text-white" aria-label="Newsletter"><Send size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#07070A] px-6 py-6 lg:px-10">
        <div className="mx-auto flex flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AY&apos;SMART INVESTMENT LTD. All rights reserved.</p>
          <p>Built with premium service and integrity.</p>
          <button onClick={scrollToTop} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-[#A855F7] hover:text-white">
            <ChevronUp size={16} /> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
