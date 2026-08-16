'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authFetch } from '../../lib/auth';
import { buildApiUrl } from '../../lib/api';

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
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-accent">Hostel Detail</p>
            <h1 className="mt-2 text-3xl font-black">{hostel.name}</h1>
          </div>
          <Link
            href="/hostel"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to hostels
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image and Basic Info */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
            <img src={hostel.image} alt={hostel.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <p className="text-sm text-zinc-400">{hostel.location}</p>
              <p className="mt-2 text-2xl font-black">₦{hostel.price.toLocaleString()}/year</p>
              <p className="mt-2 text-sm text-zinc-300">{hostel.capacity}</p>
              <p className="mt-4 text-sm text-zinc-300">{hostel.description}</p>
            </div>
          </div>

          {/* Amenities and Booking */}
          <div className="space-y-4">
            {/* Amenities */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
              <h2 className="text-lg font-black">Amenities</h2>
              <ul className="mt-3 space-y-2">
                {hostel.amenities?.map((amenity, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                    <span>✓</span> {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rules */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
              <h2 className="text-lg font-black">House Rules</h2>
              <ul className="mt-3 space-y-2">
                {hostel.rules?.map((rule, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                    <span>•</span> {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-lg font-black">Book Inspection</h2>
          {bookingStatus === 'success' || (bookingId !== null && adminResponse === 'PENDING') ? (
            <div className="mt-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 p-4">
              <p className="text-blue-300">📅 Inspection booking submitted. Admin will review and respond within 24 hours.</p>
              <p className="mt-2 text-sm text-zinc-400">You will receive email notification when admin responds.</p>
            </div>
          ) : bookingId !== null && adminResponse === 'REJECTED' ? (
            <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/30 p-4">
              <p className="text-red-300">❌ Admin has rejected your inspection request.</p>
              <button
                onClick={() => {
                  setBookingId(null);
                  setAdminResponse('PENDING');
                  setBookingMessage('');
                  setBookingStatus('idle');
                }}
                className="mt-3 rounded-full bg-brand-purple px-4 py-2 text-sm font-bold text-white"
              >
                Book Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookInspection} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234 800 000 0000"
                  required
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500"
                />
              </div>
              <button
                type="submit"
                disabled={(bookingStatus as any) === 'submitting'}
                className="w-full rounded-2xl bg-brand-purple px-4 py-3 font-bold text-white transition hover:bg-brand-magenta disabled:opacity-50"
              >
                {(bookingStatus as any) === 'submitting' ? 'Booking...' : 'Book Inspection'}
              </button>
            </form>
          )}
          {bookingMessage && (
            <p className="mt-4 text-sm text-zinc-300">{bookingMessage}</p>
          )}
        </div>
      </div>

      {/* Satisfaction Popup */}
      {satisfactionPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 px-4 z-50">
          <div className="max-w-md rounded-3xl border border-zinc-700 bg-zinc-900 p-8 shadow-2xl">
            <h2 className="text-2xl font-black">Are you satisfied?</h2>
            <p className="mt-3 text-sm text-zinc-300">Admin has approved your inspection. Would you like to proceed to payment?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleNotSatisfied}
                className="flex-1 rounded-2xl border border-zinc-700 px-4 py-3 font-bold text-white transition hover:bg-zinc-800"
              >
                No, Reject
              </button>
              <button
                onClick={handleSatisfied}
                className="flex-1 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700"
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
