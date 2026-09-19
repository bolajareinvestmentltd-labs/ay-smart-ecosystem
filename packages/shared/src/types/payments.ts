export type PaymentProvider = 'paystack' | 'wema';

export interface PaymentInitiationRequest {
  invoice_id?: string | number | null;
  plan?: string;
  amount?: number | string;
  provider?: PaymentProvider;
  email?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentVerificationRequest {
  reference: string;
  provider?: PaymentProvider;
}

export interface PaymentSessionPayload {
  id?: number | string | null;
  provider?: PaymentProvider;
  amount?: string | number | null;
  plan?: string | null;
  provider_reference?: string | null;
  access_code?: string | null;
  authorization_url?: string | null;
  payment_url?: string | null;
  transfer_instructions?: string | null;
  detail?: string | null;
  [key: string]: unknown;
}

export interface PaymentApiResponse<T> {
  ok: boolean;
  status: number;
  payload: T;
}
