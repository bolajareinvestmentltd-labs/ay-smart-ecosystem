import { API } from '../config/site';

const apiBase = API.base.replace(/\/+$/, '');

export function buildApiUrl(input: RequestInfo) {
  if (typeof input !== 'string') return input;
  if (/^https?:\/\//i.test(input)) return input;
  if (input.startsWith('/api/')) return input;
  if (input.startsWith('/')) return `${apiBase}${input}`;
  return `${apiBase}/${input}`;
}
