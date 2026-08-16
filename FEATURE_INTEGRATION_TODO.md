# Zillow-Style Feature Integration Roadmap

## Goal
Build a full-featured marketplace experience aligned to the current AYSMART ecosystem, but anchored to the flows already in production:
- signup and login
- KYC and approval
- seller dashboard
- listing creation and review
- wallet and payment
- property/media workflow

The goal is not a hard clone of Zillow, but a production-ready marketplace product that matches the same user journey patterns while staying aligned with the existing backend and frontend architecture.

---

## Existing app alignment

The current codebase already covers the following:
- authentication and email verification
- user profile and KYC approval
- listing creation + multi-image upload requirement
- admin review and listing status management
- wallet / payment setup
- property catalog and detail page shell
- support flow and inspection booking

Primary files:
- [apps/real-estate-web/app/register/page.tsx](apps/real-estate-web/app/register/page.tsx)
- [apps/real-estate-web/app/auth/login/page.tsx](apps/real-estate-web/app/auth/login/page.tsx)
- [apps/real-estate-web/app/kyc/page.tsx](apps/real-estate-web/app/kyc/page.tsx)
- [apps/real-estate-web/app/dashboard/page.tsx](apps/real-estate-web/app/dashboard/page.tsx)
- [core-backend/core_api/models.py](core-backend/core_api/models.py)
- [core-backend/core_api/views.py](core-backend/core_api/views.py)
- [core-backend/core_api/admin.py](core-backend/core_api/admin.py)

---

## Todo execution plan

### Phase 1 — Marketplace foundation
- [ ] Add saved search model and API
- [ ] Add favorites and hidden listings models and APIs
- [ ] Add listing sharing and tracking models
- [ ] Add listing detail enhancements for gallery, floor plans, and tour URLs
- [ ] Add price/calculator and affordability logic
- [ ] Add sorting/filtering controls in listing endpoints

### Phase 2 — Search and discovery
- [ ] Build property search page with filter drawer
- [ ] Add map view toggle and boundary filter support
- [ ] Add saved search save/update/delete flow
- [ ] Add compare homes and shared folder flow
- [ ] Add property boundary and school overlays

### Phase 3 — Buying and renting flows
- [ ] Add tour request workflow
- [ ] Add listing detail request-to-apply flow
- [ ] Add unit detail and sorting for available units
- [ ] Add rental application and lease agreement models
- [ ] Add affordability and Zestimate-style pricing estimate module

### Phase 4 — Messaging and engagement
- [ ] Add conversation and inbox model
- [ ] Add message attachment upload and archive/report actions
- [ ] Add unread/read state tracking
- [ ] Add lead management and approval workflow
- [ ] Add reply and request-information workflow

### Phase 5 — Directory ecosystem
- [ ] Add agent directory and agent detail page
- [ ] Add builder directory and builder detail page
- [ ] Add property manager directory
- [ ] Add photographer directory
- [ ] Add partner invitation and collaboration flow

### Phase 6 — Account and settings
- [ ] Add notification settings and preference toggles
- [ ] Add profile image upload and profile settings UI
- [ ] Add password update and reset flow
- [ ] Add two-factor authentication setup flow
- [ ] Add account deactivation and reactivation flow

### Phase 7 — Operations and production readiness
- [ ] Add Django admin actions for listing, lead, inbox, and agent review
- [ ] Add seed data for default admin, sample listings, agents, builders, and notifications
- [ ] Add robust validation for all new API endpoints
- [ ] Add frontend production-ready error state handling
- [ ] Add deployment environment validation for backend and uploads

---

## Required new backend models

### Marketplace and discovery
- SavedSearch
  - user
  - filters_json
  - name
  - is_active
  - created_at
  - updated_at

- FavoriteListing
  - user
  - listing
  - created_at

- HiddenListing
  - user
  - listing
  - created_at

