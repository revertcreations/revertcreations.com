<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class AuctionListing extends Model
{
    use HasFactory, SoftDeletes;

    // Status constants
    public const STATUS_NEW = 'new';
    public const STATUS_ANALYZING = 'analyzing';
    public const STATUS_WATCHING = 'watching';
    public const STATUS_BIDDING = 'bidding';
    public const STATUS_WON = 'won';
    public const STATUS_LOST = 'lost';
    public const STATUS_PASSED = 'passed';
    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'auction_source_id',
        'external_id',
        'title',
        'description',
        'seller',
        'location',
        'category',
        'subcategory',
        'source_url',
        'location_city',
        'location_state',
        'location_zip',
        'location_country',
        'distance_miles',
        'lot_number',
        'current_bid',
        'buy_now_price',
        'reserve_price',
        'reserve_met',
        'shipping_cost',
        'shipping_available',
        'local_pickup_only',
        'local_pickup_required',
        'buyer_premium_percent',
        'tax_rate_percent',
        'currency',
        'condition',
        'images',
        'tags',
        'auction_start',
        'auction_end',
        'collected_at',
        'ebay_sold_count',
        'ebay_active_count',
        'ebay_avg_price',
        'ebay_median_price',
        'ebay_sell_through_rate',
        'ebay_fees_percent',
        'total_cost',
        'expected_profit',
        'roi_percent',
        'match_score',
        'status',
        'max_bid',
        'notes',
        'watched_at',
        'bid_placed_at',
        'outcome',
        'is_archived',
    ];

    protected $casts = [
        'current_bid' => 'decimal:2',
        'buy_now_price' => 'decimal:2',
        'reserve_price' => 'decimal:2',
        'reserve_met' => 'boolean',
        'shipping_cost' => 'decimal:2',
        'shipping_available' => 'boolean',
        'local_pickup_only' => 'boolean',
        'local_pickup_required' => 'boolean',
        'buyer_premium_percent' => 'decimal:2',
        'tax_rate_percent' => 'decimal:2',
        'distance_miles' => 'integer',
        'images' => 'array',
        'tags' => 'array',
        'auction_start' => 'datetime',
        'auction_end' => 'datetime',
        'collected_at' => 'datetime',
        'ebay_sold_count' => 'integer',
        'ebay_active_count' => 'integer',
        'ebay_avg_price' => 'decimal:2',
        'ebay_median_price' => 'decimal:2',
        'ebay_sell_through_rate' => 'decimal:4',
        'ebay_fees_percent' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'expected_profit' => 'decimal:2',
        'roi_percent' => 'decimal:2',
        'match_score' => 'decimal:2',
        'max_bid' => 'decimal:2',
        'watched_at' => 'datetime',
        'bid_placed_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    /**
     * Get the auction source this listing belongs to
     */
    public function auctionSource(): BelongsTo
    {
        return $this->belongsTo(AuctionSource::class);
    }

    /**
     * Scope: Active (not archived) listings
     */
    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    /**
     * Scope: High value opportunities (good ROI and sell-through)
     */
    public function scopeHighValue($query, float $minRoi = 40.0, float $minSellThrough = 0.6)
    {
        return $query->where('roi_percent', '>=', $minRoi)
                     ->where('ebay_sell_through_rate', '>=', $minSellThrough);
    }

    /**
     * Scope: Within driving distance
     */
    public function scopeWithinDistance($query, int $maxMiles = 500)
    {
        return $query->where('distance_miles', '<=', $maxMiles)
                     ->orWhere('shipping_available', true);
    }

    /**
     * Scope: Shipping available
     */
    public function scopeShippingAvailable($query)
    {
        return $query->where('shipping_available', true);
    }

    /**
     * Scope: Purchasable (either ships or within driving distance)
     */
    public function scopePurchasable($query, int $maxDrivingMiles = 500)
    {
        return $query->where(function ($q) use ($maxDrivingMiles) {
            $q->where('shipping_available', true)
              ->orWhere('distance_miles', '<=', $maxDrivingMiles);
        });
    }

    /**
     * Scope: Ending soon (within hours)
     */
    public function scopeEndingSoon($query, int $hours = 24)
    {
        return $query->where('auction_end', '>', now())
                     ->where('auction_end', '<=', now()->addHours($hours))
                     ->orderBy('auction_end');
    }

    /**
     * Scope: Currently active auctions
     */
    public function scopeActiveAuctions($query)
    {
        return $query->where('auction_end', '>', now())
                     ->where(function ($q) {
                         $q->whereNull('auction_start')
                           ->orWhere('auction_start', '<=', now());
                     });
    }

    /**
     * Check if auction is still active
     */
    public function isActive(): bool
    {
        if (!$this->auction_end) {
            return false;
        }

        if ($this->auction_start && $this->auction_start->isFuture()) {
            return false;
        }

        return $this->auction_end->isFuture();
    }

    /**
     * Check if auction is ending soon
     */
    public function isEndingSoon(int $hours = 24): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        return $this->auction_end->lte(now()->addHours($hours));
    }

    /**
     * Get time remaining in human-readable format
     */
    public function getTimeRemainingAttribute(): ?string
    {
        if (!$this->auction_end) {
            return null;
        }

        if ($this->auction_end->isPast()) {
            return 'Ended';
        }

        return $this->auction_end->diffForHumans();
    }

    /**
     * Get primary image URL
     */
    public function getPrimaryImageAttribute(): ?string
    {
        $images = $this->images ?? [];
        return !empty($images) ? $images[0] : null;
    }

    /**
     * Get tag collection
     */
    public function tagCollection(): Collection
    {
        return collect($this->tags ?? [])
            ->map(fn ($tag) => trim((string) $tag))
            ->filter()
            ->unique()
            ->values();
    }

    /**
     * Get primary category from tags/title
     */
    public function primaryCategory(): ?string
    {
        if ($this->category) {
            return $this->category;
        }

        $tags = $this->tagCollection();
        return $tags->isNotEmpty() ? (string) $tags->first() : null;
    }

    /**
     * Calculate total cost at given bid amount
     */
    public function calculateTotalCost(?float $bidAmount = null): float
    {
        $bid = $bidAmount ?? $this->current_bid ?? 0;
        $premium = $bid * ($this->buyer_premium_percent / 100);
        $tax = $bid * ($this->tax_rate_percent / 100);
        $shipping = $this->shipping_cost ?? 0;

        return $bid + $premium + $tax + $shipping;
    }

    /**
     * Calculate expected profit at given bid amount
     */
    public function calculateExpectedProfit(?float $bidAmount = null): float
    {
        if (!$this->ebay_median_price) {
            return 0;
        }

        $totalCost = $this->calculateTotalCost($bidAmount);
        $ebayFees = $this->ebay_median_price * ($this->ebay_fees_percent / 100);
        $netRevenue = $this->ebay_median_price - $ebayFees;

        return $netRevenue - $totalCost;
    }

    /**
     * Calculate ROI percentage at given bid amount
     */
    public function calculateRoi(?float $bidAmount = null): float
    {
        $totalCost = $this->calculateTotalCost($bidAmount);

        if ($totalCost <= 0) {
            return 0;
        }

        $profit = $this->calculateExpectedProfit($bidAmount);
        return ($profit / $totalCost) * 100;
    }

    /**
     * Get all available status options
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_NEW => 'New',
            self::STATUS_ANALYZING => 'Analyzing',
            self::STATUS_WATCHING => 'Watching',
            self::STATUS_BIDDING => 'Bidding',
            self::STATUS_WON => 'Won',
            self::STATUS_LOST => 'Lost',
            self::STATUS_PASSED => 'Passed',
            self::STATUS_ARCHIVED => 'Archived',
        ];
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            self::STATUS_NEW => 'gray',
            self::STATUS_ANALYZING => 'blue',
            self::STATUS_WATCHING => 'sky',
            self::STATUS_BIDDING => 'amber',
            self::STATUS_WON => 'emerald',
            self::STATUS_LOST => 'red',
            self::STATUS_PASSED => 'slate',
            self::STATUS_ARCHIVED => 'gray',
            default => 'gray',
        };
    }
}
