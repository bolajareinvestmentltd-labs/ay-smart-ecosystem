import { CheckCircle2, ShieldAlert } from 'lucide-react';

const rows = [
  { property: 'Ikoyi Villa', state: 'Lagos', risk: 'Low', status: 'Approved' },
  { property: 'Lekki Townhouse', state: 'Lagos', risk: 'Medium', status: 'Review' },
  { property: 'Gwarinpa Duplex', state: 'Abuja', risk: 'High', status: 'Escalated' },
  { property: 'Port Harcourt Plot', state: 'Rivers', risk: 'Low', status: 'Approved' },
];

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#E79E23]">Moderation</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Property validation desk</h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E79E23]/30 bg-[#1a111a] px-3 py-2 text-sm text-[#E79E23]">
          <ShieldAlert className="h-4 w-4" />
          5 active moderation cases
        </div>
      </header>

      <div className="card-surface overflow-hidden">
        <div className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.8fr] border-b border-white/10 bg-[#171b22] px-5 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Property</span>
          <span>State</span>
          <span>Risk</span>
          <span>Status</span>
        </div>

        {rows.map((row) => (
          <div key={row.property} className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.8fr] items-center border-b border-white/10 px-5 py-4 text-sm text-slate-200 last:border-b-0">
            <span>{row.property}</span>
            <span>{row.state}</span>
            <span className={row.risk === 'High' ? 'text-rose-400' : row.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}>{row.risk}</span>
            <span className={row.status === 'Approved' ? 'text-emerald-400' : row.status === 'Escalated' ? 'text-rose-400' : 'text-amber-400'}>
              {row.status === 'Approved' ? <CheckCircle2 className="mr-2 inline h-4 w-4" /> : null}
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
