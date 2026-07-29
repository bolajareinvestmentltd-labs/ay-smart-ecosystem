"use client";
import { useState } from "react";
import Link from "next/link";

export default function ReferPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // NOTE: backend endpoint should be added at /api/referrals to accept POST
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setMessage(payload?.error || "Unable to submit referral. Try again later.");
      } else {
        setEmail("");
        setMessage("Referral submitted — when confirmed, the referrer earns ₦200 credit.");
      }
    } catch (err) {
      setMessage("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-dark text-white px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-black">Refer & Earn</h1>
          <p className="mt-2 text-sm text-zinc-300">Invite friends — you earn ₦200 per confirmed referral. Credits can be used for airtime purchases and other services.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-zinc-300">
            <li>Share your referral link or invite via email.</li>
            <li>Friend signs up and completes the required verification.</li>
            <li>When the referral is confirmed, you receive ₦200 credited to your account.</li>
            <li>Credits are visible in your wallet and can be used for airtime purchases.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Invite by email</h2>
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-zinc-400"
            />
            <button disabled={loading} className="inline-flex items-center justify-center rounded-full bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta">
              {loading ? "Sending..." : "Send invite"}
            </button>
            {message && <p className="text-sm text-zinc-300">{message}</p>}
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Referral Link</h2>
          <p className="mt-2 text-sm text-zinc-300">Share this link directly with your friends:</p>
          <div className="mt-3 flex gap-2">
            <input readOnly value={typeof window !== 'undefined' ? window.location.origin + '/?ref=YOUR_USER_ID' : '/?ref=YOUR_USER_ID'} className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white" />
            <Link href="/auth/login" className="rounded-lg bg-white/5 px-3 py-2 text-sm">My referrals</Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Assets / Logo</h2>
          <p className="mt-2 text-sm text-zinc-300">Place your logo files in <strong>apps/real-estate-web/public/assets/</strong>. Recommended filenames:
            <ul className="ml-4 list-disc">
              <li><strong>brand-logo.svg</strong> — preferred (scalable, small).</li>
              <li><strong>brand-logo.png</strong> — fallback (transparent background preferred).</li>
            </ul>
          </p>
          <p className="mt-2 text-sm text-zinc-300">Use the background-removed (transparent) version when overlaying on colored sections. Provide a full-background version only if you need a boxed logo with its own background.</p>
        </div>
      </div>
    </main>
  );
}
'use client';
import { useState } from 'react';
import { getStoredProfile } from '../lib/app-state';

export default function ReferPage() {
  const profile = getStoredProfile();
  const [tab, setTab] = useState<'invite' | 'referrals' | 'faqs'>('invite');

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Refer & earn</p>
              <h1 className="mt-2 text-3xl font-black">Invite friends and earn rewards</h1>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm">
              <p>Your code</p>
              <p className="font-bold">{profile.referralCode || 'AYS-XXXXX'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <div className="grid grid-cols-3 gap-2 text-center text-sm font-bold uppercase text-zinc-400">
            <button className={tab === 'invite' ? 'text-white border-b-2 border-amber-400 pb-2' : 'pb-2'} onClick={() => setTab('invite')}>Invite</button>
            <button className={tab === 'referrals' ? 'text-white border-b-2 border-amber-400 pb-2' : 'pb-2'} onClick={() => setTab('referrals')}>Referrals</button>
            <button className={tab === 'faqs' ? 'text-white border-b-2 border-amber-400 pb-2' : 'pb-2'} onClick={() => setTab('faqs')}>FAQs</button>
          </div>

          <div className="mt-6">
            {tab === 'invite' && (
              <div className="space-y-4 text-sm text-zinc-400">
                <p>Share your unique referral link to invite friends to AY&apos;SMART.</p>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-xs uppercase text-zinc-500">Referral link</p>
                  <p className="mt-2 font-semibold">https://aysmart.app/ref/{profile.referralCode || 'AYS-XXXXX'}</p>
                  <button className="mt-4 rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950">Share link</button>
                </div>
              </div>
            )}

            {tab === 'referrals' && (
              <div className="space-y-4 text-sm text-zinc-400">
                <p className="text-zinc-300">Referral rewards</p>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-3xl font-black text-amber-400">₦{profile.referralRewards.toFixed(2)}</p>
                  <p className="mt-2">Your invitees will become active once they complete their first successful transaction.</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-xs">
                  <p>No referrals yet. Start sharing to earn up to ₦500 per friend.</p>
                </div>
              </div>
            )}

            {tab === 'faqs' && (
              <div className="space-y-4 text-sm text-zinc-400">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-semibold">How do I earn rewards?</p>
                  <p className="mt-2">Share your referral link and invite friends to create an account. Earn when they complete their first transaction.</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-semibold">When is my reward paid?</p>
                  <p className="mt-2">Rewards are credited to your wallet once the referred user completes the first successful payment.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
