# Remote Job Search Automation

## Compliance Snapshot

| Board | Robots Summary | Automation Status | Notes |
| --- | --- | --- | --- |
| We Work Remotely | `Allow: /`, only admin/account paths blocked ([robots.txt](https://weworkremotely.com/robots.txt)) | ✅ Implemented | Use the public programming RSS feed. Respect rate limits (TTL 60) and attribute when displaying results. |
| Remote OK | `Allow: /`, `Crawl-delay: 1` + attribution requirement ([robots.txt](https://remoteok.com/robots.txt)) | ✅ Implemented | Official JSON API `https://remoteok.com/api`. Must link back to Remote OK when surfacing listings. |
| Himalayas | `Allow: /`, `Disallow: /apply` ([robots.txt](https://himalayas.app/robots.txt)) | ⚠️ Partially implemented | Sitemap scraping supported, but job metadata is minimal without fetching each listing page. |
| JustRemote | `Allow: /` with a few excluded paths ([robots.txt](https://justremote.co/robots.txt)) | ⚠️ Requires headless renderer | Sitemap served via client-side app; scraping needs JS rendering or partner feed. |
| Working Nomads | `Allow: /` ([robots.txt](https://www.workingnomads.com/robots.txt)) | ⚠️ Requires partner API | Public sitemap lists only category pages. Need partner feed or email digests. |
| Indeed | Cloudflare challenge; ToS forbids automated scraping | ❌ Unavailable | Use Indeed's Publisher/API program; manual partnerships required. |
| LinkedIn | `Disallow: /` for all agents ([robots.txt](https://www.linkedin.com/robots.txt)) | ❌ Forbidden | Only whitelisted crawlers may access. Use official Talent Solutions or job posting API. |

## Artisan Command

- New command: `php artisan remote-jobs:collect`
- Default behavior: grabs remote full-stack roles from Remote OK & WWR, writes a JSON snapshot to `storage/app/remote-jobs/latest.json`, and prints a summary table.
- Options:
  - `--keyword="keyword here"` to change the search term (blank to disable filtering).
  - `--boards=remoteok --boards=weworkremotely` to target specific boards.
  - `--limit=25` to cap results.
  - `--skip-save` if you only want console output.
  - `--output=remote-jobs/custom.json` to change the storage path.
  - `--persist` to upsert results into the new `opportunities` table (requires database connectivity).

## Suggested Automation Pipeline

1. **Aggregation Layer**  
   - Schedule `remote-jobs:collect` via Laravel's scheduler.  
   - Persist jobs into a dedicated `opportunities` table (fields: source, title, company, location, tags, apply_url, metadata JSON).  
   - Track `last_seen_at` to avoid duplicate outreach and flag stale listings.

2. **Qualification & Scoring**  
   - Add heuristics (keyword weights, salary parsing, tech stack tags).  
   - Include manual review hooks so you can veto or fast-track roles.

3. **Collateral Generation**  
   - Prepare templated cover letters and resume variants.  
   - Use a prompt library for tailoring messages per company.  
   - Store outputs in `storage/app/applications/{job_id}/`.

4. **Application Execution**  
   - Prefer official APIs or `apply_url` endpoints over form scraping.  
   - For external ATS links (Greenhouse, Lever, Workable), use their APIs when available; otherwise automate with a headless browser (Playwright) while adhering to each provider's ToS.  
   - Log submission timestamps, confirmation numbers, and follow-up reminders.

5. **Attribution & Compliance**  
   - Display or store attribution text required by Remote OK and other boards.  
   - Respect robots directives; do not scrape Indeed or LinkedIn without formal approval.  
   - Implement per-board throttling (e.g., 1 request/second for Remote OK).

6. **Feedback Loop**  
   - Record responses from recruiters in your CRM or a simple spreadsheet.  
   - Feed successful matches back into scoring to improve prioritisation.

## Next Steps Checklist

- [x] Create a migration + model for storing job opportunities.  
- [ ] Add scheduled command entries (`schedule:run`) to refresh boards daily.  
- [ ] Integrate email/slack alerts when new qualified roles appear.  
- [ ] Prototype a Playwright workflow for sites that demand interactive applications.  
- [ ] Draft outreach templates and interview prep assets tied to each job record.

## Admin Jobs Dashboard

- URL: `https://admin.revertcreations.com/jobs` (requires auth)
- Panels:
  - **Refresh Remote Listings**: wraps `remote-jobs:collect --persist` so you can fetch and store new leads without touching the CLI.
  - **Queue Mass Applications**: dispatches the `SubmitBatchApplications` job to pre-stage outreach collateral at scale.
  - **Recent Opportunities**: update opportunity status, annotate notes, and jump straight to the source or apply URL.
  - **Application Pipeline**: manage drafted/queued/submitted applications without leaving the dashboard.  
- Data model: `opportunities` + `job_applications` tables with first/last-seen timestamps, status enums, and per-application tracking.
