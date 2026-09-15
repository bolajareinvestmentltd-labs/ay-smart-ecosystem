export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: 'buyer' | 'seller' | 'staff';
  avatarUrl?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price?: number;
  currency?: string;
  location?: string;
  listingType?: 'property' | 'vehicle' | 'hostel' | 'serviceApartment' | 'listing';
  images?: string[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HostelBooking {
  id: string;
  userId: string;
  listingId: string;
  bookingCode: string;
  checkInDate: string;
  checkOutDate?: string;
  status: BookingStatus;
  totalAmount: number;
  currency?: string;
  paymentStatus: PaymentStatus;
  createdAt?: string;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  gateway: 'paystack' | 'wema' | 'manual';
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}
