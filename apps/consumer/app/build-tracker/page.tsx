'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/auth';

type Milestone = { id: number; title: string; is_completed: boolean; site_photo_url?: string; completion_date?: string };
type Project = { id: number; project_title: string; client_name: string; total_budget: string | number; current_phase: string; progress_percentage: number; last_updated: string; milestones: Milestone[] };

export default function BuildTrackerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/build-tracker/').then(async (response) => {
      if (response.ok) { const payload = await response.json(); setProjects(Array.isArray(payload) ? payload : []); }
    }).finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-[var(--brand-surface)] px-4 py-8 pb-32 text-[var(--text-primary)]"><div className="mx-auto max-w-5xl space-y-6"><header><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4e235f]">Construction</p><h1 className="mt-2 text-3xl font-black">Build progress tracker</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Follow verified project phases, milestones, and site updates.</p></header>{loading ? <p className="rounded-2xl bg-white/80 p-6 text-sm text-[var(--text-muted)]">Loading project updates...</p> : projects.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white/70 p-10 text-center"><p className="font-bold">No construction projects assigned</p><p className="mt-2 text-sm text-[var(--text-muted)]">Project updates will appear here when an administrator assigns a build project.</p><Link href="/support" className="mt-4 inline-block rounded-xl bg-[#4e235f] px-4 py-2 text-sm font-bold text-white">Contact support</Link></div> : projects.map((project) => <section key={project.id} className="space-y-5 rounded-[1.5rem] border border-[var(--brand-border)] bg-white/80 p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-black">{project.project_title}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Client: {project.client_name} · Current phase: {project.current_phase}</p></div><span className="rounded-full bg-[#f9efe9] px-3 py-1 text-sm font-bold text-[#4e235f]">{project.progress_percentage}%</span></div><div className="h-3 overflow-hidden rounded-full bg-[#f0e6df]"><div className="h-full rounded-full bg-[#4e235f] transition-all" style={{ width: `${Math.min(100, Math.max(0, project.progress_percentage))}%` }} /></div><p className="text-sm text-[var(--text-muted)]">Budget: ₦{Number(project.total_budget).toLocaleString()} · Updated {new Date(project.last_updated).toLocaleDateString()}</p><div className="space-y-2">{project.milestones.map((milestone) => <div key={milestone.id} className="flex items-start gap-3 rounded-xl border border-[var(--brand-border)] p-3"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${milestone.is_completed ? 'bg-emerald-600 text-white' : 'bg-[#f9efe9] text-[#4e235f]'}`}>{milestone.is_completed ? '✓' : '·'}</span><div><p className="text-sm font-semibold">{milestone.title}</p>{milestone.completion_date && <p className="mt-1 text-xs text-[var(--text-muted)]">Completed {new Date(milestone.completion_date).toLocaleDateString()}</p>}{milestone.site_photo_url && <a href={milestone.site_photo_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-[#4e235f]">View site update</a>}</div></div>)}</div></section>)}</div></main>;
}
