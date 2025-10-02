# Ops & Infrastructure Pod — Launch Readiness

Purpose: deliver sections 2 and 3 of `PRODUCTION_CHECKLIST.md` and provide inputs for sections 4 (security mechanics) and 13 (go/no-go rehearsal).

## Owner
- You’re responsible for the entire track. Capture any notes or questions inline in this doc.

## Milestones
| Milestone | Target Date | Notes |
| --- | --- | --- |
| Production host provisioned with hardened baseline | T+1 week | Include firewall, monitoring agents, fail2ban |
| Rehearsal deploy completed end-to-end | T+2 weeks | Dry-run migration, rollback script validated |
| Backup/restore drill documented | T+2 weeks | Capture verification artifacts |
| Launch runbook signed off | T+3 weeks | Includes go-live steps + rollback |

## Work Breakdown
Support docs: `infra-provisioning-checklist.md`, `dns-cutover-plan.md`, `backup-restore-verification.md`, `secret-rotation-plan.md`.

### 1. Environment Provisioning
- [x] Select hosting plan (CPU/RAM, region, redundancy requirements). — DigitalOcean Droplet `jw-prod-01` (s-2vcpu-4gb, NYC3) provisioned 2025-09-29.
- [x] Apply baseline hardening: package updates, SSH key auth, disable root login, set up unattended upgrades. — Bash hardening script + manual verification; password login disabled, fail2ban + unattended-upgrades enabled.
- [x] Configure firewall (UFW/iptables) with only HTTP/HTTPS/SSH; consider Cloudflare or WAF if needed. — UFW allows 22/80/443; default deny inbound; future Cloudflare optional.
- [x] Install and configure services: Nginx, PHP-FPM, MySQL, Redis, Supervisor, Certbot. — Installed via `ops/scripts/deploy-app.sh`; PHP 8.4 FPM socket, Redis local, Supervisor programs `jw-queue` + `jw-schedule`, Certbot issued LE certs.

### 2. DNS & TLS
- [x] Draft DNS change plan (cutover strategy, TTL reductions, rollback). — Captured in `docs/launch/dns-cutover-plan.md`; rehearse before go-live.
- [x] Pre-issue Let’s Encrypt cert via staging domain or HTTP challenge dry-run. — Ran `certbot --nginx` on jw-prod-01 after DNS switch; renewal cron active.
- [x] Enable HSTS, OCSP stapling, modern TLS ciphers; document verification commands. — Nginx config enforces HSTS + modern ciphers; `openssl s_client` command documented in cutover plan.
- [x] Issue staging cert (`staging.junkyardwatchdog.com`). — `certbot --nginx -d staging.junkyardwatchdog.com` run 2025-09-30, eliminating TLS SAN mismatch for automation.

### 3. Deployment Automation
- [x] Adapt `ops/bin/deploy-staging-local.sh` for production (parameterize host, secrets file, skip destructive tasks). — Production flag verified via dry-run (2025-09-29) pointing at jw-prod-01; uses `ops/env/production.env`.
- [x] Confirm GitHub Actions production workflow with environment approvals and secret usage. — Manual-only workflow enabled (Sept 11); environment protection requires approval before deploy.
- [ ] Write “rehearsal deploy” script to clone staging DB to sandbox prod for migration testing. — Manual restore tested (see backup verification); script still pending.
- [ ] Document rollback procedure (git revert, asset restore, queue restart). — Outline partially captured in launch brief; expand into full runbook appendix.

### 4. Backups & Observability
- [x] Schedule automated MySQL dumps + encryption + offsite storage. — `/usr/local/bin/jw-backup.sh` + cron `0 3 * * *`; uploads encrypted dump to DO Spaces (tested 2025-09-29).
- [ ] Plan filesystem backups (uploads, logs) with retention policy. — TODO: add rsync/S3 sync for `storage/app` and logs.
- [x] Verify `/health` plus new `/ops/status` endpoint requirements (if any) for monitoring pod. — `/health` returns ok (DB ping) and admin Ops Status panel confirmed.
- [ ] Ship system metrics to observability stack (CPU/mem/disk/IO) and create alert thresholds. — Pending; currently manual via `htop`.

### 5. Configuration Management
- [x] Create production `.env` template with placeholder secrets. — `ops/env/production.env` mirrors live keys; actual values stored in 1Password vault entry.
- [ ] Define secret rotation cadence and secure storage (1Password/Vault). — See `docs/launch/secret-rotation-plan.md`; populate rotation dates post-launch prep.
- [x] Ensure cache/queue config uses Redis cluster or fallback strategy. — Production `.env` points queue/cache/session drivers at Redis (phpredis client).
- [x] Document instructions for toggling `ROBOTS_ALLOW_INDEX`. — See “Production Configuration & Data” section below.

### 6. Handoffs & Documentation
- [ ] Update `DEPLOY.md` with production flow screenshots/commands.
- [ ] Extend `STAGING_CHECKLIST.md` to reference production equivalents.
- [ ] Produce runbook appendix for the go/no-go checklist (step-by-step launch + rollback).
- [ ] Record acceptance criteria directly in `PRODUCTION_CHECKLIST.md` once each item is complete.

## Notes & Follow-ups
- Track follow-up actions (e.g., secret rotation, Stripe key confirmation) in `docs/launch/decision-log.md` once executed.

## Production Configuration & Data (2025-09-30)
- **Robots gate**: Production `.env` has `ROBOTS_ALLOW_INDEX=false`. Launch flip plan: update `/var/www/junkyardwatchdog/backend/.env` to `ROBOTS_ALLOW_INDEX=true`, run `php artisan config:cache`, and reload Nginx; perform only after public announcement.
- **Seed data**: Base junkyard catalog + locations seeded from staging export (counts: 4 junkyards, 165 locations). `AutomotiveCatalogSeeder` executed; `catalog:build` refreshed on 2025-09-29 to populate 62 automotive makes. Admin user `trever@revertcreations.com` confirmed.
- **Ingest cadence**: `OPS_INGEST_AUTOMATION_ENABLED=true` on production; scheduler dispatches UPullAndPay every 2h and LKQ every 3h. Pick-n-Pull is paused (config `JUNKYARD_PICKNPULL_ENABLED=false`) pending written approval. Verified via `ingest_runs` rows through 2025-09-30 14:22 ET and Supervisor logs.
- **Rehearsal deploy & migrations**: Production deploy dry-run executed 2025-09-29; nightly MySQL backup restored to `jw_restore_test` for integrity check. `php artisan migrate --pretend --force` run 2025-09-30 (no pending migrations).
- **Retention & purge jobs**: Nightly encrypted MySQL dumps (keep 7 days locally, offsite copy), weekly `alerts:prune-matches --days=90` scheduled, backup logs rotated via `/etc/logrotate.d/jw-backup`. TODO: extend to asset rsync and Laravel log rotation.

## Risks & Mitigations
| Risk | Mitigation |
| --- | --- |
| DNS cutover downtime | Run rehearsal, keep TTL low, prepare staged rollout |
| Unnoticed config drift | Script provisioning with Ansible/Terraform or documented bash scripts |
| Backup failure | Automate verification and alert on backup completion |

## Status Log
| Date | Update | Owner |
| --- | --- | --- |
| YYYY-MM-DD | Initial plan drafted | <your name> |
