# Sep 8, 2025 – Dialing In Radius & Digests

Started the day babysitting the U-Pull-&-Pay job—added friendlier logging, cached the make IDs, and made sure we can recover from weird HTML without nuking memory. Once that calmed down, I turned to location stuff: Account got manual lat/lng fields (or ZIP geocoding if you don’t feel like guessing), and the Home view now respects your radius when it shows recent matches.

The real win was consolidating email digests so you only get one message per ingest instead of a spam waterfall. Grouped everything by watchlist and knocked the send volume way down.

```php
Mail::to($user)
    ->queue(new WatchlistDigestMail($matches->groupBy('watchlist_id')));
```

Still need to pretty up the template and add scheduling knobs, but the plumbing’s in. The to-do list is mostly radius cleanup and input polish now, which feels like progress.
