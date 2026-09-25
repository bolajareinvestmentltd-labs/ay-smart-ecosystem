'use client';

import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now) : '--:--:--';
  const date = now ? new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(now) : 'Local time';
  return <time dateTime={now?.toISOString()} aria-label="Current local time" className="clock-widget flex items-center gap-1.5 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)]/80 px-1.5 py-1 sm:gap-2 sm:px-2.5 sm:py-1.5"><span className="clock-icon flex h-6 w-6 items-center justify-center rounded-lg bg-[#4e235f] text-white sm:h-7 sm:w-7 sm:rounded-xl"><Clock3 size={13} /></span><span className="leading-tight"><span className="block font-mono text-[10px] font-bold tabular-nums text-[var(--text-primary)] sm:text-[12px]">{time}</span><span className="hidden text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)] sm:block">{date}</span></span></time>;
}
