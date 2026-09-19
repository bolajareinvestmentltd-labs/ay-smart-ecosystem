'use client';

import { useMemo, useState } from 'react';
import {
  createPaymentSession,
  openZeroRedirectAlatpayCheckout,
  verifyPayment,
  type AlatPayCheckoutResult,
} from '@smartassetz/shared';

export interface AlatPayCheckoutProps {
  amount: number;
  email?: string;
  metadata?: Record<string, unknown>;
  label?: string;
  onSuccess?: (result: AlatPayCheckoutResult) => void;
  onError?: (error: Error) => void;
}

export function AlatPayCheckout({
  amount,
  email,
  metadata,
  label = 'Complete payment',
  onSuccess,
  onError,
}: AlatPayCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formattedAmount = useMemo(() => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount), [amount]);

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);
    setMessage('Preparing secure checkout…');

    try {
      const session = await createPaymentSession({
        amount,
        provider: 'wema',
        email: email ?? 'customer@smartassetz.com',
        metadata,
      });

      const reference = String(session.provider_reference ?? session.reference ?? `smartassetz-${Date.now()}`);

      const result = await openZeroRedirectAlatpayCheckout({
        amount,
        currency: 'NGN',
        email: email ?? 'customer@smartassetz.com',
        reference,
        label,
        metadata: {
          ...(metadata ?? {}),
          paymentSessionId: session.id ?? reference,
        },
        onSuccess: (successResult) => {
          setMessage(`Payment confirmed via ALATPay (${successResult.reference}).`);
          onSuccess?.(successResult);
        },
        onCancel: () => {
          setMessage('Payment flow closed. You can retry whenever you are ready.');
        },
        onError: (checkoutError) => {
          setError(checkoutError.message);
          onError?.(checkoutError);
        },
      });

      if (result.status === 'success') {
        await verifyPayment({ reference: result.reference, provider: 'wema' });
      }
    } catch (caughtError) {
      const nextError = caughtError instanceof Error ? caughtError : new Error('Unable to complete secure payment.');
      setError(nextError.message);
      onError?.(nextError);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#621063]">ALATPay</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{label}</h3>
        </div>
        <div className="rounded-xl bg-[#F8F9FA] px-3 py-2 text-sm font-semibold text-[#621063]">
          {formattedAmount}
        </div>
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={isProcessing}
        className="mt-5 w-full rounded-2xl bg-[#621063] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8A298B] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isProcessing ? 'Processing secure checkout…' : 'Pay securely with ALATPay'}
      </button>

      {message ? <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
