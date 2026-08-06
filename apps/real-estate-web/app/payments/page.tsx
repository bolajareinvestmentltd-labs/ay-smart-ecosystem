'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '../lib/auth';
import { getStoredProfile, saveStoredProfile, type ListingPlan } from '../lib/app-state';

const pendingCheckoutKey = 'aysmart-paystack-pending';

function getPendingCheckout() {
  if (typeof window === 'undefined') return null;
  const pending = window.sessionStorage.getItem(pendingCheckoutKey);
  if (!pending) return null;

  try {
    return JSON.parse(pending);
  } catch {
    window.sessionStorage.removeItem(pendingCheckoutKey);
    return null;
  }
}

function getSubscriptionExpiry() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
}

const paymentPlans: Array<{ key: ListingPlan; label: string; price: string; description: string }> = [
  { key: 'basic', label: 'Basic', price: '₦3,500', description: '3 free agent listings for one week then paid listing support' },
  { key: 'standard', label: 'Standard', price: '₦5,000', description: 'More visibility and agent services' },
  { key: 'premium', label: 'Premium', price: '₦7,500', description: 'Full listing boost, priority review and support' },
];

export default function PaymentsPage() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const initialPendingCheckout = getPendingCheckout();
  const [selectedPlan, setSelectedPlan] = useState<ListingPlan>(initialPendingCheckout?.selectedPlan ?? 'basic');
  const [testMode, setTestMode] = useState(true);
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(initialPendingCheckout?.authorizationUrl ?? null);
  const [pendingReference, setPendingReference] = useState<string | null>(initialPendingCheckout?.pendingReference ?? null);
  const [pendingPlan, setPendingPlan] = useState<ListingPlan | null>(initialPendingCheckout?.pendingPlan ?? null);
  const router = useRouter();

  const handleVerify = useCallback(async (reference: string) => {
    setProcessing(true);
    setMessage('Verifying payment...');

    const verifyRes = await authFetch('/api/payments/verify/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    });

    if (!verifyRes.ok) {
      if (verifyRes.status === 401) {
        router.push('/auth/login');
        return;
      }
      const payload = await verifyRes.json().catch(() => ({}));
      setMessage(payload?.detail || 'Payment verification failed.');
      setProcessing(false);
      return;
    }

    const nextProfile = {
      ...profile,
      subscriptionPlan: pendingPlan ?? selectedPlan,
      selectedPlan: pendingPlan ?? selectedPlan,
      subscriptionStatus: 'active' as const,
      subscriptionExpiresAt: getSubscriptionExpiry(),
      walletBalance: profile.walletBalance + 0,
    };
    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setMessage(`Payment completed for the ${selectedPlan.toUpperCase()} plan. Subscription active for 7 days.`);
    setAuthorizationUrl(null);
    setPendingReference(null);
    setProcessing(false);
  }, [profile, pendingPlan, router, selectedPlan]);

  useEffect(() => {
    if (!pendingReference) {
      window.sessionStorage.removeItem(pendingCheckoutKey);
      return;
    }

    window.sessionStorage.setItem(
      pendingCheckoutKey,
      JSON.stringify({ pendingReference, pendingPlan, authorizationUrl, selectedPlan }),
    );
  }, [authorizationUrl, pendingPlan, pendingReference, selectedPlan]);

  useEffect(() => {
    if (!authorizationUrl || !pendingReference) return;

    const handleFocus = async () => {
      if (processing) return;
      setMessage('Returning from checkout — verifying payment now...');
      await handleVerify(pendingReference);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [authorizationUrl, pendingReference, processing, handleVerify]);

  function openCheckoutUrl(url: string) {
    const win = window.open(url, '_blank');
    if (!win) {
      window.location.href = url;
    }
  }

  async function handlePay(plan: ListingPlan) {
    setSelectedPlan(plan);
    setProcessing(true);
    setMessage('');
    setAuthorizationUrl(null);
    setPendingReference(null);
    setPendingPlan(null);

    const amount = Number(paymentPlans.find((p) => p.key === plan)?.price.replace(/[₦,]/g, '') ?? 0);
    const initiateRes = await authFetch('/api/payments/initiate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, amount }),
    });

    if (!initiateRes.ok) {
      if (initiateRes.status === 401) {
        router.push('/auth/login');
        return;
      }
      const payload = await initiateRes.json().catch(() => ({}));
      setMessage(payload?.detail || 'Checkout failed.');
      setProcessing(false);
      return;
    }

    const transaction = await initiateRes.json().catch(() => null);
    setTestMode(Boolean(transaction?.test_mode ?? true));

    if (transaction?.authorization_url) {
      setPendingReference(transaction.provider_reference || null);
      setAuthorizationUrl(transaction.authorization_url);
      setPendingPlan(plan);
      setMessage('Paystack checkout opened in a new window. Return to this tab to verify automatically after payment.');
      openCheckoutUrl(transaction.authorization_url);
      setProcessing(false);
      return;
    }

    if (transaction?.provider_reference) {
      await handleVerify(transaction.provider_reference);
      return;
    }

    setMessage('Unable to initiate payment.');
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
              <button disabled={processing} onClick={() => handlePay(plan.key)} className="mt-5 w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">{processing ? 'Processing...' : `Pay ${plan.label} with Paystack`}</button>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A855F7]">Checkout summary</p>
              <h2 className="mt-2 text-2xl font-black">{paymentPlans.find((plan) => plan.key === selectedPlan)?.label || 'Basic'} plan ready</h2>
              <p className="mt-2 text-sm text-zinc-400">Subscriptions activate instantly after verification and include 7 days of listing support.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
              {testMode ? 'Paystack test mode • Sandbox-ready checkout' : 'Production-ready checkout'} • Wallet updates • Admin support
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/support" className="rounded-full border border-zinc-700 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Need help with payment?</Link>
            <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Open dashboard</Link>
          </div>
          {authorizationUrl && pendingReference && (
            <div className="mt-4 rounded-3xl border border-white/10 bg-zinc-950/80 p-4 text-sm text-zinc-200">
              <p>Paystack checkout is ready. Complete payment in the new tab, then tap verify below.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={() => window.open(authorizationUrl, '_blank')} className="rounded-full border border-zinc-700 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Reopen checkout</button>
                <button type="button" disabled={processing} onClick={() => pendingReference && handleVerify(pendingReference)} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">Verify payment</button>
              </div>
            </div>
          )}
        </section>

        {message && <div className="rounded-3xl border border-emerald-500 bg-emerald-500/10 p-4 text-emerald-300">{message}</div>}
      </div>
    </main>
  );
}
