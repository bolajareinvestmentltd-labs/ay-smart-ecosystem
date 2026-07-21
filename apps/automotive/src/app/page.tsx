import React from "react";
import { getVehicles } from "../lib/api";
import VehicleCarousel from "../components/VehicleCarousel";

export default async function AutomotiveLandingPage() {
  const vehicles = await getVehicles();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <section className="max-w-7xl mx-auto pt-4">
        <VehicleCarousel vehicles={vehicles} />
      </section>

      {/* Ecosystem Switcher Banner pointing back to Real Estate on Port 3000 */}
      <section className="max-w-7xl mx-auto my-12 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Unified Ecosystem</span>
          <h3 className="text-2xl font-extrabold text-white mt-1">Looking for Landed Properties or Homes?</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Switch to our Real Estate division to explore landed properties, book walkthrough inspections, or track your custom building project from ground up!
          </p>
        </div>
        <a
          href="http://localhost:3000"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 whitespace-nowrap"
        >
          Explore Real Estate Division →
        </a>
      </section>
    </main>
  );
}
