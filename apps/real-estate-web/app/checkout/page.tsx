'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Paystack from '@paystack/inline-js';
import { authFetch } from '../lib/auth';

type Provider = 'paystack' | 'wema';

const plans = {
  basic: { label: 'Basic', amount: 3500 },
  standard: { label: 'Standard', amount: 5000 },
  premium: { label: 'Premium', amount: 7500 },
} as const;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = (searchParams.get('plan') || 'basic') as keyof typeof plans;
  const plan = plans[planKey] || plans.basic;
  const [provider, setProvider] = useState<Provider>('paystack');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [session, setSession] = useState<{ reference?: string; access_code?: string; payment_url?: string; transfer_instructions?: string } | null>(null);

  useEffect(() => {
    authFetch('/api/auth/profile/').then(async (response) => {
      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }
      const payload = await response.json().catch(() => null);
      if (payload?.email) setEmail(payload.email);
    }).catch(() => router.push('/auth/login'));
  }, [router]);

  async function verify(reference: string) {
    setProcessing(true);
    setMessage('Confirming payment with the server...');
    const response = await authFetch('/api/payments/verify/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, provider }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload?.detail || 'Payment is not confirmed yet.');
      setProcessing(false);
      return;
    }
    setMessage('Payment confirmed. Your subscription is now active.');
    setSession(null);
    setProcessing(false);
  }

  async function startPayment(event: React.FormEvent) {
    event.preventDefault();
    setProcessing(true);
    setError('');
    setMessage('Creating a secure payment session...');
    const response = await authFetch('/api/payments/initiate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, amount: plan.amount, provider }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) router.push('/auth/login');
      setError(payload?.detail || 'Unable to start payment.');
      setProcessing(false);
      return;
    }
    setSession({ reference: payload.provider_reference, access_code: payload.access_code, payment_url: payload.payment_url, transfer_instructions: payload.transfer_instructions });
    setMessage(provider === 'paystack' ? 'Secure Paystack checkout is ready.' : 'Wema / ALAT payment session is ready.');
    setProcessing(false);

    if (provider === 'paystack' && payload.access_code) {
      const paystack = new Paystack();
      paystack.resumeTransaction(payload.access_code, {
        onSuccess: (result: { reference: string }) => verify(result.reference),
        onCancel: () => setMessage('Payment window closed. Your subscription remains inactive until payment is confirmed.'),
      });
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 pb-32 text-[var(--text-primary)]">
      <div className="mx-auto max-w-3xl">
        <Link href="/plans" className="text-sm font-semibold text-[#4e235f]">Back to plans</Link>
        <section className="mt-5 rounded-[2rem] border border-[var(--brand-border)] bg-white/85 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.08)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4e235f]">Secure checkout</p>
          <h1 className="mt-2 text-3xl font-black">Activate the {plan.label} plan</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Payment is verified by Django before your subscription becomes active.</p>
          <div className="mt-6 flex justify-between rounded-2xl bg-[#f9efe9] p-4 text-lg font-black text-[#4e235f]"><span>Total</span><span>₦{plan.amount.toLocaleString()}</span></div>
        </section>

        <form onSubmit={startPayment} className="mt-4 rounded-[2rem] border border-[var(--brand-border)] bg-white/85 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.08)]">
          <label className="block text-sm font-semibold">Receipt email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-2 w-full rounded-xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none" /></label>
          <p className="mt-5 text-sm font-bold">Choose payment method</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {(['paystack', 'wema'] as Provider[]).map((item) => <button type="button" key={item} onClick={() => setProvider(item)} className={`rounded-xl border p-4 text-left ${provider === item ? 'border-[#4e235f] bg-[#f9efe9]' : 'border-[var(--brand-border)] bg-white'}`}><strong>{item === 'paystack' ? 'Paystack' : 'ALAT Pay by Wema'}</strong><span className="mt-1 block text-xs text-[var(--text-muted)]">{item === 'paystack' ? 'Card, bank, USSD and mobile money in a secure in-app window.' : 'Wema session or bank instructions shown here.'}</span></button>)}
          </div>
          <button type="submit" disabled={processing} className="mt-5 w-full rounded-xl bg-[#4e235f] px-4 py-3 font-bold text-white disabled:opacity-60">{processing ? 'Processing...' : `Pay ₦${plan.amount.toLocaleString()}`}</button>
        </form>

        {session?.payment_url && provider === 'wema' && <section className="mt-4 overflow-hidden rounded-[2rem] border border-[var(--brand-border)] bg-white p-3"><p className="p-3 text-sm font-semibold">Complete ALAT Pay in this secure panel</p><iframe title="ALAT Pay checkout" src={session.payment_url} className="h-[560px] w-full rounded-xl border-0" /></section>}
        {session?.transfer_instructions && <section className="mt-4 whitespace-pre-line rounded-2xl bg-[#f9efe9] p-4 text-sm">{session.transfer_instructions}</section>}
        {session?.reference && <button type="button" disabled={processing} onClick={() => verify(session.reference!)} className="mt-4 w-full rounded-xl border border-[#4e235f] px-4 py-3 font-bold text-[#4e235f]">I have completed payment, verify</button>}
        {message && <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<main className="min-h-screen p-8">Loading checkout...</main>}><CheckoutContent /></Suspense>;
}
