'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPlanCashback, getStoredListings, getStoredProfile, saveStoredListings, type ListingDraft, type ListingPlan } from '../lib/app-state';

export default function DashboardPage() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [listings, setListings] = useState<ListingDraft[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Property');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [plan, setPlan] = useState<ListingPlan>('basic');
  const [durationDays, setDurationDays] = useState(30);

  useEffect(() => {
    setProfile(getStoredProfile());
    setListings(getStoredListings());
  }, []);

  function handleCreateListing(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.isKycVerified) {
      alert('Please complete KYC before publishing listings.');
      return;
    }
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
    const nextListings = [listing, ...listings];
    setListings(nextListings);
    saveStoredListings(nextListings);
    setTitle('');
    setCategory('Property');
    setLocation('');
    setPrice('');
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Seller dashboard</p>
              <h1 className="mt-2 text-3xl font-black">Welcome back, {profile.name || 'verified seller'}</h1>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm">
              <p>Wallet balance: ₦{profile.walletBalance.toLocaleString()}</p>
              <p>Listings: {profile.listingsCount}</p>
              <p>KYC: {profile.isKycVerified ? 'Verified' : 'Pending'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Register</Link>
            <Link href="/kyc" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">KYC</Link>
            <Link href="/plans" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Plans</Link>
            <Link href="/hostel" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Hostel</Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleCreateListing} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-black">Create a listing</h2>
            <p className="mt-2 text-sm text-zinc-400">All uploads stay pending until admin verifies them before appearing on the home screen.</p>
            <div className="mt-4 grid gap-4">
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Listing title" />
              <input required value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Location" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                <option value="Property">Property</option>
                <option value="Automotive">Automotive</option>
                <option value="Hostel">Hostel</option>
              </select>
              <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Fixed listing price" />
              <select value={plan} onChange={(e) => setPlan(e.target.value as ListingPlan)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
              <select value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
              </select>
              <button className="rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950">Submit for review</button>
            </div>
          </form>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-black">Pending submissions</h2>
            <div className="mt-4 space-y-3">
              {listings.map((listing) => (
                <div key={listing.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{listing.title}</p>
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs text-amber-300">{listing.status}</span>
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
