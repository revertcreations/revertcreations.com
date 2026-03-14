<?php

return [
    'default_state' => 'home',
    'states' => [
        'home' => [
            'label' => 'Landing Template',
            'description' => 'Intro layout shown before puzzles unlock',
            'badge_hint' => 'home.blade.php',
            'order' => 1,
            'files' => [
                [
                    'display_name' => 'resources/views/home.blade.php',
                    'path' => resource_path('views/home.blade.php'),
                    'language' => 'blade',
                ],
            ],
        ],
        'name-element' => [
            'label' => 'NameElement component',
            'description' => 'Custom element puzzle for the hero name',
            'badge_hint' => 'NameElement.js',
            'order' => 2,
            'files' => [
                [
                    'display_name' => 'resources/js/components/NameElement.js',
                    'path' => resource_path('js/components/NameElement.js'),
                    'language' => 'javascript',
                ],
            ],
        ],
        'hint-element' => [
            'label' => 'HintElement component',
            'description' => 'Treasure-hunt drag interaction',
            'badge_hint' => 'HintElement.js',
            'order' => 3,
            'files' => [
                [
                    'display_name' => 'resources/js/components/HintElement.js',
                    'path' => resource_path('js/components/HintElement.js'),
                    'language' => 'javascript',
                ],
            ],
        ],
        'magnet' => [
            'label' => 'Magnet Mode',
            'description' => 'InteractiveElement magnet board internals',
            'badge_hint' => 'magnetLetters.js + MagnetBoard.js',
            'order' => 4,
            'files' => [
                [
                    'display_name' => 'resources/js/magnetLetters.js',
                    'path' => resource_path('js/magnetLetters.js'),
                    'language' => 'javascript',
                ],
                [
                    'display_name' => 'resources/js/MagnetBoard.js',
                    'path' => resource_path('js/MagnetBoard.js'),
                    'language' => 'javascript',
                ],
            ],
        ],
    ],
];
