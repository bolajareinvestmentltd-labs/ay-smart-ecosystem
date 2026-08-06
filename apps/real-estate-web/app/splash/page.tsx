import Image from 'next/image';
import Link from 'next/link';

export default function SplashPage() {
  return (
    <main className="min-h-screen bg-[#07070D] text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#09090B]/90 p-10 text-center shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-brand-purple/20 ring-1 ring-brand-purple/40">
            <Image src="/assets/ay-smart-logo.jpeg" alt="AY'SMART logo" width={96} height={96} className="rounded-full object-contain" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">AY&apos;SMART ECO</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-300">A smarter way to manage real estate listings, student hostels, verified agents, and payments in one polished marketplace.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="rounded-full bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-magenta">Enter marketplace</Link>
            <Link href="/auth/login" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-accent">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
