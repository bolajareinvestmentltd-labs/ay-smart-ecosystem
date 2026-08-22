'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '../../lib/auth';
import { getStoredProfile, saveStoredProfile, type SellerProfile } from '../../lib/app-state';
import PasswordInput from '../../components/PasswordInput';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<SellerProfile>(getStoredProfile());
  const [location, setLocation] = useState(profile.location || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const res = await authFetch('/api/auth/profile/');
      if (!res.ok) return;
      const payload = await res.json().catch(() => null);
      if (!payload) return;
      
      // Detect if this is a first-time user (just registered, not KYC verified, not admin approved)
      const isNew = !payload.is_kyc_verified && !payload.is_admin_approved;
      setIsFirstTime(isNew);
      
      const nextProfile = {
        ...getStoredProfile(),
        name: payload.name || '',
        username: payload.username || '',
        email: payload.email || '',
        phone: payload.phone || '',
        location: payload.location || '',
        role: (payload.role as SellerProfile['role']) || 'seller',
        subscriptionPlan: (payload.subscription_plan as SellerProfile['subscriptionPlan']) || 'basic',
        subscriptionStatus: (payload.subscription_status as SellerProfile['subscriptionStatus']) || 'none',
        isKycVerified: Boolean(payload.is_kyc_verified),
        adminApproved: Boolean(payload.is_admin_approved),
      };
      saveStoredProfile(nextProfile);
      setProfile(nextProfile);
      setLocation(payload.location || '');
    }

    loadProfile();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    const res = await authFetch('/api/auth/profile/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: profile.phone, location, role: profile.role }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload?.detail || 'Unable to save profile right now.');
      setIsSaving(false);
      return;
    }

    const payload = await res.json().catch(() => null);
    const nextProfile = {
      ...profile,
      location,
      phone: payload?.phone || profile.phone,
      role: (payload?.role as SellerProfile['role']) || profile.role,
      subscriptionPlan: (payload?.subscription_plan as SellerProfile['subscriptionPlan']) || profile.subscriptionPlan,
      subscriptionStatus: (payload?.subscription_status as SellerProfile['subscriptionStatus']) || profile.subscriptionStatus,
      isKycVerified: Boolean(payload?.is_kyc_verified ?? profile.isKycVerified),
      adminApproved: Boolean(payload?.is_admin_approved ?? profile.adminApproved),
    };
    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setMessage('Profile saved successfully. Username and email remain unchanged.');
    setIsSaving(false);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords must match.');
      return;
    }

    const response = await authFetch('/api/auth/profile/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload?.detail || 'Unable to update password.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('Password updated successfully.');
  }

  function handleCompleteOnboarding() {
    // After onboarding (profile setup), redirect to dashboard or properties
    router.push('/dashboard');
  }

  async function handleDeleteAccount() {
    if (!window.confirm('This permanently deletes your account and submitted data. Continue?')) return;
    setDeleting(true);
    const res = await authFetch('/api/auth/profile/', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: 'DELETE' }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload?.detail || 'Unable to delete account.');
      setDeleting(false);
      return;
    }
    localStorage.clear();
    router.replace('/');
  }

  // Show onboarding flow for first-time users
  if (isFirstTime) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Welcome to AY'SMART</p>
          <h1 className="mt-2 text-3xl font-black">Let's complete your profile</h1>
          <p className="mt-2 text-sm text-zinc-400">You're almost ready! Just a few more details to get your account fully set up.</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Account Summary */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6">
              <h2 className="text-lg font-bold">Your account</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-zinc-500">Name</p>
                  <p className="font-semibold">{profile.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Email</p>
                  <p className="font-semibold">{profile.email || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Username</p>
                  <p className="font-semibold">{profile.username || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Role</p>
                  <p className="font-semibold capitalize">{profile.role || 'Not set'}</p>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6">
              <h2 className="text-lg font-bold">What's next?</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-amber-400">✓</span>
                  <span>Email verified and account created</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400">→</span>
                  <span>Complete profile information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400">→</span>
                  <span>KYC verification (if required)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400">→</span>
                  <span>Start listing properties</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-8 flex gap-3">
            <Link href="/auth/profile?edit=true" className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 font-semibold hover:border-zinc-700">View full profile settings</Link>
            <button onClick={handleCompleteOnboarding} className="rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-zinc-950 hover:bg-amber-600">Get started → Dashboard</button>
          </div>
        </div>
      </main>
    );
  }

  // Show settings for existing users
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Account settings</p>
              <h1 className="mt-2 text-3xl font-black">Profile management</h1>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm">
              <p>Role: {profile.role}</p>
              <p>Status: {profile.adminApproved ? 'Approved' : 'Pending approval'}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-black">Personal info</h2>
            <p className="mt-2 text-sm text-zinc-400">Email and username cannot be changed without admin support.</p>

            <div className="mt-4 space-y-4">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-4 text-sm">
                <p className="font-semibold">Username</p>
                <p className="text-zinc-500">{profile.username || 'Not set'}</p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-4 text-sm">
                <p className="font-semibold">Email</p>
                <p className="text-zinc-500">{profile.email || 'Not set'}</p>
              </div>
              <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Phone number" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Current location / address" />
              <button type="submit" disabled={isSaving} className="rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">{isSaving ? 'Saving...' : 'Save profile'}</button>
            </div>
          </form>

          <form onSubmit={handleResetPassword} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-black">Reset password</h2>
            <p className="mt-2 text-sm text-zinc-400">Enter your current password before choosing a new one.</p>

            <div className="mt-4 space-y-4">
              <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Current password" />
              <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="New password" />
              <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Confirm new password" />
              <button type="submit" className="rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950">Update password</button>
            </div>
          </form>
        </section>

        {(error || message) && (
          <div className={`rounded-3xl border p-4 text-sm ${error ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-emerald-500 bg-emerald-500/10 text-emerald-300'}`}>
            {error || message}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Back to dashboard</Link>
          <Link href="/plans" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Manage subscription</Link>
          <button type="button" onClick={handleDeleteAccount} disabled={deleting} className="rounded-full border border-rose-500/50 px-4 py-2 text-sm text-rose-400 disabled:opacity-70">{deleting ? 'Deleting...' : 'Delete account'}</button>
        </div>
      </div>
    </main>
  );
}
