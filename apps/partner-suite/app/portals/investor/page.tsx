'use client';

import React from 'react';
import PortalShell from '../../components/PortalShell';
import {
  TrendingUp,
  PieChart,
  DollarSign,
  Building,
  ArrowUpRight,
  ShieldCheck,
  Percent,
  Download
} from 'lucide-react';

export default function InvestorPortalPage() {
  return (
    <PortalShell currentCategory="investor">
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Portfolio Valuation</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl lg:text-3xl font-black text-emerald-400">₦184,200,000</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Total Capital Deployed</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl lg:text-3xl font-black text-white">₦150,000,000</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Projected Annual Yield</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl lg:text-3xl font-black text-[#e79e23]">18.4%</span>
              <span className="text-xs text-emerald-400 font-semibold">+2.1% YoY</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Dividends Distributed</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl lg:text-3xl font-black text-white">₦21,600,000</span>
            </div>
          </div>
        </div>

        {/* Real Estate Syndication Opportunities */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 lg:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Vetted Asset Syndications</h3>
              <p className="text-xs text-white/60 mt-0.5">High-yield institutional co-investments backed by AY&apos;SMART legal asset covenants.</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition">
              <Download className="h-4 w-4 text-[#e79e23]" /> Download Investment Deck
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Open for Co-Investment
                  </span>
                  <h4 className="text-base font-black text-white mt-2">Malete Luxury Student Residence Towers</h4>
                  <p className="text-xs text-white/60 mt-1">120-bed premium off-campus hostel complex with solar grid and backup fiber.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div>
                  <span className="text-[10px] text-white/40 block">Target IRR</span>
                  <strong className="text-sm font-black text-emerald-400">22.5%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">Min. Unit</span>
                  <strong className="text-sm font-black text-white">₦2,500,000</strong>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">Funded</span>
                  <strong className="text-sm font-black text-[#e79e23]">78%</strong>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-xs font-bold text-white shadow-lg hover:opacity-90 transition">
                Participate in Syndication
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#e79e23] uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Quarterly Dividend Payout
                  </span>
                  <h4 className="text-base font-black text-white mt-2">Lekki Phase 1 Commercial Plaza</h4>
                  <p className="text-xs text-white/60 mt-1">Multi-tenant retail and banking facility with 100% blue-chip long leases.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div>
                  <span className="text-[10px] text-white/40 block">Rental Yield</span>
                  <strong className="text-sm font-black text-emerald-400">16.8%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">My Allocation</span>
                  <strong className="text-sm font-black text-white">₦50,000,000</strong>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">Payout Date</span>
                  <strong className="text-sm font-black text-[#e79e23]">30 Oct 2026</strong>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition">
                View Asset Financial Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
