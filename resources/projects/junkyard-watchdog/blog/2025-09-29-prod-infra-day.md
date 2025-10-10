# Sep 29, 2025 – Production Housekeeping

Checklist day! I spun up the `jw-prod-01` droplet, installed the usual suspects (PHP 8.4, nginx, MySQL, Redis, Supervisor), and pointed the domain so we’ve got real HTTPS before launch week kicks in. Secrets got rotated, templates scrubbed, and I dropped a nightly backup script that ships encrypted dumps to Spaces just in case.

```bash
/usr/local/bin/jw-backup.sh | openssl enc -aes-256-cbc -salt -out backup.sql.enc
```

While snapshots ran I wrote up the mobile regression plan so QA has receipts, and logged every infra decision in the launch docs. There are still a few follow-ups—Spaces creds, DNS rollback notes—but the foundation is ready. Nothing flashy, just responsible adulting for prod.
