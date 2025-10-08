<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PuzzleSession;
use App\Models\PuzzleToken;
use App\Models\PuzzleScore;
use Illuminate\Support\Carbon;

class PuzzleSessionController extends Controller
{

    public function check($puzzle_type_id, Request $request)
    {
        $session_id = $request->session()->getId();
        $puzzle_session = PuzzleSession::where('session_id', $session_id)
            ->where('puzzle_type_id', $puzzle_type_id)
            ->first();

        if (!$puzzle_session) {
            return response()->json([
                'error' => 'session expired',
            ], 419);
        }

        $puzzle_token = new PuzzleToken;
        $new_token = $puzzle_token->generate();
        $puzzle_token->puzzle_session_id = $puzzle_session->id;
        $puzzle_token->token = $new_token;
        $puzzle_token->expires_at = Carbon::now()->addMinute();

        $puzzle_token->save();

        return response()->json(['token' => $new_token]);
    }

    public function solved($puzzle_type_id, $token, Request $request)
    {
        $session_id = $request->session()->getId();
        $puzzle_session = PuzzleSession::where('session_id', $session_id)
            ->where('puzzle_type_id', $puzzle_type_id)
            ->first();

        if (!$puzzle_session) {
            return response()->json([
                'error' => 'session expired',
            ], 419);
        }

        $puzzle_token = new PuzzleToken;
        $token_is_valid = $puzzle_token->valid($puzzle_session->id, $token);

        if (!$token_is_valid) {
            return response()->json([
                'error' => 'token invalid',
            ], 422);
        }

        // just delete the token, we will regenerate again on every check
        $puzzle_session->token()->delete();

        $content = json_decode($request->getContent());

        if (!is_object($content) ||
            !property_exists($content, 'hintCount') ||
            !property_exists($content, 'time')
        ) {
            return response()->json([
                'error' => 'invalid payload',
            ], 422);
        }

        if (
            $puzzle_session->puzzle_type_id == 1 &&
            (
                $content->hintCount == 0 ||
                $content->time <= 3.4
            )
        ) {
            return response()->json([
                'error' => "Hmmm you trying to cheat over there?",
            ], 422);
        }

        $puzzle_score = new PuzzleScore;
        $puzzle_score->puzzle_session_id = $puzzle_session->id;
        $puzzle_score->hint_count = $content->hintCount;
        $puzzle_score->solve_time_in_seconds = $content->time;

        $finalScore = $puzzle_score->calculateScore();

        $puzzle_score->score = $finalScore;
        $puzzle_score->save();

        $scores = PuzzleScore::whereHas('puzzle', function ($query) use ($puzzle_type_id) {
            $query->where('puzzle_type_id', $puzzle_type_id);
        })
            ->orderByDesc('score')
            ->orderBy('hint_count')
            ->orderBy('solve_time_in_seconds')
            ->orderBy('created_at')
            ->get(['id', 'score', 'hint_count', 'solve_time_in_seconds', 'created_at']);

        $rankIndex = $scores->search(function ($score) use ($puzzle_score) {
            return $score->id === $puzzle_score->id;
        });

        $leaderboard = $scores->take(10)->values()->map(function ($score, $index) use ($puzzle_score) {
            return [
                'rank' => $index + 1,
                'score' => (int) $score->score,
                'hint_count' => (int) $score->hint_count,
                'time' => (float) $score->solve_time_in_seconds,
                'achieved_at' => optional($score->created_at)->toIso8601String(),
                'is_current' => $score->id === $puzzle_score->id,
            ];
        });

        return response()->json([
            'success' => 'You did it, your score is: ' . $finalScore,
            'score' => $finalScore,
            'hintCount' => $puzzle_score->hint_count,
            'time' => $puzzle_score->solve_time_in_seconds,
            'leaderboard' => $leaderboard,
            'rank' => $rankIndex === false ? null : (int) ($rankIndex + 1),
            'totalPlayers' => (int) $scores->count(),
            'scoreId' => $puzzle_score->id,
        ]);
    }

}
