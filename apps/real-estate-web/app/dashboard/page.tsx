'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBackendListings, getBackendProfile, getBackendWallet, createBackendListing, type BackendListing } from '../lib/backend';
import { getStoredProfile, saveStoredProfile, type ListingPlan } from '../lib/app-state';
import { authFetch } from '../lib/auth';

type Inspection = { id: number; status: string; agent_response: string; client_name: string; listing?: number; listing_title?: string };

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(getStoredProfile());
  const [listings, setListings] = useState<BackendListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Residential House');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [facilities, setFacilities] = useState('');
  const [plan, setPlan] = useState<ListingPlan>('basic');
  const [durationDays, setDurationDays] = useState(30);
  const [durationUnit, setDurationUnit] = useState('month');
  const [mapUrl, setMapUrl] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [invoiceAmounts, setInvoiceAmounts] = useState<Record<number, string>>({});
  const [invoiceMessage, setInvoiceMessage] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      const [payload, listingPayload, walletPayload] = await Promise.all([
        getBackendProfile(),
        getBackendListings(),
        getBackendWallet(),
      ]);

      if (!payload) {
        router.replace('/auth/login');
        return;
      }

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
        walletBalance: Number(walletPayload?.balance || 0),
        listingsCount: listingPayload?.length || 0,
      };
      setListings(listingPayload || []);
      const inspectionResponse = await authFetch('/api/inspections/');
      if (inspectionResponse.ok) {
        const inspectionPayload = await inspectionResponse.json();
        setInspections(Array.isArray(inspectionPayload) ? inspectionPayload : []);
      }
      saveStoredProfile({ ...getStoredProfile(), ...nextProfile });
      setProfile(nextProfile);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleCreateListing(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.isKycVerified) {
      alert('Please complete KYC and wait for admin approval before submitting listings.');
      return;
    }
    if (!profile.adminApproved) {
      alert('Your account is awaiting admin approval.');
      return;
    }
    if (imageFiles.length < 5) {
      alert('Please upload at least 5 property images before submitting for review.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('facilities', JSON.stringify(facilities.split(',').map((item) => item.trim()).filter(Boolean)));
    formData.append('plan', plan);
    formData.append('duration_days', String(durationDays));
    formData.append('duration_unit', durationUnit);
    formData.append('map_url', mapUrl);
    imageFiles.forEach((file) => formData.append('images', file));
    videoFiles.forEach((file) => formData.append('videos', file));

    const listing = await createBackendListing(formData);
    if (!listing) {
      alert('Unable to submit listing. Please check your images and try again.');
      setSubmitting(false);
      return;
    }

    setListings((current) => [listing, ...current]);
    setTitle('');
    setCategory('Residential House');
    setLocation('');
    setPrice('');
    setDescription('');
    setFacilities('');
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFiles([]);
    setDurationUnit('month');
    setMapUrl('');
    setSubmitting(false);
  }

  async function issueInvoice(inspection: Inspection) {
    const amount = invoiceAmounts[inspection.id];
    if (!amount || Number(amount) <= 0) {
      setInvoiceMessage('Enter a valid invoice amount.');
      return;
    }
    const response = await authFetch('/api/invoices/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspection: inspection.id, amount, description: `Inspection and booking invoice for ${inspection.listing_title || 'the inspected listing'}` }),
    });
    const payload = await response.json().catch(() => ({}));
    setInvoiceMessage(response.ok ? `Invoice ${payload.invoice_number} issued and emailed to the client.` : payload?.detail || 'Unable to issue invoice.');
  }

  async function respondToInspection(inspection: Inspection, decision: 'YES' | 'NO') {
    const response = await authFetch(`/api/inspections/${inspection.id}/respond/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    });
    if (response.ok) {
      const updated = await response.json();
      setInspections((current) => current.map((item) => item.id === inspection.id ? updated : item));
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 text-[var(--text-primary)]">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="rounded-3xl border border-[var(--brand-border)] bg-white/80 p-10 text-center shadow-[0_18px_48px_rgba(46,17,54,0.08)]">
            <p className="text-sm text-[var(--text-muted)]">Checking your account...</p>
          </div>
        </div>
      </main>
    );
  }

  const canManageListings = ['seller', 'agent', 'both'].includes(profile.role);

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-[var(--brand-border)] bg-white/80 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.08)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4e235f]">Seller dashboard</p>
              <h1 className="mt-2 text-3xl font-black">Welcome back, {profile.name || 'verified seller'}</h1>
            </div>
            <div className="rounded-2xl border border-[var(--brand-border)] bg-[#f9efe9] px-4 py-3 text-sm">
              <p>Wallet balance: ₦{profile.walletBalance.toLocaleString()}</p>
              <p>Listings: {profile.listingsCount}</p>
              <p>KYC: {profile.isKycVerified ? 'Verified' : 'Pending'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-sm transition hover:border-[#f1b8a5] hover:text-[#4e235f]">Register</Link>
            <Link href="/kyc" className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-sm transition hover:border-[#f1b8a5] hover:text-[#4e235f]">KYC</Link>
            <Link href="/plans" className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-sm transition hover:border-[#f1b8a5] hover:text-[#4e235f]">Plans</Link>
            <Link href="/payments" className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-sm transition hover:border-[#f1b8a5] hover:text-[#4e235f]">Payments</Link>
            <Link href="/refer" className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-sm transition hover:border-[#f1b8a5] hover:text-[#4e235f]">Referral</Link>
            <Link href="/hostel" className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-sm transition hover:border-[#f1b8a5] hover:text-[#4e235f]">Hostel</Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {canManageListings ? <form onSubmit={handleCreateListing} className="rounded-[2rem] border border-[var(--brand-border)] bg-white/80 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.08)] backdrop-blur-xl">
            <h2 className="text-xl font-black">Create a listing</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">All uploads stay pending until admin verifies them before appearing on the home screen.</p>
            {!profile.isKycVerified && (
              <div className="rounded-3xl border border-[#f1b8a5]/50 bg-[#f9efe9] p-4 text-[#4e235f]">
                Complete KYC before submitting a listing. Click "Complete KYC" above to proceed.
              </div>
            )}
            <div className="mt-4 grid gap-4">
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]" placeholder="Listing title" />
              <input required value={location} onChange={(e) => setLocation(e.target.value)} autoComplete="street-address" className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]" placeholder="Location or full address" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-24 rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]" placeholder="Description" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]">
                <option value="Landed Property">Landed Property</option>
                <option value="Completed Building">Completed Building</option>
                <option value="Uncompleted Building">Uncompleted Building</option>
                <option value="Residential House">Residential House</option>
                <option value="Duplex">Duplex</option>
                <option value="Apartment">Apartment</option>
                <option value="Service Apartment">Service Apartment</option>
                <option value="Hostel">Hostel</option>
                <option value="Commercial Property">Commercial Property</option>
                <option value="Build from Scratch">Build from Scratch</option>
                <option value="Automotive">Automotive</option>
              </select>
              <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]" placeholder="Fixed listing price" />
              <input value={facilities} onChange={(e) => setFacilities(e.target.value)} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]" placeholder="Facilities, comma separated" />
              <select value={plan} onChange={(e) => setPlan(e.target.value as ListingPlan)} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]">
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
              <select value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]">
                <option value={365}>1 year</option>
                <option value={30}>30 days</option>
                <option value={7}>1 week</option>
                <option value={1}>1 day</option>
              </select>
              <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]">
                <option value="year">Price is per year</option>
                <option value="month">Price is per month</option>
                <option value="week">Price is per week</option>
                <option value="day">Price is per day</option>
              </select>
              <input type="url" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} className="rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]" placeholder="Google Maps URL (optional)" />

              <div className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-[#f9efe9] p-4">
                <label className="block text-sm font-medium text-[var(--text-primary)]">Property images (minimum 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const selected = Array.from(e.target.files || []);
                    setImageFiles(selected);
                    setImagePreviews(selected.map((file) => URL.createObjectURL(file)));
                  }}
                  className="mt-3 block w-full text-sm text-[var(--text-primary)] file:mr-4 file:rounded-full file:border-0 file:bg-[#4e235f] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-2 text-xs text-[var(--text-muted)]">Upload at least 5 clear photos. These items stay pending until the admin approves the listing.</p>
                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {imagePreviews.map((preview, index) => (
                      <img key={`${preview}-${index}`} src={preview} alt={`Preview ${index + 1}`} className="h-16 w-full rounded-xl object-cover" />
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-[#f9efe9] p-4">
                <label className="block text-sm font-medium text-[var(--text-primary)]">Property videos (optional, up to 5)</label>
                <input type="file" accept="video/mp4,video/webm,video/quicktime" multiple onChange={(e) => setVideoFiles(Array.from(e.target.files || []).slice(0, 5))} className="mt-3 block w-full text-sm text-[var(--text-primary)] file:mr-4 file:rounded-full file:border-0 file:bg-[#4e235f] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                <p className="mt-2 text-xs text-[var(--text-muted)]">Use short MP4, WebM, or MOV walkthrough videos. Videos are reviewed with the listing before publication.</p>
                {videoFiles.length > 0 && <p className="mt-2 text-xs font-semibold text-[var(--text-primary)]">{videoFiles.length} video(s) selected</p>}
              </div>

              <button disabled={submitting || !profile.isKycVerified} className="rounded-2xl bg-[#4e235f] px-4 py-3 font-bold text-white transition hover:bg-[#6b2d82] disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Submitting...' : profile.isKycVerified ? 'Submit for review' : 'Complete KYC first'}</button>
            </div>
          </form> : <section className="rounded-[2rem] border border-[var(--brand-border)] bg-white/80 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.08)] backdrop-blur-xl"><h2 className="text-xl font-black">Account workspace</h2><p className="mt-2 text-sm text-[var(--text-muted)]">Property and video uploads are available only to verified sellers and agents.</p><Link href="/kyc" className="mt-5 inline-flex rounded-2xl bg-[#4e235f] px-4 py-3 text-sm font-bold text-white">Complete verification</Link></section>}

          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white/80 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.08)] backdrop-blur-xl">
            <h2 className="text-xl font-black">Pending submissions</h2>
            <div className="mt-4 space-y-3">
              {listings.map((listing) => (
                <div key={listing.id} className="rounded-2xl border border-[var(--brand-border)] bg-[#f9efe9] p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{listing.title}</p>
                    <span className="rounded-full bg-[#f1b8a5]/40 px-2.5 py-1 text-xs text-[#4e235f]">{listing.status}</span>
                  </div>
                  <p className="mt-1 text-[var(--text-muted)]">{listing.category} • {listing.location}</p>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">Plan: {listing.plan.toUpperCase()} • Cashback: ₦{Number(listing.cashback).toLocaleString()}</p>
                </div>
              ))}
              {!listings.length && <p className="text-sm text-zinc-500">No submissions yet.</p>}
            </div>
          </div>
        </section>

        {['agent', 'both', 'seller'].includes(profile.role) && inspections.length > 0 && <section className="rounded-[2rem] border border-[var(--brand-border)] bg-white/80 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.08)] backdrop-blur-xl">
          <h2 className="text-xl font-black">Inspection requests</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Accepted inspections can receive an invoice. Client and agent communication stays in the app.</p>
          <div className="mt-4 space-y-3">
            {inspections.map((inspection) => <div key={inspection.id} className="rounded-2xl border border-[var(--brand-border)] bg-[#f9efe9] p-4">
              <p className="font-semibold">{inspection.listing_title || `Inspection #${inspection.id}`}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Client: {inspection.client_name} · {inspection.agent_response}</p>
              {inspection.agent_response === 'PENDING' && <div className="mt-3 flex gap-2"><button type="button" onClick={() => void respondToInspection(inspection, 'YES')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Accept</button><button type="button" onClick={() => void respondToInspection(inspection, 'NO')} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">Decline</button></div>}
              {inspection.agent_response === 'ACCEPTED' && <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input type="number" min="1" value={invoiceAmounts[inspection.id] || ''} onChange={(event) => setInvoiceAmounts((current) => ({ ...current, [inspection.id]: event.target.value }))} placeholder="Invoice amount" className="min-w-0 flex-1 rounded-xl border border-[var(--brand-border)] bg-white px-3 py-2" /><button type="button" onClick={() => void issueInvoice(inspection)} className="rounded-xl bg-[#4e235f] px-4 py-2 text-sm font-bold text-white">Issue invoice</button></div>}
            </div>)}
          </div>
          {invoiceMessage && <p className="mt-3 text-sm text-[var(--text-muted)]">{invoiceMessage}</p>}
        </section>}
      </div>
    </main>
  );
}
