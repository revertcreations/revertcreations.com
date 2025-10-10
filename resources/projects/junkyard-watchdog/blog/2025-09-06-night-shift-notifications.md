# Sep 6, 2025 – Night Shift Notifications

Couldn’t sleep, so I wired up the rest of the notification stack. Account now shows your devices, lets you yank stale tokens, and even fires a local test push so you know Expo heard you. On the backend I started pruning invalid tokens and added a queue-friendly way to retry matches without spamming.

```php
Expo::pushTokens($tokens)
    ->notify($payload)
    ->then(fn ($tickets) => $this->ticketRepository->store($tickets));
```

While I was there I cleaned up the watchlist dialog (hello, MD3 surfaces), made sure the list refetches after saves, and added little snackbars for error/success. Tossed in a Theme Debug gate for good measure and smoothed out the inventory detail view so it stops choking on nested resources. It’s the kind of work no one notices when it’s right—which is exactly the point.
