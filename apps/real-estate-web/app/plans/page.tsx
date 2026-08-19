'use client';
import Link from 'next/link';
import { useState } from 'react';
import { getPlanBenefits, getPlanPrice, getStoredProfile, type ListingPlan } from '../lib/app-state';

const plans: Array<{ key: ListingPlan; name: string; subtitle: string; accent: string }> = [
  { key: 'basic', name: 'Basic', subtitle: 'For first-time sellers', accent: 'from-amber-500 to-orange-500' },
  { key: 'standard', name: 'Standard', subtitle: 'Balanced exposure', accent: 'from-sky-500 to-indigo-500' },
  { key: 'premium', name: 'Premium', subtitle: 'Maximum visibility', accent: 'from-fuchsia-500 to-violet-500' },
];

function formatPlanPrice(plan: ListingPlan, durationDays: number) {
  return `₦${getPlanPrice(plan, durationDays).toLocaleString()} for ${durationDays} days`;
}

export default function PlansPage() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [selectedPlan, setSelectedPlan] = useState<ListingPlan>(profile.selectedPlan ?? 'basic');

  function choosePlan(plan: ListingPlan) {
    setProfile({ ...profile, selectedPlan: plan });
    setSelectedPlan(plan);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Listing subscription plans</p>
        <h1 className="mt-2 text-3xl font-black">Fixed-price promotional plans with cashback</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">Every successful plan activation earns a 10% cash back into your wallet to cover airtime and data subscriptions.</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.key} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl">
              <div className={`rounded-2xl bg-gradient-to-r ${plan.accent} p-4`}>
                <h2 className="text-xl font-black">{plan.name}</h2>
                <p className="text-sm opacity-90">{plan.subtitle}</p>
              </div>
              <div className="mt-4 space-y-2 text-sm text-zinc-400">
                <p className="font-semibold text-zinc-100">{formatPlanPrice(plan.key, 30)}</p>
                <p className="font-semibold text-zinc-100">{formatPlanPrice(plan.key, 60)}</p>
                {getPlanBenefits(plan.key).map((item) => <p key={item}>• {item}</p>)}
                <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">10% cashback is deposited into your wallet instantly after every paid plan.</p>
                <button type="button" onClick={() => choosePlan(plan.key)} className="mt-4 w-full rounded-2xl border border-amber-500/40 px-4 py-3 font-semibold text-amber-300">
                  {selectedPlan === plan.key ? 'Selected plan' : 'Select plan'}
                </button>
                <Link href={`/checkout?plan=${plan.key}&amount=${getPlanPrice(plan.key, 30)}`} className="mt-2 block w-full rounded-2xl bg-amber-500 px-4 py-3 text-center font-semibold text-zinc-950">
                  Continue to checkout
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/checkout?plan=${selectedPlan}&amount=${getPlanPrice(selectedPlan, 30)}`} className="rounded-full bg-amber-500 px-4 py-2 font-semibold text-zinc-950">Continue to checkout</Link>
          <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Open dashboard</Link>
        </div>
      </div>
    </main>
  );
}
