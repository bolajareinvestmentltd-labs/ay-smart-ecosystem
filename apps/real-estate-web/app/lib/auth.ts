import { buildApiUrl } from './api';

const REQUEST_TIMEOUT_MS = 8000;

function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => window.clearTimeout(timeout));
}

async function ensureCsrfCookie() {
  if (typeof document === 'undefined' || document.cookie.includes('csrftoken=')) return;
  await fetchWithTimeout(buildApiUrl('/api/auth/csrf/'), { credentials: 'include' }, 5000);
}

// Cookie-based auth: login will set HttpOnly cookies; use credentials: 'include'.
export async function loginWithPassword(identifier: string, password: string) {
  try {
    await ensureCsrfCookie();
    const res = await fetch(buildApiUrl('/api/auth/login-cookie/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: identifier, password }),
    });
    const payload = await res.json().catch(() => ({}));
    return { ok: res.ok, payload };
  } catch {
    return { ok: false, payload: { detail: 'Network error' } };
  }
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const url = buildApiUrl(input);
  if (init.method && !['GET', 'HEAD', 'OPTIONS'].includes(init.method.toUpperCase())) await ensureCsrfCookie();
  const opts: RequestInit = { ...init, credentials: 'include' };
  let res = await fetchWithTimeout(url, opts);
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      res = await fetchWithTimeout(url, opts);
    }
  }
  return res;
}

const auth = { loginWithPassword, authFetch, refreshToken, logout, getCurrentUser };
export default auth;

export async function refreshToken() {
  try {
    const res = await fetchWithTimeout(buildApiUrl('/api/auth/refresh-cookie/'), { method: 'POST', credentials: 'include' }, 5000);
    return res.ok;
  } catch {
    return false;
  }
}

export async function logout() {
  try {
    const res = await fetch(buildApiUrl('/api/auth/logout/'), { method: 'POST', credentials: 'include' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const res = await fetch(buildApiUrl('/api/auth/me/'), { credentials: 'include' });
    if (!res.ok) return null;
    return res.json().catch(() => null);
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user?.id;
}
