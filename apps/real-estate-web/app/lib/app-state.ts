export type ListingPlan = 'basic' | 'standard' | 'premium';
export type UserRole = 'seller' | 'student' | 'agent' | 'both';
export type ListingStatus = 'Pending Review' | 'Live' | 'Rejected';
export type HostelOrderStatus = 'Pending Inspection' | 'Inspected' | 'Satisfied' | 'Not Satisfied' | 'Refunded';

export interface SellerProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  plateNumber?: string;
  isRegistered: boolean;
  isKycVerified: boolean;
  adminApproved: boolean;
  freeListingsRemaining: number;
  freeListingExpiresAt?: string;
  subscriptionPlan?: ListingPlan;
  selectedPlan?: ListingPlan;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  subscriptionExpiresAt?: string;
  walletBalance: number;
  listingsCount: number;
  failedLoginAttempts: number;
  lastFailedLoginAt?: string;
  isLoggedIn: boolean;
  password?: string;
  referralCode?: string;
  referralRewards: number;
}

export interface ListingDraft {
  id: number;
  title: string;
  category: string;
  location: string;
  price: number;
  plan: ListingPlan;
  durationDays: number;
  status: ListingStatus;
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

export interface HostelOrder {
  id: number;
  name: string;
  hostelName: string;
  amount: number;
  status: HostelOrderStatus;
  inspectionRequestedAt: string;
  lastUpdatedAt: string;
  serviceFee: number;
  refundableAmount: number;
}

const PROFILE_KEY = 'aysmart-real-estate-profile';
const LISTINGS_KEY = 'aysmart-real-estate-listings';
const HOSTEL_KEY = 'aysmart-real-estate-hostel';
const ORDERS_KEY = 'aysmart-real-estate-orders';

export function getStoredProfile(): SellerProfile {
  if (typeof window === 'undefined') {
    return {
      name: '',
      username: '',
      email: '',
      phone: '',
      role: 'seller',
      location: '',
      isRegistered: false,
      isKycVerified: false,
      adminApproved: false,
      freeListingsRemaining: 3,
      subscriptionStatus: 'none',
      walletBalance: 0,
      listingsCount: 0,
      failedLoginAttempts: 0,
      isLoggedIn: false,
      referralCode: '',
      referralRewards: 0,
    };
  }

  const raw = window.localStorage.getItem(PROFILE_KEY);
  const defaultProfile = {
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'seller' as UserRole,
    location: '',
    isRegistered: false,
    isKycVerified: false,
    adminApproved: false,
    freeListingsRemaining: 3,
    subscriptionStatus: 'none' as const,
    walletBalance: 0,
    listingsCount: 0,
    failedLoginAttempts: 0,
    isLoggedIn: false,
    referralCode: '',
    referralRewards: 0,
    selectedPlan: 'basic' as ListingPlan,
  };

  if (!raw) {
    return defaultProfile;
  }

  try {
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
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

export function getStoredHostelOrders(): HostelOrder[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredHostelOrders(orders: HostelOrder[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
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
