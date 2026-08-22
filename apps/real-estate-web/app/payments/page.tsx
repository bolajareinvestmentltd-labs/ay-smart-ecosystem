'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/auth';

type Invoice = { id: number; invoice_number: string; amount: string | number; description: string; status: string; created_at: string };
type Payment = { id: number; invoice?: number | null; plan: string; amount: string | number; provider: string; status: string; provider_reference: string; created_at: string };

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authFetch('/api/invoices/'), authFetch('/api/payments/')]).then(async ([invoiceResponse, paymentResponse]) => {
      if (invoiceResponse.ok) { const payload = await invoiceResponse.json(); setInvoices(Array.isArray(payload) ? payload : []); }
      if (paymentResponse.ok) { const payload = await paymentResponse.json(); setPayments(Array.isArray(payload) ? payload : []); }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 pb-32 text-[var(--text-primary)]">
      <div className="mx-auto max-w-4xl space-y-6">
        <header><p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#4e235f]">Payments</p><h1 className="mt-2 text-3xl font-black">Invoices and payment history</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Pay issued invoices securely inside the app and keep a complete receipt record.</p></header>
        {loading ? <p className="rounded-2xl bg-white/80 p-6 text-sm text-[var(--text-muted)]">Loading payment history...</p> : <>
          <section className="space-y-3"><h2 className="text-lg font-black">Invoices</h2>{invoices.length === 0 ? <p className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white/70 p-6 text-sm text-[var(--text-muted)]">No invoices have been issued to you.</p> : invoices.map((invoice) => <div key={invoice.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-border)] bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{invoice.invoice_number}</p><p className="text-sm text-[var(--text-muted)]">{invoice.description}</p><p className="mt-1 text-xs text-[var(--text-muted)]">₦{Number(invoice.amount).toLocaleString()} · {invoice.status}</p></div>{invoice.status === 'ISSUED' ? <Link href={`/checkout?invoice=${invoice.id}`} className="rounded-xl bg-[#4e235f] px-4 py-2 text-center text-sm font-bold text-white">Pay invoice</Link> : <Link href={`/success?transactionId=${payments.find((payment) => payment.invoice === invoice.id)?.id || ''}`} className="rounded-xl border border-[var(--brand-border)] px-4 py-2 text-center text-sm font-semibold">View receipt</Link>}</div>)}</section>
          <section className="space-y-3"><h2 className="text-lg font-black">Transactions</h2>{payments.length === 0 ? <p className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white/70 p-6 text-sm text-[var(--text-muted)]">No payment transactions yet.</p> : payments.map((payment) => <div key={payment.id} className="rounded-2xl border border-[var(--brand-border)] bg-white/80 p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold">₦{Number(payment.amount).toLocaleString()}</p><span className="text-xs font-semibold">{payment.status}</span></div><p className="mt-1 text-sm text-[var(--text-muted)]">{payment.plan} · {payment.provider} · {payment.provider_reference}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{new Date(payment.created_at).toLocaleString()}</p>{payment.status === 'SUCCESS' && <Link href={`/success?transactionId=${payment.id}`} className="mt-3 inline-block text-sm font-semibold text-[#4e235f]">View receipt</Link>}</div>)}</section>
        </>}
      </div>
    </main>
  );
}
