'use client';
import React, { useState } from 'react';
import { authFetch } from '../lib/auth';

export default function InspectionBookingForm({ propertyId }: { propertyId: number }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authFetch('/api/inspections/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: propertyId,
          client_name: name,
          client_phone: phone,
          preferred_date: preferredDate,
          status: 'PENDING',
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/auth/login';
          return;
        }
        setError(payload?.detail || 'Failed to create booking.');
        setLoading(false);
        return;
      }
      setSuccess(payload);
    } catch (err) {
      setError('Network error while creating booking.');
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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div>
        <label className="block text-sm text-zinc-400">Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-zinc-400">Preferred date</label>
        <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} required className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      {error && <div className="text-sm text-rose-400">{error}</div>}
      <div>
        <button disabled={loading} className="w-full rounded-2xl bg-amber-500 px-4 py-2 font-semibold text-zinc-950">{loading ? 'Submitting...' : 'Request inspection'}</button>
      </div>
    </form>
  );
}
