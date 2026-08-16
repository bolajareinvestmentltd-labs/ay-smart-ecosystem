'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authFetch } from '../../lib/auth';
import { buildApiUrl } from '../../lib/api';
import { MapPin, Star, Bookmark, Bed, Bath, Zap, Home, Clock, Phone, Mail, ArrowLeft, Share2 } from 'lucide-react';

interface HostelDetail {
  id: number;
  name: string;
  location: string;
  price: number;
  capacity: string;
  description: string;
  image: string;
  amenities?: string[];
  rules?: string[];
}

const HOSTEL_DETAILS: Record<number, HostelDetail> = {
  1: {
    id: 1,
    name: 'Royal Crown Hostel',
    location: 'Abuja Gwarinpa',
    price: 180000,
    capacity: 'Single room',
    description: 'Private study lounge, fast Wi-Fi, and 24/7 security ideal for serious students.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    amenities: ['Private Study Lounge', 'Fast Wi-Fi', '24/7 Security', 'Air Conditioning', 'Hot Water', 'Laundry Service'],
    rules: ['Quiet hours: 10 PM - 7 AM', 'No visitors after 9 PM', 'Monthly cleaning included', 'Electricity included in rent'],
  },
  2: {
    id: 2,
    name: 'Metro Lodge',
    location: 'Lagos Yaba',
    price: 145000,
    capacity: 'Shared apartment',
    description: 'Clean and quiet apartments close to main campuses and transport links.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    amenities: ['Shared Kitchen', 'Common Room', 'Gym Access', 'Cafeteria', 'Generator Backup'],
    rules: ['Shared bathroom', 'No pets allowed', 'Weekly waste collection', 'Community events monthly'],
  },
  3: {
    id: 3,
    name: 'Harbor Terrace',
    location: 'Port Harcourt',
    price: 160000,
    capacity: 'Studio room',
    description: 'Premium student-friendly rooms with laundry, cafeteria, and inspection-ready setup.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    amenities: ['Private Bathroom', 'Kitchenette', 'Work Desk', 'DSTV', 'Parking Space'],
    rules: ['No noise after 11 PM', 'Furnished room', 'Maintenance response within 24h', 'Security deposit refundable'],
  },
};

