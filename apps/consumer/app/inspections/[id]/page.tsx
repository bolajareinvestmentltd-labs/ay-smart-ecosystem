'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authFetch } from '../../lib/auth';

type Message = { id: number; sender_name: string; sender_role: string; text: string; created_at: string };
type Inspection = { id: number; listing_title?: string; status: string; agent_response: string; client_name: string; messages: Message[] };

export default function InspectionConversationPage() {
  const { id } = useParams();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const response = await authFetch(`/api/inspections/${id}/`);
    if (response.ok) setInspection(await response.json());
  }

  useEffect(() => { void load(); }, [id]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    const response = await authFetch(`/api/inspections/${id}/send_message/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    if (response.ok) { setText(''); setMessage('Message sent.'); await load(); } else setMessage('Unable to send message.');
  }

  async function confirmInspection() {
    const response = await authFetch(`/api/inspections/${id}/conclude/`, { method: 'POST' });
    if (response.ok) { setMessage('Inspection confirmation recorded.'); await load(); }
  }

  return <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-6 pb-32 text-[var(--text-primary)]"><div className="mx-auto max-w-3xl space-y-5"><Link href="/inbox" className="text-sm font-semibold text-[#4e235f]">Back to inbox</Link><header><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4e235f]">Inspection conversation</p><h1 className="mt-2 text-3xl font-black">{inspection?.listing_title || `Inspection #${id}`}</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Keep all inspection communication inside AY&apos;SMART.</p></header><section className="space-y-3 rounded-[1.5rem] border border-[var(--brand-border)] bg-white/80 p-4 sm:p-6"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-[#f9efe9] px-3 py-1">Status: {inspection?.status || 'Loading'}</span><span className="rounded-full bg-[#f9efe9] px-3 py-1">Agent: {inspection?.agent_response || 'Pending'}</span></div><div className="max-h-[55vh] space-y-3 overflow-y-auto">{inspection?.messages?.length ? inspection.messages.map((item) => <article key={item.id} className="rounded-xl border border-[var(--brand-border)] p-3"><div className="flex justify-between gap-2 text-xs font-semibold"><span>{item.sender_name} · {item.sender_role}</span><time className="text-[var(--text-muted)]">{new Date(item.created_at).toLocaleString()}</time></div><p className="mt-2 text-sm leading-6">{item.text}</p></article>) : <p className="py-8 text-center text-sm text-[var(--text-muted)]">No messages yet.</p>}</div><form onSubmit={send} className="flex flex-col gap-2 border-t border-[var(--brand-border)] pt-4 sm:flex-row"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message" className="min-w-0 flex-1 rounded-xl border border-[var(--brand-border)] px-4 py-3" /><button className="rounded-xl bg-[#4e235f] px-4 py-3 font-bold text-white">Send</button></form>{inspection && inspection.agent_response === 'ACCEPTED' && <button type="button" onClick={() => void confirmInspection()} className="w-full rounded-xl border border-[#4e235f] px-4 py-3 text-sm font-bold text-[#4e235f]">Confirm inspection completed</button>}{message && <p className="text-sm text-[var(--text-muted)]">{message}</p>}</section></div></main>;
}
