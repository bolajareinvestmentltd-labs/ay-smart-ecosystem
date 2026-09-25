'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { authFetch } from '../lib/auth';

type Notification = { id: number; title: string; message: string; link: string; is_read: boolean; created_at: string };

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const response = await authFetch('/api/notifications/');
    if (response.ok) {
      const payload = await response.json();
      setItems(Array.isArray(payload) ? payload : []);
    }
    setLoading(false);
  }

  // Fetch notifications once after the client session is available.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  async function markAllRead() {
    if ((await authFetch('/api/notifications/mark_all_read/', { method: 'POST' })).ok) setItems((current) => current.map((item) => ({ ...item, is_read: true })));
  }

  async function markRead(id: number) {
    if ((await authFetch(`/api/notifications/${id}/mark_read/`, { method: 'POST' })).ok) setItems((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));
  }

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 pb-32 text-[var(--text-primary)]">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div><p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#4e235f]">Notification center</p><h1 className="mt-2 text-3xl font-black">Updates</h1></div>
          <button type="button" onClick={() => void markAllRead()} className="inline-flex items-center gap-2 rounded-xl border border-[var(--brand-border)] bg-white px-3 py-2 text-sm font-semibold"><CheckCheck size={16} /> Mark all read</button>
        </header>
        {loading ? <p className="rounded-2xl bg-white/80 p-6 text-sm text-[var(--text-muted)]">Loading notifications...</p> : items.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white/70 p-10 text-center"><Bell className="mx-auto text-[#4e235f]" /><p className="mt-3 text-sm text-[var(--text-muted)]">You have no notifications yet.</p></div> : <div className="space-y-3">{items.map((item) => <div key={item.id} className={`rounded-2xl border p-4 ${item.is_read ? 'border-[var(--brand-border)] bg-white/70' : 'border-[#f1b8a5] bg-[#fff8f4]'}`}><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">{item.message}</p><p className="mt-2 text-xs text-[var(--text-muted)]">{new Date(item.created_at).toLocaleString()}</p></div>{!item.is_read && <span className="h-2.5 w-2.5 rounded-full bg-[#4e235f]" aria-label="Unread" />}</div><div className="mt-3 flex gap-2">{item.link && <Link href={item.link} onClick={() => void markRead(item.id)} className="rounded-xl bg-[#4e235f] px-3 py-2 text-xs font-bold text-white">Open</Link>}{!item.is_read && <button type="button" onClick={() => void markRead(item.id)} className="rounded-xl border border-[var(--brand-border)] px-3 py-2 text-xs font-semibold">Mark read</button>}</div></div>)}</div>}
      </div>
    </main>
  );
}
