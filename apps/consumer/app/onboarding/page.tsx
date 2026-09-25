'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Hotel,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Mail,
  ArrowRight,
  ChevronRight,
  Lock,
  X,
  Sparkles,
  Smartphone
} from 'lucide-react';
import SocialAuthButtons from '../components/SocialAuthButtons';

interface ProductShowcase {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  metrics: string;
  metricsLabel: string;
  highlights: string[];
  image: string;
}

const PRODUCTS: ProductShowcase[] = [
  {
    id: 'residences',
    badge: 'Luxury Smart Living',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    title: 'Smart Assetz Residences',
    tagline: 'Duplexes & penthouses with legal C of O title verification and smart escrow deposit protection.',
    metrics: '₦85M - ₦450M',
    metricsLabel: 'Avg. Valuation',
    highlights: ['Governor’s Consent & C of O Verified', 'Milestone-based Escrow Release', '24/7 Security & Solar Infrastructure'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'shortlets',
    badge: 'Hospitality & Leisure',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    title: 'Executive Short-Lets & Hotels',
    tagline: 'Boutique apartments and suites with automated digital keycode delivery and instant ID verification.',
    metrics: '₦45,000+',
    metricsLabel: 'Per Night ADR',
    highlights: ['Instant Smart Lock PIN Dispatch', 'Complimentary High-speed Fiber', 'Verified Host Quality Standards'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'hostels',
    badge: 'Campus Off-Campus Living',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    title: 'Campus Smart Hostels',
    tagline: 'Matric-verified off-campus rooms, 24/7 gated security, campus shuttle passes, and verified roommate matching.',
    metrics: '₦220k - ₦450k',
    metricsLabel: 'Per Academic Session',
    highlights: ['Digital Gate Pass QR Access', 'Campus Shuttle Network Passes', 'Verified Student Roommate Matcher'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'syndications',
    badge: 'Co-Investment & Syndication',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    title: 'Vetted Asset Syndications',
    tagline: 'Institutional fractional property co-investments with guaranteed dividend distributions.',
    metrics: '18.4% - 22.5%',
    metricsLabel: 'Projected Annual IRR',
    highlights: ['Quarterly Direct Payouts', 'Vetted Title Asset Covenants', 'Minimum Unit: ₦2,500,000'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Auto-cycle products carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % PRODUCTS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const currentProduct = PRODUCTS[activeSlide];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      router.push(`/register?email=${encodeURIComponent(email)}`);
    } else {
      router.push(`/auth/login?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between text-white overflow-x-hidden font-sans relative"
      style={{
        background: 'radial-gradient(circle at 50% 20%, #2e1452 0%, #170a2c 45%, #090312 100%)',
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-purple-700/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#e79e23]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#621063] to-[#e79e23] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-950/50">
            SA
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#e79e23] uppercase block">
              Smart Assetz
            </span>
            <span className="text-sm font-bold tracking-tight text-white block -mt-0.5">
              Consumer Ecosystem
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-white/60 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition flex items-center gap-1"
        >
          Skip to Explore <ChevronRight className="h-3 w-3" />
        </Link>
      </header>

      {/* Center Hero: Pitchcraft Inspired Athletic / Precision Product Showcase */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-4 w-full">
        {/* Dynamic Product Showcase Card */}
        <div className="w-full relative rounded-3xl overflow-hidden border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          {/* Top Banner / Image Backdrop */}
          <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6">
            <img
              src={currentProduct.image}
              alt={currentProduct.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140824] via-[#140824]/40 to-transparent" />

            {/* Top Category Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${currentProduct.badgeColor}`}>
                {currentProduct.badge}
              </span>
            </div>

            {/* Metrics Pill on Image */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-xl text-right">
              <span className="text-[9px] text-white/50 block font-semibold">{currentProduct.metricsLabel}</span>
              <strong className="text-sm sm:text-base font-black text-emerald-400">{currentProduct.metrics}</strong>
            </div>

            {/* Product Title inside image */}
            <div className="absolute bottom-4 left-4 max-w-md">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentProduct.title}
              </h2>
            </div>
          </div>

          {/* Description & Feature Highlights */}
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
            {currentProduct.tagline}
          </p>

          <div className="grid sm:grid-cols-3 gap-2.5 mt-4">
            {currentProduct.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-white/90">
                <CheckCircle2 className="h-4 w-4 text-[#e79e23] shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <div className="flex gap-2">
              {PRODUCTS.map((prod, index) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? 'w-8 bg-gradient-to-r from-[#621063] to-[#e79e23]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
              Product {activeSlide + 1} of {PRODUCTS.length}
            </span>
          </div>
        </div>

        {/* Pitchcraft Inspired Title */}
        <div className="text-center mt-6 mb-4">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
            Precision Real Estate Starts Here
          </h3>
          <p className="text-xs text-white/60 mt-1 max-w-md mx-auto">
            Direct access to verified properties, campus hostels, short-let bookings, and high-yield syndications.
          </p>
        </div>
      </main>

      {/* Bottom Auth Shell (Exact Reference Image 2 Style) */}
      <footer className="relative z-20 w-full max-w-md mx-auto px-4 pb-8 space-y-3">
        {/* 1. Sign Up with Email Button */}
        <button
          type="button"
          onClick={() => {
            setAuthMode('register');
            setShowEmailModal(true);
          }}
          className="w-full py-3.5 px-6 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md transition group"
        >
          <Mail className="h-4 w-4 text-white/80 group-hover:scale-110 transition" />
          Sign Up with Email
        </button>

        {/* 2. Apple Auth Button */}
        <button
          type="button"
          onClick={() => {
            alert('Apple Sign In is available on verified iOS devices.');
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.07.65-2.73 1.41-.56.63-1.07 1.68-.96 2.72 1.07.08 2.11-.56 2.68-1.26z" />
          </svg>
          Continue with Apple
        </button>

        {/* 3. Google Auth Button with live backend OAuth modal */}
        <div className="w-full">
          <SocialAuthButtons />
        </div>

        {/* Already have an account / Footer Switcher */}
        <div className="flex items-center justify-between text-xs text-white/50 pt-2 px-1">
          <span>
            Already have an account?{' '}
            <button
              onClick={() => {
                setAuthMode('login');
                setShowEmailModal(true);
              }}
              className="font-bold text-[#e79e23] hover:underline"
            >
              Login
            </button>
          </span>

          <Link href="/" className="font-semibold text-white/70 hover:text-white underline-offset-4 hover:underline">
            Explore as Guest →
          </Link>
        </div>
      </footer>

      {/* Email Auth Slide-over / Modal (matching Image 2 Right Screen) */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-[#160a27] p-6 sm:p-8 shadow-2xl relative text-white">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black tracking-widest text-[#e79e23] uppercase block">
                {authMode === 'register' ? 'Create New Account' : 'Welcome Back'}
              </span>
              <h4 className="text-2xl font-black text-white mt-1">
                {authMode === 'register' ? 'Join Smart Assetz' : 'Sign in to Your Account'}
              </h4>
              <p className="text-xs text-white/60 mt-1">
                {authMode === 'register'
                  ? 'Access verified real estate, bookings, and instant escrow.'
                  : 'Manage your portfolio, inspections, and rentals.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Oluwaseun Adeleke"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#e79e23]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#e79e23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#e79e23]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#621063] via-[#86198f] to-[#e79e23] text-xs font-bold text-white uppercase tracking-wider shadow-xl hover:opacity-90 transition flex items-center justify-center gap-2 mt-6"
              >
                <Sparkles className="h-4 w-4" />
                {authMode === 'register' ? 'Create Account' : 'Sign In Now'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-white/60">
              {authMode === 'register' ? (
                <span>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('login')} className="font-bold text-[#e79e23] hover:underline">
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  Don’t have an account?{' '}
                  <button onClick={() => setAuthMode('register')} className="font-bold text-[#e79e23] hover:underline">
                    Register
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
