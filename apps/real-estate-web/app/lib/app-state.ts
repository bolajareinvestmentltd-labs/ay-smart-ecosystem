export type ListingPlan = 'basic' | 'standard' | 'premium';

export interface SellerProfile {
  name: string;
  email: string;
  phone: string;
  role: 'seller' | 'student' | 'both';
  isRegistered: boolean;
  isKycVerified: boolean;
  walletBalance: number;
  listingsCount: number;
  selectedPlan?: ListingPlan;
}

export interface ListingDraft {
  id: number;
  title: string;
  category: string;
  location: string;
  price: number;
  plan: ListingPlan;
  durationDays: number;
  status: 'Pending Review' | 'Live' | 'Rejected';
  createdAt: string;
  cashback: number;
}

export interface HostelRequest {
  id: number;
  fullName: string;
  matriculationNumber: string;
  institution: string;
  academicLevel: string;
  createdAt: string;
}

const PROFILE_KEY = 'aysmart-real-estate-profile';
const LISTINGS_KEY = 'aysmart-real-estate-listings';
const HOSTEL_KEY = 'aysmart-real-estate-hostel';

export function getStoredProfile(): SellerProfile {
  if (typeof window === 'undefined') {
    return {
      name: '',
      email: '',
      phone: '',
      role: 'seller',
      isRegistered: false,
      isKycVerified: false,
      walletBalance: 0,
      listingsCount: 0,
    };
  }

  const raw = window.localStorage.getItem(PROFILE_KEY);
  if (!raw) {
    return {
      name: '',
      email: '',
      phone: '',
      role: 'seller',
      isRegistered: false,
      isKycVerified: false,
      walletBalance: 0,
      listingsCount: 0,
    };
  }

  return JSON.parse(raw);
}

export function saveStoredProfile(profile: SellerProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getStoredListings(): ListingDraft[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(LISTINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredListings(listings: ListingDraft[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}

export function getStoredHostelRequests(): HostelRequest[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(HOSTEL_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredHostelRequests(requests: HostelRequest[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HOSTEL_KEY, JSON.stringify(requests));
}

export function getPlanPrice(plan: ListingPlan, durationDays: number) {
  if (plan === 'basic') return durationDays === 60 ? 7500 : 5000;
  if (plan === 'standard') return durationDays === 60 ? 15500 : 10000;
  return durationDays === 60 ? 24500 : 20000;
}

export function getPlanBenefits(plan: ListingPlan) {
  if (plan === 'basic') {
    return ['1 active listing', 'Basic visibility', 'Daily admin support'];
  }
  if (plan === 'standard') {
    return ['3 active listings', 'Priority placement', 'Wallet cashback boost'];
  }
  return ['Unlimited shortlist slots', 'Premium spotlight', 'Priority KYC review and cashback'];
}

export function getPlanCashback(plan: ListingPlan, durationDays: number) {
  return Math.round(getPlanPrice(plan, durationDays) * 0.1);
}
