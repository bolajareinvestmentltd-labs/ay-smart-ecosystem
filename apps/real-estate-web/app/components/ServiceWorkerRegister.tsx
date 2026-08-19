'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

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
    const installTimer = window.setTimeout(() => setShowInstall(true), 120000);

    return () => {
      window.clearTimeout(installTimer);
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

  if (!installPrompt || !showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex items-center gap-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)]/95 px-3 py-2 shadow-xl backdrop-blur-xl sm:bottom-6">
      <span className="text-xs font-semibold text-[var(--text-primary)]">GET APP</span>
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex items-center justify-center rounded-full bg-[#B45309] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#B45309]/30 transition hover:bg-[#92400e]"
        >
          Install
        </button>
    </div>
  );
}

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }
}
