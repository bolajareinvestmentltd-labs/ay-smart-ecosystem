'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  usePartner,
  CATEGORY_INFO,
  type PartnerCategory,
} from './lib/partner-context';
import {
  Building2,
  Users,
  KeyRound,
  TrendingUp,
  GraduationCap,
  Hotel,
  Home,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Search,
  Bell,
  MessageSquareText,
  SunMedium,
  MoonStar,
  Globe2,
  MapPin,
  Star,
  CalendarRange,
  NotebookText,
  BadgeCheck,
  Wifi,
  CircleDashed,
  CircleArrowUp,
} from 'lucide-react';

const ICONS: Record<PartnerCategory, React.ComponentType<{ className?: string }>> = {
  agent: Users,
  seller: KeyRound,
  landlord: Building2,
  investor: TrendingUp,
  tenant: Home,
  student: GraduationCap,
  'shortlet-hotel': Hotel,
};

const localeLabels = {
  en: 'English',
  fr: 'Français',
  yo: 'Yoruba',
  ha: 'Hausa',
};

export default function PartnerSuiteHubPage() {
  const { hasAccess, theme, setTheme, language, setLanguage, loginDemo } = usePartner();
  const [query, setQuery] = useState('');
  const [authMode, setAuthMode] = useState<'choice' | 'signin' | 'signup'>('choice');

  const socialProviders = [
    { name: 'Google', accent: 'bg-[#5d7bff]', icon: 'G' },
    { name: 'Apple', accent: 'bg-[#f4f4f5]', text: 'text-slate-900', icon: '' },
    { name: 'X', accent: 'bg-[#111827]', icon: 'X' },
    { name: 'Facebook', accent: 'bg-[#1877F2]', icon: 'f' },
  ];

  const handleQuickAccess = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    loginDemo('agent');
  };

  const filteredPortals = useMemo(() => {
    const entries = Object.keys(CATEGORY_INFO) as PartnerCategory[];
    if (!query.trim()) return entries;

    const term = query.toLowerCase();
    return entries.filter((key) => {
      const meta = CATEGORY_INFO[key];
      return meta.name.toLowerCase().includes(term) || meta.description.toLowerCase().includes(term);
    });
  }, [query]);

  const supportItems = [
    { label: 'KYC status', value: 'Verified' },
    { label: 'Portfolio health', value: 'Excellent' },
    { label: 'Response SLA', value: '< 2 hours' },
  ];

  const activityFeed = [
    'New venue inquiry received from a student hostel lead.',
    'Property review was approved by compliance for three listings.',
    'Rent payment reminder sent to 12 landlord accounts.',
    'Short-let availability synced with booking calendar.',
  ];

  const chatMessages = [
    { from: 'Ops team', text: 'Your landlord onboarding audit is ready for review.', time: '2m ago' },
    { from: 'Support', text: 'A new developer note was added to the hostel flow.', time: '14m ago' },
    { from: 'Student desk', text: 'Roommate matching is available for the next intake.', time: '29m ago' },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-bg)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--smartassetz-border)] bg-[color:rgba(11,15,22,0.85)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#621063] to-[#e79e23] text-xl font-black text-white shadow-lg">
              SA
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#e79e23]">Smart Assetz</p>
              <p className="-mt-0.5 text-sm font-bold text-white">Partner Suite</p>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <label className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                aria-label="Search partner portals"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search portals, features, operations..."
                className="w-full rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] py-2.5 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]"
            >
              {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <label className="hidden items-center gap-2 rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] sm:flex">
              <Globe2 className="h-4 w-4" />
              <select
                aria-label="Select language"
                value={language}
                onChange={(event) => setLanguage(event.target.value as 'en' | 'fr' | 'yo' | 'ha')}
                className="bg-transparent text-[var(--text-primary)] outline-none"
              >
                {Object.entries(localeLabels).map(([code, label]) => (
                  <option key={code} value={code} className="text-slate-900">
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] text-[var(--text-primary)]"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 lg:px-8 lg:py-8">
        <section className="rounded-[32px] border border-[var(--smartassetz-border)] bg-[linear-gradient(135deg,rgba(98,16,99,0.2),rgba(14,18,28,0.95),rgba(231,158,35,0.12))] p-5 shadow-[var(--shadow-soft)] lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#e79e23]">Partner access</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white lg:text-5xl">Choose how you want to onboard.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 lg:text-base">
                Sign in to manage your listings, or create a new account to begin your landlord, student, investor, or hospitality operations workflow.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              {authMode === 'choice' ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleQuickAccess('signin')}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#621063] to-[#e79e23] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#621063]/30 transition hover:opacity-95"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAccess('signup')}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
                  >
                    Sign up
                  </button>

                  <div className="pt-2">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/55">Or continue with</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {socialProviders.map((provider) => (
                        <button
                          key={provider.name}
                          type="button"
                          onClick={() => handleQuickAccess('signup')}
                          className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 ${provider.accent} px-3 py-2.5 text-xs font-bold ${provider.text ?? 'text-white'} transition hover:opacity-90`}
                        >
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/15 text-[10px] font-black">
                            {provider.icon}
                          </span>
                          {provider.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">{authMode === 'signin' ? 'Welcome back' : 'Create account'}</p>
                    <p className="mt-2 text-lg font-black text-white">{authMode === 'signin' ? 'Continue to your partner dashboard' : 'Start your Smart Assetz partnership'}</p>
                  </div>

                  <div className="space-y-2.5">
                    <input
                      type="email"
                      defaultValue="partner@smartassetz.com"
                      aria-label="Partner email"
                      className="w-full rounded-2xl border border-white/10 bg-[#120d1a] px-3.5 py-3 text-sm text-white placeholder:text-white/45 outline-none"
                      placeholder="Email address"
                    />
                    <input
                      type="password"
                      defaultValue="demo-pass"
                      aria-label="Partner password"
                      className="w-full rounded-2xl border border-white/10 bg-[#120d1a] px-3.5 py-3 text-sm text-white placeholder:text-white/45 outline-none"
                      placeholder="Password"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => loginDemo('agent')}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#621063] to-[#e79e23] px-4 py-3 text-sm font-black text-white"
                  >
                    Continue to dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('choice')}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/75"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <div className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[linear-gradient(135deg,rgba(60,30,75,0.92),rgba(15,19,31,0.95),rgba(88,24,80,0.92))] p-6 shadow-[var(--shadow-soft)] lg:p-8">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#e79e23]">
              <ShieldCheck className="h-4 w-4" />
              Dedicated operations suite
            </div>

            <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-white lg:text-5xl">
              A unified real-estate and student housing command center.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 lg:text-base">
              Manage listings, bookings, compliance, property operations, hostel access, and partnership workflows from one modern workspace built for speed and trust.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/portals/agent"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#621063] to-[#e79e23] px-5 py-3 text-xs font-bold text-white shadow-xl transition hover:opacity-90"
              >
                Launch agent portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/10"
              >
                <Sparkles className="h-4 w-4" /> Manage subscriptions
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Verified partners', value: '520+' },
                { label: 'Active listings', value: '1,840' },
                { label: 'Uptime', value: '99.98%' },
              ].map((entry) => (
                <div key={entry.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">{entry.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{entry.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e79e23]">Support pulse</p>
                <h2 className="mt-1 text-lg font-black text-[var(--text-primary)]">Partner health</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                <CircleDashed className="h-3 w-3" /> online
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {supportItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] px-3 py-3">
                  <span className="text-xs text-[var(--text-secondary)]">{item.label}</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--smartassetz-border)] bg-gradient-to-br from-[#2b1031] to-[#171f2d] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <BadgeCheck className="h-4 w-4 text-[#e79e23]" /> Priority responses
              </div>
              <p className="mt-2 text-xs leading-5 text-white/70">
                Support tickets, lease processing, and verification updates are routed automatically to the right team.
              </p>
            </div>
          </aside>
        </section>

        <section className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)] lg:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e79e23]">Portal directory</p>
              <h2 className="mt-1 text-xl font-black text-[var(--text-primary)]">All access points</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] px-3 py-2 text-xs text-[var(--text-secondary)]">
              <Layers className="h-4 w-4" /> {filteredPortals.length} available
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(filteredPortals.length ? filteredPortals : Object.keys(CATEGORY_INFO) as PartnerCategory[]).map((catKey) => {
              const meta = CATEGORY_INFO[catKey];
              const Icon = ICONS[catKey];
              const accessGranted = hasAccess(catKey);

              return (
                <Link
                  key={catKey}
                  href={meta.route}
                  className="group rounded-[26px] border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] p-5 transition hover:-translate-y-1 hover:border-[#e79e23]/40"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 shadow-sm"
                      style={{ backgroundColor: `${meta.color}22` }}
                    >
                      <Icon className="h-6 w-6 text-[var(--text-primary)]" />
                    </div>
                    {accessGranted ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">
                        <Lock className="h-3 w-3" /> Locked
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#e79e23]">{meta.badge}</p>
                  <h3 className="mt-2 text-lg font-black text-[var(--text-primary)]">{meta.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{meta.description}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--smartassetz-border)] pt-4">
                    <span className="text-sm font-bold text-[#e79e23]">{meta.monthlyFee}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-primary)] group-hover:translate-x-1 transition-transform">
                      Enter portal <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">Hostel marketplace</p>
                <h2 className="mt-1 text-xl font-black text-[var(--text-primary)]">Student living made seamless</h2>
              </div>
              <Link href="/portals/student" className="text-sm font-bold text-[#e79e23]">Open student portal</Link>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                { name: 'Malete Residence', price: '₦240k / session', status: 'Verified', rating: '4.8' },
                { name: 'Skyline Hostels', price: '₦310k / session', status: 'Fast move-in', rating: '4.9' },
                { name: 'Oak Terrace Suite', price: '₦275k / session', status: 'Shared rooms', rating: '4.7' },
                { name: 'Campus Star Villa', price: '₦290k / session', status: 'Gender-safe', rating: '4.8' },
              ].map((hostel) => (
                <div key={hostel.name} className="rounded-[24px] border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#e79e23]">{hostel.status}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" /> {hostel.rating}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-[var(--text-primary)]">{hostel.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <MapPin className="h-3.5 w-3.5" /> Near campus, secure access
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-white">{hostel.price}</span>
                    <button type="button" className="rounded-full bg-[#e79e23] px-3 py-1.5 text-[10px] font-bold text-slate-950">
                      Book now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">In-app chat</p>
                <h2 className="mt-1 text-lg font-black text-[var(--text-primary)]">Live team messages</h2>
              </div>
              <MessageSquareText className="h-5 w-5 text-[#e79e23]" />
            </div>

            <div className="mt-4 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.time} className="rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{message.from}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">{message.time}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">{message.text}</p>
                </div>
              ))}
            </div>

            <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#621063] to-[#e79e23] px-4 py-3 text-xs font-bold text-white">
              Start new conversation <CircleArrowUp className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">Activity</p>
                <h2 className="mt-1 text-xl font-black text-[var(--text-primary)]">Recent operations</h2>
              </div>
              <NotebookText className="h-5 w-5 text-[#e79e23]" />
            </div>

            <div className="mt-5 space-y-3">
              {activityFeed.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] p-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#e79e23]" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">Need help?</p>
                <h2 className="mt-1 text-xl font-black text-[var(--text-primary)]">Support center</h2>
              </div>
              <Wifi className="h-5 w-5 text-[#e79e23]" />
            </div>

            <div className="mt-5 space-y-3">
              {[
                'How do I verify a property listing?',
                'Can I set up hostel payments for students?',
                'What happens during landlord onboarding?',
              ].map((faq) => (
                <div key={faq} className="flex items-center justify-between rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text-secondary)]">
                  <span>{faq}</span>
                  <ArrowRight className="h-4 w-4 text-[#e79e23]" />
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">
                FAQs
              </button>
              <button type="button" className="rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">
                Contact support
              </button>
              <button type="button" className="rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">
                Feedback
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
