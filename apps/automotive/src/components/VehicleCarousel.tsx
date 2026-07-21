"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Vehicle } from "../lib/api";
import { Sparkles, MapPin, QrCode, ShieldCheck, Car } from "lucide-react";

interface CarouselProps {
  vehicles: Vehicle[];
}

export default function VehicleCarousel({ vehicles }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-900 flex items-center justify-center text-white rounded-3xl border border-slate-800 shadow-2xl">
        <p className="animate-pulse text-lg font-bold text-blue-400 flex items-center gap-2">
          <Car className="w-6 h-6 animate-bounce" /> Loading AY'SMART Premium Fleet...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden rounded-3xl border border-slate-800/80 shadow-2xl">
      {/* Brand Header Overlay */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AY'SMART INVESTMENT LTD • AUTOMOTIVE DIVISION
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            Drive Premium: Hire or Buy Outright
          </h2>
        </div>
        <p className="text-slate-400 text-sm md:text-base mt-2 md:mt-0 max-w-md">
          International-standard vehicle hire and sales with automated QR Code branch pickup vouchers and verified inspection.
        </p>
      </div>

      {/* Auto-Scrolling Carousel Viewport */}
      <div className="max-w-7xl mx-auto overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-6">
          {vehicles.map((car) => (
            <div
              key={car.id}
              className="flex-[0_0_100%] md:flex-[0_0_48%] lg:flex-[0_0_31%] relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-500 hover:border-blue-500/50"
            >
              {/* Main Image Carousel Card */}
              <div className="relative h-80 w-full overflow-hidden bg-slate-950">
                <img
                  src={car.main_image_url}
                  alt={car.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Status & Brand Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-blue-400 font-extrabold text-xs rounded-lg uppercase tracking-wider border border-slate-700">
                    {car.brand}
                  </span>
                  <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs rounded-lg shadow-lg">
                    {car.status_display}
                  </span>
                </div>
              </div>

              {/* Vehicle Details Overlay */}
              <div className="p-6 relative z-10 -mt-16">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1 text-blue-400 font-semibold">
                    <QrCode className="w-3.5 h-3.5" /> QR Pickup Ready
                  </span>
                  <span>Model Year: {car.model_year}</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                  {car.title}
                </h3>

                {car.assigned_branch_details && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" /> Branch: {car.assigned_branch_details.name}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div>
                    {car.daily_hire_rate ? (
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Daily Hire Rate</p>
                        <p className="text-xl font-black text-blue-400">
                          ₦{Number(car.daily_hire_rate).toLocaleString()} <span className="text-xs font-normal text-slate-400">/day</span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Outright Price</p>
                        <p className="text-xl font-black text-emerald-400">
                          ₦{Number(car.outright_price).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30">
                    Book & Checkout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
