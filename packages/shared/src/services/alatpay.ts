export type AlatPayCheckoutResult = {
  reference: string;
  provider: 'wema';
  status: 'success' | 'cancelled' | 'failed';
  payload?: Record<string, unknown>;
};

export type AlatPayCallback = (result: AlatPayCheckoutResult) => void;

export interface AlatPaySDK {
  setup: (config: Record<string, unknown>) => void;
  open: () => void;
  close?: () => void;
}

export interface AlatPayCheckoutOptions {
  amount: number;
  currency?: string;
  email?: string;
  phone?: string;
  reference: string;
  metadata?: Record<string, unknown>;
  publicKey?: string;
  label?: string;
  onSuccess?: AlatPayCallback;
  onCancel?: () => void;
  onError?: (error: Error) => void;
  zIndex?: number;
  autoOpen?: boolean;
}

declare global {
  interface Window {
    AlatPay?: AlatPaySDK;
  }
}

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

export function loadAlatPaySDK(): Promise<AlatPaySDK> {
  if (!hasWindow()) {
    return Promise.reject(new Error('ALATPay can only be loaded in the browser.'));
  }

  if (window.AlatPay) {
    return Promise.resolve(window.AlatPay);
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-alatpay-sdk="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.AlatPay) {
          resolve(window.AlatPay);
        } else {
          reject(new Error('ALATPay SDK failed to initialise.'));
        }
      }, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load the ALATPay SDK script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.alatpay.com/alatpay.js';
    script.dataset.alatpaySdk = 'true';
    script.async = true;
    script.onload = () => {
      if (window.AlatPay) {
        resolve(window.AlatPay);
      } else {
        reject(new Error('ALATPay SDK did not expose a window.AlatPay instance.'));
      }
    };
    script.onerror = () => reject(new Error('Unable to load the ALATPay SDK script.'));
    document.head.appendChild(script);
  });
}

export async function openZeroRedirectAlatpayCheckout(options: AlatPayCheckoutOptions): Promise<AlatPayCheckoutResult> {
  const sdk = await loadAlatPaySDK();

  return new Promise((resolve, reject) => {
    const config = {
      amount: options.amount,
      currency: options.currency ?? 'NGN',
      email: options.email,
      phone: options.phone,
      reference: options.reference,
      metadata: options.metadata ?? {},
      publicKey: options.publicKey ?? process.env.NEXT_PUBLIC_ALATPAY_API_KEY,
      label: options.label ?? 'SMART ASSETZ checkout',
      zIndex: options.zIndex ?? 1000,
      onSuccess: (result: Record<string, unknown>) => {
        const normalized = {
          reference: String(result.reference ?? options.reference),
          provider: 'wema' as const,
          status: 'success' as const,
          payload: result,
        };
        options.onSuccess?.(normalized);
        resolve(normalized);
      },
      onCancel: () => {
        const cancelled = {
          reference: options.reference,
          provider: 'wema' as const,
          status: 'cancelled' as const,
        } satisfies AlatPayCheckoutResult;
        options.onCancel?.();
        resolve(cancelled);
      },
      onError: (message: unknown) => {
        const error = new Error(typeof message === 'string' ? message : 'ALATPay checkout failed.');
        options.onError?.(error);
        reject(error);
      },
      autoOpen: options.autoOpen ?? true,
    };

    sdk.setup(config);

    if (typeof sdk.open === 'function') {
      sdk.open();
    }
  });
}

export function isAlatPayConfigured(): boolean {
  return typeof window !== 'undefined' && Boolean(window.AlatPay);
}
