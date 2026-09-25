'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { getPublishedListings, listingImage, type BackendListing } from '../../lib/backend';
import { authFetch, getCurrentUser } from '../../lib/auth';
import LoadingScreen from '../../components/LoadingScreen';

export default function ServiceApartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [listing, setListing] = useState<BackendListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(30);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPublishedListings().then((items) => setListing(items?.find((item) => item.id === id && item.category === 'Service Apartment') || null)).catch(() => setListing(null)).finally(() => setLoading(false));
  }, [id]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    const user = await getCurrentUser();
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent(`/service-apartments/${id}`)}`);
      setSubmitting(false);
      return;
    }
    const response = await authFetch('/api/service-apartment-bookings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing: id, tenant_name: name, tenant_phone: phone, check_in_date: date, duration_days: duration }),
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? 'Booking request submitted. The listing team will confirm availability in the app.' : payload?.detail || 'Unable to submit booking request.');
    setSubmitting(false);
  }

  if (loading) return <LoadingScreen label="Loading service apartment" />;
  if (!listing) return <main className="min-h-screen p-6 text-center"><p>Service apartment not found.</p><Link href="/properties" className="mt-4 inline-block font-semibold text-[#4e235f]">Browse listings</Link></main>;
  const image = listingImage(listing) || '/assets/ay-smart-logo.png';

  return <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-6 pb-32 text-[var(--text-primary)]"><div className="mx-auto max-w-4xl space-y-5"><Link href="/properties" className="text-sm font-semibold text-[#4e235f]">Back to listings</Link><div className="overflow-hidden rounded-[1.5rem] border border-[var(--brand-border)] bg-white/80"><img src={image} alt={listing.title} className="h-56 w-full object-cover sm:h-80" /><div className="space-y-3 p-5 sm:p-7"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4e235f]">Service apartment</p><h1 className="text-3xl font-black">{listing.title}</h1><p className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><MapPin size={15} /> {listing.location}</p><p className="text-2xl font-black text-[#4e235f]">₦{Number(listing.price).toLocaleString()} <span className="text-sm font-medium text-[var(--text-muted)]">per {listing.duration_unit || 'month'}</span></p><p className="leading-7 text-[var(--text-muted)]">{listing.description || 'Verified service apartment listing.'}</p>{listing.facilities?.length ? <div className="flex flex-wrap gap-2">{listing.facilities.map((facility) => <span key={facility} className="rounded-full bg-[#f9efe9] px-3 py-1 text-xs font-semibold text-[#4e235f]">{facility}</span>)}</div> : null}</div></div><form onSubmit={submit} className="space-y-4 rounded-[1.5rem] border border-[var(--brand-border)] bg-white/80 p-5 sm:p-7"><h2 className="text-xl font-black">Request this apartment</h2><p className="text-sm text-[var(--text-muted)]">Sign in is required. Booking details and payment remain inside AY&apos;SMART.</p><input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Full name" className="w-full rounded-xl border border-[var(--brand-border)] px-4 py-3" /><input required value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="Phone number" className="w-full rounded-xl border border-[var(--brand-border)] px-4 py-3" /><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Check-in date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--brand-border)] px-4 py-3" /></label><label className="text-sm font-semibold">Duration in days<input required min="1" type="number" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[var(--brand-border)] px-4 py-3" /></label></div><button disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4e235f] px-4 py-3 font-bold text-white disabled:opacity-60"><CalendarDays size={16} />{submitting ? 'Submitting...' : 'Request booking'}</button>{message && <p className="text-sm text-[var(--text-muted)]">{message}</p>}</form></div></main>;
}
