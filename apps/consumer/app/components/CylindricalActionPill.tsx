'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, X, Lock } from 'lucide-react';

interface CylindricalActionPillProps {
  label?: string;
  price?: string;
  propertyTitle?: string;
  onAction?: () => void;
  className?: string;
}

export default function CylindricalActionPill({
  label = 'Pay Now',
  price = '₦45,000,000',
  propertyTitle = 'Luxury Smart Apartment',
  onAction,
  className = '',
}: CylindricalActionPillProps) {
  const [showModal, setShowModal] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleTrigger = () => {
    if (onAction) {
      onAction();
    } else {
      setShowModal(true);
    }
  };

  const handleConfirmPay = () => {
    setPaid(true);
    setTimeout(() => {
      setPaid(false);
      setShowModal(false);
    }, 2000);
  };

  return (
    <>
      {/* Sleek Floating Cylindrical Action Pill Container (Exact Reference Image 5 Style) */}
      <div className={`relative ${className}`}>
        <div
          onClick={handleTrigger}
          className="group relative flex items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-[#120a1f]/95 hover:bg-[#190d2c] border border-white/20 text-white shadow-2xl shadow-purple-950/80 cursor-pointer backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50"
        >
          {/* Action text */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-purple-200 transition">
              {label}
            </span>
          </div>

          {/* Price Tag in Center / Right */}
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-black text-[#e79e23] tracking-tight">
              {price}
            </span>

            {/* Circular Purple Arrow Action Button */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#621063] via-[#9333ea] to-[#a855f7] flex items-center justify-center text-white shadow-lg group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all">
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-[#160a28] p-6 sm:p-8 shadow-2xl relative text-white">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                AY’SMART Escrow Guarantee
              </span>
            </div>

            <h4 className="text-xl font-black text-white">
              Instant Secure Deposit
            </h4>
            <p className="text-xs text-white/60 mt-1">
              Funds remain protected in verified escrow until deed verification & inspection clearance.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Asset:</span>
                <strong className="text-white font-bold truncate max-w-[200px]">{propertyTitle}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Payable Amount:</span>
                <strong className="text-sm font-black text-[#e79e23]">{price}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Escrow Security Fee:</span>
                <span className="text-emerald-400 font-semibold">₦0 (Waived)</span>
              </div>
            </div>

            {!paid ? (
              <button
                type="button"
                onClick={handleConfirmPay}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#621063] via-[#9333ea] to-[#e79e23] text-xs font-bold text-white uppercase tracking-wider shadow-xl hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" /> Authorize Escrow Checkout
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Escrow Deposit Secured! Redirecting...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
