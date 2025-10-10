# Project Showcase Overhaul Plan ✅

Transform the current “blog” into a project portfolio that highlights Junkyard Watchdog (and future projects) with rich updates, assets, and status tracking.

---

## 1. Discovery & Content Audit
- [ ] Catalogue existing blog posts and map them to projects (Junkyard Watchdog vs misc).
- [ ] Review `../junkyardwatchdog/docs/` for assets, changelogs, and launch materials worth importing.
- [ ] Capture canonical project metadata (status, launch goals, links, tech stack) for initial projects.

## 2. Data Model & Migrations
- [x] Design `projects` table (slug, name, summary, long description, status enum, CTA links, hero asset refs, ordering).
- [x] Design `project_updates` table (project FK, title, markdown body, published flags, timestamps).
- [x] Determine need for `project_assets` table (type, caption, URL, credit, ordering) and add if required.
- [x] Create Laravel models + relationships (`Project`, `ProjectUpdate`, `ProjectAsset`).
- [x] Write migrations and ensure down methods clean up data safely.

## 3. Admin Experience
- [x] Build Project CRUD UI (index + create/edit forms) with Cloudinary hero uploader.
- [x] Build Update management UI (markdown editor, publish controls, timeline pinning).
- [x] Implement controllers, form requests, and policies/validation for new resources.
- [x] Script/command to seed initial Junkyard Watchdog project and migrate relevant blog posts to updates.

## 4. Public-Facing Pages
- [x] Develop `/projects` listing page with status badges, hero imagery, and quick summaries.
- [x] Develop project detail page featuring overview header, markdown description, asset gallery, and update timeline.
- [x] Update global navigation/footer to link to Projects instead of Blog.
- [ ] Add OG/Twitter meta tags powered by project metadata (title, description, hero image).

## 5. Content Workflow & Documentation
- [x] Define folder structure for project content (e.g., `resources/projects/<slug>/`).
- [ ] Document conventions for markdown updates, asset naming, and metadata.
- [x] Optional: provide CLI helper to import updates from external docs (e.g., `php artisan project:update`).

## 6. Integrations & Enhancements
- [ ] Confirm Cloudinary configuration (env vars + folder/preset naming) for new media flows.
- [ ] Support embedding rich assets (Figma, Loom, video) with reusable Blade components.
- [ ] Add RSS/JSON feed for project updates to replace legacy blog feed.
- [ ] Track analytics events (project view, asset interaction, outbound links) for reporting.

## 7. Testing & QA
- [ ] Add feature tests for Project/Update CRUD and public pages (visibility, sorting, markdown render).
- [ ] Add browser tests for admin image upload + markdown snippet flow.
- [ ] Verify responsiveness and accessibility of new pages.
- [ ] Smoke test production Cloudinary uploads and asset rendering.

## 8. Deployment & Rollout
- [ ] Prepare migration + deployment checklist (backups, Cloudinary presets, env updates).
- [ ] Deploy to staging, import Junkyard Watchdog content, validate UI/UX.
- [ ] Launch to production, monitor logs and asset usage, capture post-launch feedback.

## 9. Post-Launch Iterations
- [ ] Evaluate need for project categories/tags once multiple projects exist.
- [ ] Schedule cadence for update reminders and asset refreshes.
- [ ] Consider public roadmap or changelog that aggregates project updates.
- [ ] Gather metrics (traffic, engagement) and adjust presentation based on insights.

---

**Notes**
- Junkyard Watchdog assets and documentation live in `../junkyardwatchdog`.
- Cloudinary connection string: `cloudinary://<api_key>:<api_secret>@junkyardwatchdog`.
- Future projects should follow the same data + content pattern for consistency.
