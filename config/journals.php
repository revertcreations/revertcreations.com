<?php

return [
    'projects' => [
        'junkyard-watchdog' => [
            'path' => env('JUNKYARD_WATCHDOG_PATH', base_path('../junkyardwatchdog')),
            'since' => '2024-09-01',
        ],
        'site-relaunch' => [
            'path' => env('SITE_RELAUNCH_PATH', base_path()),
            'since' => '2024-09-01',
        ],
    ],
];
