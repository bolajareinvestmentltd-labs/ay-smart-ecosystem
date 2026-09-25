import { authFetch } from './auth';
import { buildApiUrl } from './api';

export type BackendProfile = {
  id: number;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  location?: string;
  role?: 'seller' | 'student' | 'agent' | 'both';
  subscription_plan?: string;
  subscription_status?: string;
  is_kyc_verified?: boolean;
  is_admin_approved?: boolean;
  kyc_status?: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | string;
  kyc_provider?: string;
  kyc_reference?: string;
  kyc_rejection_reason?: string;
  email_verified?: boolean;
  student_matric_number?: string;
  student_email?: string;
};

export type BackendListing = {
  id: number;
  title: string;
  category: string;
  description?: string;
  location: string;
  price: string | number;
  facilities?: string[];
  plan: string;
  duration_days: number;
  duration_unit?: 'year' | 'day' | 'week' | 'month' | string;
  service_fee?: string | number;
  map_url?: string;
  status: 'PENDING' | 'LIVE' | 'REJECTED' | string;
  cashback: string | number;
  created_at: string;
  images?: Array<{ id: number; url?: string; video_url?: string; caption?: string }>;
};

export type BackendWallet = {
  user: number;
  balance: string | number;
  currency: string;
};

async function readJson<T>(response: Response): Promise<T | null> {
  return response.ok ? response.json().catch(() => null) : null;
}

export async function getBackendProfile() {
  return readJson<BackendProfile>(await authFetch('/api/auth/profile/'));
}

export async function getBackendListings() {
  return readJson<BackendListing[]>(await authFetch('/api/listings/'));
}

export async function getPublishedListings() {
  return readJson<BackendListing[]>(await fetch(buildApiUrl('/api/listings/published/')));
}

export async function getBackendWallet() {
  return readJson<BackendWallet>(await authFetch('/api/wallets/me/'));
}

export async function createBackendListing(formData: FormData) {
  return readJson<BackendListing>(await authFetch('/api/listings/', {
    method: 'POST',
    body: formData,
  }));
}

export function listingImage(listing: { images?: Array<{ url?: string }> }) {
  return listing.images?.find((image) => image.url)?.url || '';
}

export function apiImage(url?: string) {
  if (!url) return '';
  return url.startsWith('/') ? buildApiUrl(url) as string : url;
}
