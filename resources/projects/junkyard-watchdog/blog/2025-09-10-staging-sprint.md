# Sep 10, 2025 – Staging Sprint

Infrastructure day. I wired up Terraform apply/destroy workflows, scripted the “provision an existing droplet” flow, and taught GitHub how to run diagnostics on demand. Staging now knows how to restart Supervisor, renew TLS, and double-check Redis without me SSH’ing in like a goblin.

```bash
supervisorctl reread && supervisorctl update
supervisorctl restart jw-queue jw-schedule
```

Meanwhile Playwright finally sails through against staging, and the EAS docs explain how to spin up a dev client without cursing Expo. The README even reads like a real runbook. It’s the kind of ops work that doesn’t make screenshots prettier, but it keeps release week from melting down, which is the whole point.
