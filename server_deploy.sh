#!/bin/bash

set -e

echo "Deploying Laravel Application..."

# The workflow (deploy.yml) handles: artisan down, git fetch, git reset.
# This script runs AFTER the new code is already on disk.

# If anything fails, bring the app back up before exiting
trap 'echo "Deploy failed. Bringing application back up..."; php artisan up' ERR

composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader

# Clear all stale caches immediately after pulling new code
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations — wrapped so a DB outage doesn't block the rest of the deploy
set +e
php artisan migrate --force
MIGRATE_EXIT=$?
set -e

if [ $MIGRATE_EXIT -ne 0 ]; then
    echo "WARNING: Migrations failed (exit code $MIGRATE_EXIT)."
    echo "The site will come up with the current database schema."
    echo "Run 'php artisan migrate --force' manually when the database is available."
fi

# Cache config/routes/views for production performance
php artisan optimize

# Restart queue workers so they pick up new code
php artisan queue:restart

echo "" | sudo -S service php8.3-fpm reload
php artisan up

if [ $MIGRATE_EXIT -ne 0 ]; then
    echo "Application deployed WITH MIGRATION WARNING. Check database connectivity."
else
    echo "Application Deployed!"
fi
