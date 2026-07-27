'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredProfile, saveStoredProfile } from '../lib/app-state';

export default function KycPage() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [message, setMessage] = useState('');

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  function handleVerify() {
    const nextProfile = { ...profile, isKycVerified: true };
    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setMessage('KYC approved. Your dashboard is now unlocked.');
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">KYC verification</p>
        <h1 className="mt-2 text-3xl font-black">Verify your identity before listings go live</h1>
        <p className="mt-2 text-sm text-zinc-400">Only verified sellers can publish property or automotive listings. Admin review happens after upload.</p>

        <div className="mt-6 space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Verification status</span>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${profile.isKycVerified ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{profile.isKycVerified ? 'Verified' : 'Pending'}</span>
          </div>
          <div className="text-sm text-zinc-400">Name: {profile.name || 'Please register first'}</div>
          <div className="text-sm text-zinc-400">Email: {profile.email || 'Pending'}</div>
        </div>

        <button onClick={handleVerify} className="mt-6 rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950">Approve KYC locally</button>
        {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Open dashboard</Link>
          <Link href="/plans" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">View listing plans</Link>
        </div>
      </div>
    </main>
  );
}
