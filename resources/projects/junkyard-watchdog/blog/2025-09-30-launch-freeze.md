# Sep 30, 2025 – Launch Freeze Mode

Pulled the lever on the feature freeze today. Logged the policy, ran every automated test we have (Laravel, lint, Jest, Playwright against staging and prod), and rotated the last batch of production secrets for good measure. Schedulers got a quick health check to confirm LKQ, Pick-n-Pull, Pull-A-Part, and UPAP are still on cadence.

Manual QA on TestFlight surfaced a few UX splinters—forgot-password handing off to Mail felt rough, the change-password form needed a visibility toggle, and Cloudinary squawked once—so those went straight onto the punch list.

We also launched the `/support` landing page for App Review, and Playwright learned how to skip webhooks via `STRIPE_SKIP_WEBHOOK=1`. The instructions from here are clear: finish the manual passes, prep the reviewer account package, and keep the freeze tight until we get our green light.
