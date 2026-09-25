'use client';

import React, { useState } from 'react';
import PortalShell from '../../components/PortalShell';
import {
  Building2,
  Users,
  Calendar,
  Wallet,
  Plus,
  Eye,
  ArrowUpRight,
  Filter,
  CheckCircle,
  Clock,
  PhoneCall
} from 'lucide-react';

export default function AgentPortalPage() {
  const [listings] = useState([
    { id: 1, title: 'Luxury 4-Bedroom Semi-Detached Duplex', location: 'Lekki Phase 1, Lagos', price: '₦185,000,000', status: 'Active', views: 420, inquiries: 14 },
    { id: 2, title: 'Commercial Office Plaza, 3 Floors', location: 'Victoria Island, Lagos', price: '₦450,000,000', status: 'Active', views: 980, inquiries: 31 },
    { id: 3, title: 'Prime 2 Plots of Landed Property', location: 'Epe Expressway, Lagos', price: '₦35,000,000', status: 'Pending Inspection', views: 210, inquiries: 8 },
    { id: 4, title: 'Executive 3-Bedroom Flat', location: 'Ikeja GRA, Lagos', price: '₦95,000,000', status: 'Sold', views: 1450, inquiries: 49 },
  ]);

  return (
    <PortalShell currentCategory="agent">
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Active Listings</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">42</span>
              <span className="text-xs text-emerald-400 font-semibold">+4 this month</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Client Leads</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">102</span>
              <span className="text-xs text-emerald-400 font-semibold">+18 new</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Inspections Scheduled</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">14</span>
              <span className="text-xs text-[#e79e23] font-semibold">3 today</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Commission Earned</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-emerald-400">₦8,450,000</span>
            </div>
          </div>
        </div>

        {/* Listings Management Table */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">My Managed Listings</h3>
              <p className="text-xs text-white/60 mt-0.5">Properties linked to your agent commission code</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#621063] to-[#e79e23] text-xs font-bold text-white hover:opacity-90 shadow-md transition">
              <Plus className="h-4 w-4" /> Create New Listing
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Inquiries</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 text-white font-bold max-w-xs truncate">{item.title}</td>
                    <td className="py-4 text-white/60">{item.location}</td>
                    <td className="py-4 font-bold text-[#e79e23]">{item.price}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4">{item.inquiries} leads</td>
                    <td className="py-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs transition">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Urgent Buyer Inquiries</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { client: 'Dr. Chidi Okafor', property: 'Luxury 4-Bedroom Semi-Detached Duplex', time: '10 mins ago', phone: '+234 803 111 2233' },
              { client: 'Alhaji Musa Ibrahim', property: 'Commercial Office Plaza', time: '45 mins ago', phone: '+234 802 444 5566' },
            ].map((lead, i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-sm">{lead.client}</h5>
                  <p className="text-xs text-white/60 truncate max-w-xs">{lead.property}</p>
                  <span className="text-[10px] text-[#e79e23] font-semibold flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {lead.time}
                  </span>
                </div>
                <a
                  href={`tel:${lead.phone}`}
                  className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition flex items-center justify-center"
                >
                  <PhoneCall className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
