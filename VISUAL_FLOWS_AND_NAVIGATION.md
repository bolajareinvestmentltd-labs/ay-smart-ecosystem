# AY'SMART - Visual User Flows & Navigation Diagram

## 🗺️ Complete User Journey Map

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        AY'SMART ECOSYSTEM FLOWS                              │
└──────────────────────────────────────────────────────────────────────────────┘

GUEST USER (NOT LOGGED IN)
═══════════════════════════════════════════════════════════════════════════════

Landing Page (/)
├─ Hero section (60vh, auto-carousel of featured listings)
├─ Feature highlights section
├─ Browse category cards (Properties | Automotive | Hostels)
└─ Testimonials + Blog preview

      ↓ CLICK "BROWSE PROPERTIES" ↓

/properties (Browse - No Auth Required)
├─ Hero section with search/filter
├─ Featured carousel (auto-scroll)
├─ Grid of all properties (infinite scroll / pagination)
├─ Each card shows: image, title, location, price
└─ Hover state: slight scale + "View Details" CTA

      ↓ CLICK ON PROPERTY CARD ↓

/properties/[id] (Detail View - No Auth Required)
├─ Large hero image with parallax
├─ Property details (beds, baths, size)
├─ Agent/seller info card (right sidebar)
├─ Gallery grid
├─ Location map
├─ Similar listings carousel
└─ "Book Inspection" Button
      ↓
   [OVERLAY] "Sign in required to book inspection"
      ├─ [Sign In Button] → /auth/login?next=/properties/[id]/inspect
      └─ [Create Account] → /register


AFTER SIGN UP & EMAIL VERIFICATION
═══════════════════════════════════════════════════════════════════════════════

/auth/login (email verified, user logs in)
      ↓ Auto-redirect after login ↓
/auth/profile (Onboarding for first-time users)
├─ Welcome message + account summary
├─ Next steps checklist (KYC, create listing, etc.)
└─ [Get Started → Dashboard button]
      ↓ OR navigate to ↓
/kyc/step-1 (KYC Verification begins)
├─ Step 1: Choose ID type
│  ├─ NIN (Facial verification + auto-match)
│  ├─ Voters ID (Upload + 24-hour manual review)
│  └─ International Passport (Upload + 24-hour manual review)
└─ [Next button]
      ↓
/kyc/step-2 (ID Submission)
├─ If NIN: Upload NIN number + take facial photo
├─ If Voters/Passport: Upload document image
└─ [Next button]
      ↓
/kyc/step-3 (Facial Verification - NIN only)
├─ Webcam capture for liveness check
├─ Match against NIN database
└─ [Complete KYC button]
      ↓ (or skip for Voters/Passport) ↓
/kyc/step-4 (Review & Submit)
├─ Summary of submitted documents
├─ Status: "Submitted for verification"
└─ [Dashboard button]
      ↓
/dashboard (Seller/Buyer Hub)
├─ Welcome header (name + wallet balance)
├─ Navigation menu
├─ Create listing form (CTA: submit for review)
├─ My listings (status: pending/live)
├─ My bookings (if buyer)
└─ My wallet (earnings/transactions)


SELLER JOURNEY (Creating Listings)
═══════════════════════════════════════════════════════════════════════════════

/dashboard (After KYC verified)
└─ [Create Listing button]
      ↓
/properties/create (Multi-step form)
├─ Step 1: Basic details
│  ├─ Title, category, location
│  └─ Price, listing type (sale/rent)
├─ Step 2: Details
│  ├─ Description, amenities, features
│  └─ Beds, baths, area
├─ Step 3: Images
│  ├─ Upload hero image
│  ├─ Upload gallery images
│  └─ Drag to reorder
└─ Step 4: Review & Submit
   ├─ Summary of all details
   └─ [Submit for Review button]
      ↓
/dashboard (Listing submitted)
├─ Card shows listing with status: "Pending Review"
├─ (Admin reviews within 24-48 hours)
├─ Once approved → status changes to "Live"
└─ Listing appears in /properties grid & featured carousel


BUYER JOURNEY (After KYC Verified)
═══════════════════════════════════════════════════════════════════════════════

/properties (User now logged in + KYC verified)
└─ [Book Inspection] button is now active (no overlay)
      ↓ CLICK "BOOK INSPECTION" ↓

/properties/[id]/inspect (Booking Page)
├─ Property details recap (left)
├─ Booking form (right)
│  ├─ [Calendar picker]
│  ├─ [Time slot selector]
│  ├─ [Your info prefilled]
│  └─ [Book Inspection button]
      ↓
