'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '../../config/site';
import PropertyGallery from '../../components/PropertyGallery';
import InspectionBookingForm from '../../components/InspectionBookingForm';
import { authFetch } from '../../lib/auth';

export default function PropertyDetailPage({ params }: any) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');

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

  async function handleUploadImage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setUploadMessage('Please choose an image to upload.');
      return;
    }

    setUploading(true);
    setUploadMessage('');
    const formData = new FormData();
    formData.append('image', selectedFile);

    const res = await authFetch(`${API.base}/properties/${params.id}/upload_image/`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setUploadMessage(payload?.detail || 'Upload failed. Please sign in and try again.');
      setUploading(false);
      return;
    }

    const payload = await res.json().catch(() => null);
    if (payload && payload.id) {
      const newImage = { id: payload.id, url: payload.image || payload.url, caption: payload.caption || '' };
      setProperty((prev: any) => ({
        ...prev,
        images: prev.images ? [newImage, ...prev.images] : [newImage],
      }));
      setUploadMessage('Image uploaded successfully.');
      setSelectedFile(null);
    }
    setUploading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-accent">Property detail</p>
            <h1 className="mt-2 text-3xl font-black">{property.title}</h1>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to listings
          </Link>
        </div>

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
            <div className="mt-6 space-y-4">
              <div id="book">
                <InspectionBookingForm propertyId={Number(params.id)} />
              </div>
              <form onSubmit={handleUploadImage} className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                <h2 className="text-lg font-black">Upload property image</h2>
                <p className="mt-2 text-sm text-zinc-400">Trusted agents and authenticated sellers can submit new photos for this listing.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  className="mt-4 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100"
                />
                <button disabled={uploading} className="mt-4 rounded-2xl bg-brand-purple px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70">
                  {uploading ? 'Uploading...' : 'Upload image'}
                </button>
                {uploadMessage && <p className="mt-3 text-sm text-zinc-300">{uploadMessage}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
