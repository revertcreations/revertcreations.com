#!/bin/sh
set -e

echo "Deploying Laravel Application..."
(git push) || true

git checkout master
git merge development

git push origin master

git checkout development
