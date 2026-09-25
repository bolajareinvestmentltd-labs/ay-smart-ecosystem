'use client';

import React from 'react';
import PortalShell from '../../components/PortalShell';
import {
  Hotel,
  Calendar,
  DollarSign,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Key,
  ShieldAlert
} from 'lucide-react';

export default function ShortletHotelPortalPage() {
  return (
    <PortalShell currentCategory="shortlet-hotel">
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Available Suites</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">16</span>
              <span className="text-xs text-white/40">2 Locations</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Today's Occupancy</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-400">87.5%</span>
              <span className="text-xs text-white/40">14 Booked</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Avg Daily Rate (ADR)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-[#e79e23]">₦45,000</span>
              <span className="text-xs text-white/40">/ night</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Monthly Revenue</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-white">₦6,300,000</span>
            </div>
          </div>
        </div>

        {/* Live Reservation Calendar & Today's Check-ins */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 lg:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Guest Arrivals & Departures</h3>
              <p className="text-xs text-white/60 mt-0.5">Automated keycode delivery and guest ID verification</p>
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-xs font-bold text-white hover:opacity-90 shadow-md transition">
              Block Dates / Adjust Pricing
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Suite / Apartment</th>
                  <th className="pb-3">Guest Name</th>
                  <th className="pb-3">Stay Dates</th>
                  <th className="pb-3">Payout / Total</th>
                  <th className="pb-3">Turnover / Cleaning</th>
                  <th className="pb-3 text-right">Access Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {[
                  { room: 'Executive Suite 201', guest: 'Chief Kenneth Cole', dates: '21 Sep - 25 Sep (4 nights)', total: '₦180,000', clean: 'Clean & Ready', key: 'PIN: 9482' },
                  { room: 'Penthouse Apartment A', guest: 'Dr. (Mrs) Ngozi Obi', dates: '20 Sep - 28 Sep (8 nights)', total: '₦520,000', clean: 'Occupied', key: 'Smart Lock Active' },
                  { room: 'Studio 104', guest: 'Mr. David Adele', dates: '21 Sep - 22 Sep (1 night)', total: '₦40,000', clean: 'Housekeeping Needed', key: 'Expired' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-4 text-white font-bold">{row.room}</td>
                    <td className="py-4">{row.guest}</td>
                    <td className="py-4 text-white/60">{row.dates}</td>
                    <td className="py-4 font-bold text-[#e79e23]">{row.total}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        row.clean === 'Clean & Ready'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : row.clean === 'Occupied'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {row.clean}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-mono text-[11px] bg-white/5 px-2 py-1 rounded-md border border-white/10 text-white">
                        {row.key}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
