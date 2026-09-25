'use client';

import React from 'react';
import PortalShell from '../../components/PortalShell';
import {
  GraduationCap,
  Building,
  QrCode,
  Users,
  Bus,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function StudentPortalPage() {
  return (
    <PortalShell currentCategory="student">
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">University Campus</span>
            <div className="mt-2">
              <span className="text-base font-black text-white block truncate">Kwara State University</span>
              <span className="text-xs text-[#e79e23]">Malete Campus</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Hostel Room Allocation</span>
            <div className="mt-2">
              <span className="text-lg font-black text-white block">Block B, Room 14</span>
              <span className="text-xs text-white/50">Self-Con / Ensuite</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Academic Session</span>
            <div className="mt-2">
              <span className="text-xl font-black text-emerald-400 block">2026/2027</span>
              <span className="text-xs text-emerald-400/80">Semester Fee Paid</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#160d21] p-5">
            <span className="text-xs font-semibold text-white/60 block">Roommate Matching</span>
            <div className="mt-2">
              <span className="text-xl font-black text-white block">3 Matches</span>
              <span className="text-xs text-white/40">Verified Students</span>
            </div>
          </div>
        </div>

        {/* Digital Hostel Pass & Key */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1c112b] to-[#12081c] p-6 shadow-xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
              <QrCode className="h-6 w-6" />
            </div>
            <h4 className="text-base font-black text-white">Digital Hostel Gate Pass</h4>
            <p className="text-xs text-white/60 mt-1">Scan at the hostel security checkpoint for secure 24/7 entry.</p>

            <div className="mt-4 p-4 rounded-2xl bg-white p-3 shadow-inner">
              <div className="h-32 w-32 bg-zinc-900 rounded-xl flex items-center justify-center text-white text-[10px] font-mono text-center p-2">
                [SECURE QR GATE PASS - MATRIC 24/KWASU/9418]
              </div>
            </div>

            <span className="text-[11px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Identity & Matric Verified
            </span>
          </div>

          {/* Roommate Matching Board */}
          <div className="md:col-span-2 rounded-3xl border border-white/10 bg-[#160d21] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-black text-white">Verified Campus Roommate Matches</h4>
                <p className="text-xs text-white/60">Students seeking shared rooms in off-campus hostels.</p>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-white hover:bg-white/10">
                Update Preferences
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Oluwaseun Bakare', dept: 'Computer Science, 300L', budget: '₦250k / session', habits: 'Quiet, Study-focused, Non-smoker' },
                { name: 'Emmanuel Eze', dept: 'Electrical Engineering, 200L', budget: '₦200k / session', habits: 'Early riser, Neat, Tech enthusiast' },
              ].map((student, i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-white text-sm">{student.name}</h5>
                    <p className="text-xs text-[#e79e23]">{student.dept}</p>
                    <p className="text-xs text-white/50 mt-1">Traits: {student.habits}</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] text-xs font-bold text-white hover:opacity-90 transition">
                    Connect
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bus className="h-5 w-5 text-[#e79e23]" />
                <div>
                  <span className="text-xs font-bold text-white block">Hostel-to-Campus Shuttle Booking</span>
                  <span className="text-[11px] text-white/50">Daily morning & evening transit passes</span>
                </div>
              </div>
              <button className="text-xs font-bold text-[#e79e23] hover:underline">
                View Schedule →
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
