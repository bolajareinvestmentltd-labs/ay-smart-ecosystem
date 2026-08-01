# Email configuration and testing

This document explains how to wire SMTP providers (SendGrid, Mailgun, SMTP) and how to test email delivery for the AY'SMART backend.

1) Local development
- Recommended: use Django's in-memory email backend for fast, zero-config tests:
  - Set `EMAIL_BACKEND=django.core.mail.backends.locmem.EmailBackend` in `.env` or the environment.
  - The smoke test `python manage.py test_email_flow` uses this backend and validates the registration→verification→resend flow.

2) Console backend
- For debugging locally and to see email contents in logs, use:
  - `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`

3) SendGrid (SMTP)
- SMTP host: `smtp.sendgrid.net`
- SMTP username: `apikey`
- SMTP password: your SendGrid API key
- Example `.env` values:
  - EMAIL_HOST=smtp.sendgrid.net
  - EMAIL_PORT=587
  - EMAIL_HOST_USER=apikey
  - EMAIL_HOST_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxx
  - EMAIL_USE_TLS=True

4) Mailgun (SMTP)
- SMTP host: `smtp.mailgun.org`
- SMTP username: `postmaster@your-mailgun-domain`
- SMTP password: Mailgun SMTP password

5) Testing a real SMTP provider (SendGrid example)
- After setting `.env` values, restart Django and test via a simple management command or curl call to the resend endpoint (replace host/port as needed):

```bash
# send a verification resend request
curl -X POST -H "Content-Type: application/json" -d '{"email":"you@example.com"}' http://localhost:8000/api/auth/resend-verification/
```

- Check provider dashboard (SendGrid/Mailgun) for successful delivery and any suppression blocks.

6) Production considerations
- Use TLS (port 587) or SSL (465) depending on the provider.
- Use a verified sending domain to avoid deliverability issues.
- Add DKIM/SPF records for the sending domain.
- Do not store SMTP credentials in source control; use secrets managers or CI/CD secrets for pipelines.

8) Webhook verification
- Mailgun: set `MAILGUN_WEBHOOK_KEY` (your Mailgun signing key). The webhook handler verifies the HMAC-SHA256 signature (`timestamp+token`) using this key.
- SendGrid: set `SENDGRID_WEBHOOK_PUBLIC_KEY` to the provider's public key (PEM or base64). The webhook handler will optionally verify Ed25519 signatures when this key is present. If you provide this key, the webhook endpoint will reject unsigned requests.

Make sure your webhook endpoint is served over HTTPS and the URL is configured in your provider dashboard.

7) CI
- The GitHub Actions workflow runs the in-memory smoke test so you get early detection of regressions in the verification flow.

If you want, I can: (A) add SendGrid/Mailgun-specific helper code to send via provider APIs (instead of SMTP), (B) add a small monitoring alert for failures, or (C) wire a staging SendGrid account and perform a live send test. Which would you like next?