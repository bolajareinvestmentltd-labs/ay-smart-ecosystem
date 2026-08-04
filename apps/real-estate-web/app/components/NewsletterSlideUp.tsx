'use client';
import React, { useEffect, useState } from 'react';

export default function NewsletterSlideUp(){
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 180000); // 3 minutes
    return () => clearTimeout(timer);
  }, []);

  if(!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-xl border border-zinc-800 bg-zinc-900/95 p-4 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-100">Stay updated</div>
          <div className="mt-1 text-xs text-zinc-400">Subscribe to get the latest listings and offers.</div>
        </div>
        <button onClick={() => setVisible(false)} className="ml-3 text-zinc-400">✕</button>
      </div>
      <form className="mt-3 flex gap-2">
        <input placeholder="Your email" className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <button className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold">Subscribe</button>
      </form>
    </div>
  );
}
