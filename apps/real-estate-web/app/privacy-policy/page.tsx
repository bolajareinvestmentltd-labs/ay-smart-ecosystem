import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] px-4 py-10 text-[color:var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]/90 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-accent">Privacy Policy</p>
        <h1 className="mt-3 text-3xl font-black">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-muted)]">
          AY&apos;SMART INVESTMENT LTD respects your privacy. This policy explains what information we collect, why we collect it, and how we protect it.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[color:var(--text-primary)]">
          <section>
            <h2 className="text-lg font-black">1. Information we collect</h2>
            <p className="mt-2">We collect your name, phone number, email address, account credentials, property interests, and any documents you upload for verification.</p>
          </section>
          <section>
            <h2 className="text-lg font-black">2. How we use your information</h2>
            <p className="mt-2">We use your information to operate the marketplace, verify accounts, process bookings, communicate with you, and improve the platform experience.</p>
          </section>
          <section>
            <h2 className="text-lg font-black">3. Security</h2>
            <p className="mt-2">We store sensitive data securely and access it only for legitimate business operations and compliance needs.</p>
          </section>
          <section>
            <h2 className="text-lg font-black">4. Contact</h2>
            <p className="mt-2">For privacy questions, contact support@aysmartinvestmentltd.com.</p>
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
