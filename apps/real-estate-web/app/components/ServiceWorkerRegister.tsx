'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  if (!installPrompt) {
    return null;
  }

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[min(92vw,640px)] -translate-x-1/2 rounded-b-[2rem] border border-white/10 bg-[#FEF4E8]/95 p-4 shadow-2xl shadow-amber-500/20 backdrop-blur-xl transition-transform duration-500 ease-out translate-y-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E7A357]/10 ring-1 ring-[#E7A357]/20">
            <img src="/assets/ay-smart-logo.png" alt="AY'SMART icon" className="h-9 w-9 rounded-2xl object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950">Install AY'SMART ECO</p>
            <p className="text-xs text-zinc-600">Get the app-like experience with offline-ready pages and quick access.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex items-center justify-center rounded-full bg-[#B45309] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B45309]/30 transition hover:bg-[#92400e]"
        >
          Install app
        </button>
      </div>
    </div>
  );
}

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }
}