/payments/checkout (Payment gateway)
├─ Booking summary
├─ Price breakdown
├─ Payment methods (card, bank transfer)
└─ [Pay & Confirm button]
      ↓
/orders/[id] (Confirmation)
├─ Booking confirmed message
├─ Inspection details
├─ Agent contact info
├─ Calendar invite (downloadable)
└─ [Back to Dashboard button]

      ↓ LATER ↓

/orders (My Activity / Bookings)
├─ List of all inspections
├─ Status: upcoming, completed, cancelled
├─ Action buttons: reschedule, cancel, message agent
└─ Ratings & reviews (after inspection)
```

---

## 🎨 Navigation Structure (Desktop + Mobile)

```
HEADER (Sticky at top)
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Logo: AY'SMART]  [← Back or Explore link]  [Auth Status]
│  (clickable)                                   │
│                                                │
│  Light version on dark background             [Sign In]
│                                                │
└─────────────────────────────────────────────────────────┘

        ↓                ↓                 ↓

      HOME          CONTENT AREA          PROFILE
                                          (If logged in)


DOCK NAVIGATION (Fixed at bottom)
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Home    Browse    Activity    Account    Theme 🌙    │
│   🏠      🔍        📋         👤         (Toggle)     │
│                                                         │
│  (Responsive: Collapses to 4 items on mobile)         │
│                                                         │
└─────────────────────────────────────────────────────────┘


MOBILE LAYOUT
┌─────────────────────────────────────────────────────────┐
│ [Logo]  [← Back]  [Auth]                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│        [Full-width content area]                       │
│        (Responsive: 1 column)                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Home  Browse  Activity  Account  Theme                  │
│ (Dock nav at bottom, space for all 5 items)           │
└─────────────────────────────────────────────────────────┘


DESKTOP LAYOUT
┌──────────────────────────────────────────────────────────┐
│ [Logo]  [← Back]  [Auth]                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│              [Wide content area]                        │
│              (Responsive: 2-3 columns)                  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ Home  Browse  Activity  Account  Theme  │  [Footer]     │
│ (Dock nav at bottom)       │  (Minimal, right-aligned)  │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Page Template Flow (Reusable Pattern)

### Listing Pages: /properties, /automotive, /hostel

```
┌─────────────────────────────────────────────┐
│ STICKY HEADER                               │ z: 50
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                                             │
│        HERO SECTION (40-60vh)              │
│                                             │ Parallax
│        [Title + Subtitle + Search/Filter]  │ Background
│                                             │
│        py-20 (large breathing room)        │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ FEATURED CAROUSEL SECTION                   │ Sticky on scroll
├─────────────────────────────────────────────┤ z: 40
│ "Featured Listings"                         │
│                                             │
│ [Large auto-scrolling carousel cards]      │
│ [Pagination dots below]                     │
│                                             │
│ py-16 (breathing room)                     │
│ px-4-8 (responsive padding)                │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ FILTER BAR (Sticky secondary)              │ z: 30
├─────────────────────────────────────────────┤ Slides down
│ [Location ▼] [Price ▼] [Type ▼] [More ▼]  │ on scroll
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ GRID SECTION                                │
├─────────────────────────────────────────────┤
│ All Listings                                │
│                                             │
│ [Card 1]  [Card 2]  [Card 3]               │
│ (Lazy load on scroll)                       │
│ (Infinite scroll or "Load more" button)    │
│                                             │
│ py-12 (spacing)                             │
│ gap-6 (card spacing)                        │
│                                             │
│ Responsive:                                 │
│   Mobile: 1 column                          │
│   Tablet: 2 columns                         │
│   Desktop: 3 columns                        │
│   Ultra: 4 columns (if needed)              │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ FOOTER (Desktop only, hidden on mobile)     │ py-16
├─────────────────────────────────────────────┤
│ [Brand] | [Links] | [Newsletter]           │
│ (Minimal, 2-column layout)                  │
│                                             │
└─────────────────────────────────────────────┘

         [DOCK NAVIGATION - Fixed bottom]
```

---

## 🎠 Carousel Component Behavior

