'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authFetch } from '../lib/auth';
import { buildApiUrl } from '../lib/api';

interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'paystack',
    name: 'Paystack',
    provider: 'paystack',
    icon: '🔵',
    description: 'Pay with card, bank transfer, or USSD',
  },
  {
    id: 'wema',
    name: 'Wema / Alat Pay',
    provider: 'wema',
    icon: '🏦',
    description: 'Fast bank transfer and mobile money',
  },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hostelId = searchParams.get('hostel');
  const hostelName = searchParams.get('hostelName');
  const amount = searchParams.get('amount');
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await authFetch(buildApiUrl('/auth/me/'));
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Create payment transaction
      const res = await authFetch(buildApiUrl('/payments/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostel_id: hostelId,
          hostel_name: hostelName,
          amount: Number(amount),
          provider: selectedMethod,
          plan: 'hostel_yearly',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to payment provider
        if (selectedMethod === 'paystack' && data.payment_url) {
          window.location.href = data.payment_url;
        } else if (selectedMethod === 'wema' && data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          // Fallback: redirect to success with transaction ID
          router.push(`/success?transactionId=${data.id}&hostelName=${encodeURIComponent(hostelName || '')}`);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.detail || 'Payment initiation failed');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!hostelId || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white">Invalid Request</h1>
          <p className="mt-3 text-sm text-zinc-400">Missing hostel or price information.</p>
          <Link href="/hostel" className="mt-6 inline-block rounded-full bg-brand-purple px-6 py-3 text-sm font-bold text-white">
            Back to Hostels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#4e235f]">Checkout</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.06em]">Checkout</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Complete your hostel rental payment</p>
        </div>

        <div className="mb-8 rounded-[2rem] border border-[color:var(--brand-border)] bg-[#1d1723] p-6 text-white shadow-[0_18px_48px_rgba(46,17,54,0.16)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black">Order Summary</h2>
            <span className="rounded-full bg-[#f1b8a5]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f1b8a5]">Selection</span>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Hostel:</span>
              <span className="font-semibold">{hostelName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Duration:</span>
              <span className="font-semibold">1 Year</span>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 flex justify-between text-lg font-black">
              <span>Total Amount:</span>
              <span className="text-[#f1b8a5]">₦{Number(amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-black">Select Payment Method</h2>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer items-center rounded-[1.4rem] border-2 p-4 transition ${
                  selectedMethod === method.id
                    ? 'border-[#f1b8a5] bg-[#f9efe9]'
                    : 'border-[color:var(--brand-border)] bg-white/80 hover:border-[#f1b8a5]/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3 accent-[#4e235f]"
                />
                <div className="flex-1">
                  <p className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                    <span>{method.icon}</span> {method.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{method.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-[1.2rem] border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleCheckout} className="space-y-4">
          <button
            type="submit"
            disabled={processing}
            className="w-full rounded-[1.4rem] bg-[#4e235f] px-6 py-4 font-black text-white transition hover:bg-[#6b2d82] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? '🔄 Processing...' : `💳 Pay ₦${Number(amount).toLocaleString()}`}
          </button>

          <Link
            href={`/hostel/${hostelId}`}
            className="block rounded-[1.4rem] border border-[color:var(--brand-border)] bg-white/80 px-6 py-4 text-center font-semibold text-[var(--text-primary)] transition hover:bg-[#f7f2ef]"
          >
            Cancel
          </Link>
        </form>

        <div className="mt-8 text-center text-xs text-[var(--text-muted)]">
          <p>🔒 Your payment is secure and encrypted</p>
          <p>💳 We support multiple payment providers for your convenience</p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
