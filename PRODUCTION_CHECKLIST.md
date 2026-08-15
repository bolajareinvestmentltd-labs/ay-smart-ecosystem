# Production Readiness Checklist — Target: Monday

## Status: ⚠️ 80% Ready (doable by Monday with focused effort)

### ✅ DONE (This Session)
- [x] Backend API auth endpoints (register, login, profile, refresh, logout)
- [x] Property CRUD API endpoints (`/api/properties/`, `/api/properties/{id}/`)
- [x] Admin panel loading (fixed Context copy bug)
- [x] Frontend light-mode theme fixes
- [x] Frontend splash-screen optimization
- [x] Database (Render PostgreSQL deployed and tested)
- [x] Frontend TailwindCSS & styling
- [x] Cookie-based JWT auth working end-to-end

### 🟡 PARTIAL/IN-PROGRESS
- [ ] **Image hosting solution** — Need to decide: Cloudinary, S3, or Render media (2-3 hours)
- [ ] **Image upload on admin** — Forms work, but need to test upload path (1 hour)
- [ ] **CI/CD migrations ordering** — Tests currently fail before migrate (30 min)
- [ ] **Environment secrets on Render** — Verify all .env vars are set (30 min)
- [ ] **Frontend build & deploy** — Test Vercel production build (30 min)
- [ ] **SSL/HTTPS certificate** — Ensure api.aysmartinvestmentltd.com has valid cert (✓ likely done)
- [ ] **DNS/domain pointing** — api.* and www.* point to correct hosts (need to confirm)

### ❌ NOT STARTED (Critical for Monday)
- [ ] **Smoke/E2E tests** — Verify full auth + property flows in prod
- [ ] **Load/stress test** — Check if backend handles traffic
- [ ] **Frontend PWA/manifest** — Already exists (real-estate-web/manifest.webmanifest)
- [ ] **Mobile responsiveness** — Test on phones
- [ ] **Error handling UI** — Show user-friendly errors instead of 500
- [ ] **Remove temporary debugging** — Exception logging middleware (optional, can stay for now)
- [ ] **Staging vs Production** — Confirm no staging/test data in prod DB

### 🚀 QUICK WINS (Do These First — 2-3 hours total)
1. **Add image hosting** (Cloudinary or Render media) — 30 min
2. **Test admin property create + image upload** — 30 min
3. **Verify Render environment vars** (all secrets set) — 15 min
4. **Run production build locally** (`pnpm build` in real-estate-web) — 30 min
5. **Test login flow end-to-end on prod domain** — 15 min
6. **Fix CI test ordering** (migrations before tests) — 15 min

### 📋 OPTIONAL (Post-Monday, if time)
- [ ] Sentry/error monitoring integration
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] Search indexing (SEO metadata)
- [ ] API rate limiting
- [ ] Automated backups

---

## Recommended Action Plan for Monday Launch

### Friday/Saturday (Today + Tomorrow) — 4-5 hours
1. **Pick image hosting** — Recommend: Cloudinary (free tier, quick setup)
   - Sign up, add API keys to Render env vars
   - Test upload via admin
   
2. **Fix remaining env issues** — Render dashboard
   - Verify: DATABASE_URL, SECRET_KEY, DEBUG=False, all email/payment keys
   
3. **Frontend production build** 
   - `cd apps/real-estate-web && pnpm build`
   - Deploy to Vercel (should be auto-triggered on git push)
   
4. **CI pipeline fix**
   - Add migration step before tests in your CI config
   
5. **Full smoke test** — from browser
   - Register new user → verify email → login → view properties → logout

### Sunday (Before launch)
1. **DNS double-check** — Both api.* and app domains resolve correctly
2. **SSL cert check** — https:// works without warnings
3. **Load test** (optional) — Use Apache Bench or k6 for ~50 concurrent users
4. **Backup DB** — Render → Backups tab

### Monday (Launch day)
1. Monitor logs for 1st hour
2. Keep exception logging middleware active for now (safe, helps debug)
3. Have a rollback plan (git tag the version deployed)

---

## Success Criteria
- ✅ Users can register and log in (both web + admin)
- ✅ Users can browse properties with images
- ✅ Admin can add properties + upload images
- ✅ No 500 errors in normal use flows
- ✅ Mobile-friendly layout works

---

## Estimated Effort to Full Production
- **If using Cloudinary**: 3-4 hours
- **If using Render media**: 2-3 hours
- **Total to Monday launch**: 5-7 hours of focused work