```
┌────────────────────────────────────────────────────────┐
│ FEATURED LISTINGS                                      │
│                                                        │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [High-res Image]                                 │  │
│ │ [Overlay: Category badge + Price]                │  │
│ │                                                   │  │
│ │ [On Hover: Subtle overlay with CTA]             │  │
│ │  - Glow effect on border                         │  │
│ │  - Scale 1.02                                    │  │
│ │  - "View Details >" appears               │
│ │                                                   │  │
│ └──────────────────────────────────────────────────┘  │
│  ◀ prev    ● ● ● ● ⦿ ● ● ●     next ▶              │
│            (Pagination dots)                          │
│                                                        │
│ AUTO-PLAY: Every 4.5 seconds                          │
│ TRANSITION: Smooth fade 500ms                         │
│ ON HOVER: Pause auto-play                             │
│ ON TOUCH: Swipe detection enabled                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 📊 Component Reuse Across Pages

```
COMPONENT MATRIX (X = Used)

Component           /     /props  /auto   /hostel  /detail  /dashboard
────────────────────────────────────────────────────────────────────────
PremiumCarousel     X      X       X        X         -         -
HeroHeader          X      X       X        X         X         -
FilterBar           -      X       X        X         -         -
ListingCard         -      X       X        X         -         -
EmptyState          -      X       X        X         -         X
CTAButton           X      X       X        X         X         X
Footer              X      X       X        X         X         -
Header              X      X       X        X         X         X
DockNav             X      X       X        X         X         X
────────────────────────────────────────────────────────────────────────

RESULT: 8 components, 40+ implementations = NO duplication ✓
```

---

## 🎬 Animation Sequence Examples

### Page Load Animation
```
Timeline (0-1000ms):
───────────────────────────────────────────────

0ms:    Header fades in (opacity 0 → 1, 300ms)
100ms:  Hero section slides up (y: 40 → 0, 600ms ease-out)
200ms:  Carousel cards stagger in
        Card 1: 300ms
        Card 2: 400ms (+100ms delay)
        Card 3: 500ms (+200ms delay)
300ms:  Filter bar slides down (y: -20 → 0, 300ms)
600ms:  Grid cards fade in staggered
        Cards 1-3: 300ms with 100ms stagger
800ms:  Footer fades in (if visible)
1000ms: All animations complete, page interactive
```

### Hover Animation (Card)
```
Timeline (0-200ms):
───────────────────────────────────────────────

0ms:    User hovers over card
        ├─ Background: bg-white/5 → bg-white/10
        ├─ Scale: 1.0 → 1.03
        ├─ Shadow: shadow-sm → shadow-2xl
        ├─ Border: border-white/10 → border-brand-purple
        └─ Duration: 200ms ease

200ms:  Card in hover state
        ├─ CTA text appears (fade in 200ms)
        └─ User can click "View Details"

User leaves hover:
        ├─ Reverse animation (200ms ease)
        └─ Back to initial state
```

### Carousel Auto-Scroll
```
Timeline (0-4500ms):
───────────────────────────────────────────────

0ms:    Carousel displays slide 1
        Pagination dot 1 is highlighted (scale: 1.2)

1500ms: [Pause for user to read]

4000ms: Begin transition to slide 2
        Slide 1: fade out (200ms)
        Slide 2: fade in (200ms)
        Dot 1: scale 1.2 → 1.0 (200ms)
        Dot 2: scale 1.0 → 1.2 (200ms)

4500ms: Slide 2 displayed, timer resets
        If user hasn't hovered: continue auto-play
        If user has hovered: pause and show manual controls
```

---

## 🎨 Color Application (No Chaos)

```
NEUTRAL PALETTE (40% of page)
├─ Background: #07070D (near-black)
├─ Surfaces: #09090B/80 (cards)
├─ Text primary: #FFFFFF (100% white)
├─ Text secondary: #A1A1A1 (zinc-400)
├─ Borders: rgba(255,255,255,0.1) (white/10)
└─ Disabled: rgba(255,255,255,0.05) (white/5)

BRAND ACCENT PALETTE (30% of page)
├─ Primary action: #A855F7 (purple)
├─ Hover state: #9333EA (purple-600)
├─ Focus ring: #A855F7/20 (purple glow)
├─ Secondary: #FCD34D (amber)
└─ Hover secondary: #FBBF24 (amber-400)

FEEDBACK PALETTE (10% of page)
├─ Success: #22C55E (green)
├─ Warning: #F59E0B (orange)
├─ Error: #EF4444 (red)
└─ Info: #06B6D4 (cyan)

WHITESPACE (20% of page)
├─ Margins: py-12 to py-20
├─ Padding: p-4 to p-8
├─ Gaps: gap-4 to gap-6
└─ Line height: leading-7 to leading-relaxed

USAGE RULES:
- Purple for primary CTAs only
- Amber for badges/highlights (sparse)
- Grayscale for 80% of UI
- Bold colors only for critical feedback
- Whitespace is premium, not empty
```

---

## ✨ Spacing & Typography System

```
TYPOGRAPHY
───────────────────────────────────────────

