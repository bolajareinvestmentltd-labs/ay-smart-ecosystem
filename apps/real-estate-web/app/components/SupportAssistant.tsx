'use client';

import { useState } from 'react';
import Link from 'next/link';

import { buildApiUrl } from '../lib/api';

type Message = { from: 'bot' | 'user'; text: string };

export default function SupportAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: 'Hello. I can help with onboarding, verification, listings, bookings, payments, and password reset.' }]);
  const [asking, setAsking] = useState(false);

  async function ask(event: React.FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    setMessages((current) => [...current, { from: 'user', text: question }]);
    setInput('');
    setAsking(true);
    try {
      const response = await fetch(buildApiUrl('/support/assistant/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          messages: messages.slice(-6).map((message) => ({ role: message.from === 'bot' ? 'assistant' : 'user', content: message.text })),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      const answer = response.ok ? payload.answer : 'The assistant is temporarily unavailable. Please use Contact support for a human response.';
      setMessages((current) => [...current, { from: 'bot', text: answer }]);
    } catch {
      setMessages((current) => [...current, { from: 'bot', text: 'The assistant is temporarily unavailable. Please use Contact support for a human response.' }]);
    } finally {
      setAsking(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Open support assistant" className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#4e235f] text-white shadow-xl shadow-[#4e235f]/30 sm:bottom-5 sm:right-5">?</button>
      {open && <section className="fixed bottom-40 right-4 z-40 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] shadow-2xl sm:bottom-20 sm:right-5" aria-label="Support assistant">
        <div className="bg-[#4e235f] p-4 text-white"><p className="font-bold">AY&apos;SMART assistant</p><p className="text-xs text-white/75">Free onboarding and support help</p></div>
        <div className="max-h-64 space-y-2 overflow-y-auto p-3 text-sm">{messages.map((message, index) => <p key={`${message.from}-${index}`} className={`rounded-xl p-2 ${message.from === 'user' ? 'ml-8 bg-[#f1b8a5]/30 text-[var(--text-primary)]' : 'mr-4 bg-[var(--brand-surface-3)] text-[var(--text-primary)]'}`}>{message.text}</p>)}</div>
        <form onSubmit={ask} className="flex gap-2 border-t border-[var(--brand-border)] p-3"><input value={input} onChange={(event) => setInput(event.target.value)} disabled={asking} className="min-w-0 flex-1 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="Ask a question" /><button type="submit" disabled={asking} className="rounded-xl bg-[#4e235f] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{asking ? '...' : 'Send'}</button></form>
        <Link href="/support" className="px-3 pb-3 text-xs font-semibold text-[#4e235f]">Contact support for a human response</Link>
      </section>}
    </>
  );
}
