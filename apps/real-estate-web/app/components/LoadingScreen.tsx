import Image from 'next/image';

export default function LoadingScreen({ label = 'Loading AY\'SMART' }: { label?: string }) {
  return (
    <main className="loading-screen" aria-busy="true" aria-live="polite">
      <div className="loading-mark">
        <span className="loading-ring" aria-hidden="true" />
        <span className="loading-logo">
          <Image src="/assets/ay-smart-logo.png" alt="AY'SMART" width={92} height={92} priority />
        </span>
      </div>
      <p>{label}</p>
    </main>
  );
}
