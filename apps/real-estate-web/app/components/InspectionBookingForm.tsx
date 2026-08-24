'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';
import { authFetch } from '../lib/auth';
import Link from 'next/link';

type InspectionResult = {
  id?: number;
  status?: string;
  assigned_agent_username?: string;
  agent_contact?: string | null;
};

export default function InspectionBookingForm({ propertyId, listingId }: { propertyId?: number; listingId?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<InspectionResult | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [locationConsent, setLocationConsent] = useState(false);
  const [locationError, setLocationError] = useState('');

  React.useEffect(() => {
    getCurrentUser().then((user) => setAuthenticated(Boolean(user))).catch(() => setAuthenticated(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let location: { latitude: number; longitude: number; accuracy: number } | undefined;
      if (locationConsent) {
        if (!navigator.geolocation) {
          setLocationError('Location sharing is unavailable on this device.');
          setLoading(false);
          return;
        }
        location = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(
          (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: Math.round(position.coords.accuracy) }),
          () => reject(new Error('Location permission was not granted.')),
          { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 },
        ));
      }
      const res = await authFetch('/api/inspections/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(listingId ? { listing: listingId } : { property: propertyId }),
          client_name: name,
          client_phone: phone,
          preferred_date: preferredDate,
          status: 'PENDING',
          location_consent: Boolean(location),
          ...(location ? { inspection_latitude: location.latitude, inspection_longitude: location.longitude, inspection_location_accuracy: location.accuracy } : {}),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        setError(payload?.detail || 'Failed to create booking.');
        setLoading(false);
        return;
      }
      setSuccess(payload);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Network error while creating booking.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="font-semibold">Booking submitted</div>
        <div className="text-sm text-zinc-300">Status: {success.status}</div>
        {success.assigned_agent_username && (
          <div className="mt-2 text-sm text-zinc-200">Assigned agent: {success.assigned_agent_username}</div>
        )}
        {success.agent_contact ? (
          <div className="mt-1 text-sm text-zinc-200">Agent contact: {success.agent_contact}</div>
        ) : (
          success.assigned_agent_username && (
            <div className="mt-1 text-sm text-zinc-300">Agent contact will be shared after admin approval.</div>
          )
        )}
        {success.id && <Link href={`/inspections/${success.id}`} className="mt-3 inline-block text-sm font-semibold text-emerald-800">Open inspection conversation</Link>}
      </div>
    );
  }

  if (authenticated === false) {
    return (
      <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <p className="text-sm text-zinc-300">Sign in or create an account before requesting an inspection.</p>
        <button type="button" onClick={() => router.push(`/auth/login?next=${encodeURIComponent(pathname)}`)} className="w-full rounded-2xl bg-amber-500 px-4 py-2 font-semibold text-zinc-950">Sign in to book inspection</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div>
        <label className="block text-sm text-zinc-400">Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" required className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400">Preferred date</label>
        <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} required className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <label className="flex items-start gap-3 text-sm text-zinc-300">
        <input type="checkbox" checked={locationConsent} onChange={(e) => { setLocationConsent(e.target.checked); setLocationError(''); }} className="mt-1 h-4 w-4" />
        <span>I agree to share my current location once for inspection security. It is not tracked continuously.</span>
      </label>
      {locationError && <div className="text-sm text-rose-400">{locationError}</div>}
      {error && <div className="text-sm text-rose-400">{error}</div>}
      <div>
        <button disabled={loading} className="w-full rounded-2xl bg-amber-500 px-4 py-2 font-semibold text-zinc-950">{loading ? 'Submitting...' : 'Request inspection'}</button>
      </div>
    </form>
  );
}
