#!/bin/bash

set -e

echo "Deploying Laravel Application..."

(php artisan down --message="The application is currently under maintenance. We will be right back!") || true
    git fetch origin deploy
    git reset --hard origin/deploy
    composer install --no-interaction --no-dev --prefer-dist
    php artisan migrate --force
    php artisan optimize
    echo "" | sudo -S service php8.3-fpm reload
php artisan up

echo "Application Deployed!"
