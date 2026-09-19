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

export function isMockPaymentsEnabledForApi(): boolean {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_USE_MOCK_PAYMENTS === 'true') {
    return true;
  }

  if (typeof window !== 'undefined') {
    const runtimeFlag = (window as Window & { __NEXT_PUBLIC_USE_MOCK_PAYMENTS?: string }).__NEXT_PUBLIC_USE_MOCK_PAYMENTS;
    return runtimeFlag === 'true';
  }

  return false;
}

function createMockSession(request: PaymentInitiationRequest): PaymentSessionPayload {
  const reference = `TXN_MOCK_${Date.now()}`;
  return {
    id: 'mock-session-1',
    provider: 'wema',
    amount: Number(request.amount ?? 0),
    plan: request.plan ?? 'basic',
    provider_reference: reference,
    reference,
    payment_url: 'mock://wema-checkout',
    detail: 'Mock payment session created successfully.',
  };
}

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
  if (isMockPaymentsEnabledForApi()) {
    return createMockSession(request);
  }

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
  if (isMockPaymentsEnabledForApi()) {
    return createMockSession(request);
  }

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
  if (isMockPaymentsEnabledForApi()) {
    const reference = request.reference || `TXN_MOCK_${Date.now()}`;
    return {
      id: 'mock-verify-1',
      provider: 'wema',
      provider_reference: reference,
      reference,
      amount: 0,
      detail: 'Mock payment verified successfully in offline mode.',
    };
  }

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
