<?php

namespace App\Http\Controllers;

use App\Models\AuctionListing;
use App\Models\AuctionSource;
use App\Services\EbayMarketResearchService;
use App\Services\ProfitabilityCalculator;
use App\Services\AuctionScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AdminAuctionController extends Controller
{
    public function __construct(
        protected EbayMarketResearchService $ebayService,
        protected ProfitabilityCalculator $profitabilityCalculator,
        protected AuctionScoringService $scoringService
    ) {}

    /**
     * Display a listing of auction listings with filters.
     */
    public function index(Request $request): View
    {
        $filters = [
            'status' => $request->string('status')->toString() ?: 'new',
            'source' => $request->string('source')->toString(),
            'category' => $request->string('category')->toString(),
            'search' => $request->string('search')->toString(),
            'min_roi' => $request->float('min_roi', null),
            'max_roi' => $request->float('max_roi', null),
            'min_sell_through' => $request->float('min_sell_through', null),
            'ending_soon' => $request->boolean('ending_soon', false),
            'archived' => $request->boolean('archived', false),
            'local_pickup_only' => $request->boolean('local_pickup_only', null),
        ];

        // Sorting
        $allowedSorts = ['title', 'match_score', 'roi_percent', 'auction_end', 'current_bid', 'expected_profit', 'created_at'];
        $sort = $request->string('sort')->toString();
        $filters['sort'] = in_array($sort, $allowedSorts, true) ? $sort : 'match_score';

        $direction = strtolower($request->string('direction')->toString() ?? '');
        $filters['direction'] = in_array($direction, ['asc', 'desc'], true)
            ? $direction
            : ($filters['sort'] === 'match_score' ? 'desc' : 'desc');

        // Build query
        $query = AuctionListing::query()
            ->with('auctionSource')
            ->when(!$filters['archived'], fn ($q) => $q->where('is_archived', false))
            ->when($filters['status'] && $filters['status'] !== 'all', function ($q) use ($filters) {
                return $q->where('status', $filters['status']);
            })
            ->when($filters['source'], function ($q) use ($filters) {
                return $q->whereHas('auctionSource', function ($relation) use ($filters) {
                    $relation->where('slug', $filters['source']);
                });
            })
            ->when($filters['category'], function ($q) use ($filters) {
                $category = Str::lower($filters['category']);
                return $q->where(function ($inner) use ($category) {
                    $inner->whereRaw('LOWER(category) LIKE ?', ['%'.$category.'%'])
                        ->orWhereRaw('LOWER(subcategory) LIKE ?', ['%'.$category.'%']);
                });
            })
            ->when($filters['search'], function ($q) use ($filters) {
                $term = '%'.Str::lower($filters['search']).'%';
                return $q->where(function ($inner) use ($term) {
                    $inner->whereRaw('LOWER(title) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(description) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(lot_number) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(tags) LIKE ?', [$term]);
                });
            })
            ->when(!is_null($filters['min_roi']), function ($q) use ($filters) {
                return $q->where('roi_percent', '>=', $filters['min_roi']);
            })
            ->when(!is_null($filters['max_roi']), function ($q) use ($filters) {
                return $q->where('roi_percent', '<=', $filters['max_roi']);
            })
            ->when(!is_null($filters['min_sell_through']), function ($q) use ($filters) {
                return $q->where('ebay_sell_through_rate', '>=', $filters['min_sell_through']);
            })
            ->when($filters['ending_soon'], function ($q) {
                return $q->where('auction_end', '>', now())
                    ->where('auction_end', '<=', now()->addHours(24))
                    ->orderBy('auction_end');
            })
            ->when(!is_null($filters['local_pickup_only']), function ($q) use ($filters) {
                return $q->where('local_pickup_only', $filters['local_pickup_only']);
            });

        // Apply sorting
        switch ($filters['sort']) {
            case 'title':
                $query->orderBy('title', $filters['direction']);
                break;
            case 'roi_percent':
                $query->orderBy('roi_percent', $filters['direction']);
                break;
            case 'auction_end':
                $query->orderBy('auction_end', $filters['direction']);
                break;
            case 'current_bid':
                $query->orderBy('current_bid', $filters['direction']);
                break;
            case 'expected_profit':
                $query->orderBy('expected_profit', $filters['direction']);
                break;
            case 'match_score':
            default:
                $query->orderBy('match_score', $filters['direction']);
                break;
        }

        // Secondary sort
        if (!in_array($filters['sort'], ['created_at'], true)) {
            $query->orderBy('created_at', 'desc');
        }

        $auctions = $query->paginate(20)->withQueryString();

        // Get filter options
        $sources = AuctionSource::query()->orderBy('name')->get();

        $categories = AuctionListing::query()
            ->select('category')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->map(fn ($value) => trim($value))
            ->unique()
            ->sort()
            ->values();

        $statusOptions = [
            'all' => 'All',
            AuctionListing::STATUS_NEW => 'New',
            AuctionListing::STATUS_ANALYZING => 'Analyzing',
            AuctionListing::STATUS_WATCHING => 'Watching',
            AuctionListing::STATUS_BIDDING => 'Bidding',
            AuctionListing::STATUS_WON => 'Won',
            AuctionListing::STATUS_LOST => 'Lost',
            AuctionListing::STATUS_PASSED => 'Passed',
        ];

        return view('admin.auctions.index', compact(
            'auctions',
            'sources',
            'categories',
            'filters',
            'statusOptions'
        ));
    }

    /**
     * Display the specified auction listing.
     */
    public function show(AuctionListing $auction): View
    {
        $auction->load('auctionSource');

        return view('admin.auctions.show', compact('auction'));
    }

    /**
     * Show the form for creating a new auction listing.
     */
    public function create(): View
    {
        $sources = AuctionSource::query()->orderBy('name')->get();
        $statusOptions = AuctionListing::getStatuses();

        return view('admin.auctions.create', compact('sources', 'statusOptions'));
    }

    /**
     * Store a newly created auction listing.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'auction_source_id' => 'nullable|exists:auction_sources,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'seller' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'subcategory' => 'nullable|string|max:255',
            'source_url' => 'nullable|url',
            'lot_number' => 'nullable|string|max:255',
            'current_bid' => 'nullable|numeric|min:0',
            'buy_now_price' => 'nullable|numeric|min:0',
            'reserve_price' => 'nullable|numeric|min:0',
            'reserve_met' => 'boolean',
            'shipping_cost' => 'nullable|numeric|min:0',
            'local_pickup_only' => 'boolean',
            'buyer_premium_percent' => 'nullable|numeric|min:0|max:100',
            'tax_rate_percent' => 'nullable|numeric|min:0|max:100',
            'condition' => 'nullable|string|max:255',
            'auction_start' => 'nullable|date',
            'auction_end' => 'nullable|date',
            'images' => 'nullable|string', // Comma-separated URLs
            'tags' => 'nullable|string', // Comma-separated tags
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        // Parse images and tags
        if (isset($validated['images'])) {
            $validated['images'] = array_filter(array_map('trim', explode(',', $validated['images'])));
        }
        if (isset($validated['tags'])) {
            $validated['tags'] = array_filter(array_map('trim', explode(',', $validated['tags'])));
        }

        // Set defaults from source if available
        if ($validated['auction_source_id']) {
            $source = AuctionSource::find($validated['auction_source_id']);
            $validated['buyer_premium_percent'] = $validated['buyer_premium_percent'] ?? $source->buyer_premium_percent;
            $validated['tax_rate_percent'] = $validated['tax_rate_percent'] ?? $source->tax_rate_percent;
        }

        $validated['collected_at'] = now();
        $validated['reserve_met'] = $request->boolean('reserve_met', false);
        $validated['local_pickup_only'] = $request->boolean('local_pickup_only', false);

        $auction = AuctionListing::create($validated);

        // Optionally enrich with eBay data
        if ($request->boolean('enrich_ebay', false)) {
            $this->ebayService->enrichListing($auction);
            $this->profitabilityCalculator->calculateAndUpdate($auction);
            $this->scoringService->calculateAndUpdate($auction);
        }

        return redirect()
            ->route('admin.auctions.show', $auction)
            ->with('status', 'Auction listing created successfully.');
    }

    /**
     * Show the form for editing the specified auction listing.
     */
    public function edit(AuctionListing $auction): View
    {
        $sources = AuctionSource::query()->orderBy('name')->get();
        $statusOptions = AuctionListing::getStatuses();

        return view('admin.auctions.edit', compact('auction', 'sources', 'statusOptions'));
    }

    /**
     * Update the specified auction listing.
     */
    public function update(Request $request, AuctionListing $auction): RedirectResponse
    {
        $validated = $request->validate([
            'auction_source_id' => 'nullable|exists:auction_sources,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'seller' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'subcategory' => 'nullable|string|max:255',
            'source_url' => 'nullable|url',
            'lot_number' => 'nullable|string|max:255',
            'current_bid' => 'nullable|numeric|min:0',
            'buy_now_price' => 'nullable|numeric|min:0',
            'reserve_price' => 'nullable|numeric|min:0',
            'reserve_met' => 'boolean',
            'shipping_cost' => 'nullable|numeric|min:0',
            'local_pickup_only' => 'boolean',
            'buyer_premium_percent' => 'nullable|numeric|min:0|max:100',
            'tax_rate_percent' => 'nullable|numeric|min:0|max:100',
            'condition' => 'nullable|string|max:255',
            'auction_start' => 'nullable|date',
            'auction_end' => 'nullable|date',
            'images' => 'nullable|string',
            'tags' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
            'max_bid' => 'nullable|numeric|min:0',
        ]);

        // Parse images and tags
        if (isset($validated['images'])) {
            $validated['images'] = array_filter(array_map('trim', explode(',', $validated['images'])));
        }
        if (isset($validated['tags'])) {
            $validated['tags'] = array_filter(array_map('trim', explode(',', $validated['tags'])));
        }

        $validated['reserve_met'] = $request->boolean('reserve_met', false);
        $validated['local_pickup_only'] = $request->boolean('local_pickup_only', false);

        $auction->update($validated);

        // Recalculate if costs changed
        if ($request->boolean('recalculate', false)) {
            $this->profitabilityCalculator->calculateAndUpdate($auction);
            $this->scoringService->calculateAndUpdate($auction);
        }

        return redirect()
            ->route('admin.auctions.show', $auction)
            ->with('status', 'Auction listing updated successfully.');
    }

    /**
     * Remove the specified auction listing.
     */
    public function destroy(AuctionListing $auction): RedirectResponse
    {
        $auction->update(['is_archived' => true]);

        return redirect()
            ->route('admin.auctions.index')
            ->with('status', 'Auction listing archived.');
    }

    /**
     * Add auction to watchlist.
     */
    public function watch(AuctionListing $auction): RedirectResponse
    {
        $auction->update([
            'status' => AuctionListing::STATUS_WATCHING,
            'watched_at' => now(),
        ]);

        return back()->with('status', 'Added to watchlist.');
    }

    /**
     * Remove auction from watchlist.
     */
    public function unwatch(AuctionListing $auction): RedirectResponse
    {
        $auction->update([
            'status' => AuctionListing::STATUS_NEW,
            'watched_at' => null,
        ]);

        return back()->with('status', 'Removed from watchlist.');
    }

    /**
     * Update auction status.
     */
    public function updateStatus(Request $request, AuctionListing $auction): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $auction->update($validated);

        return back()->with('status', 'Status updated.');
    }

    /**
     * Record a bid placement.
     */
    public function recordBid(Request $request, AuctionListing $auction): RedirectResponse
    {
        $validated = $request->validate([
            'max_bid' => 'required|numeric|min:0',
        ]);

        $auction->update([
            'max_bid' => $validated['max_bid'],
            'status' => AuctionListing::STATUS_BIDDING,
            'bid_placed_at' => now(),
        ]);

        return back()->with('status', 'Bid recorded successfully.');
    }

    /**
     * Refresh eBay market data for an auction.
     */
    public function refreshEbayData(AuctionListing $auction): RedirectResponse
    {
        $success = $this->ebayService->enrichListing($auction);

        if ($success) {
            $this->profitabilityCalculator->calculateAndUpdate($auction);
            $this->scoringService->calculateAndUpdate($auction);

            return back()->with('status', 'eBay market data refreshed successfully.');
        }

        return back()->with('error', 'Failed to refresh eBay data.');
    }
}
