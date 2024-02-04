<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PuzzleSession;

class HomeController extends Controller
{
    public function index(Request $request) {

        $session_id = $request->session()->getId();

        $analytics_treasure = PuzzleSession::where('session_id', $session_id)
                                    ->where('puzzle_type_id', 1)
                                    ->first();
        if (!$analytics_treasure)
            PuzzleSession::create([
                'session_id' => $session_id,
                'puzzle_type_id' => 1,
            ]);

        return view('home');
    }
}
