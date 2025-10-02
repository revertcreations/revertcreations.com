# Upcoming Integrations

1. **Junkyard Watchdog Case Study**
   - Build a dedicated page that mirrors the problem → approach → build → result flow.
   - Include timeline entries, repo links, screen captures, and App Store status updates.
   - Show the agent/human split (automated listing scan vs manual review and release).

2. **Automated Opportunity Sourcing**
   - Use `php artisan opportunity:import` to load JSON feeds (LinkedIn exports, newsletter scrapes) into the pipeline.
   - Collector command (`php artisan opportunity:collect`) now hits Remotive, RemoteOK, WWR, and LaraJobs; schedule it twice per day.
   - Surface success metrics: roles sourced per week, response rates, next scheduled outreach.

3. **Self-Serve Intake Flow**
   - Replace `mailto:` CTA with a form that stores submissions, triggers the autoresponder, and queues agent-generated follow-up.
   - Optional integration hooks: Notion, Airtable, or custom webhook.

4. **Build Journal Layout**
   - Convert dispatch entries into structured sections (context, agent output, Trever review, artifact).
   - Add filters for “Project” and “Theme” to make it easy to follow a build end-to-end.

5. **Metrics & Social Proof**
   - Pull LinkedIn highlights (recent posts, recommendations) via embed or curated quotes.
   - Track deployment cadence and opportunity pipeline stats on the homepage metrics card.
