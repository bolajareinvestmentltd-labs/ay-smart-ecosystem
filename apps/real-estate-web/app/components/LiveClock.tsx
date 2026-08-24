'use client';

import { useEffect, useState } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <time dateTime={new Date().toISOString()} aria-label="Current local time" className="whitespace-nowrap font-mono text-[11px] tabular-nums text-[var(--text-muted)]">{time || '--:--:--'}</time>;
}
