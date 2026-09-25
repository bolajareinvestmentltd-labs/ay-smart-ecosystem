'use client';
import { useState } from 'react';
import { buildApiUrl } from '../lib/api';

const categories = [
  { value: 'complaint', label: 'Complaint' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'request', label: 'Service request' },
] as const;

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'inquiry' as (typeof categories)[number]['value'],
    subject: '',
    message: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const res = await fetch(buildApiUrl('/support/requests/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload?.detail || 'Unable to send request right now.');
        return;
      }
      setMessage('Your request was received. Our support team will follow up shortly.');
      setForm({ name: '', email: '', phone: '', category: 'inquiry', subject: '', message: '' });
    } catch {
      setError('Network error while submitting your request.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Support center</p>
        <h1 className="mt-2 text-3xl font-black">Send us a complaint, inquiry, or service request</h1>
        <p className="mt-2 text-sm text-zinc-400">Whether it is a payment issue, listing problem, or general question, we want to hear from you.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Full name" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Email address" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Phone number" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as (typeof categories)[number]['value'] })} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
              {categories.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Subject" />
          <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Tell us what happened and how we can help" />
          <button disabled={submitting} className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Submitting...' : 'Send request'}</button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {message && <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-400">{message}</p>}
      </div>
    </main>
  );
}
