'use client';
import { useState } from 'react';
import {
  Globe,
  Share2,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Star,
  ChevronUp,
} from 'lucide-react';

const products = ['Premium Fleet', 'Electric Mobility', 'Maintenance Plans', 'Insurance Partners'];
const support = ['Roadside Assist', 'Service Booking', 'Warranty Help', 'Fleet Finance'];
const legal = ['Terms of Service', 'Privacy Policy', 'Refund Policy', 'Safety Standards'];
const resources = ['Vehicle Reviews', 'Test Drive Info', 'Dealer Network', 'Corporate Leasing'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-10 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">AY'SMART AUTO</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">A premium automotive experience built for modern mobility.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                From luxury fleet access to electric vehicle leasing and warranty-backed service plans, AY'SMART AUTO powers every drive with trust, style, and performance.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Verified vehicles</p>
                <p className="mt-2 text-lg font-semibold text-white">Premium inspection & certification.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fast delivery</p>
                <p className="mt-2 text-lg font-semibold text-white">Doorstep handover across Lagos and beyond.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1 xl:gap-6">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Our Products</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-400">
                {products.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Support</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-400">
                {support.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1 xl:gap-6">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Contact</h3>
              <div className="mt-5 space-y-3 text-sm text-slate-400">
                <p>Phone: <span className="text-white">+234 700 888 8888</span></p>
                <p>Email: <span className="text-white">support@aysmartauto.com</span></p>
                <p>Address: <span className="text-white">Lekki Free Trade Zone, Lagos</span></p>
                <p>Hours: <span className="text-white">Mon–Sat 8:00am–7:00pm</span></p>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Legal</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-400">
                {legal.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Resources</h3>
              <ul className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                {resources.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Drive the future</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">Get high-impact offers, launch alerts, and first access to new vehicle arrivals.</p>
              <form onSubmit={handleSubscribe} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="auto-newsletter-email" className="sr-only">Email address</label>
                <input
                  id="auto-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
                <button type="submit" className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Subscribe</button>
              </form>
              {subscribed && <p className="mt-3 text-sm text-emerald-400">Subscribed successfully. You’ll receive updates soon.</p>}
            </section>
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-slate-800 pt-10 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Why AY'SMART AUTO</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <span className="text-sm text-slate-300">Trusted vehicle sourcing.</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-sm text-slate-300">Luxury delivery experience.</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <BadgeCheck className="h-5 w-5 text-amber-400" />
                <span className="text-sm text-slate-300">Certified inspection checks.</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <Star className="h-5 w-5 text-amber-400" />
                <span className="text-sm text-slate-300">Premium customer support.</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Accepted Payments</p>
            <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
              {['Visa', 'Mastercard', 'Verve', 'Bank Transfer', 'Opay', 'Moniepoint'].map((method) => (
                <div key={method} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-center">{method}</div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Stay Connected</p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 transition hover:bg-amber-400 hover:text-slate-950" aria-label="Website"><Globe size={18} /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 transition hover:bg-amber-400 hover:text-slate-950" aria-label="Share"><Share2 size={18} /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 transition hover:bg-amber-400 hover:text-slate-950" aria-label="Messages"><MessageCircle size={18} /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 transition hover:bg-amber-400 hover:text-slate-950" aria-label="Newsletter"><Send size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950/95 px-6 py-6 lg:px-10">
        <div className="mx-auto flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AY'SMART AUTOMOTIVE LTD. All rights reserved.</p>
          <p>Driven by premium service and smart mobility.</p>
          <button onClick={scrollToTop} className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-white transition hover:bg-amber-400 hover:text-slate-950">
            <ChevronUp size={16} /> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
