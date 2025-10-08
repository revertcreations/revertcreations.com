<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuzzleScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'hint_count',
        'score',
        'solve_time_in_seconds',
    ];

    public function puzzle() {
        return $this->belongsTo(PuzzleSession::class, 'puzzle_session_id');
    }

    public function puzzleType() {
        return $this->hasOne(PuzzleType::class);
    }

    public function calculateScore() {
        // Define constants
        $minScore = 1;
        $hintScale = 0.01; // scale for hints
        $timeScale = 0.01; // scale for time

        // Calculate scaled scores for hints and time
        $hintScore = max(1 - $this->hint_count * $hintScale, 0);
        $timeScore = max(1 - $this->solve_time_in_seconds * $timeScale, 0);

        // Calculate the raw score
        $rawScore = $minScore + $hintScore + $timeScore;

        // Ensure the score is within the desired range
        $finalScore = max($rawScore, $minScore);

        return round($finalScore * 1000);
    }
}
