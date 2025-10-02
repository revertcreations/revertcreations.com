# Manual Regression Checklist — Launch Readiness

Use this worksheet while executing the launch regression plan (`docs/qa/mobile-regression-plan.md`). Capture pass/fail notes, bugs, and follow-up items so we can update the decision log and production checklist quickly.

## Environment Prep
- [x] Confirm staging API healthy (`https://staging.junkyardwatchdog.com/health`). — 2025-09-30 19:10 UTC: `{"status":"ok"}`.
- [x] Verify Playwright smoke (prod + staging) green prior to manual run. — 2025-09-30: 7/7 passing on both hosts (see regression log).
- [ ] Clear/seed watchlists and demo data as needed (`php artisan admin:demo:seed` on staging).
- [ ] Prepare test accounts:
  - Free baseline: `free-smoke@junkyardwatchdog.com` (reset password if needed).
  - Paid smoke: `pro-smoke@junkyardwatchdog.com` (set to Pro, reset after run).
  - Admin: `trever@revertcreations.com` / `LaunchDay2024!`.
- [ ] Gather Stripe test cards, Mailgun logs, Expo push tokens for device testing.

## iOS (TestFlight Release Candidate)
(BobbleheadLeela • build 1.0.0 (2) — TestFlight prod API)
- [x] Install latest RC build via TestFlight (record build number). — `1.0.0 (2)`
- [ ] Login/logout flows (email + password reset). — Forgot password opens Mail app instead of sending in-app reset; password change screen lacks eye icon and keyboard hides requirements.
- [ ] Watchlist CRUD + radius adjustments; verify badges. — Toggles don’t use brand coral when enabled.
- [ ] Garage project creation with photo upload (Cloudinary asset appears in admin). — Prod upload fails with “Cloudinary not configured”.
- [x] Push notification end-to-end (register device → admin test push → tap deep link). — Test push delivered 2025-09-30.
- [ ] Billing upgrade/downgrade/cancel via hosted web checkout; confirm Stripe portal entries and in-app entitlements. — Upgrade charged successfully; subscription canceled & refunded via Stripe (sub_1SDANr… / refund re_3SDANr…).
- [ ] Offline behaviour (Airplane Mode) shows banner and recovers gracefully. — No offline banner displayed.
- [x] Accessibility: VoiceOver basic navigation, Dynamic Type (Large) sanity checks. — Basic navigation OK.
- [x] Performance spot checks: cold start timing, scrolling inventory list, memory (Xcode instruments optional). — Smooth; no performance issues noted.
- Notes / Issues:
  - Forgot-password flow opens Mail app instead of sending a reset (needs better UX).
  - Change-password screen missing show/hide icons; requirements hidden behind keyboard.
  - Watchlist notification toggles use default color; should match coral brand token.
  - Garage photo upload failing in production (“Cloudinary not configured”).
  - Offline banner absent when toggling Airplane Mode.

## Android (Internal Testing Build)
(Requires physical device run; pending)
- [ ] Install latest build from Play Internal Testing (record version code).
- [ ] Repeat auth/watchlist/digest preference checks.
- [ ] Push notification registration + tap-through.
- [ ] Billing portal flows in Chrome Custom Tabs.
- [ ] Offline banner & retry interactions.
- [ ] TalkBack, font scaling, dark mode.
- [ ] Performance spot checks (ADB `adb shell dumpsys meminfo`, profiler quick look).
- Notes / Issues:

## Web (Desktop & Mobile Browser)
(Schedule alongside device pass)
- [ ] Marketing site smoke (hero CTA, pricing anchor, legal links, mailto).
- [ ] Admin dashboard pages load (runs, matches, locations).
- [ ] Billing return page accessible (`/billing/return`).
- [ ] Robots flag still false (view-source meta, `/robots.txt`).
- [ ] Lighthouse performance snapshot (desktop + mobile) saved.
- Notes / Issues:

## Notifications & Digests
- [ ] Trigger manual digest via admin; verify staging email + push receipt.
- [ ] Confirm expo receipts worker cleaned invalid tokens (logs quiet).

## Telemetry & Logs
- [ ] Sentry (backend/mobile) dashboards show no new errors during run.
- [ ] Supervisor logs clean (`jw-queue`, `jw-schedule`).
- [ ] MySQL + Redis metrics normal (CPU/mem).

## Post-Run Cleanup
- [ ] Cancel Stripe test subscriptions; refund charges tagged `smoke_test`.
- [ ] Remove temporary projects/watchlists.
- [ ] Update `docs/qa/regression-2025-09-30.md` with pass/fail summary.
- [ ] Log blockers in `docs/launch/decision-log.md`.
