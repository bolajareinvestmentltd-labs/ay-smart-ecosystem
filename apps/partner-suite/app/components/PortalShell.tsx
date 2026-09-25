'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  usePartner,
  CATEGORY_INFO,
  type PartnerCategory,
} from '../lib/partner-context';
import {
  Building2,
  Users,
  KeyRound,
  TrendingUp,
  GraduationCap,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronDown,
  ArrowUpRight,
  Layers,
  Sparkles,
  Home,
  Search,
  SunMedium,
  MoonStar,
  Globe2,
  Bell,
  MessageSquareText,
  BriefcaseBusiness,
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

interface PortalShellProps {
  currentCategory: PartnerCategory;
  children: React.ReactNode;
}

const localeLabels = {
  en: 'English',
  fr: 'Français',
  yo: 'Yoruba',
  ha: 'Hausa',
};

export default function PortalShell({ currentCategory, children }: PortalShellProps) {
  const { user, hasAccess, subscribeCategory, theme, setTheme, language, setLanguage } = usePartner();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categoryMeta = CATEGORY_INFO[currentCategory];
  const Icon = ICONS[currentCategory];
  const accessGranted = hasAccess(currentCategory);

  return (
    <div className="min-h-screen bg-[var(--surface-bg)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--smartassetz-border)] bg-[rgba(11,14,21,0.84)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#621063] to-[#e79e23] text-lg font-black text-white shadow-lg">
                SA
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-[#e79e23]">Partner suite</span>
                <span className="-mt-0.5 block text-sm font-bold text-white">Smart Assetz</span>
              </div>
            </Link>

            <span className="hidden h-5 w-px bg-white/10 sm:inline-block" />

            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-[var(--smartassetz-border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)]"
              >
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: categoryMeta.color }} />
                <span>{categoryMeta.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-elevated)] p-2 shadow-[var(--shadow-soft)]">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Switch portal
                  </div>
                  {(Object.keys(CATEGORY_INFO) as PartnerCategory[]).map((catKey) => {
                    const info = CATEGORY_INFO[catKey];
                    const has = hasAccess(catKey);
                    const isCurrent = catKey === currentCategory;
                    const CatIcon = ICONS[catKey];

                    return (
                      <Link
                        key={catKey}
                        href={info.route}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                          isCurrent ? 'bg-white/10 text-white' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CatIcon className="h-4 w-4 opacity-70" />
                          <span>{info.name}</span>
                        </div>
                        {has ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                            <Lock className="h-2.5 w-2.5" /> Gated
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <label className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                aria-label="Search inside portal"
                placeholder="Search records, rooms or invoices..."
                className="w-full rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] py-2 pl-10 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] text-[var(--text-primary)]"
            >
              {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>

            <label className="hidden items-center gap-2 rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] px-2.5 py-2 text-xs font-semibold text-[var(--text-primary)] md:flex">
              <Globe2 className="h-4 w-4" />
              <select
                aria-label="Select portal language"
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

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-card)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] lg:inline-flex"
            >
              Consumer app <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-[30px] border border-[var(--smartassetz-border)] bg-[linear-gradient(135deg,#1d1128,#130b1d,#1f1329)] p-6 shadow-[var(--shadow-soft)] lg:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 shadow-lg" style={{ backgroundColor: `${categoryMeta.color}26` }}>
                <Icon className="h-7 w-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">
                    {categoryMeta.badge}
                  </span>
                  {accessGranted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active subscription
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                      <Lock className="h-3.5 w-3.5" /> Locked
                    </span>
                  )}
                </div>

                <h1 className="mt-1 text-2xl font-black text-white lg:text-3xl">{categoryMeta.name} portal</h1>
                <p className="mt-1 max-w-2xl text-xs leading-6 text-white/70 lg:text-sm">{categoryMeta.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold text-white">
                <Layers className="h-4 w-4 text-[#e79e23]" /> All portals
              </Link>

              {!accessGranted && (
                <button type="button" onClick={() => subscribeCategory(currentCategory)} className="rounded-xl bg-gradient-to-r from-[#621063] to-[#e79e23] px-4 py-2.5 text-[11px] font-bold text-white shadow-lg">
                  Activate plan
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
          <div>{!accessGranted ? (
            <div className="rounded-[30px] border border-dashed border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-12 text-center shadow-[var(--shadow-soft)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--smartassetz-border)] bg-[var(--surface-soft)]">
                <Lock className="h-8 w-8 text-[#e79e23]" />
              </div>
              <h3 className="mt-5 text-2xl font-black text-[var(--text-primary)]">Subscription access required</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
                Unlock the {categoryMeta.name.toLowerCase()} workspace to access dashboards, workflow tools, and support features built for real partner operations.
              </p>
              <div className="mt-5 mx-auto max-w-md rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] p-4 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--text-primary)]">Plan</span>
                  <span className="font-bold text-[#e79e23]">{categoryMeta.monthlyFee}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">Includes partner workspace, automated task routing, and live support with compliance reviews.</p>
              </div>
              <button type="button" onClick={() => subscribeCategory(currentCategory)} className="mt-6 w-full max-w-md rounded-2xl bg-gradient-to-r from-[#621063] to-[#e79e23] py-3 text-sm font-bold text-white">
                Unlock this portal
              </button>
            </div>
          ) : (
            children
          )}</div>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">Quick tools</p>
                  <h2 className="mt-1 text-lg font-black text-[var(--text-primary)]">Portal actions</h2>
                </div>
                <BriefcaseBusiness className="h-5 w-5 text-[#e79e23]" />
              </div>

              <div className="mt-5 space-y-3">
                {[
                  'Create listing',
                  'Schedule inspection',
                  'Collect payment',
                  'Send update',
                ].map((action) => (
                  <button key={action} type="button" className="flex w-full items-center justify-between rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] px-3 py-3 text-sm font-medium text-[var(--text-primary)]">
                    <span>{action}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#e79e23]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[var(--smartassetz-border)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e79e23]">Support</p>
                  <h2 className="mt-1 text-lg font-black text-[var(--text-primary)]">Live help</h2>
                </div>
                <MessageSquareText className="h-5 w-5 text-[#e79e23]" />
              </div>

              <div className="mt-4 rounded-2xl border border-[var(--smartassetz-border)] bg-[var(--surface-soft)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Ops desk</p>
                <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">Need a hand with onboarding?</p>
                <button type="button" className="mt-3 rounded-full bg-gradient-to-r from-[#621063] to-[#e79e23] px-3 py-2 text-[10px] font-bold text-white">
                  Start chat
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
