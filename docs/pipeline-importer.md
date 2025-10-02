# Opportunity Importer

Use the Artisan command to load leads from JSON files into the pipeline. JSON shape:

```json
[
  {
    "company": "Company Name",
    "role": "Role Title",
    "industry": "Industry",
    "status": "open",
    "stage": "Identified",
    "priority": "high",
    "source": "agent-scraped",
    "source_channel": "LinkedIn alert",
    "summary": "Quick summary",
    "next_action_at": "2025-10-02T09:00:00-04:00",
    "notes": "internal notes",
    "links": { "posting": "https://example.com/job" },
    "is_remote": true,
    "async_level": 4,
    "salary_min": 120000,
    "salary_max": 140000,
    "salary_currency": "USD",
    "domain_tags": ["photography", "creative"]
  }
]
```

Place files under `resources/opportunities/` or specify a path:

```
php artisan opportunity:import
php artisan opportunity:import --path=/full/path/to/my.json
```

`slug` is generated automatically using company + role (override by adding a `slug` property). Existing entries are merged via `updateOrCreate` so you can rerun imports without duplicates. Missing `workflow_state` defaults to `sourced`.

Visibility controls:
- The importer respects `public_visibility` in the payload; if omitted it honours score-based decisions from `opportunity:collect`.
- Anything skipped via `config('opportunity_pipeline.ignore_on_import')` or moved to archived remains hidden from the public `/opportunities` page.

### Fit score

The importer scores each lead (0–10) based on preferences defined in `config/opportunity_prefs.php`: remote availability, async level, salary ≥ $100k USD, and domain tags (photography, guitar, BMX, etc.). Adjust that config to tune the scoring.
