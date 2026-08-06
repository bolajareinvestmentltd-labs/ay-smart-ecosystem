'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '../config/site';
import { getStoredProfile, saveStoredProfile, type ListingPlan, type UserRole } from '../lib/app-state';

const studentEmailHint = 'Use your school email or a personal email that matches your student records.';

const planOptions: Array<{ key: ListingPlan; label: string; price: string }> = [
  { key: 'basic', label: 'Basic', price: '₦3,500 / week' },
  { key: 'standard', label: 'Standard', price: '₦5,000 / week' },
  { key: 'premium', label: 'Premium', price: '₦7,500 / week' },
];

export default function RegisterPage() {
  const router = useRouter();
  const profile = getStoredProfile();
  const [name, setName] = useState(profile.name || '');
  const [username, setUsername] = useState(profile.username || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState(profile.location || '');
  const [role, setRole] = useState<UserRole>(profile.role || 'seller');
  const [plan, setPlan] = useState<ListingPlan>(profile.subscriptionPlan || 'basic');
  const [plateNumber, setPlateNumber] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isAgent, setIsAgent] = useState(profile.role === 'agent');
  const [isStudent, setIsStudent] = useState(profile.role === 'student' || profile.role === 'both');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isAgent && !plateNumber) {
      setError('Agents must provide a vehicle plate number.');
      return;
    }

    if (isAgent && !location) {
      setError('Agents must provide a location for verification and service routing.');
      return;
    }

    if (isStudent && (!matricNumber || !studentEmail)) {
      setError('Students must provide a matric number and a school or personal email.');
      return;
    }

    if (isStudent && matricNumber && studentEmail && !studentEmail.includes('@')) {
      setError('Please provide a valid email address for verification.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API.base}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: username || email.split('@')[0],
          email,
          password,
          first_name: name.split(' ')[0] || '',
          last_name: name.split(' ').slice(1).join(' ') || '',
          role,
          phone,
          location,
          matric_number: isStudent ? matricNumber : '',
          student_email: isStudent ? studentEmail : '',
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.detail || 'Registration failed.');
        return;
      }

      const profile = getStoredProfile();
      const nextProfile = {
        ...profile,
        name,
        username: username || email.split('@')[0],
        email,
        phone,
        role,
        location,
        matricNumber: isStudent ? matricNumber : '',
        studentEmail: isStudent ? studentEmail : '',
        subscriptionPlan: isAgent ? plan : profile.subscriptionPlan,
        selectedPlan: isAgent ? plan : profile.selectedPlan,
        isRegistered: true,
        isKycVerified: false,
        adminApproved: false,
        freeListingsRemaining: isAgent ? 3 : profile.freeListingsRemaining,
        subscriptionStatus: 'none' as const,
        walletBalance: profile.walletBalance,
        listingsCount: profile.listingsCount,
        failedLoginAttempts: profile.failedLoginAttempts,
        referralCode: profile.referralCode || `AYS-${Date.now().toString().slice(-5)}`,
        referralRewards: profile.referralRewards,
        password,
        plateNumber: isAgent ? plateNumber : '',
      };

      saveStoredProfile(nextProfile);
      setSaved(true);
      // If backend returned a non-fatal warning (e.g., email delivery not configured), show it to the user.
      if (payload?.warning) {
        setError(payload.warning);
      }
      // Redirect user to verification landing with email param so they can resend if needed
      router.push(`/auth/verification-sent?email=${encodeURIComponent(email)}`);
    } catch {
      setError('Network error while creating your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Account registration</p>
        <h1 className="mt-2 text-3xl font-black">Create your AY&apos;SMART account</h1>
        <p className="mt-2 text-sm text-zinc-400">Choose your role, complete your profile, and get ready for verification and listing management.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Full name" />
            <input required value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Username" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Email address" />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Active phone number" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Password" />
            <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Confirm password" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select value={role} onChange={(e) => { const value = e.target.value as UserRole; setRole(value); setIsAgent(value === 'agent'); setIsStudent(value === 'student' || value === 'both'); }} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
              <option value="seller">Seller</option>
              <option value="student">Student</option>
              <option value="agent">Agent</option>
              <option value="both">Seller + Student</option>
            </select>
            <input required value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Location / Address" />
          </div>

          {isStudent && (
            <div className="grid gap-4 md:grid-cols-2">
              <input required value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Matric number" />
              <input required type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="School or personal email" />
            </div>
          )}

          {isStudent && <p className="text-sm text-zinc-400">{studentEmailHint}</p>}

          {isAgent && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <input required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Vehicle plate number" />
                <select value={plan} onChange={(e) => setPlan(e.target.value as ListingPlan)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                  {planOptions.map((option) => (
                    <option key={option.key} value={option.key}>{option.label} — {option.price}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-zinc-400">Agents receive 3 free listings for one week after admin approval. Paid subscription is required after the free quota expires.</p>
            </>
          )}

          <button disabled={submitting} className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? 'Creating account...' : 'Create account'}</button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {saved && <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-400">Account created. Check your email for a verification link before signing in.</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/auth/login" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Already have an account?</Link>
          <Link href="/kyc" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Go to KYC</Link>
        </div>
      </div>
    </main>
  );
}
