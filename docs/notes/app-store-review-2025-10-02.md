<!-- build-log
{
  "slug": "app-store-review-2025-10-02",
  "logged_at": "2025-10-02T15:30:00Z",
  "phase": "Launch",
  "category": "release",
  "project": "junkyard-watchdog",
  "title": "Account deletion remediation resubmitted to App Review",
  "description": "Added a self-serve account deletion flow, refreshed mobile legal copy, and resubmitted iOS build 1.0.0 (4) with the required business-model answers.",
  "agent_contribution": "Agents implemented the authenticated deletion endpoint, the mobile delete-account UI, and drafted the App Review business-model response.",
  "review_notes": "Verified staging and production deploys, reset the review account to Free, and queued the 1.0.0 (4) submission under ID 6cf5342a-621b-4574-9304-af3e10079b12.",
  "links": {
    "notes": "docs/notes/app-store-review-2025-10-02"
  },
  "public_visibility": true
}
-->

# App Store Review – October 2, 2025

## Summary of Rejection
- **Guideline 5.1.1(v)** – Reviewer could not find a way to initiate account deletion inside the iOS app.
- **Guideline 2.1** – Apple requested additional context on our paid subscriptions and where purchases happen.

## Remediation Status
- ✅ Added an authenticated `DELETE /api/user` endpoint that cancels any active Stripe subscription, revokes push tokens, and removes the user record.
- ✅ Added an Account → Delete Account panel in the mobile app. Users must confirm with their password and an explicit acknowledgement before we delete all associated watchlists, vehicles, matches, and notification preferences.
- ✅ Updated the mobile EULA summary to point users to the self-serve deletion flow.
- ✅ Drafted and submitted the App Store Connect reply with business-model details and navigation notes.
- ✅ Deployed fixes to staging (2025-10-02 14:20 UTC) and production (2025-10-02 15:20 UTC), ran the new health checks, backfilled yard locations, and restored the App Review account to the Free tier to keep billing flows clean.
- ✅ Built `1.0.0 (4)` via `eas build --profile production --platform ios` and resubmitted to App Review.

## Business Model Answers for App Review
1. **Subscribers** – Enthusiasts and small shops who monitor junkyard inventory. Free users get up to three watchlists; `Pro` and `Pro Plus` subscribers (segments documented in `MONETIZATION.md`) need higher alert volumes, daily digests, and shared garage tools.
2. **Purchase Flow** – Subscribers upgrade from the Account screen. Tapping *Upgrade* opens our Stripe-hosted checkout (Safari in-app) and returns users to Junkyard Watchdog. The same plans are also sold on junkyardwatchdog.com using the identical hosted checkout.
3. **Subscriptions Accessible in App** – `Pro` and `Pro Plus` plans. Both unlock larger watchlist limits and daily digests; `Pro Plus` additionally unlocks higher caps intended for clubs/shops.
4. **Paid Features Outside IAP** – All paid functionality comes from those subscriptions: higher watchlist quotas, daily email digests, and expanded garage collaboration. No other digital goods are sold or unlocked without going through Stripe checkout.

## Draft Reply for App Store Connect
```
Hello App Review,

Thank you for the detailed feedback. We shipped build 1.0.0 (4) with the following updates:

- Added an in-app account deletion flow. Navigate to Account → Delete Account, confirm with the account password, and we immediately remove the user’s watchlists, vehicles, notification preferences, and cancel any active subscription.
- Updated our privacy and legal copy to reflect the new self-service deletion option.

Regarding the requested business model information:

1. Subscribers are car enthusiasts and small shops that monitor junkyard inventory. Free members track up to three watchlists; our Pro and Pro Plus subscribers need larger watchlist pools, daily alerts, and team garage tools.
2. Users upgrade from the Account tab. Tapping “Upgrade to Pro” launches our Stripe-hosted checkout in Safari and returns the user after purchase. The same hosted checkout is also surfaced on junkyardwatchdog.com.
3. Inside the app, subscribers access the Pro and Pro Plus plans. These increase watchlist limits and enable daily digests; Pro Plus raises the limits further for clubs/shops.
4. All paid content maps to those subscriptions—expanded watchlist capacity, daily digests, and garage collaboration. We do not sell digital goods outside of the Stripe checkout flow.

Please let us know if you need anything else.

Thank you,
Junkyard Watchdog Team
```

## Next Steps
- Monitor App Review responses (Submission ID 6cf5342a-621b-4574-9304-af3e10079b12).
- If Apple requests additional detail, reference this log for billing flow explanations and deletion navigation.
- Once approved, update public changelog / release notes and sync production privacy policy text with the in-app copy.

## Deployment & Verification Log
- 2025-10-02 14:20 UTC – Staging: deployed `2edc6de`, ran `app:backfill-junkyard-location-sources` and `app:health-check` (all green), verified billing portal and Delete Account UX.
- 2025-10-02 15:20 UTC – Production: deployed same build, re-ran backfill + health check, reset `appreview@junkyardwatchdog.com` to Free plan, verified health check passes.
- 2025-10-02 15:30 UTC – EAS `production` build queued; submitted to App Store Connect and resubmitted for review.
