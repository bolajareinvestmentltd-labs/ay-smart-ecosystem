import { API } from '../config/site';

const apiBase = API.base.replace(/\/+$/, '');
const buildApiUrl = (input: RequestInfo) => {
  if (typeof input !== 'string') return input;
  if (input.startsWith('/api/')) {
    const path = input.replace(/^\/api/, '');
    return `${apiBase}${path}`;
  }
  return input;
};

// Cookie-based auth: login will set HttpOnly cookies; use credentials: 'include'.
export async function loginWithPassword(identifier: string, password: string) {
  try {
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
  const opts: RequestInit = { ...init, credentials: 'include' };
  let res = await fetch(url, opts);
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      res = await fetch(url, opts);
    }
  }
  return res;
}

const auth = { loginWithPassword, authFetch, refreshToken, logout, getCurrentUser };
export default auth;

export async function refreshToken() {
  try {
    const res = await fetch(buildApiUrl('/api/auth/refresh-cookie/'), { method: 'POST', credentials: 'include' });
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
