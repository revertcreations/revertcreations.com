<?php

namespace App\Services;

use App\Models\AuctionListing;

class ProfitabilityCalculator
{
    /**
     * Calculate profitability metrics for an auction listing at a given bid amount
     *
     * @param AuctionListing $listing
     * @param float|null $bidAmount If null, uses current_bid from listing
     * @return array{total_cost: float, expected_revenue: float, expected_profit: float, roi_percent: float}
     */
    public function calculate(AuctionListing $listing, ?float $bidAmount = null): array
    {
        $bid = $bidAmount ?? $listing->current_bid ?? 0;

        // Calculate total acquisition cost
        $buyerPremium = $bid * ($listing->buyer_premium_percent / 100);
        $tax = $bid * ($listing->tax_rate_percent / 100);
        $totalCost = $bid + $buyerPremium + $tax + ($listing->shipping_cost ?? 0);

        // Calculate expected revenue after eBay fees
        $ebayMedianPrice = $listing->ebay_median_price ?? 0;
        $ebayFees = $ebayMedianPrice * ($listing->ebay_fees_percent / 100);
        $netRevenue = $ebayMedianPrice - $ebayFees;

        // Calculate profit and ROI
        $profit = $netRevenue - $totalCost;
        $roi = $totalCost > 0 ? ($profit / $totalCost) * 100 : 0;

        return [
            'total_cost' => round($totalCost, 2),
            'expected_revenue' => round($netRevenue, 2),
            'expected_profit' => round($profit, 2),
            'roi_percent' => round($roi, 2),
        ];
    }

    /**
     * Calculate and update profitability fields on the listing model
     */
    public function calculateAndUpdate(AuctionListing $listing, ?float $bidAmount = null): void
    {
        $metrics = $this->calculate($listing, $bidAmount);

        $listing->update([
            'total_cost' => $metrics['total_cost'],
            'expected_profit' => $metrics['expected_profit'],
            'roi_percent' => $metrics['roi_percent'],
        ]);
    }

    /**
     * Calculate the maximum bid you should place to achieve a target ROI
     *
     * @param AuctionListing $listing
     * @param float $targetRoiPercent Desired ROI percentage (e.g., 40.0 for 40%)
     * @return float|null Maximum bid amount, or null if calculation not possible
     */
    public function calculateMaxBid(AuctionListing $listing, float $targetRoiPercent): ?float
    {
        if (!$listing->ebay_median_price || $listing->ebay_median_price <= 0) {
            return null;
        }

        $ebayMedianPrice = $listing->ebay_median_price;
        $ebayFees = $ebayMedianPrice * ($listing->ebay_fees_percent / 100);
        $netRevenue = $ebayMedianPrice - $ebayFees;

        $buyerPremiumRate = $listing->buyer_premium_percent / 100;
        $taxRate = $listing->tax_rate_percent / 100;
        $shippingCost = $listing->shipping_cost ?? 0;

        // Formula derived from: ROI = (netRevenue - totalCost) / totalCost
        // totalCost = bid + bid*premium + bid*tax + shipping
        // totalCost = bid * (1 + premium + tax) + shipping
        // Solving for bid:
        $targetRoi = $targetRoiPercent / 100;
        $denominator = (1 + $buyerPremiumRate + $taxRate) * (1 + $targetRoi);

        if ($denominator <= 0) {
            return null;
        }

        $maxBid = ($netRevenue - $shippingCost * (1 + $targetRoi)) / $denominator;

        return $maxBid > 0 ? round($maxBid, 2) : null;
    }

    /**
     * Determine if a listing meets profitability thresholds
     */
    public function meetsThresholds(AuctionListing $listing): bool
    {
        $minRoi = config('auction.profitability.min_roi_percent', 40.0);
        $minSellThrough = config('auction.profitability.min_sell_through_rate', 0.6);

        if (!$listing->roi_percent || $listing->roi_percent < $minRoi) {
            return false;
        }

        if (!$listing->ebay_sell_through_rate || $listing->ebay_sell_through_rate < $minSellThrough) {
            return false;
        }

        return true;
    }
}
