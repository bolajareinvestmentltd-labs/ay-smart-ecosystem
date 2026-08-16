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
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black">Checkout</h1>
          <p className="mt-2 text-sm text-zinc-400">Complete your hostel rental payment</p>
        </div>

        {/* Order Summary */}
        <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="font-black">Order Summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-400">Hostel:</span>
              <span className="font-semibold">{hostelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Duration:</span>
              <span className="font-semibold">1 Year</span>
            </div>
            <div className="border-t border-zinc-700 pt-3 mt-3 flex justify-between text-lg font-black">
              <span>Total Amount:</span>
              <span className="text-brand-accent">₦{Number(amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h2 className="font-black mb-4">Select Payment Method</h2>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex items-center rounded-2xl border-2 p-4 cursor-pointer transition ${
                  selectedMethod === method.id
                    ? 'border-brand-accent bg-brand-accent/10'
                    : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <p className="font-semibold flex items-center gap-2">
                    <span>{method.icon}</span> {method.name}
                  </p>
                  <p className="text-xs text-zinc-400">{method.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Checkout Button */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <button
            type="submit"
            disabled={processing}
            className="w-full rounded-2xl bg-brand-purple px-6 py-4 font-black text-white transition hover:bg-brand-magenta disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? '🔄 Processing...' : `💳 Pay ₦${Number(amount).toLocaleString()}`}
          </button>

          <Link
            href={`/hostel/${hostelId}`}
            className="block text-center rounded-2xl border border-zinc-700 px-6 py-4 font-semibold text-white transition hover:bg-zinc-800/50"
          >
            Cancel
          </Link>
        </form>

        {/* Security Info */}
        <div className="mt-8 text-center text-xs text-zinc-500">
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
