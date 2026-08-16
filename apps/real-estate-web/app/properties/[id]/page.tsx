'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyGallery from '../../components/PropertyGallery';
import InspectionBookingForm from '../../components/InspectionBookingForm';
import { authFetch } from '../../lib/auth';
import { buildApiUrl } from '../../lib/api';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id ? String(params.id) : null;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!propertyId) {
        setErrorMessage('Unable to determine property ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch(buildApiUrl(`/properties/${propertyId}/`));
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          const raw = payload?.detail || payload?.message || res.statusText || 'Unknown error';
          // Friendly mapping for token errors and guidance for users
          const detail = typeof raw === 'string' && /token/i.test(raw)
            ? 'Session expired or invalid token. Please sign in again or clear your browser cookies.'
            : raw;
          setErrorMessage(`Failed to load property: ${res.status} ${detail}`);
          return;
        }
        const data = await res.json();
        setProperty(data);

        // Check user auth and favorites/hidden status
        try {
          const userRes = await authFetch(buildApiUrl('/auth/me/'));
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);

            // Check if favorited
            const favRes = await authFetch(buildApiUrl('/favorites/'));
            if (favRes.ok) {
              const favorites = await favRes.json();
              const isFav = favorites.some((fav: any) => fav.listing?.id === propertyId || fav.id === propertyId);
              setIsFavorited(isFav);
            }

            // Check if hidden
            const hiddenRes = await authFetch(buildApiUrl('/hidden-listings/'));
            if (hiddenRes.ok) {
              const hidden = await hiddenRes.json();
              const isHid = hidden.some((hid: any) => hid.listing?.id === propertyId || hid.id === propertyId);
              setIsHidden(isHid);
            }
          }
        } catch (err) {
          console.log('User not authenticated');
        }
      } catch (error) {
        setErrorMessage(`Network or server error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [propertyId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (errorMessage)
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white">Unable to load property</h1>
          <p className="mt-4 text-sm text-zinc-400">{errorMessage}</p>
          <div className="mt-6">
            <a href="/properties" className="rounded-full bg-brand-purple px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-purple/20 transition hover:bg-brand-magenta">
              Back to listings
            </a>
          </div>
        </div>
      </div>
    );
  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found</div>;

  const openMap = () => {
    if (property.latitude && property.longitude) {
      window.open(`https://www.google.com/maps?q=${property.latitude},${property.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location_address)}`, '_blank');
    }
  };

  async function handleToggleFavorite() {
    if (!user) {
      setErrorMessage('Please sign in to save favorites.');
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        const favRes = await authFetch(buildApiUrl('/favorites/'));
        if (favRes.ok) {
          const favorites = await favRes.json();
          const favToDelete = favorites.find((fav: any) => fav.listing?.id === propertyId || fav.id === propertyId);
          if (favToDelete) {
            await authFetch(buildApiUrl(`/favorites/${favToDelete.id}/`), { method: 'DELETE' });
            setIsFavorited(false);
          }
        }
      } else {
        // Add to favorites
        const res = await authFetch(buildApiUrl('/favorites/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing: propertyId }),
        });
        if (res.ok) {
          setIsFavorited(true);
        } else {
          setErrorMessage('Failed to save favorite.');
        }
      }
    } catch (error) {
      setErrorMessage(`Error updating favorite: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function handleToggleHidden() {
    if (!user) {
      setErrorMessage('Please sign in to hide listings.');
      return;
    }

    try {
      if (isHidden) {
        // Remove from hidden
        const hiddenRes = await authFetch(buildApiUrl('/hidden-listings/'));
        if (hiddenRes.ok) {
          const hidden = await hiddenRes.json();
          const hidToDelete = hidden.find((hid: any) => hid.listing?.id === propertyId || hid.id === propertyId);
          if (hidToDelete) {
            await authFetch(buildApiUrl(`/hidden-listings/${hidToDelete.id}/`), { method: 'DELETE' });
            setIsHidden(false);
          }
        }
      } else {
        // Add to hidden
        const res = await authFetch(buildApiUrl('/hidden-listings/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing: propertyId }),
        });
        if (res.ok) {
          setIsHidden(true);
        } else {
          setErrorMessage('Failed to hide listing.');
        }
      }
    } catch (error) {
      setErrorMessage(`Error updating hidden status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

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

    const res = await authFetch(buildApiUrl(`/properties/${propertyId}/upload_image/`), {
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold transition ${
                isFavorited
                  ? 'bg-red-500/20 border-red-500/50 border text-red-400'
                  : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              ❤️ {isFavorited ? 'Favorited' : 'Favorite'}
            </button>
            <button
              onClick={handleToggleHidden}
              className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold transition ${
                isHidden
                  ? 'bg-gray-500/20 border-gray-500/50 border text-gray-400'
                  : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
              }`}
              title={isHidden ? 'Unhide this listing' : 'Hide this listing'}
            >
              👁️ {isHidden ? 'Hidden' : 'Hide'}
            </button>
            <Link
              href="/properties"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to listings
            </Link>
          </div>
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
                <InspectionBookingForm propertyId={Number(propertyId)} />
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
