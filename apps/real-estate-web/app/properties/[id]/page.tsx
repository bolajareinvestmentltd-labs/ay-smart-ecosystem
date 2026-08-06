'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '../../config/site';
import PropertyGallery from '../../components/PropertyGallery';
import InspectionBookingForm from '../../components/InspectionBookingForm';

export default function PropertyDetailPage({ params }: any) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API.base}/properties/${params.id}/`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found</div>;

  const openMap = () => {
    if (property.latitude && property.longitude) {
      window.open(`https://www.google.com/maps?q=${property.latitude},${property.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location_address)}`, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <h1 className="text-3xl font-black">{property.title}</h1>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <PropertyGallery images={property.images && property.images.length ? property.images : [{ id: 0, url: property.main_image_url }]} />
            {property.virtual_tour_url && (
              <a href={property.virtual_tour_url} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-full border border-zinc-700 px-4 py-2">Open Virtual Tour</a>
            )}
          </div>
          <div>
            <div className="text-sm text-zinc-400">{property.property_type_display}</div>
            <div className="mt-2 text-2xl font-black">₦{Number(property.price).toLocaleString()}</div>
            <button onClick={openMap} className="mt-4 rounded-full border border-zinc-700 px-4 py-2">{property.location_address}</button>
            <p className="mt-4 text-zinc-300">{property.location_address}</p>
            <div className="mt-6">
              <div id="book">
                <InspectionBookingForm propertyId={Number(params.id)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
