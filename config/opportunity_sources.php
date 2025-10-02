<?php

return [
    'keywords' => [
        'remote' => [
            'remote',
            'work from home',
            'distributed',
            'fully remote',
            '100% remote',
            'work from anywhere',
            'work-from-anywhere',
            'location independent',
            'anywhere',
            'global',
            'worldwide',
        ],
        'async' => ['async', 'asynchronous', 'no meetings'],
        'domain' => [
            'photography' => ['photo', 'photography', 'camera'],
            'videography' => ['video', 'filmmaker', 'cinema'],
            'guitar' => ['guitar', 'music', 'audio'],
            'bmx' => ['bmx', 'bike', 'cycling'],
            'skateboarding' => ['skate', 'skateboard'],
            'snowboard' => ['snowboard', 'snow sport'],
            'mountain biking' => ['mountain bike', 'mtb'],
            'creative' => ['creative', 'design', 'studio'],
        ],
    ],

    'remotive' => [
        'enabled' => true,
        'endpoint' => 'https://remotive.com/api/remote-jobs',
        'params' => [
            'category' => 'software-dev',
            'limit' => 50,
        ],
        'search_terms' => [
            'ai software engineer',
            'software engineer ai',
            'machine learning engineer',
            'prompt engineer',
            'ai engineer',
        ],
    ],

    'remoteok' => [
        'enabled' => true,
        'endpoint' => 'https://remoteok.com/api',
    ],

    'weworkremotely' => [
        'enabled' => true,
        'endpoint' => 'https://weworkremotely.com/remote-jobs.rss',
        'assume_remote' => true,
    ],

    'larajobs' => [
        'enabled' => true,
        'endpoint' => 'https://larajobs.com/feed',
    ],

    'role_includes' => [
        'software engineer',
        'ai engineer',
        'ai product',
        'full stack',
        'agent engineer',
        'agent orchestrator',
        'machine learning engineer',
        'prompt engineer',
        'software developer',
        'software development',
        'senior software engineer',
        'backend engineer',
        'fullstack engineer',
        'ml engineer',
        'ml developer',
        'generative ai',
        'llm engineer',
    ],

    'role_excludes' => [
        'recruiter',
        'sales',
        'intern',
        'contract recruiter',
        'project manager',
        'account executive',
        'contract',
        'salesforce',
        'talent acquisition',
        'bootcamp',
        'instructor',
        'teacher',
        'course',
        'training program',
    ],

    'tool_keywords' => [
        'prompt',
        'codex',
        'cursor',
        'claude',
        'langchain',
        'anthropic',
        'openai',
        'gpt',
        'llama',
    ],
];
