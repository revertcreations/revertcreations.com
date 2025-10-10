# Sep 21, 2025 – Mailgun & Deploy Triage

I thought the day would be quiet, then staging decided digest emails should fail in the queue. Turns out the deploy script was writing literal `"null"` strings into the SMTP env vars—good times. I rolled the workflows back to the known-good version, pointed the staging DNS at the right droplet, and pulled in the Mailgun client so Laravel could hit the API instead of pretending SMTP was fine.

```bash
supervisorctl tail jw-queue
php artisan queue:failed --uuid 1cf0c938-51e0-4a26-8b38-ff2ae837fc9d
```

The action items were simple: fix the env writer, restart the queue, and watch Mailgun’s logs like a hawk. Not glamorous, but now the digest pipeline is ready for the next release without surprise failures. Sometimes ops days are just detective work with a side of DNS.
