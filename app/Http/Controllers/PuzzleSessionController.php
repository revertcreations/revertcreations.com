<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PuzzleSession;
use App\Models\PuzzleToken;
use App\Models\PuzzleScore;
use Illuminate\Support\Carbon;

class PuzzleSessionController extends Controller
{

    public function check($puzzle_type_id, Request $request) {
        $session_id = $request->session()->getId();
        $puzzle_session = new PuzzleSession();
        $puzzle_session = $puzzle_session->where('session_id', $session_id)->where('puzzle_type_id', $puzzle_type_id)->first();

        // if the session expired when the puzzle was solved
        // sessions expire every 30 days, should be fine to just
        // send back a json error for frontend to window.location reload
        if (!$puzzle_session)
            return redirect()->route('home');

        // this is immediately sent back to solved post endpoint
        $puzzle_token = new PuzzleToken;
        $new_token = $puzzle_token->generate();
        $puzzle_token->puzzle_session_id = $puzzle_session->id;
        $puzzle_token->token = $new_token;
        $puzzle_token->expires_at = Carbon::now()->add(1, 'minute');

        $puzzle_token->save();

        return response()->json(['token' => $new_token]);
    }

    public function solved($puzzle_type_id, $token, Request $request) {
        $session_id = $request->session()->getId();
        $puzzle_session = new PuzzleSession;
        $puzzle_session = $puzzle_session->where('session_id', $session_id)->where('puzzle_type_id', $puzzle_type_id)->first();

        //get the PuzzleToken where token = $token and puzzle_session_id = $session_id
        $puzzle_token = new PuzzleToken;
        $token_is_valid = $puzzle_token->valid($puzzle_session->id, $token);

        // just delete the token, we will regenearte again on every check
        $puzzle_session->token()->delete();

        $content = json_decode($request->getContent());

        if (!$token_is_valid ||
            ($puzzle_session->puzzle_type_id == 1 && $content->hintCount == 0) ||
            ($puzzle_session->puzzle_type_id == 1 && $content->time <= 3.4)
        )
            return response()->json([
                'error' => "Hmmm you trying to cheat over there?",
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
