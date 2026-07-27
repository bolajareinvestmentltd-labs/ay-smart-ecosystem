'use client';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Sign in</p>
        <h1 className="mt-2 text-3xl font-black">Access your seller or student account</h1>
        <p className="mt-3 text-sm text-zinc-400">This demo uses a lightweight local sign-in flow so you can move through the experience without leaving the app.</p>
        <div className="mt-6 space-y-3">
          <button className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-zinc-950">Continue with email</button>
          <button className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm">Continue with phone</button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Create account</Link>
          <Link href="/" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Back home</Link>
        </div>
      </div>
    </main>
  );
}
