# AI Product Studio Data Models

## Opportunities
Tracks public + private opportunities, outreach, and follow-up cadence.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint | Primary key |
| slug | string (unique) | Human-readable identifier for URLs/admin lookup |
| company_name | string nullable | Hidden or anonymised when `public_visibility` is false |
| industry | string nullable | Segment/vertical |
| role_title | string | e.g. "AI Product Engineer" |
| status | string | Workflow status (open, in_progress, closed, offer, paused) |
| stage | string nullable | Narrative stage (Applied, Interview Loop, etc.) |
| priority | string | high/medium/low. Controls sort order |
| source | string | Where the lead came from (agent-scraped, referral, etc.) |
| source_channel | string nullable | Automation or channel detail (LinkedIn alert, API, newsletter) |
| public_visibility | boolean | Toggle for pipeline publish |
| summary | text nullable | 2–3 sentence overview |
| next_action_at | timestamp nullable | Used for reminders and sort |
| notes | text nullable | Internal commentary |
| links | json nullable | Map of labels → URLs (JD, deck, LinkedIn, etc.) |
| timestamps | | Standard created/updated |

## Activities
Mission control feed entries that surface day-to-day moves.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint |
| occurred_at | timestamp | Defaults to `now()` when blank |
| category | string nullable | build/design/ops/qa/etc. |
| headline | string | Short summary shown in feeds |
| body | text nullable | Additional context |
| link | string nullable | Optional artifact URL |
| tags | json nullable | Array of lightweight hash-tags |
| public_visibility | boolean | Toggle for publishing |
| timestamps | | |

## Build Logs
Longer-form release notes for the build-in-public timeline.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint |
| logged_at | timestamp | Defaults to `now()` |
| phase | string nullable | Discovery, Build, QA, Launch, etc. |
| category | string nullable | Thematic grouping |
| title | string | Card headline |
| description | text nullable | Primary summary |
| agent_contribution | text nullable | Highlights of agent output |
| review_notes | text nullable | Trever's oversight notes |
| links | json nullable | Associated artifacts |
| public_visibility | boolean | Toggle for publish |
| timestamps | | |

## Seeding
- `DatabaseSeeder` now generates ten opportunities, eighteen activities, and fourteen build log entries using dedicated factories.
- Factories bias towards public visibility so local/dev builds populate the homepage and pipeline instantly.
- Edit `database/factories/*Factory.php` to tweak vocabulary or mix in real artifacts.

## Admin Quick Reference
- `/admin/opportunities` — CRUD for pipeline with JSON links field.
- `/admin/activities` — log mission control updates (comma-separated tags → JSON array).
- `/admin/build-logs` — long-form release notes with agent + reviewer context.

Next iteration: wire autoresponder + CRM hooks once intake form lands, and promote phases/status enums into config constants when the taxonomy stabilises.
