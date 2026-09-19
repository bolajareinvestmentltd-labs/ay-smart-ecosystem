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
  amount?: number | string | null;
  plan?: string | null;
  provider_reference?: string | null;
  reference?: string | null;
  access_code?: string | null;
  authorization_url?: string | null;
  payment_url?: string | null;
  transfer_instructions?: string | null;
  detail?: string | null;
  [key: string]: unknown;
}

export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

export interface PaymentApiOptions {
  baseUrl?: string;
  fetcher?: (input: string, init?: FetchOptions) => Promise<Response>;
  authToken?: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

function mergeHeaders(headers?: Record<string, string>, authToken?: string) {
  return {
    ...defaultHeaders,
    ...(headers ?? {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

export async function callJson<T>(
  url: string,
  options: FetchOptions = {},
  apiOptions: PaymentApiOptions = {},
): Promise<T> {
  const resolver = apiOptions.fetcher ?? fetch;
  const response = await resolver(url, {
    method: options.method ?? 'GET',
    headers: mergeHeaders(options.headers, apiOptions.authToken),
    body: options.body,
    signal: options.signal,
  });

  const payload = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail = typeof payload === 'object' && payload && 'detail' in payload ? String((payload as any).detail) : undefined;
    throw new Error(detail || `Payment request failed with status ${response.status}`);
  }

  return payload as T;
}

export async function createPaymentSession(
  request: PaymentInitiationRequest,
  apiOptions: PaymentApiOptions = {},
): Promise<PaymentSessionPayload> {
  const baseUrl = apiOptions.baseUrl ?? '/api/payments/initiate/';
  return callJson<PaymentSessionPayload>(baseUrl, {
    method: 'POST',
    body: JSON.stringify(request),
  }, apiOptions);
}

export async function checkoutPayment(
  request: PaymentInitiationRequest,
  apiOptions: PaymentApiOptions = {},
): Promise<PaymentSessionPayload> {
  const baseUrl = apiOptions.baseUrl ?? '/api/payments/checkout/';
  return callJson<PaymentSessionPayload>(baseUrl, {
    method: 'POST',
    body: JSON.stringify(request),
  }, apiOptions);
}

export async function verifyPayment(
  request: PaymentVerificationRequest,
  apiOptions: PaymentApiOptions = {},
): Promise<PaymentSessionPayload> {
  const baseUrl = apiOptions.baseUrl ?? '/api/payments/verify/';
  return callJson<PaymentSessionPayload>(baseUrl, {
    method: 'POST',
    body: JSON.stringify(request),
  }, apiOptions);
}

export async function getPaymentStatus(
  reference: string,
  provider: PaymentProvider = 'paystack',
  apiOptions: PaymentApiOptions = {},
): Promise<PaymentSessionPayload> {
  return callJson<PaymentSessionPayload>(`${apiOptions.baseUrl ?? '/api/payments/verify/'}?reference=${encodeURIComponent(reference)}&provider=${encodeURIComponent(provider)}`, {
    method: 'GET',
  }, apiOptions);
}
