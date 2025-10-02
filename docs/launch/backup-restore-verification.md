# Backup & Restore Verification Plan

Use this plan every time I set up or audit backups.

## Backup Strategy
- **Database**: nightly `mysqldump` with gzip compression; store in `/var/backups/jw` and sync to S3/Spaces.
- **Storage assets**: rsync `storage/app` and `storage/logs` to offsite bucket weekly.
- **Configs**: backup `/etc/nginx`, `/etc/supervisor`, deployment scripts whenever they change.

## Automation Tasks
- [x] Create backup script (`/usr/local/bin/jw-backup.sh`) performing mysqldump + S3 upload.
- [x] Schedule via cron (`0 3 * * * root /usr/local/bin/jw-backup.sh`).
- [x] Configure log rotation for backup logs.

### Configuration notes
- Secrets live in `/etc/jw-backup.env` (created on first deploy). Populate `BACKUP_BUCKET`, `SPACES_ACCESS_KEY_ID`, `SPACES_SECRET_ACCESS_KEY`, and (if different) `SPACES_ENDPOINT_URL` for DigitalOcean Spaces.
- Encryption uses a passphrase file (`/root/.config/jw-backup/passphrase`, auto-generated if missing). Rotate via `head -c 48 /dev/urandom | base64 > /root/.config/jw-backup/passphrase`.
- For dry runs without S3, invoke `BACKUP_SKIP_UPLOAD=1 /usr/local/bin/jw-backup.sh` — still produces an encrypted archive under `/var/backups/jw`.
- 2025-09-29: Verified Spaces upload (`jw-prod-mysql-20250929T201305Z.sql.gz.enc`) and restored the decrypted dump into a temporary `jw_restore_test` database; import completed without errors.

## Verification Checklist (Monthly)
1. Restore latest DB dump to a local Docker MySQL container:
   ```bash
   docker run --name jw-restore -e MYSQL_ROOT_PASSWORD=secret -d mysql:8
   docker exec -i jw-restore mysql -uroot -psecret < dump.sql
   ```
   Ensure migrations run and app boots against restored DB.
2. Verify S3 bucket contains expected number of backups; check object lifecycle rules.
3. Test asset restore by pulling the archive and comparing checksums.
4. Update decision log with verification date and findings.

## Retention & Alerts
- Keep daily dumps for 7 days, weekly for 4 weeks, monthly for 6 months.
- Configure alert if backup script fails (hook into logging/alert plan).

## TODO
- Implement encryption at rest for DB dumps (e.g., GPG) before first production backup. ✅ (OpenSSL AES-256 with passphrase file)
- Evaluate managed backup solutions if infrastructure scales.
