import { CircleAlert, Clock3, GraduationCap } from 'lucide-react';

const rows = [
  { student: 'Ayo Lawal', course: 'Engineering Registration', deadline: '42 min', stage: 'ID verification' },
  { student: 'Mercy Nwosu', course: 'Business Admin', deadline: '18 min', stage: 'Course approval' },
  { student: 'Femi Okoye', course: 'Data Analytics', deadline: '57 min', stage: 'Escrow validation' },
];

export default function StudentSlaPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#E79E23]">Student operations</p>
          <h2 className="mt-2 text-3xl font-bold text-white">60-minute SLA desk</h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E79E23]/30 bg-[#1a111a] px-3 py-2 text-sm text-[#E79E23]">
          <Clock3 className="h-4 w-4" />
          7 at-risk cases
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-shell">
          <p className="text-sm text-slate-400">Average response</p>
          <p className="mt-2 text-3xl font-bold text-white">18 min</p>
        </div>
        <div className="metric-shell">
          <p className="text-sm text-slate-400">Completed today</p>
          <p className="mt-2 text-3xl font-bold text-white">126</p>
        </div>
        <div className="metric-shell">
          <p className="text-sm text-slate-400">Escalated</p>
          <p className="mt-2 text-3xl font-bold text-white">11</p>
        </div>
      </section>

      <div className="card-surface overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1.2fr_0.8fr_0.8fr] border-b border-white/10 bg-[#171b22] px-5 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Student</span>
          <span>Course</span>
          <span>Deadline</span>
          <span>Stage</span>
        </div>

        {rows.map((row) => (
          <div key={row.student} className="grid grid-cols-[1.3fr_1.2fr_0.8fr_0.8fr] items-center border-b border-white/10 px-5 py-4 text-sm text-slate-200 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#621063]/20 text-[#E79E23]">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span>{row.student}</span>
            </div>
            <span>{row.course}</span>
            <span className="inline-flex items-center gap-2 text-[#E79E23]">
              <Clock3 className="h-4 w-4" />
              {row.deadline}
            </span>
            <span className="inline-flex items-center gap-2 text-amber-300">
              <CircleAlert className="h-4 w-4" />
              {row.stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
