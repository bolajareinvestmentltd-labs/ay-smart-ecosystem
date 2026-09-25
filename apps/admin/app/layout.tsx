import './globals.css';
import type { Metadata } from 'next';
import { BarChart3, ShieldCheck, Users, Wallet, ClipboardCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SMART ASSETZ Admin',
  description: 'Desktop operations portal for escrow, verification, moderation, and SLA oversight.',
};

const navItems = [
  { label: 'Dashboard', href: '/', icon: BarChart3 },
  { label: 'Verification', href: '/verification', icon: ShieldCheck },
  { label: 'Student SLA', href: '/student-sla', icon: Users },
  { label: 'Moderation', href: '/moderation', icon: ClipboardCheck },
  { label: 'Audit', href: '/audit', icon: Wallet },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#0B0A0D] text-slate-100">
          <div className="mx-auto flex max-w-[1800px]">
            <aside className="hidden w-72 border-r border-white/10 bg-[#0F0D12] p-5 lg:block">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_top,_#7a2b76,_#621063_60%,_#3a0c40)] text-lg font-bold text-white shadow-[0_12px_30px_rgba(98,16,99,0.5)]">
                  S
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#E79E23]">SMART</p>
                  <h1 className="text-xl font-semibold text-white">ASSETZ</h1>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map(({ label, href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-300 transition hover:border-[#621063]/60 hover:bg-[#17121c] hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-[#E79E23]" />
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-10 rounded-2xl border border-[#E79E23]/20 bg-[#1a111a] p-4">
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#E79E23]">Ops status</p>
                <p className="mt-2 text-2xl font-bold text-white">96.4%</p>
                <p className="mt-1 text-sm text-slate-300">All critical queues stable</p>
              </div>
            </aside>

            <main className="flex-1 bg-[#0B0A0D] p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
