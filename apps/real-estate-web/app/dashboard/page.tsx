'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/auth';
import { getPlanCashback, getStoredListings, getStoredProfile, saveStoredListings, type ListingDraft, type ListingPlan } from '../lib/app-state';

export default function DashboardPage() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [listings, setListings] = useState<ListingDraft[]>(() => getStoredListings());
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Property');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [plan, setPlan] = useState<ListingPlan>('basic');
  const [durationDays, setDurationDays] = useState(30);

  useEffect(() => {
    async function loadProfile() {
      const res = await authFetch('/api/auth/profile/');
      if (res.ok) {
        const payload = await res.json().catch(() => null);
        if (payload) {
          const nextProfile = {
            ...getStoredProfile(),
            name: payload.name || '',
            username: payload.username || '',
            email: payload.email || '',
            phone: payload.phone || '',
            location: payload.location || '',
            role: payload.role || 'seller',
            isKycVerified: Boolean(payload.is_kyc_verified),
            adminApproved: Boolean(payload.is_admin_approved),
          };
          saveStoredListings(getStoredListings());
          setProfile(nextProfile);
        }
      }
    }

    loadProfile();
  }, []);

  async function handleCreateListing(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.isKycVerified) {
      alert('Please complete KYC before publishing listings.');
      return;
    }
    setSubmitting(true);
    const res = await authFetch('/api/listings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, location, price, plan, duration_days: durationDays }),
    });

    const listing: ListingDraft = {
      id: Date.now(),
      title,
      category,
      location,
      price: Number(price),
      plan,
      durationDays,
      status: 'Pending Review',
      createdAt: new Date().toLocaleString(),
      cashback: getPlanCashback(plan, durationDays),
    };

    if (res.ok) {
      const payload = await res.json().catch(() => null);
      if (payload) {
        listing.id = payload.id;
        listing.status = payload.status === 'LIVE' ? 'Live' : 'Pending Review';
        listing.cashback = Number(payload.cashback || getPlanCashback(plan, durationDays));
      }
    }

    const nextListings = [listing, ...listings];
    setListings(nextListings);
    saveStoredListings(nextListings);
    setTitle('');
    setCategory('Property');
    setLocation('');
    setPrice('');
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Seller dashboard</p>
              <h1 className="mt-2 text-3xl font-black">Welcome back, {profile.name || 'verified seller'}</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09090B]/70 px-4 py-3 text-sm">
              <p>Wallet balance: ₦{profile.walletBalance.toLocaleString()}</p>
              <p>Listings: {profile.listingsCount}</p>
              <p>KYC: {profile.isKycVerified ? 'Verified' : 'Pending'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Register</Link>
            <Link href="/kyc" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">KYC</Link>
            <Link href="/plans" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Plans</Link>
            <Link href="/payments" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Payments</Link>
            <Link href="/refer" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Referral</Link>
            <Link href="/hostel" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Hostel</Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleCreateListing} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-black">Create a listing</h2>
            <p className="mt-2 text-sm text-zinc-400">All uploads stay pending until admin verifies them before appearing on the home screen.</p>
            <div className="mt-4 grid gap-4">
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Listing title" />
              <input required value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Location" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple">
                <option value="Property">Property</option>
                <option value="Automotive">Automotive</option>
                <option value="Hostel">Hostel</option>
              </select>
              <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Fixed listing price" />
              <select value={plan} onChange={(e) => setPlan(e.target.value as ListingPlan)} className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple">
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
              <select value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple">
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
              </select>
              <button disabled={submitting} className="rounded-2xl bg-brand-purple px-4 py-3 font-bold text-white transition hover:bg-brand-magenta disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Submitting...' : 'Submit for review'}</button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-black">Pending submissions</h2>
            <div className="mt-4 space-y-3">
              {listings.map((listing) => (
                <div key={listing.id} className="rounded-2xl border border-white/10 bg-[#09090B]/70 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{listing.title}</p>
                    <span className="rounded-full bg-brand-accent/20 px-2.5 py-1 text-xs text-brand-accent">{listing.status}</span>
                  </div>
                  <p className="mt-1 text-zinc-400">{listing.category} • {listing.location}</p>
                  <p className="mt-2 text-xs text-zinc-500">Plan: {listing.plan.toUpperCase()} • Cashback: ₦{listing.cashback.toLocaleString()}</p>
                </div>
              ))}
              {!listings.length && <p className="text-sm text-zinc-500">No submissions yet.</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
