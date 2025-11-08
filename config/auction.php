<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Auction Drivers
    |--------------------------------------------------------------------------
    |
    | Available drivers for collecting auction listings from various platforms.
    | Each driver should implement the AuctionDriverInterface.
    |
    */

    'drivers' => [
        'hibid' => \App\Services\Drivers\HiBidDriver::class,
        'ctbids' => \App\Services\Drivers\CTbidsDriver::class,
        'auctionninja' => \App\Services\Drivers\AuctionNinjaDriver::class,
        'ebay' => \App\Services\Drivers\EbayDriver::class,
        'manual' => \App\Services\Drivers\ManualDriver::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | eBay API Configuration
    |--------------------------------------------------------------------------
    |
    | eBay Finding API credentials and configuration. Get your credentials from:
    | https://developer.ebay.com/my/keys
    |
    */

    'ebay' => [
        'app_id' => env('EBAY_APP_ID'),
        'dev_id' => env('EBAY_DEV_ID'),
        'cert_id' => env('EBAY_CERT_ID'),
        'sandbox' => env('EBAY_SANDBOX', true),

        // Finding API endpoint
        'finding_api_url' => env('EBAY_SANDBOX', true)
            ? 'https://svcs.sandbox.ebay.com/services/search/FindingService/v1'
            : 'https://svcs.ebay.com/services/search/FindingService/v1',

        // Cache TTL for eBay market data (in seconds)
        'cache_ttl' => 86400, // 24 hours

        // Max results to fetch per search
        'max_results' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Profitability Settings
    |--------------------------------------------------------------------------
    |
    | Default values and thresholds for calculating profitability and
    | determining high-value opportunities.
    |
    */

    'profitability' => [
        // Default eBay fees percentage (includes final value fee + payment processing)
        'default_ebay_fees_percent' => 13.0,

        // Minimum ROI percentage to consider an item "high value"
        'min_roi_percent' => 40.0,

        // Minimum sell-through rate to consider an item "high value" (0.0 to 1.0)
        'min_sell_through_rate' => 0.6,

        // Default buyer's premium if not specified by source
        'default_buyer_premium_percent' => 10.0,

        // Default tax rate if not specified
        'default_tax_rate_percent' => 0.0,
    ],

    /*
    |--------------------------------------------------------------------------
    | Scoring Weights
    |--------------------------------------------------------------------------
    |
    | Weights for calculating the overall match score (0-100) for an auction listing.
    | These should add up to 1.0 (100%).
    |
    */

    'scoring' => [
        'roi_weight' => 0.5,           // 50% weight on ROI
        'sell_through_weight' => 0.3,  // 30% weight on sell-through rate
        'size_weight' => 0.2,          // 20% weight on shipping convenience
    ],

    /*
    |--------------------------------------------------------------------------
    | Collection Settings
    |--------------------------------------------------------------------------
    |
    | Default settings for automated auction collection.
    |
    */

    'collection' => [
        // Default frequency (in minutes) for collecting from sources
        'default_frequency_minutes' => 60,

        // How far back to look for auctions (in days)
        'lookback_days' => 14,

        // How far ahead to look for upcoming auctions (in days)
        'lookahead_days' => 30,

        // Maximum concurrent collection jobs
        'max_concurrent_jobs' => 3,
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Settings
    |--------------------------------------------------------------------------
    |
    | Settings for auction notifications and alerts.
    |
    */

    'notifications' => [
        // Send notifications for high-value finds
        'enabled' => env('AUCTION_NOTIFICATIONS_ENABLED', false),

        // Notification channels
        'channels' => ['mail', 'database'],

        // Hours before auction end to send reminders
        'reminder_hours' => [24, 1, 0.25], // 24 hours, 1 hour, 15 minutes
    ],

];
