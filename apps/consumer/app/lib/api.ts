import { API } from '../config/site';

const apiBase = API.base.replace(/\/+$/, '');
const apiBaseWithApi = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;

export function buildApiUrl(input: RequestInfo) {
  if (typeof input !== 'string') return input;
  if (/^https?:\/\//i.test(input)) return input;

  const normalizedPath = input.startsWith('/') ? input : `/${input}`;

  if (input.startsWith('/api/')) {
    return apiBase.endsWith('/api')
      ? `${apiBase}${input.slice(4)}`
      : `${apiBaseWithApi}${input.slice(4)}`;
  }

  return `${apiBaseWithApi}${normalizedPath}`;
}
