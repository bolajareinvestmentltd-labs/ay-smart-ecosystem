'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser, logout, refreshToken } from '../lib/auth';

type UserInfo = { id: number; username: string; email: string } | null;

export default function AuthHeader() {
  const [user, setUser] = useState<UserInfo>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((currentUser) => {
      if (mounted) setUser(currentUser);
    });

    const id = setInterval(async () => {
      const success = await refreshToken();
      if (!success && mounted) {
        setUser(null);
      }
    }, 10 * 60 * 1000);

    return () => { mounted = false; clearInterval(id); };
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
    window.location.href = '/';
  }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <span className="text-sm text-zinc-200">Hi, {user.username}</span>
          <button onClick={handleLogout} className="rounded-md bg-white/5 px-3 py-1 text-sm">Logout</button>
        </>
      ) : (
        <Link href="/auth/login" className="rounded-md bg-white/5 px-3 py-1 text-sm">Login</Link>
      )}
    </div>
  );
}
