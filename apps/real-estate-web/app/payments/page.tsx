'use client';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/auth';
import { getStoredProfile, saveStoredProfile, type ListingPlan } from '../lib/app-state';

const paymentPlans: Array<{ key: ListingPlan; label: string; price: string; description: string }> = [
  { key: 'basic', label: 'Basic', price: '₦3,500', description: '3 free agent listings for one week then paid listing support' },
  { key: 'standard', label: 'Standard', price: '₦5,000', description: 'More visibility and agent services' },
  { key: 'premium', label: 'Premium', price: '₦7,500', description: 'Full listing boost, priority review and support' },
];

export default function PaymentsPage() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [selectedPlan, setSelectedPlan] = useState<ListingPlan>(profile.subscriptionPlan ?? 'basic');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const currentProfile = getStoredProfile();
    setProfile(currentProfile);
    setSelectedPlan(currentProfile.subscriptionPlan ?? 'basic');
  }, []);

  async function handlePay(plan: ListingPlan) {
    setProcessing(true);
    setMessage('');
    const amount = Number(paymentPlans.find((p) => p.key === plan)?.price.replace(/[₦,]/g, '') ?? 0);
    const initiateRes = await authFetch('/api/payments/initiate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, amount }),
    });

    if (!initiateRes.ok) {
      const payload = await initiateRes.json().catch(() => ({}));
      setMessage(payload?.detail || 'Checkout failed.');
      setProcessing(false);
      return;
    }

    const transaction = await initiateRes.json().catch(() => null);
    const verifyRes = await authFetch('/api/payments/verify/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: transaction?.provider_reference }),
    });

    if (!verifyRes.ok) {
      const payload = await verifyRes.json().catch(() => ({}));
      setMessage(payload?.detail || 'Payment verification failed.');
      setProcessing(false);
      return;
    }

    const nextProfile = {
      ...profile,
      subscriptionPlan: plan,
      selectedPlan: plan,
      subscriptionStatus: 'active' as const,
      subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      walletBalance: profile.walletBalance + 0,
    };
    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setMessage(`Payment completed for the ${plan.toUpperCase()} plan. Subscription active for 7 days.`);
    setProcessing(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Agent subscription</p>
          <h1 className="mt-2 text-3xl font-black">Paystack checkout</h1>
          <p className="mt-2 text-sm text-zinc-400">Use the embedded checkout below to upgrade your agent access without leaving the app.</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {paymentPlans.map((plan) => (
            <div key={plan.key} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl">
              <h2 className="text-xl font-black">{plan.label}</h2>
              <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
              <p className="mt-4 text-3xl font-black">{plan.price}</p>
              <button disabled={processing} onClick={() => handlePay(plan.key)} className="mt-5 w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">{processing ? 'Processing...' : 'Pay with Paystack'}</button>
            </div>
          ))}
        </section>

        {message && <div className="rounded-3xl border border-emerald-500 bg-emerald-500/10 p-4 text-emerald-300">{message}</div>}
      </div>
    </main>
  );
}
