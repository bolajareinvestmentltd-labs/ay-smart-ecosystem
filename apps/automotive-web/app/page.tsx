import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Automotive hub</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Premium automotive experiences, curated for speed and trust.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
            Explore modern vehicle services, verified offers, and premium support in a refined experience that stays consistent with the rest of the ecosystem.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/" className="rounded-full bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-magenta">Browse services</a>
            <a href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-accent hover:text-brand-accent">View plans</a>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Why it feels premium</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Fast browsing', text: 'A concise, polished experience for quick decisions.' },
                { title: 'Trusted support', text: 'Reliable guidance for every step of the journey.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-[#09090B]/70 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Ad-ready placement</p>
            <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-[#09090B]/70 p-4">
              <p className="text-sm font-semibold text-white">Sponsored space</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">A neutral, readable slot that stays clear of navigation and primary actions.</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
