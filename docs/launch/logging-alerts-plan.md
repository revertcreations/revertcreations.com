# Logging & Alerting Plan

## Logging Configuration
- Laravel channel: `stack` (single file). Rotate daily via logrotate (configure on production host).
- Ensure `LOG_LEVEL=info` in production; raise to `warning` if volume becomes noisy.
- PII scrubbing: review custom logs to avoid printing tokens or email addresses; update as needed.

## Crash & Error Reporting
- Integrate Sentry (self signup) for backend & React Native app post-launch.
- TODO: add `SENTRY_DSN` env var and install SDKs (backend + Expo) before launch.

## Monitoring Dashboards
| Metric | Source | Threshold | Action |
| --- | --- | --- | --- |
| API 5xx rate | Laravel logs / Sentry | >1% over 5 min | Investigate logs, check deploy |
| Queue depth | `queue:work` metrics | >100 jobs queued for 10 min | Scale workers or inspect stuck job |
| Ingest run failures | `ingest_runs` table / telemetry | >1 failure per source per day | Check upstream site, alert |
| Push/email failures | Notification logs | >5% failure | Review provider status |

## Alert Channels
- Primary: Slack DM via Incoming Webhook (configure on deploy box).
- Secondary: Email from `no-reply@junkyardwatchdog.com` (automated sender delivering alert notifications).
- For critical alerts, enable phone push via Pushover (optional).

## Alert Rules to Implement
1. Supervisor queue exited unexpectedly (`supervisorctl status` not RUNNING) → Slack alert.
2. Health check degraded (`/health` status != ok) → uptime service ping.
3. Stripe webhook failure (logged error) → Slack alert + email.
4. Mailgun bounce/spam threshold exceeded → email alert.

## Runbook Links
- Incident response: `incident-response-playbook.md`
- Deployment/rollback: `deploy-rehearsal-script.md` (TODO)
- Secrets: `secret-rotation-plan.md`

Update this plan as monitoring tooling is wired up on the production host.
