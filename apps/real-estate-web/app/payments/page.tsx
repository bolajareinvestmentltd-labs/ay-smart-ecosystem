'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/checkout');
  }, [router]);

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] p-8 text-[var(--text-primary)]">
      <p className="mx-auto max-w-xl rounded-2xl bg-white p-5 text-center text-sm shadow-sm">Opening secure checkout...</p>
    </main>
  );
}
