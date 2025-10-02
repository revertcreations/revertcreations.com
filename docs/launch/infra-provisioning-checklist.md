# Infrastructure Provisioning Checklist

Purpose: detailed steps I will follow when building the production environment. This is a living checklist—tick items off in the decision log once executed.

## 1. Prepare Environment
- [ ] Choose hosting provider/plan (CPU, RAM, disk, region, backups, snapshots).
- [ ] Generate unique hostnames (e.g., `jw-prod-01`).
- [ ] Create SSH keypair dedicated to production deployment (`ssh-keygen -t ed25519 -f ~/.ssh/jw_prod`).

## 2. Server Bootstrap
- [ ] Install base packages: `apt update && apt upgrade`, `ufw`, `fail2ban`, `curl`, `git`, `nginx`, `php8.2-fpm`, `mysql-server`, `redis-server`, `certbot`.
- [ ] Configure UFW: allow SSH (limit), HTTP, HTTPS; deny all else.
- [ ] Disable root password login in `/etc/ssh/sshd_config`; enforce key auth.
- [ ] Create deployment user with sudo (optional) or keep root-only with SSH key.

## 3. Application Stack
- [ ] Clone repo into `/var/www/junkyardwatchdog`.
- [ ] Install PHP extensions (`php8.2-mysql`, `php8.2-xml`, `php8.2-mbstring`, etc.).
- [ ] Install Node/Yarn if building assets on the box (or prepare GitHub Actions artifact flow).
- [ ] Configure Supervisor programs (`jw-queue`, `jw-schedule`) mirroring staging.

## 4. Database & Redis
- [ ] Secure MySQL: set root password, remove test DB, disable remote root login.
- [ ] Create production DB/user with strong password (record in secret plan).
- [ ] Import baseline schema (`php artisan migrate --force`).
- [ ] Configure Redis (requirepass if desired) and adjust memory policy.

## 5. TLS & Nginx
- [ ] Create `junkyardwatchdog.com` nginx server block pointing to `backend/public`.
- [ ] Run `certbot --nginx -d junkyardwatchdog.com -d www.junkyardwatchdog.com` after DNS cutover.
- [ ] Enable HSTS + recommended TLS params (`ssl_ciphers`, `ssl_prefer_server_ciphers`).
- [ ] Add `/health` endpoint allowlist if behind load balancers.

## 6. Deployment Scripts
- [ ] Copy `ops/bin/deploy-staging-local.sh` to production variant or use same script with new env file (`ops/env/production.env`).
- [ ] Ensure `ops/bin/local-ci.sh` runs in GitHub Actions before deploy.
- [ ] Configure GitHub Actions secrets (`PROD_HOST`, `PROD_DOMAIN`, credentials).

## 7. Verification
- [ ] Run `php artisan config:cache`, `route:cache`, `view:cache`.
- [ ] Seed sample data or sync from staging as needed.
- [ ] Validate queue worker, scheduler, cron tasks.
- [ ] Hit `/health` and admin dashboard.

Record completion dates in `docs/launch/decision-log.md`.
