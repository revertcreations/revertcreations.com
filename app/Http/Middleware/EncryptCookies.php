<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array
     */
    protected $except = [
        // Plain marker cookie set in the owner's and agents' browsers so
        // internal visits are excluded from aggregate funnel counters.
        'revert_internal',
    ];
}
