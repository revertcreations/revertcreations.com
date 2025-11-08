<?php

namespace Database\Seeders;

use App\Models\AuctionSource;
use Illuminate\Database\Seeder;

class AuctionSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sources = [
            [
                'name' => 'HiBid',
                'slug' => 'hibid',
                'driver' => 'hibid',
                'base_url' => 'https://www.hibid.com',
                'enabled' => true,
                'frequency_minutes' => 360, // Run every 6 hours (large dataset)
                'buyer_premium_percent' => 10.00,
                'tax_rate_percent' => 0.00,
                'filters' => [
                    'categories' => [], // Empty = all categories
                    'max_auctions' => 5000, // Collect many auctions for market analysis
                    'max_pages' => 150, // Scrape up to 150 pages
                    'min_bid' => 0, // Collect everything
                    'max_shipping' => null,
                    'keywords' => [],
                ],
                'meta' => [
                    'description' => 'National online auction platform - comprehensive data collection for market analysis',
                    'user_location' => 'Carrboro, NC 27510',
                    'max_driving_distance_miles' => 500,
                ],
            ],
            [
                'name' => 'CTbids',
                'slug' => 'ctbids',
                'driver' => 'ctbids',
                'base_url' => 'https://www.ctbids.com',
                'enabled' => false, // Disabled until driver is built
                'frequency_minutes' => 120,
                'buyer_premium_percent' => 15.00,
                'tax_rate_percent' => 6.35, // CT sales tax
                'filters' => [
                    'categories' => [],
                    'location_radius_miles' => null,
                ],
                'meta' => [
                    'description' => 'Connecticut-based auction platform',
                ],
            ],
            [
                'name' => 'AuctionNinja',
                'slug' => 'auction-ninja',
                'driver' => 'auctionninja',
                'base_url' => 'https://www.auctionninja.com',
                'enabled' => false, // Disabled until driver is built
                'frequency_minutes' => 90,
                'buyer_premium_percent' => 10.00,
                'tax_rate_percent' => 0.00,
                'filters' => [
                    'categories' => [],
                ],
                'meta' => [
                    'description' => 'Popular online auction platform',
                ],
            ],
            [
                'name' => 'eBay Motors',
                'slug' => 'ebay-motors',
                'driver' => 'ebay',
                'base_url' => 'https://www.ebay.com/motors',
                'enabled' => false, // Disabled initially
                'frequency_minutes' => 180,
                'buyer_premium_percent' => 0.00,
                'tax_rate_percent' => 0.00,
                'filters' => [
                    'category_id' => '6000', // eBay Motors category
                    'min_price' => 100,
                    'max_price' => 10000,
                ],
                'meta' => [
                    'description' => 'eBay Motors auction listings',
                ],
            ],
            [
                'name' => 'Manual Entry',
                'slug' => 'manual',
                'driver' => 'manual',
                'base_url' => null,
                'enabled' => true,
                'frequency_minutes' => 0,
                'buyer_premium_percent' => 10.00,
                'tax_rate_percent' => 0.00,
                'filters' => null,
                'meta' => [
                    'description' => 'Manually entered auction listings',
                ],
            ],
        ];

        foreach ($sources as $sourceData) {
            AuctionSource::updateOrCreate(
                ['slug' => $sourceData['slug']],
                $sourceData
            );
        }

        $this->command->info('Auction sources seeded successfully.');
    }
}
