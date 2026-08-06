"use client";
import { useEffect, useState } from "react";import { API } from '../config/site';
type Wallet = { user: number; balance: string; currency: string };
type Referral = { id: number; referrer: number | null; referred_email: string; status: string };

export default function ReferPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // POST using `referred_email` to match backend serializer
      const res = await fetch(`${API.base}/referrals/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referred_email: email }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setMessage(payload?.detail || "Unable to submit referral. Try again later.");
      } else {
        setEmail("");
        setMessage("Referral submitted — when confirmed, the referrer earns ₦200 credit.");
        // refresh referrals list
        fetchReferrals();
      }
    } catch (err) {
      setMessage("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  

  async function fetchWallets() {
    try {
      const res = await fetch(`${API.base}/wallets/me/`, { credentials: 'include' });
      if (res.ok) setWallets(await res.json());
    } catch {
      // ignore
    }
  }

  async function fetchReferrals() {
    try {
      const res = await fetch(`${API.base}/referrals/`, { credentials: 'include' });
      if (res.ok) setReferrals(await res.json());
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchWallets();
      await fetchReferrals();
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h1 className="text-2xl font-black">Refer & Earn</h1>
          <p className="mt-2 text-sm text-zinc-400">Invite friends — you earn ₦200 per confirmed referral. Credits appear in your wallet.</p>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-lg font-semibold">Invite by email</h2>
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-zinc-400"
            />
            <button disabled={loading} className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-900">
              {loading ? "Sending..." : "Send invite"}
            </button>
            {message && <p className="text-sm text-zinc-300">{message}</p>}
          </form>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-lg font-semibold">Wallets</h2>
          <div className="mt-3 space-y-2">
            {wallets.length === 0 && <p className="text-sm text-zinc-500">No wallets visible (try authenticated endpoints for user-specific wallets).</p>}
            {wallets.map((w) => (
              <div key={w.user} className="rounded-lg bg-zinc-950 p-3">
                <p className="text-sm">User: {w.user}</p>
                <p className="font-bold">{w.currency} {Number(w.balance).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-lg font-semibold">Recent referrals</h2>
          <div className="mt-3 space-y-2">
            {referrals.length === 0 && <p className="text-sm text-zinc-500">No referrals yet.</p>}
            {referrals.map((r) => (
              <div key={r.id} className="rounded-lg bg-zinc-950 p-3">
                <p className="text-sm">{r.referred_email}</p>
                <p className="text-xs text-zinc-400">Status: {r.status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
