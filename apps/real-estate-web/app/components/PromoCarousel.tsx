"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { API } from "../config/site";

type Promotion = {
  id: number;
  title: string;
  subtitle: string;
  discount_text: string;
  cta_text: string;
  target_url: string | null;
};

export default function PromoCarousel() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadPromotions() {
      try {
        const res = await fetch(`${API.base}/promotions/`);
        if (!res.ok) return;
        const data = (await res.json()) as Promotion[];
        setPromos(data);
      } catch {
        // ignore failures for now; frontend should still render core hero content
      }
    }

    loadPromotions();
  }, []);

  useEffect(() => {
    if (!promos.length) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % promos.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [promos]);

  const activePromo = promos[activeIndex];
  const hasPromo = promos.length > 0;

  const cards = useMemo(
    () => promos.map((promo, index) => (
      <article
        key={promo.id}
        className={`min-w-[20rem] max-w-[24rem] rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl transition duration-500 ${index === activeIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}
      >
        <p className="text-[10px] uppercase tracking-[0.32em] text-brand-accent">{promo.discount_text}</p>
        <h3 className="mt-3 text-lg font-black text-white">{promo.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{promo.subtitle}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          {promo.target_url ? (
            <Link href={promo.target_url} className="rounded-full border border-brand-purple/30 bg-brand-purple/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-purple transition hover:bg-brand-purple/20">
              {promo.cta_text || 'Learn more'}
            </Link>
          ) : (
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              {promo.cta_text || 'Learn more'}
            </span>
          )}
          <div className="flex gap-2">
            {promos.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                className={`h-2.5 w-2.5 rounded-full transition ${dotIndex === activeIndex ? 'bg-brand-magenta' : 'bg-white/20'}`}
                aria-label={`Show promotion ${dotIndex + 1}`}
                onClick={() => setActiveIndex(dotIndex)}
              />
            ))}
          </div>
        </div>
      </article>
    )),
    [promos, activeIndex]
  );

  if (!hasPromo) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#0b0b12]/80 p-5 shadow-[0_35px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 sm:flex-nowrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-brand-accent">Limited-time offers</p>
          <h2 className="mt-2 text-xl font-black text-white">Student discounts & agent incentives</h2>
        </div>
        <div className="text-sm text-zinc-400">
          Small carousel cards managed from Django admin.
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 pt-4 scrollbar-none">
        {cards}
      </div>
      {activePromo && (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          <p>
            <strong>{activePromo.discount_text}:</strong> {activePromo.title}
          </p>
        </div>
      )}
    </section>
  );
}
