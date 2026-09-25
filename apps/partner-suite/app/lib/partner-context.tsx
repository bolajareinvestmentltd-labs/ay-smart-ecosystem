'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type PartnerCategory =
  | 'agent'
  | 'seller'
  | 'landlord'
  | 'investor'
  | 'tenant'
  | 'student'
  | 'shortlet-hotel';

export interface CategoryMetadata {
  id: PartnerCategory;
  name: string;
  badge: string;
  description: string;
  route: string;
  monthlyFee: string;
  color: string;
}

export const CATEGORY_INFO: Record<PartnerCategory, CategoryMetadata> = {
  agent: {
    id: 'agent',
    name: 'Real Estate Agent',
    badge: 'Certified Broker',
    description: 'Manage property listings, lead CRM, commissions, and inspection bookings.',
    route: '/portals/agent',
    monthlyFee: '₦15,000 / month',
    color: '#8b5cf6',
  },
  seller: {
    id: 'seller',
    name: 'Property Seller',
    badge: 'Verified Owner / Seller',
    description: 'List properties for direct sale, track buyer valuations, escrow, and offers.',
    route: '/portals/seller',
    monthlyFee: '₦10,000 / month',
    color: '#ec4899',
  },
  landlord: {
    id: 'landlord',
    name: 'Landlord & Property Owner',
    badge: 'Estate Owner',
    description: 'Tenancy agreements, rent collection, occupancy rosters, and repair requests.',
    route: '/portals/landlord',
    monthlyFee: '₦20,000 / month',
    color: '#eab308',
  },
  investor: {
    id: 'investor',
    name: 'Real Estate Investor',
    badge: 'Capital Partner',
    description: 'High-yield syndications, capital distributions, development ROI analytics.',
    route: '/portals/investor',
    monthlyFee: '₦25,000 / month',
    color: '#10b981',
  },
  tenant: {
    id: 'tenant',
    name: 'Residential Tenant',
    badge: 'Verified Resident',
    description: 'Pay rent digitally, log maintenance tickets, and view digital lease contracts.',
    route: '/portals/tenant',
    monthlyFee: 'Free for Registered Tenants',
    color: '#06b6d4',
  },
  student: {
    id: 'student',
    name: 'Campus Student',
    badge: 'Verified Student',
    description: 'Off-campus hostel bookings, roommate matching, and semester lease payments.',
    route: '/portals/student',
    monthlyFee: 'Free for Verified Students',
    color: '#f97316',
  },
  'shortlet-hotel': {
    id: 'shortlet-hotel',
    name: 'Short-Let & Hotel Host',
    badge: 'Hospitality Partner',
    description: 'Availability calendar, seasonal nightly rates, guest check-in/out, and cleaning.',
    route: '/portals/shortlet-hotel',
    monthlyFee: '₦18,000 / month',
    color: '#a855f7',
  },
};

export interface PartnerUser {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  isKycVerified: boolean;
  isAdminApproved: boolean;
  subscribedCategories: PartnerCategory[];
}

interface PartnerContextType {
  user: PartnerUser | null;
  loading: boolean;
  subscribeCategory: (cat: PartnerCategory) => void;
  hasAccess: (cat: PartnerCategory) => boolean;
  loginDemo: (category: PartnerCategory) => void;
  logout: () => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PartnerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage or backend cookie
    const saved = localStorage.getItem('smartassetz_partner_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    } else {
      // Default to demo verified partner with all portals unlocked for immediate inspection
      const initial: PartnerUser = {
        id: 1,
        username: 'partner_executive',
        email: 'partner@smartassetz.com',
        name: 'Smart Assetz Partner',
        phone: '+234 813 627 2360',
        role: 'agent',
        isKycVerified: true,
        isAdminApproved: true,
        subscribedCategories: ['agent', 'seller', 'landlord', 'investor', 'tenant', 'student', 'shortlet-hotel'],
      };
      setUser(initial);
      localStorage.setItem('smartassetz_partner_user', JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  const subscribeCategory = (cat: PartnerCategory) => {
    if (!user) return;
    const current = new Set(user.subscribedCategories);
    current.add(cat);
    const updated = { ...user, subscribedCategories: Array.from(current) };
    setUser(updated);
    localStorage.setItem('smartassetz_partner_user', JSON.stringify(updated));
  };

  const hasAccess = (cat: PartnerCategory) => {
    if (!user) return false;
    return user.subscribedCategories.includes(cat);
  };

  const loginDemo = (category: PartnerCategory) => {
    const demoUser: PartnerUser = {
      id: Date.now(),
      username: `${category}_user`,
      email: `${category}@smartassetz.com`,
      name: `${CATEGORY_INFO[category].name} Member`,
      phone: '+234 905 740 3562',
      role: category,
      isKycVerified: true,
      isAdminApproved: true,
      subscribedCategories: [category],
    };
    setUser(demoUser);
    localStorage.setItem('smartassetz_partner_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartassetz_partner_user');
  };

  return (
    <PartnerContext.Provider value={{ user, loading, subscribeCategory, hasAccess, loginDemo, logout }}>
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return context;
}
