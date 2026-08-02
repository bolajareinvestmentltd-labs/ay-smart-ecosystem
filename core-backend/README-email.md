# Email configuration and testing

This document explains how to wire Resend for verification emails and how to test the AY'SMART backend email flow.

1) Local development
- Recommended: use Django's in-memory email backend for fast, zero-config tests:
  - Set `EMAIL_BACKEND=django.core.mail.backends.locmem.EmailBackend` in `.env` or the environment.
  - The smoke test `python manage.py test_email_flow` uses this backend and validates the registration→verification→resend flow.

2) Console backend
- For debugging locally and to see email contents in logs, use:
  - `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`

3) Resend (recommended)
- SMTP host: `smtp.resend.com`
- SMTP username: `resend`
- SMTP password: your Resend API key
- Example `.env` values:
  - `EMAIL_HOST=smtp.resend.com`
  - `EMAIL_PORT=587`
  - `EMAIL_HOST_USER=resend`
  - `EMAIL_HOST_PASSWORD=re_your_resend_api_key_here`
  - `EMAIL_USE_TLS=True`
  - `DEFAULT_FROM_EMAIL=noreply@resend.dev`
  - `RESEND_API_KEY=re_your_resend_api_key_here`

4) Testing a real Resend account
- After setting `.env` values, restart Django and test via a simple management command or curl call to the resend endpoint (replace host/port as needed):

```bash
# send a verification resend request
curl -X POST -H "Content-Type: application/json" -d '{"email":"you@example.com"}' http://localhost:8000/api/auth/resend-verification/
```

- Check your Resend dashboard for successful delivery and any suppression blocks.

5) Production considerations
- Use TLS (port 587) or SSL (465) depending on the provider.
- Use a verified sending domain to avoid deliverability issues.
- Add SPF/DKIM records for the sending domain.
- Do not store SMTP credentials in source control; use secrets managers or CI/CD secrets for pipelines.

6) Webhook verification
- Set `RESEND_WEBHOOK_SIGNING_SECRET` to the signing secret from your Resend webhook configuration. The webhook handler validates signatures when that secret is present.

Make sure your webhook endpoint is served over HTTPS and the URL is configured in your Resend dashboard.

7) CI
- The GitHub Actions workflow runs the in-memory smoke test so you get early detection of regressions in the verification flow.
