# Mobile Regression Plan

Use this when promoting release builds or before flipping feature flags in production. The backend primarily serves the mobile apps; the marketing page only needs a lightweight smoke.

## Environments
- **Builds**: TestFlight release candidate + Google Play Internal Testing build (Expo EAS release channel).
- **API**: `https://junkyardwatchdog.com` with live credentials.
- **Accounts**: keep a Free baseline account, a paid smoke account (upgrade/cancel each run), and the admin account for portal access.

## Device Coverage
- iPhone (iOS 17+), small form factor (SE/mini) and flagship (iPhone 15+).
- iPadOS landscape sanity check.
- Android: Pixel 6/7 (Android 14+) and at least one mid-tier device.
- Optional: Android tablet.

## Smoke Run (every deploy)
1. Launch app → login screen renders, no fatal crash.
2. Sign in Free user; home radar populates inventory.
3. Create new watchlist; confirm appears with match count.
4. Trigger push test in Account → Notifications → expect push on device.
5. Upgrade to Pro via Stripe Checkout, verify entitlements (daily digest toggle, watchlist limit 25). Cancel via portal; plan reverts to Free.
6. Garage: create project, link watchlist, verify match summary updates.
7. Sign out and back in.

## Full Regression (pre-launch / major feature ships)
### Auth & Lifecycle
- Register new account (email verification flow, terms acceptance).
- Password reset email and password update.
- Deep link from push notification → match detail.

### Watchlists & Matches
- Create/edit/delete watchlists (with image, radius change).
- Hit watchlist limit on Free (expect upsell) and confirm expanded limit on paid tiers.
- Mark matches read/unread; ensure badge updates across tabs.
- Offline scenario: disable network, open watchlist → offline banner, re-enable network → data refresh.

### Garage & Notes
- Create vehicle project, add photos/notes.
- Link/unlink watchlists; ensure match summaries follow project.
- Delete project → related notes/watchlist associations removed.

### Notifications & Digests
- Toggle email/push switches; inspect `/api/user` response or logs to confirm persistence.
- Adjust nearby radius ZIP/range, verify API update.
- Ensure Free plan only shows weekly digest; paid plans show daily + weekly.

### Billing & Account
- Free → Pro upgrade via Checkout (success path).
- Pro → Pro Plus via Billing Portal; entitlements increase immediately.
- Downgrade Pro Plus → Pro and Pro → Free (portal) with immediate entitlement change.
- Cancel subscription entirely; plan resets to `free` in profile.
- Update billing details in portal; ensure new card surfaces in portal session.

### Settings & Support
- Change username, notification cadence, location settings; confirm persist after relaunch.
- Open support/contact links (mailto) and legal screens (Terms, Privacy, DMCA).

### Observability
- Account diagnostics (if available) shows registered push token.
- Sentry/monitoring checked for regression run timeframe.

### Marketing Page Smoke (web)
- Load `https://junkyardwatchdog.com` on desktop & mobile browser.
- Validate hero CTA, contact mailto, pricing anchor.
- Confirm `robots` meta/tag respects `ROBOTS_ALLOW_INDEX`.

## Post-Run Tasks
- Void/refund Stripe charges created during testing (tagged `smoke_test`).
- Remove temporary projects/watchlists created for regression.
- Log pass/fail + issues in launch sheet and update decision log if blockers appear.

Keep this doc updated as features ship (teams, analytics, etc.) and reference it from `PRODUCTION_CHECKLIST.md` when executing QA runs.
