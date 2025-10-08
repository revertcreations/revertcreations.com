#!/bin/bash

set -e

echo "Deploying Laravel Application..."

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

    composer install --no-interaction --no-dev --prefer-dist
    php artisan migrate --force
    php artisan optimize
    echo "" | sudo -S service php8.3-fpm reload
php artisan up

echo "Application Deployed!"
