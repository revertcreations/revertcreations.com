<?php

namespace App\Jobs;

use App\Models\AuctionSource;
use App\Services\Drivers\AuctionDriverInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CollectAuctionListingsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 2;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 300; // 5 minutes

    /**
     * The maximum number of seconds the job can run.
     *
     * @var int
     */
    public $timeout = 600; // 10 minutes

    /**
     * The auction source to collect from.
     *
     * @var AuctionSource
     */
    protected AuctionSource $source;

    /**
     * Create a new job instance.
     */
    public function __construct(AuctionSource $source)
    {
        $this->source = $source;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("Starting auction collection", [
                'source_id' => $this->source->id,
                'source_name' => $this->source->name,
                'driver' => $this->source->driver,
            ]);

            // Mark collection as started
            $this->source->markCollectionStarted();

            // Get the appropriate driver for this source
            $driver = $this->getDriver();

            if (!$driver) {
                Log::error("No driver available for source", [
                    'source_id' => $this->source->id,
                    'driver' => $this->source->driver,
                ]);

                $this->source->markCollectionCompleted(0, 0);
                return;
            }

            // Collect listings from the source
            $listings = $driver->collect();

            Log::info("Collection completed", [
                'source_id' => $this->source->id,
                'total_listings' => count($listings),
            ]);

            $newCount = 0;

            // Process each listing
            foreach ($listings as $listingData) {
                try {
                    // Check if listing already exists
                    $existing = $this->source->listings()
                        ->where('external_id', $listingData['external_id'])
                        ->first();

                    if ($existing) {
                        // Update existing listing
                        $existing->update($listingData);
                        Log::debug("Updated existing listing", [
                            'listing_id' => $existing->id,
                            'external_id' => $listingData['external_id'],
                        ]);
                    } else {
                        // Create new listing
                        $listing = $this->source->listings()->create($listingData);
                        $newCount++;

                        Log::info("Created new listing", [
                            'listing_id' => $listing->id,
                            'external_id' => $listingData['external_id'],
                            'title' => $listing->title,
                        ]);

                        // Dispatch enrichment job for new listings
                        EnrichWithEbayDataJob::dispatch($listing)->delay(now()->addSeconds(5 * $newCount));
                    }
                } catch (\Exception $e) {
                    Log::error("Error processing listing", [
                        'source_id' => $this->source->id,
                        'external_id' => $listingData['external_id'] ?? 'unknown',
                        'error' => $e->getMessage(),
                    ]);
                    // Continue with next listing
                    continue;
                }
            }

            // Mark collection as completed
            $this->source->markCollectionCompleted(count($listings), $newCount);

            Log::info("Collection job completed successfully", [
                'source_id' => $this->source->id,
                'total' => count($listings),
                'new' => $newCount,
            ]);
        } catch (\Exception $e) {
            Log::error("Collection job failed", [
                'source_id' => $this->source->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $this->source->update([
                'last_status' => 'failed: ' . $e->getMessage(),
            ]);

            throw $e; // Re-throw to trigger retry logic
        }
    }

    /**
     * Get the appropriate driver for this source.
     */
    protected function getDriver(): ?AuctionDriverInterface
    {
        $driverClass = config("auction.drivers.{$this->source->driver}");

        if (!$driverClass || !class_exists($driverClass)) {
            return null;
        }

        return app($driverClass, ['source' => $this->source]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("CollectAuctionListingsJob failed after all retries", [
            'source_id' => $this->source->id,
            'error' => $exception->getMessage(),
        ]);

        $this->source->update([
            'last_status' => 'failed: ' . $exception->getMessage(),
        ]);
    }
}
