'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated, logout } from '../lib/auth';

export default function AuthHeader() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    isAuthenticated().then((ok) => { if (mounted) setAuthed(ok); });
    // silent refresh every 10 minutes
    const id = setInterval(() => { fetch('/api/auth/refresh-cookie/', { method: 'POST', credentials: 'include' }); }, 10 * 60 * 1000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  async function handleLogout() {
    await logout();
    setAuthed(false);
    window.location.href = '/';
  }

  return (
    <div className="flex items-center gap-3">
      {authed ? (
        <button onClick={handleLogout} className="rounded-md bg-white/5 px-3 py-1 text-sm">Logout</button>
      ) : (
        <Link href="/auth/login" className="rounded-md bg-white/5 px-3 py-1 text-sm">Login</Link>
      )}
    </div>
  );
}
