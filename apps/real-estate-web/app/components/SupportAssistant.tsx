'use client';

import { useState } from 'react';
import Link from 'next/link';

const answers: Array<{ keywords: string[]; answer: string }> = [
  { keywords: ['upload', 'property', 'listing'], answer: 'Verified sellers and agents can open Dashboard, complete the listing form, select at least five device images, optionally add videos, and submit for admin publication.' },
  { keywords: ['kyc', 'nin', 'verification', 'face'], answer: 'Agents and sellers need an 11-digit NIN and a selfie. The server checks both with the configured identity provider before account approval.' },
  { keywords: ['password', 'forgot', 'reset'], answer: 'Use Forgot password on the login page. We send a secure reset link to the registered email.' },
  { keywords: ['booking', 'inspection'], answer: 'Open a LIVE property or hostel card, review the details, and submit the inspection request from its dedicated page.' },
  { keywords: ['support', 'complaint', 'admin'], answer: 'Describe the issue here and use Contact support. Your request is saved for the admin support team.' },
];

export default function SupportAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hello. I can help with onboarding, verification, listings, bookings, and password reset.' }]);

  function ask(event: React.FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    const match = answers.find((item) => item.keywords.some((keyword) => question.toLowerCase().includes(keyword)));
    setMessages((current) => [...current, { from: 'user', text: question }, { from: 'bot', text: match?.answer || 'I can help with onboarding, KYC, listings, bookings, and password reset. For anything else, contact the admin support team.' }]);
    setInput('');
  }

  return (
    <>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Open support assistant" className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#4e235f] text-white shadow-xl shadow-[#4e235f]/30 sm:bottom-5 sm:right-5">?</button>
      {open && <section className="fixed bottom-40 right-4 z-40 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] shadow-2xl sm:bottom-20 sm:right-5" aria-label="Support assistant">
        <div className="bg-[#4e235f] p-4 text-white"><p className="font-bold">AY&apos;SMART assistant</p><p className="text-xs text-white/75">Free onboarding and support help</p></div>
        <div className="max-h-64 space-y-2 overflow-y-auto p-3 text-sm">{messages.map((message, index) => <p key={`${message.from}-${index}`} className={`rounded-xl p-2 ${message.from === 'user' ? 'ml-8 bg-[#f1b8a5]/30 text-[var(--text-primary)]' : 'mr-4 bg-[var(--brand-surface-3)] text-[var(--text-primary)]'}`}>{message.text}</p>)}</div>
        <form onSubmit={ask} className="flex gap-2 border-t border-[var(--brand-border)] p-3"><input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="Ask a question" /><button type="submit" className="rounded-xl bg-[#4e235f] px-3 py-2 text-xs font-bold text-white">Send</button></form>
        <Link href="/support" className="px-3 pb-3 text-xs font-semibold text-[#4e235f]">Contact support for a human response</Link>
      </section>}
    </>
  );
}
