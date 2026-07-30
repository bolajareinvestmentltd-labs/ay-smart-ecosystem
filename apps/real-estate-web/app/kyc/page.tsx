'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/auth';
import { getStoredProfile, saveStoredProfile } from '../lib/app-state';

export default function KycPage() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const res = await authFetch('/api/auth/profile/');
      if (!res.ok) return;
      const payload = await res.json().catch(() => null);
      if (!payload) return;
      const nextProfile = { ...getStoredProfile(), name: payload.name || '', username: payload.username || '', email: payload.email || '', isKycVerified: payload.is_kyc_verified || false, adminApproved: payload.is_admin_approved || false };
      saveStoredProfile(nextProfile);
      setProfile(nextProfile);
    }

    loadProfile();
    setProfile(getStoredProfile());
  }, []);

  async function handleVerify() {
    setLoading(true);
    const res = await authFetch('/api/kyc/approve/', { method: 'POST' });
    if (!res.ok) {
      setMessage('Unable to approve KYC right now.');
      setLoading(false);
      return;
    }
    const payload = await res.json().catch(() => null);
    const nextProfile = { ...profile, isKycVerified: payload?.is_kyc_verified || true, adminApproved: payload?.is_admin_approved || true };
    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setMessage('KYC approved. Your dashboard is now unlocked.');
    setLoading(false);
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

        <button disabled={loading} onClick={handleVerify} className="mt-6 rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">{loading ? 'Approving...' : 'Approve KYC'}</button>
        {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Open dashboard</Link>
          <Link href="/plans" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">View listing plans</Link>
        </div>
      </div>
    </main>
  );
}
