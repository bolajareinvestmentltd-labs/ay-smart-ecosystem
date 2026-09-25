'use client';

export default function VerifyEmailLoading() {
  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-[#09090B]/80 p-10 shadow-2xl">
        <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 h-8 w-56 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/10" />
      </div>
    </main>
  );
}
