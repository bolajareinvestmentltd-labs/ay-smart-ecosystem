import Link from "next/link";

const carouselImages = [
  {
    title: "Luxury Duplexes & Homes",
    subtitle: "Built from scratch to absolute perfection",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    badge: "Featured",
  },
  {
    title: "Commercial & Corporate Offices",
    subtitle: "Prime business locations for high-flying enterprises",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    badge: "Verified Listing",
  },
  {
    title: "Student Hostels & Apartments",
    subtitle: "Modern, secure, and fully serviced living spaces",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    badge: "Hot Deal",
  },
];

export default function RealEstateLandingPage() {
  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Premium property marketplace</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Modern real estate and automotive services in one fast ecosystem.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
            Discover premium homes, verified commercial spaces, and student hostels in one polished experience built for trust, speed, and clarity.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/properties" className="rounded-full bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-magenta">View listings</Link>
            <Link href="/hostel" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-accent hover:text-brand-accent">Browse student hostels</Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Experience preview</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {carouselImages.map((item) => (
                <div key={item.title} className="overflow-hidden rounded-[1.3rem] border border-white/10 bg-[#09090B]/70">
                  <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">{item.badge}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Quick access</p>
            <div className="mt-4 grid gap-3">
              {[
                { title: 'Hostels', href: '/hostel' },
                { title: 'Properties', href: '/properties' },
                { title: 'Verification', href: '/auth/login' },
                { title: 'Dashboard', href: '/dashboard' },
              ].map((item) => (
                <Link key={item.title} href={item.href} className="rounded-2xl border border-white/10 bg-[#09090B]/70 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-accent hover:text-brand-accent">
                  {item.title}
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Houses & Duplexes', subtitle: '12 Listings', href: '/properties' },
            { title: 'Commercial Offices', subtitle: '8 Listings', href: '/properties' },
            { title: 'Student Hostels', subtitle: '15 Listings', href: '/hostel' },
            { title: 'From-Scratch Build', subtitle: 'Custom service', href: '/plans' },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="rounded-[1.65rem] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-brand-accent/30">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-purple">{item.title}</p>
              <p className="mt-3 text-sm text-zinc-400">{item.subtitle}</p>
              <p className="mt-4 text-sm font-semibold text-white">Explore</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
