<?php

namespace App\Services;

use App\Models\AuctionListing;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EbayMarketResearchService
{
    protected string $appId;
    protected string $apiUrl;
    protected int $cacheTtl;

    public function __construct()
    {
        $this->appId = config('auction.ebay.app_id');
        $this->apiUrl = config('auction.ebay.finding_api_url');
        $this->cacheTtl = config('auction.ebay.cache_ttl', 86400);
    }

    /**
     * Get market data for an auction listing
     */
    public function getMarketData(AuctionListing $listing): ?array
    {
        $searchQuery = $this->buildSearchQuery($listing);

        if (!$searchQuery) {
            return null;
        }

        // Try cache first
        $cacheKey = 'ebay_market_' . md5($searchQuery);

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($searchQuery) {
            try {
                $completedData = $this->searchCompletedListings($searchQuery);
                $activeData = $this->searchActiveListings($searchQuery);

                return $this->analyzeMarketData($completedData, $activeData);
            } catch (\Exception $e) {
                Log::error('eBay market research failed', [
                    'query' => $searchQuery,
                    'error' => $e->getMessage(),
                ]);

                return null;
            }
        });
    }

    /**
     * Update an auction listing with eBay market data
     */
    public function enrichListing(AuctionListing $listing): bool
    {
        $marketData = $this->getMarketData($listing);

        if (!$marketData) {
            return false;
        }

        $listing->update([
            'ebay_sold_count' => $marketData['sold_count'],
            'ebay_active_count' => $marketData['active_count'],
            'ebay_avg_price' => $marketData['avg_price'],
            'ebay_median_price' => $marketData['median_price'],
            'ebay_sell_through_rate' => $marketData['sell_through_rate'],
        ]);

        return true;
    }

    /**
     * Search completed/sold listings on eBay
     */
    public function searchCompletedListings(string $query): array
    {
        $response = $this->callFindingApi('findCompletedItems', [
            'keywords' => $query,
            'sortOrder' => 'EndTimeSoonest',
            'itemFilter' => [
                [
                    'name' => 'SoldItemsOnly',
                    'value' => 'true',
                ],
                [
                    'name' => 'Condition',
                    'value' => 'Used', // Can be made configurable
                ],
            ],
        ]);

        return $this->parseSearchResponse($response);
    }

    /**
     * Search active listings on eBay
     */
    public function searchActiveListings(string $query): array
    {
        $response = $this->callFindingApi('findItemsAdvanced', [
            'keywords' => $query,
            'sortOrder' => 'BestMatch',
        ]);

        return $this->parseSearchResponse($response);
    }

    /**
     * Call eBay Finding API
     */
    protected function callFindingApi(string $operation, array $params): array
    {
        $maxResults = config('auction.ebay.max_results', 100);

        $queryParams = [
            'OPERATION-NAME' => $operation,
            'SERVICE-VERSION' => '1.13.0',
            'SECURITY-APPNAME' => $this->appId,
            'RESPONSE-DATA-FORMAT' => 'JSON',
            'REST-PAYLOAD' => '',
            'paginationInput.entriesPerPage' => $maxResults,
        ];

        // Add custom parameters
        if (isset($params['keywords'])) {
            $queryParams['keywords'] = $params['keywords'];
        }

        if (isset($params['sortOrder'])) {
            $queryParams['sortOrder'] = $params['sortOrder'];
        }

        // Add item filters
        if (isset($params['itemFilter'])) {
            foreach ($params['itemFilter'] as $index => $filter) {
                $queryParams["itemFilter({$index}).name"] = $filter['name'];
                $queryParams["itemFilter({$index}).value"] = $filter['value'];
            }
        }

        $response = Http::timeout(30)->get($this->apiUrl, $queryParams);

        if (!$response->successful()) {
            throw new \Exception('eBay API request failed: ' . $response->status());
        }

        return $response->json();
    }

    /**
     * Parse eBay Finding API response
     */
    protected function parseSearchResponse(array $response): array
    {
        $items = [];

        // Navigate the nested eBay response structure
        if (!isset($response['findCompletedItemsResponse']) && !isset($response['findItemsAdvancedResponse'])) {
            return $items;
        }

        $responseKey = isset($response['findCompletedItemsResponse'])
            ? 'findCompletedItemsResponse'
            : 'findItemsAdvancedResponse';

        $searchResult = $response[$responseKey][0]['searchResult'][0] ?? null;

        if (!$searchResult || $searchResult['@count'] == 0) {
            return $items;
        }

        $itemList = $searchResult['item'] ?? [];

        foreach ($itemList as $item) {
            $sellingStatus = $item['sellingStatus'][0] ?? [];
            $currentPrice = $sellingStatus['currentPrice'][0]['__value__'] ?? null;

            if ($currentPrice) {
                $items[] = [
                    'item_id' => $item['itemId'][0] ?? null,
                    'title' => $item['title'][0] ?? null,
                    'price' => (float) $currentPrice,
                    'currency' => $sellingStatus['currentPrice'][0]['@currencyId'] ?? 'USD',
                    'condition' => $item['condition'][0]['conditionDisplayName'][0] ?? null,
                    'end_time' => $item['listingInfo'][0]['endTime'][0] ?? null,
                ];
            }
        }

        return $items;
    }

    /**
     * Analyze market data from sold and active listings
     */
    protected function analyzeMarketData(array $soldItems, array $activeItems): array
    {
        $soldCount = count($soldItems);
        $activeCount = count($activeItems);
        $totalCount = $soldCount + $activeCount;

        // Calculate sell-through rate
        $sellThroughRate = $totalCount > 0 ? $soldCount / $totalCount : 0;

        // Calculate price statistics from sold items
        $prices = array_column($soldItems, 'price');

        if (empty($prices)) {
            $avgPrice = null;
            $medianPrice = null;
        } else {
            $avgPrice = array_sum($prices) / count($prices);

            sort($prices);
            $count = count($prices);
            $middle = floor($count / 2);

            if ($count % 2 == 0) {
                $medianPrice = ($prices[$middle - 1] + $prices[$middle]) / 2;
            } else {
                $medianPrice = $prices[$middle];
            }
        }

        return [
            'sold_count' => $soldCount,
            'active_count' => $activeCount,
            'avg_price' => $avgPrice ? round($avgPrice, 2) : null,
            'median_price' => $medianPrice ? round($medianPrice, 2) : null,
            'sell_through_rate' => round($sellThroughRate, 4),
            'sold_items' => array_slice($soldItems, 0, 5), // Top 5 for reference
        ];
    }

    /**
     * Build search query from auction listing
     */
    protected function buildSearchQuery(AuctionListing $listing): ?string
    {
        // Start with the title
        $query = $listing->title;

        // Try to clean up the title - remove common auction jargon
        $query = preg_replace('/\b(lot|auction|estate|nr|no reserve)\b/i', '', $query);
        $query = trim(preg_replace('/\s+/', ' ', $query));

        // If we have tags, use the first few
        $tags = $listing->tagCollection();
        if ($tags->isNotEmpty()) {
            $query = $tags->take(3)->implode(' ');
        }

        return $query ?: null;
    }

    /**
     * Suggest better search terms based on listing data
     */
    public function suggestSearchTerms(AuctionListing $listing): array
    {
        $suggestions = [];

        // Main title-based search
        $suggestions[] = $this->buildSearchQuery($listing);

        // Category-specific search
        if ($listing->category) {
            $suggestions[] = $listing->category . ' ' . $this->buildSearchQuery($listing);
        }

        // Tag-based searches
        $tags = $listing->tagCollection();
        if ($tags->count() > 1) {
            $suggestions[] = $tags->take(2)->implode(' ');
        }

        return array_filter(array_unique($suggestions));
    }
}
