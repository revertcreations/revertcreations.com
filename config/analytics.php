<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Internal traffic filters
    |--------------------------------------------------------------------------
    |
    | Provide comma-separated lists in the corresponding env vars to filter out
    | your own visits from analytics summaries. Both values are optional.
    |
    */
    'internal_ips' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('ANALYTICS_INTERNAL_IPS', ''))
    ))),

    'internal_user_agents' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('ANALYTICS_INTERNAL_USER_AGENTS', ''))
    ))),
];
