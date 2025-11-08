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
     *
     * @return array
     */
    public function collect(): array
    {
        // Manual entries are created directly through the admin interface
        return [];
    }

    /**
     * Manual driver is always available.
     *
     * @return bool
     */
    public function test(): bool
    {
        return true;
    }
}
