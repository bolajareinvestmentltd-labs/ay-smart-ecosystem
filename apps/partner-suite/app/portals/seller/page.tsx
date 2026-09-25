'use client';

import React, { useState } from 'react';
import PortalShell from '../../components/PortalShell';
import {
  KeyRound,
  FileCheck2,
  DollarSign,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function SellerPortalPage() {
  return (
    <PortalShell currentCategory="seller">
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Listed Properties</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">4</span>
              <span className="text-xs text-emerald-400 font-semibold">2 Verified</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Inbound Buyer Offers</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">3</span>
              <span className="text-xs text-[#e79e23] font-semibold">1 Pending Review</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Valuation Requests</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">1</span>
              <span className="text-xs text-white/40">In Review</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Escrow Deal Volume</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-emerald-400">₦85,000,000</span>
            </div>
          </div>
        </div>

        {/* Upload & Title Verification Section */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 lg:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Sell Your Property Direct</h3>
              <p className="text-xs text-white/60 mt-0.5">Upload title documents (C of O, Governor&apos;s Consent) for instant smart escrow protection.</p>
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#911b70] text-xs font-bold text-white hover:opacity-90 shadow-lg transition">
              <Upload className="h-4 w-4" /> Submit New Property
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                <FileText className="h-4 w-4 text-[#ec4899]" />
                Certificate of Occupancy (C of O)
              </div>
              <p className="text-xs text-white/60">Verified by AY&apos;SMART legal title compliance team.</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-3 font-semibold">
                <CheckCircle className="h-3 w-3" /> Title Clean & Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                <FileText className="h-4 w-4 text-[#ec4899]" />
                Registered Survey Plan
              </div>
              <p className="text-xs text-white/60">Coordinates aligned with state beacon records.</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-3 font-semibold">
                <CheckCircle className="h-3 w-3" /> Beacon Matched
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                <FileText className="h-4 w-4 text-[#ec4899]" />
                Deed of Assignment
              </div>
              <p className="text-xs text-white/60">Under legal cross-examination by AY&apos;SMART Conveyancers.</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#e79e23] mt-3 font-semibold">
                <Clock className="h-3 w-3" /> In Verification
              </span>
            </div>
          </div>
        </div>

        {/* Active Buyer Offers */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Inbound Purchase Offers</h3>
          <div className="space-y-3">
            {[
              { property: 'Detached 5-Bedroom House in Osapa London', offer: '₦210,000,000', buyer: 'Heritage Capital Trust', deposit: '10% Escrow Funded', status: 'Pending Seller Decision' },
              { property: '3 Plots Commercial Land, Ilorin Express', offer: '₦55,000,000', buyer: 'Engr. T. Balogun', deposit: '100% Escrow Secured', status: 'Escrow Ready' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-white text-sm">{item.property}</h5>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                    <span className="text-white/60">Buyer: <strong className="text-white">{item.buyer}</strong></span>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-400 font-semibold">{item.deposit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-white/40 block">Offer Amount</span>
                    <strong className="text-base font-black text-[#e79e23]">{item.offer}</strong>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition">
                      Accept Offer
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition">
                      Counter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
