#!/bin/bash

set -e

echo "Deploying Laravel Application..."

# If anything fails after artisan down, bring the app back up before exiting
trap 'echo "Deploy failed. Bringing application back up..."; php artisan up' ERR

(php artisan down) || true

if git fetch origin deploy; then
    git reset --hard origin/deploy
elif [ -n "$GITHUB_DEPLOY_TOKEN" ]; then
    echo "SSH fetch failed; attempting HTTPS fetch with deploy token."
    git fetch "https://oauth2:${GITHUB_DEPLOY_TOKEN}@github.com/revertcreations/revertcreations.com.git" deploy
    git reset --hard FETCH_HEAD
else
    echo "Unable to fetch deployment branch. Ensure SSH access or set GITHUB_DEPLOY_TOKEN." >&2
    exit 1
fi

composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader

# Clear stale cache so migrations and DB check use fresh .env values
php artisan config:clear

# Verify MySQL is reachable before running migrations
echo "Checking database connection..."
for i in {1..15}; do
    if php artisan db:show > /dev/null 2>&1; then
        echo "Database is available."
        break
    fi
    if [ "$i" -eq 15 ]; then
        echo "Database not available after 30 seconds. Is MySQL running?" >&2
        exit 1
    fi
    echo "Waiting for database... attempt $i/15"
    sleep 2
done

php artisan migrate --force

# Cache config/routes/views for production performance
php artisan optimize

# Restart queue workers so they pick up new code
php artisan queue:restart

echo "" | sudo -S service php8.3-fpm reload
php artisan up

echo "Application Deployed!"
