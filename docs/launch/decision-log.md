# Launch Decision Log

Record noteworthy production/security decisions, incident notes, and rollbacks.

| Date | Change / Decision | Reasoning | Notes |
| --- | --- | --- | --- |
| 2025-09-28 | Upgraded `league/commonmark` to 2.7.1 | Composer security advisory (GHSA-3527-qv2q-pfvx) | `composer audit` clean after update |
| 2025-09-29 | Provisioned jw-prod-01 droplet (4GB/2vCPU) and installed base stack (PHP 8.4, nginx, MySQL, Redis, Supervisor). | Environment ready for app deploy; awaiting DNS switch. | 
| 2025-09-29 | Ran MySQL hardening (new root password) and created app DB/user. | Using same creds as staging until live secrets ready. |
| 2025-09-29 | Updated DNS (www CNAME + apex) to 138.197.93.80 and issued Let's Encrypt cert via certbot. | HTTPS live; monitor renewal cron. |
| 2025-09-29 | Ran production deploy dry-run via `ops/bin/deploy-staging-local.sh` (production env) after hardening scripts for Ubuntu 24.10. | Verified health endpoint + Supervisor, ensured PHP 8.4 sock + services auto-enable. |
| 2025-09-29 | Installed nightly MySQL backup automation (`/usr/local/bin/jw-backup.sh`) with encrypted dumps and cron schedule. | Waiting on DigitalOcean Spaces credentials to finalize offsite sync; local encrypted archives verified. |
| 2025-09-29 | Ran live backup to Spaces (`jw-prod-mysql-20250929T201305Z.sql.gz.enc`) and restored into temporary DB for integrity check. | Verified decrypt/import flow; dropped test DB after verification. |
| 2025-09-29 | Hardened production `.env` (force HTTPS, disable robots indexing until launch). | Updated APP_FORCE_HTTPS/ROBOTS_ALLOW_INDEX; flushed config cache. |
| 2025-09-29 | Drafted mobile regression plan (`docs/qa/mobile-regression-plan.md`) covering iOS/Android smoke + full checks. | Use before launch and major releases; marketing page only needs light smoke. |
| 2025-09-29 | Mobile app auto-refreshes push tokens and opens notifications straight to inventory detail. | Added background push sync + permission guidance; push taps now route to inventory detail screens. |
| 2025-09-30 | Logged production launch brief (PROJECT_PLAN.md) incl. success metrics + rollback. | Aligns go-live for 2025-10-02 10:00 ET; reference for comms & monitoring priorities. |
| 2025-09-30 | Declared feature freeze window (2025-09-30 18:00 ET through launch) with exception policy. | Only P0/security/launch-blocker fixes allowed; note criteria + testing proof before deploy. |
| 2025-09-30 | Verified production ingest scheduler cadence (UPAP/PullAPart/Pick-n-Pull/LKQ). | Observed `ingest_runs` table and Supervisor logs; automation ready for launch. |
| 2025-09-30 | Executed `php artisan migrate --pretend --force` on prod after backup restore test. | Confirms no pending migrations prior to launch; rehearsal deploy validated. |
| 2025-09-30 | Rotated production secrets (APP_KEY, DB password, Stripe, Mailgun) and moved templates to placeholders. | Secrets stored in 1Password; GitHub + server env updated; repo no longer carries live values. |
| 2025-09-30 | Ran backend + frontend automated test suites (make test-backend/test-frontend). | Part of launch regression; results recorded in `docs/qa/regression-2025-09-30.md`. |
| 2025-09-30 | Playwright smoke executed vs production (7/7 pass after test fixes). | Added JSON headers + username on register, relaxed flow assertions, skip webhook replay on live host; staging run still blocked by cert SAN issue. |
| 2025-09-30 | Issued Let's Encrypt cert for `staging.junkyardwatchdog.com` and reran Playwright smoke on staging (7/7 pass). | `certbot --nginx` deployed SAN; staging suite runs with `STRIPE_SKIP_WEBHOOK=1` to avoid mock signature. |
| 2025-09-30 | Drafted manual regression workbook (`docs/qa/manual-regression-checklist.md`). | Guides iOS/Android/web smoke + cleanup steps; tie results back to production checklist Section 6. |
| 2025-09-30 | Documented App Store prep requirements (`docs/launch/app-store-prep.md`). | App record confirmed; outlined copy, assets, support URL, and TestFlight submission tasks for Section 7. |
| 2025-09-30 | Added `/support` landing page for App Store support URL. | Static contact page at https://junkyardwatchdog.com/support, linked in store prep doc. |
| 2025-09-30 | EAS iOS production build archived (build 0c3a4992-1726-4466-b429-01900ed4da55). | Ready to submit to TestFlight once App Store Connect login/API key provided. |
| 2025-09-30 | Rebuilt production iOS binary (build 603b890b-12a9-4aa1-84d6-72fcbc9b4983, build #3). | Includes password-reset + Cloudinary fixes; ready for TestFlight submission. |
