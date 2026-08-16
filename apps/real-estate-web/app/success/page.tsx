'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { authFetch } from '../lib/auth';
import { buildApiUrl } from '../lib/api';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const hostelName = searchParams.get('hostelName');
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchTransaction() {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await authFetch(buildApiUrl(`/payments/${transactionId}/`));
        if (res.ok) {
          const data = await res.json();
          setTransaction(data);
        }
      } catch (err) {
        console.error('Failed to fetch transaction:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransaction();
  }, [transactionId]);

  async function handleDownloadPDF() {
    const element = document.getElementById('receipt');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt-${transactionId}.pdf`);
      setMessage('✅ Receipt downloaded successfully!');
    } catch (err) {
      setMessage('❌ Failed to download receipt');
    }
  }

  async function handleShareAsImage() {
    const element = document.getElementById('receipt');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `receipt-${transactionId}.png`;
          link.click();
          URL.revokeObjectURL(url);
          setMessage('✅ Receipt image saved successfully!');
        }
      });
    } catch (err) {
      setMessage('❌ Failed to save receipt image');
    }
  }

  async function handleSendEmail() {
    setSendingEmail(true);
    setMessage('');

    try {
      const res = await authFetch(buildApiUrl(`/payments/${transactionId}/send-receipt/`), {
        method: 'POST',
      });

      if (res.ok) {
        setMessage('✅ Receipt sent to your email!');
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(`❌ ${errData.detail || 'Failed to send email'}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSendingEmail(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!transactionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white">Payment Processing</h1>
          <p className="mt-3 text-sm text-zinc-400">Your payment is being processed. You will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="text-6xl mb-3">✅</div>
          <h1 className="text-4xl font-black">Payment Successful!</h1>
          <p className="mt-2 text-zinc-400">Your hostel rental payment has been confirmed</p>
        </div>

        {/* Receipt */}
        <div id="receipt" className="mb-8 rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-zinc-900/80 p-8">
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">Payment Receipt</p>
            <p className="text-xs text-zinc-400 mt-1">Reference: {transactionId}</p>
          </div>

          <div className="space-y-4 border-t border-zinc-700 pt-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">Hostel Name:</span>
              <span className="font-semibold">{hostelName || transaction?.hostel_name || 'Hostel Rental'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Duration:</span>
              <span className="font-semibold">1 Year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Amount Paid:</span>
              <span className="font-semibold">₦{Number(transaction?.amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Status:</span>
              <span className="font-semibold text-green-400">{transaction?.status || 'SUCCESS'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Method:</span>
              <span className="font-semibold">
                {transaction?.provider === 'paystack' ? '🔵 Paystack' : transaction?.provider === 'wema' ? '🏦 Wema' : 'Online Payment'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Date & Time:</span>
              <span className="font-semibold text-sm">
                {transaction?.created_at ? new Date(transaction.created_at).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-700 text-center">
            <p className="text-xs text-zinc-400">Thank you for using AY'SMART!</p>
            <p className="text-xs text-zinc-500 mt-1">Your booking confirmation has been sent to your email.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 space-y-3">
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="w-full rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {sendingEmail ? '📧 Sending...' : '📧 Send Receipt to Email'}
          </button>

          <button
            onClick={handleDownloadPDF}
            className="w-full rounded-2xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700"
          >
            📄 Download as PDF
          </button>

          <button
            onClick={handleShareAsImage}
            className="w-full rounded-2xl bg-brand-accent px-6 py-3 font-bold text-white transition hover:opacity-90"
          >
            🖼️ Share as Image
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 p-4">
            <p className="text-sm text-center text-zinc-300">{message}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="mb-8 rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6">
          <h2 className="font-black mb-3">What's Next?</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <span>✓</span> Your payment has been confirmed and receipt generated
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Check your email for booking confirmation
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Hostel admin will send you move-in details
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Keep this receipt for your records
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Link
            href="/hostel"
            className="flex-1 rounded-2xl border border-zinc-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-zinc-800/50"
          >
            Browse More Hostels
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-brand-purple px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-magenta"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading success page...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
