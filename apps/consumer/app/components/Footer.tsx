'use client';
import Link from 'next/link';
import { SITE } from '../config/site';

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-dark pb-28 text-white sm:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>© 2026 {SITE.name}. All rights reserved.</p>
        <p>Developed by <Link href="https://jclab-portfolio.vercel.app/" target="_blank" rel="noreferrer" className="font-semibold text-white underline-offset-4 hover:underline">Jare&apos;s Choice Labs (JCLs)</Link></p>
      </div>
    </footer>
  );
}
