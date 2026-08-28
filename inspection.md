# AY-SMART Inspection Checklist

## Completed

- [x] Keep AY-SMART branding on one line and use the official logo consistently in the main real-estate web flow.
- [x] Use the official AY-SMART logo in the Hostels & Stays section.
- [x] Keep the shared clock and theme controls available in the shared app layout and home header.
- [x] Provide dismissible overlay behavior with a visible close button on the hostel approval prompt.
- [x] Provide a category carousel on the home page.
- [x] Embed clickable Google Maps location actions inside property, hostel, and service-apartment cards.
- [x] Replace the standalone live-location grid with a Featured Service Apartments carousel.
- [x] Keep featured listings in a horizontally scrollable card row with stable image sizing.
- [x] Rename Popular rentals to Popular Hostels.
- [x] Keep detailed company information on the dedicated About page.
- [x] Consolidate support through the dedicated Support page and shared assistant.
- [x] Reduce the footer to copyright and developer attribution with the Jare's Choice Labs portfolio link.
- [x] Add spacing around the About page social links.
- [x] Apply cover-style image treatment to listing and profile imagery where assets exist.
- [x] Add the Certifications & Awards section with the available CAC registration statement.
- [x] Rename Trust & Assurance to Investment Assurance.
- [x] Add a branded HTML verification email with the SMART VERIFY button and plain-text fallback.
- [x] Show onboarding steps after email verification and route sign-in to the existing profile onboarding page.
- [x] Keep page transitions enabled through the existing App Router transition component.

## Remaining Work

### Priority 1: Production Payments

- [ ] Paystack production readiness
	- [ ] Add production public and secret keys through the deployment secret manager.
	- [x] Add the configured success callback URL to Paystack initialization.
	- [x] Add the signed Paystack webhook endpoint at `/api/payments/paystack/webhook/`.
	- [x] Verify Paystack webhook signatures with HMAC SHA-512.
	- [x] Validate provider reference and amount before settlement.
	- [x] Make settlement idempotent and prevent duplicate wallet/referral credits.
	- [x] Add automated tests for invalid signatures, successful settlement, and duplicate webhooks.
	- [ ] Confirm the production callback URL and successful transaction verification with live/staging credentials.
	- [ ] Test success, failure, duplicate webhook, and replay scenarios against the provider environment.

- [ ] Wema / ALAT Pay production readiness
	- [ ] Add production merchant credentials and callback configuration.
	- [x] Add the configured success callback URL to Wema initialization.
	- [x] Keep the signed Wema webhook endpoint at `/api/payments/wema/webhook/`.
	- [x] Verify Wema webhook signatures with HMAC SHA-256.
	- [x] Make successful Wema settlement idempotent and preserve success against failed replays.
	- [x] Add automated tests for Wema success and failed-notification replay handling.
	- [ ] Confirm the provider status-query and verification response contract with Wema documentation/credentials.
	- [ ] Test success, failure, duplicate notification, and timeout scenarios against the provider environment.

### Priority 2: Privacy and Mobile Quality

- [ ] Confirm private identity-document storage
	- [x] Use a private bucket or private Cloudinary delivery type for identity documents.
	- [x] Remove direct public access and serve documents only through authorized backend responses.
	- [x] Verify access denial for anonymous users and unrelated authenticated users.
	- [x] Confirm retention and deletion behavior for rejected or deleted accounts.

- [ ] Complete Android and iOS viewport/device testing
	- [x] Test home, properties, hostel, About, support, and verification pages in production-browser smoke checks.
	- [x] Test Android-small, Android-large, iPhone portrait, and iPad/tablet viewport layouts.
	- [x] Confirm no horizontal overflow, dock sizing, safe-area-aware dock spacing, and narrow-phone filter wrapping.
	- [ ] Test the native Capacitor builds on physical or emulator devices.

### Priority 3: External Integrations

- [ ] Choose and configure a weather provider
	- [ ] Select the provider, document rate limits, and add the API key as a server-side secret.
	- [ ] Add loading, empty, rate-limit, and provider-error states.
	- [ ] Verify that the UI does not expose the provider secret.

- [ ] Configure Google Places autocomplete
	- [ ] Add the browser-restricted Google Places key through deployment configuration.
	- [ ] Restrict the key to the approved domains and required Places APIs.
	- [ ] Connect autocomplete to location fields and preserve manual entry as a fallback.
	- [ ] Test Nigeria locations, no-result responses, rate limits, and mobile selection behavior.

- [ ] Configure social login buttons
	- [ ] Choose supported providers and register production OAuth redirect URLs.
	- [ ] Add provider client IDs and server-side secrets through deployment configuration.
	- [ ] Replace the current unavailable-state message with the real OAuth handoff.
	- [ ] Test success, cancellation, duplicate account, and provider-error paths.

### Priority 4: Product Enhancements

- [x] Upgrade the support assistant from keyword replies to a configured AI provider with a bounded knowledge source.
	- [x] Add server-side provider calls, timeout handling, rate limiting, and refusal/error fallback.
	- [x] Keep the existing Contact Support path as the live-agent fallback.
	- [x] Do not expose provider credentials in the browser.
	- [ ] Supply and verify the AI provider URL, API key, model, quota, and production monitoring configuration.

- [ ] Add the verified CEO photograph and confirmed CAC certificate asset when supplied.
	- [ ] Store assets in the approved public/private location.
	- [ ] Confirm image proportions and accessible alternative text.

## Progress Checkpoint

- [x] Home card location redesign completed and validated in source.
- [x] Featured Service Apartments section added with detail-page and Google Maps actions.
- [x] Browser viewport smoke testing completed for Android-small, Android-large, iPhone, and iPad dimensions.
- [ ] Resume next: run native Capacitor smoke testing on Android and iOS devices or emulators.

## Acceptance Order

1. Complete payment credentials and webhook verification in a staging environment.
2. Complete private document-storage access tests.
3. Run Android/iOS viewport and native smoke tests.
4. Configure weather, Google Places, and social OAuth integrations.
5. Upgrade the assistant and add verified leadership/certification assets.