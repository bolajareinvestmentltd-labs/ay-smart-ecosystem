'use client';

import React from 'react';
import Link from 'next/link';
import {
  usePartner,
  CATEGORY_INFO,
  type PartnerCategory
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
  ArrowUpRight
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

export default function PartnerSuiteHubPage() {
  const { hasAccess } = usePartner();

  return (
    <div className="min-h-screen bg-[#0b0610] text-[#f4eff8] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#120a1c]/90 backdrop-blur-md px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#621063] to-[#e79e23] flex items-center justify-center font-black text-white text-xl shadow-lg">
            SA
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-[#e79e23] uppercase block">
              Multi-Tenant Hub
            </span>
            <span className="text-base font-bold tracking-tight text-white block -mt-0.5">
              Smart Assetz Partner Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
          >
            Consumer App <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-[#621063] to-[#e79e23] shadow-lg hover:opacity-90 transition"
          >
            <Sparkles className="h-3.5 w-3.5" /> Subscriptions & KYC
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#1f0e2d] via-[#140b1e] to-[#2b1031] p-8 lg:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#e79e23] uppercase tracking-wider mb-4">
              <ShieldCheck className="h-4 w-4" /> Dedicated Multi-Role Operational Suite
            </span>
            <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight">
              One Unified Workspace. <br />
              Dedicated Portals for Every Real Estate Partner.
            </h1>
            <p className="text-sm lg:text-base text-white/70 mt-3 leading-relaxed">
              Whether you are a certified broker, direct property seller, institutional landlord, real estate investor, resident tenant, or campus student — access your category-subscribed portal below.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                href="/portals/agent"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#621063] to-[#e79e23] text-xs font-bold text-white shadow-xl hover:opacity-90 transition flex items-center gap-2"
              >
                Launch Agent Portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/onboarding"
                className="px-6 py-3 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition flex items-center gap-2"
              >
                Category Subscriptions
              </Link>
            </div>
          </div>
        </div>

        {/* Portals Directory Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-white">Subscribed & Available Portals</h2>
              <p className="text-xs text-white/50 mt-0.5">Click to access your portal dashboard or activate category subscription</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(Object.keys(CATEGORY_INFO) as PartnerCategory[]).map((catKey) => {
              const meta = CATEGORY_INFO[catKey];
              const Icon = ICONS[catKey];
              const accessGranted = hasAccess(catKey);

              return (
                <Link
                  key={catKey}
                  href={meta.route}
                  className="group rounded-3xl border border-white/10 bg-[#160d21] p-6 hover:border-white/25 hover:bg-[#1b1029] transition shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 transition group-hover:scale-105"
                        style={{ backgroundColor: `${meta.color}25` }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      {accessGranted ? (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Subscribed
                        </span>
                      ) : (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 font-semibold flex items-center gap-1">
                          <Lock className="h-3.5 w-3.5" /> Subscription Required
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e79e23] block">
                      {meta.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-[#e79e23] transition">
                      {meta.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#e79e23]">{meta.monthlyFee}</span>
                    <span className="font-semibold text-white/80 flex items-center gap-1 group-hover:translate-x-1 transition">
                      Enter Portal <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Ecosystem High-Level Metrics */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 lg:p-8">
          <h3 className="text-base font-bold text-white mb-4">AY&apos;SMART Partner Ecosystem Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-white/40 block">Verified Partners</span>
              <strong className="text-2xl font-black text-white mt-1 block">520+</strong>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-white/40 block">Active Listings</span>
              <strong className="text-2xl font-black text-[#e79e23] mt-1 block">1,840</strong>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-white/40 block">Escrow Protected Volume</span>
              <strong className="text-2xl font-black text-emerald-400 mt-1 block">₦1.24B</strong>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-white/40 block">Backend Uptime</span>
              <strong className="text-2xl font-black text-white mt-1 block">99.98%</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
