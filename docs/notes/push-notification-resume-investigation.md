# Push Notification Resume Investigation Log

_Date: 2025-09-30_

## Context
- Goal: ensure tapping a push notification while the Expo app is backgrounded opens `/inventory/[id]`.
- Baseline behaviour (pre-work): background taps sometimes reopened the previous tab; routing inconsistent but app remained stable.

## Timeline
### Commit `509a434` — _Fix notification deep links when app resumes_
- Added `Linking.createURL` + `Linking.openURL` before `router.push`.
- Introduced `pendingNotificationRef` flush after navigation.
- Result: cold-start launches improved, warm resume still inconsistent.

### Commit `b7434b9` — _Stabilize notification deep links after resume_
- Added `usePathname` tracking and retry loop (`verifyOrRetry`).
- Set multiple timeouts and repeated `router.push` when pathname mismatched.
- Regression: background/foreground cycles now triggered recursive navigation; React crashed (`Maximum update depth exceeded`).

### Commit `9e5e5b1` — _Retry inventory navigation when resuming from push_
- Introduced `ensureInventoryRoute` with attempts counter and `router.replace` fallback.
- Regression persisted: logs showed repeated `appBecomesActive`/`appEntersBackground` events and same crash.

### Commit `dc91c48` — _Replace push deep link retry with single replace navigation_
- Removed recursion, used single `router.replace`, cleared pending once route matched.
- Issue: even without notifications, backgrounding sometimes re-fired navigation and hit the update-depth crash.

### Commit `69c8a3d` — _Short-circuit push navigation after single attempt_
- Cleared pending before navigating, switched to `router.push`, kept pathname guard.
- Crash remained: backgrounding alone occasionally re-triggered navigation leading to same stack overflow.

### Commit `057f60d` — _Retry notification response when app resumes_
- Converted the navigation hook to a bounded state machine (single push per attempt, capped retries, cancellation when detail already active).
- Added AppState-based re-fetch of the last notification response so warm taps deliver payload once JS resumes.
- Result: cold and warm taps both resolve `/inventory/[id]` without recursive navigation.

## Observations
- Crashes stemmed from reentrant navigation triggered by app state changes while `pendingNotificationRef` remained populated.
- Debug builds emit rapid `appEntersBackground`/`appBecomesActive` events; any queued navigation replay looped.
- Expo only delivers `NotificationResponse` to JS after the bridge is active; for warm resumes this required explicitly re-reading the last response on `AppState` transition back to `active`.
- A single `router.push` scheduled via `InteractionManager` is sufficient once the app is foregrounded and root navigation is mounted.

## Suggested Next Steps
1. Keep `EXPO_PUBLIC_NOTIFICATION_DEBUG=1` instrumentation handy for future regressions, but disable it for release builds.
2. If new destinations require deep-link routing, extend the shared state machine instead of re-adding ad-hoc retries elsewhere.
