# Opportunity Ingestion Automation Plan

## Objective
Streamline how opportunities enter the pipeline so Trever can capture a role with a single URL (plus optional HTML snippet) and let the system handle extraction, scoring, and staging for review.

## Guiding Principles
- **Respect publisher policies**: Read and obey `robots.txt` before fetching anything automatically.
- **Human-in-the-loop**: Keep incoming entries private and clearly flagged until Trever reviews the generated draft.
- **Traceability**: Store the raw source (URL + HTML/text + AI output) so we can revisit decisions and improve parsers.
- **Composable**: Prefer queueable jobs + service classes so Slack/CLI/Browser bookmarklets can all reuse the same core logic.

## Capture Flow (Admin UI)
1. Add a new "Capture Opportunity" action in the admin control room.
2. Form collects:
   - `posting_url` (required)
   - Optional `raw_html` (textarea paste) or `job_text`
   - Optional quick note (why it matters / follow-up ideas)
     - It would be great to utilize chatgpt or any ai api to generate a quick note based on the ideal match criteria of a perfect role for Trever.
3. On submit, persist a staging record and dispatch the ingestion job.
4. Surface status (queued → in-progress → drafted → failed) in the admin alert ribbon.

## CLI/Automation Entry Points
- `php artisan opportunity:capture {url}`
- Optional flags: `--html=/path/to/file`, `--text=/path/to/file`, `--note="…"`
- Output the resulting opportunity slug + edit link when finished.

## Ingestion Job Responsibilities
1. **Robots Check**
   - Use a lightweight parser to confirm crawling rules; skip automated fetch if disallowed.
2. **Fetch & Normalize**
   - When allowed, get the HTML, strip scripts/styles, and convert to plain text using `DomCrawler` + `inline-style/htmldom` helpers.
   - Fall back to provided `raw_html`/`job_text` when remote fetch isn’t possible.
3. **Structured Extraction**
   - Run deterministic parsers for known providers (Greenhouse, Lever, Workable, JazzHR, etc.).
   - Feed the cleaned text into an LLM (Claude or GPT) with a strict JSON schema prompt.
   - Validate the JSON (Laravel validator) and capture the raw response for auditing.
4. **Scoring & Drafting**
   - Reuse `ScoreOpportunities` to compute `fit_score` and inferred preferences.
   - Create/update an `Opportunity` record with `workflow_state = sourced`, `public_visibility = false`, `ingest_status = drafted`.
   - Attach the raw payload (URL, HTML, JSON) for reference.
4b. **AI Integration (Optional)**
   - Instead of using `ScoreOpportunities`, consider leveraging an LLM to generate a fit score and inferred preferences based on Trever's ideal role criteria.

## Data Model Adjustments
- Add `opportunity_ingests` table or extend `opportunities` with:
  - `ingest_status` (enum: queued, processing, drafted, failed)
  - `ingest_payload` (JSON) for structured extraction
  - `ingest_raw_content` (longText) for HTML/text storage
  - `ingest_errors` (JSON) for failure notes
  - `source_url`
- Eloquent relationship: `Opportunity` hasOne latest ingest for traceability.

## Admin Review UX
- Banner on the edit screen summarising ingestion details + copy-to-clipboard links.
- Quick buttons: "Publish to public", "Archive", "Retry ingestion".
- History tab showing previous ingest attempts.

## Future Enhancements
- Bookmarklet that autofills the capture dialog with the current tab’s URL + HTML snapshot.
- Newsletter/Slack bot that accepts forwarded job posts and pipes them into the same ingestion flow.
- Automatic resume tailoring: once opportunity is approved, spin up tasks for cover letters, outreach email drafts, etc.
- Metrics: track conversion from captured → applied → in interview to prioritise sources.

## Next Steps
1. [x] Create database migration + model updates for ingestion metadata.
2. [x] Implement the capture form + CLI command wiring.
3. [x] Build the ingestion pipeline service + queue job, starting with HTML fetch and LLM extraction.
4. [x] Add admin status badges + notifications.
5. [x] Auto-dispatch ingestion jobs via model observer and dedicated queue.
6. [ ] Pilot the flow with the Tivly role and refine prompts based on real output.

## Queue & Automation
- New ingests dispatch a `ProcessOpportunityIngest` job automatically via an observer.
- Jobs land on the `opportunity-ingest` queue (override with `OPPORTUNITY_INGEST_QUEUE`).
- Keep a long-running `php artisan queue:work --queue=opportunity-ingest` process (Supervisor/Horizon in prod, `sail artisan queue:work` locally).
- Failed jobs trigger a status flip to `failed` with the error payload so the dashboard surfaces retries.
