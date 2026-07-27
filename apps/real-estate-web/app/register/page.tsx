'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredProfile, saveStoredProfile } from '../lib/app-state';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'seller' | 'student' | 'both'>('seller');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getStoredProfile();
    setName(profile.name || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
    setRole(profile.role || 'seller');
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile = getStoredProfile();
    const nextProfile = {
      ...profile,
      name,
      email,
      phone,
      role,
      isRegistered: true,
      isKycVerified: profile.isKycVerified,
    };
    saveStoredProfile(nextProfile);
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Seller & Student Access</p>
        <h1 className="mt-2 text-3xl font-black">Register for AY&apos;SMART listings</h1>
        <p className="mt-2 text-sm text-zinc-400">Create your account, complete KYC, then unlock the dashboard for property and automotive uploads.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Full name" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Email address" />
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Phone number" />
          <select value={role} onChange={(e) => setRole(e.target.value as 'seller' | 'student' | 'both')} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <option value="seller">Property or vehicle seller</option>
            <option value="student">Student hostel applicant</option>
            <option value="both">Both</option>
          </select>
          <button className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950">Save profile</button>
        </form>

        {saved && <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-400">Profile saved. Continue to KYC verification to activate the dashboard.</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/kyc" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Go to KYC</Link>
          <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">View dashboard</Link>
        </div>
      </div>
    </main>
  );
}
