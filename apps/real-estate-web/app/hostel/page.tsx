'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getStoredHostelRequests, saveStoredHostelRequests, type HostelRequest } from '../lib/app-state';

type HostelListing = {
  id: number;
  name: string;
  location: string;
  price: number;
  capacity: string;
  description: string;
  image: string;
};

const hostelListings: HostelListing[] = [
  {
    id: 1,
    name: 'Royal Crown Hostel',
    location: 'Abuja Gwarinpa',
    price: 180000,
    capacity: 'Single room',
    description: 'Private study lounge, fast Wi-Fi, and 24/7 security ideal for serious students.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Metro Lodge',
    location: 'Lagos Yaba',
    price: 145000,
    capacity: 'Shared apartment',
    description: 'Clean and quiet apartments close to main campuses and transport links.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Harbor Terrace',
    location: 'Port Harcourt',
    price: 160000,
    capacity: 'Studio room',
    description: 'Premium student-friendly rooms with laundry, cafeteria, and inspection-ready setup.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
  },
];

export default function HostelPage() {
  const [fullName, setFullName] = useState('');
  const [matriculationNumber, setMatriculationNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [academicLevel, setAcademicLevel] = useState('100L');
  const [requests, setRequests] = useState<HostelRequest[]>(() => getStoredHostelRequests());
  const [cart, setCart] = useState<HostelListing[]>([]);
  const [message, setMessage] = useState('');

  function toggleCart(hostel: HostelListing) {
    setCart((previous) => {
      const isAlreadyAdded = previous.some((item) => item.id === hostel.id);
      const nextCart = isAlreadyAdded ? previous.filter((item) => item.id !== hostel.id) : [...previous, hostel];
      setMessage(`${hostel.name} ${isAlreadyAdded ? 'removed from' : 'added to'} your shortlist.`);
      return nextCart;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart.length) {
      setMessage('Pick at least one student hostel before continuing to reservation.');
      return;
    }

    const nextRequest: HostelRequest = {
      id: Date.now(),
      fullName,
      matriculationNumber,
      institution,
      academicLevel,
      selectedHostels: cart.map((item) => item.name),
      reservationSummary: cart.map((item) => `${item.name} • ₦${item.price.toLocaleString()}`).join(' | '),
      createdAt: new Date().toLocaleString(),
    };
    const nextRequests = [nextRequest, ...requests];
    setRequests(nextRequests);
    saveStoredHostelRequests(nextRequests);
    setMessage(`Reservation request sent for ${cart.map((item) => item.name).join(', ')}.`);
    setCart([]);
    setFullName('');
    setMatriculationNumber('');
    setInstitution('');
    setAcademicLevel('100L');
  }

  return (
    <main className="min-h-screen bg-[#07070D] px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Student hostel portal</p>
          <h1 className="mt-2 text-3xl font-black">Browse hostels first, then reserve when you are ready.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Students can review available rooms, save a shortlist, and continue to signup and reservation only after they have chosen what they want to rent.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {hostelListings.map((hostel) => {
              const isSelected = cart.some((item) => item.id === hostel.id);
              return (
                <article key={hostel.id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
                  <div className="relative h-48 w-full">
                    <Image src={hostel.image} alt={hostel.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070D]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-brand-purple px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">{hostel.capacity}</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black text-white">{hostel.name}</h2>
                        <p className="mt-1 text-sm text-zinc-400">{hostel.location}</p>
                      </div>
                      <span className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-sm font-semibold text-brand-accent">₦{hostel.price.toLocaleString()}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{hostel.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link href={`/hostel/${hostel.id}`} className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-[#07070D] transition hover:opacity-90">
                        View Details
                      </Link>
                      <button onClick={() => toggleCart(hostel)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isSelected ? 'bg-brand-accent text-[#07070D]' : 'bg-brand-purple text-white hover:bg-brand-magenta'}`}>
                        {isSelected ? 'Remove from shortlist' : 'Add to shortlist'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <section className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Shortlist</p>
              <h2 className="mt-2 text-xl font-black text-white">Selected hostels</h2>
              <div className="mt-4 space-y-3">
                {cart.length ? cart.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-[#09090B]/70 p-3 text-sm">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-zinc-400">₦{item.price.toLocaleString()}</p>
                  </div>
                )) : <p className="text-sm text-zinc-400">No hostel selected yet. Add a room to build your reservation shortlist.</p>}
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-[#09090B]/70 p-4">
                <p className="text-sm text-zinc-400">Estimated total</p>
                <p className="mt-1 text-2xl font-black text-white">₦{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</p>
              </div>
            </section>

            <section id="reservation" className="scroll-mt-24 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">Signup & reservation</p>
              <h2 className="mt-2 text-xl font-black text-white">Reserve your preferred room</h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Full name" />
                <input required value={matriculationNumber} onChange={(e) => setMatriculationNumber(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Matriculation number" />
                <input required value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple" placeholder="Institution name" />
                <select value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-brand-purple">
                  <option value="100L">100 Level</option>
                  <option value="200L">200 Level</option>
                  <option value="300L">300 Level</option>
                  <option value="400L">400 Level</option>
                  <option value="500L">500 Level</option>
                </select>
                <button type="submit" className="w-full rounded-2xl bg-brand-purple px-4 py-3 font-semibold text-white transition hover:bg-brand-magenta">Submit reservation request</button>
              </form>
              {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
            </section>
          </aside>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-black text-white">Recent reservation requests</h2>
          <div className="mt-4 space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-white/10 bg-[#09090B]/70 p-4 text-sm">
                <p className="font-semibold text-white">{request.fullName}</p>
                <p className="mt-1 text-zinc-400">{request.matriculationNumber} • {request.institution} • {request.academicLevel}</p>
                <p className="mt-2 text-zinc-500">Selected: {request.selectedHostels.join(', ')}</p>
                <p className="mt-2 text-xs text-zinc-500">Submitted {request.createdAt}</p>
              </div>
            ))}
            {!requests.length && <p className="text-sm text-zinc-500">No reservation requests yet.</p>}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/auth/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Sign in</Link>
          <Link href="/dashboard" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-brand-accent hover:text-brand-accent">Open dashboard</Link>
        </div>
      </div>
    </main>
  );
}
