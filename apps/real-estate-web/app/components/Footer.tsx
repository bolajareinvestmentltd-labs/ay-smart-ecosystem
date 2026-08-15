'use client';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';
import { SITE } from '../config/site';

const companyLinks = ['About', 'Our Services', 'Shop', 'Brands'];
const supportLinks = [
  { label: 'Support Center', href: '/support' },
  { label: 'Contact', href: '/about' },
];
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

export default function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="bg-brand-dark border-t border-brand-border text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-violet">{SITE.name}</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white">Premium property & automotive marketplace</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">Discover curated listings, trusted agents, and secure transactions across property, hostel and automotive categories.</p>
          </div>

          <div className="grid w-full grid-cols-2 gap-6 sm:w-auto sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                {companyLinks.map((item) => (
                  <li key={item} className="transition-colors hover:text-white"><Link href={item === 'About' ? '/about' : '/'}>{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Support</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                {supportLinks.map((item) => (
                  <li key={item.label} className="transition-colors hover:text-white"><Link href={item.href}>{item.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                {legalLinks.map((item) => (
                  <li key={item} className="transition-colors hover:text-white">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/6 pt-6">
          <p className="text-sm text-zinc-500">© 2026 AY'SMART INVESTMENT LTD. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={scrollToTop} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-[#A855F7] hover:text-white">
              <ChevronUp size={16} /> Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
