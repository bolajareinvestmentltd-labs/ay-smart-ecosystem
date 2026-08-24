'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/auth';

type Dashboard = {
  counts: Record<string, number>;
  inspections: Array<{ id: number; listing_title?: string; client_name: string; status: string; agent_response: string; client_confirmed: boolean; agent_confirmed: boolean }>;
  invoices: Array<{ id: number; invoice_number: string; description: string; amount: string | number; status: string }>;
  support: Array<{ id: number; subject: string; name: string; status: string; message: string }>;
  notifications: Array<{ id: number; title: string; message: string; is_read: boolean; created_at: string }>;
};

export default function AdminWorkspacePage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await authFetch('/api/admin/operations/');
    if (response.ok) setData(await response.json());
    else setMessage('Administrator access is required for this workspace.');
  }

  // Load the staff workspace once after the client session is available.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  async function approveInspection(id: number) {
    const response = await authFetch(`/api/inspections/${id}/approve/`, { method: 'POST' });
    setMessage(response.ok ? 'Inspection approved.' : (await response.json().catch(() => ({}))).detail || 'Both parties must confirm before approval.');
    if (response.ok) await load();
  }

  async function updateSupport(id: number, _status: string) {
    void _status;
    const response = await authFetch(`/api/support/requests/${id}/resolved/`, { method: 'POST' });
    setMessage(response.ok ? 'Support ticket updated.' : 'Unable to update support ticket.');
    if (response.ok) await load();
  }

  if (!data) return <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-10 text-[var(--text-primary)]"><div className="mx-auto max-w-6xl rounded-2xl bg-white/80 p-6">{message || 'Loading operations workspace...'}</div></main>;

  const cards = [['pending_inspections', 'Pending inspections'], ['issued_invoices', 'Issued invoices'], ['open_support', 'Open support tickets'], ['notifications', 'Unread notifications']];
  return <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-6 pb-32 text-[var(--text-primary)]"><div className="mx-auto max-w-6xl space-y-6"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4e235f]">Operations</p><h1 className="mt-2 text-3xl font-black">Admin workspace</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Review inspections, invoices, notifications, and support tickets.</p></div><Link href="/" className="rounded-xl border border-[var(--brand-border)] bg-white px-4 py-2 text-sm font-semibold">Open marketplace</Link></header><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map(([key, label]) => <div key={key} className="rounded-2xl border border-[var(--brand-border)] bg-white/80 p-4"><p className="text-2xl font-black">{data.counts[key]}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{label}</p></div>)}</div>{message && <p className="rounded-xl bg-[#fff8f4] p-3 text-sm text-[var(--text-muted)]">{message}</p>}<section className="grid gap-6 lg:grid-cols-2"><div className="space-y-3"><h2 className="text-xl font-black">Inspection queue</h2>{data.inspections.map((item) => <article key={item.id} className="rounded-2xl border border-[var(--brand-border)] bg-white/80 p-4"><div className="flex justify-between gap-3"><div><p className="font-bold">{item.listing_title || `Inspection #${item.id}`}</p><p className="text-sm text-[var(--text-muted)]">{item.client_name} · {item.status} · Agent {item.agent_response}</p></div><Link href={`/inspections/${item.id}`} className="text-sm font-semibold text-[#4e235f]">Chat</Link></div><p className="mt-2 text-xs text-[var(--text-muted)]">Client confirmed: {item.client_confirmed ? 'Yes' : 'No'} · Agent confirmed: {item.agent_confirmed ? 'Yes' : 'No'}</p>{item.client_confirmed && item.agent_confirmed && item.status !== 'COMPLETED' && <button type="button" onClick={() => void approveInspection(item.id)} className="mt-3 rounded-xl bg-[#4e235f] px-3 py-2 text-xs font-bold text-white">Approve inspection</button>}</article>)}</div><div className="space-y-3"><h2 className="text-xl font-black">Support queue</h2>{data.support.map((item) => <article key={item.id} className="rounded-2xl border border-[var(--brand-border)] bg-white/80 p-4"><p className="font-bold">{item.subject}</p><p className="mt-1 text-sm text-[var(--text-muted)]">{item.name} · {item.status}</p><p className="mt-2 text-sm">{item.message}</p>{item.status !== 'RESOLVED' && <button type="button" onClick={() => void updateSupport(item.id, 'RESOLVED')} className="mt-3 rounded-xl border border-[var(--brand-border)] px-3 py-2 text-xs font-semibold">Mark resolved</button>}</article>)}</div></section><section className="grid gap-6 lg:grid-cols-2"><div className="space-y-3"><h2 className="text-xl font-black">Invoices</h2>{data.invoices.map((item) => <article key={item.id} className="rounded-2xl border border-[var(--brand-border)] bg-white/80 p-4"><div className="flex justify-between gap-3"><div><p className="font-bold">{item.invoice_number}</p><p className="text-sm text-[var(--text-muted)]">{item.description}</p></div><span className="text-sm font-semibold">₦{Number(item.amount).toLocaleString()} · {item.status}</span></div></article>)}</div><div className="space-y-3"><h2 className="text-xl font-black">Recent notifications</h2>{data.notifications.map((item) => <article key={item.id} className={`rounded-2xl border p-4 ${item.is_read ? 'border-[var(--brand-border)] bg-white/70' : 'border-[#f1b8a5] bg-[#fff8f4]'}`}><p className="font-bold">{item.title}</p><p className="mt-1 text-sm text-[var(--text-muted)]">{item.message}</p></article>)}</div></section></div></main>;
}
