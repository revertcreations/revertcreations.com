# Sep 9, 2025 – Digest Controls & Dev Rhythm

Today was short and sweet. I knocked out the TypeScript warning in the skeleton loader (React Native’s percent units are picky), then jumped into the admin digest tools. You can now preview a digest for any user, resend it on the spot, and see the latest ingest runs without diving into the database.

```php
return Inertia::render('Admin/DigestPreview', [
    'payload' => $digestBuilder->forUser($user)->toArray(),
]);
```

The rest of the notes were about cadence—ship unblockers first, keep commits small, and stay focused on one epic unless something’s on fire. It sounds obvious, but writing it down keeps me honest. Tests passed, PR merged, and I actually shut the laptop on time.
