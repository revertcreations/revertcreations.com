<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class LocationService
{
    /**
     * User's base location (Carrboro, NC)
     */
    protected const BASE_LAT = 35.9101;
    protected const BASE_LNG = -79.0753;
    protected const BASE_ZIP = '27510';

    /**
     * Calculate distance between two points using Haversine formula
     *
     * @param float $lat1 Latitude of first point
     * @param float $lng1 Longitude of first point
     * @param float $lat2 Latitude of second point
     * @param float $lng2 Longitude of second point
     * @return int Distance in miles
     */
    public function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): int
    {
        $earthRadius = 3959; // Earth's radius in miles

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c;

        return (int) round($distance);
    }

    /**
     * Calculate distance from user's base location (Carrboro, NC)
     *
     * @param float $lat Target latitude
     * @param float $lng Target longitude
     * @return int Distance in miles
     */
    public function calculateDistanceFromBase(float $lat, float $lng): int
    {
        return $this->calculateDistance(self::BASE_LAT, self::BASE_LNG, $lat, $lng);
    }

    /**
     * Estimate distance from ZIP code (rough approximation)
     *
     * @param string $zip Target ZIP code
     * @return int|null Estimated distance in miles, or null if can't estimate
     */
    public function estimateDistanceFromZip(string $zip): ?int
    {
        // This is a very rough approximation based on ZIP code regions
        // For production, you'd want to use a geocoding service or ZIP database

        $zip = preg_replace('/[^0-9]/', '', $zip);

        if (strlen($zip) < 5) {
            return null;
        }

        $basePrefix = substr(self::BASE_ZIP, 0, 3); // 275
        $targetPrefix = substr($zip, 0, 3);

        // Same 3-digit prefix = same general area (within ~50 miles)
        if ($basePrefix === $targetPrefix) {
            return 30;
        }

        // Same state (NC ZIP codes: 27xxx-28xxx)
        if (preg_match('/^2[78]/', $zip)) {
            return 150; // Roughly within NC
        }

        // Neighboring states (SC, VA, TN, GA)
        $neighboringPrefixes = ['29', '22', '23', '24', '37', '38', '30', '31'];
        $targetPrefixShort = substr($zip, 0, 2);

        if (in_array($targetPrefixShort, $neighboringPrefixes)) {
            return 300; // Neighboring states
        }

        // Default: far away
        return 1000;
    }

    /**
     * Estimate distance from city and state
     *
     * @param string|null $city
     * @param string|null $state
     * @return int|null Estimated distance in miles
     */
    public function estimateDistanceFromCityState(?string $city, ?string $state): ?int
    {
        if (!$state) {
            return null;
        }

        $state = strtoupper(trim($state));

        // Same state
        if ($state === 'NC' || $state === 'NORTH CAROLINA') {
            // Check if same city
            if ($city && stripos($city, 'Carrboro') !== false) {
                return 0;
            }
            if ($city && stripos($city, 'Chapel Hill') !== false) {
                return 5;
            }
            if ($city && stripos($city, 'Durham') !== false) {
                return 10;
            }
            if ($city && stripos($city, 'Raleigh') !== false) {
                return 25;
            }

            // Default NC distance
            return 150;
        }

        // Neighboring states
        $neighboringStates = ['SC', 'SOUTH CAROLINA', 'VA', 'VIRGINIA', 'TN', 'TENNESSEE', 'GA', 'GEORGIA'];
        if (in_array($state, $neighboringStates)) {
            return 300;
        }

        // East coast states
        $eastCoastStates = ['MD', 'DE', 'NJ', 'PA', 'NY', 'CT', 'RI', 'MA', 'FL', 'AL', 'MS', 'LA'];
        if (in_array($state, $eastCoastStates)) {
            return 600;
        }

        // Default: far away
        return 1200;
    }

    /**
     * Parse location string and estimate distance
     *
     * @param string|null $locationString Location string like "City, State ZIP"
     * @return int|null Estimated distance in miles
     */
    public function estimateDistanceFromString(?string $locationString): ?int
    {
        if (!$locationString) {
            return null;
        }

        // Extract ZIP code if present
        if (preg_match('/\b(\d{5})\b/', $locationString, $matches)) {
            $distance = $this->estimateDistanceFromZip($matches[1]);
            if ($distance !== null) {
                return $distance;
            }
        }

        // Extract state (2-letter abbreviation or full name)
        if (preg_match('/,\s*([A-Z]{2})\b/', $locationString, $matches)) {
            $state = $matches[1];
            $city = null;

            // Try to extract city
            if (preg_match('/^([^,]+),/', $locationString, $cityMatches)) {
                $city = trim($cityMatches[1]);
            }

            return $this->estimateDistanceFromCityState($city, $state);
        }

        // Can't determine distance
        return null;
    }

    /**
     * Check if location is within driving distance
     *
     * @param int|null $distanceMiles
     * @param int $maxDrivingDistance Default 8 hours driving (~500 miles)
     * @return bool
     */
    public function isWithinDrivingDistance(?int $distanceMiles, int $maxDrivingDistance = 500): bool
    {
        if ($distanceMiles === null) {
            return false;
        }

        return $distanceMiles <= $maxDrivingDistance;
    }

    /**
     * Get driving time estimate in hours
     *
     * @param int $distanceMiles
     * @param int $avgSpeedMph Average speed (default 60mph)
     * @return float Hours of driving
     */
    public function estimateDrivingTime(int $distanceMiles, int $avgSpeedMph = 60): float
    {
        return round($distanceMiles / $avgSpeedMph, 1);
    }
}
