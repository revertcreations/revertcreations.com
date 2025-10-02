# Incident Response Playbook

Purpose: give myself a lightweight but actionable checklist when something goes wrong in production.

## Severity Levels
- **SEV-1 (Critical outage)**: App/API unavailable, ingest halted, or data compromise suspected.
- **SEV-2 (Major degradation)**: Key features broken (auth, billing, notifications) but partial service available.
- **SEV-3 (Minor issue)**: Bug affecting limited users, background job hiccup, cosmetic defects.

## Immediate Actions
1. **Detect & Triage**
   - Confirm alert/source (monitoring dashboard, customer report, logs).
   - Classify severity and start a timestamped incident note in `docs/launch/decision-log.md`.
2. **Stabilize**
   - For SEV-1: consider immediate rollback or maintenance mode.
   - Capture logs (`tail -f storage/logs/laravel.log`, supervisor logs, system journal).
   - Disable noisy jobs if they’re causing cascading failures.
3. **Communicate**
   - Post status update to public channel (status page/email template in `logging-alerts-plan.md`).
   - Note ETA for next update (SEV-1: every 30m, SEV-2: every 60m).
4. **Remediate**
   - Deploy fix/rollback following `deploy-rehearsal-script.md` steps.
   - Verify via smoke tests (health endpoint, key user flows).
5. **Close Out**
   - Document root cause, actions taken, time to detect/resolve in the decision log.
   - Create follow-up tickets for permanent fixes/prevention.

## Contacts & Tools
- Monitoring dashboard: TODO (Grafana/DataDog link once set up).
- Alert destinations: personal email + Slack DM (configure in `logging-alerts-plan.md`).
- Runbooks: `deploy-rehearsal-script.md`, `ops-infrastructure.md`, `secret-rotation-plan.md`.

## Post-Incident Checklist
- [ ] Decision log updated with final status.
- [ ] Customer/partner communication sent (if applicable).
- [ ] Support macros updated if new FAQ or workaround is required.
- [ ] Retrospective scheduled (can be a personal journal entry).
