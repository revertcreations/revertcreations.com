<?php

namespace App\Services\Drivers;

interface AuctionDriverInterface
{
    /**
     * Collect auction listings from the source.
     *
     * @return array Array of listing data to be created/updated
     */
    public function collect(): array;

    /**
     * Test the connection/credentials for this driver.
     *
     * @return bool True if connection is successful
     */
    public function test(): bool;
}
