export type DvaStatus = 'pending' | 'credited' | 'failed' | 'expired';

export interface DvaAccount {
  id: string;
  reference: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  currency: string;
  status: DvaStatus;
  createdAt: string;
  expiresAt?: string;
}

export interface DvaStatusPayload {
  reference: string;
  status: DvaStatus;
  amount?: number;
  accountNumber?: string;
  bankCode?: string;
  confirmedAt?: string;
  detail?: string;
}

export interface DvaRequestOptions {
  baseUrl?: string;
  fetcher?: (input: string, init?: RequestInit) => Promise<Response>;
  authToken?: string;
}

export async function createDvaAccount(
  amount: number,
  customerName: string,
  customerEmail: string,
  options: DvaRequestOptions = {},
): Promise<DvaAccount> {
  const baseUrl = options.baseUrl ?? '/api/payments/dva/';
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}),
    },
    body: JSON.stringify({
      amount,
      customer_name: customerName,
      customer_email: customerEmail,
      provider: 'wema',
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error((payload as { detail?: string })?.detail ?? 'Unable to create a dynamic virtual account.');
  }

  return (await response.json()) as DvaAccount;
}

export async function pollDvaStatus(
  reference: string,
  options: DvaRequestOptions = {},
  pollIntervalMs = 4000,
  maxAttempts = 10,
): Promise<DvaStatusPayload> {
  const baseUrl = options.baseUrl ?? '/api/payments/dva/';
  const fetcher = options.fetcher ?? fetch;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetcher(`${baseUrl}${reference}/status/`, {
      method: 'GET',
      headers: {
        ...(options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}),
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error((payload as { detail?: string })?.detail ?? 'Unable to fetch DVA status.');
    }

    const payload = (await response.json()) as DvaStatusPayload;
    if (payload.status !== 'pending') {
      return payload;
    }

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  }

  return {
    reference,
    status: 'pending',
    detail: 'DVA payment is still pending confirmation.',
  };
}

export function isDvaConfirmed(status: DvaStatus | string): boolean {
  return status === 'credited';
}
