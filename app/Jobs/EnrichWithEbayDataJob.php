<?php

namespace App\Jobs;

use App\Models\AuctionListing;
use App\Services\AuctionScoringService;
use App\Services\EbayMarketResearchService;
use App\Services\ProfitabilityCalculator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EnrichWithEbayDataJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 60;

    /**
     * The auction listing to enrich.
     *
     * @var AuctionListing
     */
    protected AuctionListing $auction;

    /**
     * Create a new job instance.
     */
    public function __construct(AuctionListing $auction)
    {
        $this->auction = $auction;
    }

    /**
     * Execute the job.
     */
    public function handle(
        EbayMarketResearchService $ebayService,
        ProfitabilityCalculator $profitabilityCalculator,
        AuctionScoringService $scoringService
    ): void {
        try {
            Log::info("Enriching auction listing with eBay data", [
                'auction_id' => $this->auction->id,
                'title' => $this->auction->title,
            ]);

            // Update status to analyzing
            $this->auction->update(['status' => AuctionListing::STATUS_ANALYZING]);

            // Fetch eBay market data
            $success = $ebayService->enrichListing($this->auction);

            if (!$success) {
                Log::warning("Failed to enrich auction with eBay data", [
                    'auction_id' => $this->auction->id,
                ]);

                // Reset status back to new if enrichment failed
                $this->auction->update(['status' => AuctionListing::STATUS_NEW]);
                return;
            }

            // Calculate profitability metrics
            $profitabilityCalculator->calculateAndUpdate($this->auction);

            // Calculate match score
            $scoringService->calculateAndUpdate($this->auction);

            // Update status back to new (or keep as analyzing if we want manual review)
            $this->auction->update(['status' => AuctionListing::STATUS_NEW]);

            Log::info("Successfully enriched auction listing", [
                'auction_id' => $this->auction->id,
                'match_score' => $this->auction->match_score,
                'roi_percent' => $this->auction->roi_percent,
            ]);
        } catch (\Exception $e) {
            Log::error("Error enriching auction with eBay data", [
                'auction_id' => $this->auction->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e; // Re-throw to trigger retry logic
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("EnrichWithEbayDataJob failed after all retries", [
            'auction_id' => $this->auction->id,
            'error' => $exception->getMessage(),
        ]);

        // Reset status back to new so it can be manually retried
        $this->auction->update(['status' => AuctionListing::STATUS_NEW]);
    }
}
