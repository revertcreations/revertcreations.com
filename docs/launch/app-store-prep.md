# App Store & TestFlight Prep

Status date: 2025-10-01

## App Record
- [x] App created in App Store Connect (`Junkyard Watchdog`, bundle ID `com.revertcreations.junkyardwatchdog`, Apple ID 6753227596).
- [x] SKU `junkyardwatchdog` registered.
- [x] Localizable copy (subtitle, keywords, description) — entered in App Store Connect (English US).
- [x] Age rating questionnaire — submitted in App Store Connect.
- [x] Support URL / marketing URL set to `https://junkyardwatchdog.com/support`.
- [x] Privacy policy URL set to `https://junkyardwatchdog.com/privacy`.

## Final Store Copy (Ready to paste)

**Subtitle**: Real-time junkyard alerts

**Promotional Text**: Stay ahead of the yard run with live alerts, digest emails, and garage projects synced across devices. Upgrade to Pro for expanded watchlists and daily summaries.

**Description**
```
Junkyard Watchdog keeps self-service yard diehards ahead of fresh arrivals so the right projects never slip away.

• Monitor live inventory from LKQ Pick Your Part, Pick-n-Pull, U-Pull-&-Pay, and independent yards in one feed.
• Build dialed-in watchlists with make, model, trim, year, radius, and part filters so every alert stays relevant.
• Get real-time push alerts plus daily or weekly email digests whenever a match lands; snooze or mark read in one tap.
• Organize your garage with project profiles, notes, part checklists, Cloudinary photo uploads, and linked watchlists.
• Log part requests from the yard, track responses, and keep mileage, row, and VIN details at your fingertips.
• Manage notification, location, and billing preferences without leaving the app, including Stripe-powered plan upgrades.

Start free with up to three watchlists and weekly digests. Upgrade to Pro for expanded watchlists, daily summaries, CSV exports, and priority ingest windows.

We’re a small team of builders and junkyard regulars. Questions or feedback? Email support@junkyardwatchdog.com.
```

**Keywords**: `junkyard,autoparts,watchlists,alerts,garage,lkq,picknpull,miata,rx7,supra,240sx,crx,salvageyard`

**Character counts**: subtitle 25, promotional text 162, keywords 95, description 1085.

## Age Rating Questionnaire

| Category | Selection | Notes |
| --- | --- | --- |
| Cartoon or Fantasy Violence | None | No animated combat or destruction depicted. |
| Realistic Violence | None | No real-world violence shown or described. |
| Prolonged Graphic or Sadistic Violence | None | No violent imagery, gore, or harm scenarios. |
| Profanity or Crude Humor | None | Copy sticks to professional language. |
| Mature/Suggestive Themes | None | Focused on vehicle tracking and maintenance workflows. |
| Horror/Fear Themes | None | No frightening scenarios or suspense content. |
| Medical/Treatment Information | None | Does not provide medical guidance or references. |
| Alcohol, Tobacco, or Drug Use or References | None | No substance references in copy or features. |
| Sexual Content or Nudity | None | No sexual content, innuendo, or imagery. |
| Graphic Sexual Content or Nudity | None | Not applicable; no explicit material. |
| Simulated Gambling | None | No games of chance or casino-style mechanics. |
| Contests | None | App does not host sweepstakes or competitions. |
| Gambling | None | No ability to wager money or valuables. |
| Unrestricted Web Access | No | Only opens first-party support/privacy pages; no in-app browser. |
| User Generated Content (public) | No | Garage notes and watchlists remain private to the signed-in user. |


## Assets & Screenshots
- [x] App icons already live in `frontend/assets/images/` (1024×1024 confirmed).
- [x] Seeded staging demo accounts via `php artisan db:seed --class=ScreenshotDemoSeeder` (see `docs/launch/screenshot-fixture.md`).
- [x] Uploaded iPhone screenshot sets for 6.9", 6.5", 6.3", and 6.1" slots in App Store Connect. Final PNGs live under `docs/launch/screenshots/<size>/` and cover Home radar, Watchlist detail with unread matches, Garage project notes, notifications/billing, and part request flows.
- [ ] App Preview video (optional, 15–30s) — capture once we script the flow we want to highlight.
- [ ] 12.9" iPad Pro screenshots captured and uploaded. Use the plan in `docs/launch/screenshots/12.9-inch/README.md`.

