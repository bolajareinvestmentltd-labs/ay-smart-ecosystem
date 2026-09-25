'use client';

import React, { useState } from 'react';
import PortalShell from '../../components/PortalShell';
import {
  Home,
  CreditCard,
  FileCheck,
  Wrench,
  CheckCircle2,
  Calendar,
  Download,
  Send
} from 'lucide-react';

export default function TenantPortalPage() {
  const [ticketDescription, setTicketDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTicketDescription('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <PortalShell currentCategory="tenant">
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Assigned Residence</span>
            <div className="mt-2">
              <span className="text-lg font-black text-white block">Apartment 4B</span>
              <span className="text-xs text-white/50">Harmony Court, Lekki</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Next Rent Due Date</span>
            <div className="mt-2">
              <span className="text-lg font-black text-[#e79e23] block">15 Oct 2027</span>
              <span className="text-xs text-emerald-400">Current Year Paid</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Rent Amount</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-white">₦3,500,000</span>
              <span className="text-xs text-white/40">/ year</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Active Tickets</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-amber-400">1</span>
              <span className="text-xs text-white/50">Water Pressure</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Pay Rent */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <CheckCircle2 className="h-4 w-4" /> Tenancy Agreement in Good Standing
              </div>
              <h3 className="text-lg font-bold text-white">Tenancy Contract & Rent Receipts</h3>
              <p className="text-xs text-white/60 mt-1">Download your digitally signed lease contract, payment confirmation receipts, and landlord notice copies.</p>
            </div>

            <div className="mt-6 space-y-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <span>Lease Agreement (2026 - 2027)</span>
                <button className="text-[#06b6d4] font-bold flex items-center gap-1 hover:underline">
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <span>Annual Rent Receipt #AY-9481</span>
                <button className="text-[#06b6d4] font-bold flex items-center gap-1 hover:underline">
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-xs font-bold text-white shadow-lg hover:opacity-90 transition">
              Make Advance Rent Payment
            </button>
          </div>

          {/* Maintenance Ticket Submission */}
          <div className="rounded-3xl border border-white/10 bg-[#160d21] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white">Report a Maintenance Issue</h3>
            <p className="text-xs text-white/60 mt-0.5">Tickets are instantly routed to your estate facility manager.</p>

            <form onSubmit={handleSubmitTicket} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Issue Category</label>
                <select className="w-full rounded-xl border border-white/10 bg-[#1e1428] px-3 py-2.5 text-xs text-white outline-none focus:border-[#06b6d4]">
                  <option>Plumbing & Water Leakage</option>
                  <option>Electrical / Generator / Inverter</option>
                  <option>AC / Air Conditioning</option>
                  <option>Carpentry / Doors / Locks</option>
                  <option>Painting & Structural</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Issue Description</label>
                <textarea
                  required
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Describe the issue in your unit..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-[#06b6d4]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition"
              >
                <Send className="h-3.5 w-3.5" /> Submit Maintenance Request
              </button>

              {submitted && (
                <p className="text-xs text-emerald-400 font-semibold text-center mt-2">
                  Ticket logged! Facility technician notified.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
