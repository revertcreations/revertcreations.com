# DNS Cutover Plan

Purpose: execute a safe transition from staging to production domain while minimizing downtime.

## Preparation
- Target domain: `junkyardwatchdog.com`
- Production host IP: TODO (add once server provisioned)
- TTL reduction: set to 300 seconds at least 24 hours before cutover.
- Ensure HTTPS cert can be issued via HTTP-01 challenge (port 80 reachable).

## Pre-Cutover Checklist
- [ ] Back up current DNS zone file.
- [ ] Verify production host responds on IP with temporary nginx page.
- [ ] Confirm deploy script ready and `.env` populated.
- [ ] Schedule maintenance window (announce on status/blog/social if needed).

## Cutover Steps
1. Update A (and AAAA if applicable) records for apex and `www` to production IP.
2. Flush DNS cache locally (`sudo dscacheutil -flushcache` on macOS) and verify `dig junkyardwatchdog.com` returns new IP.
3. Run `certbot --nginx -d junkyardwatchdog.com -d www.junkyardwatchdog.com` on the server.
4. Deploy latest code (`ops/bin/deploy-staging-local.sh` variant pointing to production env).
5. Run smoke tests (home page, login, admin, health check).

## Rollback Plan
- Keep previous IP handy; if major issue occurs, revert DNS records to old IP and redeploy staging.
- Remove production server from DNS until fixed.
- Communicate rollback on status channels.

## Post-Cutover
- Restore TTL to normal (e.g., 3600 seconds).
- Monitor metrics and logs for at least 1 hour.
- Update decision log with timestamp and notes.
