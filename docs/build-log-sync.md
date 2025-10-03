# Build Log Sync Service

A plan for streamlining how project build logs from local or sidecar repos are published to the live Revert Creations site without juggling SQL dumps or schema drift.

## Goals

- Publish new build-log entries (and updates) to production with a single command.
- Avoid schema mismatches between local/main branches and the live deployment.
- Keep Cloudinary media references consistent and avoid orphan assets.
- Provide auditability for what was pushed, when, and from which source project.

## Approach Overview

1. **Authenticated Ingest Endpoint** on revertcreations.com.
   - Endpoint: `POST /admin/build-log-sync` (path TBD)
   - Auth: Shared HMAC header or signed token stored in env
   - Payload: JSON describing entry metadata, markdown/description, optional Cloudinary public ID & URL
   - Behaviour: Upsert build log entries (match on external ID or composite project+slug), validate schema, persist Cloudinary IDs.

2. **Local CLI Tooling** per project.
   - Could be an Artisan command inside revertcreations (`php artisan build-logs:push`) or a separate script in each repo.
   - Generates payload from local sources (DB, markdown, other data), uploads media to Cloudinary if needed, then calls the ingest endpoint.
   - Captures response for audit and handles retries/backoff.

3. **Source of Truth Tracking**
   - Each pushed entry includes `source_project`, optional `source_hash` (git commit or markdown checksum), and `external_id` for idempotency.
   - Production stores a log table (or reuses activities) to track ingest runs.

## Payload Sketch

```json
{
  "secret": "<HMAC signature or API token>",
  "entry": {
    "external_id": "junkyardwatchdog-2025-10-10-checklist-ui",
    "project": "junkyardwatchdog",
    "title": "Implemented checklist workflow",
    "description": "Markdown or HTML",
    "phase": "Build",
    "category": "delivery",
    "logged_at": "2025-10-10T17:05:00Z",
    "links": {
      "loom": "https://...",
      "docs": "docs/notes/jyd-checklist"
    },
    "agent_contribution": "Optional string",
    "review_notes": "Optional string",
    "image": {
      "public_id": "build-logs/abc123",
      "url": "https://res.cloudinary.com/..."
    }
  },
  "source": {
    "project": "junkyardwatchdog",
    "repository": "github.com/revertcreations/junkyardwatchdog",
    "branch": "main",
    "commit": "abc1234",
    "cli_version": "0.1.0"
  }
}
```

## Steps to Implement

1. Define config: env vars for `BUILD_LOG_SYNC_SECRET`, optional rate-limiting.
2. Add ingestion controller + request validation on revertcreations.com.
3. Introduce `external_id` and `source_project` columns with uniqueness guard.
4. Record ingest history (table or log channel).
5. Build initial CLI command in revertcreations repo that reads an existing build log entry by ID and posts it.
6. Document the workflow and example usage.

## Open Questions

- Should Cloudinary uploads happen on prod (file transfer) or pre-uploaded locally with only IDs sent?
- How do we reconcile edits made directly in prod vs. new pushes from local?
- Does the CLI need to support batch syncing multiple entries in one go?
- Should we also expose a read-only endpoint to fetch current prod entries for diffing?

Once the current launch is live, we can start iterating on the API contract, security, and CLI ergonomics.
