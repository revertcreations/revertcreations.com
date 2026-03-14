<?php

return [
    'default_state' => 'home',
    'states' => [
        'home' => [
            'label' => 'Landing Page Template',
            'description' => 'Built with Laravel Blade + Tailwind, this template composes multiple Web Components (custom elements) for interactive behavior, wires source-viewer state from PHP config, and triggers Google Analytics page_view tracking in production.',
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
        'text-puzzle-element' => [
            'label' => 'TextPuzzleElement Web Component',
            'description' => 'A JavaScript custom element built on the Web Components standard that powers the hero-name interaction with reusable, encapsulated behavior.',
            'badge_hint' => 'TextPuzzleElement.js',
            'order' => 2,
            'files' => [
                [
                    'display_name' => 'resources/js/components/TextPuzzleElement.js',
                    'path' => resource_path('js/components/TextPuzzleElement.js'),
                    'language' => 'javascript',
                ],
            ],
        ],
        'hunt-element' => [
            'label' => 'HuntElement Web Component',
            'description' => 'A Web Components custom element that implements the draggable hunt/treasure interaction and emits state changes used by the source-viewer flow.',
            'badge_hint' => 'HuntElement.js',
            'order' => 3,
            'files' => [
                [
                    'display_name' => 'resources/js/components/HuntElement.js',
                    'path' => resource_path('js/components/HuntElement.js'),
                    'language' => 'javascript',
                ],
            ],
        ],
        'magnet' => [
            'label' => 'Magnet Class Internals',
            'description' => 'Magnet mode internals: MagnetLetters.js manages tokenized text/letter behavior and MagnetBoard.js handles board physics, drag interactions, and rendering orchestration.',
            'badge_hint' => 'MagnetLetters.js + MagnetBoard.js',
            'order' => 4,
            'files' => [
                [
                    'display_name' => 'resources/js/MagnetLetters.js',
                    'path' => resource_path('js/MagnetLetters.js'),
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
