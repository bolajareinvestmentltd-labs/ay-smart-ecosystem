'use client';
import React, { useState } from 'react';

type GalleryMedia = { id: number; url?: string; video_url?: string; caption?: string };

export default function PropertyGallery({ images }: { images: GalleryMedia[] }){
  const [index, setIndex] = useState(0);
  if(!images || images.length === 0){
    return <div className="rounded-xl overflow-hidden bg-zinc-800 p-8 text-center text-zinc-400">No images available</div>
  }

  const current = images[index];
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative h-80 w-full bg-zinc-900">
          {current.video_url ? (
            <video src={current.video_url} controls className="h-full w-full object-cover" />
          ) : current.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.url} alt={current.caption || 'Property image'} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <button onClick={() => setIndex((i) => Math.max(0, i-1))} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white">‹</button>
        <button onClick={() => setIndex((i) => Math.min(images.length-1, i+1))} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white">›</button>
      </div>
      {current.caption && <div className="text-sm text-zinc-300">{current.caption}</div>}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button key={img.id} onClick={() => setIndex(i)} className={`rounded-md overflow-hidden ${i===index ? 'ring-2 ring-amber-400' : ''}`}>
            {img.video_url ? <video src={img.video_url} muted className="h-16 w-28 object-cover" /> : <img src={img.url} alt={img.caption || 'thumb'} className="h-16 w-28 object-cover" />}
          </button>
        ))}
      </div>
    </div>
  )
}
