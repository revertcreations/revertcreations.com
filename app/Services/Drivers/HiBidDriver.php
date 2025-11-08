<?php

namespace App\Services\Drivers;

use App\Models\AuctionSource;
use App\Services\LocationService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\DomCrawler\Crawler;

class HiBidDriver implements AuctionDriverInterface
{
    protected AuctionSource $source;
    protected LocationService $locationService;

    /**
     * HiBid base URL
     */
    protected string $baseUrl = 'https://www.hibid.com';

    /**
     * GraphQL endpoint (determined via browser dev tools inspection)
     * TODO: Verify this endpoint by inspecting network traffic in browser
     */
    protected ?string $graphqlEndpoint = null;

    /**
     * Cache for auction data to avoid redundant requests
     */
    protected array $auctionCache = [];

    public function __construct(AuctionSource $source)
    {
        $this->source = $source;
        $this->locationService = new LocationService();
    }

    /**
     * Collect auction listings from HiBid.
     *
     * Strategy: Since HiBid uses client-side JS rendering, we'll scrape the rendered HTML
     * using a headless browser approach or parse their category pages.
     *
     * @return array
     */
    public function collect(): array
    {
        $listings = [];

        try {
            $filters = $this->source->filters ?? [];
            $categories = $filters['categories'] ?? [];
            $maxAuctions = $filters['max_auctions'] ?? 50;
            $maxPages = $filters['max_pages'] ?? 150;
            $minBid = $filters['min_bid'] ?? 0;

            Log::info("Starting HiBid collection", [
                'source_id' => $this->source->id,
                'max_auctions' => $maxAuctions,
                'max_pages' => $maxPages,
            ]);

            // Strategy: Scrape the main auctions page with pagination
            $auctionIds = $this->scrapeAuctionList($maxAuctions, $maxPages);

            Log::info("Found auction IDs", [
                'count' => count($auctionIds),
            ]);

            // For each auction, scrape the catalog page
            foreach ($auctionIds as $auctionId) {
                try {
                    $auctionListings = $this->scrapeAuctionCatalog($auctionId);

                    foreach ($auctionListings as $listing) {
                        if ($listing['current_bid'] >= $minBid) {
                            $listings[] = $listing;
                        }
                    }

                    // Rate limiting
                    sleep(2); // 2 seconds between auctions
                } catch (\Exception $e) {
                    Log::warning("Failed to scrape auction", [
                        'auction_id' => $auctionId,
                        'error' => $e->getMessage(),
                    ]);
                    continue;
                }
            }

            Log::info("HiBid collection completed", [
                'source_id' => $this->source->id,
                'total_listings' => count($listings),
            ]);
        } catch (\Exception $e) {
            Log::error("HiBid collection failed", [
                'source_id' => $this->source->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }

        return $listings;
    }

    /**
     * Scrape the auctions list page to get auction IDs across all pages.
     *
     * @param int $maxAuctions
     * @param int $maxPages Maximum number of pages to scrape (default 150)
     * @return array Array of auction IDs
     */
    protected function scrapeAuctionList(int $maxAuctions = 50, int $maxPages = 150): array
    {
        $auctionIds = [];
        $page = 1;

        try {
            Log::info("Starting HiBid auction list scraping", [
                'max_auctions' => $maxAuctions,
                'max_pages' => $maxPages,
            ]);

            while ($page <= $maxPages && count($auctionIds) < $maxAuctions) {
                // Fetch the auctions page with pagination
                $url = $page === 1
                    ? "{$this->baseUrl}/auctions"
                    : "{$this->baseUrl}/auctions?page={$page}";

                $response = Http::timeout(30)->get($url);

                if (!$response->successful()) {
                    Log::warning("Failed to fetch auctions page", [
                        'page' => $page,
                        'status' => $response->status(),
                    ]);
                    break;
                }

                $crawler = new Crawler($response->body());

                $foundOnPage = 0;

                // Find auction links - they use pattern /catalog/{id}/{slug}
                $crawler->filter('a[href*="/catalog/"]')->each(function (Crawler $node) use (&$auctionIds, &$foundOnPage, $maxAuctions) {
                    if (count($auctionIds) >= $maxAuctions) {
                        return;
                    }

                    $href = $node->attr('href');
                    // Extract auction ID from URL like /catalog/478924/auction-name
                    if (preg_match('#/catalog/(\d+)/#', $href, $matches)) {
                        $auctionId = $matches[1];
                        if (!in_array($auctionId, $auctionIds)) {
                            $auctionIds[] = $auctionId;
                            $foundOnPage++;
                        }
                    }
                });

                Log::info("Scraped auction page", [
                    'page' => $page,
                    'found_on_page' => $foundOnPage,
                    'total_found' => count($auctionIds),
                ]);

                // If we found no auctions on this page, we've reached the end
                if ($foundOnPage === 0) {
                    Log::info("No more auctions found, stopping pagination", [
                        'last_page' => $page,
                    ]);
                    break;
                }

                $page++;

                // Rate limiting between page requests
                sleep(1);
            }

            Log::info("Completed auction list scraping", [
                'total_auctions' => count($auctionIds),
                'pages_scraped' => $page,
            ]);

            return array_slice($auctionIds, 0, $maxAuctions);
        } catch (\Exception $e) {
            Log::error("Failed to scrape auction list", [
                'error' => $e->getMessage(),
                'page' => $page,
            ]);

            return $auctionIds; // Return what we've collected so far
        }
    }

    /**
     * Scrape an individual auction catalog page for lot listings.
     *
     * NOTE: HiBid uses client-side rendering, so this may return empty
     * unless the page has server-rendered content. If this fails, we'll need
     * to use a headless browser (Puppeteer) or find their GraphQL endpoint.
     *
     * @param string $auctionId
     * @return array Array of listing data
     */
    protected function scrapeAuctionCatalog(string $auctionId): array
    {
        $listings = [];

        try {
            $response = Http::timeout(30)->get("{$this->baseUrl}/catalog/{$auctionId}");

            if (!$response->successful()) {
                Log::warning("Failed to fetch auction catalog", [
                    'auction_id' => $auctionId,
                    'status' => $response->status(),
                ]);
                return [];
            }

            $html = $response->body();
            $crawler = new Crawler($html);

            // Check for Apollo state data embedded in the page
            $apolloState = $this->extractApolloState($html);

            if ($apolloState) {
                // If we found Apollo state, parse it for lot data
                return $this->parseApolloStateForLots($apolloState, $auctionId);
            }

            // Fallback: Try to find lot cards in the HTML
            // (This likely won't work due to JS rendering, but worth a try)
            Log::warning("No Apollo state found for auction, may need headless browser", [
                'auction_id' => $auctionId,
            ]);

            return [];
        } catch (\Exception $e) {
            Log::error("Failed to scrape auction catalog", [
                'auction_id' => $auctionId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Extract Apollo GraphQL state from the HTML.
     *
     * @param string $html
     * @return array|null
     */
    protected function extractApolloState(string $html): ?array
    {
        // Look for <script id="hibid-state" type="application/json">
        if (preg_match('/<script[^>]*id=["\']hibid-state["\'][^>]*>(.*?)<\/script>/s', $html, $matches)) {
            try {
                $jsonData = json_decode($matches[1], true);
                if (isset($jsonData['apollo.state'])) {
                    Log::info("Found Apollo state in hibid-state script tag");
                    return $jsonData['apollo.state'];
                }
            } catch (\Exception $e) {
                Log::warning("Failed to parse hibid-state JSON", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Look for window.__APOLLO_STATE__ or similar (fallback)
        if (preg_match('/<script[^>]*>.*?window\.__APOLLO_STATE__\s*=\s*({.*?});/s', $html, $matches)) {
            try {
                return json_decode($matches[1], true);
            } catch (\Exception $e) {
                Log::warning("Failed to parse Apollo state JSON", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return null;
    }

    /**
     * Parse Apollo state data to extract lot listings.
     *
     * @param array $apolloState
     * @param string $auctionId
     * @return array
     */
    protected function parseApolloStateForLots(array $apolloState, string $auctionId): array
    {
        $listings = [];

        // Find auction data in Apollo state
        $auctionData = $this->extractAuctionData($apolloState, $auctionId);

        // Apollo state structure has objects with keys like "Lot:123456"
        foreach ($apolloState as $key => $value) {
            if (!is_array($value)) {
                continue;
            }

            // Look for Lot objects - keys start with "Lot:"
            if (isset($value['__typename']) && $value['__typename'] === 'Lot') {
                try {
                    // Only include lots that are not archived
                    $isArchived = $value['lotState']['isArchived'] ?? false;
                    if (!$isArchived) {
                        $listings[] = $this->transformApolloLot($value, $auctionId, $auctionData);
                    }
                } catch (\Exception $e) {
                    Log::debug("Failed to transform Apollo lot", [
                        'error' => $e->getMessage(),
                        'lot_key' => $key,
                    ]);
                    continue;
                }
            }
        }

        Log::info("Parsed Apollo lots", [
            'total_lots' => count($listings),
            'auction_id' => $auctionId,
        ]);

        return $listings;
    }

    /**
     * Extract auction data from Apollo state.
     *
     * @param array $apolloState
     * @param string $auctionId
     * @return array|null
     */
    protected function extractAuctionData(array $apolloState, string $auctionId): ?array
    {
        // Look for auction object in Apollo state
        $auctionKey = "Auction:{$auctionId}";

        if (isset($apolloState[$auctionKey])) {
            return $apolloState[$auctionKey];
        }

        // Search for any Auction object
        foreach ($apolloState as $key => $value) {
            if (is_array($value) && isset($value['__typename']) && $value['__typename'] === 'Auction') {
                return $value;
            }
        }

        return null;
    }

    /**
     * Transform an Apollo lot object into our listing format.
     *
     * @param array $lot
     * @param string $auctionId
     * @param array|null $auctionData
     * @return array
     */
    protected function transformApolloLot(array $lot, string $auctionId, ?array $auctionData = null): array
    {
        $lotState = $lot['lotState'] ?? [];
        $lotId = $lot['id'] ?? uniqid();

        // Extract category name from category array
        $categoryName = null;
        if (isset($lot['category']) && is_array($lot['category']) && !empty($lot['category'])) {
            $categoryName = $lot['category'][0]['categoryName'] ?? null;
        }

        // Extract location from auction data
        $locationCity = $auctionData['eventCity'] ?? null;
        $locationState = $auctionData['eventState'] ?? null;
        $locationZip = $auctionData['eventZip'] ?? null;

        // Calculate distance from user location
        $distanceMiles = null;
        if ($locationZip) {
            $distanceMiles = $this->locationService->estimateDistanceFromZip($locationZip);
        } elseif ($locationCity && $locationState) {
            $distanceMiles = $this->locationService->estimateDistanceFromCityState($locationCity, $locationState);
        }

        // Check shipping availability
        $shippingAvailable = $lot['shippingOffered'] ?? false;

        return [
            'external_id' => (string) $lotId,
            'title' => $lot['lead'] ?? $lot['description'] ?? 'Untitled',
            'description' => $lot['description'] ?? null,
            'category' => $categoryName,
            'lot_number' => $lot['lotNumber'] ?? null,
            'source_url' => "{$this->baseUrl}/lot/{$lotId}",
            'location_city' => $locationCity,
            'location_state' => $locationState,
            'location_zip' => $locationZip,
            'location_country' => 'United States',
            'distance_miles' => $distanceMiles,
            'current_bid' => (float) ($lotState['highBid'] ?? $lotState['priceRealized'] ?? 0),
            'buy_now_price' => isset($lotState['buyNow']) && $lotState['buyNow'] > 0 ? (float) $lotState['buyNow'] : null,
            'shipping_cost' => null, // Not available in lot-level Apollo state
            'shipping_available' => $shippingAvailable,
            'local_pickup_only' => !$shippingAvailable,
            'local_pickup_required' => !$shippingAvailable,
            'images' => $this->extractImagesFromApollo($lot),
            'tags' => $this->extractTagsFromApollo($lot),
            'buyer_premium_percent' => $this->source->buyer_premium_percent ?? 10.0,
            'tax_rate_percent' => $this->source->tax_rate_percent ?? 0.0,
            'status' => 'new',
            'collected_at' => now(),
        ];
    }

    /**
     * Transform a HiBid lot into our auction listing format.
     *
     * @param array $lot
     * @param array $auction
     * @return array
     */
    protected function transformListing(array $lot, array $auction): array
    {
        return [
            'external_id' => (string) $lot['id'],
            'title' => $lot['title'] ?? $lot['name'] ?? 'Untitled',
            'description' => $lot['description'] ?? null,
            'category' => $lot['category'] ?? $auction['category'] ?? null,
            'lot_number' => $lot['lot_number'] ?? null,
            'seller' => $auction['seller_name'] ?? $auction['auctioneer'] ?? null,
            'location' => $auction['location'] ?? null,
            'source_url' => "{$this->apiBaseUrl}/lot/{$lot['id']}",
            'current_bid' => (float) ($lot['current_bid'] ?? $lot['price'] ?? 0),
            'buy_now_price' => isset($lot['buy_now_price']) ? (float) $lot['buy_now_price'] : null,
            'reserve_price' => isset($lot['reserve_price']) ? (float) $lot['reserve_price'] : null,
            'reserve_met' => (bool) ($lot['reserve_met'] ?? false),
            'shipping_cost' => isset($lot['shipping_cost']) ? (float) $lot['shipping_cost'] : null,
            'local_pickup_only' => (bool) ($lot['local_pickup_only'] ?? false),
            'condition' => $lot['condition'] ?? null,
            'auction_start' => isset($auction['start_time']) ? $this->parseDate($auction['start_time']) : null,
            'auction_end' => isset($auction['end_time']) ? $this->parseDate($auction['end_time']) : null,
            'images' => $this->extractImages($lot),
            'tags' => $this->extractTags($lot, $auction),
            'buyer_premium_percent' => $this->source->buyer_premium_percent ?? $auction['buyer_premium'] ?? 10.0,
            'tax_rate_percent' => $this->source->tax_rate_percent ?? 0.0,
            'status' => 'new',
            'collected_at' => now(),
        ];
    }

    /**
     * Extract image URLs from Apollo lot data.
     *
     * @param array $lot
     * @return array
     */
    protected function extractImagesFromApollo(array $lot): array
    {
        $images = [];

        // Check for pictures array in Apollo structure
        if (isset($lot['pictures']) && is_array($lot['pictures'])) {
            foreach ($lot['pictures'] as $picture) {
                if (is_array($picture)) {
                    // Prefer fullSizeLocation, fall back to thumbnailLocation
                    $imageUrl = $picture['fullSizeLocation'] ?? $picture['thumbnailLocation'] ?? null;
                    if ($imageUrl) {
                        $images[] = $imageUrl;
                    }
                }
            }
        }

        // Check for featured picture
        if (isset($lot['featuredPicture']['fullSizeLocation'])) {
            array_unshift($images, $lot['featuredPicture']['fullSizeLocation']);
        }

        return array_unique(array_filter($images));
    }

    /**
     * Extract image URLs from lot data (generic fallback).
     *
     * @param array $lot
     * @return array
     */
    protected function extractImages(array $lot): array
    {
        $images = [];

        // Check various common image field names
        if (isset($lot['images']) && is_array($lot['images'])) {
            foreach ($lot['images'] as $image) {
                if (is_string($image)) {
                    $images[] = $image;
                } elseif (isset($image['url'])) {
                    $images[] = $image['url'];
                }
            }
        } elseif (isset($lot['image_url'])) {
            $images[] = $lot['image_url'];
        } elseif (isset($lot['thumbnail'])) {
            $images[] = $lot['thumbnail'];
        }

        return array_filter($images);
    }

    /**
     * Extract tags from Apollo lot data.
     *
     * @param array $lot
     * @return array
     */
    protected function extractTagsFromApollo(array $lot): array
    {
        $tags = [];

        // Add category as tag
        if (isset($lot['category']) && is_array($lot['category'])) {
            foreach ($lot['category'] as $category) {
                if (isset($category['categoryName'])) {
                    $tags[] = Str::slug($category['categoryName']);
                }
            }
        }

        // Add shipping offered status
        if (isset($lot['shippingOffered']) && $lot['shippingOffered']) {
            $tags[] = 'shipping-available';
        }

        return array_unique(array_filter($tags));
    }

    /**
     * Extract tags from lot and auction data (generic fallback).
     *
     * @param array $lot
     * @param array $auction
     * @return array
     */
    protected function extractTags(array $lot, array $auction): array
    {
        $tags = [];

        // Add category as tag
        if (isset($lot['category'])) {
            $tags[] = Str::slug($lot['category']);
        }

        // Add condition as tag
        if (isset($lot['condition'])) {
            $tags[] = Str::slug($lot['condition']);
        }

        // Add any existing tags
        if (isset($lot['tags']) && is_array($lot['tags'])) {
            $tags = array_merge($tags, $lot['tags']);
        }

        // Add auction house name as tag
        if (isset($auction['auctioneer'])) {
            $tags[] = Str::slug($auction['auctioneer']);
        }

        return array_unique(array_filter($tags));
    }

    /**
     * Parse date string into Carbon instance.
     *
     * @param string $date
     * @return \Illuminate\Support\Carbon|null
     */
    protected function parseDate(string $date): ?\Illuminate\Support\Carbon
    {
        try {
            return \Carbon\Carbon::parse($date);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Test the HiBid connection.
     *
     * @return bool
     */
    public function test(): bool
    {
        try {
            // Test basic connectivity to HiBid
            $response = Http::timeout(10)->get($this->baseUrl);
            return $response->successful();
        } catch (\Exception $e) {
            Log::error("HiBid connection test failed", [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}