export default function HostelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const hostelId = params?.id ? Number(params.id) : null;
  const [hostel, setHostel] = useState<HostelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [bookingMessage, setBookingMessage] = useState('');
  const [satisfactionPopup, setSatisfactionPopup] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [adminResponse, setAdminResponse] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING');

  useEffect(() => {
    if (!hostelId) {
      setLoading(false);
      return;
    }

    const selectedHostel = HOSTEL_DETAILS[hostelId];
    if (selectedHostel) {
      setHostel(selectedHostel);

      // Check for existing inspection booking
      const checkBooking = async () => {
        try {
          const res = await authFetch(buildApiUrl(`/inspections/?hostel=${hostelId}`));
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
              const latestBooking = data[0];
              setBookingId(latestBooking.id);
              setAdminResponse(latestBooking.agent_response || 'PENDING');
              
              // Show satisfaction popup if admin approved
              if (latestBooking.agent_response === 'ACCEPTED') {
                setSatisfactionPopup(true);
              }
            }
          }
        } catch (err) {
          console.log('Could not fetch booking status');
        } finally {
          setLoading(false);
        }
      };

      checkBooking();
    } else {
      setLoading(false);
    }
  }, [hostelId]);

  async function handleBookInspection(e: React.FormEvent) {
    e.preventDefault();
    setBookingStatus('submitting');

    try {
      const res = await authFetch(buildApiUrl('/inspections/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostel_id: hostelId,
          hostel_name: hostel?.name,
          preferred_date: new Date().toISOString().split('T')[0],
          client_phone: (e.target as any).phone?.value || '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingId(data.id);
        setBookingMessage('✅ Inspection booked! Admin will respond within 24 hours.');
        setAdminResponse('PENDING');
        setBookingStatus('success');
      } else {
        const error = await res.json().catch(() => ({}));
        setBookingMessage(`❌ Booking failed: ${error.detail || 'Please try again'}`);
        setBookingStatus('error');
      }
    } catch (error) {
      setBookingMessage(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      setBookingStatus('error');
    }
  }

  async function handleSatisfied() {
    setSatisfactionPopup(false);
    // Redirect to checkout with hostel details
    router.push(`/checkout?hostel=${hostelId}&hostelName=${encodeURIComponent(hostel?.name || '')}&amount=${hostel?.price || 0}`);
  }

  function handleNotSatisfied() {
    setSatisfactionPopup(false);
    setBookingMessage('⚠️ You have rejected this hostel. You can book inspection for another hostel.');
    setBookingStatus('idle');
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white">Hostel not found</h1>
          <div className="mt-6">
            <Link href="/hostel" className="rounded-full bg-brand-purple px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-purple/20 transition hover:bg-brand-magenta">
              Back to hostels
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[color:var(--brand-surface)] pb-32">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--brand-border)] bg-[color:var(--brand-surface-2)]/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link href="/hostel" className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/70 text-[#4e235f] transition hover:bg-white">
            ←
          </Link>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/70 text-[#4e235f] transition hover:bg-white">
            ↗
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Large Hero Image */}
        <div className="mb-6 overflow-hidden rounded-[2.2rem] border border-[color:var(--brand-border)] shadow-[0_24px_56px_rgba(46,17,54,0.12)]">
          <img src={hostel.image} alt={hostel.name} className="h-80 w-full object-cover" />
        </div>

        {/* Title & Badge */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#4e235f]">Premium Hostel</p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--text-primary)]">{hostel.name}</h1>
            </div>
            <div className="rounded-full bg-[#e8f5e9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#1f8d61]">
              Available
            </div>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <MapPin size={16} /> {hostel.location}
          </p>
        </div>

        {/* Price & Specs */}
        <div className="mb-6 rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 p-5 shadow-[0_12px_32px_rgba(46,17,54,0.08)]">
          <div className="mb-4 flex items-baseline gap-3">
            <p className="text-4xl font-black text-[#4e235f]">₦{hostel.price.toLocaleString()}</p>
            <p className="text-sm text-[var(--text-muted)]">per year</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-[1.2rem] bg-[#f9efe9] p-3 text-center">
              <Bed size={20} className="mx-auto mb-1 text-[#4e235f]" />
              <p className="text-xs font-bold text-[#4e235f]">40</p>
              <p className="text-[10px] text-[var(--text-muted)]">Rooms</p>
            </div>
            <div className="rounded-[1.2rem] bg-[#f9efe9] p-3 text-center">
              <Home size={20} className="mx-auto mb-1 text-[#4e235f]" />
              <p className="text-xs font-bold text-[#4e235f]">1,800</p>
              <p className="text-[10px] text-[var(--text-muted)]">Sqft</p>
            </div>
            <div className="rounded-[1.2rem] bg-[#f9efe9] p-3 text-center">
              <Zap size={20} className="mx-auto mb-1 text-[#4e235f]" />
              <p className="text-xs font-bold text-[#4e235f]">WiFi</p>
              <p className="text-[10px] text-[var(--text-muted)]">High-speed</p>
            </div>
            <div className="rounded-[1.2rem] bg-[#f9efe9] p-3 text-center">
              <Clock size={20} className="mx-auto mb-1 text-[#4e235f]" />
              <p className="text-xs font-bold text-[#4e235f]">24/7</p>
              <p className="text-[10px] text-[var(--text-muted)]">Support</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 p-6 shadow-[0_12px_32px_rgba(46,17,54,0.08)]">
          <h2 className="text-lg font-black text-[var(--text-primary)]">About this property</h2>
          <p className="mt-3 leading-7 text-[var(--text-muted)]">{hostel.description}</p>
        </div>

        {/* Amenities */}
        <div className="mb-6 rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 p-6 shadow-[0_12px_32px_rgba(46,17,54,0.08)]">
          <h2 className="text-lg font-black text-[var(--text-primary)]">Amenities</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {hostel.amenities?.map((amenity, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[1.2rem] bg-[#f9efe9] p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4e235f] text-xs font-bold text-white">✓</span>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{amenity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div className="mb-6 rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 p-6 shadow-[0_12px_32px_rgba(46,17,54,0.08)]">
          <h2 className="text-lg font-black text-[var(--text-primary)]">House Rules</h2>
          <ul className="mt-4 space-y-2">
            {hostel.rules?.map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#f1b8a5]/25 text-xs font-bold text-[#4e235f]">•</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Agent Contact */}
        <div className="mb-6 rounded-[1.8rem] border border-[color:var(--brand-border)] bg-gradient-to-br from-[#4e235f] to-[#6b2d82] p-6 text-white shadow-[0_12px_32px_rgba(46,17,54,0.16)]">
          <h2 className="text-lg font-black">Contact Agent</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/20" />
            <div>
              <p className="font-bold">Sarah Williams</p>
              <p className="text-sm text-white/80">International Sales Manager</p>
              <div className="mt-2 flex gap-3">
                <a href="tel:+2348000000000" className="flex items-center gap-1 text-xs font-semibold">
                  <Phone size={14} /> Call
                </a>
                <a href="mailto:agent@aysmart.com" className="flex items-center gap-1 text-xs font-semibold">
                  <Mail size={14} /> Message
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Book Inspection CTA */}
        <div className="mb-6 rounded-[1.8rem] border border-[color:var(--brand-border)] bg-white/80 p-6 shadow-[0_12px_32px_rgba(46,17,54,0.08)]">
          {bookingStatus === 'success' || (bookingId !== null && adminResponse === 'PENDING') ? (
            <div className="rounded-[1.3rem] border border-[#4caf50]/30 bg-[#e8f5e9] p-4">
              <p className="font-semibold text-[#1f8d61]">📅 Inspection booking submitted!</p>
              <p className="mt-2 text-sm text-[#388e3c]">Admin will review and respond within 24 hours. Check your email for updates.</p>
            </div>
          ) : bookingId !== null && adminResponse === 'REJECTED' ? (
            <div className="rounded-[1.3rem] border border-red-500/30 bg-red-50 p-4">
              <p className="font-semibold text-red-700">❌ Inspection request rejected.</p>
              <button
                onClick={() => {
                  setBookingId(null);
                  setAdminResponse('PENDING');
                  setBookingMessage('');
                  setBookingStatus('idle');
                }}
                className="mt-3 rounded-full bg-[#4e235f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#6b2d82]"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookInspection} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Your Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234 800 000 0000"
                  required
                  className="w-full rounded-[1.2rem] border border-[color:var(--brand-border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[#f1b8a5]"
                />
              </div>
              <button
                type="submit"
                disabled={(bookingStatus as any) === 'submitting'}
                className="w-full rounded-[1.2rem] bg-gradient-to-r from-[#4e235f] to-[#6b2d82] px-4 py-4 font-black text-white shadow-lg shadow-[#4e235f]/20 transition hover:shadow-lg disabled:opacity-50"
              >
                {(bookingStatus as any) === 'submitting' ? '⏳ Booking...' : '📋 Book Inspection'}
              </button>
            </form>
          )}
          {bookingMessage && (
            <p className="mt-4 text-sm text-[var(--text-muted)]">{bookingMessage}</p>
          )}
        </div>
      </div>

      {satisfactionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-w-md rounded-[2rem] border border-[color:var(--brand-border)] bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-[var(--text-primary)]">Are you satisfied?</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">Admin has approved your inspection. Would you like to proceed to payment?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleNotSatisfied}
                className="flex-1 rounded-2xl border border-[color:var(--brand-border)] px-4 py-3 font-bold text-[var(--text-primary)] transition hover:bg-[color:var(--brand-surface)]"
              >
                No, Reject
              </button>
              <button
                onClick={handleSatisfied}
                className="flex-1 rounded-2xl bg-[#4e235f] px-4 py-3 font-bold text-white transition hover:bg-[#6b2d82]"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
