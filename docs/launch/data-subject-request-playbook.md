# Data Subject Request (DSR) Playbook

Even as a solo builder, be ready to honour privacy requests quickly.

## Request Intake
- Accept requests via `support@junkyardwatchdog.com` (plus any in-app form or support ticket tagged "privacy").
- Require the user to verify ownership of the email address associated with the account (reply-to challenge or in-app auth).

## Request Types
1. **Access / Export**
   - Use a read-only DB connection to export relevant tables: `users`, `watchlists`, `vehicles`, `device_tokens`, `subscriptions`, `observations`.
   - Sanitize internal-only metadata (IDs, timestamps) as needed.
   - Provide data in JSON within 30 days (target 7 days).
2. **Deletion**
   - Run Laravel command (TODO: add artisan command) or manual SQL to delete user + linked records.
   - Confirm Stripe subscription cancellation before removing billing data.
   - Keep minimal audit trail (request ID, date, action) in secure offline store for compliance.
3. **Rectification**
   - Update fields requested (e.g., email change) via existing admin tooling or direct SQL update.

## Workflow
1. Log request in a simple spreadsheet or `docs/launch/decision-log.md` (include date, requester, type, deadline).
2. Verify identity → acknowledge receipt in writing.
3. Fulfil request using steps above; double-check logs for lingering references.
4. Send confirmation email summarizing actions taken and any exemptions (e.g., billing records retained for legal obligations).

## Automation Backlog
- Add artisan commands for export/delete to reduce manual SQL.
- Build self-service privacy settings page post-launch.

Keep this doc updated with real scripts and templates as soon as they’re written.
