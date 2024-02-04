<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PuzzleSession;
use App\Models\PuzzleToken;
use App\Models\PuzzleScore;
use Illuminate\Support\Carbon;

class PuzzleSessionController extends Controller
{

    public function check(PuzzleSession $puzzle_session, Request $request) {
        $session_id = $request->session()->getId();
        $puzzle_session = $puzzle_session->where('session_id', $session_id)->first();

        // if the session expired when the puzzle was solved
        // sessions expire every 30 days, should be fine to just
        // send back a json error for frontend to window.location reload
        if (!$puzzle_session)
            return response()->json(['error' => 'session expired']);

        // this is immediately sent back to solved post endpoint
        $puzzle_token = new PuzzleToken;
        $new_token = $puzzle_token->generate();
        $puzzle_token->puzzle_session_id = $puzzle_session->id;
        $puzzle_token->token = $new_token;
        $puzzle_token->expires_at = Carbon::now()->add(1, 'minute');

        $puzzle_token->save();

        return response()->json(['token' => $new_token]);
    }

    public function solved(PuzzleSession $puzzle_session, PuzzleToken $puzzle_token, Request $request) {
        $session_id = $request->session()->getId();
        $puzzle_session = $puzzle_session->where('session_id', $session_id)->first();

        $token_is_valid = $puzzle_token->valid($puzzle_session->id, $puzzle_token->token);

       // just delete the token, we will regenearte again on every check
        $puzzle_session->token()->delete();

        $content = json_decode($request->getContent());

        if (!$token_is_valid ||
            $request->headers->get('origin') != env('APP_URL') ||
            $request->headers->get('referer') != env('APP_URL')."/" ||
            ($puzzle_session->puzzle_type_id == 1 && $content->hintCount == 0) ||
            ($puzzle_session->puzzle_type_id == 1 && $content->time <= 3.4)
        )
            return response()->json([
                'error' => "Hmmm you trying to cheat over there? session: ".$session_id,
                'token' => $token_is_valid,
            ]);

        $puzzle_score = new PuzzleScore;
        $puzzle_score->puzzle_session_id = $puzzle_session->id;
        $puzzle_score->hint_count = $content->hintCount;
        $puzzle_score->solve_time_in_seconds = $content->time;

        $finalScore = $puzzle_score->calculateScore();

        $puzzle_score->score = $finalScore;
        $puzzle_score->save();

        return response()->json(['success' => 'You did it, your score is: '.$finalScore, 'score' => $finalScore, 'hintCount' => $puzzle_score->hint_count, 'time' => $puzzle_score->solve_time_in_seconds]);
    }

}