## Pricing & Categories
- [ ] Primary category set to **Shopping** (secondary: `Utilities`).
- [ ] Price tier set to **Free (Tier 0)** so the app can distribute without upfront cost (subscriptions run through Stripe on the web for now).

## App Privacy
- [ ] Admin completed the App Privacy questionnaire using `docs/launch/app-store-privacy.md` (no tracking, see table for data types and purposes).

## App Review Prep

### Reviewer Sign-in Payload
- **Username**: appreview@junkyardwatchdog.com
- **Password**: AppReview2024!
- **Account notes**: Pro plan account seeded with Miata/Supra/CRX watchlists, unread matches, linked garage projects, and part notes (email verified; reset flow tested).

### Reviewer Notes
- Account opens on the Home tab with pre-seeded watchlists (Miata, Supra, CRX) and unread matches ready to review.
- Billing runs against live Stripe; please skip checkout (account is already on the Pro plan).
- Push/location prompts are optional; you can skip them and still reach notifications/billing/garage screens via the tabs.
- Garage projects already contain notes, photo slots, and part tracking so you can verify CRUD without creating new entries.

- [x] Provide reviewer credentials in App Store Connect (username/password for a live Pro account that Apple can use).
- [x] Fill reviewer contact information (first name, last name, phone, email).
- [x] Populate Support URL, Marketing URL, and Copyright fields on the version info (Support → https://junkyardwatchdog.com/support, Marketing optional if we have it).
- [x] Release timing: set to automatically release after App Review (no earlier than Oct 1, 2025 12:00 PM GMT).

## Build Pipeline
- [x] Latest production build (EAS) archived as `603b890b-12a9-4aa1-84d6-72fcbc9b4983` (version 1.0.0, build number 3).
- [ ] `eas submit` pending — run interactively (`yarn eas submit --platform ios --latest`) or configure an App Store Connect API key.
- [ ] Add `appstoreConnectApiKey` to `eas.json` (optional) for non-interactive submits.
- [x] Once TestFlight upload succeeds, attach build 1.0.0 (3) to this App Store version, then create the internal tester group (Ops/QA) and invite devices; stage external beta if desired.

## Push Credentials
- [x] APNs key/cert managed by EAS (Distribution certificate `379C2F8A70341670E3A08A83D7FDD5BB`, provisioning profile `2R2932J554`).
- [x] Verify production Expo push key stored in secrets (`EXPO_TOKEN`) for App Store build. (GitHub secret + `eas env:push production --path .env.expo-token` uploaded.)

## Analytics & Privacy Notes
- No third-party analytics SDK ships in 1.0.0 (Mixpanel/Amplitude planned for post-launch).
- Client-side telemetry limited to our own error reporter (stack traces + slow call metrics) and push registration. Full data inventory lives in `docs/launch/app-store-privacy.md`.
- Update App Store privacy answers accordingly (collected data is linked to the user but never used for tracking).

## Production Data Hygiene
- [x] Delete Playwright smoke-test accounts created on 2025-09-30 (`support+playwright+*`).
- [x] Purge any related data (tokens, audit rows) after account removal (cascade verified).
- [x] Update CI/e2e configs to enforce non-prod `E2E_BASE_URL` (see `ops/bin/local-ci.sh` guard).
- [x] Re-run smoke on staging to verify cleanup (Playwright suite green on 2025-10-01 after resetting trever@ password).

## Todo (Section 7 checklist)
- [x] Finalize App Store copy in ASC (subtitle, description, keywords) and age rating questionnaire.
- [x] Capture/upload required screenshots across 6.9", 6.5", 6.3", 6.1" and prep optional preview video.
- [x] Submit build 1.0.0 (3) to TestFlight (`yarn eas submit --platform ios --latest`), attach it to the version, then invite testers.
- [x] Document analytics SDK configuration (Mixpanel/Amplitude) for privacy prompts (no client analytics in 1.0.0; declared data types recorded in `docs/launch/app-store-privacy.md`).
