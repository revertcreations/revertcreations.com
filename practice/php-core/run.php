<?php

declare(strict_types=1);

error_reporting(E_ALL);

$autoloadPath = __DIR__ . '/../../vendor/autoload.php';

if (! file_exists($autoloadPath)) {
    fwrite(STDERR, "Could not find Composer autoload file at {$autoloadPath}.\n");
    fwrite(STDERR, "Run `composer install` from the project root and try again.\n");
    exit(1);
}

require $autoloadPath;

$entryScript = __DIR__ . '/workspace/main.php';

if (! file_exists($entryScript)) {
    fwrite(STDERR, "Create your practice entry script at practice/php-core/workspace/main.php\n");
    fwrite(STDERR, "and rerun `php practice/php-core/run.php`.\n");
    exit(1);
}

require $entryScript;
