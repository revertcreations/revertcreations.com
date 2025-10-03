# Build Log Drafts · 2025-10-05

## Entry 1 — Cloudinary-backed image upload lands
- **Project:** site-relaunch
- **Phase:** Build
- **Category:** delivery
- **Logged at:** 2025-10-05T18:30:00-06:00
- **Title:** Build log timeline now supports Cloudinary hero images
- **Description:**
  - Finished the Laravel-side integration for optional Cloudinary uploads on build log entries. Added a migration for the new columns, wired the admin CRUD to validate and upload images, and surfaced them on the public timeline and home-page highlights. The admin preview and removal flow keep the workflow fast during edits.
- **Agent contribution:** Agents scaffolded the controller hooks and updated the Blade templates to render responsive image cards across admin and public views.
- **Review notes:** Validated uploads locally with the new env vars and smoke-tested the timeline rendering. Next step is running the migration + env updates on production.
- **Links:**
  - `docs/build-log-sync.md`

## Entry 2 — Environment hardening around Cloudinary
- **Project:** site-relaunch
- **Phase:** Polish
- **Category:** infrastructure
- **Logged at:** 2025-10-05T19:00:00-06:00
- **Title:** Hardened Cloudinary config and audit-ready `.env.example`
- **Description:**
  - Added guard rails so uploads short-circuit with friendly validation when Cloudinary credentials are missing, split the connection string into discrete env vars, and refreshed `.env.example` to document every config key used in the app. Composer now pulls in the Cloudinary Laravel package to ensure the helper exists in all environments.
- **Agent contribution:** Agents refactored the config file to assemble the URL from the split credentials and generated the exhaustive `.env.example` baseline.
- **Review notes:** Verified composer install and the new validation behaviour. Production needs the new env keys (`CLOUDINARY_CLOUD_NAME`, etc.) before deployment.
- **Links:**
  - `config/cloudinary.php`

## Entry 3 — Sync service blueprint for remote pushes
- **Project:** site-relaunch
- **Phase:** Plan
- **Category:** operations
- **Logged at:** 2025-10-05T19:30:00-06:00
- **Title:** Drafted API + CLI plan for pushing build logs to prod
- **Description:**
  - Captured a proposal for a signed ingest endpoint and shared CLI tooling so project repos can publish build logs directly to the live site. The doc covers payload shape, auth approach, and implementation steps to retire manual SQL dumps.
- **Agent contribution:** Agents outlined the payload schema, synchronization steps, and open questions around Cloudinary handling and idempotency.
- **Review notes:** Ready to implement after the current launch. Need to add `external_id` columns and ingestion audit trail when we pick this up.
- **Links:**
  - `docs/build-log-sync.md`