- ListingShare
  - user
  - listing
  - share_type
  - created_at

- ListingView
  - user
  - listing
  - viewed_at

### Property details
- PropertyAmenity
  - property
  - name
  - category

- PropertyFloorPlan
  - property
  - title
  - image
  - created_at

- PropertyTour
  - property
  - tour_url
  - is_active
  - created_at

- PropertyBoundary
  - property
  - label
  - geo_json

### Messaging and leads
- Conversation
  - user_a
  - user_b
  - listing
  - status
  - created_at

- ConversationMessage
  - conversation
  - sender
  - text
  - attachment
  - is_read
  - created_at

- Lead
  - user
  - property
  - source
  - status
  - priority
  - created_at

- TourRequest
  - user
  - listing
  - request_date
  - request_time
  - status

### Rental / lease / directory
- RentalApplication
  - user
  - listing
  - income
  - employment_status
  - status
  - created_at

- LeaseAgreement
  - property
  - tenant
  - start_date
  - end_date
  - status

- AgentProfile
- BuilderProfile
- PhotographerProfile
- PropertyManagerProfile

### Account settings
- NotificationPreference
  - user
  - email_enabled
  - push_enabled
  - sms_enabled
  - marketing_enabled

- UserReview
  - reviewer
  - reviewee
  - rating
  - comment
  - created_at

- UserPhoto
  - user
  - image
  - is_primary

---

## Frontend modules to add

### Discovery and UX
- PropertySearchPage
- PropertyFilterDrawer
- SavedSearchPanel
- ListingComparePanel
- MapToggleControl

### Listing detail
- ListingGallery
- FloorPlanSection
- TourEmbedSection
- DetailActionPanel
- TourRequestModal
- ShareListingDialog

### Messaging
- InboxPage
- ConversationThread
- MessageComposer
- AttachmentUploadBox

### Directory and account
- AgentDirectoryPage
- BuilderDirectoryPage
- ProfileSettingsPage
- NotificationSettingsPage
- SecuritySettingsPage

### Showcase components matching the reference UI
- Search bar
- floating action button
- form card
- segmented controls
- chips
- badge states
- carousel blocks
- stat panels
- tabbed content panels

---

## Django admin and seed plan

Use the existing admin structure in [core-backend/core_api/admin.py](core-backend/core_api/admin.py) and extend it for:
- listing approval/rejection
- hidden/favorite audits
- lead approval workflow
- conversation moderation
- tour scheduling approvals
- agent/builder profile verification
- notification settings review

Add management commands under [core-backend/core_api/management](core-backend/core_api/management) for:
- seed_default_admin
- seed_sample_listings
- seed_agents_and_builders
- seed_messages_and_leads
- seed_notification_preferences

---

## Production-ready implementation strategy

### Keep core flows intact
Do not replace the current user, KYC, listing, or payment flows. Extend them rather than rewrite them.

### Use domain-first modules
Separate feature work into modules:
- auth + profile
- listings + media
- discovery + search
- messages + leads
- rental + tours
- settings + notifications

### Build reusable UI layer
The screenshot references many small UI patterns. These should become shared UI blocks rather than one-off pages.

### Validate with real data early
Before broad rollout, validate with:
- actual admin listing review
- real upload + image processing
- real property search/filter queries
- real message thread flows
- real lead status updates

---

## Recommended implementation order

1. Saved search + favorites + hidden listings
2. Listing detail and gallery enhancements
3. Filtering, sorting, map view, and search page
4. Inbox and messaging
5. Tour request and rental application flow
6. Directory pages and lead approvals
7. Settings, notification, and security flows
8. Admin review and seed data
9. Deployment and smoke tests

---

## Delivery expectation

This is a staged production rollout, not a single patch. The current project is already strong enough to support the Zillow-style expansion without breaking its marketplace foundation. The correct execution path is to extend the existing flows, add the missing domain models, and then layer the richer UI patterns on top.
