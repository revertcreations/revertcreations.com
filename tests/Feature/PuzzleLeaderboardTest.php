<?php

namespace Tests\Feature;

use App\Models\PuzzleScore;
use App\Models\PuzzleSession;
use App\Models\PuzzleType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PuzzleLeaderboardTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_ranked_scores_and_highlights_current_session(): void
    {
        $sessionId = 'test-session-id';
        Session::setId($sessionId);
        Session::start();

        $puzzleType = new PuzzleType();
        $puzzleType->name = 'analytics_treasure';
        $puzzleType->path = 'home';
        $puzzleType->save();

        $currentSession = PuzzleSession::create([
            'session_id' => $sessionId,
            'puzzle_type_id' => $puzzleType->id,
        ]);

        $otherSession = PuzzleSession::create([
            'session_id' => Str::uuid()->toString(),
            'puzzle_type_id' => $puzzleType->id,
        ]);

        $thirdSession = PuzzleSession::create([
            'session_id' => Str::uuid()->toString(),
            'puzzle_type_id' => $puzzleType->id,
        ]);

        $this->storeScore($otherSession, 2400, 2, 9.4);
        $this->storeScore($currentSession, 2200, 1, 11.2);
        $this->storeScore($thirdSession, 1800, 4, 18.7);

        $response = $this->withSession([])->getJson(
            route('puzzle-leaderboard', ['puzzle_type_id' => $puzzleType->id])
        );

        $response->assertOk();
        $response->assertJsonPath('totalEntries', 3);
        $response->assertJsonPath('currentRank', 2);
        $response->assertJsonPath('leaderboard.0.rank', 1);
        $response->assertJsonPath('leaderboard.0.score', 2400);
        $response->assertJsonPath('leaderboard.0.isCurrentSession', false);
        $response->assertJsonPath('leaderboard.1.rank', 2);
        $response->assertJsonPath('leaderboard.1.isCurrentSession', true);
        $response->assertJsonPath('leaderboard.1.score', 2200);
        $response->assertJsonPath('leaderboard.2.rank', 3);
    }

    private function storeScore(
        PuzzleSession $session,
        int $score,
        int $hints,
        float $time
    ): void {
        $puzzleScore = new PuzzleScore([
            'hint_count' => $hints,
            'score' => $score,
            'solve_time_in_seconds' => $time,
        ]);

        $puzzleScore->puzzle_session_id = $session->id;
        $puzzleScore->save();
    }
}
