# Regression Log — 2025-09-30

## Automated Coverage
- `make test-backend`
  - Status: ✅ (137 tests, 659 assertions)
  - Notes: SQLite in-memory run; migrations successful; no failures.
- `make test-frontend`
  - Status: ✅ (Typecheck + ESLint + Jest unit suites)
  - Notes: 15 suites / 47 tests passing; snapshots up to date.
- Playwright smoke (`npx playwright test`)
  - Status: ✅ on production and staging.
  - Results: 7/7 specs passing on both `https://junkyardwatchdog.com` and `https://staging.junkyardwatchdog.com` (with `STRIPE_SKIP_WEBHOOK=1` for staging).
  - Notes: Installed Let's Encrypt cert for `staging.junkyardwatchdog.com`, removing the SAN mismatch that previously blocked HTTPS automation.

## Manual/Device Testing
- iOS (TestFlight build): 🚧 In progress. Build 1.0.0 (2) installed on physical device. Findings so far:
  - Forgot-password flow launches Mail app instead of handling reset inline.
  - Change-password view lacks visibility toggle; keyboard covers password requirements.
  - Watchlist notification toggles don’t use brand coral color when enabled.
  - Garage photo upload fails on production (“Cloudinary not configured”).
  - Offline mode banner not displayed in Airplane Mode.
  - Push notification test succeeded; billing upgrade charged and refunded (sub_1SDANr… / refund re_3SDANr…).
- Android (Internal test track): ⭕ Pending.
- Web smoke (desktop & mobile browsers): ⭕ Pending live run during launch rehearsal.

## Key Flows to Cover Manually
- Auth lifecycle (signup, password reset, re-login).
- Watchlist CRUD + radius adjustments; digest preference toggles.
- Garage project linking, photo uploads, Cloudinary asset cleanup.
- Billing flows (upgrade/downgrade/cancel) using live Stripe keys; ensure charges refunded post-test.
- Push notification end-to-end (device register → admin test push).
- Offline mode banner and recovery.

## Follow-Ups
1. Provision devices (iPhone + Pixel) and schedule regression run before freeze ends.
2. Confirm staging TLS renewal automation (certbot) will refresh the new SAN before expiry.
3. Capture results/bugs in decision log; update this file once manual pass completes.
