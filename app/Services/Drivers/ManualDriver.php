<?php

namespace App\Services\Drivers;

use App\Models\AuctionSource;

class ManualDriver implements AuctionDriverInterface
{
    protected AuctionSource $source;

    public function __construct(AuctionSource $source)
    {
        $this->source = $source;
    }

    /**
     * Manual entries don't have automatic collection.
     */
    public function collect(): array
    {
        // Manual entries are created directly through the admin interface
        return [];
    }

    /**
     * Manual driver is always available.
     */
    public function test(): bool
    {
        return true;
    }
}
