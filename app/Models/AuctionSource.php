<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AuctionSource extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'driver',
        'base_url',
        'enabled',
        'frequency_minutes',
        'last_ran_at',
        'last_status',
        'filters',
        'credentials',
        'meta',
        'buyer_premium_percent',
        'tax_rate_percent',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'frequency_minutes' => 'integer',
        'last_ran_at' => 'datetime',
        'filters' => 'array',
        'credentials' => 'encrypted:array',
        'meta' => 'array',
        'buyer_premium_percent' => 'decimal:2',
        'tax_rate_percent' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function (AuctionSource $source) {
            if ($source->isDirty('name') && blank($source->slug)) {
                $source->slug = $source->generateUniqueSlug($source->name);
            }
        });
    }

    /**
     * Get all auction listings for this source
     */
    public function auctionListings(): HasMany
    {
        return $this->hasMany(AuctionListing::class);
    }

    /**
     * Alias for auctionListings() for shorter syntax
     */
    public function listings(): HasMany
    {
        return $this->auctionListings();
    }

    /**
     * Get active (not archived) auction listings
     */
    public function activeListings(): HasMany
    {
        return $this->auctionListings()->where('is_archived', false);
    }

    /**
     * Generate a unique slug from a string
     */
    protected function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id ?? null)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }

    /**
     * Check if this source is due for collection
     */
    public function isDueForCollection(): bool
    {
        if (!$this->enabled) {
            return false;
        }

        if (!$this->last_ran_at) {
            return true;
        }

        return $this->last_ran_at->addMinutes($this->frequency_minutes)->isPast();
    }

    /**
     * Mark collection as started
     */
    public function markCollectionStarted(): void
    {
        $this->update([
            'last_ran_at' => now(),
            'last_status' => 'Running collection...',
        ]);
    }

    /**
     * Mark collection as completed
     */
    public function markCollectionCompleted(int $count, int $newCount = 0): void
    {
        $this->update([
            'last_status' => "Collected {$count} listings" . ($newCount > 0 ? " ({$newCount} new)" : ''),
        ]);
    }

    /**
     * Mark collection as failed
     */
    public function markCollectionFailed(string $error): void
    {
        $this->update([
            'last_status' => 'Error: ' . Str::limit($error, 200),
        ]);
    }
}
