# Staging Screenshot Fixture

Use `ScreenshotDemoSeeder` to populate staging with realistic Pro accounts for App Store screenshots and marketing captures. The data mirrors real usage (watchlists, matches, vehicles, notes, part requests/checks, observations) so every tab has something meaningful to show.

## Run the Seeder
1. SSH to the staging host and switch to the backend directory (e.g., `/var/www/junkyardwatchdog/backend`).
2. Optionally export `SCREENSHOT_DEMO_PASSWORD` to override the default login (`Screenshot2025!`).
3. Execute:
   ```
   php artisan db:seed --class=ScreenshotDemoSeeder
   ```
4. Log into the staging app with one of the seeded accounts (listed below) using the configured password.

The seeder is idempotent—rerunning it will refresh the records without duplicating entries.

## Seeded Accounts
- **Casey Morales** — `casey.morales@junkyardwatchdog.com`
  - Pro plan with daily digests, home base in Denver.
  - Watchlists: Miata NA/NB and FC RX-7 (radius + part filters).
  - Inventory matches include unread Miata alerts, RX-7 drivetrain hits, Cloudinary-style observations, part requests, and follow-up checks.
  - Garage projects: `1991 Miata Autocross`, `1988 RX-7 Turbo II` with notes, photo attachments, and part lists.
- **Morgan Patel** — `morgan.patel@junkyardwatchdog.com`
  - Pro plan anchored in Phoenix.
  - Watchlists: MkIV Supra, S13 Hatch, CRX Revival—all stocked with part filters, unread matches, and status variety (open/closed part requests, observations, notifications).
  - Garage projects: `1994 Supra Aerotop`, `1990 CRX Track Car` with build notes, photos, and part tracking.

Both accounts share the same password (`Screenshot2025!` unless overridden) so swapping between them on device is quick during capture sessions.

## Data Coverage Highlights
- Multiple junkyards/brands with populated rows, distances, and ingest history.
- Watchlist matches flagged as read/unread for badge screenshots.
- Part requests with follow-up checks (including status + photo metadata).
- Junkyard observations with condition scores, notes, and sample imagery.
- Garage vehicles linked to watchlists, complete with parts, notes, and Cloudinary URLs.
- Stripe-related plan fields prefilled to keep billing screens unlocked.

If additional personas are needed, duplicate the patterns in `backend/database/seeders/ScreenshotDemoSeeder.php` and rerun the seeder.
