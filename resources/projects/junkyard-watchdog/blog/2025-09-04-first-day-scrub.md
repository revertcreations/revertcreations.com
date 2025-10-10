# Sep 4, 2025 – Kicking The Tires

First day back in the garage and everything creaked. The admin sync endpoint was wide open, the scraper still had a rogue `dd()` hiding inside, and the frontend was glued to a hard-coded API URL. I spent the morning doing the unglamorous stuff: wrapping `/admin/*` in real auth, swapping in Laravel’s HTTP client so the job actually respects timeouts, and teaching CORS to read from env vars instead of guessing.

```php
$this->request = Http::timeout(30)
    ->withHeaders(['User-Agent' => 'JunkyardWatchdog/1.0'])
    ->get($url);
```

By lunch the login flow finally returned `{ token }`, Expo pulled its API base from `EXPO_PUBLIC_API_URL`, and Sail commands were short enough to remember. I even slapped together a Makefile so spinning up the stack feels like flipping a switch.

Afternoon was all polish: Paper tabs started looking like a real app, inventory rows finally showed make/model/year, and the NEW badge stopped shouting in the wrong place. The mental sticky note was simple—get the foundation solid so future-me can focus on the fun bits instead of chasing auth ghosts.
