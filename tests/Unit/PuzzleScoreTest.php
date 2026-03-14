<?php

namespace Tests\Unit;

use App\Models\PuzzleScore;
use Tests\TestCase;

class PuzzleScoreTest extends TestCase
{
    public function test_it_rewards_fast_low_hunt_solves()
    {
        $score = PuzzleScore::calculateScoreFromMetrics(1, 6.3);

        $this->assertSame(909, $score);
    }

    public function test_it_pushes_many_hunts_and_slow_solves_near_the_floor()
    {
        $score = PuzzleScore::calculateScoreFromMetrics(12, 280.6);

        $this->assertSame(PuzzleScore::MIN_SCORE, $score);
    }

    public function test_it_caps_extremely_bad_solves_at_the_floor()
    {
        $score = PuzzleScore::calculateScoreFromMetrics(20, 500);

        $this->assertSame(PuzzleScore::MIN_SCORE, $score);
    }

    public function test_instance_calculation_uses_the_shared_curve()
    {
        $puzzleScore = new PuzzleScore([
            'hunt_count' => 4,
            'solve_time_in_seconds' => 68.9,
        ]);

        $this->assertSame(450, $puzzleScore->calculateScore());
    }
}
