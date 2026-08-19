'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ribbonMessages = [
  'Student deposits are verified instantly and reflected in the live trust feed.',
  'First 50 students receive priority accommodation access with premium support.',
  'Every commitment and transaction is updated transparently in real time.',
  'AY&apos;SMART ECO brings verified listings, fast onboarding, and trusted service together.',
];

export default function BrandSplashScreen() {
  const [activeMessage, setActiveMessage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % ribbonMessages.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(78,35,95,0.18),_transparent_24%),linear-gradient(180deg,_#f8f2ee_0%,_#efdfd7_100%)] text-[#241b2e]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.38),_transparent_30%,_rgba(78,35,95,0.06))]" />

      <div className="absolute inset-x-0 top-0 z-10 border-b border-[#4e235f]/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#4e235f] sm:px-6">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#f1b8a5]" />
          <span className="flex-1 overflow-hidden whitespace-nowrap text-[#5d5865]">
            <span className="inline-block animate-[marquee_16s_linear_infinite]">
              {ribbonMessages[activeMessage]} &nbsp;&nbsp;•&nbsp;&nbsp; {ribbonMessages[(activeMessage + 1) % ribbonMessages.length]}
            </span>
          </span>
        </div>
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="brand-card relative w-full max-w-[420px] overflow-hidden rounded-[2.2rem] bg-[#fbf7f3]/90 p-5 shadow-[0_30px_80px_rgba(78,35,95,0.14)] backdrop-blur-md sm:p-6">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#fdf4f1] to-transparent" />

          <div className="relative z-10 flex flex-col items-center justify-center pt-8">
            <div className="brand-orb relative flex h-32 w-32 items-center justify-center rounded-full border border-[#4e235f]/10 bg-[radial-gradient(circle,_rgba(241,184,165,0.45),_rgba(255,255,255,0.94)_60%,_rgba(255,255,255,0.78)_100%)] shadow-[0_12px_30px_rgba(78,35,95,0.12)]">
              <div className="brand-ring absolute inset-1 rounded-full border border-dashed border-[#4e235f]/20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/80 ring-1 ring-[#4e235f]/10">
                <Image src="/assets/ay-smart-logo.png" alt="AYSMART ECO" width={72} height={72} className="object-contain" priority />
              </div>
            </div>

            <h1 className="mt-8 text-[2.2rem] font-black tracking-[-0.08em] text-[#261a2a]">A Y</h1>

            <div className="mt-4 w-full">
              <div className="h-2 overflow-hidden rounded-full bg-[#f5d8cb]">
                <div className="h-full w-[48%] rounded-full bg-gradient-to-r from-[#f1b8a5] via-[#d68cba] to-[#4e235f] transition-all duration-700 ease-out" />
              </div>
            </div>

            <p className="mt-7 text-center text-[13px] font-medium uppercase tracking-[0.26em] text-[#4e235f]">
              Initializing secure connection
            </p>

            <div className="mt-8 grid w-full grid-cols-2 gap-3">
              <Link href="/auth/login" className="rounded-2xl border border-[#4e235f]/20 bg-white/70 px-4 py-3 text-center text-sm font-bold text-[#4e235f] transition hover:bg-white">
                Sign in
              </Link>
              <Link href="/register" className="rounded-2xl bg-[#4e235f] px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#4e235f]/20 transition hover:bg-[#6d3b7d]">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
