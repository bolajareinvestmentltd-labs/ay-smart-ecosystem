// Centralized site config (uses NEXT_PUBLIC_ prefixed vars for client use)
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "AY'SMART ECO",
  email: process.env.NEXT_PUBLIC_SITE_EMAIL || 'support@aysmartinvestmentltd.com',
  phone: process.env.NEXT_PUBLIC_SITE_PHONE || '+234 700 000 0000',
  whatsapp: process.env.NEXT_PUBLIC_SITE_WHATSAPP || '+234 800 000 0000',
  address: process.env.NEXT_PUBLIC_SITE_ADDRESS || 'Lagos, Nigeria',
  hours: process.env.NEXT_PUBLIC_SITE_HOURS || 'Mon–Sat 8:00am–6:00pm',
};

function normalizeApiUrl(rawUrl: string) {
  const trimmed = rawUrl.trim().replace(/\/+$|\s+$/g, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

export const API = {
  base: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'),
};
