import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-10 text-[color:var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]/90 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-accent">Terms of Service</p>
        <h1 className="mt-3 text-3xl font-black">Terms of Service</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-muted)]">
          By using AY&apos;SMART INVESTMENT LTD services, you agree to use the platform lawfully and responsibly.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[color:var(--text-primary)]">
          <section>
            <h2 className="text-lg font-black">1. Use of the platform</h2>
            <p className="mt-2">Users may browse listings, request inspections, and interact with verified agents. Any misuse, fraud, or abusive behavior may lead to account restrictions.</p>
          </section>
          <section>
            <h2 className="text-lg font-black">2. Payments and listings</h2>
            <p className="mt-2">Listing fees and other platform charges are governed by the pricing plans and admin approval workflow. Refund terms are set by the platform policy.</p>
          </section>
          <section>
            <h2 className="text-lg font-black">3. Limitation of liability</h2>
            <p className="mt-2">AY&apos;SMART provides a marketplace platform and is not responsible for disputes between users and third-party agents beyond the platform&apos;s reasonable control.</p>
          </section>
        </div>

        <div className="mt-8">
          <Link href="/" className="rounded-full bg-brand-purple px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-magenta">
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
