'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredHostelRequests, saveStoredHostelRequests, type HostelRequest } from '../lib/app-state';

export default function HostelPage() {
  const [fullName, setFullName] = useState('');
  const [matriculationNumber, setMatriculationNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [academicLevel, setAcademicLevel] = useState('100L');
  const [requests, setRequests] = useState<HostelRequest[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setRequests(getStoredHostelRequests());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextRequest: HostelRequest = {
      id: Date.now(),
      fullName,
      matriculationNumber,
      institution,
      academicLevel,
      createdAt: new Date().toLocaleString(),
    };
    const nextRequests = [nextRequest, ...requests];
    setRequests(nextRequests);
    saveStoredHostelRequests(nextRequests);
    setMessage('Application submitted. Your hostel request is now pending review.');
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Student hostel portal</p>
          <h1 className="mt-2 text-3xl font-black">Hostel accommodation request</h1>
          <p className="mt-2 text-sm text-zinc-400">Fill in your matric number, institution, and academic level for a fast hostel application flow.</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Full name" />
            <input required value={matriculationNumber} onChange={(e) => setMatriculationNumber(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Matriculation number" />
            <input required value={institution} onChange={(e) => setInstitution(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Institution name" />
            <select value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level</option>
            </select>
            <button className="md:col-span-2 rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950">Submit hostel request</button>
          </form>

          {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <h2 className="text-xl font-black">Recent requests</h2>
          <div className="mt-4 space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm">
                <p className="font-semibold">{request.fullName}</p>
                <p className="text-zinc-400">{request.matriculationNumber} • {request.institution} • {request.academicLevel}</p>
                <p className="mt-2 text-xs text-zinc-500">Submitted {request.createdAt}</p>
              </div>
            ))}
            {!requests.length && <p className="text-sm text-zinc-500">No requests yet.</p>}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Register</Link>
          <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Open dashboard</Link>
        </div>
      </div>
    </main>
  );
}
