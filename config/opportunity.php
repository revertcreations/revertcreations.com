<?php

return [
    'ingest' => [
        'queue' => env('OPPORTUNITY_INGEST_QUEUE', 'opportunity-ingest'),
        'aggregator_hosts' => [
            'recruiting.paylocity.com',
            'boards.greenhouse.io',
            'jobs.lever.co',
            'workable.com',
            'jobs.workable.com',
            'jobs.ashbyhq.com',
        ],
        'remote_keywords' => [
            'remote-first',
            'remote role',
            'remote team',
            '100% remote',
            'fully remote',
            'work from anywhere',
            'work-from-home',
            'distributed team',
            'remote (us)',
            'remote (usa)',
            'remote in the',
        ],
        'domain_keyword_map' => [
            'ai' => ['artificial intelligence', 'machine learning', 'ai-first', 'ai ', ' ai'],
            'insurance' => ['insurance', 'insurtech'],
            'marketplaces' => ['marketplace', 'two-sided marketplace'],
            'analytics' => ['data platform', 'analytics', 'insights platform'],
        ],
    ],
];
