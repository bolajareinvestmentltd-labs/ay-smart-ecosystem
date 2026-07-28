'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredProfile, saveStoredProfile, type ListingPlan, type UserRole } from '../lib/app-state';

const planOptions: Array<{ key: ListingPlan; label: string; price: string }> = [
  { key: 'basic', label: 'Basic', price: '₦3,500 / week' },
  { key: 'standard', label: 'Standard', price: '₦5,000 / week' },
  { key: 'premium', label: 'Premium', price: '₦7,500 / week' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState<UserRole>('seller');
  const [plan, setPlan] = useState<ListingPlan>('basic');
  const [plateNumber, setPlateNumber] = useState('');
  const [isAgent, setIsAgent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const profile = getStoredProfile();
    setName(profile.name || '');
    setUsername(profile.username || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
    setLocation(profile.location || '');
    setRole(profile.role || 'seller');
    setPlan(profile.subscriptionPlan || 'basic');
    setIsAgent(profile.role === 'agent');
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isAgent && !plateNumber) {
      setError('Agents must provide a vehicle plate number.');
      return;
    }

    if (isAgent && !location) {
      setError('Agents must provide a location for verification and service routing.');
      return;
    }

    const profile = getStoredProfile();
    const nextProfile = {
      ...profile,
      name,
      username: username || email.split('@')[0],
      email,
      phone,
      role,
      location,
      subscriptionPlan: isAgent ? plan : profile.subscriptionPlan,
      selectedPlan: isAgent ? plan : profile.selectedPlan,
      isRegistered: true,
      isKycVerified: false,
      adminApproved: false,
      freeListingsRemaining: isAgent ? 3 : profile.freeListingsRemaining,
      subscriptionStatus: 'none' as const,
      walletBalance: profile.walletBalance,
      listingsCount: profile.listingsCount,
      failedLoginAttempts: profile.failedLoginAttempts,
      referralCode: profile.referralCode || `AYS-${Date.now().toString().slice(-5)}`,
      referralRewards: profile.referralRewards,
      password,
      plateNumber: isAgent ? plateNumber : '',
    };

    saveStoredProfile(nextProfile);
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Account registration</p>
        <h1 className="mt-2 text-3xl font-black">Create your AY&apos;SMART account</h1>
        <p className="mt-2 text-sm text-zinc-400">Choose your role, complete your profile, and get ready for verification and listing management.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Full name" />
            <input required value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Username" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Email address" />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Active phone number" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Password" />
            <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Confirm password" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select value={role} onChange={(e) => { const value = e.target.value as UserRole; setRole(value); setIsAgent(value === 'agent'); }} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
              <option value="seller">Seller</option>
              <option value="student">Student</option>
              <option value="agent">Agent</option>
              <option value="both">Seller + Student</option>
            </select>
            <input required value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Location / Address" />
          </div>

          {isAgent && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <input required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Vehicle plate number" />
                <select value={plan} onChange={(e) => setPlan(e.target.value as ListingPlan)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                  {planOptions.map((option) => (
                    <option key={option.key} value={option.key}>{option.label} — {option.price}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-zinc-400">Agents receive 3 free listings for one week after admin approval. Paid subscription is required after the free quota expires.</p>
            </>
          )}

          <button className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950">Create account</button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {saved && <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-400">Account created. Proceed to KYC and wait for admin approval.</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/auth/login" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Already have an account?</Link>
          <Link href="/kyc" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Go to KYC</Link>
        </div>
      </div>
    </main>
  );
}
