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
