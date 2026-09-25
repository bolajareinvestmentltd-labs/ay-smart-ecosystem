import { ArrowUpRight, CheckCircle2, Clock3, ShieldAlert, Users } from 'lucide-react';

const metrics = [
  { label: 'Total Escrow', value: 'NGN 1.48B', change: '+12.4%', accent: 'bg-[#621063]' },
  { label: 'Pending KYC', value: '184', change: '-8.1%', accent: 'bg-[#E79E23]' },
  { label: 'Student SLA Queue', value: '29', change: '3 critical', accent: 'bg-[#2d3748]' },
  { label: 'Escrow Risk Flags', value: '7', change: '2 high', accent: 'bg-[#7f1d1d]' },
];

const queue = [
  { customer: 'Mary Adebayo', type: 'Student ID', eta: '12 min', status: 'Awaiting review' },
  { customer: 'Rashid Bello', type: 'Property deed', eta: '08 min', status: 'Needs title deed check' },
  { customer: 'Tosin Adeyemi', type: 'BVN & NIN', eta: '21 min', status: 'Compliance review' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 border-b border-white/10 pb-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#E79E23]">Operations overview</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Admin Console</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#621063] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[#621063]/20 transition hover:bg-[#7a2b76]">
          Review escalations
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-shell">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">{metric.label}</span>
              <span className={`h-2.5 w-2.5 rounded-full ${metric.accent}`} />
            </div>
            <p className="text-3xl font-bold text-white">{metric.value}</p>
            <p className="mt-2 text-sm text-emerald-400">{metric.change}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Priority queue</h3>
            <span className="rounded-full bg-[#621063]/20 px-2.5 py-1 text-xs text-[#E79E23]">Live</span>
          </div>
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.customer} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#191b22] p-3">
                <div>
                  <p className="font-medium text-white">{item.customer}</p>
                  <p className="text-sm text-slate-400">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#E79E23]">{item.eta}</p>
                  <p className="text-xs text-slate-400">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Settlement health</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Escrow release approvals</span>
                <span className="font-medium text-emerald-400">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Student registration SLA</span>
                <span className="font-medium text-[#E79E23]">71%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Document compliance</span>
                <span className="font-medium text-emerald-400">87%</span>
              </div>
            </div>
          </div>

          <div className="card-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Watchlist</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Manual override requests</span>
                <span className="font-medium text-[#E79E23]">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pending audit notes</span>
                <span className="font-medium text-[#E79E23]">8</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="card-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Operational summary</h3>
          <Clock3 className="h-5 w-5 text-[#E79E23]" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#161820] p-4">
            <p className="text-sm text-slate-400">Escrow freeze review</p>
            <p className="mt-2 text-2xl font-bold text-white">14</p>
          </div>
          <div className="rounded-2xl bg-[#161820] p-4">
            <p className="text-sm text-slate-400">KYC re-submissions</p>
            <p className="mt-2 text-2xl font-bold text-white">23</p>
          </div>
          <div className="rounded-2xl bg-[#161820] p-4">
            <p className="text-sm text-slate-400">New merchant onboarding</p>
            <p className="mt-2 text-2xl font-bold text-white">07</p>
          </div>
        </div>
      </div>
    </div>
  );
}
