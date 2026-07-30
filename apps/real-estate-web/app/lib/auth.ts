// Cookie-based auth: login will set HttpOnly cookies; use credentials: 'include'.
export async function loginWithPassword(identifier: string, password: string) {
  try {
    const res = await fetch('/api/auth/login-cookie/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: identifier, password }),
    });
    const payload = await res.json().catch(() => ({}));
    return { ok: res.ok, payload };
  } catch (err) {
    return { ok: false, payload: { detail: 'Network error' } };
  }
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  // Try request, on 401 attempt a single refresh then retry once.
  const opts = { ...init, credentials: 'include' };
  let res = await fetch(input, opts);
  if (res.status === 401) {
    // try refresh
    const refreshed = await refreshToken();
    if (refreshed) {
      res = await fetch(input, opts);
    }
  }
  return res;
}

export default { loginWithPassword, authFetch };

export async function refreshToken() {
  try {
    const res = await fetch('/api/auth/refresh-cookie/', { method: 'POST', credentials: 'include' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function logout() {
  try {
    const res = await fetch('/api/auth/logout/', { method: 'POST', credentials: 'include' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function isAuthenticated() {
  try {
    const res = await fetch('/api/auth/me/', { credentials: 'include' });
    if (!res.ok) return false;
    const payload = await res.json().catch(() => null);
    return !!payload?.id;
  } catch (e) {
    return false;
  }
}
