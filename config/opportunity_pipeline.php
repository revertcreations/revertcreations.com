<?php

return [
    'workflow_states' => [
        'sourced' => 'Sourced',
        'researching' => 'Researching',
        'outreach' => 'Reached Out',
        'interviewing' => 'Interviewing',
        'offer' => 'Offer Stage',
        'accepted' => 'Offer Accepted',
        'declined' => 'Offer Declined',
        'rejected' => 'Rejected',
        'closed' => 'Closed / On Hold',
    ],

    'public_workflow_states' => [
        'researching',
        'outreach',
        'interviewing',
        'offer',
    ],

    'default_next_steps' => [
        'sourced' => '+ research team',
        'researching' => '+ draft outreach',
        'outreach' => '+ follow up in 3 days',
        'interviewing' => '+ prep notes',
        'offer' => '+ evaluate offer',
    ],

    'ignore_on_import' => [
        'sourced',
        'declined',
        'rejected',
        'closed',
        'accepted',
    ],
];
