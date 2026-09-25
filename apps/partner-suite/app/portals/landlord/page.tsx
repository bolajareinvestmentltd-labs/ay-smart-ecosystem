'use client';

import React, { useState } from 'react';
import PortalShell from '../../components/PortalShell';
import {
  Building2,
  Users,
  CreditCard,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Plus
} from 'lucide-react';

export default function LandlordPortalPage() {
  return (
    <PortalShell currentCategory="landlord">
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Total Rental Units</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">28</span>
              <span className="text-xs text-white/40">3 Properties</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Occupancy Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-400">96.4%</span>
              <span className="text-xs text-white/40">1 Vacant</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Monthly Rent Collected</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-[#e79e23]">₦14,200,000</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Maintenance Tickets</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-400">2</span>
              <span className="text-xs text-white/40">In Progress</span>
            </div>
          </div>
        </div>

        {/* Tenant Roster */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Tenants & Unit Status</h3>
              <p className="text-xs text-white/60 mt-0.5">Automated rent renewal alerts and direct lease agreements</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#eab308] to-[#ca8a04] text-xs font-black text-zinc-950 hover:opacity-90 shadow-lg transition">
              <Plus className="h-4 w-4" /> Add Unit
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Unit</th>
                  <th className="pb-3">Tenant Name</th>
                  <th className="pb-3">Annual Rent</th>
                  <th className="pb-3">Lease Expiration</th>
                  <th className="pb-3">Payment Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {[
                  { unit: 'Apartment 4B, Harmony Court', tenant: 'Mrs. Folashade Adeleke', rent: '₦3,500,000 / yr', expiry: '15 Oct 2027', status: 'Paid in Full' },
                  { unit: 'Flat 2A, Royal Crest Villa', tenant: 'Kareem Olatunji', rent: '₦2,800,000 / yr', expiry: '30 Nov 2026', status: 'Renewal Due' },
                  { unit: 'Penthouse 7, Horizon Tower', tenant: 'Zenith Oil Services Ltd', rent: '₦9,000,000 / yr', expiry: '12 Jan 2028', status: 'Paid in Full' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-4 text-white font-bold">{row.unit}</td>
                    <td className="py-4">{row.tenant}</td>
                    <td className="py-4 text-[#e79e23] font-bold">{row.rent}</td>
                    <td className="py-4 text-white/60">{row.expiry}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        row.status === 'Paid in Full'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs transition">
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Dispatch */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Maintenance Requests</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-start gap-3">
              <Wrench className="h-5 w-5 text-[#e79e23] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-sm">Water Pressure Booster Pump Repair</h5>
                <p className="text-xs text-white/60 mt-0.5">Harmony Court, Unit 4B • Reported by Mrs. Adeleke</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md font-semibold">Technician Dispatched</span>
                  <span className="text-[10px] text-white/40">Est. ₦45,000</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-start gap-3">
              <Wrench className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-sm">Pre-Occupancy Painting & Deep Clean</h5>
                <p className="text-xs text-white/60 mt-0.5">Royal Crest Villa, Unit 1C • Move-in scheduled for Oct 1</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-semibold">Completed</span>
                  <span className="text-[10px] text-white/40">Invoice #4829</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
