# Launch Pod Briefings

This document supplements `PROJECT_PLAN.md` and `PRODUCTION_CHECKLIST.md` by giving each pod a focused backlog and key dependencies. No standing meetings—just grab a task and ship it.

## Security & Compliance Pod
- Deliverables: finalized legal pages, acceptable use/DMCA, data-source ToS tracker, incident response plan, secret rotation schedule, audit of logging/alerts.
- Immediate Tasks:
  - Draft production-ready Terms/Privacy/EULA content yourself (mark TODOs if you’ll outsource later).
  - Document export/delete workflows and tie them into the support tooling you’ll be using.
  - Review dependencies (composer/npm) with Snyk/GitHub advisories and log results.
  - Define alert thresholds for auth failures/ingest anomalies and note how you’ll monitor them.

## Product QA & Observability Pod
- Deliverables: regression matrix, device lab coverage, accessibility report, performance benchmarks, smoke-test automation, support desk SOP.
- Immediate Tasks:
  - Compile latest manual QA cases (`docs/manual-qa`) into launch suite.
  - Expand Playwright scripts for prod smoke; plan monitoring integration.
  - Schedule device testing (physical/emulator) for critical flows.
  - Draft support escalation runbook (ties into Documentation & Training).

## Analytics & Growth Pod
- Deliverables: analytics implementation matrix, consent-gating plan, KPI dashboard designs, attribution/deep-link strategy, experimentation framework.
- Immediate Tasks:
  - Audit current telemetry hooks vs launch KPIs; identify gaps.
  - Select an analytics stack (Mixpanel/Amplitude/etc.) and outline your implementation timeline.
  - Capture deferred deep link requirements alongside the mobile release work.
  - Define measurement for acquisition channels (UTMs, campaign metadata) you intend to use.

## Mobile Release & Marketing Pod
- Deliverables: App Store & Play listings, localized copy, screenshots/videos, signing pipelines, TestFlight/Play testing cohorts, launch comms calendar, brand kit.
- Immediate Tasks:
  - Inventory missing assets (icons at required resolutions, preview video script).
  - Establish signing key management alongside the ops/security work.
  - Draft store copy and privacy text referencing your final legal docs.
  - Outline the marketing launch sequence (waitlist email, press release draft, social schedule).
  - Draft mobile EULA summary (see `docs/launch/mobile-eula.md`) and ensure stores link to the full Terms/Privacy/EULA set.

## Payments & Monetization Pod
- Deliverables: Stripe live config, webhook reliability, subscription QA matrix, tax/receipts handling, refund policy, pricing updates.
- Immediate Tasks:
  - Switch to the Stripe live test environment (non-production) and validate flows.
  - Document fallback handling for failed payments & grace periods.
  - Ensure legal disclaimers align with your updated Terms.

## Documentation & Training (Cross-pod)
- Deliverables: updated runbooks (`DEPLOY.md`, `PROJECT_PLAN.md`, `TELEMETRY_PLAN.md`, `MONETIZATION.md`), customer help center, internal onboarding materials.
- Immediate Tasks:
  - Update each doc yourself and note the last review date.
  - Draft support macros/FAQs for top workflows (garage, watchlists, billing).
  - Capture screenshots/videos for the training library.
