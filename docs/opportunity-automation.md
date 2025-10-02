# Opportunity Automation

Run the collector to fetch remote leads twice per day:

```
php artisan opportunity:collect
```

What it does:
- Queries Remotive, RemoteOK, WeWorkRemotely (RSS), and LaraJobs feeds.
- Normalises results into the JSON schema used by `opportunity:import`.
- Writes the payload to `storage/app/opportunities/opportunities-YYYYMMDD-HHMMSS.json`.
- Imports the leads into the database and recalculates fit scores.

## Preferences

Tweaks live in:
- `config/opportunity_prefs.php` for salary threshold, currency, and domain preferences.
- `config/opportunity_sources.php` to enable/disable providers and adjust keywords for domain detection.
- `config/opportunity_pipeline.php` to pick which workflow states show publicly (`public_workflow_states`) and which should be ignored on import.

Importer defaults:
- Leads land in the `sourced` workflow by default.
- Anything falling below the fit-score floor is automatically marked `public_visibility = false` so the public pipeline only shows vetted, high-signal roles.

After editing config, run `php artisan config:clear` so changes take effect.

## Scheduling

Add a cron entry on your host to run at 09:00 and 17:00:

```
0 9,17 * * * cd /path/to/revertcreations.com && php artisan opportunity:collect >> storage/logs/opportunity-collect.log 2>&1
```

This keeps the pipeline fresh without needing to open the admin UI.
