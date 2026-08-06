'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '../lib/auth';
import { getStoredProfile, saveStoredProfile } from '../lib/app-state';

export default function KycPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(getStoredProfile());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentMatric, setStudentMatric] = useState(profile.matricNumber || '');
  const [studentEmail, setStudentEmail] = useState(profile.studentEmail || '');
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const isAgent = profile.role === 'agent';
  const isStudent = profile.role === 'student' || profile.role === 'both';

  useEffect(() => {
    async function loadProfile() {
      const res = await authFetch('/api/auth/profile/');
      if (!res.ok) {
        router.replace('/auth/login');
        return;
      }
      const payload = await res.json().catch(() => null);
      if (!payload) {
        router.replace('/auth/login');
        return;
      }
      const nextProfile = {
        ...getStoredProfile(),
        name: payload.name || '',
        username: payload.username || '',
        email: payload.email || '',
        isKycVerified: payload.is_kyc_verified || false,
        adminApproved: payload.is_admin_approved || false,
        matricNumber: payload.student_matric_number || profile.matricNumber || '',
        studentEmail: payload.student_email || profile.studentEmail || '',
        studentIdImage: payload.student_id_image || profile.studentIdImage || '',
      };
      saveStoredProfile(nextProfile);
      setProfile(nextProfile);
      setStudentMatric(nextProfile.matricNumber || '');
      setStudentEmail(nextProfile.studentEmail || '');
      setFilePreview(nextProfile.studentIdImage || '');
    }

    loadProfile();
  }, [router]);

  async function handleSaveStudentInfo(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const formData = new FormData();
    if (studentMatric) formData.append('student_matric_number', studentMatric);
    if (studentEmail) formData.append('student_email', studentEmail);
    if (studentIdFile) formData.append('student_id_image', studentIdFile);

    const res = await authFetch('/api/auth/profile/', {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload?.detail || 'Unable to save KYC details.');
      setSaving(false);
      return;
    }

    const payload = await res.json().catch(() => null);
    const nextProfile = {
      ...profile,
      matricNumber: payload?.student_matric_number || studentMatric,
      studentEmail: payload?.student_email || studentEmail,
      studentIdImage: payload?.student_id_image || filePreview,
      isKycVerified: Boolean(payload?.is_kyc_verified ?? profile.isKycVerified),
      adminApproved: Boolean(payload?.is_admin_approved ?? profile.adminApproved),
    };
    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setFilePreview(payload?.student_id_image || filePreview);
    setMessage('KYC details saved. You may now request verification.');
    setSaving(false);
  }

  async function handleVerify() {
    setLoading(true);
    setError('');
    if (isStudent && (!studentMatric || !studentEmail || !filePreview)) {
      setError('Students must provide matric number, student email, and upload an ID image before verification.');
      setLoading(false);
      return;
    }

    const res = await authFetch('/api/kyc/approve/', { method: 'POST' });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.detail || 'Unable to approve KYC right now.');
      setLoading(false);
      return;
    }
    const payload = await res.json().catch(() => null);
    const nextProfile = {
      ...profile,
      isKycVerified: payload?.is_kyc_verified || true,
      adminApproved: payload?.is_admin_approved || true,
    };
    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setMessage('KYC approved. Your dashboard is now unlocked.');
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">KYC verification</p>
        <h1 className="mt-2 text-3xl font-black">Verify your identity before listings go live</h1>
        <p className="mt-2 text-sm text-zinc-400">{isAgent ? 'Agents can complete verification for service and listing visibility.' : isStudent ? 'Students must verify their matric number and school or personal email before reservation requests are accepted.' : 'Only verified sellers can publish property or automotive listings. Admin review happens after upload.'}</p>

        <div className="mt-6 space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Verification status</span>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${profile.isKycVerified ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{profile.isKycVerified ? 'Verified' : 'Pending'}</span>
          </div>
          <div className="text-sm text-zinc-400">Name: {profile.name || 'Please register first'}</div>
          <div className="text-sm text-zinc-400">Email: {profile.email || 'Pending'}</div>
          {isStudent && <div className="text-sm text-zinc-400">Matric number: {profile.matricNumber || 'Pending'}</div>}
          {isStudent && <div className="text-sm text-zinc-400">Student email: {profile.studentEmail || 'Pending'}</div>}
          {isStudent && profile.studentIdImage && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Uploaded ID image preview:</p>
              <img src={profile.studentIdImage} alt="Student ID preview" className="max-h-48 w-full rounded-2xl object-cover" />
            </div>
          )}
        </div>

        <form onSubmit={handleSaveStudentInfo} className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
          <h2 className="text-lg font-black text-white">Student verification details</h2>
          <p className="mt-2 text-sm text-zinc-400">Upload your matric details and ID image so admin can verify your student status.</p>
          {isStudent ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input value={studentMatric} onChange={(e) => setStudentMatric(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Matric number" />
              <input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3" placeholder="Student email" />
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">Only students and student sellers need to upload matric verification.</p>
          )}
          <div className="mt-4">
            <label className="block text-sm text-zinc-400">Student ID image (JPEG/PNG)</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setStudentIdFile(file);
              if (file) {
                setFilePreview(URL.createObjectURL(file));
              }
            }} className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100" />
          </div>
          <button type="submit" disabled={saving} className="mt-4 rounded-2xl bg-brand-purple px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70">{saving ? 'Saving...' : 'Save student details'}</button>
        </form>

        <button disabled={loading} onClick={handleVerify} className="mt-6 rounded-2xl bg-amber-500 px-4 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70">{loading ? 'Approving...' : 'Request KYC approval'}</button>
        {(message || error) && <p className={`mt-3 text-sm ${error ? 'text-rose-400' : 'text-emerald-400'}`}>{error || message}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Open dashboard</Link>
          <Link href="/plans" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">View listing plans</Link>
          <Link href="/auth/profile" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">Profile settings</Link>
        </div>
      </div>
    </main>
  );
}
