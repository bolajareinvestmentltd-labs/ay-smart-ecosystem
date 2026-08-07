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

const trustPoints = [
  {
    title: 'Verified confidence',
    text: 'Every listing and onboarding step is designed to feel secure, clear, and premium.',
  },
  {
    title: 'Fast accommodation access',
    text: 'The first 50 students are prioritized for premium hostel and apartment placement.',
  },
  {
    title: 'Transparent updates',
    text: 'Commitments and payments are shown in a live ribbon so trust stays visible at all times.',
  },
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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(94,40,121,0.28),_transparent_32%),linear-gradient(135deg,_#FBF0E7_0%,_#EBD9C8_100%)] text-[#382419]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.42),_transparent_30%,_rgba(94,40,121,0.10))]" />

      <div className="absolute inset-x-0 top-0 z-10 border-b border-[#5E2879]/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5E2879] sm:px-6">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#B45309]" />
          <span className="flex-1 overflow-hidden whitespace-nowrap text-[#6E5847]">
            <span className="inline-block animate-[marquee_16s_linear_infinite]">
              {ribbonMessages[activeMessage]} &nbsp;&nbsp;•&nbsp;&nbsp; {ribbonMessages[(activeMessage + 1) % ribbonMessages.length]}
            </span>
          </span>
        </div>
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#5E2879]/10 bg-[#fffaf5]/85 p-6 shadow-[0_40px_120px_rgba(94,40,121,0.16)] backdrop-blur-2xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#5E2879]/15 bg-[#5E2879]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#5E2879]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B45309]" />
                Premium lifestyle marketplace
              </div>

              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#5E2879]/15 bg-white/70 shadow-[0_20px_60px_rgba(94,40,121,0.12)] splash-logo">
                <Image src="/assets/ay-smart-logo.png" alt="AY'SMART ECO logo" width={92} height={92} className="rounded-full object-contain" priority />
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#2F1A11] sm:text-5xl lg:text-6xl">
                AY&apos;SMART ECO
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6E5847] sm:text-lg">
                A calm, elegant gateway to verified properties, student accommodation, premium support, and secure commitments — all in one trusted experience.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-[#5E2879]/10 bg-[#5E2879]/8 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B45309]">First 50 students</p>
                  <p className="mt-2 text-3xl font-black text-[#5E2879]">15% off</p>
                  <p className="mt-1 text-sm text-[#6E5847]">Priority access to premium accommodation offers.</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#5E2879]/10 bg-white/70 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B45309]">Trusted flow</p>
                  <p className="mt-2 text-3xl font-black text-[#2F1A11]">100%</p>
                  <p className="mt-1 text-sm text-[#6E5847]">Transparent commitments and payment updates.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/" className="rounded-full bg-[#5E2879] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5E2879]/20 transition hover:-translate-y-0.5 hover:bg-[#8C2F8F]">
                  Enter marketplace
                </Link>
                <Link href="/auth/login" className="rounded-full border border-[#5E2879]/15 bg-white/70 px-5 py-3 text-sm font-semibold text-[#5E2879] transition hover:border-[#B45309] hover:text-[#B45309]">
                  Sign in / continue
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-[#5E2879]/15 via-[#8C2F8F]/10 to-[#B45309]/10" />
              <div className="relative rounded-[1.5rem] border border-[#5E2879]/10 bg-white/75 p-6 shadow-[0_20px_60px_rgba(94,40,121,0.12)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B45309]">Why people trust AY&apos;SMART</p>
                    <h2 className="mt-2 text-xl font-black text-[#2F1A11]">Premium service, clear updates, and a smooth experience.</h2>
                  </div>
                  <div className="rounded-full border border-[#5E2879]/15 bg-[#5E2879]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5E2879]">
                    Secure & refined
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {trustPoints.map((point) => (
                    <div key={point.title} className="rounded-[1.1rem] border border-[#5E2879]/10 bg-[#FBF0E7]/70 p-4">
                      <p className="text-sm font-semibold text-[#2F1A11]">{point.title}</p>
                      <p className="mt-1 text-sm leading-7 text-[#6E5847]">{point.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.15rem] border border-[#5E2879]/10 bg-[#5E2879]/10 p-4 text-sm text-[#5E2879]">
                  <p className="font-semibold">Live trust ribbon</p>
                  <p className="mt-1 leading-7 text-[#6E5847]">
                    Every commitment, deposit, and transaction update appears instantly here and in the ribbon above for a polished and reassuring experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
