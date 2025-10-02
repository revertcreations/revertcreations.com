<?php

return [
    'projects' => [
        'junkyard-watchdog' => [
            'path' => env('JUNKYARD_WATCHDOG_PATH', base_path('../junkyardwatchdog')),
            'since' => '2024-09-01',
            'build_log_sources' => [
                ['pattern' => 'docs/notes/*.md'],
            ],
        ],
        'site-relaunch' => [
            'path' => env('SITE_RELAUNCH_PATH', base_path()),
            'since' => '2024-09-01',
            'build_log_sources' => [
                ['pattern' => 'docs/notes/*.md'],
                ['pattern' => 'docs/build-log/*.md'],
            ],
        ],
        'labyrinth-golf' => [
            'path' => env('LABYRINTH_GOLF_PATH', base_path('../labyrinthgolf')),
            'since' => '2024-09-01',
            'build_log_sources' => [
                ['pattern' => 'docs/notes/*.md'],
            ],
        ],
    ],
];
