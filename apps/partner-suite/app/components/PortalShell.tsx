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

export default function PortalShell({ currentCategory, children }: PortalShellProps) {
  const { user, hasAccess, subscribeCategory } = usePartner();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categoryMeta = CATEGORY_INFO[currentCategory];
  const Icon = ICONS[currentCategory];
  const accessGranted = hasAccess(currentCategory);

  return (
    <div className="min-h-screen bg-[#0b0610] text-[#f4eff8] flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#120a1c]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#621063] to-[#e79e23] flex items-center justify-center font-black text-white text-lg shadow-lg group-hover:scale-105 transition">
              SA
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-[#e79e23] uppercase block">
                Partner Suite
              </span>
              <span className="text-sm font-bold tracking-tight text-white block -mt-0.5">
                Smart Assetz
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-block h-5 w-px bg-white/10" />

          {/* Portal Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold transition"
            >
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: categoryMeta.color }} />
              <span>{categoryMeta.name}</span>
              <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-white/15 bg-[#170e24] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Switch Subscribed Portal
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
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                        isCurrent
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CatIcon className="h-4 w-4 opacity-70" />
                        <span>{info.name}</span>
                      </div>
                      {has ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 flex items-center gap-1 font-semibold">
                          <Lock className="h-2.5 w-2.5" /> Gated
                        </span>
                      )}
                    </Link>
                  );
                })}
                <div className="mt-2 pt-2 border-t border-white/10">
                  <Link
                    href="/onboarding"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gradient-to-r from-[#621063] to-[#911b70] text-xs font-bold text-white hover:opacity-90 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#e79e23]" />
                    Manage Subscriptions
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-white/60 hover:text-white transition px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20"
          >
            Consumer App <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          {user && (
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 pl-3 pr-2 py-1 rounded-xl">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-white block">{user.name}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Partner
                </span>
              </div>
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center text-xs font-black text-white">
                {user.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {/* Navigation Breadcrumb / Portal Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#1b0e27] via-[#140b1e] to-[#25102a] p-6 lg:p-8 mb-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                style={{ backgroundColor: `${categoryMeta.color}22` }}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-[#e79e23]">
                    {categoryMeta.badge}
                  </span>
                  {accessGranted ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Subscription Active
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" /> Locked: Subscription Required
                    </span>
                  )}
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-white mt-1">
                  {categoryMeta.name} Portal
                </h1>
                <p className="text-xs lg:text-sm text-white/70 max-w-2xl mt-1">
                  {categoryMeta.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/onboarding"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 border border-white/10 text-white transition flex items-center gap-1.5"
              >
                <Layers className="h-4 w-4 text-[#e79e23]" /> All Portals
              </Link>
              {!accessGranted && (
                <button
                  type="button"
                  onClick={() => subscribeCategory(currentCategory)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#621063] to-[#e79e23] hover:opacity-90 text-white shadow-lg transition"
                >
                  Activate {categoryMeta.name}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Portal Body or Subscription Gate */}
        {!accessGranted ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-12 text-center max-w-xl mx-auto my-12">
            <div className="h-16 w-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-[#e79e23]" />
            </div>
            <h3 className="text-xl font-black text-white">Subscription Access Required</h3>
            <p className="text-sm text-white/60 mt-2">
              This dedicated portal is gated for registered and subscribed {categoryMeta.name} partners. Activate your plan below to unlock all tools, listings, and workflows.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-white">Monthly Subscription:</span>
                <span className="font-bold text-[#e79e23]">{categoryMeta.monthlyFee}</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Includes unlimited workspace access, direct backend synchronization, and priority verification.</p>
            </div>
            <button
              type="button"
              onClick={() => subscribeCategory(currentCategory)}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-[#621063] to-[#e79e23] text-sm font-bold text-white shadow-xl hover:opacity-90 transition"
            >
              Subscribe & Unlock Now
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
