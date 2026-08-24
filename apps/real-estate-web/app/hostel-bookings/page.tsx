'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authFetch, getCurrentUser } from '../lib/auth';

type Booking = { id: number; listing: number; listing_title: string; student_name: string; check_in_date: string; total_amount: string | number; status: string; admin_approved: boolean };

const statuses = ['PENDING', 'PAID', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

export default function HostelBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await authFetch('/api/hostel-bookings/');
    if (response.ok) { const payload = await response.json(); setBookings(Array.isArray(payload) ? payload : []); }
    setLoading(false);
  }

  useEffect(() => {
    getCurrentUser().then((user) => setStaff(Boolean(user?.is_staff))).catch(() => undefined);
    void load();
  }, []);

  async function cancel(id: number) {
    const response = await authFetch(`/api/hostel-bookings/${id}/cancel/`, { method: 'POST' });
    setMessage(response.ok ? 'Booking cancelled.' : (await response.json().catch(() => ({}))).detail || 'Unable to cancel booking.');
    if (response.ok) await load();
  }

  async function transition(id: number, status: string) {
    const response = await authFetch(`/api/hostel-bookings/${id}/transition/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setMessage(response.ok ? `Booking marked ${status}.` : 'Unable to update booking.');
    if (response.ok) await load();
  }

  return <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 pb-32 text-[var(--text-primary)]"><div className="mx-auto max-w-4xl space-y-6"><header><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4e235f]">Hostel bookings</p><h1 className="mt-2 text-3xl font-black">Booking lifecycle</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Track payment, confirmation, active stay, and completion status in one place.</p></header>{message && <p className="rounded-xl bg-[#fff8f4] p-3 text-sm text-[var(--text-muted)]">{message}</p>}{loading ? <p className="rounded-2xl bg-white/80 p-6 text-sm text-[var(--text-muted)]">Loading bookings...</p> : bookings.length === 0 ? <p className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white/70 p-8 text-center text-sm text-[var(--text-muted)]">No hostel bookings yet.</p> : <div className="space-y-3">{bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-[var(--brand-border)] bg-white/80 p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/hostel/${booking.listing}`} className="font-bold text-[#4e235f]">{booking.listing_title}</Link><p className="mt-1 text-sm text-[var(--text-muted)]">Check-in: {new Date(booking.check_in_date).toLocaleDateString()} · ₦{Number(booking.total_amount).toLocaleString()}</p></div><span className="rounded-full bg-[#f9efe9] px-3 py-1 text-xs font-bold text-[#4e235f]">{booking.status}</span></div><div className="mt-4 flex flex-wrap gap-2">{!staff && !['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(booking.status) && <button type="button" onClick={() => void cancel(booking.id)} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">Cancel booking</button>}{staff && statuses.filter((status) => status !== booking.status).map((status) => <button key={status} type="button" onClick={() => void transition(booking.id, status)} className="rounded-xl border border-[var(--brand-border)] px-3 py-2 text-xs font-semibold">Mark {status.toLowerCase()}</button>)}</div></article>)}</div>}</div></main>;
}
