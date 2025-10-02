# Secret Rotation & Storage Plan

## Principles
- Never commit secrets to git (use `.env`, GitHub Actions secrets, or server-level config).
- Store long-lived credentials in a secure manager (1Password vault for now; upgrade to Vault when infra grows).
- Rotate all credentials before launch and log the rotation date below.

## Credentials to Rotate Pre-Launch
| Secret | Location | Rotation Steps | Last Rotated | Notes |
| --- | --- | --- | --- | --- |
| APP_KEY | backend `.env` | `php artisan key:generate --show` (update env + cache) | 2025-09-30 | Stored in 1Password vault entry; queues restarted. |
| DB_PASSWORD | MySQL | Create new user/pass, update env + supervisor, revoke old | 2025-09-30 | New `jw` user password synced to prod/staging env + 1Password. |
| STRIPE_SECRET/WEBHOOK | Stripe Dashboard | Create live keys/webhook secret, update env + GitHub secrets | 2025-09-30 | Live keys rotated; webhook re-delivered to confirm 200 OK. |
| MAILGUN_SECRET | Mailgun | Generate new API key, update env | 2025-09-30 | Verified via `artisan mail:test`; key stored in vault. |
| REDIS_PASSWORD (if set) | Redis config | Update redis.conf & env, restart redis | N/A | Using local socket auth only; re-evaluate if remote Redis enabled. |

## GitHub Actions / CI Secrets
| Secret | Rotation Plan |
| --- | --- |
| `PROD_HOST`, `PROD_DOMAIN`, etc. | Validated 2025-09-30 — stored in GitHub Environments (Production) with reviewer approvals. |
| `SSH_PRIVATE_KEY` | Rotated 2025-09-29; new key pair saved in 1Password and added to jw-prod-01 `~/.ssh/authorized_keys`. |

## Secure Storage
- Maintain a 1Password vault entry titled **Junkyard Watchdog – Production Secrets** containing: APP_KEY, DB credentials, Mailgun keys, Stripe keys, Redis password (if any), Expo/EAS credentials.
- For shared CI-only values (none yet), consider using GitHub environment secrets with approvals.

## Rotation Log
| Date | Items Rotated | Performed By | Notes |
| --- | --- | --- | --- |
| 2025-09-30 | APP_KEY, DB user password, Stripe live keys/webhook, Mailgun API key; updated GitHub secrets | Codex | Stored in 1Password "Junkyard Watchdog – Production"; prod `.env` + config cache refreshed; webhook re-tested. |

## Follow-up
- After launch, schedule recurring reminder (quarterly) to review this table and rotate high-risk credentials.
