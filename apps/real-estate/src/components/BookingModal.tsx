"use client";

import React, { useState } from "react";
import { Property } from "../lib/api";
import { X, Calendar, User, Phone, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

interface ModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function BookingModal({ property, onClose }: ModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

  if (!property) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!property) {
      setErrorMessage("Please select a valid property before booking.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${apiUrl}/inspections/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property: property.id,
          client_name: clientName,
          client_phone: clientPhone,
          preferred_date: inspectionDate,
          status: "PENDING",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking. Please check your network connection.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-16 h-16 text-amber-400 animate-bounce mb-4" />
            <h3 className="text-2xl font-black text-white">Inspection Confirmed!</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">
              Your VIP physical walkthrough for <span className="text-amber-400 font-semibold">{property.title}</span> has been logged into AY'SMART central administration. An executive agent will call you shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> VIP Walkthrough Booking
              </span>
              <h3 className="text-2xl font-extrabold text-white line-clamp-1">{property.title}</h3>
              <p className="text-slate-400 text-xs mt-1">
                Outright Price: <span className="text-amber-400 font-bold">₦{Number(property.price).toLocaleString()}</span>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Aliko Dangote"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 800 000 0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Preferred Walkthrough Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting to Central Admin...
                  </>
                ) : (
                  "Confirm Walkthrough Inspection →"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
