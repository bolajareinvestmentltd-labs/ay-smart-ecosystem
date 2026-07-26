import React from "react";
import { getProperties } from "../lib/api";
import PropertyCarousel from "../components/PropertyCarousel";

const AUTOMOTIVE_APP_URL = process.env.NEXT_PUBLIC_AUTOMOTIVE_APP_URL ?? "http://localhost:3001";

export default async function RealEstateLandingPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <section className="max-w-7xl mx-auto pt-4">
        <PropertyCarousel properties={properties} />
      </section>

      <section className="max-w-7xl mx-auto my-12 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Unified Ecosystem</span>
          <h3 className="text-2xl font-extrabold text-white mt-1">Looking for Luxury Vehicles?</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Switch to our Automotive division to hire or purchase premium vehicles using your unified central account. Pick up directly at any of our branch offices!
          </p>
        </div>
        <a
          href={AUTOMOTIVE_APP_URL}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 whitespace-nowrap"
        >
          Explore Motors Division →
        </a>
      </section>
    </main>
  );
}
