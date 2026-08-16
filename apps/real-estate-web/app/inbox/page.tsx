'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageSquareText, Send, Mail } from 'lucide-react';
import { authFetch } from '../lib/auth';

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  async function loadConversations() {
    const res = await authFetch('/api/conversations/');
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const payload = await res.json().catch(() => []);
    setConversations(Array.isArray(payload) ? payload : []);
    setLoading(false);
  }

  useEffect(() => {
    loadConversations();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setStatus('Please add both a subject and message.');
      return;
    }

    const res = await authFetch('/api/conversations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      setStatus(error?.detail || 'Unable to send this message.');
      return;
    }

    const payload = await res.json().catch(() => null);
    if (payload) setConversations((prev) => [payload, ...prev]);
    setSubject('');
    setMessage('');
    setStatus('Message sent successfully.');
    setTimeout(() => setStatus(''), 2200);
  }

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">Inbox</p>
            <h1 className="mt-2 text-3xl font-black">Messages & leads</h1>
          </div>
          <Link href="/properties" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            Browse listings
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 shadow-2xl">
          <div className="mb-4 flex items-center gap-2 text-brand-accent">
            <Mail size={16} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">New message</span>
          </div>
          <div className="grid gap-3">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-sm text-white outline-none transition focus:border-brand-purple"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Tell us what you want to know about a property or booking..."
              className="rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-sm text-white outline-none transition focus:border-brand-purple"
            />
            <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-purple px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-magenta">
              <Send size={16} />
              Send message
            </button>
          </div>
          {status && <p className="mt-3 text-sm text-zinc-300">{status}</p>}
        </form>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <MessageSquareText size={16} className="text-brand-accent" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Recent conversations</span>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-300">Loading inbox...</div>
          ) : conversations.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-8 text-center text-zinc-400">
              No messages yet. Use the form above to start a property conversation.
            </div>
          ) : (
            conversations.map((conversation) => (
              <div key={conversation.id} className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">{conversation.subject}</p>
                    <p className="mt-1 text-xs text-zinc-400">Status: {conversation.status || 'NEW'}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                    {conversation.messages?.length ? conversation.messages.length : 0} messages
                  </span>
                </div>
                {conversation.messages?.[0] && (
                  <p className="mt-3 text-sm text-zinc-300">{conversation.messages[0].text}</p>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