Accent Label:
├─ Size: text-xs (12px)
├─ Weight: font-semibold
├─ Case: uppercase
├─ Tracking: tracking-[0.3em] (very wide)
└─ Color: text-brand-accent

Page Heading:
├─ Size: text-4xl (36px)
├─ Weight: font-black
├─ Tracking: tracking-tight
├─ Line height: leading-tight
└─ Color: text-white

Section Heading:
├─ Size: text-2xl (24px)
├─ Weight: font-bold
├─ Tracking: tracking-normal
└─ Color: text-white

Body Text:
├─ Size: text-base (16px)
├─ Weight: font-normal
├─ Line height: leading-7
└─ Color: text-zinc-400

Card Title:
├─ Size: text-lg (18px)
├─ Weight: font-bold
└─ Color: text-white

Card Meta:
├─ Size: text-sm (14px)
├─ Weight: font-normal
└─ Color: text-zinc-500


SPACING (Vertical)
───────────────────────────────────────────

Page sections:    py-16 to py-20  (breathing room)
Card internal:    p-6 (comfortable padding)
List items:       space-y-3 to space-y-4 (scannable)
Bottom padding:   pb-24 (room for dock nav)

Hero section:     py-20 (dominant)
Featured area:    py-16 (prominent)
Grid area:        py-12 (standard)
Footer:           py-16 (spacious)


SPACING (Horizontal)
───────────────────────────────────────────

Page max-width:   max-w-6xl (1152px on desktop)
Page padding:     px-4 (mobile) to px-8 (desktop)
Card spacing:     gap-6 (6 * 4px = 24px)
Grid columns:     1 (mobile), 2 (tablet), 3 (desktop)
```

---

## 📋 Premium Checklist (Per Page)

```
Before launch, every page should have:

STRUCTURE ✓
├─ [ ] Single column layout (mobile-first)
├─ [ ] max-w-6xl container for content
├─ [ ] Consistent py-16+ spacing between sections
├─ [ ] No section is "crowded"
└─ [ ] Dock nav has pb-24 clearance at bottom

TYPOGRAPHY ✓
├─ [ ] Max 3 font sizes per page
├─ [ ] Hierarchy is clear (accent → heading → body)
├─ [ ] All text has sufficient contrast
├─ [ ] Line height is generous (leading-7+)
└─ [ ] Font weights are semantic (bold for emphasis only)

ANIMATIONS ✓
├─ [ ] All transitions are 200-600ms
├─ [ ] Easing is ease-out (not linear)
├─ [ ] Staggered animations have <150ms delays
├─ [ ] No animation lasts >800ms (feels slow)
└─ [ ] Carousel auto-plays and is pausable

INTERACTIVITY ✓
├─ [ ] All buttons have hover states
├─ [ ] Cards have scale/shadow on hover
├─ [ ] Loading states show skeleton or spinner
├─ [ ] Disabled states are visually distinct
└─ [ ] Touch targets are 44px+ on mobile

IMAGES ✓
├─ [ ] Hero image is optimized (<200KB)
├─ [ ] Thumbnails are lazy-loaded
├─ [ ] No layout shift (aspect ratio locked)
├─ [ ] Alt text on all images
└─ [ ] Responsive srcset where applicable

ACCESSIBILITY ✓
├─ [ ] Focus ring visible on all interactive elements
├─ [ ] ARIA labels on buttons/icons
├─ [ ] Color contrast passes WCAG AA
├─ [ ] Keyboard navigation works
└─ [ ] Screen reader tested

PERFORMANCE ✓
├─ [ ] Page load <3 seconds
├─ [ ] Lighthouse score >90
├─ [ ] Images optimized with Next.js Image
├─ [ ] Code splitting (dynamic imports for heavy components)
└─ [ ] No console errors
```

---

## Summary: This Structure Delivers

✅ **Premium Aesthetic:** Negative space + minimal clutter = luxury feel  
✅ **Efficient Codebase:** 8 components used 40+ times = no duplication  
✅ **Scalable System:** Same pattern works for all listing types  
✅ **Smooth Experience:** Animations guide user attention naturally  
✅ **Guest Conversion:** Browse → Sign up → Complete → Earn flow  
✅ **Mobile First:** Works perfectly on all devices  
✅ **Performance:** Lazy loading, code splitting, optimized images  

**Ready to implement? Pick a component to start with and we'll build it systematically.** 🚀
