'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePartner, CATEGORY_INFO, type PartnerCategory } from '../lib/partner-context';
import {
  Users,
  KeyRound,
  Building2,
  TrendingUp,
  GraduationCap,
  Hotel,
  Home,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles
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

export default function OnboardingPage() {
  const router = useRouter();
  const { user, subscribeCategory, hasAccess } = usePartner();

  const [businessName, setBusinessName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedCats, setSelectedCats] = useState<PartnerCategory[]>(user?.subscribedCategories || ['agent']);
  const [idType, setIdType] = useState('NIN');
  const [idNumber, setIdNumber] = useState('');
  const [step, setStep] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleCategory = (cat: PartnerCategory) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter((c) => c !== cat));
      }
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    selectedCats.forEach((cat) => subscribeCategory(cat));
    setSavedSuccess(true);
    setTimeout(() => {
      router.push(CATEGORY_INFO[selectedCats[0]].route);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b0610] text-[#f4eff8] p-4 lg:p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#621063] to-[#e79e23] flex items-center justify-center font-black text-white text-sm">
              SA
            </div>
            <span className="text-sm font-black text-white tracking-wider">SMART ASSETZ PARTNER SUITE</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-black text-white">Partner Onboarding & Category Access</h1>
          <p className="text-sm text-white/60 mt-2 max-w-xl mx-auto">
            Choose your partner categories to unlock dedicated operational portals, manage property workflows, and synchronize directly with the Smart Assetz backend.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              step === 1
                ? 'bg-gradient-to-r from-[#621063] to-[#e79e23] text-white'
                : 'bg-white/5 text-white/50 hover:text-white'
            }`}
          >
            1. Select Portal Categories
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              step === 2
                ? 'bg-gradient-to-r from-[#621063] to-[#e79e23] text-white'
                : 'bg-white/5 text-white/50 hover:text-white'
            }`}
          >
            2. Business & Identity KYC
          </button>
        </div>

        <form onSubmit={handleFinish} className="rounded-3xl border border-white/10 bg-[#160d21] p-6 lg:p-8 shadow-2xl">
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Select Your Subscribed Portals</h3>
                <span className="text-xs text-[#e79e23] font-semibold">Multiple portals can be active simultaneously</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {(Object.keys(CATEGORY_INFO) as PartnerCategory[]).map((catKey) => {
                  const meta = CATEGORY_INFO[catKey];
                  const Icon = ICONS[catKey];
                  const isSelected = selectedCats.includes(catKey);

                  return (
                    <div
                      key={catKey}
                      onClick={() => toggleCategory(catKey)}
                      className={`cursor-pointer rounded-2xl border p-4 transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#e79e23] bg-[#e79e23]/10 shadow-lg shadow-[#e79e23]/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${meta.color}25` }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-[#e79e23]" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-white/20" />
                          )}
                        </div>
                        <h4 className="font-bold text-white text-sm">{meta.name}</h4>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">{meta.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px]">
                        <span className="text-white/40">Fee:</span>
                        <span className="font-bold text-[#e79e23]">{meta.monthlyFee}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#621063] to-[#e79e23] text-xs font-bold text-white flex items-center gap-2 hover:opacity-90 shadow-lg transition"
                >
                  Continue to KYC <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Partner Verification & Profile Details</h3>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Direct sync with Backend UserProfile
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Company / Legal Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Adeyemi Estates Ltd"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#e79e23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Official Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 813 000 0000"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#e79e23]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Identity Document Type</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1f142b] px-4 py-3 text-sm text-white outline-none focus:border-[#e79e23]"
                  >
                    <option value="NIN">National Identity Number (NIN)</option>
                    <option value="CAC">Corporate Affairs Commission (CAC Certificate)</option>
                    <option value="PASSPORT">International Passport</option>
                    <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
                    <option value="STUDENT_ID">Student ID Card (Matric)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Document Number</label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Document or Registration #"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#e79e23]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#621063] to-[#e79e23] text-xs font-bold text-white shadow-xl hover:opacity-90 transition flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Save & Launch Portals
                </button>
              </div>

              {savedSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Subscriptions saved! Redirecting to your active portal dashboard...
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
