"use client";

import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Property } from "../lib/api";
import { Sparkles, MapPin, Compass } from "lucide-react";
import BookingModal from "./BookingModal";

interface CarouselProps {
  properties: Property[];
}

export default function PropertyCarousel({ properties }: CarouselProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  if (!properties || properties.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-900 flex items-center justify-center text-white rounded-2xl border border-slate-800">
        <p className="animate-pulse text-lg font-semibold text-amber-400">Loading AY'SMART Luxury Properties...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden rounded-3xl border border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AY'SMART INVESTMENT LTD • REAL ESTATE DIVISION
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-200 bg-clip-text text-transparent">
            Build Your Dream Home From Scratch
          </h2>
        </div>
        <p className="text-slate-400 text-sm md:text-base mt-2 md:mt-0 max-w-md">
          International-standard property development, sales, and leasing with automated physical inspection booking.
        </p>
      </div>

      <div className="max-w-7xl mx-auto overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex-[0_0_100%] md:flex-[0_0_48%] lg:flex-[0_0_31%] relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-500 hover:border-amber-500/50 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-80 w-full overflow-hidden">
                  <img
                    src={property.main_image_url}
                    alt={property.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-amber-400 font-bold text-xs rounded-lg uppercase tracking-wider border border-slate-700">
                      {property.property_type_display || property.property_type}
                    </span>
                    {property.virtual_tour_url && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white font-semibold text-xs rounded-lg shadow-lg">
                        <Compass className="w-3.5 h-3.5 animate-spin" /> 360° Tour
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 relative z-10 -mt-16">
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{property.location_address}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 line-clamp-1">
                    {property.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Outright Price</p>
                  <p className="text-2xl font-black text-amber-400">
                    ₦{Number(property.price).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProperty(property)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Book Inspection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Walkthrough Booking Modal */}
      <BookingModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
    </div>
  );
}
