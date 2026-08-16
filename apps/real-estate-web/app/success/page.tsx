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
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#dff5e8] shadow-[0_18px_42px_rgba(36,141,84,0.18)]">
            <div className="text-4xl">✅</div>
          </div>
          <h1 className="text-4xl font-black tracking-[-0.06em]">Payment Successful!</h1>
          <p className="mt-2 text-[var(--text-muted)]">Your hostel rental payment has been confirmed</p>
        </div>

        <div id="receipt" className="mb-8 rounded-[2rem] border border-[#6bc59b]/30 bg-gradient-to-br from-[#ecf9f1] to-white p-8 shadow-[0_18px_48px_rgba(12,56,38,0.08)]">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#1f8d61]">Payment Receipt</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Reference: {transactionId}</p>
          </div>

          <div className="space-y-4 border-t border-[#d4e9dd] pt-4">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Hostel Name:</span>
              <span className="font-semibold text-[var(--text-primary)]">{hostelName || transaction?.hostel_name || 'Hostel Rental'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Duration:</span>
              <span className="font-semibold text-[var(--text-primary)]">1 Year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Amount Paid:</span>
              <span className="font-semibold text-[var(--text-primary)]">₦{Number(transaction?.amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Payment Status:</span>
              <span className="font-semibold text-[#1f8d61]">{transaction?.status || 'SUCCESS'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Payment Method:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {transaction?.provider === 'paystack' ? '🔵 Paystack' : transaction?.provider === 'wema' ? '🏦 Wema' : 'Online Payment'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Date & Time:</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {transaction?.created_at ? new Date(transaction.created_at).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-[#d4e9dd] pt-4 text-center">
            <p className="text-xs text-[var(--text-muted)]">Thank you for using AY'SMART!</p>
            <p className="mt-1 text-xs text-[#7b7481]">Your booking confirmation has been sent to your email.</p>
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="w-full rounded-[1.4rem] bg-[#4e235f] px-6 py-3 font-bold text-white transition hover:bg-[#6b2d82] disabled:opacity-50"
          >
            {sendingEmail ? '📧 Sending...' : '📧 Send Receipt to Email'}
          </button>

          <button
            onClick={handleDownloadPDF}
            className="w-full rounded-[1.4rem] bg-[#f1b8a5] px-6 py-3 font-bold text-[#23192a] transition hover:opacity-90"
          >
            📄 Download as PDF
          </button>

          <button
            onClick={handleShareAsImage}
            className="w-full rounded-[1.4rem] border border-[#4e235f]/10 bg-white px-6 py-3 font-bold text-[#4e235f] transition hover:bg-[#f8f3f1]"
          >
            🖼️ Share as Image
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-[1.2rem] border border-[#dfe6ea] bg-white p-4">
            <p className="text-center text-sm text-[var(--text-primary)]">{message}</p>
          </div>
        )}

        <div className="mb-8 rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 p-6 shadow-[0_18px_48px_rgba(46,17,54,0.06)]">
          <h2 className="mb-3 font-black">What's Next?</h2>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li className="flex items-center gap-2"><span>✓</span> Your payment has been confirmed and receipt generated</li>
            <li className="flex items-center gap-2"><span>✓</span> Check your email for booking confirmation</li>
            <li className="flex items-center gap-2"><span>✓</span> Hostel admin will send you move-in details</li>
            <li className="flex items-center gap-2"><span>✓</span> Keep this receipt for your records</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Link
            href="/hostel"
            className="flex-1 rounded-[1.4rem] border border-[color:var(--brand-border)] bg-white/80 px-6 py-3 text-center font-semibold text-[var(--text-primary)] transition hover:bg-[#f8f3f1]"
          >
            Browse More Hostels
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-[1.4rem] bg-[#4e235f] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#6b2d82]"
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
