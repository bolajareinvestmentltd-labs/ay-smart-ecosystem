import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

const rows = [
  { name: 'Kehinde Adebayo', type: 'NIN', score: '97%', status: 'Approved', tone: 'text-emerald-400' },
  { name: 'Ruth Okafor', type: 'BVN', score: '91%', status: 'Needs review', tone: 'text-amber-400' },
  { name: 'Aisha Danjuma', type: 'CAC', score: '88%', status: 'Pending', tone: 'text-slate-300' },
  { name: 'Daniel Ijebu', type: 'NIN', score: '95%', status: 'Approved', tone: 'text-emerald-400' },
];

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#E79E23]">Compliance</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Verification queue</h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E79E23]/30 bg-[#1a111a] px-3 py-2 text-sm text-[#E79E23]">
          <ShieldCheck className="h-4 w-4" />
          18 docs requiring review
        </div>
      </header>

      <div className="card-surface overflow-hidden">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.9fr] border-b border-white/10 bg-[#171b22] px-5 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Customer</span>
          <span>Doc type</span>
          <span>Match score</span>
          <span>Status</span>
        </div>

        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.9fr] items-center border-b border-white/10 px-5 py-4 text-sm text-slate-200 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#621063]/20 text-[#E79E23]">
                {row.name.charAt(0)}
              </div>
              <span>{row.name}</span>
            </div>
            <span>{row.type}</span>
            <span>{row.score}</span>
            <span className={`inline-flex items-center gap-2 ${row.tone}`}>
              {row.status === 'Needs review' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
