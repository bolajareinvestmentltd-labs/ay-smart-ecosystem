import { BadgeDollarSign, LockKeyhole, ShieldCheck } from 'lucide-react';

const transactions = [
  { ref: 'X-09142', customer: 'Adebayo Ventures', amount: 'NGN 42.2M', status: 'Escrowed', risk: 'Low' },
  { ref: 'X-08983', customer: 'Neno Heights', amount: 'NGN 27.9M', status: 'On hold', risk: 'Medium' },
  { ref: 'X-08899', customer: 'Cityline Estates', amount: 'NGN 58.1M', status: 'Reviewed', risk: 'Low' },
];

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#E79E23]">Escrow ledger</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Audit & overrides</h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E79E23]/30 bg-[#1a111a] px-3 py-2 text-sm text-[#E79E23]">
          <LockKeyhole className="h-4 w-4" />
          2 override approvals pending
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric-shell">
          <BadgeDollarSign className="mb-3 h-5 w-5 text-[#E79E23]" />
          <p className="text-sm text-slate-400">Total escrow</p>
          <p className="mt-2 text-3xl font-bold text-white">NGN 1.48B</p>
        </div>
        <div className="metric-shell">
          <ShieldCheck className="mb-3 h-5 w-5 text-[#E79E23]" />
          <p className="text-sm text-slate-400">Verified releases</p>
          <p className="mt-2 text-3xl font-bold text-white">92%</p>
        </div>
        <div className="metric-shell">
          <LockKeyhole className="mb-3 h-5 w-5 text-[#E79E23]" />
          <p className="text-sm text-slate-400">Manual overrides</p>
          <p className="mt-2 text-3xl font-bold text-white">04</p>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="grid grid-cols-[1fr_1.1fr_0.9fr_0.7fr_0.8fr] border-b border-white/10 bg-[#171b22] px-5 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Ref</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Risk</span>
        </div>

        {transactions.map((row) => (
          <div key={row.ref} className="grid grid-cols-[1fr_1.1fr_0.9fr_0.7fr_0.8fr] items-center border-b border-white/10 px-5 py-4 text-sm text-slate-200 last:border-b-0">
            <span>{row.ref}</span>
            <span>{row.customer}</span>
            <span>{row.amount}</span>
            <span className={row.status === 'Escrowed' ? 'text-emerald-400' : 'text-amber-400'}>{row.status}</span>
            <span className={row.risk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>{row.risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
