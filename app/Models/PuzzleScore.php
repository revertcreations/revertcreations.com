<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuzzleScore extends Model
{
    use HasFactory;

    public const MIN_SCORE = 80;
    public const MAX_SCORE = 1000;

    protected const HUNT_CEILING = 12;
    protected const TIME_CEILING_SECONDS = 180;
    protected const HUNT_WEIGHT = 0.35;
    protected const TIME_WEIGHT = 0.7;

    protected $fillable = [
        'hunt_count',
        'score',
        'solve_time_in_seconds',
    ];

    public function puzzle() {
        return $this->belongsTo(PuzzleSession::class, 'puzzle_session_id');
    }

    public function puzzleType() {
        return $this->hasOne(PuzzleType::class);
    }

    public static function calculateScoreFromMetrics($huntCount, $solveTimeInSeconds)
    {
        $normalizedHunts = min(max((int) $huntCount, 0) / self::HUNT_CEILING, 1);
        $normalizedTime = min(max((float) $solveTimeInSeconds, 0) / self::TIME_CEILING_SECONDS, 1);

        $huntPerformance = pow(1 - $normalizedHunts, 2);
        $timePerformance = pow(1 - $normalizedTime, 2);

        $weightedPerformance = ($timePerformance * self::TIME_WEIGHT)
            + ($huntPerformance * self::HUNT_WEIGHT);

        return (int) round(
            self::MIN_SCORE + ((self::MAX_SCORE - self::MIN_SCORE) * ($weightedPerformance / (self::TIME_WEIGHT + self::HUNT_WEIGHT)))
        );
    }

    public static function compareForLeaderboard(self $left, self $right)
    {
        $scoreComparison = $right->calculateScore() <=> $left->calculateScore();

        if ($scoreComparison !== 0) {
            return $scoreComparison;
        }

        $huntComparison = ((int) $left->hunt_count) <=> ((int) $right->hunt_count);

        if ($huntComparison !== 0) {
            return $huntComparison;
        }

        $timeComparison = ((float) $left->solve_time_in_seconds) <=> ((float) $right->solve_time_in_seconds);

        if ($timeComparison !== 0) {
            return $timeComparison;
        }

        return optional($left->created_at)->timestamp <=> optional($right->created_at)->timestamp;
    }

    public function getScoreAttribute($value)
    {
        if ($this->solve_time_in_seconds === null) {
            return (int) round((float) $value);
        }

        return $this->calculateScore();
    }

    public function calculateScore() {
        return self::calculateScoreFromMetrics(
            $this->hunt_count,
            $this->solve_time_in_seconds
        );
    }
}
