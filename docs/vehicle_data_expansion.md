Vehicle Data Expansion Plan
===========================

Objective
---------
Build a comprehensive, maintainable dataset of vehicle makes/models/trims that supports watchlists, ingest normalisation, and future parts-level expansion without relying on paid vendors.

Current State
-------------
- Seed set derived from ingest sources (UPullAndPay) and ad-hoc catalog builder jobs.
- `automotive_makes` / `automotive_models` populated primarily by scrape output; trims, engines, transmissions incomplete.
- Watchlists accept free-form make/model strings, leading to inconsistent casing and duplicates.
- No canonical VIN decoding or metadata (body, drivetrain, generation) beyond what yards provide.

Target Coverage
---------------
1. Core OEM list (USDM + popular JDM/EU brands) from 1970–present.
2. Model catalogue with synonyms (e.g., "F-150" vs "F150") and platform codes.
3. Optional trim + engine metadata for higher-tier users (future).
4. Mappings for ingest normalization (yard strings → canonical values).

Workstreams
-----------
### 1. Canonical Reference Build
- Aggregate seeds from open data sources:
  * NHTSA Product Information Catalog Vehicle Listing (vPIC)
  * EPA FuelEconomy dataset for trims + drivetrain
  * Wikipedia/DBPedia for legacy models (use selective scraping)
- Normalize to {make_slug, model_slug, display_name, start_year, end_year}.
- Store in new tables `vehicle_catalog_makes`, `vehicle_catalog_models`, `vehicle_catalog_aliases`.
- Establish automated nightly job to refresh from vPIC (delta ingest).

### 2. Ingest Normalization Layer
- Extend existing `AutomotiveCatalogBuilder` to map junkyard inventory strings to catalog IDs.
- Maintain alias table for yard-specific spellings (e.g., "Chevrolet Truck" → Chevy).
- Provide fallback fuzzy matching for ingest pipeline and log unmapped entries for review.

### 3. Watchlist Enhancements
- Autocomplete powered by catalog (make → model) with slugged IDs.
- Persist watchlists referencing catalog IDs in addition to free-form text for backwards compatibility.
- Instrument telemetry to track unmapped user entries; feed into alias backlog.

### 4. Parts Roadmap (future)
- Evaluate open-part datasets (ACES/PIES alternatives) for eventual parts-level expansion.
- Prototype linking common components (engine family, transmission code) to models.

Data Pipeline
-------------
1. **Extract** open datasets (cron job or manual refresh); store raw JSON/CSV in `storage/app/catalog_snapshots/`.
2. **Transform** via Laravel command that dedupes, slugs, and builds alias suggestions.
3. **Load** into catalog tables with versioning (`catalog_version` column for rollback).
4. **Validate** counts and sample queries (`php artisan catalog:validate`).

Tooling & QA
------------
- CLI utilities:
  * `catalog:import --source=vpic` – ingest new snapshot.
  * `catalog:aliases --report` – list unresolved strings from ingest runs.
- Admin UI tab for catalog overview (counts, last updated, unmatched strings).
- Unit tests for normalization mappings (fixtures covering edge cases like Hyundai/Kia, domestic trucks).

Timeline (tentative)
--------------------
Week 1: vPIC import pipeline, catalog tables, alias scaffolding.
Week 2: Ingest normalization integration, watchlist autocomplete switch.
Week 3: Admin tooling, telemetry for unmapped strings, EPA trims spike.

Risks & Mitigations
-------------------
- **Data volume:** vPIC is large (~MBs) but manageable; ensure migration indexes.
- **Inconsistent naming:** maintain alias fallback with manual review queue.
- **User disruption:** ship watchlist updates behind feature flag; keep free-form entry until autocomplete vetted.
- **Legal/licensing:** confirm open-data licensing (NHTSA/EPA allow reuse with attribution).

Next Steps
----------
1. Design catalog schema and migrations.
2. Create vPIC import command (CSV → catalog tables).
3. Instrument ingest pipeline to log unmatched make/model strings.
4. Add epic to `PROJECT_PLAN.md` (vehicle catalog).
