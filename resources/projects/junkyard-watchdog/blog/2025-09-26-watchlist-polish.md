# Sep 26, 2025 – Watchlist Polish Party

Spent the day sanding down the last rough edges on watchlist and garage cards. The old tinted backgrounds were fighting dark mode, so I rolled them back to the base surface palette and let a bold unread border do the heavy lifting. Laravel Pint is now wired into CI too, which means my future pull requests don’t get roasted for style drift.

```json
{
  "scripts": {
    "lint": "vendor/bin/pint --test"
  }
}
```

Theme mocks picked up explicit MD3 fallbacks so snapshot tests chill even if Paper updates, unread micro-interactions survived the refactor, and the to-do list is down to tab highlights and telemetry work. Felt like a productive design cleanup kind of day.
