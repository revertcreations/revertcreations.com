# Build Journal Metrics

The `journal:refresh-metrics` command calculates commits, lines of code, and build-log counts for each build journal. The metrics are stored in `storage/app/journal-metrics.json`, which the site reads directly.

## Running locally

1. Ensure the MySQL container is up (`./vendor/bin/sail up -d mysql`).
2. Create `.env.metrics` (already checked in) or export the following so Artisan can reach Sail’s database:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=revertcreations
DB_USERNAME=sail
DB_PASSWORD=<your-sail-password>

JUNKYARD_WATCHDOG_PATH="/Users/treverhillis/Code/junkyardwatchdog"
SITE_RELAUNCH_PATH="/Users/treverhillis/Code/revertcreations.com"
```

3. Run the command from your host shell: `php artisan --env=metrics journal:refresh-metrics`.
4. Commit the updated `storage/app/journal-metrics.json` so production displays the latest stats.

> Tip: skip running the command inside Sail—the container doesn’t mount the Junkyard Watchdog repo.

## Production workflow

Treat the JSON file as source data. Refresh it locally whenever you want updated numbers, commit it, and deploy. The live droplet just reads the committed snapshot.

## Troubleshooting

If running the command outside Sail still shows `build_logs: 0`, verify the Sail MySQL container is up (`./vendor/bin/sail up -d mysql`) and that the password in `.env.metrics` matches your Sail `.env`. The database name defaults to `revertcreations`; adjust it if you use a different schema on your host.
