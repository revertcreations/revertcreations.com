<?php

namespace App\Services;

use App\Models\AuctionListing;

class AuctionScoringService
{
    /**
     * Calculate the overall match score for an auction listing (0-100)
     */
    public function calculateScore(AuctionListing $listing): float
    {
        $roiScore = $this->calculateRoiScore($listing);
        $sellThroughScore = $this->calculateSellThroughScore($listing);
        $sizeScore = $this->calculateSizeScore($listing);

        // Get weights from config
        $roiWeight = config('auction.scoring.roi_weight', 0.5);
        $sellThroughWeight = config('auction.scoring.sell_through_weight', 0.3);
        $sizeWeight = config('auction.scoring.size_weight', 0.2);

        // Calculate weighted score
        $totalScore = ($roiScore * $roiWeight)
                    + ($sellThroughScore * $sellThroughWeight)
                    + ($sizeScore * $sizeWeight);

        return round($totalScore, 2);
    }

    /**
     * Calculate ROI component of score (0-50 points, based on 50% weight)
     */
    protected function calculateRoiScore(AuctionListing $listing): float
    {
        if (!$listing->roi_percent || $listing->roi_percent <= 0) {
            return 0;
        }

        // Scale ROI to 0-100, then cap at 100
        // 100% ROI = 100 points, 200% ROI = 100 points (capped)
        $roiScore = min($listing->roi_percent, 100);

        return $roiScore;
    }

    /**
     * Calculate sell-through rate component of score (0-100 points)
     */
    protected function calculateSellThroughScore(AuctionListing $listing): float
    {
        if (!$listing->ebay_sell_through_rate) {
            return 0;
        }

        // Convert 0.0-1.0 to 0-100
        return $listing->ebay_sell_through_rate * 100;
    }

    /**
     * Calculate size/shipping convenience component of score (0-100 points)
     */
    protected function calculateSizeScore(AuctionListing $listing): float
    {
        // Local pickup only is inconvenient unless you're nearby
        if ($listing->local_pickup_only) {
            return 0;
        }

        // Score based on shipping cost
        $shippingCost = $listing->shipping_cost ?? 0;

        if ($shippingCost === 0) {
            // Unknown shipping cost - moderate score
            return 50;
        }

        // Lower shipping = higher score
        if ($shippingCost <= 10) {
            return 100; // Small, easily shippable
        }

        if ($shippingCost <= 25) {
            return 80; // Medium small item
        }

        if ($shippingCost <= 50) {
            return 60; // Medium item
        }

        if ($shippingCost <= 100) {
            return 40; // Larger item
        }

        if ($shippingCost <= 200) {
            return 20; // Heavy/bulky item
        }

        // Very expensive shipping (vehicles, large furniture)
        return 10;
    }

    /**
     * Calculate and update the match score on the listing
     */
    public function calculateAndUpdate(AuctionListing $listing): void
    {
        $score = $this->calculateScore($listing);

        $listing->update([
            'match_score' => $score,
        ]);
    }

    /**
     * Get a descriptive label for the score
     */
    public function getScoreLabel(float $score): string
    {
        if ($score >= 80) {
            return 'Excellent';
        }

        if ($score >= 60) {
            return 'Good';
        }

        if ($score >= 40) {
            return 'Fair';
        }

        if ($score >= 20) {
            return 'Poor';
        }

        return 'Very Poor';
    }

    /**
     * Get color class for score badge
     */
    public function getScoreColor(float $score): string
    {
        if ($score >= 80) {
            return 'emerald';
        }

        if ($score >= 60) {
            return 'green';
        }

        if ($score >= 40) {
            return 'yellow';
        }

        if ($score >= 20) {
            return 'orange';
        }

        return 'red';
    }
}
