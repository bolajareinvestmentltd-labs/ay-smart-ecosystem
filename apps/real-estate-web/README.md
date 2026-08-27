This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project now uses a shared root `.env` file at the repository root for both frontend and backend configuration.
For development, create a root `.env` file with values like:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=AY'Smart Properties & Construction
```

Then restart both the frontend and backend so the shared env values are loaded.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit it.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing-fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production deployment setup

This repo shares configuration via the repository root `.env` file for both frontend and backend. For production, set secrets and production values in your Render and Vercel dashboards instead of committing them.

### Backend (Render)

Set these environment variables in the Render service where the Django backend runs:

```env
DJANGO_SECRET_KEY=<your-generated-secret>
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,ay-smart-backend.onrender.com,api.aysmartinvestmentltd.com
CORS_ALLOWED_ORIGINS=https://aysmartinvestmentltd.com,https://www.aysmartinvestmentltd.com
CSRF_TRUSTED_ORIGINS=https://aysmartinvestmentltd.com,https://www.aysmartinvestmentltd.com
FRONTEND_URL=https://aysmartinvestmentltd.com
EMAIL_LOGO_URL=https://aysmartinvestmentltd.com/assets/ay-smart-logo.png
NEXT_PUBLIC_API_URL=https://api.aysmartinvestmentltd.com/api

RESEND_API_KEY=<your-resend-api-key>
RESEND_WEBHOOK_SIGNING_SECRET=<your-resend-webhook-signing-secret>
DEFAULT_FROM_EMAIL=noreply@aysmartinvestmentltd.com
SUPPORT_EMAIL=support@aysmartinvestmentltd.com
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=<your-resend-api-key>
EMAIL_USE_TLS=True

# Dojah production NIN + selfie face verification (server only)
DOJAH_API_URL=https://api.dojah.io
DOJAH_APP_ID=<your-dojah-app-id>
DOJAH_SECRET_KEY=<your-dojah-secret-key>
DOJAH_FACE_MATCH_THRESHOLD=85

# Optional OpenAI-compatible AY-SMART support assistant (server-side only)
AI_ASSISTANT_URL=https://api.openai.com/v1/chat/completions
AI_ASSISTANT_API_KEY=<your-ai-provider-key>
AI_ASSISTANT_MODEL=gpt-4o-mini
AI_ASSISTANT_TIMEOUT=8
AI_ASSISTANT_MAX_TOKENS=220

# Seller/agent supporting identity evidence is uploaded through the KYC form.
# Accepted types include Voters Card, International Passport, Drivers License, and National ID.
```

### Support and KYC requirements

- Support requests submitted through the app are emailed to `SUPPORT_EMAIL`; if it is unset, the backend falls back to `DEFAULT_FROM_EMAIL`. The production recipient is `support@aysmartinvestmentltd.com`.
- Seller and agent KYC submissions require an 11-digit NIN, selfie, identity-document type, identity-document number, and an uploaded identity document. Accepted document types are Voters Card, International Passport, Drivers License, and National ID.
- Student verification requires a matric number, student email, and student ID image.
- Listing location links open in Google Maps externally. No embedded Google Maps API key is required for the current navigation flow.

> Important: `NEXT_PUBLIC_API_URL` should point to your backend API root. If you set it without `/api`, the frontend now automatically appends it for all internal backend requests.

> Recommended Render fix: use a Render-managed PostgreSQL database for `DATABASE_URL`. Supabase may resolve only to IPv6 and can fail from Render if your host has no IPv4 route.

### Frontend (Vercel)

Set these environment variables in the Vercel project:

```env
NEXT_PUBLIC_API_URL=https://api.aysmartinvestmentltd.com/api
NEXT_PUBLIC_SITE_NAME=AY'Smart Properties & Construction
NEXT_PUBLIC_SITE_EMAIL=support@aysmartinvestmentltd.com
NEXT_PUBLIC_SITE_PHONE=+234 700 000 0000
NEXT_PUBLIC_SITE_WHATSAPP=+234 800 000 0000
NEXT_PUBLIC_SITE_ADDRESS="Lagos, Nigeria"
NEXT_PUBLIC_SITE_HOURS="Mon–Sat 8:00am–6:00pm"

# Optional, only if replacing Google Maps links with an embedded JS map
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<browser-restricted-google-maps-key>
```

### DNS mapping

- `aysmartinvestmentltd.com` A → Vercel root IP
- `www` CNAME → Vercel target
- `api` CNAME → `ay-smart-backend.onrender.com.`

Do not commit real secrets to git. Use service environment variables in Render and Vercel for production.
