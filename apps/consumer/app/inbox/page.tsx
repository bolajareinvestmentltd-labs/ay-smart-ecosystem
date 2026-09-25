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
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-8 text-[var(--text-primary)] pb-32">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#4e235f]">Inbox</p>
            <h1 className="mt-2 text-3xl font-black">Messages</h1>
          </div>
          <Link href="/" className="rounded-full border border-[color:var(--brand-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-white">
            Browse listings
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[color:var(--brand-border)] bg-white/80 p-5 shadow-[0_12px_32px_rgba(46,17,54,0.08)]">
          <div className="mb-4 flex items-center gap-2 text-[#4e235f]">
            <Mail size={16} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">New message</span>
          </div>
          <div className="grid gap-3">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="rounded-[1.2rem] border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Tell us what you want to know..."
              className="rounded-[1.2rem] border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#4e235f]"
            />
            <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#4e235f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6b2d82]">
              <Send size={16} />
              Send message
            </button>
          </div>
          {status && <p className="mt-3 text-sm text-[var(--text-muted)]">{status}</p>}
        </form>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <MessageSquareText size={16} className="text-[#4e235f]" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Recent conversations</span>
          </div>

          {loading ? (
            <div className="rounded-[1.5rem] border border-[color:var(--brand-border)] bg-white/80 p-6 text-[var(--text-muted)]">Loading inbox...</div>
          ) : conversations.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[color:var(--brand-border)] bg-white/80 p-8 text-center text-[var(--text-muted)]">
              No messages yet. Use the form above to send a message.
            </div>
          ) : (
            conversations.map((conversation) => (
              <Link href={`/inbox/${conversation.id}`} key={conversation.id} className="block rounded-[1.5rem] border border-[color:var(--brand-border)] bg-white/80 p-4 shadow-[0_8px_16px_rgba(46,17,54,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{conversation.subject}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Status: {conversation.status || 'NEW'}</p>
                  </div>
                  <span className="rounded-full border border-[color:var(--brand-border)] bg-white px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {conversation.messages?.length ? conversation.messages.length : 0} messages
                  </span>
                </div>
                {conversation.messages?.[0] && (
                  <p className="mt-3 text-sm text-[var(--text-muted)]">{conversation.messages[0].text}</p>
                )}
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
